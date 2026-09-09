// Singleton Promise-based loader for Cesium scripts and styles
let cesiumLoadPromise = null

export function loadCesium() {
  if (typeof window !== 'undefined' && window.Cesium) {
    return Promise.resolve(window.Cesium)
  }
  if (cesiumLoadPromise) {
    return cesiumLoadPromise
  }

  cesiumLoadPromise = new Promise((resolve, reject) => {
    const CSS_URL = 'https://cesium.com/downloads/cesiumjs/releases/1.132/Build/Cesium/Widgets/widgets.css'
    const SCRIPT_URL = 'https://cesium.com/downloads/cesiumjs/releases/1.132/Build/Cesium/Cesium.js'

    if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = CSS_URL
      document.head.appendChild(link)
    }

    if (window.Cesium) {
      resolve(window.Cesium)
      return
    }

    const existingScript = document.querySelector(`script[src="${SCRIPT_URL}"]`)
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.Cesium))
      existingScript.addEventListener('error', (err) => reject(err))
      return
    }

    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => {
      window.CESIUM_BASE_URL = 'https://cesium.com/downloads/cesiumjs/releases/1.132/Build/Cesium/'
      resolve(window.Cesium)
    }
    script.onerror = () => {
      cesiumLoadPromise = null
      reject(new Error('Failed to load Cesium script'))
    }
    document.head.appendChild(script)
  })

  return cesiumLoadPromise
}
