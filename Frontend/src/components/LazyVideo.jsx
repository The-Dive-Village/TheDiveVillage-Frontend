<<<<<<< Updated upstream
import { useState, useEffect, useRef, useMemo } from 'react'
import {
  getLqipUrl,
  getOptimizedVideoPoster,
  getOptimizedVideoUrl,
  getOptimizedImageUrl,
  isMediaLoaded,
  markMediaLoaded
} from '../utils/mediaOptimizer'
=======
import { useState, useEffect, useRef } from 'react'
import { usePageVisibility } from '../hooks/usePageVisibility'
>>>>>>> Stashed changes

export default function LazyVideo({
  src,
  poster,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  preload = 'auto',
  ...props
}) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const posterImgRef = useRef(null)
  const [isInView, setIsInView] = useState(false)
<<<<<<< Updated upstream
=======
  const [isLoaded, setIsLoaded] = useState(false)
  const isVisible = usePageVisibility()
  const wasPlayingBeforeHideRef = useRef(false)
>>>>>>> Stashed changes

  // Sharp WebP/JPG poster
  const resolvedPoster = useMemo(() => {
    if (poster) {
      return getOptimizedImageUrl(poster, { width: 800 })
    }
    return getOptimizedVideoPoster(src, { width: 800 })
  }, [poster, src])

  // Check if poster was already loaded/cached in this session
  const alreadyCached = useMemo(() => isMediaLoaded(resolvedPoster), [resolvedPoster])
  const [posterLoaded, setPosterLoaded] = useState(alreadyCached)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Ultra-lightweight ~400-byte Low Quality Image Placeholder
  const lqipPoster = useMemo(() => {
    if (alreadyCached) return null
    return getLqipUrl(poster || src, { isVideo: true })
  }, [poster, src, alreadyCached])

  // Optimized video stream URL
  const optimizedVideoSrc = useMemo(() => {
    return getOptimizedVideoUrl(src, { width: 720 })
  }, [src])

  // Reset states when src changes
  useEffect(() => {
    const isCached = isMediaLoaded(resolvedPoster)
    if (isCached) {
      setPosterLoaded(true)
    }
    setIsVideoPlaying(false)
  }, [src, poster, resolvedPoster])

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
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
<<<<<<< Updated upstream
            const video = videoRef.current
            if (video && autoPlayRef.current) {
              video.muted = true
              video.defaultMuted = true
              video.volume = 0
              video.play().catch(() => {})
=======
            if (videoRef.current && autoPlayRef.current && isVisible) {
              videoRef.current.play().catch(() => {})
>>>>>>> Stashed changes
            }
          } else {
            setIsInView(false)
            if (videoRef.current) {
              videoRef.current.pause()
            }
          }
        })
      },
      { rootMargin: '150px 50px', threshold: 0.05 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isVisible])

  // Start video playback when in view if autoPlay is true
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
            if (video.currentTime > 0) {
              setIsVideoPlaying(true)
            }
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

  // Handle user gestures (touch/click/hover) to unlock playback
  const handleUserGesture = () => {
    const video = videoRef.current
<<<<<<< Updated upstream
    if (video && video.paused) {
=======
    if (autoPlay && video && isInView && isVisible) {
>>>>>>> Stashed changes
      video.muted = true
      video.defaultMuted = true
      video.volume = 0
      video.play().catch(() => {})
    }
  }

<<<<<<< Updated upstream
  const handlePosterSuccess = () => {
    setPosterLoaded(true)
    markMediaLoaded(resolvedPoster)
=======
  const handleMouseEnter = () => {
    if (videoRef.current && isVisible) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }
>>>>>>> Stashed changes
  }

  const fitClass = className.includes('object-contain') ? 'object-contain' : 'object-cover'

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleUserGesture}
      onTouchStart={handleUserGesture}
      onClick={handleUserGesture}
      className={`${className.includes('absolute') ? '' : 'relative'} overflow-hidden bg-[#00172b] ${className}`}
    >
      {/* 1. Low Quality Image Placeholder: Instant 400-byte blurred frame at second 0 */}
      {/* Stays permanently mounted underneath at z-0 while poster loads. NEVER unmounts until covered. */}
      {lqipPoster && !alreadyCached && (
        <img
          src={lqipPoster}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={`absolute inset-0 w-full h-full ${fitClass} filter blur-[10px] scale-110 pointer-events-none z-0`}
        />
      )}

      {/* 2. Crisp WebP/JPG Poster Frame: Sits directly on top at z-[1] */}
      {resolvedPoster && (
        <img
          ref={posterImgRef}
          src={resolvedPoster}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={handlePosterSuccess}
          className={`absolute inset-0 w-full h-full ${fitClass} z-[1] pointer-events-none ${
            posterLoaded ? 'opacity-100' : 'opacity-0'
          } ${alreadyCached ? '' : 'transition-opacity duration-300 ease-out'}`}
        />
      )}

      {/* 3. HTML5 Video Element (Fades in ONLY when actual playback begins) */}
      {isInView && src && (
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
            }
            if (typeof props.ref === 'function') {
              props.ref(el)
            } else if (props.ref && typeof props.ref === 'object') {
              props.ref.current = el
            }
          }}
<<<<<<< Updated upstream
          src={optimizedVideoSrc || src}
          poster={resolvedPoster || undefined}
          autoPlay={autoPlay}
=======
          src={src || null}
          poster={poster || null}
          autoPlay={autoPlay && isVisible}
>>>>>>> Stashed changes
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          webkit-playsinline=""
          x5-playsinline=""
          controls={controls}
          preload={preload}
          onPlaying={() => setIsVideoPlaying(true)}
          onTimeUpdate={(e) => {
            if (e.currentTarget.currentTime > 0.05) {
              setIsVideoPlaying(true)
            }
          }}
          onPause={() => {
            if (videoRef.current && videoRef.current.currentTime === 0) {
              setIsVideoPlaying(false)
            }
          }}
          className={`w-full h-full ${fitClass} transition-opacity duration-300 ease-out relative z-[2] ${
            isVideoPlaying ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
    </div>
  )
}
