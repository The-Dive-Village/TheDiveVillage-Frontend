import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import cursorVideo from '../assets/cursor.webm'
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

    const onMouseMove = (e) => {
      const x = e.clientX
      const y = e.clientY

      const overNormal = checkNormalCursor(e.target)
      isOverNormalCursor = overNormal

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
        if (overNormal) {
          cursorRef.current.style.opacity = '0'
          return
        }
        if (isHidden) {
          isHidden = false
          cursorRef.current.style.opacity = '1'
        } else {
          cursorRef.current.style.opacity = '1'
        }
      }

      // Check interactive targets smoothly with time throttling (max once per 40ms)
      const now = performance.now()
      if (now - lastCheckTime > 40) {
        lastCheckTime = now
        const hovering = checkInteractive(e.target)
        if (hovering !== isHoveringInteractive) {
          isHoveringInteractive = hovering
          setIsHovering(hovering)
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

    window.addEventListener('pointermove', onMouseMove, { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })
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
      window.removeEventListener('pointermove', onMouseMove)
      window.removeEventListener('mousemove', onMouseMove)
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
        transition: 'opacity 0.12s ease-out',
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
        className="will-change-transform transition-transform duration-200"
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
