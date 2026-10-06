import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rawSitesPath = path.resolve(__dirname, '../src/data/padiDiveSites.json')
const verifiedSitesPath = path.resolve(__dirname, '../src/data/verifiedDiveSites.json')
const verifiedCountriesPath = path.resolve(__dirname, '../src/data/verifiedCountries.json')
const validationReportPath = path.resolve(__dirname, './diveSiteValidationReport.json')
const landGeojsonPath = path.resolve(__dirname, './ne_50m_land.json')
const lakesGeojsonPath = path.resolve(__dirname, './ne_50m_lakes.json')

// Read raw PADI data
const rawData = JSON.parse(fs.readFileSync(rawSitesPath, 'utf8'))
const landData = JSON.parse(fs.readFileSync(landGeojsonPath, 'utf8'))
const lakesData = JSON.parse(fs.readFileSync(lakesGeojsonPath, 'utf8'))

// Prepare polygon structures with bounding boxes for fast pruning
function extractPolygons(geojson) {
  const polys = []
  geojson.features.forEach((f) => {
    if (!f.geometry) return
    const type = f.geometry.type
    const coords = f.geometry.coordinates
    if (type === 'Polygon') {
      polys.push(coords)
    } else if (type === 'MultiPolygon') {
      coords.forEach((p) => polys.push(p))
    }
  })

  return polys.map((p) => {
    const ring = p[0]
    let minX = 180,
      maxX = -180,
      minY = 90,
      maxY = -90
    for (let i = 0; i < ring.length; i++) {
      const x = ring[i][0]
      const y = ring[i][1]
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
    return {
      ring,
      bbox: [minX, minY, maxX, maxY],
    }
  })
}

const landPolygons = extractPolygons(landData)
const lakePolygons = extractPolygons(lakesData)

// Ray-casting point in ring test
function pointInRing(x, y, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0],
      yi = ring[i][1]
    const xj = ring[j][0],
      yj = ring[j][1]
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

function isInsidePolygonList(x, y, polyList) {
  for (let i = 0; i < polyList.length; i++) {
    const p = polyList[i]
    const [minX, minY, maxX, maxY] = p.bbox
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      if (pointInRing(x, y, p.ring)) return true
    }
  }
  return false
}

// Distance from point to line segment
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1,
    dy = y2 - y1
  if (dx === 0 && dy === 0) return Math.hypot(px - x1, py - y1)
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
}

// Minimum distance to nearest land boundary (coastline)
function getMinCoastDistance(x, y, polyList) {
  let minDist = Infinity
  for (let i = 0; i < polyList.length; i++) {
    const p = polyList[i]
    const [minX, minY, maxX, maxY] = p.bbox
    if (x < minX - 0.15 || x > maxX + 0.15 || y < minY - 0.15 || y > maxY + 0.15) {
      continue
    }
    const ring = p.ring
    for (let j = 0, k = ring.length - 1; j < ring.length; k = j++) {
      const d = distToSegment(x, y, ring[j][0], ring[j][1], ring[k][0], ring[k][1])
      if (d < minDist) minDist = d
    }
  }
  return minDist
}

// Strict classification regexes for non-dive-site entities
const PATTERNS_ACADEMY = /\b(?:acad(?:emy|emies)|st[uü]tzpunkt)\b/i
const PATTERNS_CLUB = /\b(?:(?:dive|diving|scuba)\s*club)\b/i
const PATTERNS_DIVE_CENTER = /\b(?:(?:dive|diving|scuba)\s*cent(?:er|re))\b/i
const PATTERNS_TRAINING = /\b(?:training\s*cent(?:er|re)|training\s*(?:facility|site|base)|dive\s*base|diving\s*base|scuba\s*base|school)\b/i
const PATTERNS_BUSINESS_OTHER = /\b(?:instructor|dive\s*shop|diving\s*shop|pro\s*shop|store|operator|organi[sz]ation|office|facility|business|headquarters|hq|association|resort|hotel)\b/i
const PATTERNS_PURE_POOL = /\b(?:swimming\s*pool|dive\s*pool|divertainment\s*pool|aquatic\s*cent(?:er|re))\b/i

