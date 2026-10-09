import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import preloaderVideoLocal from '../assets/preloader.mp4'
const preloaderVideo = preloaderVideoLocal
import {
  subscribeHeroVideoReady,
  getHeroVideoReady,
  subscribeHeroWebGLReady,
  getHeroWebGLReady
} from '../utils/mediaReadyManager'

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
        const targetW = 320
        const aspect = (video.videoWidth && video.videoHeight) ? (video.videoHeight / video.videoWidth) : (9 / 16)
        const targetH = Math.round(targetW * aspect) || 180
        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW
          canvas.height = targetH
        }
        ctx.drawImage(video, 0, 0, targetW, targetH)
        try {
          const frame = ctx.getImageData(0, 0, targetW, targetH)
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
        } catch (e) {
          // Fallback if canvas is tainted before crossOrigin resolves
        }
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
        src={src || null}
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
      />
      <canvas ref={canvasRef} className={`${className} pointer-events-none`} />
    </>
  )
}

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const isVideoReadyRef = useRef(getHeroVideoReady())
  const isWebGLReadyRef = useRef(getHeroWebGLReady())

  useEffect(() => {
    const unsubVideo = subscribeHeroVideoReady((ready) => {
      isVideoReadyRef.current = ready
    })
    const unsubWebGL = subscribeHeroWebGLReady((ready) => {
      isWebGLReadyRef.current = ready
    })
    return () => {
      unsubVideo()
      unsubWebGL()
    }
  }, [])

  useEffect(() => {
    const startTime = performance.now()
    const maxSafetyTimeout = 1800 // Hard safety cap guaranteeing preloader finishes within 2.0s
    const baseTargetDuration = 1400 // Smooth progress duration (~1.4s)
    let animationFrameId
    let completed = false

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime
      const isFullyReady = (isVideoReadyRef.current && isWebGLReadyRef.current) || elapsed >= maxSafetyTimeout

      let targetProgress
      if (elapsed >= maxSafetyTimeout) {
        targetProgress = 100
      } else if (isFullyReady) {
        // Smoothly progress to 100%
        targetProgress = Math.min(100, (elapsed / baseTargetDuration) * 100)
      } else {
        // Smoothly ease up to 90% while waiting for assets
        targetProgress = Math.min(90, (elapsed / maxSafetyTimeout) * 90)
      }

      setProgress(targetProgress)

      if (targetProgress >= 100 && !completed) {
        completed = true
        setTimeout(() => {
          if (onComplete) onComplete()
        }, 200)
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
