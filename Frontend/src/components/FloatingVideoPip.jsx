import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { isVideoCached, markVideoCached, cacheVideoOnce } from '../utils/videoCacheManager'

/**
 * FloatingVideoPip - Pure Picture-in-Picture floating video player
 * Strictly no text overlays, controls, scrubber, or icons - just the pristine video stream.
 */
export default function FloatingVideoPip({
  videoSrc,
  fallbackSrc,
  poster,
  onClose,
  isPaused = false,
}) {
  const videoRef = useRef(null)
  const [currentSrc, setCurrentSrc] = useState(videoSrc)
  const [triedFallback, setTriedFallback] = useState(false)
  const isCached = isVideoCached(videoSrc)
  const [isPlayingSmoothly, setIsPlayingSmoothly] = useState(isCached)

  // Update src when videoSrc prop changes
  useEffect(() => {
    setCurrentSrc(videoSrc)
    setTriedFallback(false)
    setIsPlayingSmoothly(isVideoCached(videoSrc))
  }, [videoSrc])

  // Coordinate playback and pause states
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isPaused) {
      video.pause()
      return
    }

    video.muted = true
    video.defaultMuted = true
    video.volume = 0

    let rvfcId = null
    let frameCount = 0
    let isCancelled = false

    const onFrame = () => {
      if (isCancelled) return
      frameCount++
      if (frameCount >= 2 || isVideoCached(currentSrc)) {
        setIsPlayingSmoothly(true)
        markVideoCached(currentSrc)
        cacheVideoOnce(currentSrc).catch(() => {})
      } else if (video.requestVideoFrameCallback) {
        rvfcId = video.requestVideoFrameCallback(onFrame)
      }
    }

    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (isCancelled) return
          if (video.requestVideoFrameCallback) {
            rvfcId = video.requestVideoFrameCallback(onFrame)
          } else {
            const checkTime = () => {
              if (isCancelled) return
              if (video.currentTime > 0.05) {
                setIsPlayingSmoothly(true)
                markVideoCached(currentSrc)
                cacheVideoOnce(currentSrc).catch(() => {})
              } else if (!video.paused) {
                requestAnimationFrame(checkTime)
              }
            }
            requestAnimationFrame(checkTime)
          }
        })
        .catch(() => {})
    }

    return () => {
      isCancelled = true
      if (rvfcId && video.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(rvfcId)
      }
    }
  }, [currentSrc, isPaused])

  const handleVideoError = () => {
    if (!triedFallback && fallbackSrc && fallbackSrc !== currentSrc) {
      setTriedFallback(true)
      setCurrentSrc(fallbackSrc)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="pip-pure-video"
        initial={{ opacity: 0, scale: 0.88, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        drag
        dragMomentum={false}
        onTap={() => onClose?.()}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] w-[calc(100vw-32px)] max-w-[320px] xs:max-w-[340px] sm:w-[360px] aspect-video rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(255,205,0,0.2)] border-2 border-[#FFCD00] overflow-hidden bg-black select-none cursor-grab active:cursor-grabbing group"
        title="Tap to close"
      >
        {/* Poster fallback image while buffering */}
        {poster && (
          <img
            src={poster}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none z-0 ${
              isPlayingSmoothly ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}

        {/* Pure Video Element - Strictly just the video */}
        <video
          ref={videoRef}
          src={currentSrc}
          poster={poster || undefined}
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline=""
          x5-playsinline=""
          crossOrigin="anonymous"
          preload="auto"
          disableRemotePlayback
          disablePictureInPicture
          onError={handleVideoError}
          onWaiting={() => setIsPlayingSmoothly(false)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-10 pointer-events-none ${
            isPlayingSmoothly ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Subtle close button in corner on hover; or tap/click pip directly to close */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClose?.()
          }}
          className="absolute top-2 right-2 z-30 p-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white transition-opacity duration-200 opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
          title="Close"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