const VALID_COASTAL_WATER_TYPES = /\b(?:reef|wreck|wall|beach|channel|drift|ocean|bay|marine|pinnacle|muck|cave|cavern|atoll|lagoon|island|shoal)\b/i

// Inland countries with no marine dive sites as confirmed by user specifications
const EXCLUDED_INLAND_COUNTRIES = new Set([
  'austria',
  'belgium',
  'czech republic',
  'germany',
  'poland',
  'hungary',
  'serbia',
  'switzerland',
])

let totalRaw = 0
let validCoordinatesCount = 0
let excludedAcademy = 0
let excludedClub = 0
let excludedDiveCenter = 0
let excludedTraining = 0
let excludedOtherBusiness = 0
let excludedInvalidCoords = 0
let excludedLandCoords = 0
let verifiedWaterDiveSites = 0

const hungaryStats = {
  raw: 0,
  nonDiveSite: 0,
  landRecords: 0,
  verified: 0,
}

const verifiedByCountry = {}

const allRawLocations = Object.entries(rawData.locationsByCountry || {})

for (const [countryName, siteList] of allRawLocations) {
  if (!Array.isArray(siteList)) continue
  const normCountry = countryName.trim().toLowerCase()

  for (const s of siteList) {
    totalRaw++
    const isHungary = s.country === 'Hungary' || normCountry === 'hungary'
    if (isHungary) hungaryStats.raw++

    const name = (s.name || '').trim()
    const title = (s.title || '').trim()
    const travelUrl = (s.travel_url || '').trim()
    const textToMatch = `${name} ${title} ${travelUrl}`
    const types = (s.types || '').trim()

    // 1. Classification check: Non-dive-site business entities
    if (PATTERNS_ACADEMY.test(textToMatch)) {
      excludedAcademy++
      if (isHungary) hungaryStats.nonDiveSite++
      continue
    }

    if (PATTERNS_CLUB.test(textToMatch)) {
      excludedClub++
      if (isHungary) hungaryStats.nonDiveSite++
      continue
    }

    if (PATTERNS_DIVE_CENTER.test(textToMatch)) {
      // Check if it's explicitly a dive site located AT a house reef (e.g., "House Reef")
      const isHouseReefSite = /\bhouse\s*reef\b/i.test(name)
      if (!isHouseReefSite) {
        excludedDiveCenter++
        if (isHungary) hungaryStats.nonDiveSite++
        continue
      }
    }

    if (PATTERNS_TRAINING.test(textToMatch)) {
      excludedTraining++
      if (isHungary) hungaryStats.nonDiveSite++
      continue
    }

    if (
      (PATTERNS_BUSINESS_OTHER.test(textToMatch) || PATTERNS_PURE_POOL.test(name) || types.toLowerCase() === 'pool') &&
      !/\b(?:reef|wreck|point|rock|island)\b/i.test(name)
    ) {
      excludedOtherBusiness++
      if (isHungary) hungaryStats.nonDiveSite++
      continue
    }

    // 2. Coordinate validation
    const lat = Number(s.latitude)
    const lon = Number(s.longitude)

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180 ||
      (lat === 0 && lon === 0)
    ) {
      excludedInvalidCoords++
      continue
    }

    validCoordinatesCount++

    // Explicit country exclusions for inland/landlocked non-marine diving countries
    if (EXCLUDED_INLAND_COUNTRIES.has(normCountry)) {
      excludedLandCoords++
      if (isHungary) hungaryStats.landRecords++
      continue
    }

    // 3. Geographic water validation
    const inLandPolygon = isInsidePolygonList(lon, lat, landPolygons)
    let isWater = false

    if (!inLandPolygon) {
      // Point is in open ocean/seas
      isWater = true
    } else {
      // Point is inside a land polygon
      // Check if it is inside a recognized major lake water body
      const inLake = isInsidePolygonList(lon, lat, lakePolygons)
      if (inLake) {
        isWater = true
      } else {
        // Point is inside land polygon and not in lakes polygon
        // Test distance to coastline (<= ~3.8 km with marine characteristics)
        const coastDist = getMinCoastDistance(lon, lat, landPolygons)
        if (coastDist <= 0.035 && VALID_COASTAL_WATER_TYPES.test(types)) {
          isWater = true
        } else {
          isWater = false
        }
      }
    }

    if (!isWater) {
      excludedLandCoords++
      if (isHungary) hungaryStats.landRecords++
      continue
    }

    // Site is an actual dive site physically in water
    verifiedWaterDiveSites++
    if (isHungary) hungaryStats.verified++

    const verifiedRecord = {
      ...s,
      isActualDiveSite: true,
      isWaterLocation: true,
      latitude: lat,
      longitude: lon,
    }

    if (!verifiedByCountry[countryName]) {
      verifiedByCountry[countryName] = []
    }
    verifiedByCountry[countryName].push(verifiedRecord)
  }
}

