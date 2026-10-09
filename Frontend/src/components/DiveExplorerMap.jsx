import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { Map, setWorkerUrl, NavigationControl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import { loadDiveSites } from '../utils/diveSitesLoader'

// Official Vite worker setup for MapLibre GL JS
setWorkerUrl(workerUrl)

const DEFAULT_CENTER = [15, 20]
const DEFAULT_ZOOM = 1.8

/**
 * Generates a crisp canvas location tag / pin icon (📍) for MapLibre WebGL.
 * Anchored at the bottom point so it points exactly to the geographic coordinates.
 * Configured with a clean white border and compact dimensions.
 */
function createLocationPinIcon(width = 18, height = 24, fillColor = '#00223D', strokeColor = '#FFFFFF', innerDot = '#FFFFFF') {
  const canvas = document.createElement('canvas')
  canvas.width = width * 2
  canvas.height = height * 2
  const ctx = canvas.getContext('2d')
  ctx.scale(2, 2)

  const cx = width / 2
  const r = width * 0.36
  const cy = r + 1.2
  const tipX = cx
  const tipY = height - 1.5

  // Subtle drop shadow
  ctx.shadowColor = 'rgba(0, 15, 30, 0.35)'
  ctx.shadowBlur = 3
  ctx.shadowOffsetY = 1.5

  // Classic teardrop location tag pin path
  ctx.beginPath()
  ctx.arc(cx, cy, r, Math.PI * 0.88, Math.PI * 2.12, false)
  ctx.lineTo(tipX, tipY)
  ctx.closePath()

  // Dark blue body
  ctx.fillStyle = fillColor
  ctx.fill()

  // Crisp White stroke outline
  ctx.shadowColor = 'transparent'
  ctx.lineWidth = 1.5
  ctx.strokeStyle = strokeColor
  ctx.stroke()

  // Inner center dot
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.36, 0, Math.PI * 2)
  ctx.fillStyle = innerDot
  ctx.fill()

  return ctx.getImageData(0, 0, width * 2, height * 2)
}

