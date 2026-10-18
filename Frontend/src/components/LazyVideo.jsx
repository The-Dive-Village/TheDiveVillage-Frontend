import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  getLqipUrl,
  getOptimizedVideoPoster,
  getOptimizedVideoUrl,
  getOptimizedImageUrl,
  isMediaLoaded,
  markMediaLoaded
} from '../utils/mediaOptimizer'
import {
  isVideoCached,
  markVideoCached,
  cacheVideoOnce
} from '../utils/videoCacheManager'
import { usePageVisibility } from '../hooks/usePageVisibility'

// Session cache of video first-frame blur snapshots (in-memory + sessionStorage)
const videoBlurCache = new Map()

function getCachedVideoBlur(src) {
  if (!src) return null
  if (videoBlurCache.has(src)) return videoBlurCache.get(src)
  try {
    const s = sessionStorage.getItem(`tdv_vb_${src}`)
    if (s) {
      videoBlurCache.set(src, s)
      return s
    }
  } catch {}
  return null
}

function getVideoThemeGradient(src = '') {
  const s = src.toLowerCase()
  if (s.includes('beach') || s.includes('surface')) {
    return 'from-[#0d3446] via-[#1b585c] to-[#0b242e]'
  }
  if (s.includes('clownfish') || s.includes('anemone')) {
    return 'from-[#0b2c3d] via-[#1a4a4f] to-[#0a1e28]'
  }
  if (s.includes('turtle') || s.includes('sponge') || s.includes('seafan')) {
    return 'from-[#04243a] via-[#093e56] to-[#021828]'
  }
  if (s.includes('shark') || s.includes('manta') || s.includes('barracuda') || s.includes('eel') || s.includes('stingray')) {
    return 'from-[#021828] via-[#072f4a] to-[#01111e]'
  }
  return 'from-[#00172b] via-[#042845] to-[#001122]'
}

