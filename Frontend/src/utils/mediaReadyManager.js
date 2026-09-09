/**
 * Media Ready Manager
 * Coordinates high-priority media preloading (such as the 360 Hero sphere video)
 * with the application Preloader to guarantee a zero-gap, instant handoff without
 * blank screen or color flashes.
 */

let isHeroVideoReady = false
const listeners = new Set()

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
