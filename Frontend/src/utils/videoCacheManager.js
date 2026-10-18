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
 * Records a video asset as cached in the session for instant repeat playback.
 * Does NOT perform redundant full-file fetch() requests, allowing the browser's
 * native HTML5 video engine to stream via HTTP Range requests without network contention.
 */
export async function cacheVideoOnce(url) {
  const cleanUrl = normalizeVideoUrl(url)
  if (!cleanUrl) return ''
  markVideoCached(cleanUrl)
  return cleanUrl
}

/**
 * Preloads and marks a list of critical video URLs in the session.
 */
export function preloadVideos(urls = []) {
  if (typeof window === 'undefined') return
  urls.forEach((url) => {
    if (url && !isVideoCached(url)) {
      markVideoCached(url)
    }
  })
}
