import { useState, useEffect, Suspense, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useVideoTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useLocation } from 'react-router'
import videoFile from '@video-optimized/Hero.mp4'
import divingFile from '@video-optimized/diving.mp4'
import bookFile from '@video-optimized/Book.mp4'
import underwaterAudio from '../assets/Underwater.mp3.mpeg'

function VideoSphere({ videoSrc, isMuted, joystickVelocity }) {
  const meshRef = useRef()
  const meshRef2 = useRef()
  const meshRef3 = useRef()
  const targetRotation = useRef({ x: 0, y: 0 })
  const targetOpacity2 = useRef(0)
  const targetOpacity3 = useRef(0)
  const location = useLocation()
  const isHome = location.pathname === '/'

  const texture = useVideoTexture(videoSrc, {
    crossOrigin: 'Anonymous',
    muted: true,
    loop: true,
    start: true,
    playsInline: true,
  })
  texture.colorSpace = THREE.SRGBColorSpace

  const texture2 = useVideoTexture(bookFile, {
    crossOrigin: 'Anonymous',
    muted: true,
    loop: true,
    start: true,
    playsInline: true,
  })
  texture2.colorSpace = THREE.SRGBColorSpace

  const texture3 = useVideoTexture(divingFile, {
    crossOrigin: 'Anonymous',
    muted: true,
    loop: true,
    start: true,
    playsInline: true,
  })
  texture3.colorSpace = THREE.SRGBColorSpace

  useEffect(() => {
    if (texture && texture.image) {
      texture.image.muted = isMuted
      texture.image.playbackRate = 0.5
    }
  }, [isMuted, texture])

  useEffect(() => {
    if (texture2 && texture2.image) {
      texture2.image.muted = isMuted
      texture2.image.playbackRate = 0.5
    }
  }, [isMuted, texture2])

  useEffect(() => {
    if (texture3 && texture3.image) {
      texture3.image.muted = isMuted
      texture3.image.playbackRate = 0.5
    }
  }, [isMuted, texture3])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const isAbout = location.pathname === '/about'
      const INITIAL_YAW = Math.PI / 2.65 - (Math.PI * 1.1) // Shifted a little right from previous
      // Tilt book.mp4 (About page) more downwards to center it
      const INITIAL_PITCH = isAbout ? -(Math.PI / 6) : (Math.PI / 16)

      const aboutEl = document.getElementById('about-section')
      const programsEl = document.getElementById('programs-section')
      
      const diveSectionEl = document.getElementById('who-can-dive-section')
      const testimonialsEl = document.getElementById('testimonials-section')

      if (isHome) {
        const fadeStart = window.innerHeight * 0.85
        const fadeEnd = window.innerHeight * 0.25

        if (diveSectionEl) {
          const diveRect = diveSectionEl.getBoundingClientRect()
          if (diveRect.top < fadeStart) {
            targetOpacity2.current = diveRect.top < fadeEnd ? 1 : 1 - (diveRect.top - fadeEnd) / (fadeStart - fadeEnd)
          } else {
            targetOpacity2.current = 0
          }
        }

        if (testimonialsEl) {
          const testRect = testimonialsEl.getBoundingClientRect()
          if (testRect.top < fadeStart) {
            targetOpacity3.current = testRect.top < fadeEnd ? 1 : 1 - (testRect.top - fadeEnd) / (fadeStart - fadeEnd)
          } else {
            targetOpacity3.current = 0
          }
        }
      }

      if (!aboutEl || !programsEl) {
        // Fallback if elements aren't mounted yet
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0
        targetRotation.current.y = INITIAL_YAW
        targetRotation.current.x = INITIAL_PITCH + scrollProgress * (Math.PI * 2)
        return
      }

      const aboutRect = aboutEl.getBoundingClientRect()
      const programsRect = programsEl.getBoundingClientRect()
      
      // Calculate absolute positions relative to the top of the document
      const aboutTop = scrollY + aboutRect.top
      const programsTop = scrollY + programsRect.top

      if (scrollY < aboutTop) {
        // 1. Before About Section
        // Move slightly downwards
        const progress = aboutTop > 0 ? scrollY / aboutTop : 0
        targetRotation.current.y = INITIAL_YAW
        targetRotation.current.x = INITIAL_PITCH + progress * (Math.PI / 8)
      } else if (scrollY >= aboutTop && scrollY < programsTop) {
        // 2. Between About Section and Programs Section
        // Hold vertical pitch, move horizontally
        targetRotation.current.x = INITIAL_PITCH + (Math.PI / 8)
        
        const distance = programsTop - aboutTop
        const progress = distance > 0 ? (scrollY - aboutTop) / distance : 0
        targetRotation.current.y = INITIAL_YAW + progress * (Math.PI / 1.5)
      } else {
        // 3. After Programs Section
        // Hold horizontal yaw, resume moving downwards to sea bed
        targetRotation.current.y = INITIAL_YAW + Math.PI / 1.5
        
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const distanceRemaining = maxScroll - programsTop
        const progress = distanceRemaining > 0 ? (scrollY - programsTop) / distanceRemaining : 1
        
        // Pitch downwards sharply to show sea bed
        targetRotation.current.x = INITIAL_PITCH + (Math.PI / 8) + progress * (Math.PI / 2)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initialize
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // --- DRAG LOGIC ---
  const isDragging = useRef(false)
  const previousPointer = useRef({ x: 0, y: 0 })
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onPointerDown = (e) => {
      // Do not initiate drag if the user is clicking on an interactive element
      if (e.target.closest('button, a, input, textarea, select, [role="button"], .joystick-container')) {
        return
      }
      
      isDragging.current = true
      previousPointer.current = { x: e.clientX, y: e.clientY }
    }
    
    const onPointerMove = (e) => {
      if (!isDragging.current) return
      
      // Calculate delta
      const dx = e.clientX - previousPointer.current.x
      const dy = e.clientY - previousPointer.current.y
      previousPointer.current = { x: e.clientX, y: e.clientY }
      
      // Update drag offsets
      dragOffset.current.y += dx * 0.005 
      dragOffset.current.x += dy * 0.005
    }
    
    const onPointerUp = () => {
      isDragging.current = false
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [])

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Apply Joystick Velocity
      if (joystickVelocity && joystickVelocity.current) {
        // Multiply by delta for framerate independence, and a speed factor
        dragOffset.current.y += joystickVelocity.current.x * delta * 0.4
        dragOffset.current.x += joystickVelocity.current.y * delta * 0.4
      }

      // Combine programmatic scroll rotation with user's manual drag offset
      const finalTargetX = targetRotation.current.x + dragOffset.current.x
      const finalTargetY = targetRotation.current.y + dragOffset.current.y
      
      // Smoothly interpolate the mesh rotation towards the combined target
      meshRef.current.rotation.y += (finalTargetY - meshRef.current.rotation.y) * delta * 5
      meshRef.current.rotation.x += (finalTargetX - meshRef.current.rotation.x) * delta * 5

      if (meshRef2.current && isHome) {
        meshRef2.current.rotation.y = meshRef.current.rotation.y - (Math.PI / 2.5)
        meshRef2.current.rotation.x = meshRef.current.rotation.x - (Math.PI / 1.68)
        meshRef2.current.material.opacity += (targetOpacity2.current - meshRef2.current.material.opacity) * delta * 5
      }

      if (meshRef3.current && isHome) {
        meshRef3.current.rotation.y = meshRef.current.rotation.y
        meshRef3.current.rotation.x = meshRef.current.rotation.x + (Math.PI / 10)
        meshRef3.current.material.opacity += (targetOpacity3.current - meshRef3.current.material.opacity) * delta * 5
      }
    }
  })

  return (
    <group>
      <mesh ref={meshRef} scale={[-1, 1, 1]}>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      {/* Secondary mesh for crossfade texture */}
      {isHome && (
        <>
          <mesh ref={meshRef2} scale={[-0.99, 0.99, 0.99]}>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial map={texture2} side={THREE.BackSide} transparent={true} opacity={0} depthWrite={false} />
          </mesh>
          <mesh ref={meshRef3} scale={[-0.98, 0.98, 0.98]}>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial map={texture3} side={THREE.BackSide} transparent={true} opacity={0} depthWrite={false} />
          </mesh>
        </>
      )}
    </group>
  )
}

