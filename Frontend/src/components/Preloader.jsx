import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import preloaderVideo from '@video-optimized/preloader.mp4'

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

  useEffect(() => {
    // 4.0 seconds total duration for a relaxed, deliberate, premium transition
    const totalDuration = 4000
    const intervalTime = 30
    const increment = 100 / (totalDuration / intervalTime)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            if (onComplete) onComplete()
          }, 350)
          return 100
        }
        return next
      })
    }, intervalTime)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
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
