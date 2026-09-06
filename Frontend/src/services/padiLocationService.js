import padiData from '../data/padiLocations.json'

/**
 * PADI Location Service
 * Provides access to the normalized dataset of 3,498 PADI dive centers across 117 countries.
 */
export const padiLocationService = {
  /**
   * Get all unique sorted countries present in the PADI dataset.
   * @returns {string[]} Array of country names.
   */
  getCountries() {
    return padiData.countries || []
  },

  /**
   * Get all dive centers/locations belonging to a specific country.
   * @param {string} country The selected country name.
   * @returns {Array} Array of dive center objects.
   */
  getLocationsByCountry(country) {
    if (!country) return []
    return padiData.locationsByCountry?.[country] || []
  },

  /**
   * Look up a specific dive location by its PADI ID or internal ID.
   * @param {string|number} id The dive center ID.
   * @returns {Object|null} The dive location object or null.
   */
  getLocationById(id) {
    if (!id) return null
    const strId = String(id)
    for (const country of padiData.countries) {
      const list = padiData.locationsByCountry[country] || []
      const found = list.find((loc) => String(loc.id) === strId || String(loc.padiId) === strId)
      if (found) return found
    }
    return null
  },

  /**
   * Total number of unique dive locations available.
   */
  getTotalLocationsCount() {
    return padiData.totalLocations || 0
  }
}

export default padiLocationService
