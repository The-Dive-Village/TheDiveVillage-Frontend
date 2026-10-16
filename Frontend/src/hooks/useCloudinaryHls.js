import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

/**
 * Attaches and manages an HLS stream onto an HTML5 <video> element with quality-first ABR settings.
 * Designed specifically for 360-degree WebGL equirectangular video textures.
 *
 * @param {Object} params
 * @param {HTMLVideoElement} params.video - Target HTML5 video element
 * @param {string} params.hlsUrl - Cloudinary HLS (.m3u8) URL
 * @param {string} [params.mp4FallbackUrl] - Direct MP4 fallback URL
 * @param {boolean} [params.autoPlay=true] - Attempt auto-playback
 * @param {number} [params.playbackRate=1.0] - Playback speed
 * @param {Function} [params.onLoaded] - Callback when manifest is parsed
 * @param {Function} [params.onError] - Callback on fatal error
 * @returns {Object} Controller with destroy(), stopLoad(), startLoad(), and hls instance
 */
export function attachHlsStream({
  video,
  hlsUrl,
  mp4FallbackUrl,
  autoPlay = true,
  playbackRate = 1.0,
  onLoaded,
  onError,
}) {
  if (!video) {
    return {
      destroy: () => {},
      stopLoad: () => {},
      startLoad: () => {},
      hls: null,
    }
  }

  let hlsInstance = null
  let isDestroyed = false

  const attemptPlay = () => {
    if (isDestroyed || !video) return
    video.playbackRate = playbackRate
    if (video.paused && autoPlay) {
      const p = video.play()
      if (p !== undefined) {
        p.catch((err) => {
          // Handled gracefully (e.g. autoplay restriction waiting for user interaction)
        })
      }
    }
  }

  if (Hls.isSupported() && hlsUrl) {
    const hls = new Hls({
      // NON-NEGOTIABLE FOR 360° VIDEO:
      // Prevent hls.js from capping quality to the canvas/window DOM dimensions.
      capLevelToPlayerSize: false,
      maxBufferLength: 20,
      maxMaxBufferLength: 40,
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 10,
      startLevel: -1,
      testBandwidth: true,
      abrEwmaFastLive: 2.0,
      abrEwmaSlowLive: 6.0,
    })
    hlsInstance = hls

    hls.loadSource(hlsUrl)
    hls.attachMedia(video)

    hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
      if (isDestroyed) return
      // Always start on high-definition top-tier level (4K / 3840x1920) so 360 video is crisp and never blurry
      if (data.levels && data.levels.length > 0) {
        let maxBitrateIdx = 0
        let maxBitrate = 0
        data.levels.forEach((lvl, idx) => {
          if (lvl.bitrate > maxBitrate) {
            maxBitrate = lvl.bitrate
            maxBitrateIdx = idx
          }
        })
        hls.startLevel = maxBitrateIdx
        hls.nextLevel = maxBitrateIdx
      }
      attemptPlay()
      if (onLoaded) onLoaded({ levels: data.levels, hls })
    })

    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (isDestroyed) return
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.warn('[HLS] Network error encountered, attempting recovery:', data.details)
            hls.startLoad()
            break
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.warn('[HLS] Media error encountered, attempting recovery:', data.details)
            hls.recoverMediaError()
            break
          default:
            console.warn('[HLS] Unrecoverable fatal error, falling back to MP4:', data.details)
            hls.destroy()
            hlsInstance = null
            if (mp4FallbackUrl && video.src !== mp4FallbackUrl) {
              video.src = mp4FallbackUrl
              attemptPlay()
            }
            if (onError) onError(data)
            break
        }
      }
    })
  } else if (video.canPlayType('application/vnd.apple.mpegurl') && hlsUrl) {
    // Native Safari HLS (iOS and macOS Safari)
    video.src = hlsUrl
    const onLoadedMetadata = () => {
      attemptPlay()
      if (onLoaded) onLoaded({ native: true })
    }
    video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true })
  } else if (mp4FallbackUrl) {
    // Direct MP4 fallback for browsers without HLS support
    video.src = mp4FallbackUrl
    const onLoadedMetadata = () => {
      attemptPlay()
      if (onLoaded) onLoaded({ mp4Fallback: true })
    }
    video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true })
  }

  return {
    destroy: () => {
      isDestroyed = true
      if (hlsInstance) {
        hlsInstance.destroy()
        hlsInstance = null
      }
    },
    stopLoad: () => {
      if (hlsInstance) {
        hlsInstance.stopLoad()
      }
    },
    startLoad: () => {
      if (hlsInstance) {
        hlsInstance.startLoad()
      }
    },
    hls: hlsInstance,
  }
}

/**
 * React hook to manage HLS playback lifecycle on a video element.
 *
 * @param {Object} options
 * @param {React.RefObject<HTMLVideoElement>} options.videoRef
 * @param {string} options.hlsUrl
 * @param {string} [options.mp4FallbackUrl]
 * @param {boolean} [options.autoPlay=true]
 * @param {number} [options.playbackRate=1.0]
 * @param {boolean} [options.isVisible=true]
 */
export function useCloudinaryHls({
  videoRef,
  hlsUrl,
  mp4FallbackUrl,
  autoPlay = true,
  playbackRate = 1.0,
  isVisible = true,
}) {
  const controllerRef = useRef(null)
  const wasPlayingRef = useRef(false)

  useEffect(() => {
    const video = videoRef?.current
    if (!video || !hlsUrl) return

    const controller = attachHlsStream({
      video,
      hlsUrl,
      mp4FallbackUrl,
      autoPlay,
      playbackRate,
    })
    controllerRef.current = controller

    return () => {
      controller.destroy()
      controllerRef.current = null
    }
  }, [videoRef, hlsUrl, mp4FallbackUrl, autoPlay, playbackRate])

  // Manage Page Visibility: stop fragment downloads & pause on hidden, resume on visible
  useEffect(() => {
    const video = videoRef?.current
    const controller = controllerRef.current
    if (!video) return

    if (!isVisible) {
      wasPlayingRef.current = !video.paused
      video.pause()
      if (controller) {
        controller.stopLoad()
      }
    } else {
      if (controller) {
        controller.startLoad()
      }
      if (wasPlayingRef.current) {
        video.playbackRate = playbackRate
        video.play().catch(() => {})
      }
    }
  }, [isVisible, playbackRate, videoRef])

  return controllerRef
}

export default useCloudinaryHls