export default function DiveExplorerMap({
  onSelectSite,
  onSelectCountry = null,
  selectedCountry: controlledCountry = undefined,
  selectedSite: controlledSite = null,
  selectedSiteId = null,
  compact = false,
  className = '',
  title = 'Dive Explorer',
  subtitle = 'Discover verified scuba and ocean dive locations across the globe',
  showHeading = true,
  onBookSite = null,
}) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [allSites, setAllSites] = useState([])
  const [countryCentroids, setCountryCentroids] = useState([])
  const [geojsonCountries, setGeojsonCountries] = useState({ type: 'FeatureCollection', features: [] })
  const [countriesList, setCountriesList] = useState([])
  // Two-tier navigation state:
  // selectedCountry === null -> World overview (country badges visible)
  // selectedCountry !== null -> Country zoom view (individual dive site points visible)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Selected site detail card
  const [activeSite, setActiveSite] = useState(null)
  const [tooltipInfo, setTooltipInfo] = useState(null)

  // Keep latest state in refs so asynchronous MapLibre callbacks always access fresh data
  const geojsonCountriesRef = useRef(geojsonCountries)
  const countryCentroidsRef = useRef(countryCentroids)
  const countrySitesGeoJSONRef = useRef({ type: 'FeatureCollection', features: [] })
  const selectedCountryRef = useRef(selectedCountry)
  const searchQueryRef = useRef(searchQuery)

  useEffect(() => {
    geojsonCountriesRef.current = geojsonCountries
  }, [geojsonCountries])

  useEffect(() => {
    countryCentroidsRef.current = countryCentroids
  }, [countryCentroids])

  useEffect(() => {
    selectedCountryRef.current = selectedCountry
  }, [selectedCountry])

  useEffect(() => {
    searchQueryRef.current = searchQuery
  }, [searchQuery])

  // 1. Load CSV data on mount
  useEffect(() => {
    let mounted = true
    async function initData() {
      try {
        setLoading(true)
        const data = await loadDiveSites()
        if (!mounted) return
        if (data.error) {
          setError(data.error)
        } else {
          setAllSites(data.sites || [])
          setCountryCentroids(data.countryCentroids || [])
          setGeojsonCountries(data.geojsonCountries || { type: 'FeatureCollection', features: [] })
          setCountriesList(data.countries || [])
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to initialize dive site dataset.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    initData()
    return () => {
      mounted = false
    }
  }, [])

  // 2. Compute individual dive sites GeoJSON (filtered by selected country or search)
  const countrySitesGeoJSON = useMemo(() => {
    if (!allSites.length) {
      return { type: 'FeatureCollection', features: [] }
    }

    // Only show dive sites when a specific country is active or search query is entered
    if (!selectedCountry && !searchQuery) {
      return { type: 'FeatureCollection', features: [] }
    }

    const q = searchQuery.trim().toLowerCase()
    const filtered = allSites.filter((site) => {
      // Must match selected country if active
      if (selectedCountry && site.country !== selectedCountry) {
        return false
      }
      // Search query
      if (q) {
        const nameMatch = (site.siteName || '').toLowerCase().includes(q)
        const countryMatch = (site.country || '').toLowerCase().includes(q)
        if (!nameMatch && !countryMatch) return false
      }
      return true
    })

    return {
      type: 'FeatureCollection',
      features: filtered.map((site) => ({
        type: 'Feature',
        id: site.id,
        geometry: {
          type: 'Point',
          coordinates: [site.longitude, site.latitude],
        },
        properties: {
          id: site.id,
          siteName: site.siteName,
          country: site.country,
          latitude: site.latitude,
          longitude: site.longitude,
          naturalTypes: site.naturalTypes,
          padiUrl: site.padiUrl,
        },
      })),
    }
  }, [allSites, selectedCountry, searchQuery])

  useEffect(() => {
    countrySitesGeoJSONRef.current = countrySitesGeoJSON
  }, [countrySitesGeoJSON])

  // Helper: Synchronize MapLibre sources and layer visibilities safely
  const syncMapData = useCallback((mapInstance) => {
    const map = mapInstance || mapRef.current
    if (!map || !map.isStyleLoaded()) return

    try {
      const cs = map.getSource('country-centroids-source')
      if (cs) {
        cs.setData(geojsonCountriesRef.current)
      }

      const ds = map.getSource('dive-sites-source')
      if (ds) {
        ds.setData(countrySitesGeoJSONRef.current)
      }

      const isCountryView = Boolean(selectedCountryRef.current || searchQueryRef.current)
      const countryVis = isCountryView ? 'none' : 'visible'
      const siteVis = isCountryView ? 'visible' : 'none'

      if (map.getLayer('country-pin')) {
        map.setLayoutProperty('country-pin', 'visibility', countryVis)
      }
      if (map.getLayer('site-pin')) {
        map.setLayoutProperty('site-pin', 'visibility', siteVis)
      }
    } catch (e) {
      console.warn('[DiveExplorer] syncMapData warning:', e)
    }
  }, [])

  // 3. Initialize MapLibre GL Map with OpenFreeMap Liberty Style
  useEffect(() => {
    if (!mapContainerRef.current) return

    let map = null
    let isCancelled = false

    try {
      map = new Map({
        container: mapContainerRef.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 1.2,
        maxZoom: 18,
        attributionControl: true,
        renderWorldCopies: true,
      })

      // Add navigation controls
      map.addControl(new NavigationControl({ showCompass: true, showZoom: true }), 'top-right')

      map.on('load', () => {
        if (isCancelled) return

        mapRef.current = map

        // 1. Force English ONLY on all basemap place names (removes regional scripts like "Bharat / भारत")
        try {
          const styleLayers = map.getStyle().layers || []
          styleLayers.forEach((layer) => {
            if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
              map.setLayoutProperty(layer.id, 'text-field', [
                'coalesce',
                ['get', 'name:en'],
                ['get', 'name_en'],
                ['get', 'name:latin'],
                ['get', 'name'],
              ])
            }
          })
        } catch (e) {
          console.warn('[DiveExplorer] English text setting notice:', e)
        }

        // 2. Saturated ocean & water colors + sharp coastline stroke
        try {
          if (map.getLayer('water')) {
            map.setPaintProperty('water', 'fill-color', '#1a75bb')
          }
          if (map.getLayer('waterway_river')) {
            map.setPaintProperty('waterway_river', 'line-color', '#1a75bb')
          }
          if (!map.getLayer('coastline-stroke') && map.getSource('openmaptiles')) {
            map.addLayer({
              id: 'coastline-stroke',
              type: 'line',
              source: 'openmaptiles',
              'source-layer': 'water',
              paint: {
                'line-color': '#0d47a1',
                'line-width': [
                  'interpolate', ['linear'], ['zoom'],
                  3, 0.4,
                  6, 0.8,
                  9, 1.5,
                  12, 2.2
                ],
                'line-opacity': 0.75,
              },
            }, 'waterway_line_label')
          }
        } catch (e) {
          console.warn('[DiveExplorer] Water styling notice:', e)
        }

        // 3. Register crisp dark blue location tag icons with WHITE border (smaller & sleeker)
        try {
          if (!map.hasImage('country-pin-icon')) {
            map.addImage('country-pin-icon', createLocationPinIcon(18, 24, '#00223D', '#FFFFFF', '#FFFFFF'), { pixelRatio: 2 })
          }
          if (!map.hasImage('site-pin-icon')) {
            map.addImage('site-pin-icon', createLocationPinIcon(14, 19, '#004B87', '#FFFFFF', '#FFFFFF'), { pixelRatio: 2 })
          }
        } catch (e) {
          console.warn('[DiveExplorer] Icon registration notice:', e)
        }

        // ----------------------------------------------------
        // SOURCE 1: Country Centroid Points (World Overview)
        // ----------------------------------------------------
        map.addSource('country-centroids-source', {
          type: 'geojson',
          data: geojsonCountriesRef.current,
        })

        // 1. Main Country Pin (Dark Blue Location Tag with White Border & English Name)
        map.addLayer({
          id: 'country-pin',
          type: 'symbol',
          source: 'country-centroids-source',
          layout: {
            'icon-image': 'country-pin-icon',
            'icon-size': 1,
            'icon-anchor': 'bottom',
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'text-field': ['get', 'country'],
            'text-font': ['Noto Sans Bold'],
            'text-size': 10,
            'text-offset': [0, 0.3],
            'text-anchor': 'top',
            'text-optional': true,
          },
          paint: {
            'text-color': '#001428',
            'text-halo-color': '#FFFFFF',
            'text-halo-width': 2.5,
          },
        })

        // ----------------------------------------------------
        // SOURCE 2: Individual Dive Sites (Country Zoom View)
        // ----------------------------------------------------
        map.addSource('dive-sites-source', {
          type: 'geojson',
          data: countrySitesGeoJSONRef.current,
        })

        // 2. Individual Dive Site Location Tag Pin (Compact with White Border)
        map.addLayer({
          id: 'site-pin',
          type: 'symbol',
          source: 'dive-sites-source',
          layout: {
            'icon-image': 'site-pin-icon',
            'icon-size': 1,
            'icon-anchor': 'bottom',
            'icon-allow-overlap': true,
            'text-field': ['get', 'siteName'],
            'text-font': ['Noto Sans Bold'],
            'text-size': 9.5,
            'text-offset': [0, 0.3],
            'text-anchor': 'top',
            'text-optional': true,
          },
          paint: {
            'text-color': '#001428',
            'text-halo-color': '#FFFFFF',
            'text-halo-width': 2,
          },
        })

        // ----------------------------------------------------
        // INTERACTION HANDLERS: Country Click & Hover
        // ----------------------------------------------------
        map.on('click', 'country-pin', (e) => {
          if (!e.features || !e.features.length) return
          const p = e.features[0].properties
          const countryName = p.country
          const coords = e.features[0].geometry.coordinates

          setSelectedCountry(countryName)
          setActiveSite(null)
          if (onSelectCountry) onSelectCountry(countryName)

          const countryData = countryCentroidsRef.current.find((c) => c.country === countryName)
          if (countryData && countryData.bounds) {
            map.fitBounds(countryData.bounds, {
              padding: { top: 60, bottom: 60, left: 60, right: 60 },
              maxZoom: 8.5,
              duration: 1200,
            })
          } else {
            map.flyTo({
              center: coords,
              zoom: 7.2,
              duration: 1200,
            })
          }
        })

        map.on('mouseenter', 'country-pin', (e) => {
          map.getCanvas().style.cursor = 'pointer'
          if (e.features && e.features[0]) {
            const p = e.features[0].properties
            setTooltipInfo({
              x: e.point.x,
              y: e.point.y,
              name: p.country,
              subtitle: `${p.count} Dive Sites • Click to explore`,
            })
          }
        })
        map.on('mouseleave', 'country-pin', () => {
          map.getCanvas().style.cursor = ''
          setTooltipInfo(null)
        })

        // ----------------------------------------------------
        // INTERACTION HANDLERS: Individual Site Click & Hover
        // ----------------------------------------------------
        map.on('click', 'site-pin', (e) => {
          if (!e.features || !e.features.length) return
          const p = e.features[0].properties
          const coords = e.features[0].geometry.coordinates
          const site = {
            id: p.id,
            siteName: p.siteName,
            country: p.country,
            latitude: parseFloat(p.latitude) || coords[1],
            longitude: parseFloat(p.longitude) || coords[0],
            naturalTypes: p.naturalTypes || '',
            padiUrl: p.padiUrl || '',
          }
          setActiveSite(site)
          if (onSelectSite) onSelectSite(site)

          map.flyTo({
            center: coords,
            zoom: Math.max(map.getZoom(), 9.2),
            duration: 1000,
          })
        })

        map.on('mouseenter', 'site-pin', (e) => {
          map.getCanvas().style.cursor = 'pointer'
          if (e.features && e.features[0]) {
            const p = e.features[0].properties
            setTooltipInfo({
              x: e.point.x,
              y: e.point.y,
              name: p.siteName,
              subtitle: p.naturalTypes ? `🌊 ${p.naturalTypes}` : p.country,
            })
          }
        })
        map.on('mouseleave', 'site-pin', () => {
          map.getCanvas().style.cursor = ''
          setTooltipInfo(null)
        })

        // Initial sync of layers and data
        syncMapData(map)
      })
    } catch (err) {
      if (!isCancelled) {
        console.error('[DiveExplorer] Map initialization error:', err)
        setError('Unable to load map basemap. Please check your network connection.')
      }
    }

    return () => {
      isCancelled = true
      if (map) {
        map.remove()
        mapRef.current = null
      }
    }
  }, [syncMapData, onSelectSite])

  // 4. Reactive updates when data, country, or search filters change
  useEffect(() => {
    syncMapData()
  }, [geojsonCountries, countrySitesGeoJSON, selectedCountry, searchQuery, syncMapData])

  // 5. External controlledCountry synchronization (Booking Form -> Map)
  useEffect(() => {
    if (controlledCountry === undefined) return
    const target = controlledCountry ? controlledCountry.trim() : null
    if (target !== selectedCountry) {
      setSelectedCountry(target)
      setActiveSite(null)

      if (!target) {
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            duration: 1000,
          })
        }
      } else if (mapRef.current && countryCentroids.length > 0) {
        const centroid = countryCentroids.find(
          (item) => item.country.toLowerCase() === target.toLowerCase()
        )
        if (centroid) {
          if (centroid.bounds) {
            mapRef.current.fitBounds(centroid.bounds, {
              padding: { top: 60, bottom: 60, left: 60, right: 60 },
              maxZoom: 8.5,
              duration: 1200,
            })
          } else {
            mapRef.current.flyTo({
              center: [centroid.longitude, centroid.latitude],
              zoom: 7.2,
              duration: 1200,
            })
          }
        }
      }
    }
  }, [controlledCountry, countryCentroids, selectedCountry])

  // 6. External controlledSite / selectedSiteId synchronization (Booking Form -> Map)
  useEffect(() => {
    const query = controlledSite || selectedSiteId
    if (!query || allSites.length === 0) return

    const strQuery = typeof query === 'string' ? query.trim() : ''
    if (!strQuery) return

    const cleanQuery = strQuery.toLowerCase()
    const prefixWord = strQuery.includes('(') ? strQuery.split('(')[0].trim().toLowerCase() : ''
    const insideParen = strQuery.includes('(') && strQuery.includes(')') ? strQuery.split('(')[1].split(')')[0].trim().toLowerCase() : ''

    // 1. Check exact ID match
    let match = allSites.find((s) => s.id === query)

    // 2. Search in current country first
    if (!match && selectedCountry) {
      match = allSites.find(
        (s) => s.country.toLowerCase() === selectedCountry.toLowerCase() && s.siteName.toLowerCase() === cleanQuery
      ) || allSites.find(
        (s) => s.country.toLowerCase() === selectedCountry.toLowerCase() && s.siteName.toLowerCase().includes(cleanQuery)
      ) || (prefixWord && allSites.find(
        (s) => s.country.toLowerCase() === selectedCountry.toLowerCase() && (s.siteName.toLowerCase().includes(prefixWord) || prefixWord.includes(s.siteName.toLowerCase()))
      )) || (insideParen && allSites.find(
        (s) => s.country.toLowerCase() === selectedCountry.toLowerCase() && s.siteName.toLowerCase().includes(insideParen)
      ))
    }

    // 3. Fallback search across all sites
    if (!match) {
      match = allSites.find((s) => s.siteName.toLowerCase() === cleanQuery) ||
              allSites.find((s) => s.siteName.toLowerCase().includes(cleanQuery)) ||
              (prefixWord && allSites.find((s) => s.siteName.toLowerCase().includes(prefixWord))) ||
              (insideParen && allSites.find((s) => s.siteName.toLowerCase().includes(insideParen)))
    }

    if (match && mapRef.current) {
      if (match.country && match.country !== selectedCountry) {
        setSelectedCountry(match.country)
        if (onSelectCountry) onSelectCountry(match.country)
      }
      setActiveSite(match)
      mapRef.current.flyTo({
        center: [match.longitude, match.latitude],
        zoom: Math.max(mapRef.current.getZoom(), 9.2),
        duration: 1000,
      })
    }
  }, [controlledSite, selectedSiteId, allSites, selectedCountry, onSelectCountry])

  // Return to World Overview (show all countries)
  const handleResetWorldView = useCallback(() => {
    setSelectedCountry(null)
    setSearchQuery('')
    setActiveSite(null)
    if (onSelectCountry) onSelectCountry('')
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        duration: 1000,
      })
    }
  }, [onSelectCountry])

  // When a user picks a country from the dropdown
  const handleDropdownCountryChange = (c) => {
    if (c === 'all' || !c) {
      handleResetWorldView()
      return
    }
    setSelectedCountry(c)
    setActiveSite(null)
    if (onSelectCountry) onSelectCountry(c)
    const centroid = countryCentroids.find((item) => item.country === c)
    if (centroid && mapRef.current) {
      if (centroid.bounds) {
        mapRef.current.fitBounds(centroid.bounds, {
          padding: { top: 60, bottom: 60, left: 60, right: 60 },
          maxZoom: 8.5,
          duration: 1200,
        })
      } else {
        mapRef.current.flyTo({
          center: [centroid.longitude, centroid.latitude],
          zoom: 7.2,
          duration: 1200,
        })
      }
    }
  }

  // Count of currently visible items
  const activeCountryStats = useMemo(() => {
    if (!selectedCountry) return null
    return countryCentroids.find((c) => c.country === selectedCountry) || null
  }, [selectedCountry, countryCentroids])

  return (
    <div
      className={`w-full normal-cursor ${className}`}
      data-normal-cursor
      data-dive-map="true"
    >
      {/* Mobile Standalone Search Bar Pill (Matching user mockup) */}
      <div className="sm:hidden mb-3.5">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dive site by name..."
            className="w-full pl-10 pr-9 py-3 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-navy text-xs font-bold"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Map Card */}
      <div className="flex flex-col bg-white rounded-3xl sm:rounded-[36px] border border-navy/10 shadow-card overflow-hidden w-full">
        {/* Optional Header Banner (Desktop Only) */}
        {showHeading && (
          <div className="hidden sm:flex px-5 py-4 sm:px-7 sm:py-5 border-b border-navy/10 bg-white flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Worldwide 2D Map</span>
              </div>
              <h2 className="font-heading text-lg sm:text-2xl font-bold text-navy mt-0.5">{title}</h2>
              <p className="text-xs text-navy/70 mt-0.5 max-w-xl">{subtitle}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetWorldView}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-navy/5 hover:bg-navy hover:text-white border border-navy/15 text-navy text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                title="Reset map view to the whole world"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span>World View</span>
              </button>
            </div>
          </div>
        )}

        {/* Desktop Control Bar: Search & Country / Natural Type Filters */}
        <div className="hidden sm:flex p-4 bg-slate-50/70 border-b border-navy/10 flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-navy/40">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dive site by name..."
              className="w-full pl-10 pr-8 py-2.5 rounded-full bg-white border border-slate-200/90 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-navy/40 hover:text-navy text-xs font-bold cursor-pointer"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dropdowns & Filter Controls (Desktop Only) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Country Filter */}
            <div className="relative">
              <select
                value={selectedCountry || 'all'}
                onChange={(e) => handleDropdownCountryChange(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2.5 rounded-2xl bg-white border border-navy/15 text-xs font-bold text-navy outline-none focus:border-accent cursor-pointer shadow-xs max-w-[170px] sm:max-w-[200px] truncate"
                aria-label="Select country"
              >
                <option value="all">All Countries ({countriesList.length})</option>
                {countriesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-navy/50">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* Reset button if filtered */}
            {(selectedCountry || searchQuery) && (
              <button
                type="button"
                onClick={handleResetWorldView}
                className="px-3 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition border border-rose-200 shadow-xs cursor-pointer"
              >
                Reset
              </button>
            )}

            {/* Result Count Badge */}
            <div className="ml-auto md:ml-0 text-[11px] font-bold text-navy/70 bg-white px-3 py-2 rounded-2xl border border-navy/10 shadow-xs whitespace-nowrap">
              {selectedCountry ? (
                <span><strong className="text-navy">{countrySitesGeoJSON.features.length}</strong> sites in {selectedCountry}</span>
              ) : (
                <span><strong className="text-navy">{countryCentroids.length}</strong> countries • <strong className="text-navy">{allSites.length.toLocaleString()}</strong> sites</span>
              )}
            </div>
          </div>
        </div>

        {/* Main Map Container */}
        <div
          className="relative w-full h-[400px] xs:h-[460px] sm:h-[540px] lg:h-[600px] bg-[#1a75bb] overflow-hidden normal-cursor"
          data-normal-cursor
          data-dive-map="true"
        >
        {/* MapLibre Canvas Container */}
        <div
          ref={mapContainerRef}
          className="w-full h-full normal-cursor"
          data-normal-cursor
          data-dive-map="true"
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-10 h-10 border-4 border-navy border-t-accent rounded-full animate-spin mb-3" />
            <h4 className="font-heading text-sm font-bold text-navy">Loading Dive Map...</h4>
            <p className="text-xs text-navy/60 mt-1">Reading 3,500+ coordinates from dataset</p>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-bold mb-3">!</div>
            <h4 className="font-heading text-base font-bold text-navy">Could Not Load Map</h4>
            <p className="text-xs text-rose-600 max-w-md mt-1">{error}</p>
          </div>
        )}

        {/* Level 2 Floating Banner: When inside a specific country */}
        {selectedCountry && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2 bg-navy/95 backdrop-blur-md text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-float border border-white/20 animate-in fade-in max-w-[calc(100%-4.5rem)]">
            <button
              type="button"
              onClick={handleResetWorldView}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/15 hover:bg-accent hover:text-navy text-xs font-bold transition active:scale-95 cursor-pointer shrink-0"
              title="Return to world overview"
            >
              <span>← All Countries</span>
            </button>
            <div className="h-3.5 w-px bg-white/20 shrink-0" />
            <div className="text-xs font-semibold truncate text-white/95">
              <span className="hidden sm:inline">Showing </span>
              <strong className="text-accent">{countrySitesGeoJSON.features.length}</strong> sites in <strong className="text-white">{selectedCountry}</strong>
            </div>
          </div>
        )}

        {/* World View Guidance Banner (when at country level) */}
        {!selectedCountry && !searchQuery && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-navy/15 shadow-sm text-[11px] font-bold text-navy max-w-[calc(100%-4.5rem)]">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping shrink-0" />
            <span className="truncate">Tap any country point to explore its dive sites</span>
          </div>
        )}

        {/* Hover Tooltip */}
        {tooltipInfo && !activeSite && (
          <div
            className="pointer-events-none absolute z-30 transform -translate-x-1/2 -translate-y-full mb-3 bg-navy/95 text-white text-xs px-3.5 py-2 rounded-xl shadow-lg border border-white/20 whitespace-nowrap"
            style={{ left: `${tooltipInfo.x}px`, top: `${tooltipInfo.y}px` }}
          >
            <div className="font-bold text-[#FFCD00]">{tooltipInfo.name}</div>
            {tooltipInfo.subtitle && (
              <div className="text-[10px] text-white/80 mt-0.5">{tooltipInfo.subtitle}</div>
            )}
          </div>
        )}

        {/* Floating Controls inside Map (Matching mockup: crosshair on left, map on right) */}
        <div className="absolute bottom-5 left-4 z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleResetWorldView}
            className="w-10 h-10 rounded-full bg-white text-navy shadow-float border border-navy/15 flex items-center justify-center transition active:scale-95 cursor-pointer backdrop-blur-md"
            title="Reset Map / Recenter"
            aria-label="Reset Map"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="7" />
              <circle cx="12" cy="12" r="2" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
            </svg>
          </button>
        </div>

        <div className="absolute bottom-5 right-4 z-10">
          <button
            type="button"
            onClick={handleResetWorldView}
            className="w-10 h-10 rounded-full bg-[#001e3d] text-white shadow-float flex items-center justify-center transition active:scale-95 cursor-pointer"
            title="World View"
            aria-label="World View"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
          </button>
        </div>

        {/* Selected Dive Site Drawer / Detail Card */}
        {activeSite && (
          <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-20 bg-white/98 backdrop-blur-xl rounded-3xl border border-navy/15 p-4 sm:p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-accent block">
                  {activeSite.country}
                </span>
                <h3 className="font-heading text-base sm:text-lg font-bold text-navy truncate leading-tight mt-0.5">
                  {activeSite.siteName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSite(null)}
                className="w-7 h-7 rounded-full bg-navy/10 hover:bg-navy hover:text-white text-navy flex items-center justify-center text-xs font-bold transition shrink-0 cursor-pointer"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            {/* Coordinates & Source Metadata */}
            <div className="mt-3 pt-3 border-t border-navy/10 grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-50 p-2 rounded-xl border border-navy/5">
                <span className="text-navy/50 block text-[9px] font-bold uppercase">Latitude</span>
                <span className="font-mono font-bold text-navy">{Number(activeSite.latitude).toFixed(5)}°</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-navy/5">
                <span className="text-navy/50 block text-[9px] font-bold uppercase">Longitude</span>
                <span className="font-mono font-bold text-navy">{Number(activeSite.longitude).toFixed(5)}°</span>
              </div>
            </div>

            {/* Natural Environment Types */}
            {activeSite.naturalTypes && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {activeSite.naturalTypes.split(';').map((t, i) => (
                  <span
                    key={i}
                    className="inline-block text-[10px] font-bold bg-[#001e3d]/10 text-navy px-2.5 py-1 rounded-lg"
                  >
                    🌊 {t.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-navy/10 flex items-center gap-2">
              {onBookSite && (
                <button
                  type="button"
                  onClick={() => onBookSite(activeSite)}
                  className="flex-1 rounded-full bg-navy hover:bg-accent text-white hover:text-navy px-4 py-2.5 text-xs font-bold transition text-center shadow-sm cursor-pointer"
                >
                  Select for Booking →
                </button>
              )}

              {activeSite.padiUrl && (
                <a
                  href={activeSite.padiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full border border-navy/20 text-navy text-xs font-bold hover:bg-navy hover:text-white transition cursor-pointer"
                  title="View original site details on PADI"
                >
                  <span>PADI</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dataset Attribution Footer */}
      <div className="px-4 py-2.5 bg-slate-50/90 border-t border-navy/10 flex items-center justify-between text-[10px] text-navy/60 font-semibold">
        <span>Source: Local dive site dataset (3,518 verified coordinates in 101 countries)</span>
        <span className="text-navy/40">OpenFreeMap Liberty • MapLibre GL</span>
      </div>
    </div>
  </div>
)
}
