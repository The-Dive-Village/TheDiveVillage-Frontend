import countryList from '../data/padiCountries.json'

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

/**
 * Lazy load full PADI dive site dataset on demand (cached after first request).
 */
export const loadDiveSiteData = async () => {
  if (!diveSiteDataPromise) {
    diveSiteDataPromise = import('../data/padiDiveSites.json').then((module) => module.default || module)
  }
  return diveSiteDataPromise
}

/**
 * PADI Coastal Dive Site Service
 * Provides access to verified coastal and ocean dive sites across coastal countries.
 */
export const getCountries = () => countryList || []

export const getLocationsByCountry = async (country) => {
  if (!country) return []
  const data = await loadDiveSiteData()
  const locMap = data.locationsByCountry || {}
  const targetKey = normalizeCountryKey(country)

  if (locMap[country]) return locMap[country]
  for (const k of Object.keys(locMap)) {
    if (normalizeCountryKey(k) === targetKey) {
      return locMap[k]
    }
  }
  return []
}

export const getLocationById = async (id) => {
  if (!id) return null
  const data = await loadDiveSiteData()
  const strId = String(id)
  const countries = data.countries || countryList || []
  for (const c of countries) {
    const list = data.locationsByCountry?.[c] || []
    const found = list.find((loc) => String(loc.id) === strId)
    if (found) return found
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

export const getTotalLocationsCount = () => 4868

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

