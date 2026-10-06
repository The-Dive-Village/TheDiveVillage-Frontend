import countryList from '../data/verifiedCountries.json'

let diveSiteDataPromise = null

/**
 * Canonical country key normalization helper.
 * Converts any country string into a deterministic lowercase hyphenated key.
 * Example: "Portugal" -> "portugal", "St. Vincent & Grenadines" -> "st-vincent-grenadines"
 */
export const normalizeCountryKey = (countryName) => {
  if (!countryName || typeof countryName !== 'string') return ''
  return countryName
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

let indexedIdMap = null
let indexedCountryMap = null

/**
 * Lazy load authoritative verified dive site dataset on demand (cached after first request).
 */
export const loadDiveSiteData = async () => {
  if (!diveSiteDataPromise) {
    diveSiteDataPromise = import('../data/verifiedDiveSites.json').then((module) => {
      const data = module.default || module
      // Build O(1) fast lookup index maps once
      const idMap = new Map()
      const countryMap = new Map()
      const locMap = data.locationsByCountry || {}

      for (const [countryKey, list] of Object.entries(locMap)) {
        if (Array.isArray(list)) {
          const normKey = normalizeCountryKey(countryKey)
          if (!countryMap.has(normKey)) {
            countryMap.set(normKey, list)
          }
          for (let i = 0; i < list.length; i++) {
            const loc = list[i]
            if (loc && loc.id) {
              idMap.set(String(loc.id), loc)
            }
          }
        }
      }
      indexedIdMap = idMap
      indexedCountryMap = countryMap
      return data
    })
  }
  return diveSiteDataPromise
}

/**
 * TDV Verified Dive Site Service
 * Provides access strictly to verified actual dive sites physically in water.
 */
export const getCountries = () => countryList || []

export const getLocationsByCountry = async (country) => {
  if (!country) return []
  const data = await loadDiveSiteData()
  const targetKey = normalizeCountryKey(country)
  if (indexedCountryMap && indexedCountryMap.has(targetKey)) {
    return indexedCountryMap.get(targetKey)
  }
  const locMap = data.locationsByCountry || {}
  if (locMap[country]) return locMap[country]
  return []
}

export const getLocationById = async (id) => {
  if (!id) return null
  await loadDiveSiteData()
  const strId = String(id)
  if (indexedIdMap && indexedIdMap.has(strId)) {
    return indexedIdMap.get(strId)
  }
  return null
}

export const getLocationDisplayName = (location) => {
  if (!location) return 'Dive Site'
  if (location.title && location.title.trim()) return location.title.trim()
  if (location.name && location.name.trim()) return location.name.trim()
  if (location.travel_url && typeof location.travel_url === 'string') {
    const parts = location.travel_url.replace(/\/$/, '').split('/')
    const slug = parts[parts.length - 1]
    if (slug && slug !== 'dive-site') {
      return slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    }
  }
  return 'Dive Site'
}

export const getTotalLocationsCount = () => 4302

export const diveSiteService = {
  getCountries,
  getLocationsByCountry,
  getLocationById,
  getLocationDisplayName,
  getTotalLocationsCount,
  loadDiveSiteData,
  normalizeCountryKey
}

export default diveSiteService

