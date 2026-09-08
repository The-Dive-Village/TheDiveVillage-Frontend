import { useEffect, useState } from 'react'

export default function Product3DViewer({ src, alt = '3D Product Model' }) {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)

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

  return (
    <div className="relative w-full h-full min-h-[420px] bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] rounded-[32px] overflow-hidden flex items-center justify-center select-none">
      <model-viewer
        src={src}
        alt={alt}
        auto-rotate={autoRotate ? true : undefined}
        rotation-per-second="35deg"
        camera-controls
        camera-orbit="0deg 75deg 120%"
        camera-target="auto auto auto"
        field-of-view="auto"
        min-camera-orbit="auto 0deg auto"
        max-camera-orbit="auto 180deg auto"
        touch-action="pan-y"
        shadow-intensity="1"
        shadow-softness="0.8"
        exposure="1.0"
        bounds="tight"
        style={{ width: '100%', height: '100%', minHeight: '420px' }}
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
      <div className="absolute bottom-4 left-4 bg-navy/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-bold text-white/90 shadow-md z-10 pointer-events-none flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFCD00" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 11-.57-8.38l5.67-5.67" /></svg>
        <span>Drag to rotate 360° • Scroll to zoom</span>
      </div>

      {/* Bottom Right 360° Toggle */}
      <button
        type="button"
        onClick={() => setAutoRotate((prev) => !prev)}
        className={`absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all duration-300 backdrop-blur-md cursor-pointer border ${
          autoRotate
            ? 'bg-[#00223D]/95 text-[#FFCD00] border-[#FFCD00]/50 hover:scale-105 shadow-[#FFCD00]/20'
            : 'bg-white/90 text-navy/70 border-navy/20 hover:text-navy hover:bg-white hover:scale-105'
        }`}
        title={autoRotate ? 'Pause 360° Rotation' : 'Enable 360° Rotation'}
      >
        <span className={`w-2 h-2 rounded-full ${autoRotate ? 'bg-[#FFCD00] animate-ping' : 'bg-navy/40'}`} />
        <span>360° TOGGLE ({autoRotate ? 'ON' : 'OFF'})</span>
      </button>
    </div>
  )
}
