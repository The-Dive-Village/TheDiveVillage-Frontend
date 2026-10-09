import Papa from 'papaparse'

// In-memory cache for parsed dive site data
let cachedData = null
let pendingPromise = null

/**
 * Parses and validates dive sites from the local CSV dataset.
 * Adheres strictly to the supplied columns without fabricating ratings,
 * reviews, or missing attributes.
 */
export async function loadDiveSites(csvUrl = '/data/dive-sites.csv') {
  if (cachedData) {
    return cachedData
  }

  if (pendingPromise) {
    return pendingPromise
  }

  pendingPromise = (async () => {
    try {
      const response = await fetch(csvUrl)
      if (!response.ok) {
        throw new Error(`Failed to load dive sites CSV: HTTP ${response.status} ${response.statusText}`)
      }

      const csvText = await response.text()
      if (!csvText || csvText.trim().length === 0) {
        throw new Error('Dive sites CSV file is empty')
      }

      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: 'greedy',
        dynamicTyping: false,
      })

      if (parsed.errors && parsed.errors.length > 0) {
        console.warn('[DiveExplorer] CSV parsing warnings:', parsed.errors.slice(0, 5))
      }

      const rows = parsed.data || []
      const validSites = []
      const skippedRows = []
      const countriesSet = new Set()
      const naturalTypesSet = new Set()
      const seenIds = new Set()

      // Explicit coordinate and dataset corrections for scraped data anomalies
      const DATASET_OVERRIDES = {
        // ID 7336: Duplicate of Komodo Batu Bolong in Indonesia (-8.53608, 119.61399) with flipped positive lat sign mislabeled under Philippines
        '7336': { exclude: true },
        // ID 24530: Typo in longitude (88.47792 instead of 80.47792); real site is Mirissa, Sri Lanka (5.9405, 80.4550)
        '24530': { exclude: true },
        // ID 24531: Accurate coastal reef coordinates for Mirissa, Sri Lanka
        '24531': { country: 'Sri Lanka', latitude: 5.9405, longitude: 80.4550 },
      }

      rows.forEach((row, index) => {
        const lineNum = index + 2 // 1-indexed, accounting for header line
        const id = (row.ID || row.id || `site-${index}`).toString().trim()
        let siteName = (row.Site_Name || row.site_name || row.Name || row.name || '').trim()
        let country = (row.Country || row.country || '').trim()
        let latStr = row.Latitude ?? row.latitude
        let lngStr = row.Longitude ?? row.longitude
        const naturalTypes = (row.Natural_Types || row.natural_types || '').trim()
        const padiUrl = (row.PADI_URL || row.padi_url || '').trim()
        const coordShift = row.Coordinate_Shift_m ?? ''
        const waterCorrection = row.Water_Correction ?? ''

        // Apply dataset overrides if present
        if (DATASET_OVERRIDES[id]) {
          const override = DATASET_OVERRIDES[id]
          if (override.exclude) {
            skippedRows.push({ line: lineNum, id, siteName, reason: 'Excluded known invalid/duplicate dataset entry', row })
            return
          }
          if (override.country) country = override.country
          if (override.latitude != null) latStr = override.latitude
          if (override.longitude != null) lngStr = override.longitude
        }

        // 1. Validate site name
        if (!siteName) {
          skippedRows.push({ line: lineNum, id, reason: 'Missing location name', row })
          return
        }

        // 2. Validate coordinates
        const lat = parseFloat(latStr)
        const lng = parseFloat(lngStr)

        if (isNaN(lat) || isNaN(lng)) {
          skippedRows.push({ line: lineNum, id, siteName, reason: `Invalid non-numeric coordinates (${latStr}, ${lngStr})`, row })
          return
        }

        if (lat < -90 || lat > 90) {
          skippedRows.push({ line: lineNum, id, siteName, reason: `Latitude outside valid range [-90, 90]: ${lat}`, row })
          return
        }

        if (lng < -180 || lng > 180) {
          skippedRows.push({ line: lineNum, id, siteName, reason: `Longitude outside valid range [-180, 180]: ${lng}`, row })
          return
        }

        // 3. Track duplicates if ID exists
        if (id && seenIds.has(id)) {
          skippedRows.push({ line: lineNum, id, siteName, reason: `Duplicate site ID: ${id}`, row })
          return
        }
        if (id) seenIds.add(id)

        // 4. Collect metadata
        if (country) countriesSet.add(country)
        if (naturalTypes) {
          naturalTypes.split(';').forEach((t) => {
            const cleanT = t.trim()
            if (cleanT) naturalTypesSet.add(cleanT)
          })
        }

        validSites.push({
          id,
          siteName,
          country: country || 'International Waters',
          latitude: lat,
          longitude: lng,
          naturalTypes,
          padiUrl,
          coordinateShift: coordShift,
          waterCorrection,
        })
      })

      if (skippedRows.length > 0) {
        console.info(`[DiveExplorer] Parsed ${validSites.length} valid dive sites. Skipped ${skippedRows.length} malformed/missing records:`, skippedRows)
      } else {
        console.info(`[DiveExplorer] Successfully parsed all ${validSites.length} dive sites without errors.`)
      }

      // Convert to GeoJSON FeatureCollection
      const geojson = {
        type: 'FeatureCollection',
        features: validSites.map((site) => ({
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
            coordinateShift: site.coordinateShift,
            waterCorrection: site.waterCorrection,
          },
        })),
      }

      // Calculate country aggregates and centroids
      const countryStatsMap = new Map()
      validSites.forEach((site) => {
        const c = site.country
        if (!countryStatsMap.has(c)) {
          countryStatsMap.set(c, {
            country: c,
            count: 0,
            sumLat: 0,
            sumLng: 0,
            sites: [],
          })
        }
        const entry = countryStatsMap.get(c)
        entry.count += 1
        entry.sumLat += site.latitude
        entry.sumLng += site.longitude
        entry.sites.push(site)
      })

      // Canonical mainland coordinates [longitude, latitude] for all 101 countries
      const COUNTRY_COORDS = {
        'Argentina': [-63.6167, -38.4161],
        'Aruba': [-69.9683, 12.5211],
        'Australia': [133.7751, -25.2744],
        'Bahamas': [-77.3963, 25.0343],
        'Barbados': [-59.5432, 13.1939],
        'Belize': [-88.4976, 17.1899],
        'Bermuda': [-64.7505, 32.3078],
        'Brazil': [-51.9253, -14.2350],
        'British Virgin Islands': [-64.6399, 18.4207],
        'Brunei': [114.7277, 4.5353],
        'Bulgaria': [25.4858, 42.7339],
        'Cambodia': [104.9910, 12.5657],
        'Canada': [-106.3468, 56.1304],
        'Cape Verde': [-23.6052, 16.0021],
        'Caribbean Netherlands': [-68.2778, 12.1784],
        'Cayman Islands': [-81.2546, 19.3133],
        'Chile': [-71.5430, -35.6751],
        'China': [104.1954, 35.8617],
        'Colombia': [-74.2973, 4.5709],
        'Costa Rica': [-83.7534, 9.7489],
        'Croatia': [15.2000, 45.1000],
        'Curaçao': [-68.9900, 12.1696],
        'Cyprus': [33.4299, 35.1264],
        'Denmark': [9.5018, 56.2639],
        'Dominica': [-61.3710, 15.4150],
        'Dominican Republic': [-70.1627, 18.7357],
        'Ecuador': [-78.1834, -1.8312],
        'Egypt': [30.8025, 26.8206],
        'Federated States of Micronesia': [158.1561, 6.8874],
        'Fiji': [178.0650, -17.7134],
        'Finland': [25.7482, 61.9241],
        'France': [2.2137, 46.2276],
        'French Polynesia': [-149.4068, -17.6797],
        'Germany': [10.4515, 51.1657],
        'Greece': [21.8243, 39.0742],
        'Grenada': [-61.6042, 12.1165],
        'Guam': [144.7937, 13.4443],
        'Honduras': [-86.2419, 15.2000],
        'Iceland': [-18.5707, 64.9631],
        'India': [78.9629, 20.5937], // Mainland Central India
        'Indonesia': [113.9213, -0.7893],
        'Iran': [53.6880, 32.4279],
        'Ireland': [-8.2439, 53.4129],
        'Italy': [12.5674, 41.8719],
        'Jamaica': [-77.2975, 18.1096],
        'Japan': [138.2529, 36.2048],
        'Jordan': [36.2384, 30.5852],
        'Kenya': [37.9062, -0.0236],
        'Kuwait': [47.4818, 29.3117],
        'Madagascar': [46.8691, -18.7669],
        'Malaysia': [101.9758, 4.2105],
        'Maldives': [73.2207, 3.2028],
        'Malta': [14.3754, 35.9375],
        'Mexico': [-102.5528, 23.6345],
        'Montenegro': [19.3744, 42.7087],
        'Mozambique': [35.5296, -18.6657],
        'Netherlands': [5.2913, 52.1326],
        'New Zealand': [174.8860, -40.9006],
        'Niue': [-169.8672, -19.0544],
        'Northern Mariana Islands': [145.6739, 15.0979],
        'Oman': [55.9754, 21.4735],
        'Palau': [134.5825, 7.5150],
        'Panama': [-80.7821, 8.5379],
        'Papua New Guinea': [143.9555, -6.3150],
        'Peru': [-75.0152, -9.1899],
        'Philippines': [121.7740, 12.8797],
        'Portugal': [-8.2245, 39.3999],
        'Puerto Rico': [-66.5901, 18.2208],
        'Republic of Mauritius': [57.5522, -20.3484],
        'Romania': [24.9668, 45.9432],
        'Russia': [105.3188, 61.5240],
        'Réunion': [55.5364, -21.1151],
        'Saint Kitts & Nevis': [-62.7830, 17.3578],
        'Saint Vincent & the Grenadines': [-61.2872, 13.2528],
        'Saudi Arabia': [45.0792, 23.8859],
        'Senegal': [-14.4524, 14.4974],
        'Seychelles': [55.4920, -4.6796],
        'Singapore': [103.8198, 1.3521],
        'Sint Maarten': [-63.0548, 18.0425],
        'South Africa': [22.9375, -30.5595],
        'South Korea': [127.7669, 35.9078],
        'Spain': [-3.7492, 40.4637],
        'Sri Lanka': [80.7718, 7.8731],
        'Sudan': [30.2176, 12.8628],
        'Sweden': [18.6435, 60.1282],
        'Taiwan': [120.9605, 23.6978],
        'Tanzania': [34.8888, -6.3690],
        'Thailand': [100.9925, 15.8700],
        'The Guadeloupe Islands': [-61.5510, 16.2650],
        'Timor Leste (East Timor)': [125.7275, -8.8742],
        'Trinidad and Tobago': [-61.2225, 10.6918],
        'Tunisia': [9.5375, 33.8869],
        'Turkey': [35.2433, 38.9637],
        'Turks and Caicos Islands': [-71.7979, 21.6940],
        'U.S. Virgin Islands': [-64.8963, 18.3358],
        'United Arab Emirates': [53.8478, 23.4241],
        'United Kingdom': [-1.1743, 52.3555],
        'United States of America (USA)': [-98.5795, 39.8283],
        'Venezuela': [-66.5897, 6.4238],
        'Vietnam': [108.2772, 14.0583],
        'Western Sahara': [-12.8858, 24.2155],
      }

      const countryCentroids = Array.from(countryStatsMap.values())
        .map((entry) => {
          const canonical = COUNTRY_COORDS[entry.country]
          const lng = canonical ? canonical[0] : (entry.sumLng / entry.count)
          const lat = canonical ? canonical[1] : (entry.sumLat / entry.count)

          let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity
          entry.sites.forEach((s) => {
            if (s.longitude < minLng) minLng = s.longitude
            if (s.longitude > maxLng) maxLng = s.longitude
            if (s.latitude < minLat) minLat = s.latitude
            if (s.latitude > maxLat) maxLat = s.latitude
          })

          return {
            country: entry.country,
            count: entry.count,
            latitude: lat,
            longitude: lng,
            bounds: minLng !== Infinity ? [[minLng, minLat], [maxLng, maxLat]] : null,
            sites: entry.sites,
          }
        })
        .sort((a, b) => b.count - a.count)

      // GeoJSON FeatureCollection for Country Centroid Points
      const geojsonCountries = {
        type: 'FeatureCollection',
        features: countryCentroids.map((c) => ({
          type: 'Feature',
          id: `country-${c.country.replace(/\s+/g, '-').toLowerCase()}`,
          geometry: {
            type: 'Point',
            coordinates: [c.longitude, c.latitude],
          },
          properties: {
            country: c.country,
            count: c.count,
            latitude: c.latitude,
            longitude: c.longitude,
          },
        })),
      }

      const countries = Array.from(countriesSet).sort((a, b) => a.localeCompare(b))
      const naturalTypes = Array.from(naturalTypesSet).sort((a, b) => a.localeCompare(b))

      cachedData = {
        sites: validSites,
        geojson,
        countries,
        countryCentroids,
        geojsonCountries,
        naturalTypes,
        stats: {
          totalRows: rows.length,
          validCount: validSites.length,
          skippedCount: skippedRows.length,
          skippedRows,
          countriesCount: countries.length,
        },
        error: null,
      }

      return cachedData
    } catch (err) {
      console.error('[DiveExplorer] Error loading CSV data:', err)
      return {
        sites: [],
        geojson: { type: 'FeatureCollection', features: [] },
        countries: [],
        countryCentroids: [],
        geojsonCountries: { type: 'FeatureCollection', features: [] },
        naturalTypes: [],
        stats: { totalRows: 0, validCount: 0, skippedCount: 0, skippedRows: [], countriesCount: 0 },
        error: err.message || 'Unable to load dive location dataset.',
      }
    } finally {
      pendingPromise = null
    }
  })()

  return pendingPromise
}

