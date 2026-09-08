import { useEffect, useRef, useState } from 'react'

export default function Product3DViewer({ src, alt = '3D Product Model' }) {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const modelRef = useRef(null)

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
              pbr.setRoughnessFactor(0.82)
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
  }, [src, scriptLoaded])

  return (
    <div className="relative w-full h-full min-h-[340px] bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EDF2F7] rounded-[28px] overflow-hidden flex items-center justify-center select-none touch-none">
      <model-viewer
        ref={modelRef}
        src={src}
        alt={alt}
        auto-rotate={autoRotate ? true : undefined}
        rotation-per-second="35deg"
        camera-controls
        touch-action="none"
        interaction-prompt="auto"
        camera-orbit="0deg 75deg 110%"
        camera-target="auto auto auto"
        field-of-view="auto"
        min-field-of-view="12deg"
        max-field-of-view="65deg"
        min-camera-orbit="auto 15deg 40%"
        max-camera-orbit="auto 165deg 260%"
        environment-image="neutral"
        exposure="1.35"
        shadow-intensity="0.4"
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

      {/* Floating Badge */}
      <div className="absolute top-4 right-4 bg-navy/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-[#FFCD00] rounded-full shadow-lg z-10 border border-[#FFCD00]/40 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#FFCD00] animate-pulse" />
        <span>3D Interactive Model</span>
      </div>

      {/* Control Hint */}
      <div className="absolute bottom-4 left-4 bg-navy/85 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold text-white/90 shadow-md z-10 pointer-events-none flex items-center gap-1.5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFCD00" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 11-.57-8.38l5.67-5.67" /></svg>
        <span>Pinch: Zoom • 2-finger: Move • Drag: Rotate</span>
      </div>

      {/* Bottom Right 360° Toggle Circle Controller */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col items-center gap-1.5 pointer-events-auto select-none">
        <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest bg-navy/80 px-2.5 py-0.5 rounded-md backdrop-blur-md border border-white/20 shadow-md">
          360° Toggle
        </span>
        <button
          type="button"
          onClick={() => setAutoRotate((prev) => !prev)}
          className={`relative w-14 h-14 rounded-full border-2 transition-all duration-300 backdrop-blur-md flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 cursor-pointer ${
            autoRotate
              ? 'border-[#FFCD00] bg-navy/85 shadow-[#FFCD00]/30'
              : 'border-white/40 bg-navy/60'
          }`}
          title={autoRotate ? 'Pause 360° Auto-Spin' : 'Enable 360° Auto-Spin'}
        >
          <div
            className={`w-7 h-7 rounded-full shadow-md border transition-all duration-300 flex items-center justify-center font-extrabold text-[9px] ${
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
