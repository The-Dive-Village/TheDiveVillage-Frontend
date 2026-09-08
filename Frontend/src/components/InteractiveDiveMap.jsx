import { useEffect, useRef, useState } from 'react'
import { COUNTRY_CENTROIDS } from '../data/countryCentroids'
import { getLocationDisplayName } from '../services/padiLocationService'

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

// Generate high-resolution SVG billboard pin for countries
const createSitePinSvg = () => {
  const cacheKey = 'site_pin_icon'
  if (svgCache.has(cacheKey)) return svgCache.get(cacheKey)

  const svg = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg width="44" height="52" viewBox="0 0 44 52" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="badgeShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.8"/>
          <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#00E5FF" flood-opacity="0.55"/>
        </filter>
      </defs>
      
      <g transform="translate(8, 6)" filter="url(#badgeShadow)">
        <path d="M14 2C8.477 2 4 6.477 4 12c0 8 10 18 10 18s10-10 10-18c0-5.523-4.477-10-10-10z" fill="#00E5FF" stroke="#ffffff" stroke-width="2"/>
        <polygon points="14,6.5 16,11 20.5,11.5 17,15 18,19.5 14,17 10,19.5 11,15 7.5,11.5 12,11" fill="#00223D"/>
      </g>
    </svg>
  `)
  svgCache.set(cacheKey, svg)
  return svg
}

// Generate premium Google Earth style glowing SVG billboard pin for PADI dive locations
const createPadiPinSvg = (isSelected = false, isDimmed = false) => {
  const cacheKey = `padi_pin_${isSelected ? '1' : '0'}_${isDimmed ? '1' : '0'}`
  if (svgCache.has(cacheKey)) return svgCache.get(cacheKey)

  let pinColor = '#00AEC7'
  let pinStroke = '#FFFFFF'
  let iconFill = '#FFFFFF'
  let glowColor = '#00E5FF'
  let glowOpacity = '0.6'
  let overallOpacity = isDimmed ? '0.55' : '1.0'
  let pinScale = isSelected ? '1.25' : '1.0'

  if (isSelected) {
    pinColor = '#FFCD00'
    pinStroke = '#00223D'
    iconFill = '#00223D'
    glowColor = '#FFD700'
    glowOpacity = '0.9'
    overallOpacity = '1.0'
  }

  const svg = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg width="48" height="56" viewBox="0 0 48 56" xmlns="http://www.w3.org/2000/svg" opacity="${overallOpacity}">
      <defs>
        <filter id="padiGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.8"/>
          <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="${glowColor}" flood-opacity="${glowOpacity}"/>
        </filter>
      </defs>
      
      ${isSelected ? `
      <!-- Pulse radar ring behind active pin -->
      <circle cx="24" cy="40" r="14" fill="none" stroke="#FFCD00" stroke-width="2" opacity="0.8" stroke-dasharray="3,3"/>
      ` : ''}

      <!-- Pin Drop Marker -->
      <g transform="translate(10, 8) scale(${pinScale})" filter="url(#padiGlow)">
        <path d="M14 2C8.477 2 4 6.477 4 12c0 8 10 18 10 18s10-10 10-18c0-5.523-4.477-10-10-10z" fill="${pinColor}" stroke="${pinStroke}" stroke-width="2"/>
        <polygon points="14,6.5 16,11 20.5,11.5 17,15 18,19.5 14,17 10,19.5 11,15 7.5,11.5 12,11" fill="${iconFill}"/>
      </g>
    </svg>
  `)
  svgCache.set(cacheKey, svg)
  return svg
}

