import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { useLenis } from '../utils/lenisReact'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  const lenis = useLenis()
  const isRestoring = useRef(false)

  // Disable native scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Save scroll position for the current route
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (isRestoring.current) return // Do not save while forcing restoration
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || (lenis ? lenis.scroll : 0)
          sessionStorage.setItem(`scroll-${pathname}`, scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    if (lenis) {
      lenis.on('scroll', handleScroll)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (lenis) {
        lenis.off('scroll', handleScroll)
      }
    }
  }, [pathname, lenis])

  // Restore scroll position when route changes
  useEffect(() => {
    isRestoring.current = true
    const savedPosStr = sessionStorage.getItem(`scroll-${pathname}`)
    const targetPos = savedPosStr ? parseFloat(savedPosStr) : 0

    const restore = () => {
      window.scrollTo({ top: targetPos, left: 0, behavior: 'instant' })
      if (lenis) {
        lenis.scrollTo(targetPos, { immediate: true })
      }
    }

    // Try immediately
    restore()

    // Poll briefly to ensure scroll holds after React/Suspense layout shifts
    let attempts = 0
    const interval = setInterval(() => {
      restore()
      attempts++
      if (attempts >= 6) { // 6 * 50ms = 300ms total wait time
        clearInterval(interval)
        setTimeout(() => { isRestoring.current = false }, 50)
      }
    }, 50)

    return () => {
      clearInterval(interval)
      isRestoring.current = false
    }
  }, [pathname, lenis])

  return null
}
