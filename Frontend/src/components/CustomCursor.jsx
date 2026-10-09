import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import cursorVideoLocal from '../assets/cursor.webm'
const cursorVideo = 'https://res.cloudinary.com/bbgt5nk7/video/upload/v1790244012/dive-village/ui-videos/cursor_webm.webm'
import cursorPng from '../assets/cursor.png'
import cursorHoverPng from '../assets/cursor hover.png'
import useNightDive from '../hooks/useNightDive'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const videoRef = useRef(null)
  const isNightDive = useNightDive()
  const [isHovering, setIsHovering] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return
    }

    document.body.classList.add('hide-cursors')

    let latestX = -100
    let latestY = -100
    let currentTarget = null
    let rafId = null
    let isHidden = true
    let isHoveringInteractive = false
    let isOverNormalCursor = false
    let lastCheckTime = 0

    const isPointInsideGlobe = () => false

    const checkNormalCursor = (target) => {
      if (!target) return false
      const el = target instanceof Element ? target : target.parentElement
      if (!el || !(el instanceof Element)) return false
      return !!el.closest('input, textarea, select, [contenteditable="true"], .normal-cursor, [data-normal-cursor], model-viewer')
    }

    const checkInteractive = (target) => {
      if (!target) return false
      const el = target instanceof Element ? target : target.parentElement
      if (!el || !(el instanceof Element)) return false
      return !!el.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer, [data-cursor-interactive], label')
    }

    const checkRadiusForInteractive = (x, y) => {
      let el = document.elementFromPoint(x, y)
      if (el && checkInteractive(el)) return true
      
      const r = 45 // 45px wide radius
      const points = [
        [x + r, y], [x - r, y], [x, y + r], [x, y - r],
        [x + r * 0.7, y + r * 0.7], [x - r * 0.7, y - r * 0.7],
        [x + r * 0.7, y - r * 0.7], [x - r * 0.7, y + r * 0.7]
      ]
      
      for (const [px, py] of points) {
        if (px >= 0 && py >= 0 && px <= window.innerWidth && py <= window.innerHeight) {
          const pel = document.elementFromPoint(px, py)
          if (pel && checkInteractive(pel)) return true
        }
      }
      return false
    }

    let lastRenderX = -100
    let lastRenderY = -100
    let currentRotation = 0
    let targetRotation = 0
    let currentScaleX = 1
    let targetScaleX = 1

    const updateCursorPosition = () => {
      if (cursorRef.current) {
        const dx = latestX - lastRenderX
        const dy = latestY - lastRenderY
        lastRenderX = latestX
        lastRenderY = latestY

        // Update target orientation
        if (isHoveringInteractive) {
          targetRotation = 0
          targetScaleX = 1
        } else if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          if (Math.abs(dx) > Math.abs(dy)) {
            targetRotation = 0
            targetScaleX = dx > 0 ? -1 : 1
          } else {
            targetRotation = dy < 0 ? 90 : -90
            targetScaleX = 1
          }
        }

        currentRotation += (targetRotation - currentRotation) * 0.15
        currentScaleX += (targetScaleX - currentScaleX) * 0.15

        cursorRef.current.style.transform = `translate3d(${latestX}px, ${latestY}px, 0) rotate(${currentRotation}deg) scaleX(${currentScaleX})`

        if (isOverNormalCursor || isHidden) {
          cursorRef.current.style.opacity = '0'
          cursorRef.current.style.visibility = 'hidden'
        } else {
          cursorRef.current.style.opacity = '1'
          cursorRef.current.style.visibility = 'visible'
        }
      }

      const now = performance.now()
      if (now - lastCheckTime >= 32 && latestX >= 0 && latestY >= 0) { // Limit to ~30fps for radius checks
        lastCheckTime = now
        const elUnderPoint = document.elementFromPoint(latestX, latestY) || currentTarget
        isOverNormalCursor = checkNormalCursor(elUnderPoint) || isPointInsideGlobe(latestX, latestY)
        if (isOverNormalCursor) {
          if (isHoveringInteractive) {
            isHoveringInteractive = false
            setIsHovering(false)
          }
        } else {
          const hovering = checkRadiusForInteractive(latestX, latestY)
          if (hovering !== isHoveringInteractive) {
            isHoveringInteractive = hovering
            setIsHovering(hovering)
          }
        }
      }

      rafId = requestAnimationFrame(updateCursorPosition)
    }

    rafId = requestAnimationFrame(updateCursorPosition)

    const onMouseMove = (e) => {
      latestX = e.clientX
      latestY = e.clientY
      currentTarget = e.target
      isOverNormalCursor = checkNormalCursor(e.target) || isPointInsideGlobe(latestX, latestY)

      if (isOverNormalCursor) {
        if (isHoveringInteractive) {
          isHoveringInteractive = false
          setIsHovering(false)
        }
        if (cursorRef.current) {
          cursorRef.current.style.opacity = '0'
          cursorRef.current.style.visibility = 'hidden'
        }
      } else {
        if (isHidden) {
          isHidden = false
        }
        if (cursorRef.current) {
          cursorRef.current.style.opacity = '1'
          cursorRef.current.style.visibility = 'visible'
        }

        // 0ms Instant Response ONLY if directly on a button and not over globe/normal cursor
        if (e.target && checkInteractive(e.target)) {
          if (!isHoveringInteractive) {
            isHoveringInteractive = true
            setIsHovering(true)
          }
        }
      }
    }

    const onScroll = () => {
      if (latestX >= 0 && latestY >= 0) {
        const el = document.elementFromPoint(latestX, latestY)
        currentTarget = el
        isOverNormalCursor = checkNormalCursor(el) || isPointInsideGlobe(latestX, latestY)
        if (isOverNormalCursor && cursorRef.current) {
          cursorRef.current.style.opacity = '0'
          cursorRef.current.style.visibility = 'hidden'
        }
      }
    }

    const onMouseLeave = () => {
      isHidden = true
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0'
        cursorRef.current.style.visibility = 'hidden'
      }
      setIsHovering(false)
    }

    const onMouseEnter = (e) => {
      isHidden = false
      const target = e?.target || document.elementFromPoint(latestX, latestY)
      isOverNormalCursor = checkNormalCursor(target) || isPointInsideGlobe(latestX, latestY)
      if (cursorRef.current) {
        if (isOverNormalCursor) {
          cursorRef.current.style.opacity = '0'
          cursorRef.current.style.visibility = 'hidden'
        } else {
          cursorRef.current.style.opacity = '1'
          cursorRef.current.style.visibility = 'visible'
        }
      }
    }

    const onFocusIn = (e) => {
      if (checkNormalCursor(e.target) && cursorRef.current) {
        cursorRef.current.style.opacity = '0'
        cursorRef.current.style.visibility = 'hidden'
      }
    }

    // Listener setups with capture to ensure priority over canvas libraries
    window.addEventListener('pointermove', onMouseMove, { capture: true, passive: true })
    window.addEventListener('mousemove', onMouseMove, { capture: true, passive: true })
    window.addEventListener('pointerdown', onMouseMove, { capture: true, passive: true })
    window.addEventListener('pointerup', onMouseMove, { capture: true, passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('mouseenter', onMouseEnter)
    window.addEventListener('focusin', onFocusIn)

    const ensureVideoPlaying = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(() => {})
      }
    }

    window.addEventListener('pointerdown', ensureVideoPlaying, { passive: true })
    window.addEventListener('click', ensureVideoPlaying, { passive: true })

    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.defaultMuted = true
      videoRef.current.play().catch(() => {})
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onMouseMove, { capture: true })
      window.removeEventListener('mousemove', onMouseMove, { capture: true })
      window.removeEventListener('pointerdown', onMouseMove, { capture: true })
      window.removeEventListener('pointerup', onMouseMove, { capture: true })
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('mouseenter', onMouseEnter)
      window.removeEventListener('focusin', onFocusIn)
      window.removeEventListener('pointerdown', ensureVideoPlaying)
      window.removeEventListener('click', ensureVideoPlaying)
      document.body.classList.remove('hide-cursors')
    }
  }, [])

  // Keep video playing continuously across theme toggles and visibility changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [isNightDive])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  const cursorNode = (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[99999999] will-change-transform select-none"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        opacity: 0,
        visibility: 'hidden',
      }}
    >
      {/* Night Dive Mode Underwater Flashlight Beam & Spotlight Aura (Subtle reduced halo) */}
      {isNightDive && (
        <div
          className="pointer-events-none absolute rounded-full transition-all duration-300"
          style={{
            width: isHovering ? '180px' : '140px',
            height: isHovering ? '180px' : '140px',
            left: isHovering ? '-90px' : '-70px',
            top: isHovering ? '-90px' : '-70px',
            background: isHovering
              ? 'radial-gradient(circle, rgba(0, 242, 254, 0.16) 0%, rgba(255, 205, 0, 0.08) 35%, rgba(0, 56, 101, 0.03) 65%, transparent 80%)'
              : 'radial-gradient(circle, rgba(0, 242, 254, 0.10) 0%, rgba(255, 205, 0, 0.05) 30%, transparent 70%)',
            mixBlendMode: 'screen',
            filter: 'blur(5px)',
          }}
        />
      )}

      {/* Scuba Diver with Dynamic Luminescence and Interactive Scale */}
      <div
        className="will-change-transform transition-transform duration-100 ease-out"
        style={{
          transformOrigin: '4.6% 57.5%',
          transform: `translate(-4.6%, -57.5%) rotate(20deg) scale(${isHovering ? 1.15 : 1.0})`,
          filter: isNightDive
            ? (isHovering
                ? 'drop-shadow(0 0 6px rgba(0, 242, 254, 0.6)) brightness(1.15) contrast(1.05)'
                : 'drop-shadow(0 0 4px rgba(0, 242, 254, 0.4)) brightness(1.1) contrast(1.05)')
            : (isHovering
                ? 'drop-shadow(0 4px 12px rgba(0, 56, 101, 0.4)) brightness(1.05)'
                : 'drop-shadow(0 2px 8px rgba(0, 30, 61, 0.25))'),
        }}
      >
        {!videoError ? (
          <video
            ref={videoRef}
            src={cursorVideo}
            autoPlay
            loop
            muted
            playsInline
            crossOrigin="anonymous"
            onError={() => setVideoError(true)}
            className="w-16 sm:w-20 h-auto object-contain pointer-events-none select-none"
          />
        ) : (
          <img
            src={isHovering ? cursorHoverPng : cursorPng}
            alt="Scuba Diver Cursor"
            className="w-16 sm:w-20 h-auto object-contain pointer-events-none select-none"
          />
        )}
      </div>
    </div>
  )

  if (typeof document !== 'undefined') {
    return createPortal(cursorNode, document.body)
  }

  return cursorNode
}