export default function VideoSphereBackground() {
  const [mounted, setMounted] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const location = useLocation()
  const joystickVelocity = useRef({ x: 0, y: 0 })
  const audioRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5
      if (!isMuted) {
        audioRef.current.play().catch((err) => console.log('Background audio play failed:', err))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isMuted])

  if (!mounted) return null // Prevent SSR/hydration mismatches if any

  const isAbout = location.pathname === '/about'
  const currentVideo = isAbout ? bookFile : videoFile

  return (
    <>
      <audio ref={audioRef} src={underwaterAudio} loop playsInline />
      <div className="absolute inset-0 -z-10">
        <div className="sticky top-0 h-[100dvh] w-full bg-navy overflow-hidden">
          <Canvas camera={{ position: [0, 0, 0.1], fov: 95 }}>
            <Suspense fallback={null}>
              <VideoSphere videoSrc={currentVideo} key={currentVideo} isMuted={isMuted} joystickVelocity={joystickVelocity} />
            </Suspense>
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableDamping={true}
              dampingFactor={0.05}
              autoRotate={false}
              rotateSpeed={-0.5} // Invert rotation since we are inside the sphere
            />
          </Canvas>
        </div>
      </div>
      {location.pathname !== '/book-us' && location.pathname !== '/login' && location.pathname !== '/signup' && <JoystickControl joystickVelocity={joystickVelocity} />}
      <AudioToggle isMuted={isMuted} onToggle={() => setIsMuted(!isMuted)} />
    </>
  )
}

