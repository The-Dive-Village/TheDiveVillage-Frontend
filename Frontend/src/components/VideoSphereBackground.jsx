import { useState, useEffect, Suspense, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useLocation } from 'react-router'
import videoFile from '../assets/Hero_3840x1920_production.mp4'
import divingFile from '../assets/Diving(1).mp4'
import bookFile from '../assets/Book(2).mp4'
import turtleVideo from '../assets/Turtle_fast.mp4'
import nightDiveVideo from '../assets/nightdive_fast.mp4'
import underwaterAudio from '../assets/Underwater.mp3'
import { setHeroVideoReady } from '../utils/mediaReadyManager'

function getOrCreateDomVideoContainer() {
  let container = document.getElementById('hero-360-video-dom-root')
  if (!container) {
    container = document.createElement('div')
    container.id = 'hero-360-video-dom-root'
    container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0.001;pointer-events:none;overflow:hidden;z-index:-99999;'
    document.body.appendChild(container)
  }
  return container
}

function useDirectVideoTexture(src, playbackRate = 0.5, priority = false) {
  const [texture, setTexture] = useState(null)
  const hasNewFrameRef = useRef(false)
  const lastTimeRef = useRef(-1)

  useEffect(() => {
    if (!src) {
      setTexture(null)
      return
    }

    let isMounted = true
    let vidTexture = null
    let rvfcId = null
    let fallbackCleanup = null

    const domContainer = getOrCreateDomVideoContainer()
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

    domContainer.appendChild(video)

    const checkReadiness = () => {
      if (!isMounted) return false
      return (
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      )
    }

    const registerFrameCallback = () => {
      if (video.requestVideoFrameCallback) {
        const onVideoFrame = () => {
          if (!isMounted) return
          hasNewFrameRef.current = true
          rvfcId = video.requestVideoFrameCallback(onVideoFrame)
        }
        rvfcId = video.requestVideoFrameCallback(onVideoFrame)
      } else {
        const onTimeUpdate = () => {
          if (!isMounted) return
          hasNewFrameRef.current = true
        }
        video.addEventListener('timeupdate', onTimeUpdate)
        video.addEventListener('playing', onTimeUpdate)
        fallbackCleanup = () => {
          video.removeEventListener('timeupdate', onTimeUpdate)
          video.removeEventListener('playing', onTimeUpdate)
        }
      }
    }

    const tryActivateTexture = () => {
      if (!isMounted) return
      if (checkReadiness()) {
        if (!vidTexture) {
          vidTexture = new THREE.VideoTexture(video)
          vidTexture.update = () => { } // Disable Three.js per-frame auto-update so requestVideoFrameCallback controls needsUpdate
          vidTexture.colorSpace = THREE.SRGBColorSpace
          vidTexture.minFilter = THREE.LinearFilter
          vidTexture.magFilter = THREE.LinearFilter
          vidTexture.generateMipmaps = false
          if (isMounted) {
            setTexture(vidTexture)
          }
          registerFrameCallback()
        }
        hasNewFrameRef.current = true
        vidTexture.needsUpdate = true
        if (priority) setHeroVideoReady(true)
      }
    }

    const startPlayback = () => {
      if (!isMounted) return
      tryActivateTexture()
      if (video.paused) {
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (isMounted) {
                video.playbackRate = playbackRate
                tryActivateTexture()
              }
            })
            .catch((err) => {
              console.warn('360 Video autoplay status:', err?.name || err)
            })
        }
      }
    }

    const handleEvent = () => {
      if (!isMounted) return
      startPlayback()
    }

    const handleUserInteraction = () => {
      if (!isMounted) return
      startPlayback()
    }

    const mediaEvents = [
      'loadstart',
      'loadedmetadata',
      'loadeddata',
      'canplay',
      'canplaythrough',
      'playing',
      'timeupdate',
      'resize'
    ]

    mediaEvents.forEach((evt) => {
      video.addEventListener(evt, handleEvent)
    })

    startPlayback()

    window.addEventListener('pointerdown', handleUserInteraction, { passive: true })
    window.addEventListener('touchstart', handleUserInteraction, { passive: true })

    return () => {
      isMounted = false
      if (rvfcId && video.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(rvfcId)
      }
      if (fallbackCleanup) {
        fallbackCleanup()
      }
      window.removeEventListener('pointerdown', handleUserInteraction)
      window.removeEventListener('touchstart', handleUserInteraction)
      mediaEvents.forEach((evt) => {
        video.removeEventListener(evt, handleEvent)
      })
      video.pause()
      video.removeAttribute('src')
      video.load()
      if (video.parentNode) {
        video.parentNode.removeChild(video)
      }
      if (vidTexture) {
        vidTexture.dispose()
        vidTexture = null
      }
      setTexture(null)
    }
  }, [src, playbackRate, priority])

  return { texture, hasNewFrameRef, lastTimeRef }
}

