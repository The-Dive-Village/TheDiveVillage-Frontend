import { useEffect, useRef, useState } from 'react'

export default function Product3DViewer({ src, alt = '3D Product Model', productId }) {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const modelRef = useRef(null)

  const isCap = Boolean(
    (src && src.toLowerCase().includes('cap')) ||
    (alt && alt.toLowerCase().includes('cap')) ||
    productId === 'product-dive-cap'
  )

  useEffect(() => {
    if (typeof window !== 'undefined' && !customElements.get('model-viewer')) {
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js'
      script.onload = () => setScriptLoaded(true)
      document.head.appendChild(script)
    } else {
      setScriptLoaded(true)
    }
  }, [])

  // Handle two-finger horizontal drag on mobile/touchscreens and trackpads
  useEffect(() => {
    const viewer = modelRef.current
    if (!viewer) return

    let isTwoFingerTouch = false
    let lastTouchX = 0
    let thetaDeg = 0

    const readCurrentTheta = () => {
      try {
        if (typeof viewer.getCameraOrbit === 'function') {
          const orbit = viewer.getCameraOrbit()
          if (orbit && typeof orbit.theta === 'number') {
            return (orbit.theta * 180) / Math.PI
          }
        }
      } catch (err) {}
      return thetaDeg
    }

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        isTwoFingerTouch = true
        lastTouchX = (e.touches[0].clientX + e.touches[1].clientX) / 2
        thetaDeg = readCurrentTheta()
      }
    }

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && isTwoFingerTouch) {
        const currentX = (e.touches[0].clientX + e.touches[1].clientX) / 2
        const dx = currentX - lastTouchX
        lastTouchX = currentX

        // Moving fingers right turns model right, moving left turns left
        thetaDeg -= dx * 0.8
        viewer.cameraOrbit = `${thetaDeg}deg 75deg 110%`
        if (typeof viewer.jumpCameraToGoal === 'function') {
          viewer.jumpCameraToGoal()
        }
        if (e.cancelable) {
          e.preventDefault()
        }
      }
    }

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        isTwoFingerTouch = false
      }
    }

    // Two-finger trackpad horizontal swipe / wheel
    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > 1 || (e.shiftKey && Math.abs(e.deltaY) > 1)) {
        const delta = e.shiftKey ? e.deltaY : e.deltaX
        thetaDeg = readCurrentTheta() + delta * 0.45
        viewer.cameraOrbit = `${thetaDeg}deg 75deg 110%`
        if (typeof viewer.jumpCameraToGoal === 'function') {
          viewer.jumpCameraToGoal()
        }
        if (e.cancelable) {
          e.preventDefault()
        }
      }
    }

    viewer.addEventListener('touchstart', handleTouchStart, { passive: false })
    viewer.addEventListener('touchmove', handleTouchMove, { passive: false })
    viewer.addEventListener('touchend', handleTouchEnd, { passive: true })
    viewer.addEventListener('touchcancel', handleTouchEnd, { passive: true })
    viewer.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      viewer.removeEventListener('touchstart', handleTouchStart)
      viewer.removeEventListener('touchmove', handleTouchMove)
      viewer.removeEventListener('touchend', handleTouchEnd)
      viewer.removeEventListener('touchcancel', handleTouchEnd)
      viewer.removeEventListener('wheel', handleWheel)
    }
  }, [scriptLoaded])

  // Apply non-glossy, soft matte finish and double-sided rendering to 3D materials
  useEffect(() => {
    const viewer = modelRef.current
    if (!viewer) return

    const applyMatteAndDoubleSided = () => {
      try {
        if (viewer.model && viewer.model.materials) {
          viewer.model.materials.forEach((mat) => {
            // Enable double-sided rendering so inside of mesh doesn't disappear when turned
            if (typeof mat.setDoubleSided === 'function') {
              mat.setDoubleSided(true)
            } else {
              mat.doubleSided = true
            }

            const pbr = mat.pbrMetallicRoughness
            if (pbr) {
              pbr.setRoughnessFactor(isCap ? 0.65 : 0.82)
              pbr.setMetallicFactor(0.0)
            }
          })
        }
      } catch (err) {
        console.warn('Could not configure 3D material properties', err)
      }
    }

    viewer.addEventListener('load', applyMatteAndDoubleSided)
    if (viewer.loaded) {
      applyMatteAndDoubleSided()
    }

    return () => {
      viewer.removeEventListener('load', applyMatteAndDoubleSided)
    }
  }, [src, scriptLoaded, isCap])

  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[340px] bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EDF2F7] rounded-[28px] overflow-hidden flex items-center justify-center select-none">
      <model-viewer
        ref={modelRef}
        src={src}
        alt={alt}
        auto-rotate={autoRotate ? true : undefined}
        rotation-per-second="35deg"
        camera-controls
        disable-zoom
        disable-pan
        touch-action="none"
        interaction-prompt="auto"
        camera-orbit="0deg 75deg 110%"
        camera-target="auto auto auto"
        min-camera-orbit="auto 75deg auto"
        max-camera-orbit="auto 75deg auto"
        environment-image="neutral"
        exposure={isCap ? "2.5" : "1.4"}
        shadow-intensity={isCap ? "0.08" : "0.35"}
        shadow-softness="0.9"
        tone-mapping="commerce"
        bounds="tight"
        style={{ width: '100%', height: '100%', minHeight: '340px' }}
      >
        <div slot="poster" className="w-full h-full flex flex-col items-center justify-center bg-slate-100/80 backdrop-blur-sm">
          <div className="w-9 h-9 border-4 border-navy border-t-transparent rounded-full animate-spin mb-2" />
          <span className="text-xs font-bold text-navy uppercase tracking-widest">Loading 3D Model...</span>
        </div>
      </model-viewer>

      {/* Floating Badge (hidden on mobile) */}
      <div className="hidden sm:flex absolute top-4 right-4 bg-navy/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-[#FFCD00] rounded-full shadow-lg z-10 border border-[#FFCD00]/40 items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#FFCD00] animate-pulse" />
        <span>3D Interactive Model</span>
      </div>

      {/* Control Hint (hidden on mobile) */}
      <div className="hidden sm:flex absolute bottom-4 left-4 bg-navy/85 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold text-white/90 shadow-md z-10 pointer-events-none items-center gap-1.5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFCD00" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 11-.57-8.38l5.67-5.67" /></svg>
        <span>Drag sideways to rotate 360°</span>
      </div>

      {/* Bottom Right 360° Toggle Circle Controller */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 flex flex-col items-center gap-1.5 pointer-events-auto select-none">
        <span className="hidden sm:block text-[10px] font-bold text-white/90 uppercase tracking-widest bg-navy/80 px-2.5 py-0.5 rounded-md backdrop-blur-md border border-white/20 shadow-md">
          360° Toggle
        </span>
        <button
          type="button"
          onClick={() => setAutoRotate((prev) => !prev)}
          className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 transition-all duration-300 backdrop-blur-md flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 cursor-pointer ${
            autoRotate
              ? 'border-[#FFCD00] bg-navy/85 shadow-[#FFCD00]/30'
              : 'border-white/40 bg-navy/60'
          }`}
          title={autoRotate ? 'Pause 360° Auto-Spin' : 'Enable 360° Auto-Spin'}
        >
          <div
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full shadow-md border transition-all duration-300 flex items-center justify-center font-extrabold text-[8px] sm:text-[9px] ${
              autoRotate
                ? 'bg-[#FFCD00] border-white text-navy scale-110 animate-pulse'
                : 'bg-white/80 border-white/50 text-navy/70'
            }`}
          >
            360°
          </div>
        </button>
      </div>
    </div>
  )
}
