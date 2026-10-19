import { useState, useEffect, Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useLocation } from 'react-router'
import {
  OPTIMIZED_CLOWNFISH_360,
  OPTIMIZED_BARRACUDA_360,
  OPTIMIZED_TURTLE_360,
  OPTIMIZED_NIGHT_DIVE_360,
  RAW_CLOUDINARY_CLOWNFISH,
  RAW_CLOUDINARY_BARRACUDA,
  RAW_CLOUDINARY_TURTLE,
  RAW_CLOUDINARY_NIGHT_DIVE,
  MASTER_1080P_CLOWNFISH,
  MASTER_1080P_BARRACUDA,
  MASTER_1080P_TURTLE,
  MASTER_1080P_NIGHT_DIVE,
} from '../utils/videoOptimizer'

// Cloudinary High-Fidelity Dynamically Optimized Video URLs
const CLOUDINARY_CLOWNFISH = OPTIMIZED_CLOWNFISH_360 || RAW_CLOUDINARY_CLOWNFISH
const CLOUDINARY_BARRACUDA = OPTIMIZED_BARRACUDA_360 || RAW_CLOUDINARY_BARRACUDA
const CLOUDINARY_TURTLE = OPTIMIZED_TURTLE_360 || RAW_CLOUDINARY_TURTLE
const CLOUDINARY_NIGHT_DIVE = OPTIMIZED_NIGHT_DIVE_360 || RAW_CLOUDINARY_NIGHT_DIVE
const CLOUDINARY_AUDIO = '/media/TDV-Media/Audio/Audio.mp3'

import { globalAudio } from '../utils/audioManager'
import {
  setHeroVideoReady,
  getOrCreateHeroVideoElement,
  setHeroWebGLReady,
  HERO_VIDEO_SRC,
  pauseHeroVideo,
  resumeHeroVideo,
  preloadNightDiveFirst5Seconds,
  getHeroVideoReady,
  subscribeHeroVideoReady,
} from '../utils/mediaReadyManager'
import { usePageVisibility } from '../hooks/usePageVisibility'
import { attachHlsStream } from '../hooks/useCloudinaryHls'

const videoFile = CLOUDINARY_CLOWNFISH
const bookFile = CLOUDINARY_BARRACUDA
const turtleVideo = CLOUDINARY_TURTLE
const nightDiveVideo = CLOUDINARY_NIGHT_DIVE

function getOrCreateDomVideoContainer() {
  let container = document.getElementById('hero-360-video-dom-root')
  if (!container) {
    container = document.createElement('div')
    container.id = 'hero-360-video-dom-root'
    container.style.cssText =
      'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0.001;pointer-events:none;overflow:hidden;z-index:-99999;'
    document.body.appendChild(container)
  }
  return container
}

/**
 * Custom hook to generate and manage Three.js VideoTexture with lifecycle and play state control.
 */
