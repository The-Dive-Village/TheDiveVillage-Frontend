import padiData from '../data/padiLocations.json'

/**
 * Clean and format raw place / locality string.
 * @param {string} str Raw locality string
 * @returns {string} Cleaned place string
 */
export function cleanPlaceString(str) {
  if (!str) return ''
  let res = String(str).trim()

  // Strip leading postal codes (e.g. '6537EP Nijmegen', '75001 Paris', '80331 Munich', '90210 Beverly Hills')
  res = res.replace(/^\d{3,}[A-Za-z0-9\-]*\s+/, '')

  // Strip trailing street / building / unit number (e.g. 'Karlsruhe 1' -> 'Karlsruhe', 'Nosy Be 207' -> 'Nosy Be')
  res = res.replace(/\s+\d{1,4}$/, '')

  // Handle slash separators (e.g. 'Roses / Costa Brava' -> 'Roses', 'Cala Millor/Mallorca' -> 'Cala Millor')
  if (res.includes('/')) {
    const slashParts = res.split('/').map((s) => s.trim()).filter(Boolean)
    if (slashParts.length > 0 && slashParts[0].length >= 3) res = slashParts[0]
  }

  // Handle spaced dash before region (e.g. 'Oropesa Del Mar - Castellon' -> 'Oropesa Del Mar', 'Aguadulce - Almeria' -> 'Aguadulce')
  if (res.includes(' - ') || res.includes(' – ')) {
    const dashParts = res.split(/\s+[\-–]\s+/).map((s) => s.trim()).filter(Boolean)
    if (dashParts.length > 0 && dashParts[0].length >= 3) res = dashParts[0]
  }

  // Strip placeholder noise like 'zz', 'zzz', 'n/a', 'none'
  if (/^(z+|n\/?a|none|null|undefined)$/i.test(res)) {
    return ''
  }

  // Clean surrounding punctuation and whitespace
  res = res.replace(/^[\s\-–,./]+|[\s\-–,./]+$/g, '').trim()

  return res
}

/**
 * Universal geographic place extractor for PADI dive locations across ALL countries.
 * Extracts the most accurate City / Locality / Geographic place name from location.address.
 * 
 * Works for all address variations globally:
 * - City, Country (e.g. "Phuket, Thailand" -> "Phuket", "Southport, Australia" -> "Southport")
 * - City, State/Province, Country (e.g. "North Goa, Goa, India" -> "North Goa", "Sharm El Sheikh, S. Sinai, Egypt" -> "Sharm El Sheikh")
 * - Street, City, State, Country (e.g. "Jl. Tamblingan 12, Sanur, Bali, Indonesia" -> "Sanur")
 * - Island/Atoll, Country (e.g. "Addu City, Maldives" -> "Addu City", "Koh Tao, Thailand" -> "Koh Tao")
 * 
 * Safe fallback: Never returns undefined, null, or empty string.
 * Data integrity: Never mutates the original location object.
 *
 * @param {Object} location The PADI location object
 * @returns {string} The geographic city / locality display name
 */
export function getLocationDisplayName(location) {
  if (!location) return 'Dive Location'

  const address = typeof location.address === 'string' ? location.address : ''
  const country = typeof location.country === 'string' ? location.country.trim() : ''
  const countryLower = country.toLowerCase()

  if (address.trim()) {
    // Normalize extra whitespace
    const cleanAddr = address.replace(/\s+/g, ' ').trim()

    // Split by comma
    const rawParts = cleanAddr.split(',').map((p) => p.trim()).filter(Boolean)

    if (rawParts.length > 0) {
      // If the last segment is the country name or generic country tag, remove it
      const parts = [...rawParts]
      if (parts.length > 1) {
        const lastPartLower = parts[parts.length - 1].toLowerCase()
        const isCountryMatch =
          countryLower &&
          (lastPartLower === countryLower ||
            lastPartLower.includes(countryLower) ||
            countryLower.includes(lastPartLower))

        const isGenericCountryCode = [
          'usa',
          'united states',
          'united states of america (usa)',
          'u.s.a.',
          'uk',
          'united kingdom',
          'uae',
          'u.a.e.',
          'zz',
          'zzz',
          'zzzz'
        ].includes(lastPartLower)

        if (isCountryMatch || isGenericCountryCode) {
          parts.pop()
        }
      }

      // Filter out segments that are solely placeholders or empty
      const candidateParts = parts.filter((p) => !/^(z+|n\/?a|none)$/i.test(p.trim()))

      if (candidateParts.length > 0) {
        let place = candidateParts[0]

        // If the first part looks like a street / PO box / building number and a second part exists, use the second part
        const isStreetPattern =
          candidateParts.length > 1 &&
          (/^(p\.?o\.?\s*box|no\.|street|st\.|road|rd\.|jl\.|jalan|ave|avenue|suite|shop|building|fl|floor|lot|\d+[\w\s\-]*(road|rd|st|street|ave|way|dr|drive|lane|blvd))\b/i.test(
            place
          ) ||
            /^\d+$/.test(place))

        if (isStreetPattern) {
          place = candidateParts[1]
        }

        const cleaned = cleanPlaceString(place)
        if (cleaned && cleaned.length >= 2) {
          return cleaned
        }
      }
    }
  }

  // Safe fallback to metadata already in PADI record
  if (location.city && typeof location.city === 'string' && location.city.trim()) {
    const cleaned = cleanPlaceString(location.city)
    if (cleaned) return cleaned
  }

  if (location.state && typeof location.state === 'string' && location.state.trim()) {
    const cleaned = cleanPlaceString(location.state)
    if (cleaned) return cleaned
  }

  if (location.name && typeof location.name === 'string' && location.name.trim()) {
    return location.name.trim()
  }

  return 'Dive Location'
}

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
   * Universal address -> geographic place extractor for display labels.
   * @param {Object} location The PADI location object
   * @returns {string} The geographic city / locality display name
   */
  getLocationDisplayName(location) {
    return getLocationDisplayName(location)
  },

  /**
   * Total number of unique dive locations available.
   */
  getTotalLocationsCount() {
    return padiData.totalLocations || 0
  }
}

export default padiLocationService
