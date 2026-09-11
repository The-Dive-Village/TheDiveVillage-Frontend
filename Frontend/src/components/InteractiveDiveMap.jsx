import { useEffect, useRef, useState, useCallback } from 'react'
import { COUNTRY_CENTROIDS } from '../data/countryCentroids'
import { diveSiteService, getLocationDisplayName } from '../services/diveSiteService'
import { getDiveSiteImage, getDiveSiteCreatureInfo } from '../data/diveSiteImages'
import { loadCesium } from '../services/cesiumLoader'

// Memoization cache for generated marker SVG data URIs
const svgCache = new Map()

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
  const isCesiumReady = useRef(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [popupSite, setPopupSite] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const popupRef = useRef(null)
  const popupSiteRef = useRef(null)
  const isPopupOpenRef = useRef(false)

  const countryLocationsRef = useRef(countryLocations)
  const selectedLocationRef = useRef(selectedLocation)
  const selectedCountryRef = useRef(selectedCountry)
  const onLocationSelectRef = useRef(onLocationSelect)
  const onCountrySelectRef = useRef(onCountrySelect)
  const isProgrammaticFlightRef = useRef(false)
  const isUserInteractingRef = useRef(false)
  const lastInteractionTimeRef = useRef(Date.now())

  const prevCountryRef = useRef(selectedCountry)
  const prevLocationIdRef = useRef(selectedLocation?.id ?? null)

  countryLocationsRef.current = countryLocations
  selectedLocationRef.current = selectedLocation
  selectedCountryRef.current = selectedCountry
  onLocationSelectRef.current = onLocationSelect
  onCountrySelectRef.current = onCountrySelect
  popupSiteRef.current = popupSite
  isPopupOpenRef.current = isPopupOpen

  // Deterministic camera flight to Global Overview
  const flyToGlobalOverview = useCallback(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || !window.Cesium) return

    isProgrammaticFlightRef.current = true
    viewer.camera.flyTo({
      destination: window.Cesium.Cartesian3.fromDegrees(80.0, 15.0, 11500000),
      orientation: {
        heading: 0.0,
        pitch: window.Cesium.Math.toRadians(-90),
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
  }, [])

  // Deterministic camera flight to Country Bounding Extent
  const flyToCountryBounds = useCallback((locs, countryName) => {
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
        pitch: window.Cesium.Math.toRadians(-88),
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
  }, [])

  // Deterministic camera flight to Dive Center Location
  const flyToLocationPoint = useCallback((loc) => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || !window.Cesium || !loc) return
    const lat = Number(loc.latitude)
    const lon = Number(loc.longitude)
    if (isNaN(lat) || isNaN(lon)) return

    isProgrammaticFlightRef.current = true
    viewer.camera.flyTo({
      destination: window.Cesium.Cartesian3.fromDegrees(
        lon,
        lat,
        180000
      ),
      orientation: {
        heading: 0.0,
        pitch: window.Cesium.Math.toRadians(-75),
        roll: 0.0
      },
      duration: 1.5,
      easingFunction: window.Cesium.EasingFunction.CUBIC_IN_OUT,
      complete: () => {
        isProgrammaticFlightRef.current = false
      },
      cancel: () => {
        isProgrammaticFlightRef.current = false
      }
    })
  }, [])

  // 1. ONE-TIME INITIALIZATION: Load Cesium asynchronously and build Viewer ONCE
  useEffect(() => {
    let viewer = null
    let handler = null
    let resizeObserver = null
    let removePostRender = null
    let removeWheelListener = null
    let isUnmounted = false

    loadCesium()
      .then((Cesium) => {
        if (isUnmounted || !containerRef.current) return

        Cesium.Ion.defaultAccessToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IkVxY1lQVGlOMVp4M3NtdWMiLCJqdGkiOiI2MDI2Yjg2NS0zZTA5LTQ4ODQtOGM0Mi0yYjgxOTQ1MzA4NDciLCJpZCI6NDY4NjA1LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODY5MDc0MzF9.EatbbDckxW4VVoTQ4aXQQ3mlBCvxIp1-XpM0YaLxNUM'

        viewer = new Cesium.Viewer(containerRef.current, {
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
          requestRenderMode: false,
        })

        if (isUnmounted) {
          viewer.destroy()
          return
        }

        viewerRef.current = viewer
        isCesiumReady.current = true
        setIsLoaded(true)

        // ResizeObserver
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

        // Capped device pixel ratio for smooth performance without blur
        viewer.resolutionScale = isMobile ? Math.min(dpr, 1.25) : Math.min(dpr, 1.75)

        // Tune base imagery layer
        const tuneImageryLayer = (layer) => {
          if (!layer) return
          layer.brightness = 1.05
          layer.contrast = 1.15
          layer.gamma = 1.04
          layer.saturation = 1.12
        }

        const baseLayer = viewer.imageryLayers.get(0)
        if (baseLayer) tuneImageryLayer(baseLayer)
        viewer.imageryLayers.layerAdded.addEventListener(tuneImageryLayer)

        // Globe rendering config
        viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#021426')
        viewer.scene.globe.enableLighting = false
        viewer.scene.globe.showGroundAtmosphere = true
        viewer.scene.globe.depthTestAgainstTerrain = false
        viewer.scene.globe.tileCacheSize = 400
        viewer.scene.globe.loadingDescendantLimit = 16
        viewer.scene.globe.preloadAncestors = true
        viewer.scene.globe.preloadSiblings = false
        viewer.scene.globe.maximumScreenSpaceError = isMobile ? 2.0 : 1.5

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

        // Camera controller bounds & inertia
        viewer.scene.screenSpaceCameraController.minimumZoomDistance = 15000
        viewer.scene.screenSpaceCameraController.maximumZoomDistance = 25000000
        viewer.scene.screenSpaceCameraController.enableCollisionDetection = true
        viewer.scene.screenSpaceCameraController.inertiaSpin = 0.85
        viewer.scene.screenSpaceCameraController.inertiaTranslate = 0.85
        viewer.scene.screenSpaceCameraController.inertiaZoom = 0.8

        // Disable Cesium's default PINCH/WHEEL zoom so 2-finger slide strictly rotates the globe
        viewer.scene.screenSpaceCameraController.zoomEventTypes = [
          Cesium.CameraEventType.RIGHT_DRAG
        ]
        viewer.scene.screenSpaceCameraController.tiltEventTypes = [
          Cesium.CameraEventType.MIDDLE_DRAG
        ]

        // Adaptive SSE for 60fps interaction
        const handleMoveStart = () => {
          isUserInteractingRef.current = true
          lastInteractionTimeRef.current = Date.now()
          if (viewer && !viewer.isDestroyed()) {
            viewer.scene.globe.maximumScreenSpaceError = isMobile ? 3.0 : 2.5
          }
        }
        const handleMoveEnd = () => {
          isUserInteractingRef.current = false
          lastInteractionTimeRef.current = Date.now()
          if (viewer && !viewer.isDestroyed()) {
            viewer.scene.globe.maximumScreenSpaceError = isMobile ? 2.0 : 1.5
          }
        }

        viewer.camera.moveStart.addEventListener(handleMoveStart)
        viewer.camera.moveEnd.addEventListener(handleMoveEnd)

        // Subtle idle rotation when completely idle on world view + 60fps smooth popup positioning
        removePostRender = viewer.scene.postRender.addEventListener(() => {
          if (!viewer || viewer.isDestroyed()) return

          // 1. Screen-space coordinate tracking for dive site popup
          try {
            const popupEl = popupRef.current
            const site = popupSiteRef.current
            const isOpen = isPopupOpenRef.current

            if (popupEl) {
              if (!isOpen || !site || !viewer.scene || !viewer.camera) {
                popupEl.style.display = 'none'
              } else {
                const lat = Number(site.latitude)
                const lon = Number(site.longitude)
                if (isNaN(lat) || isNaN(lon)) {
                  popupEl.style.display = 'none'
                } else {
                  const cartesian = Cesium.Cartesian3.fromDegrees(lon, lat, 10.0)
                  const cameraPos = viewer.camera.position
                  const toPoint = Cesium.Cartesian3.subtract(cartesian, cameraPos, new Cesium.Cartesian3())
                  const dot = Cesium.Cartesian3.dot(viewer.camera.direction, toPoint)

                  const occluder = new Cesium.EllipsoidalOccluder(viewer.scene.globe.ellipsoid, cameraPos)
                  const isOccluded = !occluder.isPointVisible(cartesian)

                  if (dot <= 0 || isOccluded) {
                    popupEl.style.display = 'none'
                  } else {
                    let windowPosition = null
                    if (Cesium.SceneTransforms) {
                      if (typeof Cesium.SceneTransforms.worldToWindowCoordinates === 'function') {
                        windowPosition = Cesium.SceneTransforms.worldToWindowCoordinates(viewer.scene, cartesian)
                      } else if (typeof Cesium.SceneTransforms.wgs84ToWindowCoordinates === 'function') {
                        windowPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian)
                      }
                    }

                    if (!windowPosition) {
                      popupEl.style.display = 'none'
                    } else {
                      const canvas = viewer.scene.canvas
                      const x = windowPosition.x
                      const y = windowPosition.y

                      if (x < -120 || x > canvas.clientWidth + 120 || y < -120 || y > canvas.clientHeight + 120) {
                        popupEl.style.display = 'none'
                      } else {
                        popupEl.style.display = 'block'
                        popupEl.style.left = `${Math.round(x)}px`
                        popupEl.style.top = `${Math.round(y - 48)}px`
                      }
                    }
                  }
                }
              }
            }
          } catch (err) {
            if (popupRef.current) popupRef.current.style.display = 'none'
          }

          // 2. Idle world rotation
          if (
            selectedCountryRef.current ||
            isProgrammaticFlightRef.current ||
            isUserInteractingRef.current
          ) {
            return
          }
          if (Date.now() - lastInteractionTimeRef.current > 3500) {
            viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, -0.00025)
          }
        })

        // World terrain progressive loading
        try {
          if (typeof Cesium.createWorldTerrainAsync === 'function') {
            Cesium.createWorldTerrainAsync({
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
        } catch {}

        // Initial view
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(80.0, 15.0, 11500000),
          orientation: {
            heading: 0.0,
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
          }
        })

        // Add Country Billboard Pins & Labels for Initial World View
        COUNTRY_CENTROIDS.forEach((country) => {
          viewer.entities.add({
            id: `country-${country.name}`,
            name: country.name,
            position: Cesium.Cartesian3.fromDegrees(country.lon, country.lat),
            show: !selectedCountryRef.current,
            billboard: {
              image: createSitePinSvg(),
              width: 38,
              height: 46,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              eyeOffset: new Cesium.Cartesian3(0, 0, -50),
              scaleByDistance: new Cesium.NearFarScalar(1.0e6, 1.0, 1.8e7, 0.48),
              translucencyByDistance: new Cesium.NearFarScalar(1.0e6, 1.0, 2.0e7, 0.8)
            },
            label: {
              text: country.name,
              font: 'bold 11px Outfit, Inter, system-ui, sans-serif',
              fillColor: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.fromCssColorString('#00223D'),
              outlineWidth: 3,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              verticalOrigin: Cesium.VerticalOrigin.TOP,
              pixelOffset: new Cesium.Cartesian2(0, 4),
              scaleByDistance: new Cesium.NearFarScalar(1.0e6, 1.0, 1.8e7, 0.5),
              translucencyByDistance: new Cesium.NearFarScalar(1.0e6, 1.0, 2.0e7, 0.8),
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(100000, 20000000)
            },
            properties: {
              countryName: country.name
            }
          })
        })

        // Interaction handlers
        handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

        handler.setInputAction((movement) => {
          lastInteractionTimeRef.current = Date.now()
          const pickedObject = viewer.scene.pick(movement.endPosition)
          if (Cesium.defined(pickedObject) && pickedObject.id) {
            const idStr = String(pickedObject.id.id || '')
            if (
              idStr.startsWith('padi-') ||
              (idStr.startsWith('country-') && idStr !== 'country-envelope' && !selectedCountryRef.current)
            ) {
              viewer.scene.canvas.style.cursor = 'pointer'
              return
            }
          }
          viewer.scene.canvas.style.cursor = 'default'
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

        handler.setInputAction((click) => {
          lastInteractionTimeRef.current = Date.now()
          const pickedObject = viewer.scene.pick(click.position)
          if (Cesium.defined(pickedObject) && pickedObject.id) {
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
                setPopupSite(loc)
                setIsPopupOpen(true)
              }
              return
            }

            // 2. Clicked a Country Pin Badge (ONLY on world overview, never country-envelope)
            if (idStr.startsWith('country-') && idStr !== 'country-envelope') {
              const countryName = pickedObject.id.properties?.countryName?.getValue() || idStr.replace('country-', '')
              if (countryName && countryName !== 'envelope') {
                onCountrySelectRef.current?.(countryName)
              }
              return
            }
          }

          // 3. Clicked empty terrain / ocean / non-selectable object:
          // Close popup if open. DO NOT reset country or booking state!
          setIsPopupOpen(false)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        // Trackpad & Touch Two-Finger Rotation Gesture Controller (Rotates Globe Up/Down/Left/Right - NO ZOOM)
        const containerEl = containerRef.current
        let safariInitialScale = 1.0
        let touchStartX = null
        let touchStartY = null
        let isTwoFingerSlide = false

        const handleWheel = (e) => {
          if (!containerEl) return

          // Prevent page scroll when interacting over the globe container
          e.preventDefault()
          e.stopPropagation()

          const currentViewer = viewerRef.current
          if (!currentViewer || currentViewer.isDestroyed() || !window.Cesium) return

          const camera = currentViewer.camera
          const isExplicitPinch = e.ctrlKey || e.metaKey

          const height = camera.positionCartographic ? camera.positionCartographic.height : 10000000
          const minDist = currentViewer.scene.screenSpaceCameraController.minimumZoomDistance || 15000
          const maxDist = currentViewer.scene.screenSpaceCameraController.maximumZoomDistance || 25000000

          if (isExplicitPinch) {
            // Explicit pinch with Ctrl/Cmd key -> zoom
            const zoomFactor = Math.min(Math.max(height * 0.0025, 500), 500000)
            const zoomAmount = e.deltaY * zoomFactor

            if (zoomAmount < 0) {
              const maxAllowedZoomIn = Math.max(0, height - minDist)
              const actualZoom = Math.min(Math.abs(zoomAmount), maxAllowedZoomIn)
              if (actualZoom > 0) camera.zoomIn(actualZoom)
            } else if (zoomAmount > 0) {
              const maxAllowedZoomOut = Math.max(0, maxDist - height)
              const actualZoom = Math.min(zoomAmount, maxAllowedZoomOut)
              if (actualZoom > 0) camera.zoomOut(actualZoom)
            }
          } else {
            // ----------------------------------------------------
            // 2-FINGER SLIDE: ROTATES GLOBE UP/DOWN & LEFT/RIGHT (NO ZOOM)
            // ----------------------------------------------------
            const rotateFactor = Math.min(Math.max(height / 7000000000, 0.0003), 0.002)

            const moveX = e.deltaX
            const moveY = e.deltaY

            if (Math.abs(moveX) > 0) {
              camera.rotateLeft(-moveX * rotateFactor)
            }

            if (Math.abs(moveY) > 0) {
              // Sliding 2 fingers Up (deltaY < 0) -> rotates globe Upwards
              // Sliding 2 fingers Down (deltaY > 0) -> rotates globe Downwards
              camera.rotate(camera.right, moveY * rotateFactor)
            }
          }

          lastInteractionTimeRef.current = Date.now()
        }

        // Two-Finger Touch Screen Swipe (Mobile / Tablet / Touch laptops)
        const handleTouchStart = (e) => {
          if (e.touches.length === 2) {
            isTwoFingerSlide = true
            touchStartX = (e.touches[0].clientX + e.touches[1].clientX) / 2
            touchStartY = (e.touches[0].clientY + e.touches[1].clientY) / 2
          } else {
            isTwoFingerSlide = false
          }
        }

        const handleTouchMove = (e) => {
          if (e.touches.length === 2 && isTwoFingerSlide) {
            e.preventDefault()
            e.stopPropagation()

            const currentViewer = viewerRef.current
            if (!currentViewer || currentViewer.isDestroyed() || !window.Cesium) return
            const camera = currentViewer.camera
            const height = camera.positionCartographic ? camera.positionCartographic.height : 10000000

            const currentX = (e.touches[0].clientX + e.touches[1].clientX) / 2
            const currentY = (e.touches[0].clientY + e.touches[1].clientY) / 2

            if (touchStartX !== null && touchStartY !== null) {
              const deltaX = currentX - touchStartX
              const deltaY = currentY - touchStartY

              const rotateFactor = Math.min(Math.max(height / 3500000000, 0.0006), 0.004)

              if (Math.abs(deltaX) > 0.1) {
                camera.rotateLeft(-deltaX * rotateFactor)
              }
              if (Math.abs(deltaY) > 0.1) {
                // Dragging 2 fingers Up (deltaY < 0) -> rotates globe Upwards
                // Dragging 2 fingers Down (deltaY > 0) -> rotates globe Downwards
                camera.rotate(camera.right, deltaY * rotateFactor)
              }
            }

            touchStartX = currentX
            touchStartY = currentY
            lastInteractionTimeRef.current = Date.now()
          }
        }

        const handleTouchEnd = (e) => {
          if (e.touches.length < 2) {
            isTwoFingerSlide = false
            touchStartX = null
            touchStartY = null
          }
        }

        const handleGestureStart = (e) => {
          e.preventDefault()
          safariInitialScale = 1.0
        }

        const handleGestureChange = (e) => {
          e.preventDefault()
          const currentViewer = viewerRef.current
          if (!currentViewer || currentViewer.isDestroyed() || !window.Cesium) return

          const camera = currentViewer.camera
          const scaleDelta = e.scale - safariInitialScale
          safariInitialScale = e.scale

          const height = camera.positionCartographic ? camera.positionCartographic.height : 10000000
          const minDist = currentViewer.scene.screenSpaceCameraController.minimumZoomDistance || 15000
          const maxDist = currentViewer.scene.screenSpaceCameraController.maximumZoomDistance || 25000000
          const zoomFactor = Math.min(Math.max(height * 0.8, 5000), 2000000)

          if (scaleDelta > 0) {
            const maxAllowedZoomIn = Math.max(0, height - minDist)
            const actualZoom = Math.min(scaleDelta * zoomFactor, maxAllowedZoomIn)
            if (actualZoom > 0) camera.zoomIn(actualZoom)
          } else if (scaleDelta < 0) {
            const maxAllowedZoomOut = Math.max(0, maxDist - height)
            const actualZoom = Math.min(Math.abs(scaleDelta) * zoomFactor, maxAllowedZoomOut)
            if (actualZoom > 0) camera.zoomOut(actualZoom)
          }

          lastInteractionTimeRef.current = Date.now()
        }

        if (containerEl) {
          containerEl.addEventListener('wheel', handleWheel, { passive: false })
          containerEl.addEventListener('touchstart', handleTouchStart, { passive: false })
          containerEl.addEventListener('touchmove', handleTouchMove, { passive: false })
          containerEl.addEventListener('touchend', handleTouchEnd, { passive: false })
          containerEl.addEventListener('touchcancel', handleTouchEnd, { passive: false })
          containerEl.addEventListener('gesturestart', handleGestureStart, { passive: false })
          containerEl.addEventListener('gesturechange', handleGestureChange, { passive: false })

          removeWheelListener = () => {
            containerEl.removeEventListener('wheel', handleWheel)
            containerEl.removeEventListener('touchstart', handleTouchStart)
            containerEl.removeEventListener('touchmove', handleTouchMove)
            containerEl.removeEventListener('touchend', handleTouchEnd)
            containerEl.removeEventListener('touchcancel', handleTouchEnd)
            containerEl.removeEventListener('gesturestart', handleGestureStart)
            containerEl.removeEventListener('gesturechange', handleGestureChange)
          }
        }
      })
      .catch((err) => {
        console.warn('Cesium load notice:', err)
      })

    return () => {
      isUnmounted = true
      isCesiumReady.current = false
      if (removeWheelListener) removeWheelListener()
      if (removePostRender) removePostRender()
      if (resizeObserver) resizeObserver.disconnect()
      if (handler) handler.destroy()
      if (viewer && !viewer.isDestroyed()) viewer.destroy()
      viewerRef.current = null
    }
  }, [flyToLocationPoint])

  // 2. COUNTRY & LOCATIONS UPDATE EFFECT (Preserves Viewer instance)
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || !window.Cesium || !isLoaded) return

    const Cesium = window.Cesium

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

        viewer.entities.add({
          id: `padi-${loc.id}`,
          name: displayName || loc.title || loc.name,
          position: Cesium.Cartesian3.fromDegrees(Number(loc.longitude), Number(loc.latitude)),
          billboard: {
            image: createPadiPinSvg(isSel, isDimmed),
            width: isSel ? 48 : 38,
            height: isSel ? 56 : 46,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            eyeOffset: new Cesium.Cartesian3(0, 0, isSel ? -250 : -80),
            scaleByDistance: new Cesium.NearFarScalar(2.0e4, 1.0, 1.2e7, 0.5),
            translucencyByDistance: new Cesium.NearFarScalar(2.0e4, 1.0, 1.5e7, 0.85)
          },
          label: {
            text: displayName || loc.name,
            font: isSel ? 'bold 12px Outfit, Inter, system-ui, sans-serif' : '10px Outfit, Inter, system-ui, sans-serif',
            fillColor: isSel ? Cesium.Color.fromCssColorString('#FFCD00') : Cesium.Color.WHITE,
            outlineColor: Cesium.Color.fromCssColorString('#00223D'),
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(0, 4),
            scaleByDistance: new Cesium.NearFarScalar(1.0e4, 1.0, 8.0e6, 0.6),
            translucencyByDistance: new Cesium.NearFarScalar(1.0e4, 1.0, 1.0e7, 0.8),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1000, 6000000)
          },
          properties: {
            padiLocation: loc,
            displayName
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
              coordinates: Cesium.Rectangle.fromDegrees(
                Math.max(-180, minLon - lonPadding),
                Math.max(-85, minLat - latPadding),
                Math.min(180, maxLon + lonPadding),
                Math.min(85, maxLat + latPadding)
              ),
              material: new Cesium.Color(0.0, 0.68, 0.78, 0.06),
              outline: true,
              outlineColor: new Cesium.Color(0.0, 0.9, 1.0, 0.35),
              outlineWidth: 2
            }
          })
        } catch {}
      }
    }

    // E. Camera Flight Transitions on Country Change
    const countryChanged = prevCountryRef.current !== selectedCountry
    prevCountryRef.current = selectedCountry

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
    }
  }, [selectedCountry, countryLocations, isLoaded, flyToCountryBounds, flyToGlobalOverview, flyToLocationPoint])

  // 3. TARGETED LOCATION SELECTION EFFECT (Updates only marker visual state + camera flight)
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || !window.Cesium || !isLoaded) return

    const currentLocationId = selectedLocation?.id ?? null
    if (prevLocationIdRef.current === currentLocationId) return
    prevLocationIdRef.current = currentLocationId

    const hasSelection = Boolean(selectedLocation)

    // Update billboard pins & labels state in place without entity recreation
    countryLocations.forEach((loc) => {
      const entity = viewer.entities.getById(`padi-${loc.id}`)
      if (entity) {
        const isSel = selectedLocation && String(selectedLocation.id) === String(loc.id)
        const isDimmed = hasSelection && !isSel
        if (entity.billboard) {
          entity.billboard.image = createPadiPinSvg(isSel, isDimmed)
          entity.billboard.width = isSel ? 48 : 38
          entity.billboard.height = isSel ? 56 : 46
          entity.billboard.eyeOffset = new window.Cesium.Cartesian3(0, 0, isSel ? -250 : -80)
        }
        if (entity.label) {
          entity.label.fillColor = isSel ? window.Cesium.Color.fromCssColorString('#FFCD00') : window.Cesium.Color.WHITE
          entity.label.font = isSel ? 'bold 12px Outfit, Inter, system-ui, sans-serif' : '10px Outfit, Inter, system-ui, sans-serif'
        }
      }
    })

    if (selectedLocation) {
      setPopupSite(selectedLocation)
      setIsPopupOpen(true)
      flyToLocationPoint(selectedLocation)
    }
  }, [selectedLocation, countryLocations, isLoaded, flyToLocationPoint])

  // Reset popup when country changes
  useEffect(() => {
    setIsPopupOpen(false)
    setPopupSite(null)
  }, [selectedCountry])

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

      {/* Sleek Loading Overlay while Cesium starts */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#021426] text-cyan-400 gap-3 pointer-events-none">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-300/80 animate-pulse">
            Loading 3D Ocean Globe...
          </span>
        </div>
      )}

      {/* Instruction Overlay */}
      <div className="absolute top-6 right-6 pointer-events-none z-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-4 py-2 text-xs font-bold text-white border border-white/10 shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 11-.32-9.26l-5.37 5.37" />
          </svg>
          Drag to explore in 3D
        </span>
      </div>

      {/* Floating Dive Site Image Popup Card */}
      <div
        ref={popupRef}
        style={{ display: 'none' }}
        className="absolute z-30 pointer-events-auto transform -translate-x-1/2 -translate-y-full w-64 bg-[#00192e]/95 backdrop-blur-xl rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden border border-cyan-400/35 transition-all duration-150"
      >
        {popupSite && (() => {
          const creature = getDiveSiteCreatureInfo(popupSite.id, popupSite)
          return (
            <div className="relative">
              {/* 1. Header: Title & Close Button */}
              <div className="px-3.5 pt-3 pb-2 flex items-center justify-between gap-2 border-b border-white/10 bg-white/[0.03]">
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading font-bold text-sm text-white leading-tight truncate">
                    {popupSite.title || popupSite.name || 'Dive Site'}
                  </h3>
                  {popupSite.country && (
                    <p className="text-[10px] font-medium text-cyan-400 flex items-center gap-1 mt-0.5 truncate">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                      <span className="truncate">{popupSite.country}</span>
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsPopupOpen(false)
                  }}
                  className="text-white/60 hover:text-white w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer text-xs font-bold shrink-0"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* 2. Resident Creature & Dive Photo with Dynamic Badge */}
              <div className="w-full h-36 bg-[#021426] overflow-hidden relative group">
                <img
                  src={creature?.image || getDiveSiteImage(popupSite.id, popupSite)}
                  alt={creature?.creatureName || popupSite.title || 'Marine Life'}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00192e] via-transparent to-black/30 pointer-events-none" />

                {/* Creature Badge */}
                {creature?.creatureName && (
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 bg-[#00192e]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-accent border border-accent/40 shadow-sm max-w-[90%] truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
                      <span className="truncate">{creature.creatureName}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* 3. Marine Life & Ecological Info */}
              <div className="px-3.5 py-2.5 space-y-1.5 bg-[#00192e]/60 border-t border-white/5 text-left">
                {creature?.species && (
                  <div>
                    <span className="block text-[8.5px] font-extrabold uppercase tracking-widest text-cyan-400/80">
                      SPECIES / HABITAT
                    </span>
                    <p className="text-[11px] font-medium text-white italic truncate">
                      {creature.species}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-white/5">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-white/50">
                    DIVE TYPE
                  </span>
                  <span className="text-[11px] font-semibold text-slate-200 truncate max-w-[130px] text-right">
                    {popupSite.types || 'Reef, Ocean'}
                  </span>
                </div>

                {creature?.description && (
                  <p className="text-[10px] text-slate-300/80 line-clamp-2 leading-tight pt-0.5">
                    {creature.description}
                  </p>
                )}
              </div>

              {/* 4. Action Footer: View Details Link & ID */}
              <div className="px-3.5 py-2 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
                {popupSite.travel_url ? (
                  <a
                    href={popupSite.travel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition group cursor-pointer"
                  >
                    <span>View Details</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </a>
                ) : (
                  <span className="text-xs font-bold text-cyan-400/70">
                    Verified PADI Site
                  </span>
                )}
                <span className="text-[10px] font-mono font-medium text-white/40">
                  #{popupSite.id}
                </span>
              </div>

              {/* Bottom Marker Pointer Needle */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#00192e] rotate-45 border-r border-b border-cyan-400/35 pointer-events-none" />
            </div>
          )
        })()}
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
    if (viewerRef.current && !viewerRef.current.isDestroyed()) {
      viewerRef.current.camera.rotateLeft(dx * 0.003)
      viewerRef.current.camera.rotateUp(dy * 0.003)
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
