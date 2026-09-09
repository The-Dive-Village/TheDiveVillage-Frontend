import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import cursorVideo from '../assets/cursor.webm'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return
    }

    document.body.classList.add('hide-cursors')

    let isHidden = true
    let isHoveringInteractive = false
    let lastCheckTime = 0

    const checkInteractive = (target) => {
      if (!target || !(target instanceof Element)) return false
      return !!target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer, [data-cursor-interactive], label')
    }

    const onMouseMove = (e) => {
      const x = e.clientX
      const y = e.clientY

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
        if (isHidden) {
          isHidden = false
          cursorRef.current.style.opacity = '1'
        }
      }

      // Check interactive targets smoothly with time throttling (max once per 50ms)
      const now = performance.now()
      if (now - lastCheckTime > 50) {
        lastCheckTime = now
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
    }

    const onMouseLeave = () => {
      isHidden = true
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0'
      }
      if (videoRef.current && isHoveringInteractive) {
        isHoveringInteractive = false
        videoRef.current.play().catch(() => {})
      }
    }

    const onMouseEnter = () => {
      isHidden = false
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1'
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('mouseenter', onMouseEnter)

    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('mouseenter', onMouseEnter)
      document.body.classList.remove('hide-cursors')
    }
  }, [])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  const cursorNode = (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999999] will-change-transform drop-shadow-md"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        opacity: 0,
        transition: 'opacity 0.12s ease-out',
      }}
    >
      <div
        className="will-change-transform"
        style={{
          transformOrigin: '4.6% 57.5%',
          transform: 'translate(-4.6%, -57.5%) rotate(20deg)',
        }}
      >
        <video
          ref={videoRef}
          src={cursorVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-16 sm:w-20 h-auto object-contain pointer-events-none select-none"
        />
      </div>
    </div>
  )

  if (typeof document !== 'undefined') {
    return createPortal(cursorNode, document.body)
  }

  return cursorNode
}
