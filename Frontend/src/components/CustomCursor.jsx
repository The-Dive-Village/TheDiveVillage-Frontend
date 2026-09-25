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

    const checkNormalCursor = (target) => {
      if (!target || !(target instanceof Element)) return false
      return !!target.closest('input, textarea, select, [contenteditable="true"], .normal-cursor, [data-normal-cursor]')
    }

    const checkInteractive = (target) => {
      if (!target || !(target instanceof Element)) return false
      return !!target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer, [data-cursor-interactive], label')
    }

    const updateCursorPosition = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${latestX}px, ${latestY}px, 0)`

        if (isOverNormalCursor || isHidden) {
          cursorRef.current.style.opacity = '0'
        } else {
          cursorRef.current.style.opacity = '1'
        }
      }

      const now = performance.now()
      if (now - lastCheckTime > 30 && latestX >= 0 && latestY >= 0) {
        lastCheckTime = now
        const elUnderPoint = document.elementFromPoint(latestX, latestY) || currentTarget
        if (elUnderPoint) {
          isOverNormalCursor = checkNormalCursor(elUnderPoint)
          const hovering = checkInteractive(elUnderPoint)
          if (hovering !== isHoveringInteractive) {
            isHoveringInteractive = hovering
            setIsHovering(hovering)
          }
        }
      }

      rafId = requestAnimationFrame(updateCursorPosition)
    }

    // Start high-performance rAF loop
    rafId = requestAnimationFrame(updateCursorPosition)

    const onMouseMove = (e) => {
      latestX = e.clientX
      latestY = e.clientY
      currentTarget = e.target
      isOverNormalCursor = checkNormalCursor(e.target)

      if (isHidden) {
        isHidden = false
      }
    }

    const onScroll = () => {
      if (latestX >= 0 && latestY >= 0) {
        const el = document.elementFromPoint(latestX, latestY)
        if (el) {
          currentTarget = el
          isOverNormalCursor = checkNormalCursor(el)
        }
      }
    }

    const onMouseLeave = () => {
      isHidden = true
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0'
      }
      setIsHovering(false)
    }

    const onMouseEnter = () => {
      isHidden = false
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1'
      }
    }

    const onFocusIn = (e) => {
      if (checkNormalCursor(e.target) && cursorRef.current) {
        cursorRef.current.style.opacity = '0'
      }
    }

    // Listener setups
    const eventType = window.PointerEvent ? 'pointermove' : 'mousemove'
    window.addEventListener(eventType, onMouseMove, { passive: true })
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
      window.removeEventListener(eventType, onMouseMove)
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
        transition: 'opacity 0.08s ease-out',
      }}
    >
      {/* Night Dive Mode Underwater Flashlight Beam & Spotlight Aura */}
      {isNightDive && (
        <div
          className="pointer-events-none absolute rounded-full transition-all duration-300"
          style={{
            width: isHovering ? '380px' : '320px',
            height: isHovering ? '380px' : '320px',
            left: isHovering ? '-190px' : '-160px',
            top: isHovering ? '-190px' : '-160px',
            background: isHovering
              ? 'radial-gradient(circle, rgba(0, 242, 254, 0.38) 0%, rgba(255, 205, 0, 0.22) 35%, rgba(0, 56, 101, 0.08) 65%, transparent 80%)'
              : 'radial-gradient(circle, rgba(0, 242, 254, 0.24) 0%, rgba(255, 205, 0, 0.14) 30%, rgba(0, 56, 101, 0.05) 60%, transparent 75%)',
            mixBlendMode: 'screen',
            filter: 'blur(6px)',
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
                ? 'drop-shadow(0 0 12px #00F2FE) drop-shadow(0 0 24px rgba(0, 242, 254, 0.8)) brightness(1.35) contrast(1.15)'
                : 'drop-shadow(0 0 8px #00F2FE) drop-shadow(0 0 16px rgba(0, 242, 254, 0.6)) brightness(1.25) contrast(1.1)')
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
