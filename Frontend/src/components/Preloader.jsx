import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import preloaderVideo from '@video-optimized/preloader.mp4'
import { subscribeHeroVideoReady, getHeroVideoReady } from '../utils/mediaReadyManager'

function DiverAnimation({ src, className }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.defaultMuted = true
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.play().catch(() => {})
  }, [src])

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      className={`${className} mix-blend-multiply pointer-events-none`}
      style={{ filter: 'contrast(1.45) brightness(1.06)' }}
    />
  )
}

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const isVideoReadyRef = useRef(getHeroVideoReady())

  useEffect(() => {
    const unsubscribe = subscribeHeroVideoReady((ready) => {
      isVideoReadyRef.current = ready
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const startTime = performance.now()
    const baseTargetDuration = 1800 // Fast and balanced premium animation duration (~1.8s)
    const maxSafetyTimeout = 3200 // Safety cap ensuring user is never held too long
    let animationFrameId
    let completed = false

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime
      const isVideoReady = isVideoReadyRef.current || elapsed >= maxSafetyTimeout

      let targetProgress
      if (isVideoReady) {
        // When video is ready, progress scales smoothly to 100% by baseTargetDuration
        targetProgress = Math.min(100, (elapsed / baseTargetDuration) * 100)
      } else {
        // If still buffering video, smoothly ease up to 90% and hold until ready
        targetProgress = Math.min(90, (elapsed / baseTargetDuration) * 90)
      }

      setProgress(targetProgress)

      if (targetProgress >= 100 && !completed) {
        completed = true
        setTimeout(() => {
          if (onComplete) onComplete()
        }, 50)
        return
      }

      animationFrameId = requestAnimationFrame(updateProgress)
    }

    animationFrameId = requestAnimationFrame(updateProgress)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
      className="fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center p-6 select-none font-body shadow-2xl"
    >
      {/* Diver Graphic / Animation */}
      <div className="w-56 sm:w-68 md:w-80 mb-6 flex items-center justify-center overflow-hidden">
        <DiverAnimation
          src={preloaderVideo}
          className="w-full h-auto max-h-[160px] object-contain"
        />
      </div>

      {/* Progress Bar in #003865 */}
      <div className="w-56 sm:w-72 h-2 rounded-full bg-[#003865]/10 overflow-hidden relative mb-3">
        <div
          className="h-full bg-[#003865] rounded-full transition-all duration-75 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status & Percentage - ONLY "Preparing to dive..." */}
      <div className="flex items-center justify-between w-56 sm:w-72 text-[11px] font-bold text-[#003865]/80 tracking-wider">
        <span className="truncate pr-2">Preparing to dive...</span>
        <span className="shrink-0">{Math.round(progress)}%</span>
      </div>
    </motion.div>
  )
}