function useDirectVideoTexture(src, fallbackMp4, playbackRate = 0.5, priority = false, isVisible = true, shouldPlay = true) {
  const [texture, setTexture] = useState(null)
  const videoRef = useRef(null)
  const hlsControllerRef = useRef(null)

  useEffect(() => {
    if (!src) {
      setTexture(null)
      videoRef.current = null
      return
    }

    let isMounted = true
    let vidTexture = null
    let video = null
    let hlsController = null

    // For priority hero video: reuse the singleton warm video element
    if (priority) {
      video = getOrCreateHeroVideoElement(src, playbackRate)
    } else {
      const domContainer = getOrCreateDomVideoContainer()
      video = document.createElement('video')
      if (src && (src.startsWith('http://') || src.startsWith('https://')) && !src.includes(window.location.host)) {
        video.crossOrigin = 'anonymous'
      }
      video.muted = true
      video.defaultMuted = true
      video.volume = 0
      video.playsInline = true
      video.setAttribute('muted', '')
      video.setAttribute('playsinline', '')
      video.setAttribute('webkit-playsinline', '')
      video.loop = true
      video.autoplay = false
      video.preload = shouldPlay ? 'auto' : 'metadata'
      video.playbackRate = playbackRate
      domContainer.appendChild(video)

      if (src.includes('.m3u8')) {
        hlsController = attachHlsStream({
          video,
          hlsUrl: src,
          mp4FallbackUrl: fallbackMp4,
          autoPlay: shouldPlay,
          playbackRate,
        })
        hlsControllerRef.current = hlsController
      } else {
        video.src = src
      }
    }

    if (!video) return
    videoRef.current = video

    const tryActivateTexture = () => {
      if (!isMounted) return
      if ((video.readyState >= 1 && video.videoWidth > 0) || video.readyState >= 2) {
        if (!vidTexture) {
          vidTexture = new THREE.VideoTexture(video)
          vidTexture.colorSpace = THREE.SRGBColorSpace
          vidTexture.minFilter = THREE.LinearFilter
          vidTexture.magFilter = THREE.LinearFilter
          vidTexture.generateMipmaps = false
          if (isMounted) {
            setTexture(vidTexture)
          }
        }
        if (priority) setHeroVideoReady(true)
      }
    }

    const startPlayback = () => {
      if (!isMounted || !isVisible || !shouldPlay) return
      video.playbackRate = playbackRate
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
            .catch(() => {})
        }
      }
    }

    const handleEvent = () => {
      if (!isMounted) return
      tryActivateTexture()
      if (shouldPlay && isVisible) {
        startPlayback()
      }
    }

    const mediaEvents = [
      'loadstart',
      'loadedmetadata',
      'loadeddata',
      'canplay',
      'canplaythrough',
    ]

    mediaEvents.forEach((evt) => {
      video.addEventListener(evt, handleEvent)
    })

    if (isVisible && shouldPlay) {
      startPlayback()
    } else {
      tryActivateTexture()
    }

    return () => {
      isMounted = false
      mediaEvents.forEach((evt) => {
        video.removeEventListener(evt, handleEvent)
      })

      if (!priority) {
        if (hlsController) {
          hlsController.destroy()
        }
        video.pause()
        video.removeAttribute('src')
        video.load()
        if (video.parentNode) {
          video.parentNode.removeChild(video)
        }
      } else {
        pauseHeroVideo()
      }

      if (vidTexture) {
        vidTexture.dispose()
        vidTexture = null
      }
      setTexture(null)
      videoRef.current = null
      hlsControllerRef.current = null
    }
  }, [src, fallbackMp4, playbackRate, priority])

  // React to shouldPlay & isVisible changes
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (shouldPlay && isVisible) {
      video.playbackRate = playbackRate
      if (video.paused) {
        video.play().catch(() => {})
      }
      if (hlsControllerRef.current) {
        hlsControllerRef.current.startLoad()
      }
    } else {
      if (!video.paused) {
        video.pause()
      }
      if (hlsControllerRef.current) {
        hlsControllerRef.current.stopLoad()
      }
    }
  }, [shouldPlay, isVisible, playbackRate])

  return { texture }
}