function VideoSphere({ videoSrc, joystickVelocity, isNightDive }) {
  const meshRef = useRef()
  const meshRef2 = useRef()
  const meshRef3 = useRef()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isAbout = location.pathname === '/about'
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640)

  const INITIAL_YAW = Math.PI / 2.65 - (Math.PI * 1.1)
  const INITIAL_PITCH = isAbout ? -(Math.PI / 6) : (Math.PI / 17.1)

  const targetRotation = useRef({ x: INITIAL_PITCH, y: INITIAL_YAW })
  const targetOpacity2 = useRef(0)
  const targetOpacity3 = useRef(0)
  const vid2PlayingRef = useRef(false)
  const vid3PlayingRef = useRef(false)
  const [loadSecondary, setLoadSecondary] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Primary video is prioritized with 'auto' preload and high priority (calm slowed playback)
  const { texture, hasNewFrameRef: hasNewFrame1, lastTimeRef: lastTime1 } = useDirectVideoTexture(videoSrc, 0.5, true)
  // Secondary videos are strictly lazy-loaded only when user scrolls or needs them ON DESKTOP
  const { texture: texture2, hasNewFrameRef: hasNewFrame2, lastTimeRef: lastTime2 } = useDirectVideoTexture(!isMobile && isHome && !isNightDive && loadSecondary ? bookFile : null, 0.5, false)
  const { texture: texture3, hasNewFrameRef: hasNewFrame3, lastTimeRef: lastTime3 } = useDirectVideoTexture(!isMobile && isHome && !isNightDive && loadSecondary ? turtleVideo : null, 0.5, false)

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
      const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 640
      if (isMobileScreen) {
        // Keep 360 video background completely static on mobile during scroll
        targetRotation.current.y = INITIAL_YAW
        targetRotation.current.x = INITIAL_PITCH
        targetOpacity2.current = 0
        targetOpacity3.current = 0
        return
      }

      const scrollY = window.scrollY

      const aboutEl = document.getElementById('about-section')
      const programsEl = document.getElementById('programs-section')
      const diveSectionEl = document.getElementById('who-can-dive-section')
      const testimonialsEl = document.getElementById('testimonials-section')

      const customizeEl = document.getElementById('customize-dive-section') || document.getElementById('customize-section')
      const galleryEl = document.getElementById('gallery-section') || document.getElementById('gallery')

      if (isHome) {
        if (!loadSecondary && scrollY > 150) {
          setLoadSecondary(true)
        }

        const triggerThreshold = window.innerHeight * 0.8
        const isCustomizeInView = customizeEl && customizeEl.getBoundingClientRect().top < triggerThreshold
        const isGalleryInView = galleryEl && galleryEl.getBoundingClientRect().top < triggerThreshold

        if (isCustomizeInView || isGalleryInView) {
          // When Customize Dive Experience or Dive Gallery comes into view, transition back to the first video (Hero(1).mp4)
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
  }, [isAbout, isHome, loadSecondary, INITIAL_PITCH, INITIAL_YAW])

  // --- DRAG LOGIC ---
  const isDragging = useRef(false)
  const previousPointer = useRef({ x: 0, y: 0 })
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onPointerDown = (e) => {
      // Disable body pointer dragging on mobile so scrolling gestures don't rotate the 360 sphere
      if (window.innerWidth < 640) return
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
      // 1. Frame-driven texture 1 update (checks currentTime advancement to guarantee updates even if offscreen callback throttled)
      if (texture && texture.image) {
        const vid1 = texture.image
        if (hasNewFrame1.current || vid1.currentTime !== lastTime1.current) {
          lastTime1.current = vid1.currentTime
          hasNewFrame1.current = false
          texture.needsUpdate = true
        }
      }

      // 2. Secondary texture 2 update with state-transition play/pause (desktop only)
      if (!isMobile && texture2 && texture2.image) {
        const vid2 = texture2.image
        if (targetOpacity2.current > 0.01) {
          if (vid2.paused) vid2.play().catch(() => { })
          if (vid2.readyState >= 2 && vid2.videoWidth > 0 && vid2.videoHeight > 0) {
            if (hasNewFrame2.current || vid2.currentTime !== lastTime2.current) {
              lastTime2.current = vid2.currentTime
              hasNewFrame2.current = false
              texture2.needsUpdate = true
            }
          }
        } else {
          if (vid2PlayingRef.current) {
            vid2PlayingRef.current = false
            vid2.pause()
          }
        }
      }

      // 3. Secondary texture 3 update with state-transition play/pause (desktop only)
      if (!isMobile && texture3 && texture3.image) {
        const vid3 = texture3.image
        if (targetOpacity3.current > 0.01) {
          if (vid3.paused) vid3.play().catch(() => { })
          if (vid3.readyState >= 2 && vid3.videoWidth > 0 && vid3.videoHeight > 0) {
            if (hasNewFrame3.current || vid3.currentTime !== lastTime3.current) {
              lastTime3.current = vid3.currentTime
              hasNewFrame3.current = false
              texture3.needsUpdate = true
            }
          }
        } else {
          if (vid3PlayingRef.current) {
            vid3PlayingRef.current = false
            vid3.pause()
          }
        }
      }

      if (joystickVelocity && joystickVelocity.current) {
        dragOffset.current.y += joystickVelocity.current.x * delta * 0.4
        dragOffset.current.x += joystickVelocity.current.y * delta * 0.4
      }

      const finalTargetX = targetRotation.current.x + dragOffset.current.x
      const finalTargetY = targetRotation.current.y + dragOffset.current.y

      meshRef.current.rotation.y += (finalTargetY - meshRef.current.rotation.y) * delta * 5
      meshRef.current.rotation.x += (finalTargetX - meshRef.current.rotation.x) * delta * 5

      if (!isMobile && meshRef2.current && isHome) {
        meshRef2.current.rotation.y = meshRef.current.rotation.y - (Math.PI / 2.5)
        meshRef2.current.rotation.x = meshRef.current.rotation.x - (Math.PI / 1.68)
        meshRef2.current.material.opacity += (targetOpacity2.current - meshRef2.current.material.opacity) * delta * 2.5
      }

      if (!isMobile && meshRef3.current && isHome) {
        meshRef3.current.rotation.y = meshRef.current.rotation.y + (Math.PI * 1.45)
        meshRef3.current.rotation.x = meshRef.current.rotation.x - (Math.PI * 1.1)
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
      {!isMobile && isHome && !isNightDive && (
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
  // Audio state: Unmuted by default unless the user has explicitly muted it
  const [isMuted, setIsMuted] = useState(false)
  const [isNightDive, setIsNightDive] = useState(false)
  const location = useLocation()
  const joystickVelocity = useRef({ x: 0, y: 0 })
  const audioRef = useRef(null)
  const isMutedRef = useRef(isMuted)
  const nightVideoRef = useRef(null)

  useEffect(() => {
    isMutedRef.current = isMuted
  }, [isMuted])

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
      video.playbackRate = 0.5
      if (isNightDive) {
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise.then(() => {
            if (video) video.playbackRate = 0.5
          }).catch((err) => {
            console.warn('Night dive video play notice:', err)
            const handleInteract = () => {
              if (video) {
                video.playbackRate = 0.5
                video.play().catch(() => { })
              }
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

  // Automatic ambient audio playback with robust browser autoplay policy handling
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    let isCleanedUp = false
    const validUnlockEvents = [
      'click',
      'pointerdown',
      'pointerup',
      'pointermove',
      'mousedown',
      'mouseup',
      'mousemove',
      'touchstart',
      'touchend',
      'touchmove',
      'keydown',
      'scroll',
      'wheel',
      'focus',
      'visibilitychange',
      'pageshow',
    ]

    const removeUnlockListeners = () => {
      validUnlockEvents.forEach((evt) => {
        window.removeEventListener(evt, handleFirstInteraction, true)
        document.removeEventListener(evt, handleFirstInteraction, true)
        document.body?.removeEventListener(evt, handleFirstInteraction, true)
      })
    }

    const startAudio = () => {
      if (isCleanedUp || isMutedRef.current) return
      const el = audioRef.current
      if (!el) return

      el.muted = false
      el.volume = 0.5
      const p = el.play()
      if (p !== undefined) {
        p.then(() => {
          removeUnlockListeners()
        }).catch((err) => {
          console.debug('Autoplay unlock retry on next interaction:', err)
        })
      }
    }

    const handleFirstInteraction = () => {
      startAudio()
    }

    if (!isMuted) {
      // 1. Immediate trigger on load
      startAudio()

      // 2. Comprehensive unlock listeners covering any mouse move, touch, key, or scroll
      validUnlockEvents.forEach((evt) => {
        window.addEventListener(evt, handleFirstInteraction, { passive: true, capture: true })
        document.addEventListener(evt, handleFirstInteraction, { passive: true, capture: true })
        document.body?.addEventListener(evt, handleFirstInteraction, { passive: true, capture: true })
      })

      // 3. Staggered retries for when audio finishes buffering
      const timer1 = setTimeout(startAudio, 200)
      const timer2 = setTimeout(startAudio, 800)

      audio.addEventListener('canplaythrough', startAudio, { once: true })

      return () => {
        isCleanedUp = true
        clearTimeout(timer1)
        clearTimeout(timer2)
        audio.removeEventListener('canplaythrough', startAudio)
        removeUnlockListeners()
      }
    } else {
      removeUnlockListeners()
      audio.pause()
      audio.currentTime = 0
    }

    return () => {
      isCleanedUp = true
      removeUnlockListeners()
    }
  }, [isMuted])

  const handleToggleAudio = () => {
    setIsMuted((prev) => {
      const next = !prev
      isMutedRef.current = next
      if (next) {
        if (audioRef.current) {
          audioRef.current.muted = true
          audioRef.current.volume = 0
          audioRef.current.pause()
        }
      } else {
        if (audioRef.current) {
          audioRef.current.muted = false
          audioRef.current.volume = 0.5
          audioRef.current.play().catch(() => { })
        }
      }
      return next
    })
  }

  if (!mounted) return null // Prevent SSR/hydration mismatches if any

  const isAbout = location.pathname === '/about'
  const currentVideo = isNightDive ? nightDiveVideo : (isAbout ? bookFile : videoFile)

  const isHiddenJoystickPath =
    location.pathname.startsWith('/gallery') ||
    location.pathname.startsWith('/services') ||
    location.pathname.startsWith('/courses') ||
    location.pathname.startsWith('/shop') ||
    location.pathname.startsWith('/product') ||
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/wishlist') ||
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/contact') ||
    location.pathname.startsWith('/scuba') ||
    location.pathname.startsWith('/snorkeling') ||
    location.pathname.startsWith('/surfing') ||
    location.pathname === '/book-us' ||
    location.pathname === '/login' ||
    location.pathname === '/signup'

  return (
    <>
      <audio ref={audioRef} src={underwaterAudio} loop autoPlay preload="auto" playsInline />
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="h-full w-full overflow-hidden"
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
              dpr={[1, 1.5]}
              camera={{ position: [0, 0, 0.1], fov: 85 }}
              gl={{ powerPreference: 'high-performance', antialias: false }}
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
      <AudioToggle isMuted={isMuted} onToggle={handleToggleAudio} />
    </>
  )
}

function AudioToggle({ isMuted, onToggle }) {
  const location = useLocation()
  const isLightPage =
    location.pathname.startsWith('/gallery') ||
    location.pathname.startsWith('/services') ||
    location.pathname.startsWith('/shop') ||
    location.pathname.startsWith('/product') ||
    location.pathname === '/cart' ||
    location.pathname === '/wishlist' ||
    location.pathname === '/checkout'

  return (
    <button
      onClick={onToggle}
      className={`fixed bottom-6 right-6 z-[9000] flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border shadow-2xl transition-all duration-300 hover:scale-110 hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] cursor-pointer ${isLightPage
        ? 'bg-[#001e3d] text-white border-white/20 shadow-[0_6px_24px_rgba(0,30,61,0.35)]'
        : 'bg-[#001e3d]/85 text-white border-white/30 backdrop-blur-2xl shadow-[0_6px_24px_rgba(0,0,0,0.5)]'
        }`}
      aria-label={isMuted ? 'Play underwater ambiance' : 'Mute underwater ambiance'}
    >
      {!isMuted ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M11 5L6 9H2V15H6L11 19V5Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M11 5L6 9H2V15H6L11 19V5Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="23" y1="1" x2="1" y2="23" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
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

  if (
    location.pathname.startsWith('/gallery') ||
    location.pathname.startsWith('/services') ||
    location.pathname.startsWith('/courses') ||
    location.pathname.startsWith('/shop') ||
    location.pathname.startsWith('/product') ||
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/wishlist') ||
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/contact')
  ) {
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
      <span className="text-[9px] sm:text-[10px] font-bold text-white/90 uppercase tracking-widest bg-white/10 border border-white/25 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md backdrop-blur-2xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] select-none">
        360° Toggle
      </span>
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/30 bg-white/10 backdrop-blur-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] cursor-grab active:cursor-grabbing touch-none transition-all duration-300 hover:bg-white/15 hover:border-white/40"
      >
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/30 backdrop-blur-xl shadow-[0_2px_12px_rgba(255,255,255,0.25)] border border-white/50"
          style={{
            transform: `translate(${thumbPos.x}px, ${thumbPos.y}px)`,
            transition: isDragging.current ? 'none' : 'transform 0.2s ease-out'
          }}
        />
      </div>
    </div>
  )
}
