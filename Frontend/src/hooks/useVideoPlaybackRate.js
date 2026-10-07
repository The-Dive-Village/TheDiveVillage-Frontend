import { useEffect, useRef } from 'react'

export function enforcePlaybackRate(video, rate = 0.7) {
  if (!video) return
  try {
    video.defaultPlaybackRate = rate
    if (video.playbackRate !== rate) {
      video.playbackRate = rate
    }
  } catch (e) {}
}

export function useVideoPlaybackRate(rate = 0.7) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const applyRate = () => enforcePlaybackRate(video, rate)

    applyRate()

    const events = [
      'loadstart',
      'loadedmetadata',
      'loadeddata',
      'canplay',
      'canplaythrough',
      'play',
      'playing',
      'ratechange',
      'timeupdate',
      'seeking',
      'seeked'
    ]

    events.forEach((evt) => video.addEventListener(evt, applyRate))

    return () => {
      events.forEach((evt) => video.removeEventListener(evt, applyRate))
    }
  }, [rate])

  return videoRef
}

export default useVideoPlaybackRate