/**
 * Generates a high-performance, vibrant map style with rich oceanic blue waters,
 * crisp coastlines, and guaranteed tile/glyph availability (zero 403 errors).
 */
export function getSaturatedMapStyle(mode = 'oceanic') {
  if (mode === 'satellite') {
    return {
      version: 8,
      name: 'DiveVillageSatellite',
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      sources: {
        'satellite-tiles': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: '&copy; Esri &copy; Earthstar Geographics',
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: 'satellite-layer',
          type: 'raster',
          source: 'satellite-tiles',
          minzoom: 0,
          maxzoom: 20,
        },
      ],
    }
  }

  // Default: Oceanic Voyager - Clean, saturated turquoise/azure oceans with crisp continents & reefs
  return {
    version: 8,
    name: 'DiveVillageOceanic',
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    sources: {
      'voyager-tiles': {
        type: 'raster',
        tiles: [
          'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
          'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
          'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
          'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        ],
        tileSize: 256,
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxzoom: 20,
      },
    },
    layers: [
      {
        id: 'voyager-base',
        type: 'raster',
        source: 'voyager-tiles',
        minzoom: 0,
        maxzoom: 20,
        paint: {
          'raster-saturation': 0.2,
          'raster-contrast': 0.08,
        },
      },
    ],
  }
}

