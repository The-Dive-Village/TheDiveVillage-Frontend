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

<<<<<<< HEAD
    const checkInteractive = (target) => {
      if (!target || !(target instanceof Element)) return false
      return !!target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer, [data-cursor-interactive], label')
=======
    let dirtyProximity = true

    const checkProximity = (x, y) => {
      if (x < 0 || y < 0) return null

      // 1. Direct hit check at (x, y) - Instant O(1) without forced reflow
      const target = document.elementFromPoint(x, y)
      if (target) {
        const interactiveEl = target.closest(
          'button, a, select, input, [role="button"], .cursor-pointer, [data-clickable="true"]'
        )
        if (interactiveEl) return interactiveEl
        try {
          const style = window.getComputedStyle(target)
          if (style && style.cursor === 'pointer') return target
        } catch {}
      }

      return null
>>>>>>> 182d9bb331e44a4a99f3be86f1d680bbac8be789
    }

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      isHidden = false
<<<<<<< HEAD

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
=======
      dirtyProximity = true
>>>>>>> 182d9bb331e44a4a99f3be86f1d680bbac8be789
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
      dirtyProximity = true
    }

    const updatePosition = () => {
<<<<<<< HEAD
      // Tilted slightly (rotate 20deg) for a natural swimming dive angle
      const transformStr = `translate3d(${mouseX}px, ${mouseY}px, 0) rotate(20deg)`

      if (cursorRef.current) {
        cursorRef.current.style.transform = transformStr
        cursorRef.current.style.opacity = isHidden ? '0' : '1'
=======
      if (dirtyProximity) {
        const nearestEl = checkProximity(mouseX, mouseY)

        if (nearestEl !== activeProximityEl) {
          if (activeProximityEl) {
            activeProximityEl.classList.remove('proximity-active')
          }
          if (nearestEl) {
            nearestEl.classList.add('proximity-active')
          }
          activeProximityEl = nearestEl
        }

        isHovered = !!activeProximityEl
        dirtyProximity = false
      }

      const normalTransformStr = `translate3d(${mouseX}px, ${mouseY}px, 0) rotate(45deg)`
      const hoverTransformStr = `translate3d(${mouseX}px, ${mouseY}px, 0) rotate(45deg) scaleX(-1)`

      if (normalRef.current) {
        normalRef.current.style.transform = normalTransformStr
        normalRef.current.style.opacity = isHidden ? '0' : isHovered ? '0' : '1'
      }

      if (hoverRef.current) {
        hoverRef.current.style.transform = hoverTransformStr
        hoverRef.current.style.opacity = isHidden ? '0' : isHovered ? '1' : '0'
>>>>>>> 182d9bb331e44a4a99f3be86f1d680bbac8be789
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