function VideoSphere({ videoSrc, joystickVelocity, isNightSettled, isVisible }) {
  const meshRef = useRef()
  const meshRef2 = useRef()
  const meshRef3 = useRef()
  const geomRef = useRef()
  const matRef = useRef()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isAbout = location.pathname === '/about'
  const hasRenderedInitialFrameRef = useRef(false)

  const INITIAL_YAW = Math.PI / 2.65 - Math.PI * 1.1
  const INITIAL_PITCH = isAbout ? -(Math.PI / 6) : Math.PI / 17.1

  const targetRotation = useRef({ x: INITIAL_PITCH, y: INITIAL_YAW })
  const targetOpacity2 = useRef(0)
  const targetOpacity3 = useRef(0)

  // Section tracking state for Home page
  const [activeSection, setActiveSection] = useState('hero')
  const [loadBarracuda, setLoadBarracuda] = useState(false)
  const [loadTurtle, setLoadTurtle] = useState(false)

  // High performance IntersectionObserver for buttery smooth section detection (0 layout reflows!)
  useEffect(() => {
    if (!isHome) return

    const handleScrollPos = () => {
      const sy = window.scrollY
      if (sy < 150 && activeSection !== 'hero') {
        setActiveSection('hero')
      }
      if (sy > 60 && !loadBarracuda) {
        setLoadBarracuda(true)
      }
      if (sy > 800 && !loadTurtle) {
        setLoadTurtle(true)
      }
    }

    window.addEventListener('scroll', handleScrollPos, { passive: true })
    if (window.lenis) {
      window.lenis.on('scroll', handleScrollPos)
    }

    const sectionConfig = [
      { id: 'customize-dive-section', section: 'customize' },
      { id: 'who-can-dive-section', section: 'customize' },
      { id: 'airport-to-airport-section', section: 'customize' },
      { id: 'gallery-section', section: 'gallery' },
      { id: 'testimonials-section', section: 'gallery' },
      { id: 'customer-reviews', section: 'reviews' },
      { id: 'closing-cta-section', section: 'reviews' },
    ]

    const observedEls = []
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const match = sectionConfig.find((s) => s.id === entry.target.id)
            if (match) {
              setActiveSection(match.section)
              if (match.section === 'customize') setLoadBarracuda(true)
              if (match.section === 'gallery') setLoadTurtle(true)
            }
          }
        }
      },
      { rootMargin: '-15% 0px -30% 0px', threshold: 0.1 }
    )

    sectionConfig.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) {
        observer.observe(el)
        observedEls.push(el)
      }
    })

    const retryTimer = setTimeout(() => {
      sectionConfig.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el && !observedEls.includes(el)) {
          observer.observe(el)
          observedEls.push(el)
        }
      })
    }, 1000)

    handleScrollPos()

    return () => {
      clearTimeout(retryTimer)
      window.removeEventListener('scroll', handleScrollPos)
      if (window.lenis) {
        window.lenis.off('scroll', handleScrollPos)
      }
      observer.disconnect()
    }
  }, [isHome, loadBarracuda, loadTurtle, activeSection])

  // Set target opacities based on active section
  useEffect(() => {
    if (!isHome) return
    if (activeSection === 'customize') {
      targetOpacity2.current = 1
      targetOpacity3.current = 0
    } else if (activeSection === 'gallery') {
      targetOpacity2.current = 0
      targetOpacity3.current = 1
    } else {
      // hero or reviews
      targetOpacity2.current = 0
      targetOpacity3.current = 0
    }
  }, [activeSection, isHome])

  // Determine which video decoders should be actively running
  const isSphere1Active = !isHome || activeSection === 'hero' || activeSection === 'reviews' || (targetOpacity2.current < 0.95 && targetOpacity3.current < 0.95)
  const isSphere2Active = isHome && (activeSection === 'customize' || targetOpacity2.current > 0.05)
  const isSphere3Active = isHome && (activeSection === 'gallery' || targetOpacity3.current > 0.05)

  const primaryPlaybackRate = 0.5
  const isHeroSingleton = isHome
  const activeHeroSrc = videoSrc || (isAbout ? bookFile : videoFile)
  const heroFallbackMp4 = isAbout ? MASTER_1080P_BARRACUDA : MASTER_1080P_CLOWNFISH

  // 1. Primary Hero Video (Clownfish)
  const { texture } = useDirectVideoTexture(
    activeHeroSrc,
    heroFallbackMp4,
    primaryPlaybackRate,
    isHeroSingleton,
    isVisible,
    isSphere1Active
  )

  // 2. Secondary Video (Barracuda) - Loaded only on scroll towards Customize
  const { texture: texture2 } = useDirectVideoTexture(
    isHome && !isNightSettled && loadBarracuda ? bookFile : null,
    MASTER_1080P_BARRACUDA,
    0.5,
    false,
    isVisible,
    isSphere2Active
  )

  // 3. Tertiary Video (Turtle) - Loaded only on scroll towards Gallery
  const { texture: texture3 } = useDirectVideoTexture(
    isHome && !isNightSettled && loadTurtle ? turtleVideo : null,
    MASTER_1080P_TURTLE,
    0.5,
    false,
    isVisible,
    isSphere3Active
  )

  // Flip turtle video texture horizontally so it displays correctly on the sphere
  useEffect(() => {
    if (texture3) {
      texture3.wrapS = THREE.RepeatWrapping
      texture3.repeat.x = -1
      texture3.offset.x = 1
      texture3.needsUpdate = true
    }
  }, [texture3])

  // Explicit disposal of Three.js geometry & materials on unmount
  useEffect(() => {
    return () => {
      if (geomRef.current) geomRef.current.dispose()
      if (matRef.current) matRef.current.dispose()
      if (meshRef2.current?.geometry) meshRef2.current.geometry.dispose()
      if (meshRef2.current?.material) meshRef2.current.material.dispose()
      if (meshRef3.current?.geometry) meshRef3.current.geometry.dispose()
      if (meshRef3.current?.material) meshRef3.current.material.dispose()
    }
  }, [])

  // --- DRAG LOGIC (Unified, Butter-Smooth 360 Navigation) ---
  const isDragging = useRef(false)
  const previousPointer = useRef({ x: 0, y: 0 })
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onPointerMove = (e) => {
      if (!isDragging.current) return
      const dx = e.clientX - previousPointer.current.x
      const dy = e.clientY - previousPointer.current.y
      previousPointer.current = { x: e.clientX, y: e.clientY }
      dragOffset.current.y += dx * 0.004
      dragOffset.current.x += dy * 0.004
    }

    const onPointerUp = () => {
      isDragging.current = false
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }

    const onPointerDown = (e) => {
      if (window.innerWidth < 640) return
      if (
        e.target.closest(
          'button, a, input, textarea, select, [role="button"], .joystick-container, [data-no-bg-drag], .cursor-grab, [class*="cursor-grab"], [class*="overflow-x-auto"], [class*="snap-x"], [class*="carousel"], [data-carousel]'
        )
      ) {
        return
      }
      isDragging.current = true
      previousPointer.current = { x: e.clientX, y: e.clientY }
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerUp)
    }

    window.addEventListener('pointerdown', onPointerDown)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [])

  useFrame((state, delta) => {
    if (isNightSettled || !isVisible) return
    const safeDelta = Math.min(delta, 0.05)

    if (meshRef.current) {
      let op2 = 0
      let op3 = 0

      // Smoothly animate sphere 2 (Barracuda) opacity
      if (meshRef2.current && meshRef2.current.material && isHome) {
        meshRef2.current.material.opacity += (targetOpacity2.current - meshRef2.current.material.opacity) * safeDelta * 3.5
        op2 = meshRef2.current.material.opacity
        meshRef2.current.visible = Boolean(texture2) && op2 > 0.005
        if (meshRef2.current.visible) {
          meshRef2.current.rotation.y = meshRef.current.rotation.y - Math.PI / 2.5
          meshRef2.current.rotation.x = meshRef.current.rotation.x - Math.PI / 6
        }
      }

      // Smoothly animate sphere 3 (Turtle) opacity
      if (meshRef3.current && meshRef3.current.material && isHome) {
        meshRef3.current.material.opacity += (targetOpacity3.current - meshRef3.current.material.opacity) * safeDelta * 3.5
        op3 = meshRef3.current.material.opacity
        meshRef3.current.visible = Boolean(texture3) && op3 > 0.005
        if (meshRef3.current.visible) {
          meshRef3.current.rotation.y = meshRef.current.rotation.y + Math.PI * 1.45
          meshRef3.current.rotation.x = meshRef.current.rotation.x - Math.PI / 7
        }
      }

      // Sphere 1 (Clownfish) is hidden when Barracuda or Turtle completely covers it
      const isClownfishOccluded = op2 > 0.98 || op3 > 0.98
      meshRef.current.visible = Boolean(texture) && !isClownfishOccluded

      // Virtual Joystick navigation
      if (joystickVelocity && joystickVelocity.current) {
        dragOffset.current.y += joystickVelocity.current.x * safeDelta * 0.45
        dragOffset.current.x += joystickVelocity.current.y * safeDelta * 0.45
      }

      // Clamp vertical tilt (-60 to +60 degrees) so the view never flips
      dragOffset.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, dragOffset.current.x))

      const finalTargetX = targetRotation.current.x + dragOffset.current.x
      const finalTargetY = targetRotation.current.y + dragOffset.current.y

      // Slerp / Lerp rotation smoothly
      const rotSpeed = safeDelta * 6
      meshRef.current.rotation.y += (finalTargetY - meshRef.current.rotation.y) * rotSpeed
      meshRef.current.rotation.x += (finalTargetX - meshRef.current.rotation.x) * rotSpeed

      if (!hasRenderedInitialFrameRef.current && texture) {
        hasRenderedInitialFrameRef.current = true
        setHeroWebGLReady(true)
      }
    }
  })

  return (
    <group>
      <mesh ref={meshRef} scale={[-1, 1, 1]} visible={Boolean(texture)}>
        <sphereGeometry ref={geomRef} args={[500, 36, 24]} />
        <meshBasicMaterial
          ref={matRef}
          map={texture}
          side={THREE.BackSide}
          transparent={false}
          opacity={1}
          depthWrite={false}
          color="#ffffff"
        />
      </mesh>
      {isHome && !isNightSettled && (
        <>
          <mesh ref={meshRef2} scale={[-0.99, 0.99, 0.99]} visible={Boolean(texture2)}>
            <sphereGeometry args={[500, 36, 24]} />
            <meshBasicMaterial map={texture2} side={THREE.BackSide} transparent={true} opacity={0} depthWrite={false} />
          </mesh>
          <mesh ref={meshRef3} scale={[-0.98, 0.98, 0.98]} visible={Boolean(texture3)}>
            <sphereGeometry args={[500, 36, 24]} />
            <meshBasicMaterial map={texture3} side={THREE.BackSide} transparent={true} opacity={0} depthWrite={false} />
          </mesh>
        </>
      )}
    </group>
  )
}