// Generate verified countries list (strictly countries with verified dive sites)
const countriesWithDiveSites = Object.keys(verifiedByCountry)
  .filter((c) => verifiedByCountry[c].length > 0)
  .sort((a, b) => a.localeCompare(b))

const totalNonDiveSiteExcluded =
  excludedAcademy + excludedClub + excludedDiveCenter + excludedTraining + excludedOtherBusiness

// Save outputs
const verifiedData = {
  locationsByCountry: verifiedByCountry,
  totalCount: verifiedWaterDiveSites,
  generatedAt: new Date().toISOString(),
}

fs.writeFileSync(verifiedSitesPath, JSON.stringify(verifiedData, null, 2), 'utf8')
fs.writeFileSync(verifiedCountriesPath, JSON.stringify(countriesWithDiveSites, null, 2), 'utf8')

const reportData = {
  rawPadiRecords: totalRaw,
  validCoordinates: validCoordinatesCount,
  nonDiveSiteRecordsExcluded: totalNonDiveSiteExcluded,
  academyRecordsExcluded: excludedAcademy,
  clubRecordsExcluded: excludedClub,
  diveCenterRecordsExcluded: excludedDiveCenter,
  trainingRecordsExcluded: excludedTraining,
  otherBusinessRecordsExcluded: excludedOtherBusiness,
  landCoordinatesExcluded: excludedLandCoords,
  verifiedWaterDiveSites: verifiedWaterDiveSites,
  countriesWithVerifiedDiveSites: countriesWithDiveSites.length,
  hungary: {
    rawRecords: hungaryStats.raw,
    nonDiveSiteRecords: hungaryStats.nonDiveSite,
    landRecords: hungaryStats.landRecords,
    verifiedDiveSites: hungaryStats.verified,
  },
}

fs.writeFileSync(validationReportPath, JSON.stringify(reportData, null, 2), 'utf8')

// Print validation report matching PART 13 specification
console.log('==================================================')
console.log('TDV AUTHORITATIVE DIVE SITES VALIDATION REPORT')
console.log('==================================================')
console.log(`RAW PADI RECORDS:                     ${totalRaw}`)
console.log(`VALID COORDINATES:                    ${validCoordinatesCount}`)
console.log(`NON-DIVE-SITE RECORDS EXCLUDED:       ${totalNonDiveSiteExcluded}`)
console.log(`ACADEMY RECORDS EXCLUDED:             ${excludedAcademy}`)
console.log(`CLUB RECORDS EXCLUDED:                ${excludedClub}`)
console.log(`DIVE CENTER RECORDS EXCLUDED:         ${excludedDiveCenter}`)
console.log(`TRAINING RECORDS EXCLUDED:            ${excludedTraining}`)
console.log(`OTHER BUSINESS/ORGANIZATION RECORDS:  ${excludedOtherBusiness}`)
console.log(`LAND COORDINATES EXCLUDED:            ${excludedLandCoords}`)
console.log(`VERIFIED WATER DIVE SITES:            ${verifiedWaterDiveSites}`)
console.log(`COUNTRIES WITH VERIFIED DIVE SITES:   ${countriesWithDiveSites.length}`)
console.log('--------------------------------------------------')
console.log('HUNGARY')
console.log(`Raw records:                          ${hungaryStats.raw}`)
console.log(`Non-dive-site records:                ${hungaryStats.nonDiveSite}`)
console.log(`Land records:                         ${hungaryStats.landRecords}`)
console.log(`Verified dive sites:                  ${hungaryStats.verified}`)
if (hungaryStats.verified === 0) {
  console.log('HUNGARY = 0 MARKERS')
}
console.log('==================================================')
