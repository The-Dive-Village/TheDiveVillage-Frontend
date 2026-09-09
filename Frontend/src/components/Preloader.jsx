import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import preloaderVideo from '../assets/preloader.mp4'
import { subscribeHeroVideoReady, getHeroVideoReady } from '../utils/mediaReadyManager'

function DiverAnimation({ src, className }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    video.muted = true
    video.defaultMuted = true
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.play().catch(() => {})

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    let animId
    let isRunning = true

    const render = () => {
      if (!isRunning) return
      if (video.readyState >= 2) {
        const w = video.videoWidth || 480
        const h = video.videoHeight || 270
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w
          canvas.height = h
        }
        ctx.drawImage(video, 0, 0, w, h)
        const frame = ctx.getImageData(0, 0, w, h)
        const data = frame.data
        const len = data.length
        for (let i = 0; i < len; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const minVal = Math.min(r, g, b)
          // Key out any off-white/grey video background pixels completely to transparent
          if (minVal >= 210) {
            data[i + 3] = 0
          } else if (minVal > 165) {
            const factor = (210 - minVal) / 45
            data[i + 3] = Math.round(data[i + 3] * Math.max(0, Math.min(1, factor)))
          }
        }
        ctx.putImageData(frame, 0, 0)
      }
      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      isRunning = false
      if (animId) cancelAnimationFrame(animId)
    }
  }, [src])

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
      />
      <canvas ref={canvasRef} className={`${className} pointer-events-none`} />
    </>
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
    const baseTargetDuration = 6000 // Extended relaxed duration (~6.0s)
    const maxSafetyTimeout = 8500 // Safety cap ensuring user is never held too long
    let animationFrameId
    let completed = false

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime
      const isVideoReady = isVideoReadyRef.current || elapsed >= maxSafetyTimeout

      let targetProgress
      if (isVideoReady) {
        // Smoothly progress to 100% by baseTargetDuration
        targetProgress = Math.min(100, (elapsed / baseTargetDuration) * 100)
      } else {
        // If still buffering video, smoothly ease up to 85% and hold until ready
        targetProgress = Math.min(85, (elapsed / baseTargetDuration) * 85)
      }

      setProgress(targetProgress)

      if (targetProgress >= 100 && !completed) {
        completed = true
        setTimeout(() => {
          if (onComplete) onComplete()
        }, 350)
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
      exit={{ y: '-100%', transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center p-6 select-none font-body shadow-2xl"
    >
      {/* Diver Graphic / Video Animation with clean background keying */}
      <div className="w-56 sm:w-68 md:w-80 mb-6 flex items-center justify-center overflow-hidden">
        <DiverAnimation
          src={preloaderVideo}
          className="w-full h-auto max-h-[160px] object-contain"
        />
      </div>

      {/* Progress Bar in #003865 */}
      <div className="w-56 sm:w-72 h-2 rounded-full bg-[#003865]/10 overflow-hidden relative mb-3">
        <div
          className="h-full bg-[#003865] rounded-full transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status & Percentage */}
      <div className="flex items-center justify-between w-56 sm:w-72 text-[11px] font-bold text-[#003865]/80 tracking-wider">
        <span className="truncate pr-2">Preparing to dive...</span>
        <span className="shrink-0 text-[#003865] font-bold">{Math.round(progress)}%</span>
      </div>
    </motion.div>
  )
}
