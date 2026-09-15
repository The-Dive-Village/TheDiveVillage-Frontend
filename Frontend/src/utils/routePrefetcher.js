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

// Automatically warm up all routes immediately for zero page navigation delay
export function initIdlePrefetching() {
  if (typeof window === 'undefined') return

  const warmAll = () => {
    Object.keys(routeLoaders).forEach((path) => prefetchRoute(path))
  }

  if (document.readyState === 'complete') {
    warmAll()
  } else {
    window.addEventListener('load', warmAll, { once: true })
    setTimeout(warmAll, 300)
  }
}