export default function InteractiveDiveMap({
  selectedCountry = '',
  countryLocations = [],
  selectedLocation = null,
  onLocationSelect,
  onCountrySelect
}) {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)

  const countryLocationsRef = useRef(countryLocations)
  const selectedLocationRef = useRef(selectedLocation)
  const selectedCountryRef = useRef(selectedCountry)
  const onLocationSelectRef = useRef(onLocationSelect)
  const onCountrySelectRef = useRef(onCountrySelect)
  const isProgrammaticFlightRef = useRef(false)

  const prevCountryRef = useRef(selectedCountry)
  const prevLocationRef = useRef(selectedLocation)

  countryLocationsRef.current = countryLocations
  selectedLocationRef.current = selectedLocation
  selectedCountryRef.current = selectedCountry
  onLocationSelectRef.current = onLocationSelect
  onCountrySelectRef.current = onCountrySelect

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
  const flyToCountryBounds = (locs, countryName) => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || !window.Cesium) return

    let centerLon = 80.0
    let centerLat = 15.0
    let targetAltitude = 2500000

    if (locs && locs.length > 0) {
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

      centerLon = (minLon + maxLon) / 2
      centerLat = (minLat + maxLat) / 2
      const latSpan = maxLat - minLat
      const lonSpan = maxLon - minLon
      const maxSpan = Math.max(latSpan, lonSpan)

      if (locs.length === 1 || maxSpan < 0.1) {
        targetAltitude = 350000
      } else if (maxSpan < 4) {
        targetAltitude = Math.max(450000, maxSpan * 160000 + 200000)
      } else {
        targetAltitude = Math.min(4800000, Math.max(800000, maxSpan * 125000 + 350000))
      }
    } else if (countryName) {
      const centroid = COUNTRY_CENTROIDS.find((c) => c.name.toLowerCase() === countryName.toLowerCase())
      if (centroid) {
        centerLon = centroid.lon
        centerLat = centroid.lat
        targetAltitude = 2800000
      }
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

  // 1. Update PADI markers & Country visibility when country or locations change
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || !window.Cesium) return

    // A. Remove existing PADI markers and country highlight envelope
    const entitiesToRemove = viewer.entities.values.filter(
      (e) => e.id && (String(e.id).startsWith('padi-') || String(e.id) === 'country-envelope')
    )
    entitiesToRemove.forEach((e) => viewer.entities.remove(e))

    // B. Toggle country pins visibility
    COUNTRY_CENTROIDS.forEach((c) => {
      const countryEntity = viewer.entities.getById(`country-${c.name}`)
      if (countryEntity) {
        countryEntity.show = !selectedCountry
      }
    })

    // Filter valid coordinates for selected country
    const validLocs = countryLocations.filter(
      (l) => l.latitude != null && l.longitude != null && !isNaN(l.latitude) && !isNaN(l.longitude)
    )

    const hasSelection = Boolean(selectedLocation)

    // C. When country is selected, add all PADI dive location markers
    if (selectedCountry) {
      validLocs.forEach((loc) => {
        const isSel = selectedLocation && String(selectedLocation.id) === String(loc.id)
        const isDimmed = hasSelection && !isSel
        const displayName = getLocationDisplayName(loc)
        const textWidth = Math.max(92, Math.round(displayName.length * 7.5 + 24))
        const svgWidth = textWidth + 30

        viewer.entities.add({
          id: `padi-${loc.id}`,
          name: loc.name,
          position: window.Cesium.Cartesian3.fromDegrees(loc.longitude, loc.latitude),
          billboard: {
            image: createPadiPinSvg(isSel, isDimmed),
            width: isSel ? 48 : 38,
            height: isSel ? 56 : 46,
            verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
            eyeOffset: new window.Cesium.Cartesian3(0, 0, isSel ? -250 : -80),
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
    }

    // E. Deterministic Camera Flight Transitions
    const countryChanged = prevCountryRef.current !== selectedCountry
    const locationChanged = prevLocationRef.current !== selectedLocation
    prevCountryRef.current = selectedCountry
    prevLocationRef.current = selectedLocation

    if (countryChanged) {
      if (selectedCountry) {
        if (!selectedLocation) {
          flyToCountryBounds(validLocs, selectedCountry)
        } else {
          flyToLocationPoint(selectedLocation)
        }
      } else {
        flyToGlobalOverview()
      }
    } else if (locationChanged) {
      if (selectedLocation) {
        flyToLocationPoint(selectedLocation)
      } else if (selectedCountry) {
        flyToCountryBounds(validLocs, selectedCountry)
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

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const isMobile = window.innerWidth < 768

      // Device Pixel Ratio: Sharp on desktop (1.75 max), fast & smooth on mobile (1.25 max)
      viewer.resolutionScale = isMobile ? Math.min(dpr, 1.25) : Math.min(dpr, 1.75)

      // Enhance base satellite imagery layer clarity, coastline contrast, and ocean vibrancy
      const tuneImageryLayer = (layer) => {
        if (!layer) return
        layer.brightness = 1.05
        layer.contrast = 1.16
        layer.gamma = 1.04
        layer.saturation = 1.12
      }

      const baseLayer = viewer.imageryLayers.get(0)
      if (baseLayer) tuneImageryLayer(baseLayer)
      viewer.imageryLayers.layerAdded.addEventListener(tuneImageryLayer)

      // Progressive tile loading, tile caching & sharp rendering
      viewer.scene.globe.baseColor = window.Cesium.Color.fromCssColorString('#021426')
      viewer.scene.globe.enableLighting = false
      viewer.scene.globe.showGroundAtmosphere = true
      viewer.scene.globe.depthTestAgainstTerrain = false
      viewer.scene.globe.tileCacheSize = 600
      viewer.scene.globe.loadingDescendantLimit = 20
      viewer.scene.globe.preloadAncestors = true
      viewer.scene.globe.preloadSiblings = false
      viewer.scene.globe.maximumScreenSpaceError = isMobile ? 1.5 : 1.0

      // Sky atmosphere & fog configuration for geographic clarity
      if (viewer.scene.skyAtmosphere) {
        viewer.scene.skyAtmosphere.show = true
        viewer.scene.skyAtmosphere.brightnessShift = 0.12
        viewer.scene.skyAtmosphere.saturationShift = 0.05
      }
      if (viewer.scene.fog) {
        viewer.scene.fog.enabled = true
        viewer.scene.fog.density = 0.00008
        viewer.scene.fog.screenSpaceErrorFactor = 2.0
      }

      if (viewer.scene.postProcessStages?.fxaa) {
        viewer.scene.postProcessStages.fxaa.enabled = true
      }

      // Smooth camera controller bounds & inertia
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 15000
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = 25000000
      viewer.scene.screenSpaceCameraController.inertiaSpin = 0.85
      viewer.scene.screenSpaceCameraController.inertiaTranslate = 0.85
      viewer.scene.screenSpaceCameraController.inertiaZoom = 0.8

      // Adaptive Screen Space Error: High FPS during camera flight/drag, razor sharp detail when settled
      const handleMoveStart = () => {
        if (viewer && !viewer.isDestroyed()) {
          viewer.scene.globe.maximumScreenSpaceError = isMobile ? 3.0 : 2.5
        }
      }
      const handleMoveEnd = () => {
        if (viewer && !viewer.isDestroyed()) {
          viewer.scene.globe.maximumScreenSpaceError = isMobile ? 1.5 : 1.0
        }
      }

      viewer.camera.moveStart.addEventListener(handleMoveStart)
      viewer.camera.moveEnd.addEventListener(handleMoveEnd)

      // Asynchronously load World Terrain with water masks without blocking fast initial render
      try {
        if (typeof window.Cesium.createWorldTerrainAsync === 'function') {
          window.Cesium.createWorldTerrainAsync({
            requestVertexNormals: true,
            requestWaterMask: true
          })
            .then((terrainProvider) => {
              if (viewer && !viewer.isDestroyed()) {
                viewer.terrainProvider = terrainProvider
              }
            })
            .catch(() => {})
        }
      } catch (err) {}

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

      // Add Country Billboard Pins for Initial World View
      COUNTRY_CENTROIDS.forEach((country) => {
        const textWidth = Math.max(100, Math.round(country.name.length * 8.2 + 24))
        const svgWidth = textWidth + 24

        viewer.entities.add({
          id: `country-${country.name}`,
          name: country.name,
          position: window.Cesium.Cartesian3.fromDegrees(country.lon, country.lat),
          show: !selectedCountryRef.current,
          billboard: {
            image: createSitePinSvg(),
            width: 38,
            height: 46,
            verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
            eyeOffset: new window.Cesium.Cartesian3(0, 0, -50),
            scaleByDistance: new window.Cesium.NearFarScalar(1.0e6, 1.0, 1.8e7, 0.48),
            translucencyByDistance: new window.Cesium.NearFarScalar(1.0e6, 1.0, 2.0e7, 0.8)
          },
          properties: {
            countryName: country.name
          }
        })
      })

      // User Interaction & Click Handlers
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

      // Click Selection Handler
      handler.setInputAction((click) => {
        const pickedObject = viewer.scene.pick(click.position)
        if (window.Cesium.defined(pickedObject) && pickedObject.id) {
          const idStr = String(pickedObject.id.id || '')

          // 1. Clicked a PADI Dive Location marker
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

          // 2. Clicked a Country Pin Badge
          if (idStr.startsWith('country-') || pickedObject.id.properties?.countryName) {
            const countryName = pickedObject.id.properties?.countryName?.getValue() || idStr.replace('country-', '')
            if (countryName) {
              onCountrySelectRef.current?.(countryName)
            }
            return
          }
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
