import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { useLenis } from '../utils/lenisReact'

export default function ScrollToTop() {
  const location = useLocation()
  const lenis = useLenis()
  const userScrolledRef = useRef(false)

  // Disable browser's native automatic scroll restoration and clean legacy session data
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    try {
      const keysToRemove = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && key.startsWith('scroll-')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((k) => sessionStorage.removeItem(k))
    } catch {
      // ignore storage access issues
    }
  }, [])

  // Execute scroll to top on every navigation (route, subpage, query params)
  useEffect(() => {
    userScrolledRef.current = false

    const scrollToTopPosition = () => {
      // If user has already started manually scrolling after load, do not interrupt them
      if (userScrolledRef.current) return

      // If URL has a hash anchor, scroll to the anchor element if it exists
      if (location.hash) {
        const hashId = decodeURIComponent(location.hash.replace('#', ''))
        const targetElement = document.getElementById(hashId) || document.querySelector(location.hash)
        if (targetElement) {
          if (lenis && typeof lenis.scrollTo === 'function') {
            lenis.scrollTo(targetElement, { immediate: true, force: true })
          } else {
            targetElement.scrollIntoView({ behavior: 'auto' })
          }
          return
        }
      }

      // 1. Force native window and document scroll to top
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      if (document.documentElement) {
        document.documentElement.scrollTop = 0
      }
      if (document.body) {
        document.body.scrollTop = 0
      }

      // 2. Force Lenis smooth scroll engine to top immediately
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(0, { immediate: true, force: true })
      }
    }

    // Stop enforcing scroll reset if the user manually wheels or touches
    const onUserScroll = () => {
      userScrolledRef.current = true
    }
    window.addEventListener('wheel', onUserScroll, { passive: true, once: true })
    window.addEventListener('touchmove', onUserScroll, { passive: true, once: true })

    // Execute immediately on route change
    scrollToTopPosition()

    // Execute on the next animation frame
    const rafId = requestAnimationFrame(scrollToTopPosition)

    // Execute across React Suspense lazy chunk loading and dynamic DOM layout shifts
    const t1 = setTimeout(scrollToTopPosition, 50)
    const t2 = setTimeout(scrollToTopPosition, 120)
    const t3 = setTimeout(scrollToTopPosition, 250)
    const t4 = setTimeout(scrollToTopPosition, 400)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      window.removeEventListener('wheel', onUserScroll)
      window.removeEventListener('touchmove', onUserScroll)
    }
  }, [location.pathname, location.search, location.key, lenis])

  // Handle in-page link clicks (e.g. clicking a link to the current page/subpage)
  useEffect(() => {
    const handleLinkClick = (e) => {
      const anchor = e.target.closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href) return

      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('viber:')) {
        return
      }
      if (anchor.target === '_blank') return

      try {
        const url = new URL(anchor.href, window.location.href)
        if (url.origin === window.location.origin) {
          // If clicking a link pointing to the same pathname + search without hash
          if (url.pathname === location.pathname && url.search === location.search && !url.hash) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
            if (document.documentElement) document.documentElement.scrollTop = 0
            if (document.body) document.body.scrollTop = 0
            if (lenis && typeof lenis.scrollTo === 'function') {
              lenis.scrollTo(0, { immediate: true, force: true })
            }
          }
        }
      } catch {
        // ignore invalid URL
      }
    }

    document.addEventListener('click', handleLinkClick, { capture: true })
    return () => document.removeEventListener('click', handleLinkClick, { capture: true })
  }, [location.pathname, location.search, lenis])

  return null
}
