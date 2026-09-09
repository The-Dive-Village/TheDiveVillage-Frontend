/**
 * Intelligent Route & Asset Pre-Fetcher
 * Pre-warms dynamic imports and heavy assets during browser idle time
 * and on hover, achieving instantaneous (0ms) page navigation.
 */
import { loadCesium } from '../services/cesiumLoader'

const routeLoaders = {
  '/book-us': () => {
    import('../pages/BookUs')
    loadCesium().catch(() => {})
  },
  '/about': () => import('../pages/About'),
  '/services': () => import('../pages/Services'),
  '/gallery': () => import('../pages/Gallery'),
  '/shop': () => import('../pages/Shop'),
  '/contact': () => import('../pages/Contact'),
  '/login': () => import('../pages/Login'),
  '/signup': () => import('../pages/Signup'),
  '/cart': () => import('../pages/Cart'),
  '/wishlist': () => import('../pages/Wishlist'),
  '/checkout': () => import('../pages/Checkout')
}

const prefetchedRoutes = new Set()

export function prefetchRoute(path) {
  if (!path || prefetchedRoutes.has(path)) return
  
  // Find matching loader
  const cleanPath = path.split('?')[0].toLowerCase()
  const loader = routeLoaders[cleanPath]
  
  if (loader) {
    prefetchedRoutes.add(cleanPath)
    try {
      loader()
    } catch (e) {
      console.warn('Prefetch notice for', cleanPath, e)
    }
  }
}

// Automatically warm up critical high-traffic routes during idle time
export function initIdlePrefetching() {
  if (typeof window === 'undefined') return

  const warmAll = () => {
    // Stage 1: Critical primary routes after 1.5s
    setTimeout(() => {
      prefetchRoute('/book-us')
      prefetchRoute('/about')
      prefetchRoute('/services')
    }, 1500)

    // Stage 2: Secondary routes after 3.5s
    setTimeout(() => {
      prefetchRoute('/gallery')
      prefetchRoute('/shop')
      prefetchRoute('/contact')
    }, 3500)
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => warmAll(), { timeout: 3000 })
  } else {
    setTimeout(warmAll, 1200)
  }
}
