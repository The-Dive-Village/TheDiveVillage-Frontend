import { useState, useEffect, Suspense, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useLocation } from 'react-router'
import videoFile from '../assets/Hero_fast.mp4'
import divingFile from '../assets/Diving(1).mp4'
import bookFile from '../assets/Book_fast.mp4'
import turtleVideo from '../assets/Turtle_fast.mp4'
import nightDiveVideo from '../assets/nightdive_fast.mp4'
import underwaterAudio from '../assets/Underwater.mp3'
import { setHeroVideoReady } from '../utils/mediaReadyManager'

function useDirectVideoTexture(src, playbackRate = 1.0, priority = false) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    if (!src) {
      setTexture(null)
      return
    }

    let isMounted = true

    const video = document.createElement('video')
    video.src = src
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
    if (priority) {
      video.setAttribute('fetchpriority', 'high')
    }

    const vidTexture = new THREE.VideoTexture(video)
    vidTexture.colorSpace = THREE.SRGBColorSpace
    vidTexture.minFilter = THREE.LinearFilter
    vidTexture.magFilter = THREE.LinearFilter
    vidTexture.generateMipmaps = false
    vidTexture.needsUpdate = true

    if (isMounted) {
      setTexture(vidTexture)
    }

    const startPlayback = () => {
      if (!isMounted) return
      vidTexture.needsUpdate = true
      if (priority) setHeroVideoReady(true)
      if (video.paused) {
        video.play().then(() => {
          if (isMounted) {
            vidTexture.needsUpdate = true
            if (priority) setHeroVideoReady(true)
          }
        }).catch(() => {})
      }
    }

    video.addEventListener('canplay', startPlayback)
    video.addEventListener('canplaythrough', startPlayback)
    video.addEventListener('loadeddata', startPlayback)
    video.addEventListener('playing', startPlayback)

    // Trigger immediately
    startPlayback()

    const handleUserInteraction = () => {
      startPlayback()
    }
    window.addEventListener('pointerdown', handleUserInteraction)
    window.addEventListener('touchstart', handleUserInteraction)

    return () => {
      isMounted = false
      window.removeEventListener('pointerdown', handleUserInteraction)
      window.removeEventListener('touchstart', handleUserInteraction)
      video.removeEventListener('canplay', startPlayback)
      video.removeEventListener('canplaythrough', startPlayback)
      video.removeEventListener('loadeddata', startPlayback)
      video.removeEventListener('playing', startPlayback)
      video.pause()
      video.removeAttribute('src')
      video.load()
      vidTexture.dispose()
    }
  }, [src, playbackRate, priority])

  return texture
}

