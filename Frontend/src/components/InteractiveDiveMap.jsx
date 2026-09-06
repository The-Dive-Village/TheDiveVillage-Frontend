import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IMAGES } from '../utils/images'

const DIVE_SITES = [
  { id: 1, name: 'Great Barrier Reef', lon: 145.8, lat: -16.5, height: 1500000, desc: 'The world\'s largest coral reef system.', depth: '5m - 30m', life: 'Manta Rays, Reef Sharks', img: IMAGES.scubaFeat1 },
  { id: 2, name: 'Blue Hole, Belize', lon: -87.53, lat: 17.31, height: 1000000, desc: 'A giant marine sinkhole off the coast of Belize.', depth: '5m - 40m', life: 'Caribbean Reef Sharks', img: IMAGES.snorkelingFeat1 },
  { id: 3, name: 'Palau, Micronesia', lon: 134.48, lat: 7.35, height: 1500000, desc: 'Famous for Blue Corner and jellyfish lake.', depth: '10m - 30m', life: 'Eagle Rays, Snappers', img: IMAGES.surfingFeat1 },
  { id: 4, name: 'Maldives', lon: 73.22, lat: 3.2, height: 2000000, desc: 'Stunning atolls and crystal clear warm waters.', depth: '10m - 30m', life: 'Whale Sharks, Turtles', img: IMAGES.scubaFeat2 },
]

// Memoization cache for generated marker SVG data URIs
const svgCache = new Map()

// Safe XML character escape for international strings
const escapeXml = (str) => {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Generate high-resolution SVG billboard for default global dive sites
const createSitePinSvg = (name) => {
  const cacheKey = `site_${name}`
  if (svgCache.has(cacheKey)) return svgCache.get(cacheKey)

  const safeName = escapeXml(name)
  const textWidth = Math.max(110, Math.round(name.length * 8.5 + 24))
  const svgWidth = textWidth + 24
  const centerX = svgWidth / 2

  const svg = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
    <svg width="${svgWidth}" height="76" viewBox="0 0 ${svgWidth} 76" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="badgeShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.75"/>
          <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#00E5FF" flood-opacity="0.35"/>
        </filter>
      </defs>
      <rect x="12" y="4" width="${textWidth}" height="28" rx="14" fill="#021426" stroke="rgba(0,229,255,0.75)" stroke-width="1.5" filter="url(#badgeShadow)"/>
      <text x="${centerX}" y="22.5" fill="#ffffff" font-size="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.3">${safeName}</text>
      
      <g transform="translate(${centerX - 14}, 38)" filter="url(#badgeShadow)">
        <path d="M14 2C8.477 2 4 6.477 4 12c0 8 10 16 10 16s10-8 10-16c0-5.523-4.477-10-10-10z" fill="#00E5FF" stroke="#ffffff" stroke-width="1.8"/>
        <polygon points="14,6.5 16,11 20.5,11.5 17,15 18,19.5 14,17 10,19.5 11,15 7.5,11.5 12,11" fill="#00223D"/>
      </g>
    </svg>
  `)
  svgCache.set(cacheKey, svg)
  return svg
}

// Generate premium Google Earth style glowing SVG billboard for PADI dive locations
const createPadiPinSvg = (name, isSelected = false, isDimmed = false) => {
  const cacheKey = `padi_${name}_${isSelected ? '1' : '0'}_${isDimmed ? '1' : '0'}`
  if (svgCache.has(cacheKey)) return svgCache.get(cacheKey)

  const rawDisplayName = name.length > 28 ? name.substring(0, 26) + '...' : name
  const safeDisplayName = escapeXml(rawDisplayName)
  const textWidth = Math.max(92, Math.round(rawDisplayName.length * 7.5 + 24))
  const svgWidth = textWidth + 30
  const centerX = svgWidth / 2

  let bgFill = '#00223D'
  let textColor = '#FFFFFF'
  let borderColor = 'rgba(0, 229, 255, 0.85)'
  let pinColor = '#00AEC7'
  let pinStroke = '#FFFFFF'
  let pinScale = '1.0'
  let glowColor = '#00E5FF'
  let glowOpacity = '0.5'
  let overallOpacity = isDimmed ? '0.55' : '1.0'

  if (isSelected) {
    bgFill = '#FFCD00'
    textColor = '#00223D'
    borderColor = '#FFFFFF'
    pinColor = '#FFCD00'
    pinStroke = '#00223D'
    pinScale = '1.3'
    glowColor = '#FFD700'
    glowOpacity = '0.9'
    overallOpacity = '1.0'
  }

  const svg = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
    <svg width="${svgWidth}" height="80" viewBox="0 0 ${svgWidth} 80" xmlns="http://www.w3.org/2000/svg" opacity="${overallOpacity}">
      <defs>
        <filter id="padiGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.8"/>
          <feDropShadow dx="0" dy="0" stdDeviation="7" flood-color="${glowColor}" flood-opacity="${glowOpacity}"/>
        </filter>
        ${isSelected ? `
        <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="9" flood-color="#FFCD00" flood-opacity="0.9"/>
        </filter>` : ''}
      </defs>
      
      ${isSelected ? `
      <!-- Pulse radar ring behind active pin -->
      <circle cx="${centerX}" cy="54" r="18" fill="none" stroke="#FFCD00" stroke-width="1.8" opacity="0.75" stroke-dasharray="3,3"/>
      ` : ''}

      <!-- Badge Title Pill -->
      <rect x="15" y="4" width="${textWidth}" height="28" rx="14" fill="${bgFill}" stroke="${borderColor}" stroke-width="${isSelected ? '2.5' : '1.3'}" filter="url(#padiGlow)"/>
      <text x="${centerX}" y="22.5" fill="${textColor}" font-size="${isSelected ? '12.5' : '11'}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="${isSelected ? '800' : '700'}" text-anchor="middle" letter-spacing="0.2">${safeDisplayName}</text>
      
      <!-- Pin Drop Marker -->
      <g transform="translate(${centerX - 14}, 36) scale(${pinScale})" filter="url(#padiGlow)">
        <path d="M14 2C8.477 2 4 6.477 4 12c0 8 10 16 10 16s10-8 10-16c0-5.523-4.477-10-10-10z" fill="${pinColor}" stroke="${pinStroke}" stroke-width="1.8"/>
        <polygon points="14,6.5 16,11 20.5,11.5 17,15 18,19.5 14,17 10,19.5 11,15 7.5,11.5 12,11" fill="${isSelected ? '#00223D' : '#FFFFFF'}"/>
      </g>
    </svg>
  `)
  svgCache.set(cacheKey, svg)
  return svg
}

