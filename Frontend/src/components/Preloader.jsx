import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import preloaderVideo from '@video-optimized/preloader.mp4'

const DIVING_PUNS = [
  'Equalizing pressure...',
  'Checking tanks & oxygen...',
  'Adjusting buoyancy...',
  'Descending into blue paradise...',
  'All systems go for launch! 🤿',
]

function DiverAnimation({ src, className }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    let animId

    const render = () => {
      if (video.readyState >= 2) {
        const w = video.videoWidth || 640
        const h = video.videoHeight || 360
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
          // Cleanly key out all off-white/light grey background pixels
          if (r > 200 && g > 200 && b > 200) {
            data[i + 3] = 0
          } else if (r > 175 && g > 175 && b > 175) {
            // Anti-aliased feathering on edges
            const factor = (200 - Math.max(r, g, b)) / 25
            data[i + 3] = Math.round(data[i + 3] * Math.max(0, Math.min(1, factor)))
          }
        }
        ctx.putImageData(frame, 0, 0)
      }
      animId = requestAnimationFrame(render)
    }

    video.play().catch(() => {})
    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
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
        style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
      />
      <canvas ref={canvasRef} className={className} />
    </>
  )
}

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0)

  // Determine current status message based on progress bracket
  const getStatusText = (pct) => {
    if (pct < 20) return DIVING_PUNS[0]
    if (pct < 45) return DIVING_PUNS[1]
    if (pct < 70) return DIVING_PUNS[2]
    if (pct < 90) return DIVING_PUNS[3]
    return DIVING_PUNS[4]
  }

  useEffect(() => {
    // 4.2 seconds total duration for a relaxed, deliberate, premium transition
    const totalDuration = 4200
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

      {/* Dynamic Status & Percentage */}
      <div className="flex items-center justify-between w-56 sm:w-72 text-[11px] font-bold text-[#003865]/80 tracking-wider">
        <span className="truncate pr-2">{getStatusText(progress)}</span>
        <span className="shrink-0">{Math.round(progress)}%</span>
      </div>
    </motion.div>
  )
}