function VideoSphere({ videoSrc, joystickVelocity, isNightDive }) {
  const meshRef = useRef()
  const meshRef2 = useRef()
  const meshRef3 = useRef()
  const targetRotation = useRef({ x: 0, y: 0 })
  const targetOpacity2 = useRef(0)
  const targetOpacity3 = useRef(0)
  const [loadSecondary, setLoadSecondary] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isAbout = location.pathname === '/about'

  // Primary video is prioritized with 'auto' preload and high priority
  const texture = useDirectVideoTexture(videoSrc, 1.0, true)
  // Secondary videos are strictly lazy-loaded only when user scrolls or needs them
  const texture2 = useDirectVideoTexture(isHome && !isNightDive && loadSecondary ? bookFile : null, 1.0, false)
  const texture3 = useDirectVideoTexture(isHome && !isNightDive && loadSecondary ? turtleVideo : null, 1.0, false)

  // Flip turtle video texture horizontally so it displays correctly on the sphere
  useEffect(() => {
    if (texture3) {
      texture3.wrapS = THREE.RepeatWrapping
      texture3.repeat.x = -1
      texture3.offset.x = 1
      texture3.needsUpdate = true
    }
  }, [texture3])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const INITIAL_YAW = Math.PI / 2.65 - (Math.PI * 1.1)
      const INITIAL_PITCH = isAbout ? -(Math.PI / 6) : (Math.PI / 5)

      const aboutEl = document.getElementById('about-section')
      const programsEl = document.getElementById('programs-section')
      const diveSectionEl = document.getElementById('who-can-dive-section')
      const testimonialsEl = document.getElementById('testimonials-section')

      const galleryEl = document.getElementById('gallery-section') || document.getElementById('gallery')

      if (isHome) {
        if (!loadSecondary && scrollY > 150) {
          setLoadSecondary(true)
        }

        const triggerThreshold = window.innerHeight * 0.7
        const isGalleryInView = galleryEl && galleryEl.getBoundingClientRect().top < triggerThreshold

        if (isGalleryInView) {
          // When Dive Gallery comes into view, transition back to the first video (Hero(1).mp4)
          targetOpacity2.current = 0
          targetOpacity3.current = 0
        } else {
          if (diveSectionEl) {
            const diveRect = diveSectionEl.getBoundingClientRect()
            // Automatically blend 2nd video when reaching Who Can Dive section
            targetOpacity2.current = diveRect.top < triggerThreshold ? 1 : 0
          }

          if (testimonialsEl) {
            const testRect = testimonialsEl.getBoundingClientRect()
            // Automatically blend 3rd video when reaching Testimonials section
            targetOpacity3.current = testRect.top < triggerThreshold ? 1 : 0
          }
        }
      }

      if (!aboutEl || !programsEl) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0
        targetRotation.current.y = INITIAL_YAW
        targetRotation.current.x = INITIAL_PITCH + scrollProgress * (Math.PI * 2)
        return
      }

      const aboutRect = aboutEl.getBoundingClientRect()
      const programsRect = programsEl.getBoundingClientRect()

      const aboutTop = scrollY + aboutRect.top
      const programsTop = scrollY + programsRect.top

      if (scrollY < aboutTop) {
        const progress = aboutTop > 0 ? scrollY / aboutTop : 0
        targetRotation.current.y = INITIAL_YAW
        targetRotation.current.x = INITIAL_PITCH + progress * (Math.PI / 8)
      } else if (scrollY >= aboutTop && scrollY < programsTop) {
        targetRotation.current.x = INITIAL_PITCH + (Math.PI / 8)
        const distance = programsTop - aboutTop
        const progress = distance > 0 ? (scrollY - aboutTop) / distance : 0
        targetRotation.current.y = INITIAL_YAW + progress * (Math.PI / 1.5)
      } else {
        targetRotation.current.y = INITIAL_YAW + Math.PI / 1.5
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const distanceRemaining = maxScroll - programsTop
        const progress = distanceRemaining > 0 ? (scrollY - programsTop) / distanceRemaining : 1
        targetRotation.current.x = INITIAL_PITCH + (Math.PI / 8) + progress * (Math.PI / 16)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isAbout, isHome, loadSecondary])

  // --- DRAG LOGIC ---
  const isDragging = useRef(false)
  const previousPointer = useRef({ x: 0, y: 0 })
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onPointerDown = (e) => {
      if (e.target.closest('button, a, input, textarea, select, [role="button"], .joystick-container')) {
        return
      }
      isDragging.current = true
      previousPointer.current = { x: e.clientX, y: e.clientY }
    }

    const onPointerMove = (e) => {
      if (!isDragging.current) return
      const dx = e.clientX - previousPointer.current.x
      const dy = e.clientY - previousPointer.current.y
      previousPointer.current = { x: e.clientX, y: e.clientY }
      dragOffset.current.y += dx * 0.005
      dragOffset.current.x += dy * 0.005
    }

    const onPointerUp = () => {
      isDragging.current = false
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
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
      if (texture) texture.needsUpdate = true
      if (texture2 && targetOpacity2.current > 0.01) texture2.needsUpdate = true
      if (texture3 && targetOpacity3.current > 0.01) texture3.needsUpdate = true

      if (joystickVelocity && joystickVelocity.current) {
        dragOffset.current.y += joystickVelocity.current.x * delta * 0.4
        dragOffset.current.x += joystickVelocity.current.y * delta * 0.4
      }

      const finalTargetX = targetRotation.current.x + dragOffset.current.x
      const finalTargetY = targetRotation.current.y + dragOffset.current.y

      meshRef.current.rotation.y += (finalTargetY - meshRef.current.rotation.y) * delta * 5
      meshRef.current.rotation.x += (finalTargetX - meshRef.current.rotation.x) * delta * 5

      if (meshRef2.current && isHome) {
        meshRef2.current.rotation.y = meshRef.current.rotation.y - (Math.PI / 2.5)
        meshRef2.current.rotation.x = meshRef.current.rotation.x - (Math.PI / 1.68)
        meshRef2.current.material.opacity += (targetOpacity2.current - meshRef2.current.material.opacity) * delta * 2.5
      }

      if (meshRef3.current && isHome) {
        meshRef3.current.rotation.y = meshRef.current.rotation.y + (Math.PI * 1.45)
        meshRef3.current.rotation.x = meshRef.current.rotation.x - (Math.PI * 1.3)
        meshRef3.current.material.opacity += (targetOpacity3.current - meshRef3.current.material.opacity) * delta * 2.5
      }
    }
  })

  return (
    <group>
      <mesh ref={meshRef} scale={[-1, 1, 1]} visible={Boolean(texture)}>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} transparent={false} opacity={1} depthWrite={false} color="#ffffff" />
      </mesh>
      {isHome && !isNightDive && (
        <>
          <mesh ref={meshRef2} scale={[-0.99, 0.99, 0.99]} visible={Boolean(texture2)}>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial map={texture2} side={THREE.BackSide} transparent={true} opacity={0} depthWrite={false} />
          </mesh>
          <mesh ref={meshRef3} scale={[-0.98, 0.98, 0.98]} visible={Boolean(texture3)}>
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
  const [isNightDive, setIsNightDive] = useState(false)
  const location = useLocation()
  const joystickVelocity = useRef({ x: 0, y: 0 })
  const audioRef = useRef(null)
  const nightVideoRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Watch for night-dive class on body
  useEffect(() => {
    const checkNightDive = () => setIsNightDive(document.body.classList.contains('night-dive'))
    checkNightDive()
    const observer = new MutationObserver(checkNightDive)
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Control night dive video playback
  useEffect(() => {
    const video = nightVideoRef.current
    if (video) {
      video.muted = true
      video.defaultMuted = true
      if (isNightDive) {
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Night dive video play notice:', err)
            const handleInteract = () => {
              if (video) video.play().catch(() => {})
              window.removeEventListener('pointerdown', handleInteract)
              window.removeEventListener('touchstart', handleInteract)
            }
            window.addEventListener('pointerdown', handleInteract, { once: true })
            window.addEventListener('touchstart', handleInteract, { once: true })
          })
        }
      } else {
        video.pause()
      }
    }
  }, [isNightDive])

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
  const currentVideo = isNightDive ? nightDiveVideo : (isAbout ? bookFile : videoFile)

  const isHiddenJoystickPath =
    location.pathname.startsWith('/services') ||
    location.pathname.startsWith('/scuba') ||
    location.pathname.startsWith('/snorkeling') ||
    location.pathname.startsWith('/surfing') ||
    location.pathname === '/book-us' ||
    location.pathname === '/login' ||
    location.pathname === '/signup'

  return (
    <>
      <audio ref={audioRef} src={underwaterAudio} loop playsInline />
      <div className="absolute inset-0 -z-10">
        <div 
          className="sticky top-0 h-[100dvh] w-full overflow-hidden"
          style={{
            background: 'radial-gradient(circle at center, #003865 0%, #001e3d 55%, #000e1c 100%)'
          }}
        >
          <video
            ref={(el) => {
              if (el) {
                el.muted = true
                el.defaultMuted = true
                nightVideoRef.current = el
              }
            }}
            src={isNightDive ? nightDiveVideo : undefined}
            autoPlay={isNightDive}
            loop
            muted
            playsInline
            preload={isNightDive ? 'auto' : 'none'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: isNightDive ? 1 : 0,
              pointerEvents: 'none',
              transition: 'opacity 0.5s ease-in-out',
              zIndex: isNightDive ? 10 : -1,
            }}
          />
          <div style={{ width: '100%', height: '100%' }}>
            <Canvas
              camera={{ position: [0, 0, 0.1], fov: 95 }}
              gl={{ powerPreference: 'high-performance', antialias: true }}
              onCreated={({ gl, scene }) => {
                scene.background = new THREE.Color('#001e3d')
                gl.domElement.addEventListener('webglcontextlost', (e) => {
                  e.preventDefault()
                  console.warn('THREE.WebGLRenderer: Context Lost. Handling gracefully.')
                }, false)
                gl.domElement.addEventListener('webglcontextrestored', () => {
                  console.info('THREE.WebGLRenderer: Context Restored.')
                }, false)
              }}
            >
              <color attach="background" args={['#001e3d']} />
              <Suspense fallback={null}>
                <VideoSphere
                  videoSrc={currentVideo}
                  key={currentVideo}
                  isNightDive={isNightDive}
                  joystickVelocity={joystickVelocity}
                />
              </Suspense>
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableDamping={true}
                dampingFactor={0.05}
                autoRotate={false}
                rotateSpeed={-0.5}
              />
            </Canvas>
          </div>
        </div>
      </div>
      {!isNightDive && !isHiddenJoystickPath && <JoystickControl joystickVelocity={joystickVelocity} />}
      <AudioToggle isMuted={isMuted} onToggle={() => setIsMuted(!isMuted)} />
    </>
  )
}

