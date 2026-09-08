import { useEffect, useRef } from 'react'
import cursorVideo from '../assets/cursor.webm'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    document.body.classList.add('hide-cursors')

    let animationFrameId
    let mouseX = -100
    let mouseY = -100
    let isHidden = true
    let isHoveringInteractive = false

    const checkInteractive = (target) => {
      if (!target || !(target instanceof Element)) return false
      return !!target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer, [data-cursor-interactive], label')
    }

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      isHidden = false

      const hovering = checkInteractive(e.target)
      if (hovering !== isHoveringInteractive) {
        isHoveringInteractive = hovering
        if (videoRef.current) {
          if (hovering) {
            videoRef.current.pause()
          } else {
            videoRef.current.play().catch(() => {})
          }
        }
      }
    }

    const onMouseLeave = () => {
      isHidden = true
      if (videoRef.current && isHoveringInteractive) {
        isHoveringInteractive = false
        videoRef.current.play().catch(() => {})
      }
    }

    const onMouseEnter = () => {
      isHidden = false
    }

    const updatePosition = () => {
      // Tilted slightly (rotate 20deg) for a natural swimming dive angle
      const transformStr = `translate3d(${mouseX}px, ${mouseY}px, 0) rotate(20deg)`

      if (cursorRef.current) {
        cursorRef.current.style.transform = transformStr
        cursorRef.current.style.opacity = isHidden ? '0' : '1'
      }

      animationFrameId = requestAnimationFrame(updatePosition)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('mouseenter', onMouseEnter)

    animationFrameId = requestAnimationFrame(updatePosition)

    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('mouseenter', onMouseEnter)
      cancelAnimationFrame(animationFrameId)
      document.body.classList.remove('hide-cursors')
    }
  }, [])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[10000] will-change-transform drop-shadow-md"
      style={{
        transform: 'translate3d(-100px, -100px, 0) rotate(20deg)',
        opacity: 0,
        transition: 'opacity 0.12s ease-out',
      }}
    >
      <video
        ref={videoRef}
        src={cursorVideo}
        autoPlay
        loop
        muted
        playsInline
        className="w-20 sm:w-24 h-auto object-contain pointer-events-none"
      />
    </div>
  )
}
