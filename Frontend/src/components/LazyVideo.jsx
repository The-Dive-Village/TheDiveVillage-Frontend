import { useState, useEffect, useRef } from 'react'

export default function LazyVideo({
  src,
  poster,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  preload = 'metadata',
  ...props
}) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [isInView, setIsInView] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Reset loaded state whenever src changes
  useEffect(() => {
    setIsLoaded(false)
  }, [src])

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
            if (videoRef.current && autoPlayRef.current) {
              videoRef.current.play().catch(() => {})
            }
          } else {
            if (videoRef.current) {
              videoRef.current.pause()
            }
          }
        })
      },
      { rootMargin: '200px 0px', threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Actively start video playback whenever in view or src changes
  useEffect(() => {
    const video = videoRef.current
    if (isInView && video && autoPlay) {
      video.muted = true
      video.defaultMuted = true
      video.setAttribute('muted', '')
      video.setAttribute('playsinline', '')

      const attemptPlay = () => {
        if (video.readyState >= 2 || video.currentTime > 0) {
          setIsLoaded(true)
        }
        const p = video.play()
        if (p !== undefined) {
          p.then(() => setIsLoaded(true)).catch(() => {})
        }
      }

      attemptPlay()
    }
  }, [isInView, autoPlay, src])

  const handleMediaReady = () => {
    setIsLoaded(true)
    const video = videoRef.current
    if (autoPlay && video && isInView) {
      video.muted = true
      video.defaultMuted = true
      video.play().catch(() => {})
    }
  }

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`relative overflow-hidden ${className}`}
    >
      {isInView && src && (
        <video
          ref={(el) => {
            videoRef.current = el
            if (el) {
              el.muted = true
              el.defaultMuted = true
              el.setAttribute('muted', '')
              el.setAttribute('playsinline', '')
              if (el.readyState >= 2 || el.currentTime > 0) {
                setIsLoaded(true)
              }
            }
          }}
          src={src || null}
          poster={poster || null}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          controls={controls}
          preload={preload}
          onLoadedMetadata={handleMediaReady}
          onLoadedData={handleMediaReady}
          onCanPlay={handleMediaReady}
          onPlaying={() => setIsLoaded(true)}
          onTimeUpdate={(e) => {
            if (e.currentTarget.currentTime > 0) setIsLoaded(true)
          }}
          className={`w-full h-full ${
            className.includes('object-contain') ? 'object-contain' : 'object-cover'
          } transition-opacity duration-500 ${
            isLoaded || !poster ? 'opacity-100 z-10' : 'opacity-90 z-10'
          }`}
          {...props}
        />
      )}
      {!isLoaded && poster && (
        <img
          src={poster || null}
          alt=""
          loading="lazy"
          className={`absolute inset-0 w-full h-full ${
            className.includes('object-contain') ? 'object-contain' : 'object-cover'
          } z-0 pointer-events-none transition-opacity duration-300`}
        />
      )}
    </div>
  )
}


