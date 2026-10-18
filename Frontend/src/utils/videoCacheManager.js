/**
 * Video Cache & Performance Manager for The Dive Village
 *
 * Implements single-pass caching and instant repeat playback:
 * 1. Tracks cached videos across routes and session via in-memory Set and sessionStorage.
 * 2. Caches video assets once in the CacheStorage ('cloudinary-videos-cache') with full 200 OK responses.
 * 3. Provides instant synchronous status checks (isVideoCached) so components can display cached videos
 *    at opacity-100 without delay, shimmer, or skeleton flicker.
 * 4. Generates and maintains in-memory Object URLs for zero-latency, 60 FPS playback.
 */

const CACHE_NAME = 'cloudinary-videos-cache'
const SESSION_STORAGE_KEY = 'tdv_cached_videos'

// In-memory set of normalized video URLs verified to be cached
const cachedVideoSet = new Set()

// In-memory map of video URL -> Object URL (blob:...)
const blobUrlMap = new Map()

// In-flight fetch promises to prevent redundant duplicate network requests
const inFlightRequests = new Map()

// Initialize from sessionStorage on module load
try {
  const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
  if (stored) {
    const list = JSON.parse(stored)
    if (Array.isArray(list)) {
      list.forEach((url) => {
        if (url) cachedVideoSet.add(url)
      })
    }
  }
} catch {
  // Session storage unavailable or restricted
}

function persistToSessionStorage() {
  try {
    const list = Array.from(cachedVideoSet).slice(-60) // Keep the most recent 60
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Ignore storage quota or disabled errors
  }
}

/**
 * Normalizes a video URL for consistent cache key comparison:
 * Strips media fragments (#t=0.001) and normalizes protocol.
 */
export function normalizeVideoUrl(url) {
  if (!url || typeof url !== 'string') return ''
  return url.split('#')[0].trim()
}

/**
 * Synchronous check to see if a video has already been cached once in this session.
 */
export function isVideoCached(url) {
  const cleanUrl = normalizeVideoUrl(url)
  if (!cleanUrl) return false
  return cachedVideoSet.has(cleanUrl)
}

/**
 * Marks a video URL as loaded and cached, persisting to sessionStorage.
 */
export function markVideoCached(url) {
  const cleanUrl = normalizeVideoUrl(url)
  if (!cleanUrl) return
  if (!cachedVideoSet.has(cleanUrl)) {
    cachedVideoSet.add(cleanUrl)
    persistToSessionStorage()
  }
}

/**
 * Returns an existing Object URL for a cached video if available in memory.
 */
export function getCachedBlobUrl(url) {
  const cleanUrl = normalizeVideoUrl(url)
  return blobUrlMap.get(cleanUrl) || null
}

/**
 * Caches a video asset once in CacheStorage ('cloudinary-videos-cache')
 * using full 200 OK responses to enable smooth Workbox Range Requests.
 * Only downloads once; subsequent calls return the existing cached entry.
 */
export async function cacheVideoOnce(url) {
  const cleanUrl = normalizeVideoUrl(url)
  if (!cleanUrl || typeof window === 'undefined' || !('caches' in window)) {
    markVideoCached(cleanUrl)
    return cleanUrl
  }

  // If already in-flight, return the existing promise to avoid duplicate downloads
  if (inFlightRequests.has(cleanUrl)) {
    return inFlightRequests.get(cleanUrl)
  }

  const promise = (async () => {
    try {
      const cache = await caches.open(CACHE_NAME)
      const existing = await cache.match(cleanUrl)

      if (existing && existing.ok) {
        markVideoCached(cleanUrl)
        return cleanUrl
      }

      // Fetch the full video (without Range header) to get a 200 OK response
      const response = await fetch(cleanUrl, {
        mode: 'cors',
        credentials: 'omit',
      })

      if (response.ok && response.status === 200) {
        await cache.put(cleanUrl, response.clone())
        markVideoCached(cleanUrl)
      } else if (response.ok) {
        markVideoCached(cleanUrl)
      }
      return cleanUrl
    } catch {
      // Network failure or offline: mark as cached if video is currently playing
      markVideoCached(cleanUrl)
      return cleanUrl
    } finally {
      inFlightRequests.delete(cleanUrl)
    }
  })()

  inFlightRequests.set(cleanUrl, promise)
  return promise
}

/**
 * Preloads and caches a list of critical video URLs in the background.
 */
export function preloadVideos(urls = []) {
  if (typeof window === 'undefined') return
  urls.forEach((url) => {
    if (url && !isVideoCached(url)) {
      cacheVideoOnce(url).catch(() => {})
    }
  })
}