export default function LazyVideo({
  src,
  poster,
  className = '',
  videoClassName = '',
  autoPlay = true,
  loop = true,
  muted = true,
  defaultMuted,
  playsInline = true,
  controls = false,
  controlsList,
  disablePictureInPicture,
  preload: explicitPreload,
  playbackRate = 1,
  ...props
}) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const posterImgRef = useRef(null)
  const [isInView, setIsInView] = useState(false)
  const isVisible = usePageVisibility()
  const wasPlayingBeforeHideRef = useRef(false)

  // Clean Cloudinary/R2 video stream URL without #t=0.001 temporal seeking stall
  const optimizedVideoSrc = useMemo(() => {
    const raw = getOptimizedVideoUrl(src) || src
    return raw || ''
  }, [src])

  // Sharp WebP/JPG poster
  const resolvedPoster = useMemo(() => {
    if (poster) {
      return getOptimizedImageUrl(poster, { width: 800 })
    }
    return getOptimizedVideoPoster(src, { width: 800 })
  }, [poster, src])

  // Check if video or poster was already loaded/cached in this session
  const isVideoAlreadyCached = useMemo(() => {
    return isVideoCached(src) || isMediaLoaded(src) || isMediaLoaded(optimizedVideoSrc)
  }, [src, optimizedVideoSrc])

  // Sticky flag: once the video has ever entered view or was cached, keep it mounted
  // in the DOM forever so its decoded frame is retained without re-fetching or flashing blank.
  const [hasEverBeenInView, setHasEverBeenInView] = useState(() => isVideoAlreadyCached)

  const [hasFrame, setHasFrame] = useState(isVideoAlreadyCached)
  const [cachedBlur, setCachedBlur] = useState(() => getCachedVideoBlur(src))

  // Lightweight metadata preloading until actively intersecting the viewport (vital for mobile data & CPU)
  const effectivePreload = explicitPreload ?? (isInView ? 'auto' : 'metadata')

  const alreadyCachedPoster = useMemo(() => isMediaLoaded(resolvedPoster), [resolvedPoster])
  const [posterLoaded, setPosterLoaded] = useState(alreadyCachedPoster || isVideoAlreadyCached)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Ultra-lightweight ~400-byte Low Quality Image Placeholder
  const lqipPoster = useMemo(() => {
    if (alreadyCachedPoster || isVideoAlreadyCached || hasEverBeenInView) return null
    return getLqipUrl(poster || src, { isVideo: true })
  }, [poster, src, alreadyCachedPoster, isVideoAlreadyCached, hasEverBeenInView])

  // Reset states when src changes
  useEffect(() => {
    const cached = isVideoCached(src) || isMediaLoaded(src) || isMediaLoaded(optimizedVideoSrc)
    if (cached) {
      setHasFrame(true)
      setPosterLoaded(true)
      setHasEverBeenInView(true)
    } else {
      const isPosterCached = isMediaLoaded(resolvedPoster)
      if (isPosterCached) {
        setPosterLoaded(true)
      }
    }
    setCachedBlur(getCachedVideoBlur(src))
    setIsVideoPlaying(false)
  }, [src, poster, resolvedPoster, optimizedVideoSrc])

  const captureFrameBlur = (videoEl) => {
    if (!videoEl || !src || videoBlurCache.has(src)) return
    if (videoEl.readyState < 2 && (!videoEl.currentTime || videoEl.currentTime < 0.01)) return
    try {
      if (videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
        const canvas = document.createElement('canvas')
        canvas.width = 40
        canvas.height = Math.max(20, Math.round((40 * videoEl.videoHeight) / videoEl.videoWidth))
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.25)
          videoBlurCache.set(src, dataUrl)
          setCachedBlur(dataUrl)
          try {
            sessionStorage.setItem(`tdv_vb_${src}`, dataUrl)
          } catch {}
        }
      }
    } catch {}
  }

  // Check if poster is in browser cache on mount
  useEffect(() => {
    if (posterImgRef.current && posterImgRef.current.complete && posterImgRef.current.naturalWidth > 0 && !posterLoaded) {
      setPosterLoaded(true)
      markMediaLoaded(resolvedPoster)
    }
  }, [resolvedPoster, posterLoaded])

  const autoPlayRef = useRef(autoPlay)
  useEffect(() => {
    autoPlayRef.current = autoPlay
  }, [autoPlay])

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true)
      setHasEverBeenInView(true)
      return
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
    const rootMargin = isMobile ? '120px 20px' : '250px 80px'

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            setHasEverBeenInView(true)
            if (videoRef.current && autoPlayRef.current && isVisible) {
              videoRef.current.play().catch(() => {})
            }
          } else {
            setIsInView(false)
            // Pause playback when scrolled out of view to save CPU/battery.
            // DO NOT unmount: keeping the video element in DOM keeps its decoded
            // frame and cache intact so it never flashes or disappears when scrolling back up.
            if (videoRef.current) {
              videoRef.current.pause()
            }
          }
        })
      },
      { rootMargin, threshold: 0.01 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [isVisible])

  // Start video playback when in view if autoPlay is true and tab is visible
  useEffect(() => {
    const video = videoRef.current
    if (isInView && video && autoPlay && isVisible) {
      video.muted = true
      video.defaultMuted = true
      video.volume = 0
      video.setAttribute('muted', '')
      video.setAttribute('playsinline', '')
      video.setAttribute('webkit-playsinline', '')

      const attemptPlay = () => {
        const p = video.play()
        if (p !== undefined) {
          p.then(() => {
            setIsVideoPlaying(true)
          }).catch(() => {})
        }
      }

      attemptPlay()
    }
  }, [isInView, autoPlay, src, isVisible])

  // Pause video when tab becomes hidden; resume when visible if in view
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!isVisible) {
      wasPlayingBeforeHideRef.current = !video.paused
      video.pause()
    } else {
      if (wasPlayingBeforeHideRef.current && isInView && autoPlay) {
        video.muted = true
        video.defaultMuted = true
        video.play().catch(() => {})
      }
    }
  }, [isVisible, isInView, autoPlay])

  // Ensure custom playbackRate is maintained
  useEffect(() => {
    const video = videoRef.current
    if (video && playbackRate && playbackRate !== 1) {
      video.playbackRate = playbackRate
    }
  }, [playbackRate, isInView, src])

  // Active check if video element already has dimensions or frames loaded
  useEffect(() => {
    const video = videoRef.current
    if (video && (video.readyState >= 1 || video.videoWidth > 0)) {
      handleFrameSuccess(video)
    }
  }, [isInView, src, optimizedVideoSrc])

  // Handle user gestures (touch/click/hover) to unlock playback
  const handleUserGesture = () => {
    const video = videoRef.current
    if (autoPlay && video && isInView && isVisible) {
      video.muted = true
      video.defaultMuted = true
      video.volume = 0
      if (playbackRate && playbackRate !== 1) {
        video.playbackRate = playbackRate
      }
      video.play().catch(() => {})
    }
  }

  const applyPlaybackRate = (e) => {
    const el = e?.currentTarget || videoRef.current
    if (el && playbackRate && playbackRate !== 1) {
      el.playbackRate = playbackRate
    }
  }

  const handlePosterSuccess = () => {
    setPosterLoaded(true)
    markMediaLoaded(resolvedPoster)
  }

  const handleFrameSuccess = useCallback((videoEl) => {
    if (!videoEl) return
    applyPlaybackRate({ currentTarget: videoEl })
    setIsVideoPlaying(true)
    setHasFrame(true)
    setPosterLoaded(true)
    markMediaLoaded(src)
    if (optimizedVideoSrc) markMediaLoaded(optimizedVideoSrc)
    markVideoCached(src)
    cacheVideoOnce(src).catch(() => {})
    captureFrameBlur(videoEl)
  }, [src, optimizedVideoSrc, playbackRate])

  const fitClass = className.includes('object-contain') ? 'object-contain' : 'object-cover'

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleUserGesture}
      onTouchStart={handleUserGesture}
      onClick={handleUserGesture}
      className={`${className.includes('absolute') ? '' : 'relative'} overflow-hidden bg-[#00172b] ${className}`}
    >
      {/* 1. Real Blur-up Frame (Cached video frame or LQIP poster, identical to SafeImage) */}
      {(cachedBlur || (lqipPoster && !alreadyCachedPoster && !isVideoAlreadyCached && !hasEverBeenInView)) && (
        <img
          src={cachedBlur || lqipPoster}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={`absolute inset-0 w-full h-full ${fitClass} filter blur-[10px] scale-110 pointer-events-none z-0 ${
            isVideoAlreadyCached || hasEverBeenInView ? 'opacity-0' : 'transition-opacity duration-300 ease-out'
          } ${hasFrame || isVideoPlaying || hasEverBeenInView ? 'opacity-0' : 'opacity-100'}`}
        />
      )}

      {/* 2. Thematic Oceanic Blur Skeleton (Shown while first frame is downloading before any cached blur exists) */}
      {!hasFrame && !isVideoPlaying && !posterLoaded && !cachedBlur && !isVideoAlreadyCached && !hasEverBeenInView && (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${getVideoThemeGradient(src)} filter blur-[14px] scale-110`} />
          <div className="absolute inset-0 w-full h-full skeleton-shimmer-dark opacity-60" />
        </div>
      )}

      {/* 3. Crisp WebP/JPG Poster Frame: Sits directly on top at z-[1] */}
      {resolvedPoster && (
        <img
          ref={posterImgRef}
          src={resolvedPoster}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={handlePosterSuccess}
          className={`absolute inset-0 w-full h-full ${fitClass} z-[1] pointer-events-none ${
            posterLoaded && !isVideoPlaying ? 'opacity-100' : 'opacity-0'
          } ${alreadyCachedPoster || isVideoAlreadyCached || hasEverBeenInView ? '' : 'transition-opacity duration-300 ease-out'}`}
        />
      )}

      {/* 4. HTML5 Video Element (Kept mounted once loaded or cached so frame never unloads or disappears on scroll) */}
      {(isInView || hasEverBeenInView || isVideoAlreadyCached) && src && (
        <video
          ref={(el) => {
            videoRef.current = el
            if (el) {
              el.muted = true
              el.defaultMuted = true
              el.volume = 0
              el.setAttribute('muted', '')
              el.setAttribute('playsinline', '')
              el.setAttribute('webkit-playsinline', '')
              if (playbackRate && playbackRate !== 1) {
                el.playbackRate = playbackRate
              }
              if (el.readyState >= 1 || el.videoWidth > 0) {
                handleFrameSuccess(el)
              }
            }
            if (typeof props.ref === 'function') {
              props.ref(el)
            } else if (props.ref && typeof props.ref === 'object') {
              props.ref.current = el
            }
          }}
          src={optimizedVideoSrc || src}
          poster={resolvedPoster || undefined}
          autoPlay={autoPlay && isVisible}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          webkit-playsinline=""
          x5-playsinline=""
          crossOrigin="anonymous"
          controls={controls}
          controlsList={controlsList}
          disablePictureInPicture={disablePictureInPicture}
          preload={isVideoAlreadyCached ? 'auto' : effectivePreload}
          onPlaying={(e) => {
            handleFrameSuccess(e.currentTarget)
            props.onPlaying?.(e)
          }}
          onPlay={(e) => {
            handleFrameSuccess(e.currentTarget)
            props.onPlay?.(e)
          }}
          onLoadedData={(e) => {
            handleFrameSuccess(e.currentTarget)
            props.onLoadedData?.(e)
          }}
          onLoadedMetadata={(e) => {
            handleFrameSuccess(e.currentTarget)
            props.onLoadedMetadata?.(e)
          }}
          onCanPlay={(e) => {
            handleFrameSuccess(e.currentTarget)
            props.onCanPlay?.(e)
          }}
          onTimeUpdate={(e) => {
            if (e.currentTarget.currentTime > 0.05) {
              handleFrameSuccess(e.currentTarget)
            }
            props.onTimeUpdate?.(e)
          }}
          onPause={(e) => {
            // Keep frame visible when paused; do not clear frame status
            props.onPause?.(e)
          }}
          className={`absolute inset-0 w-full h-full ${fitClass} ${
            isVideoAlreadyCached || hasEverBeenInView ? '' : 'transition-opacity duration-300 ease-out'
          } z-[2] ${!resolvedPoster || isVideoPlaying || hasFrame || isVideoAlreadyCached || hasEverBeenInView ? 'opacity-100' : 'opacity-0'} ${videoClassName}`}
          style={{ objectFit: fitClass === 'object-contain' ? 'contain' : 'cover' }}
          {...props}
        />
      )}
    </div>
  )
}
