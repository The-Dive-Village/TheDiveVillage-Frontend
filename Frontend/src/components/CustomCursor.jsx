import { useEffect, useRef } from 'react'
import cursorImg from '../assets/cursor.png'
import cursorHoverImg from '../assets/cursor hover.png'

export default function CustomCursor() {
  const normalRef = useRef(null)
  const hoverRef = useRef(null)

  useEffect(() => {
    document.body.classList.add('hide-cursors')

    let animationFrameId
    let mouseX = -100
    let mouseY = -100
    let isHidden = true
    let isHovered = false
    let activeProximityEl = null

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
    }

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      isHidden = false
      dirtyProximity = true
    }

    const onMouseLeave = () => {
      isHidden = true
    }

    const onMouseEnter = () => {
      isHidden = false
      dirtyProximity = true
    }

    const onClick = (e) => {
      if (activeProximityEl && !activeProximityEl.contains(e.target)) {
        e.preventDefault()
        e.stopPropagation()
        activeProximityEl.click()
      }
    }

    const updatePosition = () => {
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
      }

      animationFrameId = requestAnimationFrame(updatePosition)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('mouseenter', onMouseEnter)
    window.addEventListener('click', onClick, { capture: true })

    animationFrameId = requestAnimationFrame(updatePosition)

    return () => {
      if (activeProximityEl) {
        activeProximityEl.classList.remove('proximity-active')
      }
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('mouseenter', onMouseEnter)
      window.removeEventListener('click', onClick, { capture: true })
      cancelAnimationFrame(animationFrameId)
      document.body.classList.remove('hide-cursors')
    }
  }, [])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* Normal Cursor Image */}
      <img
        ref={normalRef}
        src={cursorImg}
        alt=""
        className="pointer-events-none fixed top-0 left-0 z-[10000] w-20 sm:w-24 h-auto will-change-transform drop-shadow-md"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          opacity: 0,
          transition: 'opacity 0.12s ease-out',
        }}
      />

      {/* Hover Cursor Image (Same Size & Inverted) */}
      <img
        ref={hoverRef}
        src={cursorHoverImg}
        alt=""
        className="pointer-events-none fixed top-0 left-0 z-[10000] w-20 sm:w-24 h-auto will-change-transform drop-shadow-lg invert"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          opacity: 0,
          transition: 'opacity 0.12s ease-out',
          filter: 'invert(100%) drop-shadow(0 4px 10px rgba(0,0,0,0.4))',
        }}
      />
    </>
  )
}

