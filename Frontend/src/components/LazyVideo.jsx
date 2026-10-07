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
          } else {
            if (videoRef.current) {
              videoRef.current.pause()
            }
          }
        })
      },
      { rootMargin: '400px 0px', threshold: 0.05 }
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

  const handleMediaReady = (e) => {
    setIsLoaded(true)
    if (autoPlay && e.currentTarget) {
      e.currentTarget.muted = true
      e.currentTarget.play().catch(() => {})
    }
  }

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden ${className}`}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '100% 100%' }}
    >
      {isInView && src && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          defaultMuted={true}
          playsInline={playsInline}
          controls={controls}
          preload="auto"
          onLoadedMetadata={handleMediaReady}
          onLoadedData={handleMediaReady}
          onCanPlay={handleMediaReady}
          onPlaying={() => setIsLoaded(true)}
          onTimeUpdate={(e) => {
            if (e.currentTarget.currentTime > 0) setIsLoaded(true)
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded || !poster ? 'opacity-100 relative z-10' : 'opacity-0 relative z-0'
          }`}
          {...props}
        />
      )}
      {!isLoaded && poster && (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
    </div>
  )
}