export default function VideoSphereBackground() {
  const [mounted, setMounted] = useState(true)
  const [isMuted, setIsMuted] = useState(globalAudio.getIsMuted())
  const [isNightDive, setIsNightDive] = useState(false)
  const location = useLocation()
  const joystickVelocity = useRef({ x: 0, y: 0 })
  const nightVideoRef = useRef(null)
  const nightHlsControllerRef = useRef(null)

  const [isNightTransitioning, setIsNightTransitioning] = useState(false)
  const [isNightSettled, setIsNightSettled] = useState(false)
  const isVisible = usePageVisibility()

  const isAbout = location.pathname === '/about'
  const isSpherePage = location.pathname === '/' || isAbout
  const sphereVideo = isAbout ? bookFile : videoFile

  const shouldRenderCanvas = isVisible && isSpherePage && (!isNightSettled || isNightTransitioning)

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

  // Requirement: After Day Dive has loaded, immediately preload the first 5 seconds of Night Dive!
  useEffect(() => {
    if (getHeroVideoReady()) {
      preloadNightDiveFirst5Seconds()
    }
    const unsub = subscribeHeroVideoReady((ready) => {
      if (ready) {
        preloadNightDiveFirst5Seconds()
      }
    })
    return () => unsub()
  }, [])

  // Seamless crossfade blending when user switches between Day Dive and Night Dive
  useEffect(() => {
    setIsNightTransitioning(true)
    const video = nightVideoRef.current

    if (isNightDive) {
      // 1. Day Dive -> Night Dive:
      // Instantly start preloaded Night Dive video at millisecond 0
      if (video) {
        video.playbackRate = 1.0
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {})
        }
      }
      // 2. Day Dive sphere keeps animating beneath during the 800ms crossfade
      // 3. Once fully blended into Night Dive, softly pause Day Dive video to save GPU
      const timer = setTimeout(() => {
        setIsNightTransitioning(false)
        setIsNightSettled(true)
        pauseHeroVideo()
      }, 850)
      return () => clearTimeout(timer)
    } else {
      // 1. Night Dive -> Day Dive:
      // Immediately wake up Day Dive video so it's live beneath the fade
      setIsNightSettled(false)
      resumeHeroVideo()
      // 2. Night dive video dissolves away over 800ms
      // 3. Pause Night dive video once completely hidden
      const timer = setTimeout(() => {
        setIsNightTransitioning(false)
        if (video) video.pause()
      }, 850)
      return () => clearTimeout(timer)
    }
  }, [isNightDive])

  // Pause / resume media based on tab visibility or non-sphere pages
  useEffect(() => {
    if (!isSpherePage || !isVisible) {
      pauseHeroVideo()
      if (nightVideoRef.current && !nightVideoRef.current.paused) {
        nightVideoRef.current.pause()
      }
    } else {
      if (isNightDive) {
        if (nightVideoRef.current && nightVideoRef.current.paused) {
          nightVideoRef.current.play().catch(() => {})
        }
      } else {
        resumeHeroVideo()
      }
    }
  }, [isSpherePage, isVisible, isNightDive])

  // Synchronize with global singleton audio manager
  useEffect(() => {
    const unsub = globalAudio.subscribe(({ isMuted: muted }) => {
      setIsMuted(muted)
    })
    return () => unsub()
  }, [])

  const handleToggleAudio = () => {
    globalAudio.toggle()
  }

  if (!mounted) return null

  const isHiddenJoystickPath =
    location.pathname.startsWith('/about') ||
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
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="h-full w-full overflow-hidden relative"
          style={{
            background: 'radial-gradient(circle at center, #003865 0%, #001e3d 55%, #000e1c 100%)',
          }}
        >
          {/* Layer 2: Preloaded Night Dive Video (Crossfades seamlessly with 0ms lag) */}
          <video
            ref={(el) => {
              if (el) {
                el.muted = true
                el.defaultMuted = true
                nightVideoRef.current = el
              }
            }}
            src={nightDiveVideo}
            loop
            muted
            playsInline
            preload="none"
            disablePictureInPicture
            disableRemotePlayback
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: isSpherePage && isNightDive ? 1 : 0,
              pointerEvents: 'none',
              transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 2,
              transform: 'translate3d(0, 0, 0)',
              willChange: 'opacity, transform',
              backfaceVisibility: 'hidden',
              display: isSpherePage ? 'block' : 'none',
            }}
          />

          {/* Layer 1: Day Dive 360 Video Sphere (Only mounted on sphere routes) */}
          {isSpherePage && (
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
                pointerEvents: !isNightDive ? 'auto' : 'none',
              }}
            >
              <Canvas
                frameloop={shouldRenderCanvas ? 'always' : 'never'}
                dpr={[1, 1.25]}
                camera={{ position: [0, 0, 0.1], fov: 85 }}
                gl={{ powerPreference: 'high-performance', antialias: false, depth: false, stencil: false }}
                onCreated={({ gl, scene }) => {
                  scene.background = new THREE.Color('#001e3d')
                  gl.domElement.addEventListener(
                    'webglcontextlost',
                    (e) => {
                      e.preventDefault()
                      console.warn('THREE.WebGLRenderer: Context Lost. Handling gracefully.')
                    },
                    false
                  )
                  gl.domElement.addEventListener(
                    'webglcontextrestored',
                    () => {
                      console.info('THREE.WebGLRenderer: Context Restored.')
                    },
                    false
                  )
                }}
              >
                <color attach="background" args={['#001e3d']} />
                <Suspense fallback={null}>
                  <VideoSphere
                    videoSrc={sphereVideo}
                    isNightSettled={isNightSettled}
                    joystickVelocity={joystickVelocity}
                    isVisible={isVisible}
                  />
                </Suspense>
              </Canvas>
            </div>
          )}
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

  const isProductDetailPage =
    location.pathname.startsWith('/shop/product-') ||
    location.pathname.startsWith('/product')

  const lastClickRef = useRef(0)

  const handleDebouncedToggle = (e) => {
    e.stopPropagation()
    const now = Date.now()
    if (now - lastClickRef.current < 250) return
    lastClickRef.current = now
    onToggle()
  }

  return (
    <button
      onClick={handleDebouncedToggle}
      className={`fixed ${isProductDetailPage ? 'bottom-20 right-4 lg:bottom-6 lg:right-6' : 'bottom-6 right-6'} z-[9000] flex h-11 w-11 sm:h-12 sm:w-12 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border shadow-2xl transition-all duration-300 hover:scale-110 hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] cursor-pointer touch-manipulation active:scale-95 ${
        isLightPage
          ? 'bg-[#001e3d] text-white border-white/20 shadow-[0_6px_24px_rgba(0,30,61,0.35)]'
          : 'bg-[#001e3d]/85 text-white border-white/30 backdrop-blur-2xl shadow-[0_6px_24px_rgba(0,0,0,0.5)]'
      }`}
      aria-label={isMuted ? 'Play underwater ambiance' : 'Mute underwater ambiance'}
      title={isMuted ? 'Unmute underwater ambiance' : 'Mute underwater ambiance'}
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
  const [isHovered, setIsHovered] = useState(false)
  const [isDraggingState, setIsDraggingState] = useState(false)

  useEffect(() => {
    return () => {
      document.body.removeAttribute('data-360-dragging')
    }
  }, [])

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
    setIsDraggingState(true)
    document.body.setAttribute('data-360-dragging', 'true')
    updateJoystick(e)
    try {
      e.target.setPointerCapture(e.pointerId)
    } catch {}
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current) return
    updateJoystick(e)
  }

  const handlePointerUp = (e) => {
    isDragging.current = false
    setIsDraggingState(false)
    document.body.removeAttribute('data-360-dragging')
    setThumbPos({ x: 0, y: 0 })
    if (joystickVelocity) joystickVelocity.current = { x: 0, y: 0 }
    try {
      e.target.releasePointerCapture(e.pointerId)
    } catch {}
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

    if (joystickVelocity) {
      joystickVelocity.current = {
        x: dx / MAX_RADIUS,
        y: dy / MAX_RADIUS,
      }
    }
  }

  const isDarkBlue = isHovered || isDraggingState

  return (
    <div
      data-360-toggle="container"
      className="fixed top-1/2 right-2 sm:right-6 -translate-y-1/2 z-[8000] flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-auto joystick-container scale-90 sm:scale-100 origin-right"
    >
      <span className="text-[9px] sm:text-[10px] font-bold text-white/90 uppercase tracking-widest bg-white/10 border border-white/25 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md backdrop-blur-2xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] select-none pointer-events-none">
        360° Toggle
      </span>
      <div
        ref={containerRef}
        data-360-toggle="clickable"
        data-cursor-interactive="true"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => {
          if (!isDragging.current) {
            setIsHovered(false)
          }
        }}
        className="group/toggle relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/30 bg-white/10 backdrop-blur-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] cursor-grab active:cursor-grabbing touch-none transition-all duration-300 hover:bg-white/15 hover:border-white/40 [clip-path:circle(50%)]"
      >
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-xl transition-all duration-300 pointer-events-none ${
            isDarkBlue
              ? '!bg-[#001e3d] border-white/70 shadow-[0_0_16px_rgba(0,30,61,0.6)]'
              : 'bg-white/30 border-white/50 shadow-[0_2px_12px_rgba(255,255,255,0.25)]'
          } border group-hover/toggle:!bg-[#001e3d] group-hover/toggle:border-white/70 group-hover/toggle:shadow-[0_0_16px_rgba(0,30,61,0.6)]`}
          style={{
            transform: `translate(${thumbPos.x}px, ${thumbPos.y}px)`,
            transition: isDragging.current
              ? 'none'
              : 'transform 0.2s ease-out, background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
          }}
        />
      </div>
    </div>
  )
}
