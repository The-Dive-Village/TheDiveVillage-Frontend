import diveSiteData from '../data/padiDiveSites.json'

/**
 * PADI Dive Site Service
 * Provides access to the verified dataset of 4,869 PADI dive sites across 123 countries.
 */
export const getCountries = () => diveSiteData.countries || []

export const getLocationsByCountry = (country) => {
  if (!country) return []
  return diveSiteData.locationsByCountry?.[country] || []
}

export const getLocationById = (id) => {
  if (!id) return null
  const strId = String(id)
  for (const country of diveSiteData.countries) {
    const list = diveSiteData.locationsByCountry[country] || []
    const found = list.find((loc) => String(loc.id) === strId)
    if (found) return found
  }
  return null
}

export const getLocationDisplayName = (location) => {
  if (!location) return 'Dive Site'
  return location.title || location.name || 'Dive Site'
}

export const getTotalLocationsCount = () => diveSiteData.totalLocations || 0

export const diveSiteService = {
  getCountries,
  getLocationsByCountry,
  getLocationById,
  getLocationDisplayName,
  getTotalLocationsCount
}

export default diveSiteService
