import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router'
import { getOptimizedImageUrl } from '../utils/mediaOptimizer'
const cursorVideo = '/media/TDV-Media/UI/cursor.webm'
const rawCursorLogo = 'https://res.cloudinary.com/q7b4kjd9/image/upload/v1791691225/TDV-Media/UI/Logo.png'
const cursorPng = rawCursorLogo
const cursorHoverPng = rawCursorLogo
import useNightDive from '../hooks/useNightDive'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const videoRef = useRef(null)
  const isNightDive = useNightDive()
  const location = useLocation()
  const [isHovering, setIsHovering] = useState(false)
  const [videoError, setVideoError] = useState(false)

  const isAuthPage = location?.pathname === '/login' || 
    location?.pathname === '/signup' || 
    location?.pathname?.startsWith('/login/') || 
    location?.pathname?.startsWith('/signup/')

  useEffect(() => {
    if (isAuthPage || (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)) {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('hide-cursors')
      }
      return
    }

    document.body.classList.add('hide-cursors')

    let latestX = -100
    let latestY = -100
    let prevMoveX = -100
    let prevMoveY = -100
    let lastMoveTime = 0
    let velX = 0
    let velY = 0
    let currentTarget = null
    let rafId = null
    let isHidden = true
    let isHoveringInteractive = false
    let isOverNormalCursor = false
    let lastCheckTime = 0

    let currentRotation = 12
    let targetRotation = 12
    let currentScaleX = 1
    let targetScaleX = 1
    let currentFacing = 1 // 1 for Left, -1 for Right
    const RESTING_ROTATION = 12
    const MAX_TILT = 80

    const isPointInsideGlobe = () => false

    const checkNormalCursor = (target) => {
      if (!target) return false
      const el = target instanceof Element ? target : target.parentElement
      if (!el || !(el instanceof Element)) return false
      // Never hide custom cursor over product cards or product media
      if (el.closest('[data-product-card], .product-card, [data-product-media], [data-product-subpage], .product-3d-wrapper')) {
        return false
      }
      return !!el.closest('input, textarea, select, [contenteditable="true"], .normal-cursor, [data-normal-cursor], form, [data-auth-container], .maplibregl-map, .maplibregl-canvas, .maplibregl-canvas-container, [data-dive-map]')
    }

    const checkInteractive = (target) => {
      if (!target) return false
      const el = target instanceof Element ? target : target.parentElement
      if (!el || !(el instanceof Element)) return false
      return !!el.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer, [data-cursor-interactive], label, [data-product-card], .product-card, [data-360-toggle="clickable"], [data-gallery-close], [aria-label="Close Lightbox"]')
    }

    const checkRadiusForInteractive = (x, y) => {
      let el = document.elementFromPoint(x, y)
      return el ? checkInteractive(el) : false
    }

    let cachedToggleCenter = null
    let lastToggleCheckTime = 0

    const isNear360Toggle = (x, y, target) => {
      if (typeof document === 'undefined') return false

      if (document.body.hasAttribute('data-360-dragging')) {
        return true
      }

      if (target instanceof Element && target.closest('[data-360-toggle], .joystick-container')) {
        return true
      }

      if (x < window.innerWidth - 220) {
        return false
      }

      const now = performance.now()
      if (!cachedToggleCenter || now - lastToggleCheckTime > 300) {
        lastToggleCheckTime = now
        const toggleEl = document.querySelector('[data-360-toggle="clickable"]') || document.querySelector('.joystick-container')
        if (toggleEl && toggleEl.offsetParent !== null) {
          const rect = toggleEl.getBoundingClientRect()
          cachedToggleCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          }
        } else {
          cachedToggleCenter = null
        }
      }

      if (!cachedToggleCenter) return false

      const dist = Math.hypot(x - cachedToggleCenter.x, y - cachedToggleCenter.y)
      return dist <= 140
    }

    let cachedGalleryCloseCenter = null
    let lastGalleryCloseCheckTime = 0

    const isNearGalleryClose = (x, y, target) => {
      if (typeof document === 'undefined') return false

      if (target instanceof Element && target.closest('[data-gallery-close], [aria-label="Close Lightbox"], [data-cursor-static], #gallery-preview-close')) {
        return true
      }

      const now = performance.now()
      if (!cachedGalleryCloseCenter || now - lastGalleryCloseCheckTime > 300) {
        lastGalleryCloseCheckTime = now
        const closeBtn = document.querySelector('[data-gallery-close], [aria-label="Close Lightbox"], [data-cursor-static], #gallery-preview-close')
        if (closeBtn && closeBtn.offsetParent !== null) {
          const rect = closeBtn.getBoundingClientRect()
          cachedGalleryCloseCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          }
        } else {
          cachedGalleryCloseCenter = null
        }
      }

      if (!cachedGalleryCloseCenter) return false

      const dist = Math.hypot(x - cachedGalleryCloseCenter.x, y - cachedGalleryCloseCenter.y)
      return dist <= 140
    }

    const updateCursorPosition = () => {
      if (cursorRef.current && latestX >= 0 && latestY >= 0) {
        // Natural hydrodynamic velocity decay when mouse movement halts
        const now = performance.now()
        const timeSinceMove = now - lastMoveTime
        if (timeSinceMove > 35) {
          velX *= 0.82
          velY *= 0.82
        }

        const speed = Math.hypot(velX, velY)
        const near360 = isNear360Toggle(latestX, latestY, currentTarget)
        const nearGalleryClose = isNearGalleryClose(latestX, latestY, currentTarget)
        const isNearStaticZone = near360 || nearGalleryClose

        if (isHoveringInteractive || isNearStaticZone) {
          // Precise, calm alignment over interactive controls
          targetRotation = RESTING_ROTATION
          targetScaleX = currentFacing
        } else if (speed > 1.2) {
          // 1. Horizontal direction: turn Left when moving left, turn Right when moving right
          if (velX > 1.5) {
            currentFacing = -1 // Moving rightwards -> turn Right
          } else if (velX < -1.5) {
            currentFacing = 1  // Moving leftwards -> turn Left
          }
          targetScaleX = currentFacing

          // 2. Vertical direction: turn Top (upwards) or Down (downwards) depending on direction
          // Project forward component along current facing direction (guaranteed >= 0)
          const rawForwardX = currentFacing === -1 ? velX : -velX
          const forwardX = Math.max(0, rawForwardX)
          const pitchRad = Math.atan2(velY, forwardX)
          const pitchDeg = (pitchRad * 180) / Math.PI

          // velY < 0 (moving towards top) -> pitchDeg < 0 -> targetRotation > 0 (tilts UP)
          // velY > 0 (moving towards down) -> pitchDeg > 0 -> targetRotation < 0 (tilts DOWN)
          const rawTargetRot = -pitchDeg
          targetRotation = Math.max(-MAX_TILT, Math.min(MAX_TILT, rawTargetRot))
        } else {
          // Neutral buoyant resting float angle when stopped
          targetRotation = RESTING_ROTATION
          targetScaleX = currentFacing
        }

        // Fluid hydrodynamic lerping
        const rotLerpFactor = 0.22
        const scaleLerpFactor = 0.38
        currentRotation += (targetRotation - currentRotation) * rotLerpFactor
        currentScaleX += (targetScaleX - currentScaleX) * scaleLerpFactor

        if (Math.abs(targetScaleX - currentScaleX) < 0.02) currentScaleX = targetScaleX
        if (Math.abs(targetRotation - currentRotation) < 0.05) currentRotation = targetRotation

        cursorRef.current.style.transform = `translate3d(${latestX}px, ${latestY}px, 0) scaleX(${currentScaleX}) rotate(${currentRotation}deg)`

        if (isOverNormalCursor || isHidden) {
          cursorRef.current.style.opacity = '0'
          cursorRef.current.style.visibility = 'hidden'
        } else {
          cursorRef.current.style.opacity = '1'
          cursorRef.current.style.visibility = 'visible'
        }
      }

      const now = performance.now()
      const isScrolling = typeof document !== 'undefined' && document.body.classList.contains('is-scrolling')
      if (!isScrolling && now - lastCheckTime >= 64 && latestX >= 0 && latestY >= 0) { // Limit to ~15fps for radius checks, bypass during scroll
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
      const x = e.clientX
      const y = e.clientY
      if (x === latestX && y === latestY) {
        currentTarget = e.target
        return
      }

      const now = performance.now()
      if (prevMoveX >= 0 && prevMoveY >= 0) {
        const instantDx = x - prevMoveX
        const instantDy = y - prevMoveY
        const alpha = 0.6
        velX = velX * (1 - alpha) + instantDx * alpha
        velY = velY * (1 - alpha) + instantDy * alpha
      } else {
        velX = 0
        velY = 0
      }
      prevMoveX = x
      prevMoveY = y
      lastMoveTime = now

      latestX = x
      latestY = y
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
      prevMoveX = -100
      prevMoveY = -100
      velX = 0
      velY = 0
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0'
        cursorRef.current.style.visibility = 'hidden'
      }
      setIsHovering(false)
    }

    const onMouseEnter = (e) => {
      isHidden = false
      if (e?.clientX != null && e?.clientY != null) {
        latestX = e.clientX
        latestY = e.clientY
        prevMoveX = e.clientX
        prevMoveY = e.clientY
        velX = 0
        velY = 0
      }
      const target = e?.target || (latestX >= 0 ? document.elementFromPoint(latestX, latestY) : null)
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

    const onResize = () => {
      cachedToggleCenter = null
      cachedGalleryCloseCenter = null
    }
    window.addEventListener('resize', onResize)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
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
  }, [isAuthPage])

  // Keep video playing continuously across theme toggles and visibility changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [isNightDive])

  if (isAuthPage || (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)) {
    return null
  }

  const cursorNode = (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[99999999] will-change-transform select-none"
      style={{
        transformOrigin: '0 0',
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
          transform: `translate(-4.6%, -57.5%) scale(${isHovering ? 1.15 : 1.0})`,
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
