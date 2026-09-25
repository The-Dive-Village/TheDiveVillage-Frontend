/**
 * Media Ready Manager
 * Coordinates high-priority media loading (such as the 360 Hero sphere video)
 * with the application Preloader to guarantee a zero-gap, instant handoff.
 */

const HERO_VIDEO_SRC = 'https://res.cloudinary.com/bbgt5nk7/video/upload/v1790248244/dive-village/hero-360/cj9jvkh5j6sozf2fhf0x.mp4'

let isHeroVideoReady = false
const listeners = new Set()
let warmHeroVideo = null

export function setHeroVideoReady(ready = true) {
  if (isHeroVideoReady === ready) return
  isHeroVideoReady = ready
  listeners.forEach((callback) => {
    try {
      callback(ready)
    } catch (e) {
      console.error('Error in hero video ready listener:', e)
    }
  })
}

export function getHeroVideoReady() {
  return isHeroVideoReady
}

export function subscribeHeroVideoReady(callback) {
  listeners.add(callback)
  if (isHeroVideoReady) {
    callback(true)
  }
  return () => {
    listeners.delete(callback)
  }
}

/**
 * Gets or initializes the singleton hero video DOM element.
 * Eagerly buffers the 3840x1920 stream from millisecond zero.
 */
export function getOrCreateHeroVideoElement(src = HERO_VIDEO_SRC, playbackRate = 0.5) {
  if (typeof window === 'undefined') return null

  if (warmHeroVideo && warmHeroVideo.src === src) {
    return warmHeroVideo
  }

  let container = document.getElementById('hero-360-video-dom-root')
  if (!container) {
    container = document.createElement('div')
    container.id = 'hero-360-video-dom-root'
    container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0.001;pointer-events:none;overflow:hidden;z-index:-99999;'
    document.body.appendChild(container)
  }

  const video = document.createElement('video')
  video.crossOrigin = 'anonymous'
  video.muted = true
  video.defaultMuted = true
  video.volume = 0
  video.playsInline = true
  video.setAttribute('muted', '')
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', '')
  video.loop = true
  video.autoplay = true
  video.preload = 'auto'
  video.playbackRate = playbackRate
  video.setAttribute('fetchpriority', 'high')
  video.src = src

  container.appendChild(video)
  warmHeroVideo = video

  const evaluateReadiness = () => {
    if (video.readyState >= 3 && video.videoWidth > 0 && video.videoHeight > 0) {
      setHeroVideoReady(true)
    }
  }

  const handleNetworkStall = () => {
    // If waiting or stalled, attempt resume without resetting or recreating the video
    if (video.paused && video.readyState >= 2) {
      video.play().catch(() => {})
    }
  }

  const mediaEvents = [
    'loadstart',
    'loadedmetadata',
    'loadeddata',
    'canplay',
    'canplaythrough',
    'progress',
    'playing',
    'timeupdate',
    'resize'
  ]

  mediaEvents.forEach((evt) => {
    video.addEventListener(evt, evaluateReadiness)
  })

  video.addEventListener('waiting', handleNetworkStall)
  video.addEventListener('stalled', handleNetworkStall)

  // Start buffering immediately
  video.play().catch(() => {
    // Autoplay unlock retry on next interaction
  })

  // Initial check
  evaluateReadiness()

  return video
}

// Start eager buffering on client boot
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => getOrCreateHeroVideoElement())
  } else {
    getOrCreateHeroVideoElement()
  }
}

