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
    if (isInView && videoRef.current && autoPlay) {
      videoRef.current.muted = true
      videoRef.current.defaultMuted = true
      const p = videoRef.current.play()
      if (p !== undefined) {
        p.catch(() => {})
      }
    }
  }, [isInView, autoPlay, src])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {isInView && (
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
          onLoadedMetadata={() => setIsLoaded(true)}
          onLoadedData={(e) => {
            setIsLoaded(true)
            if (autoPlay) e.currentTarget.play().catch(() => {})
          }}
          onCanPlay={(e) => {
            setIsLoaded(true)
            if (autoPlay) e.currentTarget.play().catch(() => {})
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded || !poster ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
      {!isLoaded && poster && (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  )
}

