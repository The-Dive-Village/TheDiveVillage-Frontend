import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  PictureInPicture2,
} from 'lucide-react'

/**
 * FloatingVideoPip - Pure Picture-in-Picture floating video player
 * Strictly no text overlays - just the pristine video stream with
 * minimal subtle controls (close, mute/unmute, play/pause, seek).
 */
export default function FloatingVideoPip({
  videoSrc,
  fallbackSrc,
  poster,
  onClose,
}) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(videoSrc)
  const [triedFallback, setTriedFallback] = useState(false)
  const [isNativePipSupported, setIsNativePipSupported] = useState(false)
  const [isNativePipActive, setIsNativePipActive] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef(null)

  // Detect Native PiP capabilities
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const supported =
        document.pictureInPictureEnabled ||
        (videoRef.current && 'webkitSetPresentationMode' in videoRef.current)
      setIsNativePipSupported(Boolean(supported))
    }
  }, [])

  // Update src when videoSrc prop changes
  useEffect(() => {
    setCurrentSrc(videoSrc)
    setTriedFallback(false)
    setIsLoaded(false)
  }, [videoSrc])

  // Play video on mount / src change
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = isMuted
    video.defaultMuted = isMuted

    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          video.muted = true
          setIsMuted(true)
          video.play().catch(() => setIsPlaying(false))
        })
    }
  }, [currentSrc])

  // Listen for native PiP events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnterPip = () => setIsNativePipActive(true)
    const handleLeavePip = () => setIsNativePipActive(false)

    video.addEventListener('enterpictureinpicture', handleEnterPip)
    video.addEventListener('leavepictureinpicture', handleLeavePip)

    return () => {
      video.removeEventListener('enterpictureinpicture', handleEnterPip)
      video.removeEventListener('leavepictureinpicture', handleLeavePip)
    }
  }, [])

  // Auto-hide controls
  const handleUserActivity = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 2800)
  }

  const togglePlay = (e) => {
    e?.stopPropagation()
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {})
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = (e) => {
    e?.stopPropagation()
    const video = videoRef.current
    if (!video) return

    const nextMuted = !isMuted
    video.muted = nextMuted
    setIsMuted(nextMuted)
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration) return
    setProgress((video.currentTime / video.duration) * 100)
  }

  const handleSeek = (e) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video || !video.duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width))
    video.currentTime = newProgress * video.duration
    setProgress(newProgress * 100)
  }

  const handleVideoError = () => {
    if (!triedFallback && fallbackSrc && fallbackSrc !== currentSrc) {
      setTriedFallback(true)
      setCurrentSrc(fallbackSrc)
    }
  }

  const toggleNativePip = async (e) => {
    e?.stopPropagation()
    const video = videoRef.current
    if (!video) return

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else if (video.requestPictureInPicture) {
        await video.requestPictureInPicture()
      } else if (video.webkitSetPresentationMode) {
        const mode = isNativePipActive ? 'inline' : 'picture-in-picture'
        video.webkitSetPresentationMode(mode)
      }
    } catch (err) {
      console.warn('Native Picture-in-Picture error:', err)
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
        onMouseMove={handleUserActivity}
        onTouchStart={handleUserActivity}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] w-[calc(100vw-32px)] max-w-[340px] xs:max-w-[360px] sm:w-[380px] aspect-video rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(255,205,0,0.18)] border border-[#FFCD00]/40 overflow-hidden bg-black select-none cursor-grab active:cursor-grabbing flex flex-col justify-between group"
      >
        {/* Poster fallback image */}
        {poster && (
          <img
            src={poster}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 pointer-events-none z-0 ${
              isLoaded && isPlaying ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          src={currentSrc}
          poster={poster || undefined}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          webkit-playsinline=""
          preload="auto"
          onLoadedData={() => setIsLoaded(true)}
          onCanPlay={() => setIsLoaded(true)}
          onTimeUpdate={handleTimeUpdate}
          onError={handleVideoError}
          onClick={togglePlay}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-10 cursor-pointer ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Top Floating Action Icons (Close & Native PiP) - Strictly no text */}
        <div
          className={`relative z-30 flex items-center justify-end gap-1.5 p-2.5 transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {isNativePipSupported && (
            <button
              type="button"
              onClick={toggleNativePip}
              onPointerDown={(e) => e.stopPropagation()}
              className={`p-1.5 rounded-full backdrop-blur-md transition cursor-pointer ${
                isNativePipActive
                  ? 'bg-[#FFCD00] text-[#001428]'
                  : 'bg-black/60 hover:bg-black/85 text-white/90 hover:text-white'
              }`}
              title="Native PiP"
            >
              <PictureInPicture2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClose?.()
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1.5 rounded-full bg-black/60 hover:bg-red-500/80 backdrop-blur-md text-white/90 hover:text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center Big Play Icon when Paused */}
        {!isPlaying && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 backdrop-blur-[1px] cursor-pointer"
            onClick={togglePlay}
          >
            <div className="w-12 h-12 rounded-full bg-[#FFCD00] text-[#001428] flex items-center justify-center shadow-lg transform transition hover:scale-110">
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </div>
          </div>
        )}

        {/* Bottom Floating Bar: Scrubber & Play/Mute controls - Strictly no text */}
        <div
          className={`relative z-30 flex flex-col gap-1.5 p-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Bar (Clickable scrubber) */}
          <div
            className="w-full h-1 hover:h-1.5 bg-white/25 rounded-full cursor-pointer relative overflow-hidden transition-all"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-[#FFCD00] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Bottom Action Icons: Play/Pause and Mute/Unmute */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                onPointerDown={(e) => e.stopPropagation()}
                className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm text-white transition cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                onPointerDown={(e) => e.stopPropagation()}
                className={`p-1.5 rounded-full backdrop-blur-sm transition cursor-pointer ${
                  isMuted
                    ? 'bg-black/50 text-[#FFCD00] hover:bg-black/80'
                    : 'bg-[#FFCD00] text-[#001428]'
                }`}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