function AudioToggle({ isMuted, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-[9000] flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white shadow-soft transition-all duration-300 hover:scale-110 hover:border-accent hover:text-accent"
      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
    >
      {!isMuted ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M11 5L6 9H2V15H6L11 19V5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M11 5L6 9H2V15H6L11 19V5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="23" y1="1" x2="1" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}

function JoystickControl({ joystickVelocity }) {
  const location = useLocation()
  const containerRef = useRef(null)
  const isDragging = useRef(false)
  const [thumbPos, setThumbPos] = useState({ x: 0, y: 0 })

  if (location.pathname.startsWith('/shop') || location.pathname.startsWith('/contact')) {
    return null
  }

  const MAX_RADIUS = 14

  const handlePointerDown = (e) => {
    isDragging.current = true
    updateJoystick(e)
    e.target.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current) return
    updateJoystick(e)
  }

  const handlePointerUp = (e) => {
    isDragging.current = false
    setThumbPos({ x: 0, y: 0 })
    if (joystickVelocity) joystickVelocity.current = { x: 0, y: 0 }
    e.target.releasePointerCapture(e.pointerId)
  }

  const updateJoystick = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    let dx = e.clientX - centerX
    let dy = e.clientY - centerY
    
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance > MAX_RADIUS) {
      dx = (dx / distance) * MAX_RADIUS
      dy = (dy / distance) * MAX_RADIUS
    }
    
    setThumbPos({ x: dx, y: dy })
    
    // Normalize velocity between -1 and 1
    if (joystickVelocity) {
      joystickVelocity.current = {
        x: dx / MAX_RADIUS,
        y: dy / MAX_RADIUS
      }
    }
  }

  return (
    <div className="fixed top-1/2 right-6 -translate-y-1/2 z-[8000] flex flex-col items-center gap-2 pointer-events-auto joystick-container">
      <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest bg-navy/50 px-2 py-1 rounded-md backdrop-blur-md">
        360° Toggle
      </span>
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-16 h-16 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing touch-none"
      >
        <div
          className="w-8 h-8 rounded-full bg-white/80 shadow-soft border border-white/50"
          style={{ 
            transform: `translate(${thumbPos.x}px, ${thumbPos.y}px)`, 
            transition: isDragging.current ? 'none' : 'transform 0.2s ease-out' 
          }}
        />
      </div>
    </div>
  )
}