function AudioToggle({ isMuted, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-[9000] flex h-7 w-7 items-center justify-center rounded-full border border-cyan-400/30 bg-[#00223D]/80 backdrop-blur-md text-cyan-300 shadow-[0_4px_20px_rgba(0,34,61,0.6)] transition-all duration-300 hover:scale-110 hover:border-accent hover:text-accent"
      aria-label={isMuted ? 'Play underwater ambiance' : 'Mute underwater ambiance'}
    >
      {!isMuted ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <div className="fixed top-1/2 right-2 sm:right-6 -translate-y-1/2 z-[8000] flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-auto joystick-container scale-90 sm:scale-100 origin-right">
      <span className="text-[9px] sm:text-[10px] font-bold text-cyan-200 uppercase tracking-widest bg-[#001e3d]/80 border border-cyan-400/30 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md backdrop-blur-md shadow-md select-none">
        360° Toggle
      </span>
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-cyan-400/40 bg-[#001e3d]/70 backdrop-blur-md flex items-center justify-center shadow-[0_8px_25px_rgba(0,30,61,0.7)] cursor-grab active:cursor-grabbing touch-none"
      >
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#00AEC7] to-[#005580] shadow-[0_0_15px_rgba(0,174,199,0.6)] border border-cyan-300/60"
          style={{
            transform: `translate(${thumbPos.x}px, ${thumbPos.y}px)`,
            transition: isDragging.current ? 'none' : 'transform 0.2s ease-out'
          }}
        />
      </div>
    </div>
  )
}