export default function InteractiveDiveMap({
  onSiteSelect,
  selectedCountry = '',
  countryLocations = [],
  selectedLocation = null,
  onLocationSelect
}) {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)
  const [selectedSite, setSelectedSite] = useState(null)

  const countryLocationsRef = useRef(countryLocations)
  const selectedLocationRef = useRef(selectedLocation)
  const selectedCountryRef = useRef(selectedCountry)
  const onLocationSelectRef = useRef(onLocationSelect)
  const isProgrammaticFlightRef = useRef(false)

  const prevCountryRef = useRef(selectedCountry)
  const prevLocationRef = useRef(selectedLocation)

  countryLocationsRef.current = countryLocations
  selectedLocationRef.current = selectedLocation
  selectedCountryRef.current = selectedCountry
  onLocationSelectRef.current = onLocationSelect

  // Deterministic camera flight to Global Overview
  const flyToGlobalOverview = () => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || !window.Cesium) return

    isProgrammaticFlightRef.current = true
    viewer.camera.flyTo({
      destination: window.Cesium.Cartesian3.fromDegrees(80.0, 15.0, 11500000), // Perfectly framed Earth sphere
      orientation: {
        heading: 0.0,
        pitch: window.Cesium.Math.toRadians(-90), // Direct vertical nadir centering
        roll: 0.0
      },
      duration: 2.0,
      easingFunction: window.Cesium.EasingFunction.CUBIC_IN_OUT,
      complete: () => {
        isProgrammaticFlightRef.current = false
      },
      cancel: () => {
        isProgrammaticFlightRef.current = false
      }
    })
  }

  // Deterministic camera flight to Country Bounding Extent
  const flyToCountryBounds = (locs) => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || !window.Cesium || !locs || locs.length === 0) return

    let minLat = 90
    let maxLat = -90
    let minLon = 180
    let maxLon = -180

    locs.forEach((l) => {
      if (l.latitude < minLat) minLat = l.latitude
      if (l.latitude > maxLat) maxLat = l.latitude
      if (l.longitude < minLon) minLon = l.longitude
      if (l.longitude > maxLon) maxLon = l.longitude
    })

    const centerLon = (minLon + maxLon) / 2
    const centerLat = (minLat + maxLat) / 2
    const latSpan = maxLat - minLat
    const lonSpan = maxLon - minLon
    const maxSpan = Math.max(latSpan, lonSpan)

    // Calculate altitude to frame all dive locations in the country dead-center
    let targetAltitude
    if (locs.length === 1 || maxSpan < 0.1) {
      targetAltitude = 350000
    } else if (maxSpan < 4) {
      targetAltitude = Math.max(450000, maxSpan * 160000 + 200000)
    } else {
      targetAltitude = Math.min(4800000, Math.max(800000, maxSpan * 125000 + 350000))
    }

    isProgrammaticFlightRef.current = true
    viewer.camera.flyTo({
      destination: window.Cesium.Cartesian3.fromDegrees(centerLon, centerLat, targetAltitude),
      orientation: {
        heading: 0.0,
        pitch: window.Cesium.Math.toRadians(-88), // Clean downward center alignment
        roll: 0.0
      },
      duration: 2.0,
      easingFunction: window.Cesium.EasingFunction.CUBIC_IN_OUT,
      complete: () => {
        isProgrammaticFlightRef.current = false
      },
      cancel: () => {
        isProgrammaticFlightRef.current = false
      }
    })
  }

  // Deterministic camera flight to Dive Center Location
  const flyToLocationPoint = (loc) => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || !window.Cesium || !loc) return
    if (loc.latitude == null || loc.longitude == null) return

    isProgrammaticFlightRef.current = true
    viewer.camera.flyTo({
      destination: window.Cesium.Cartesian3.fromDegrees(
        loc.longitude,
        loc.latitude,
        50000 // Coastline dive center altitude (~50km)
      ),
      orientation: {
        heading: 0.0,
        pitch: window.Cesium.Math.toRadians(-85), // Focused and centered on the dive center
        roll: 0.0
      },
      duration: 1.8,
      easingFunction: window.Cesium.EasingFunction.CUBIC_IN_OUT,
      complete: () => {
        isProgrammaticFlightRef.current = false
      },
      cancel: () => {
        isProgrammaticFlightRef.current = false
      }
    })
  }

  // 1. Update PADI markers & Country framing when country or locations change
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || !window.Cesium) return

    // A. Remove existing PADI markers and country highlight envelope
    const entitiesToRemove = viewer.entities.values.filter(
      (e) => e.id && (String(e.id).startsWith('padi-') || String(e.id) === 'country-envelope')
    )
    entitiesToRemove.forEach((e) => viewer.entities.remove(e))

    // B. Toggle default global sites visibility
    DIVE_SITES.forEach((site) => {
      const siteEntity = viewer.entities.getById(`site-${site.id}`)
      if (siteEntity) {
        siteEntity.show = !selectedCountry
      }
    })

    // Filter valid coordinates
    const validLocs = countryLocations.filter(
      (l) => l.latitude != null && l.longitude != null && !isNaN(l.latitude) && !isNaN(l.longitude)
    )

    const hasSelection = Boolean(selectedLocation)

    // C. Add all PADI dive location markers with Google Earth NearFar distance scaling
    validLocs.forEach((loc) => {
      const isSel = selectedLocation && String(selectedLocation.id) === String(loc.id)
      const isDimmed = hasSelection && !isSel
      const displayName = loc.name || loc.title || 'Dive Center'
      const textWidth = Math.max(92, Math.round(displayName.length * 7.5 + 24))
      const svgWidth = textWidth + 30

      viewer.entities.add({
        id: `padi-${loc.id}`,
        name: loc.name,
        position: window.Cesium.Cartesian3.fromDegrees(loc.longitude, loc.latitude),
        billboard: {
          image: createPadiPinSvg(displayName, isSel, isDimmed),
          width: svgWidth,
          height: 80,
          verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
          eyeOffset: new window.Cesium.Cartesian3(0, 0, isSel ? -250 : -80),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new window.Cesium.NearFarScalar(2.0e4, 1.0, 1.2e7, 0.5),
          translucencyByDistance: new window.Cesium.NearFarScalar(2.0e4, 1.0, 1.5e7, 0.85)
        },
        properties: {
          padiLocation: loc
        }
      })
    })

    // D. Add subtle glowing country territory envelope on globe surface
    if (validLocs.length > 0) {
      let minLat = 90
      let maxLat = -90
      let minLon = 180
      let maxLon = -180

      validLocs.forEach((l) => {
        if (l.latitude < minLat) minLat = l.latitude
        if (l.latitude > maxLat) maxLat = l.latitude
        if (l.longitude < minLon) minLon = l.longitude
        if (l.longitude > maxLon) maxLon = l.longitude
      })

      const latPadding = Math.max(0.8, (maxLat - minLat) * 0.25)
      const lonPadding = Math.max(0.8, (maxLon - minLon) * 0.25)

      try {
        viewer.entities.add({
          id: 'country-envelope',
          rectangle: {
            coordinates: window.Cesium.Rectangle.fromDegrees(
              Math.max(-180, minLon - lonPadding),
              Math.max(-85, minLat - latPadding),
              Math.min(180, maxLon + lonPadding),
              Math.min(85, maxLat + latPadding)
            ),
            material: new window.Cesium.Color(0.0, 0.68, 0.78, 0.06),
            outline: true,
            outlineColor: new window.Cesium.Color(0.0, 0.9, 1.0, 0.35),
            outlineWidth: 2
          }
        })
      } catch {}
    }

    // E. Deterministic Camera Flight Transitions
    const countryChanged = prevCountryRef.current !== selectedCountry
    const locationChanged = prevLocationRef.current !== selectedLocation
    prevCountryRef.current = selectedCountry
    prevLocationRef.current = selectedLocation

    if (countryChanged) {
      if (selectedCountry && validLocs.length > 0) {
        if (!selectedLocation) {
          flyToCountryBounds(validLocs)
        } else {
          flyToLocationPoint(selectedLocation)
        }
      } else if (!selectedCountry) {
        flyToGlobalOverview()
      }
    } else if (locationChanged) {
      if (selectedLocation) {
        flyToLocationPoint(selectedLocation)
      } else if (selectedCountry && validLocs.length > 0) {
        flyToCountryBounds(validLocs)
      }
    }
  }, [selectedCountry, countryLocations, selectedLocation])

  // 2. Initialize Cesium Viewer with Crisp Daytime Google Earth Clarity
  useEffect(() => {
    let viewer = null
    let handler = null
    let intervalId = null
    let resizeObserver = null
    let isUnmounted = false

    const initCesium = () => {
      if (!window.Cesium || !containerRef.current) return false

      window.CESIUM_BASE_URL = 'https://cesium.com/downloads/cesiumjs/releases/1.132/Build/Cesium/'
      window.Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IkVxY1lQVGlOMVp4M3NtdWMiLCJqdGkiOiI2MDI2Yjg2NS0zZTA5LTQ4ODQtOGM0Mi0yYjgxOTQ1MzA4NDciLCJpZCI6NDY4NjA1LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODY5MDc0MzF9.EatbbDckxW4VVoTQ4aXQQ3mlBCvxIp1-XpM0YaLxNUM'

      viewer = new window.Cesium.Viewer(containerRef.current, {
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        infoBox: false,
        selectionIndicator: false,
        fullscreenButton: false,
      })

      if (isUnmounted) {
        viewer.destroy()
        return true
      }

      viewerRef.current = viewer

      // ResizeObserver to ensure Cesium canvas fills the exact parent dimensions at all times
      if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          if (viewer && !viewer.isDestroyed()) {
            viewer.resize()
          }
        })
        resizeObserver.observe(containerRef.current)
      }

      // Premium visual configuration & Brightness clarity
      viewer.scene.globe.baseColor = window.Cesium.Color.fromCssColorString('#021426')
      // Disable sun/night darkness so the Earth is always brightly & uniformly lit everywhere
      viewer.scene.globe.enableLighting = false
      viewer.scene.globe.showGroundAtmosphere = true
      
      if (viewer.scene.skyAtmosphere) {
        viewer.scene.skyAtmosphere.show = true
        viewer.scene.skyAtmosphere.brightnessShift = 0.15
      }
      if (viewer.scene.fog) {
        viewer.scene.fog.enabled = true
        viewer.scene.fog.density = 0.0001
      }
      
      // High-resolution satellite tiles and crisp terrain
      viewer.scene.globe.maximumScreenSpaceError = 1.25
      viewer.scene.globe.tileCacheSize = 250

      // Responsive pixel ratio: crisp on desktop, smooth on mobile
      const dpr = window.devicePixelRatio || 1
      const isMobile = window.innerWidth < 768
      viewer.resolutionScale = isMobile ? Math.min(dpr, 1.25) : Math.min(dpr, 2.0)
      
      if (viewer.scene.postProcessStages?.fxaa) {
        viewer.scene.postProcessStages.fxaa.enabled = true
      }

      // Smooth camera controller bounds & inertia
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 15000
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = 25000000
      viewer.scene.screenSpaceCameraController.inertiaSpin = 0.85
      viewer.scene.screenSpaceCameraController.inertiaTranslate = 0.85
      viewer.scene.screenSpaceCameraController.inertiaZoom = 0.8

      // Initial clean overview
      viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(80.0, 15.0, 11500000),
        orientation: {
          heading: 0.0,
          pitch: window.Cesium.Math.toRadians(-90),
          roll: 0.0
        },
        duration: 0
      })

      // Add default global Dive Site pins
      DIVE_SITES.forEach((site) => {
        const textWidth = Math.max(110, Math.round(site.name.length * 8.5 + 24))
        const svgWidth = textWidth + 24

        viewer.entities.add({
          id: `site-${site.id}`,
          position: window.Cesium.Cartesian3.fromDegrees(site.lon, site.lat),
          billboard: {
            image: createSitePinSvg(site.name),
            width: svgWidth,
            height: 76,
            verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
            eyeOffset: new window.Cesium.Cartesian3(0, 0, -50),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            scaleByDistance: new window.Cesium.NearFarScalar(2.0e4, 1.0, 1.5e7, 0.55)
          }
        })
      })

      // User Interaction & Marker Click Handler
      handler = new window.Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

      // Hover cursor management
      handler.setInputAction((movement) => {
        const pickedObject = viewer.scene.pick(movement.endPosition)
        if (window.Cesium.defined(pickedObject) && pickedObject.id) {
          viewer.scene.canvas.style.cursor = 'pointer'
        } else {
          viewer.scene.canvas.style.cursor = 'default'
        }
      }, window.Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      // Marker Click Selection
      handler.setInputAction((click) => {
        const pickedObject = viewer.scene.pick(click.position)
        if (window.Cesium.defined(pickedObject) && pickedObject.id) {
          const idStr = String(pickedObject.id.id || '')

          // Clicked a PADI Dive Location marker
          if (idStr.startsWith('padi-')) {
            const locId = idStr.replace('padi-', '')
            const loc = countryLocationsRef.current.find(
              (l) => String(l.id) === locId || String(l.padiId) === locId
            )
            if (loc) {
              onLocationSelectRef.current?.(loc)
              flyToLocationPoint(loc)
            }
            return
          }

          // Clicked a default global site marker
          if (idStr.startsWith('site-')) {
            const siteId = parseInt(idStr.split('-')[1], 10)
            const site = DIVE_SITES.find((s) => s.id === siteId)
            if (site) {
              setSelectedSite(site)
              onSiteSelect?.(site)
              isProgrammaticFlightRef.current = true
              viewer.camera.flyTo({
                destination: window.Cesium.Cartesian3.fromDegrees(site.lon, site.lat, site.height),
                orientation: {
                  heading: 0.0,
                  pitch: window.Cesium.Math.toRadians(-65),
                  roll: 0.0
                },
                duration: 2.0,
                easingFunction: window.Cesium.EasingFunction.CUBIC_IN_OUT,
                complete: () => {
                  isProgrammaticFlightRef.current = false
                },
                cancel: () => {
                  isProgrammaticFlightRef.current = false
                }
              })
            }
            return
          }
        } else {
          setSelectedSite(null)
          onSiteSelect?.(null)
        }
      }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK)

      return true
    }

    if (!initCesium()) {
      intervalId = setInterval(() => {
        if (initCesium()) {
          clearInterval(intervalId)
        }
      }, 100)
    }

    return () => {
      isUnmounted = true
      if (intervalId) clearInterval(intervalId)
      if (resizeObserver) resizeObserver.disconnect()
      if (handler) handler.destroy()
      if (viewer && !viewer.isDestroyed()) viewer.destroy()
    }
  }, [])

  return (
    <div id="dive-map-container" className="relative w-full h-full min-h-[450px] overflow-hidden bg-[#021426] pointer-events-auto">
      {/* Cleanup Cesium UI */}
      <style>{`
        .cesium-viewer-bottom,
        .cesium-viewer-toolbar,
        .cesium-viewer-animationContainer,
        .cesium-viewer-timelineContainer,
        .cesium-viewer-fullscreenContainer {
          display: none !important;
        }
        .cesium-viewer,
        .cesium-widget,
        .cesium-widget canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          outline: none !important;
          border: none !important;
          border-radius: 0 !important;
        }
      `}</style>

      {/* Cesium Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Glassmorphism Side-Panel UI */}
      <AnimatePresence>
        {selectedSite && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="absolute top-4 left-4 z-10 w-[90%] sm:w-[350px] p-6 rounded-3xl glass-premium border border-white/20 shadow-2xl flex flex-col pointer-events-auto"
          >
            <button
              onClick={() => setSelectedSite(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/30 transition"
            >
              ✕
            </button>

            <span className="text-xs font-bold uppercase tracking-widest text-accent mb-1 block">
              Dive Site
            </span>
            <h3 className="font-heading text-2xl font-bold text-white mb-2">{selectedSite.name}</h3>

            <button onClick={() => {
              setSelectedSite(null)
              onSiteSelect?.(null)
              flyToGlobalOverview()
            }} className="w-full mt-6 rounded-full bg-accent py-3 text-sm font-bold text-navy transition hover:bg-white shrink-0">
              Back to Overview
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instruction Overlay */}
      <div className="absolute top-6 right-6 pointer-events-none z-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-4 py-2 text-xs font-bold text-white border border-white/10 shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 11-.32-9.26l-5.37 5.37" />
          </svg>
          Drag to explore in 3D
        </span>
      </div>

      {/* Joystick Overlay */}
      <GlobeJoystick viewerRef={viewerRef} />
    </div>
  )
}

function GlobeJoystick({ viewerRef }) {
  const containerRef = useRef(null)
  const isDragging = useRef(false)
  const [thumbPos, setThumbPos] = useState({ x: 0, y: 0 })
  const MAX_RADIUS = 14

  const handlePointerDown = (e) => {
    isDragging.current = true
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
    setThumbPos({ x: 0, y: 0 })
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
    if (viewerRef.current) {
      viewerRef.current.camera.rotateLeft(dx * 0.003)
      viewerRef.current.camera.rotateUp(dy * 0.003)
      viewerRef.current.scene.requestRender()
    }
  }

  return (
    <div className="absolute bottom-6 right-6 z-10 flex flex-col items-center gap-2 pointer-events-auto">
      <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest bg-navy/50 px-2 py-1 rounded-md backdrop-blur-md">
        360° Control
      </span>
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-16 h-16 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing touch-none select-none"
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
