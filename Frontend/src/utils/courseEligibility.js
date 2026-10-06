/**
 * TDV Course & Certification Eligibility Engine
 * Source of truth: TDV_Course_MinAge_Certifications.xlsx
 */

// Normalized Certification & Prior Experience Keys
export const CERTIFICATIONS = {
  TRY_DIVE: 'try_dive',
  PADI_BUBBLEMAKER: 'padi_bubblemaker',
  PADI_SKIN_DIVER: 'padi_skin_diver',
  REEF_EXPLORER: 'reef_explorer',
  PADI_DSD: 'padi_dsd',
  OPEN_WATER: 'open_water',
  ADVENTURE_DIVER: 'adventure_diver',
  ADVANCED_OPEN_WATER: 'advanced_open_water',
  EFR: 'efr',
  RESCUE_DIVER: 'rescue_diver',
  LOGGED_40_DIVES: 'logged_40_dives',
  BASIC_FREEDIVER: 'basic_freediver',
  DIVEMASTER: 'divemaster',
}

// Courses/experiences that are introductory/participation-only and NOT selectable certifications
export const NON_CERTIFICATION_COURSES = new Set([
  'try-dive',
  'try_dive',
  CERTIFICATIONS.TRY_DIVE,
  'padi-skin-diver',
  'padi_skin_diver',
  CERTIFICATIONS.PADI_SKIN_DIVER,
  'reef-explorer',
  'reef_explorer',
  CERTIFICATIONS.REEF_EXPLORER,
  'dsd',
  'padi-dsd',
  'padi_dsd',
  CERTIFICATIONS.PADI_DSD,
  'padi-bubblemaker',
  'padi_bubblemaker',
  CERTIFICATIONS.PADI_BUBBLEMAKER,
])

// User-facing normalized certification and prior experience options (Progression-ordered: 1a, 1, 2, 3, 4, 4a, 4b, 5, 6, 7...)
export const CERTIFICATION_OPTIONS = [
  // 1a Special Entry Point
  {
    id: 'padi-dsd-ow-combo',
    slug: 'combo-dsd-ow',
    name: 'PADI DSD + Open Water',
    slNumber: '1a',
    minAgeToHold: 10,
    experience: 'scuba',
  },

  // Level 1
  {
    id: 'padi-scuba-diver',
    slug: 'padi-scuba-diver',
    name: 'PADI Scuba Diver',
    slNumber: 1,
    minAgeToHold: 10,
    experience: 'scuba',
  },
  {
    id: 'padi-ow-aow-combo',
    slug: 'combo-ow-adv',
    name: 'PADI OW + Advanced',
    slNumber: 1,
    minAgeToHold: 12,
    experience: 'scuba',
  },
  {
    id: 'zero-to-hero',
    slug: 'pro-zero-hero',
    name: 'Zero to Hero (OW to DM)',
    slNumber: 1,
    minAgeToHold: 18,
    experience: 'scuba',
  },

  // Level 2
  {
    id: CERTIFICATIONS.OPEN_WATER,
    slug: 'open-water',
    name: 'PADI Open Water Diver (or equivalent)',
    slNumber: 2,
    minAgeToHold: 10,
    experience: 'scuba',
  },
  {
    id: 'efr-rescue-combo',
    slug: 'combo-efr-rescue',
    name: 'EFR + Rescue Diver',
    slNumber: 2,
    minAgeToHold: 12,
    experience: 'scuba',
  },

  // Level 3
  {
    id: CERTIFICATIONS.DIVEMASTER,
    slug: 'divemaster',
    name: 'PADI Divemaster / Pro',
    slNumber: 3,
    minAgeToHold: 18,
    experience: 'scuba',
  },

  // Level 4 and variants 4a, 4b
  {
    id: CERTIFICATIONS.ADVANCED_OPEN_WATER,
    slug: 'advanced-open-water',
    name: 'PADI Advanced Open Water',
    slNumber: 4,
    minAgeToHold: 12,
    experience: 'scuba',
  },
  {
    id: 'efr-rescue-dm-combo',
    slug: 'pro-efr-rescue-dm',
    name: 'EFR + Rescue + Divemaster',
    slNumber: '4a',
    minAgeToHold: 18,
    experience: 'scuba',
  },
  {
    id: 'efr-rescue-dm-prereqs',
    slug: 'pro-efr-rescue-dm-pre',
    name: 'EFR + Rescue + DM (prereqs)',
    slNumber: '4b',
    minAgeToHold: 18,
    experience: 'scuba',
  },

  // Level 5
  {
    id: CERTIFICATIONS.ADVENTURE_DIVER,
    slug: 'adventure-diver',
    name: 'PADI Adventure Diver',
    slNumber: 5,
    minAgeToHold: 10,
    experience: 'scuba',
  },

  // Level 6
  {
    id: CERTIFICATIONS.PADI_BUBBLEMAKER,
    slug: 'padi-bubblemaker',
    name: 'PADI Bubblemaker',
    slNumber: 6,
    minAgeToHold: 8,
    maxAgeToHold: 10,
    experience: 'scuba',
  },

  // Level 7
  {
    id: CERTIFICATIONS.RESCUE_DIVER,
    slug: 'rescue-diver',
    name: 'PADI Rescue Diver',
    slNumber: 7,
    minAgeToHold: 12,
    experience: 'scuba',
  },

  // Level 8
  {
    id: CERTIFICATIONS.EFR,
    slug: 'efr',
    name: 'EFR Primary & Secondary Care',
    slNumber: 8,
    minAgeToHold: 12,
    experience: 'scuba',
  },

  // Level 9
  {
    id: 'peak-buoyancy',
    slug: 'peak-buoyancy',
    name: 'Peak Performance Buoyancy',
    slNumber: 9,
    minAgeToHold: 10,
    experience: 'scuba',
  },

  // Level 10
  {
    id: 'deep-diver',
    slug: 'deep-diver',
    name: 'Deep Diver',
    slNumber: 10,
    minAgeToHold: 15,
    experience: 'scuba',
  },

  // Level 11
  {
    id: 'wreck-diver',
    slug: 'wreck-diver',
    name: 'Wreck Diver',
    slNumber: 11,
    minAgeToHold: 15,
    experience: 'scuba',
  },

  // Level 12
  {
    id: 'night-diver',
    slug: 'night-diver',
    name: 'Night Diver',
    slNumber: 12,
    minAgeToHold: 12,
    experience: 'scuba',
  },

  // Level 13
  {
    id: 'enriched-air-nitrox',
    slug: 'nitrox',
    name: 'Enriched Air Nitrox',
    slNumber: 13,
    minAgeToHold: 12,
    experience: 'scuba',
  },

  // Level 14
  {
    id: 'project-aware',
    slug: 'project-aware',
    name: 'Project AWARE',
    slNumber: 14,
    minAgeToHold: 10,
    experience: 'scuba',
  },
  {
    id: 'drift-diver',
    slug: 'search-recovery',
    name: 'Drift Diver',
    slNumber: 14,
    minAgeToHold: 12,
    experience: 'scuba',
  },

  // Level 15 & 16
  {
    id: 'full-refresher',
    slug: 'full-refresher',
    name: 'Full Refresher (with dive)',
    slNumber: 15,
    minAgeToHold: 10,
    experience: 'scuba',
  },
  {
    id: 'lite-refresher',
    slug: 'lite-refresher',
    name: 'Lite Refresher (confined only)',
    slNumber: 16,
    minAgeToHold: 10,
    experience: 'scuba',
  },

  // Supplemental Options
  {
    id: CERTIFICATIONS.LOGGED_40_DIVES,
    slug: 'logged-40-dives',
    name: '40+ Logged Dives',
    slNumber: null,
    minAgeToHold: 10,
    experience: 'scuba',
  },
  {
    id: CERTIFICATIONS.BASIC_FREEDIVER,
    slug: 'basic-freediver',
    name: 'Basic Freediver (or equivalent)',
    slNumber: 1,
    minAgeToHold: 12,
    experience: 'freediving',
  },

  // Non-certification items (kept for internal mapping, excluded from UI)
  { id: CERTIFICATIONS.TRY_DIVE, slug: 'try-dive', name: 'Try Dive', slNumber: 0, minAgeToHold: 8, experience: 'scuba' },
  { id: CERTIFICATIONS.PADI_SKIN_DIVER, slug: 'padi-skin-diver', name: 'Skin Diver', slNumber: 2, minAgeToHold: 8, experience: 'snorkeling' },
  { id: CERTIFICATIONS.REEF_EXPLORER, slug: 'reef-explorer', name: 'Reef Explorer', slNumber: null, minAgeToHold: 8, experience: 'snorkeling' },
  { id: CERTIFICATIONS.PADI_DSD, slug: 'dsd', name: 'Discover Scuba Dive (DSD)', slNumber: 0, minAgeToHold: 10, experience: 'scuba' },
]

/**
 * Safely parse and decompose an SL Number into progression properties.
 * Handles 0, '1a', 1, 2, 3, 4, '4a', '4b', 5, ..., 14, 15, 16.
 *
 * @param {*} slValue Raw SL value
 * @returns {{ raw: any, baseLevel: number, is1a: boolean, suffix: string, sortKey: number } | null}
 */
export function parseSlLevel(slValue) {
  if (slValue === null || slValue === undefined || slValue === '' || slValue === 'NULL' || slValue === 'None') {
    return null
  }
  const str = String(slValue).trim().toLowerCase()
  if (str === '0') {
    return { raw: 0, baseLevel: 0, is1a: false, suffix: '', sortKey: 0 }
  }
  if (str === '1a') {
    return { raw: '1a', baseLevel: 1, is1a: true, suffix: 'a', sortKey: 0.5 }
  }
  const match = str.match(/^(\d+)([a-z])?$/)
  if (match) {
    const baseLevel = parseInt(match[1], 10)
    const suffix = match[2] || ''
    const offset = suffix ? (suffix.charCodeAt(0) - 96) * 0.1 : 0
    return {
      raw: slValue,
      baseLevel,
      is1a: false,
      suffix,
      sortKey: baseLevel + offset,
    }
  }
  return null
}

// Master course SL Numbers from source of truth: The_dive_village_courses_List_Update scuba .csv.xlsx
export const COURSE_SL_NUMBERS = {
  'try-dive': 0,
  'dsd-lite': 0,
  'padi-dsd': 0,
  'dsd': 0,
  'discover-snorkeling': 0,
  'padi-bubblemaker': 6,
  'add-dive-after-dsd': null,
  'padi-skin-diver': 2,
  'padi-scuba-diver': 1,
  'padi-open-water': 2,
  'padi-adventure-diver': 5,
  'padi-advanced-ow': 4,
  'efr-primary-secondary': 8,
  'padi-rescue-diver': 7,
  'padi-reactivate': 0,
  'full-refresher': 15,
  'lite-refresher': 16,
  'peak-buoyancy': 9,
  'project-aware': 14,
  'deep-diver': 10,
  'wreck-diver': 11,
  'night-diver': 12,
  'enriched-air-nitrox': 13,
  '1-dive': null,
  '2-dives': null,
  '4-dives': null,
  '6-dives': null,
  '8-dives': null,
  '10-dives': null,
  '12-dives': null,
  'post-12-dives': null,
  'night-dive': null,
  'dawn-dive': null,
  'padi-dsd-ow-combo': '1a',
  'padi-ow-aow-combo': 1,
  'efr-rescue-combo': 2,
  'padi-divemaster': 3,
  'efr-rescue-dm-combo': '4a',
  'efr-rescue-dm-prereqs': '4b',
  'zero-to-hero': 1,
  'padi-basic-freediver': 1,
  'padi-freediver': 2,
  'reef-explorer': null,
  'ocean-explorer': null,
  'drift-diver': 14,
}

export const CERT_ID_TO_SL = {
  'open_water': 2,
  'adventure_diver': 5,
  'advanced_open_water': 4,
  'efr': 8,
  'rescue_diver': 7,
  'divemaster': 3,
  'padi_dsd': 0,
  'try_dive': 0,
  'padi_bubblemaker': 6,
  'padi_skin_diver': 2,
  'basic_freediver': 1,
  'logged_40_dives': null,
}

/**
 * Resolve an SL Number from a certification key, ID, slug, title, or SL string.
 *
 * @param {*} item
 * @returns {number|string|null}
 */
export function resolveCertSlNumber(item) {
  if (item === null || item === undefined || item === '') return null

  // If item is already an object
  if (typeof item === 'object') {
    if (item.slNumber !== undefined) return item.slNumber
    if (item.id) return resolveCertSlNumber(item.id)
    if (item.slug) return resolveCertSlNumber(item.slug)
    if (item.name) return resolveCertSlNumber(item.name)
    return null
  }

  // If item is already a number
  if (typeof item === 'number') return item

  const str = String(item).trim()
  if (/^(0|1a|\d+[a-z]?)$/i.test(str)) {
    return str.toLowerCase()
  }

  if (Object.prototype.hasOwnProperty.call(CERT_ID_TO_SL, str)) {
    return CERT_ID_TO_SL[str]
  }

  const lower = str.toLowerCase()
  if (Object.prototype.hasOwnProperty.call(COURSE_SL_NUMBERS, lower)) {
    return COURSE_SL_NUMBERS[lower]
  }

  return null
}

/**
 * Determine participant's highest current progression position from their selected certifications.
 * Special entry point '1a' is treated conceptually immediately BEFORE Level 1.
 * If user selected only 1a: position is 1a, minimumRecommendedLevel is 1.
 * If user selected a numeric level (or 1a + numeric level): highest numeric level wins, minimumRecommendedLevel is baseLevel + 1.
 *
 * @param {string[]|string|number[]|number} userCerts
 * @returns {{ is1a: boolean, baseLevel: number, minimumRecommendedLevel: number } | null}
 */
export function getParticipantHighestScubaLevel(userCerts) {
  const certList = Array.isArray(userCerts)
    ? userCerts
    : (userCerts !== undefined && userCerts !== null && userCerts !== '' ? [userCerts] : [])
  if (certList.length === 0) return null

  let has1a = false
  let maxBaseLevel = null

  for (const item of certList) {
    if (item === null || item === undefined || item === '') continue
    const sl = resolveCertSlNumber(item)
    const parsed = parseSlLevel(sl)
    if (!parsed) continue

    if (parsed.is1a) {
      has1a = true
    } else if (parsed.baseLevel !== null && parsed.baseLevel > 0) {
      if (maxBaseLevel === null || parsed.baseLevel > maxBaseLevel) {
        maxBaseLevel = parsed.baseLevel
      }
    }
  }

  // A standard numeric level (>= 1) is strictly higher than 1a
  if (maxBaseLevel !== null) {
    return {
      is1a: false,
      baseLevel: maxBaseLevel,
      minimumRecommendedLevel: maxBaseLevel + 1,
    }
  }

  if (has1a) {
    return {
      is1a: true,
      baseLevel: 1,
      minimumRecommendedLevel: 1,
    }
  }

  return null
}

/**
 * Generic helper for calculating minimum recommended level.
 *
 * @param {*} currentPosition
 * @returns {number}
 */
export function getMinimumRecommendedLevel(currentPosition) {
  if (currentPosition === '1a' || (currentPosition && currentPosition.is1a)) {
    return 1
  }
  if (typeof currentPosition === 'number') {
    return currentPosition + 1
  }
  const parsed = parseSlLevel(currentPosition)
  if (parsed) {
    return parsed.is1a ? 1 : parsed.baseLevel + 1
  }
  return 1
}

/**
 * Get user-selectable certification options available for a given age and experience.
 * Excludes introductory programs/experiences that are not actual certifications.
 * For Scuba, returns options ordered by progression: 1a, 1, 2, 3, 4, 4a, 4b, 5, 6, 7... 14.
 *
 * @param {number|string} age Participant age
 * @param {string|null} experience Optional experience filter ('scuba', 'freediving', etc.)
 * @returns {Object[]} Available certification options for this age
 */
export function getAvailableCertificationsForAge(age, experience = null) {
  const numericAge = parseInt(age, 10)
  if (isNaN(numericAge) || numericAge < 8 || numericAge > 110) return []

  // Only Scuba and FreeDiving have selectable certification options
  if (experience !== 'scuba' && experience !== 'freediving') {
    return []
  }

  const expFilter = experience && experience !== 'all' ? experience : null

  const filtered = CERTIFICATION_OPTIONS.filter((opt) => {
    if (NON_CERTIFICATION_COURSES.has(opt.id) || (opt.slug && NON_CERTIFICATION_COURSES.has(opt.slug))) {
      return false
    }
    if (numericAge < opt.minAgeToHold) return false
    if (opt.maxAgeToHold && numericAge > opt.maxAgeToHold) return false

    if (expFilter) {
      const optExp = opt.experience || 'scuba'
      if (optExp !== expFilter) {
        return false
      }
    }

    return true
  })

  // Order progression numerically using sortKey:
  // 1a (0.5), 1 (1.0), 2 (2.0), 3 (3.0), 4 (4.0), 4a (4.1), 4b (4.2), 5 (5.0), 6 (6.0), 7 (7.0)...
  return [...filtered].sort((a, b) => {
    const parseA = parseSlLevel(a.slNumber)
    const parseB = parseSlLevel(b.slNumber)
    const sortA = parseA ? parseA.sortKey : 999
    const sortB = parseB ? parseB.sortKey : 999
    return sortA - sortB
  })
}

/**
 * Get user-facing clean display name for a course or certification.
 * Strips standalone leading "PADI " branding while preserving all other titles and internal identifiers.
 *
 * @param {Object|string} courseOrName Course object, cert option object, or name string
 * @returns {string} Clean display name
 */
export function getCourseDisplayName(courseOrName) {
  if (!courseOrName) return ''
  const rawName = typeof courseOrName === 'string'
    ? courseOrName
    : (courseOrName.name || courseOrName.title || '')
  return rawName.replace(/^PADI\s+/i, '').trim()
}

/**
 * Retrieve the SL Number for a course or course ID.
 *
 * @param {Object|string} courseOrId Course object or course ID
 * @returns {number|string|null} SL Number
 */
export function getCourseSlNumber(courseOrId) {
  if (!courseOrId) return null
  if (courseOrId && typeof courseOrId === 'object' && courseOrId.slNumber !== undefined && courseOrId.slNumber !== null) {
    return courseOrId.slNumber
  }
  const id = typeof courseOrId === 'string' ? courseOrId : courseOrId?.id
  const slug = typeof courseOrId === 'object' ? courseOrId?.slug : null
  return (
    (id ? COURSE_SL_NUMBERS[id] : null) ??
    (slug ? COURSE_SL_NUMBERS[slug] : null) ??
    null
  )
}

/**
 * Normalize an SL Number value safely.
 * Only genuine numeric zero (0 or '0') will return 0.
 * null, undefined, '', 'NULL', 'None' will return null.
 *
 * @param {*} val Raw SL Number value
 * @returns {number|string|null} Normalized SL Number
 */
export function normalizeSlNumber(val) {
  if (val === null || val === undefined || val === '' || val === 'NULL' || val === 'None') {
    return null
  }
  if (val === 0 || val === '0') {
    return 0
  }
  const num = Number(val)
  return isNaN(num) ? val : num
}

// Master 44-Course Catalog from TDV_Course_MinAge_Certifications.xlsx
export const COURSE_CATALOG = [
  // 1. Try Dive
  {
    id: 'try-dive',
    slug: 'try-dive',
    name: 'Try Dive',
    category: 'Introductory Programs',
    minimumAge: 8,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required'
  },
  // 2. DSD Lite
  {
    id: 'dsd-lite',
    slug: 'dsd-lite',
    name: 'DSD Lite',
    category: 'Introductory Programs',
    minimumAge: 10,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required'
  },
  // 3. Discover Scuba Dive
  {
    id: 'padi-dsd',
    slug: 'dsd',
    name: 'Discover Scuba Dive',
    category: 'Introductory Programs',
    minimumAge: 10,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required'
  },
  // 4. Discover Snorkeling
  {
    id: 'discover-snorkeling',
    name: 'Discover Snorkeling',
    category: 'Snorkeling',
    minimumAge: 8,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required'
  },
  // 5. Bubblemaker
  {
    id: 'padi-bubblemaker',
    slug: 'padi-bubblemaker',
    name: 'PADI Bubblemaker',
    category: 'Kids & Family',
    minimumAge: 8,
    maxAge: null,
    bookingType: 'beginner',
    prerequisites: null,
    slNumber: 6,
    certLabel: 'No prior certification required'
  },
  // 6. Additional Dive after DSD
  {
    id: 'add-dive-after-dsd',
    name: 'Additional Dive after DSD',
    category: 'Introductory Programs',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.PADI_DSD
    },
    certLabel: 'Discover Scuba Dive (DSD)'
  },
  // 7. Skin Diver
  {
    id: 'padi-skin-diver',
    name: 'Skin Diver',
    category: 'Snorkeling',
    minimumAge: 8,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.PADI_DSD
    },
    certLabel: 'Discover Scuba Dive (DSD)'
  },
  // 8. Scuba Diver
  {
    id: 'padi-scuba-diver',
    name: 'Scuba Diver',
    category: 'Certification Courses',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.PADI_DSD
    },
    certLabel: 'Discover Scuba Dive (DSD)'
  },
  // 9. Open Water Diver
  {
    id: 'padi-open-water',
    name: 'Open Water Diver',
    category: 'Certification Courses',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.PADI_DSD
    },
    certLabel: 'Discover Scuba Dive (DSD)'
  },
  // 10. Adventure Diver
  {
    id: 'padi-adventure-diver',
    name: 'Adventure Diver',
    category: 'Continuing Education',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver'
  },
  // 11. Advanced Open Water
  {
    id: 'padi-advanced-ow',
    name: 'Advanced Open Water',
    category: 'Continuing Education',
    minimumAge: 12,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'AND',
      requirements: [CERTIFICATIONS.OPEN_WATER, CERTIFICATIONS.PADI_DSD]
    },
    certLabel: 'Open Water Diver + Discover Scuba Dive'
  },
  // 12. EFR Primary & Secondary Care
  {
    id: 'efr-primary-secondary',
    name: 'EFR Primary & Secondary Care',
    category: 'First Aid & CPR',
    minimumAge: 12,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'AND',
      requirements: [CERTIFICATIONS.OPEN_WATER, CERTIFICATIONS.PADI_DSD]
    },
    certLabel: 'Open Water Diver + Discover Scuba Dive'
  },
  // 13. Rescue Diver
  {
    id: 'padi-rescue-diver',
    name: 'Rescue Diver',
    category: 'Continuing Education',
    minimumAge: 12,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'AND',
      requirements: [CERTIFICATIONS.ADVANCED_OPEN_WATER, CERTIFICATIONS.EFR]
    },
    certLabel: 'Advanced Open Water + EFR Primary & Secondary Care'
  },
  // 14. Reactivate (with dive)
  {
    id: 'padi-reactivate',
    slug: 'padi-reactivate',
    name: 'PADI Reactivate (with dive)',
    category: 'Refreshers',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver (or equivalent)'
  },
  // 15. Full Refresher (with dive)
  {
    id: 'full-refresher',
    name: 'Full Refresher (with dive)',
    category: 'Refreshers',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver (or equivalent)'
  },
  // 16. Lite Refresher (confined only)
  {
    id: 'lite-refresher',
    name: 'Lite Refresher (confined only)',
    category: 'Refreshers',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver (or equivalent)'
  },
  // 17. Peak Performance Buoyancy
  {
    id: 'peak-buoyancy',
    name: 'Peak Performance Buoyancy',
    category: 'Specialties',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver'
  },
  // 18. Project AWARE
  {
    id: 'project-aware',
    name: 'Project AWARE',
    category: 'Conservation',
    minimumAge: 10,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required'
  },
  // 19. Deep Diver
  {
    id: 'deep-diver',
    name: 'Deep Diver',
    category: 'Specialties',
    minimumAge: 15,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'OR',
      requirements: [CERTIFICATIONS.ADVENTURE_DIVER, CERTIFICATIONS.ADVANCED_OPEN_WATER]
    },
    certLabel: 'Adventure Diver / Advanced Open Water Diver'
  },
  // 20. Wreck Diver
  {
    id: 'wreck-diver',
    name: 'Wreck Diver',
    category: 'Specialties',
    minimumAge: 15,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'OR',
      requirements: [CERTIFICATIONS.ADVENTURE_DIVER, CERTIFICATIONS.ADVANCED_OPEN_WATER]
    },
    certLabel: 'Adventure Diver / Advanced Open Water Diver'
  },
  // 21. Night Diver
  {
    id: 'night-diver',
    name: 'Night Diver',
    category: 'Specialties',
    minimumAge: 12,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver'
  },
  // 22. Enriched Air Nitrox
  {
    id: 'enriched-air-nitrox',
    name: 'Enriched Air Nitrox',
    category: 'Specialties',
    minimumAge: 12,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver'
  },
  // 23-30. Fun Dive Packages
  {
    id: '1-dive',
    name: '1 Dive',
    category: 'Fun Dives',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver'
  },
  {
    id: '2-dives',
    name: '2 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver'
  },
  {
    id: '4-dives',
    name: '4 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver'
  },
  {
    id: '6-dives',
    name: '6 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver'
  },
  {
    id: '8-dives',
    name: '8 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver'
  },
  {
    id: '10-dives',
    name: '10 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver'
  },
  {
    id: '12-dives',
    name: '12 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver'
  },
  {
    id: 'post-12-dives',
    name: 'Post 12 (extra 2 dives)',
    category: 'Fun Dives',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver'
  },
  {
    id: 'night-dive',
    name: 'Night Dive',
    category: 'Fun Dives',
    minimumAge: 12,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver'
  },
  {
    id: 'dawn-dive',
    name: 'Dawn Dive',
    category: 'Fun Dives',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver'
  },
  // 33. DSD + Open Water (Bundled Pathway)
  {
    id: 'padi-dsd-ow-combo',
    name: 'DSD + Open Water',
    category: 'Bundled Pathways',
    minimumAge: 10,
    bookingType: 'pathway',
    prerequisites: null,
    certLabel: 'No prior certification required'
  },
  // 34. OW + Advanced (Bundled Pathway)
  {
    id: 'padi-ow-aow-combo',
    name: 'OW + Advanced',
    category: 'Bundled Pathways',
    minimumAge: 12,
    bookingType: 'pathway',
    prerequisites: null,
    certLabel: 'No prior certification required'
  },
  // 35. EFR + Rescue Diver (Bundled Pathway)
  {
    id: 'efr-rescue-combo',
    name: 'EFR + Rescue Diver',
    category: 'Bundled Pathways',
    minimumAge: 12,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'AND',
      requirements: [CERTIFICATIONS.ADVANCED_OPEN_WATER, CERTIFICATIONS.EFR]
    },
    certLabel: 'Advanced Open Water + EFR Primary & Secondary Care'
  },
  // 36. Divemaster
  {
    id: 'padi-divemaster',
    name: 'Divemaster',
    category: 'Professional Track',
    minimumAge: 18,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'AND',
      requirements: [CERTIFICATIONS.RESCUE_DIVER, CERTIFICATIONS.EFR, CERTIFICATIONS.LOGGED_40_DIVES]
    },
    certLabel: 'Rescue Diver + EFR + 40 logged dives (Prerequisites)'
  },
  // 37. EFR + Rescue + Divemaster
  {
    id: 'efr-rescue-dm-combo',
    name: 'EFR + Rescue + Divemaster',
    category: 'Professional Track',
    minimumAge: 18,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'AND',
      requirements: [
        CERTIFICATIONS.ADVANCED_OPEN_WATER,
        CERTIFICATIONS.EFR,
        CERTIFICATIONS.RESCUE_DIVER,
        CERTIFICATIONS.LOGGED_40_DIVES
      ]
    },
    certLabel: 'Advanced Open Water + EFR Primary & Secondary Care + Rescue Diver + EFR + 40 logged dives (Prerequisites)'
  },
  // 38. EFR + Rescue + DM (prereqs)
  {
    id: 'efr-rescue-dm-prereqs',
    name: 'EFR + Rescue + DM (prereqs)',
    category: 'Professional Track',
    minimumAge: 18,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'AND',
      requirements: [
        CERTIFICATIONS.OPEN_WATER,
        CERTIFICATIONS.ADVANCED_OPEN_WATER,
        CERTIFICATIONS.LOGGED_40_DIVES
      ]
    },
    certLabel: 'Open Water + Advanced Open Water + 40 logged dives'
  },
  // 39. Zero to Hero (OW to DM)
  {
    id: 'zero-to-hero',
    name: 'Zero to Hero (OW to DM)',
    category: 'Professional Track',
    minimumAge: 18,
    bookingType: 'pathway',
    prerequisites: null,
    certLabel: 'No prior certification required'
  },
  // 40. Basic Freediver
  {
    id: 'padi-basic-freediver',
    name: 'Basic Freediver',
    category: 'Freediving',
    minimumAge: 12,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required'
  },
  // 41. Freediver
  {
    id: 'padi-freediver',
    name: 'Freediver',
    category: 'Freediving',
    minimumAge: 15,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.BASIC_FREEDIVER
    },
    certLabel: 'Basic Freediver (or equivalent)'
  },
  // 42. Reef Explorer
  {
    id: 'reef-explorer',
    name: 'Reef Explorer',
    category: 'Snorkeling',
    minimumAge: 8,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required'
  },
  // 43. Ocean Explorer
  {
    id: 'ocean-explorer',
    name: 'Ocean Explorer',
    category: 'Snorkeling',
    minimumAge: 10,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required'
  },
  // 44. Drift Diver
  {
    id: 'drift-diver',
    name: 'Drift Diver',
    category: 'Specialties',
    minimumAge: 12,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver'
  },
  // 45. Discover Surfing
  {
    id: 'discover-surfing',
    slug: 'discover-surfing',
    name: 'Discover Surfing',
    category: 'Surfing',
    minimumAge: 8,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    experience: 'surfing'
  },
  // 46. 3-Day Surf Academy Course
  {
    id: 'surf-academy-3-day',
    slug: 'surf-academy-3-day',
    name: '3-Day Surf Academy Course',
    category: 'Surfing',
    minimumAge: 8,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    experience: 'surfing'
  }
]

// Attach normalized slNumber from source of truth to every catalog item
COURSE_CATALOG.forEach((course) => {
  if (course.slNumber === undefined) {
    course.slNumber = Object.prototype.hasOwnProperty.call(COURSE_SL_NUMBERS, course.id)
      ? COURSE_SL_NUMBERS[course.id]
      : null
  }
})

/**
 * Expand user certification set with implied prerequisites based on diver hierarchy.
 * e.g., Holding Advanced Open Water implies holding Open Water and DSD.
 *
 * @param {string[]|string} userCerts Array or single string of certification keys
 * @returns {Set<string>} Expanded set of satisfied certifications
 */
export function expandUserCertifications(userCerts) {
  const inputList = Array.isArray(userCerts) ? userCerts : (userCerts ? [userCerts] : [])
  const set = new Set(inputList)

  // Map any aliases/course IDs/combos to certified keys
  for (const item of inputList) {
    if (typeof item === 'string') {
      const lower = item.toLowerCase()
      if (lower === '1a' || lower === 'padi-dsd-ow-combo' || lower === 'combo-dsd-ow') {
        set.add(CERTIFICATIONS.OPEN_WATER)
        set.add(CERTIFICATIONS.PADI_DSD)
      }
      if (lower === '1' || lower === 'padi-scuba-diver') {
        set.add(CERTIFICATIONS.PADI_DSD)
      }
      if (lower === 'zero-to-hero' || lower === 'pro-zero-hero') {
        set.add(CERTIFICATIONS.DIVEMASTER)
      }
      if (lower === 'padi-ow-aow-combo' || lower === 'combo-ow-adv') {
        set.add(CERTIFICATIONS.ADVANCED_OPEN_WATER)
        set.add(CERTIFICATIONS.OPEN_WATER)
        set.add(CERTIFICATIONS.PADI_DSD)
      }
      if (lower === 'efr-rescue-combo' || lower === 'combo-efr-rescue') {
        set.add(CERTIFICATIONS.RESCUE_DIVER)
        set.add(CERTIFICATIONS.EFR)
      }
      if (lower === 'efr-rescue-dm-combo' || lower === 'efr-rescue-dm-prereqs' || lower === 'pro-efr-rescue-dm') {
        set.add(CERTIFICATIONS.DIVEMASTER)
      }
      if (lower === 'padi-open-water') {
        set.add(CERTIFICATIONS.OPEN_WATER)
      }
      if (lower === 'padi-adventure-diver') {
        set.add(CERTIFICATIONS.ADVENTURE_DIVER)
      }
      if (lower === 'padi-advanced-ow') {
        set.add(CERTIFICATIONS.ADVANCED_OPEN_WATER)
      }
      if (lower === 'padi-rescue-diver') {
        set.add(CERTIFICATIONS.RESCUE_DIVER)
      }
      if (lower === 'padi-divemaster') {
        set.add(CERTIFICATIONS.DIVEMASTER)
      }
      if (lower === 'efr-primary-secondary') {
        set.add(CERTIFICATIONS.EFR)
      }
      if (lower === 'padi-basic-freediver') {
        set.add(CERTIFICATIONS.BASIC_FREEDIVER)
      }
    }
  }

  // Hierarchy progressions established by Excel rules
  if (set.has(CERTIFICATIONS.DIVEMASTER)) {
    set.add(CERTIFICATIONS.RESCUE_DIVER)
    set.add(CERTIFICATIONS.EFR)
    set.add(CERTIFICATIONS.ADVANCED_OPEN_WATER)
    set.add(CERTIFICATIONS.ADVENTURE_DIVER)
    set.add(CERTIFICATIONS.OPEN_WATER)
    set.add(CERTIFICATIONS.PADI_DSD)
    set.add(CERTIFICATIONS.LOGGED_40_DIVES)
  }

  if (set.has(CERTIFICATIONS.RESCUE_DIVER)) {
    set.add(CERTIFICATIONS.ADVANCED_OPEN_WATER)
    set.add(CERTIFICATIONS.ADVENTURE_DIVER)
    set.add(CERTIFICATIONS.OPEN_WATER)
    set.add(CERTIFICATIONS.PADI_DSD)
  }

  if (set.has(CERTIFICATIONS.ADVANCED_OPEN_WATER)) {
    set.add(CERTIFICATIONS.ADVENTURE_DIVER)
    set.add(CERTIFICATIONS.OPEN_WATER)
    set.add(CERTIFICATIONS.PADI_DSD)
  }

  if (set.has(CERTIFICATIONS.ADVENTURE_DIVER)) {
    set.add(CERTIFICATIONS.OPEN_WATER)
    set.add(CERTIFICATIONS.PADI_DSD)
  }

  if (set.has(CERTIFICATIONS.OPEN_WATER)) {
    set.add(CERTIFICATIONS.PADI_DSD)
  }

  return set
}

/**
 * Check if a course prerequisite is satisfied given user's certifications.
 *
 * @param {Object} course The course catalog item
 * @param {boolean} hasCert Whether user holds a certification
 * @param {string[]|string} userCerts User's certification keys
 * @returns {boolean} True if prerequisites are satisfied
 */
export function isPrerequisiteSatisfied(course, hasCert = false, userCerts = []) {
  // If course has no prerequisites, it is eligible regardless of certification status
  if (!course.prerequisites) {
    return true
  }

  // If course requires a certification, user must have indicated they hold certification
  if (!hasCert) {
    return false
  }

  const certSet = expandUserCertifications(userCerts)

  if (course.prerequisites.type === 'SINGLE') {
    return certSet.has(course.prerequisites.requirement)
  }

  if (course.prerequisites.type === 'OR') {
    return course.prerequisites.requirements.some((req) => certSet.has(req))
  }

  if (course.prerequisites.type === 'AND') {
    return course.prerequisites.requirements.every((req) => certSet.has(req))
  }

  return false
}

/**
 * Determine experience category for a course.
 *
 * @param {Object|string} courseOrId Course object or course ID
 * @returns {'scuba'|'snorkeling'|'freediving'}
 */
export function getCourseExperience(courseOrId) {
  const id = typeof courseOrId === 'string' ? courseOrId : courseOrId?.id
  if (['discover-snorkeling', 'reef-explorer', 'ocean-explorer'].includes(id)) {
    return 'snorkeling'
  }
  if (['padi-basic-freediver', 'padi-freediver'].includes(id)) {
    return 'freediving'
  }
  if (['discover-surfing', 'surf-academy-3-day'].includes(id)) {
    return 'surfing'
  }
  return 'scuba'
}

/**
 * Evaluate if a course is eligible for a participant given their age and certifications.
 *
 * @param {Object} course The course object
 * @param {number|string} age Participant age
 * @param {boolean} hasCert Whether user has a diving certification
 * @param {string[]|string} userCerts Selected certifications
 * @param {string|null} experience Optional experience filter ('scuba', 'snorkeling', 'freediving', etc.)
 * @returns {boolean}
 */
export function isCourseEligible(course, age, hasCert = false, userCerts = [], experience = null) {
  if (experience && experience !== 'all') {
    const courseExp = course.experience || getCourseExperience(course)
    if (courseExp !== experience) {
      return false
    }
  }

  const certList = Array.isArray(userCerts) ? userCerts : (userCerts ? [userCerts] : [])
  const isNoPriorScubaCert = !hasCert || (certList.length === 0 && !hasCert)

  // PATH A — SCUBA DIVING + NO PRIOR SCUBA CERTIFICATIONS -> SHOW ALL COURSES WITH SL NUMBER = 0
  if (experience === 'scuba' && isNoPriorScubaCert) {
    const rawSl = course.slNumber !== undefined ? course.slNumber : getCourseSlNumber(course)
    const normalizedSl = normalizeSlNumber(rawSl)
    return normalizedSl === 0
  }

  // PATH B — SCUBA DIVING + YES PRIOR SCUBA CERTIFICATION -> CERTIFIED-USER PROGRESSION
  if (experience === 'scuba' && !isNoPriorScubaCert) {
    const highestLevelInfo = getParticipantHighestScubaLevel(userCerts)
    // If participant selected 1a: minLevel is 1. If participant has a numeric level X: minLevel is X + 1.
    // If certs array is empty, default minLevel is 1.
    const minLevel = highestLevelInfo ? highestLevelInfo.minimumRecommendedLevel : 1

    const rawSl = course.slNumber !== undefined ? course.slNumber : getCourseSlNumber(course)
    const parsedCourseSl = parseSlLevel(rawSl)

    // In certified Scuba progression, courses must have a valid progression level >= minLevel.
    // 1a is a special entry point before Level 1, not a recommended course level.
    // SL 0 courses belong to uncertified Path A only.
    if (!parsedCourseSl || parsedCourseSl.is1a || parsedCourseSl.baseLevel === 0 || parsedCourseSl.baseLevel < minLevel) {
      return false
    }
  }

  const numericAge = parseInt(age, 10)
  if (isNaN(numericAge) || numericAge < 8 || numericAge > 110) {
    return false
  }

  // Check minimum age
  if (course.minimumAge !== null && numericAge < course.minimumAge) {
    return false
  }

  // Check maximum age (if any)
  if (course.maxAge !== null && numericAge > course.maxAge) {
    return false
  }

  // Check prerequisites (only Scuba and FreeDiving evaluate prior certifications)
  const effectiveHasCert = (experience === 'scuba' || experience === 'freediving') ? hasCert : false
  const effectiveCerts = (experience === 'scuba' || experience === 'freediving') ? userCerts : []
  return isPrerequisiteSatisfied(course, effectiveHasCert, effectiveCerts)
}

/**
 * Get all eligible courses for a participant.
 *
 * @param {number|string} age Participant age
 * @param {boolean} hasCert Whether participant holds prior certifications
 * @param {string[]|string} userCerts Selected certifications
 * @param {string|null} experience Optional experience filter
 * @returns {Object[]} List of eligible courses
 */
export function getEligibleCourses(age, hasCert = false, userCerts = [], experience = null) {
  const numericAge = parseInt(age, 10)
  if (isNaN(numericAge) || numericAge < 8 || numericAge > 110) {
    return []
  }

  return COURSE_CATALOG.filter((course) => isCourseEligible(course, numericAge, hasCert, userCerts, experience))
}

/**
 * Get prioritized recommendation list of eligible courses based on diver age and certification history.
 *
 * @param {number|string} age Participant age
 * @param {boolean} hasCert Whether participant holds prior certifications
 * @param {string[]|string} userCerts Selected certifications
 * @param {string|null} experience Optional experience filter
 * @returns {Object[]} List of eligible courses sorted by recommendation priority
 */
export function getRecommendedCourses(age, hasCert = false, userCerts = [], experience = null) {
  const eligible = getEligibleCourses(age, hasCert, userCerts, experience)
  if (eligible.length === 0) return []

  const numericAge = parseInt(age, 10)
  const certList = Array.isArray(userCerts) ? userCerts : (userCerts ? [userCerts] : [])
  const isCertified = Boolean(hasCert) && certList.length > 0

  // For Certified Scuba: preserve strict progression ordering by SL Number (sortKey)
  // Level 5 courses -> Level 6 courses (Bubblemaker) -> Level 7 courses -> Level 8 courses...
  if (experience === 'scuba' && isCertified) {
    return [...eligible].sort((a, b) => {
      const slA = getCourseSlNumber(a)
      const slB = getCourseSlNumber(b)
      const parseA = parseSlLevel(slA)
      const parseB = parseSlLevel(slB)
      const sortKeyA = parseA ? parseA.sortKey : 999
      const sortKeyB = parseB ? parseB.sortKey : 999
      if (sortKeyA !== sortKeyB) {
        return sortKeyA - sortKeyB
      }
      return 0
    })
  }

  const getPriorityScore = (courseId) => {
    if (courseId === 'discover-surfing') return 100
    if (courseId === 'surf-academy-3-day') return 90

    // 1. Age 8-9 (Kids)
    if (numericAge < 10) {
      if (isCertified) {
        if (courseId === 'padi-bubblemaker') return 100
        if (courseId === 'reef-explorer') return 95
        if (courseId === 'try-dive') return 80
        if (courseId === 'discover-snorkeling') return 70
      } else {
        if (courseId === 'padi-bubblemaker') return 100
        if (courseId === 'try-dive') return 95
        if (courseId === 'reef-explorer') return 80
        if (courseId === 'discover-snorkeling') return 70
      }
      return 50
    }

    // 2. Uncertified Adults & Teens (Age 10+)
    if (!isCertified) {
      if (numericAge <= 11) {
        if (courseId === 'padi-dsd') return 100
        if (courseId === 'dsd-lite') return 95
        if (courseId === 'padi-dsd-ow-combo') return 90
        if (courseId === 'try-dive') return 75
        if (courseId === 'reef-explorer' || courseId === 'ocean-explorer') return 70
        if (courseId === 'discover-snorkeling' || courseId === 'project-aware') return 60
        if (courseId === 'padi-bubblemaker') return 55
      } else {
        if (courseId === 'padi-dsd') return 100
        if (courseId === 'dsd-lite') return 95
        if (courseId === 'padi-dsd-ow-combo') return 90
        if (courseId === 'padi-ow-aow-combo') return 88
        if (courseId === 'padi-basic-freediver') return 85
        if (courseId === 'try-dive') return 75
        if (courseId === 'zero-to-hero') return 70
        if (courseId === 'reef-explorer' || courseId === 'ocean-explorer') return 65
        if (courseId === 'discover-snorkeling' || courseId === 'project-aware') return 60
      }
      return 50
    }

    // 3. Certified Divers (Age 10+)
    // Divemaster Track (Age 18+ with Rescue + EFR + 40 dives)
    if (
      numericAge >= 18 &&
      certList.includes(CERTIFICATIONS.RESCUE_DIVER) &&
      certList.includes(CERTIFICATIONS.EFR) &&
      certList.includes(CERTIFICATIONS.LOGGED_40_DIVES)
    ) {
      if (courseId === 'padi-divemaster') return 100
      if (courseId === 'efr-rescue-dm-combo') return 95
      if (courseId === 'efr-rescue-dm-prereqs') return 90
      if (courseId === 'deep-diver' || courseId === 'wreck-diver') return 80
      if (courseId.includes('dive') && courseId.includes('dives')) return 70
      if (courseId.includes('refresher') || courseId.includes('reactivate')) return 65
      return 40
    }

    // Rescue Diver Track (Age 12+ with Advanced OW + EFR)
    if (
      numericAge >= 12 &&
      certList.includes(CERTIFICATIONS.ADVANCED_OPEN_WATER) &&
      certList.includes(CERTIFICATIONS.EFR)
    ) {
      if (courseId === 'padi-rescue-diver') return 100
      if (courseId === 'efr-rescue-combo') return 95
      if (courseId === 'deep-diver' || courseId === 'wreck-diver') return 85
      if (courseId === 'enriched-air-nitrox' || courseId === 'night-diver' || courseId === 'drift-diver') return 80
      if (courseId.includes('dive') && courseId.includes('dives')) return 70
      if (courseId.includes('refresher') || courseId.includes('reactivate')) return 65
      return 40
    }

    // Age 15+ with Adventure Diver or Advanced Open Water (Deep / Wreck Specialties)
    if (
      numericAge >= 15 &&
      (certList.includes(CERTIFICATIONS.ADVENTURE_DIVER) || certList.includes(CERTIFICATIONS.ADVANCED_OPEN_WATER))
    ) {
      if (courseId === 'deep-diver') return 100
      if (courseId === 'wreck-diver') return 98
      if (certList.includes(CERTIFICATIONS.ADVANCED_OPEN_WATER)) {
        if (courseId === 'padi-rescue-diver') return 92
        if (courseId === 'efr-rescue-combo') return 90
      }
      if (courseId === 'padi-advanced-ow') return 88
      if (courseId === 'enriched-air-nitrox' || courseId === 'night-diver' || courseId === 'drift-diver') return 80
      if (courseId.includes('dive') && courseId.includes('dives')) return 70
      return 40
    }

    // Age 12+ with Open Water
    if (numericAge >= 12 && certList.includes(CERTIFICATIONS.OPEN_WATER)) {
      if (courseId === 'padi-advanced-ow') return 100
      if (courseId === 'padi-adventure-diver') return 95
      if (courseId === 'enriched-air-nitrox') return 88
      if (courseId === 'night-diver') return 86
      if (courseId === 'drift-diver') return 84
      if (courseId === 'peak-buoyancy') return 82
      if (courseId === 'padi-reactivate' || courseId === 'full-refresher') return 80
      if (courseId === '1-dive' || courseId === '2-dives' || courseId === '4-dives') return 75
      if (courseId === 'efr-primary-secondary') return 70
      return 40
    }

    // Age 10-11 with Open Water
    if (certList.includes(CERTIFICATIONS.OPEN_WATER)) {
      if (courseId === 'padi-adventure-diver') return 100
      if (courseId === 'peak-buoyancy') return 92
      if (courseId === 'padi-reactivate' || courseId === 'full-refresher') return 85
      if (courseId === '1-dive' || courseId === '2-dives') return 80
      return 40
    }

    // Age 10+ with PADI DSD
    if (certList.includes(CERTIFICATIONS.PADI_DSD)) {
      if (courseId === 'padi-open-water') return 100
      if (courseId === 'padi-scuba-diver') return 95
      if (courseId === 'add-dive-after-dsd') return 90
      if (courseId === 'padi-skin-diver') return 85
      return 40
    }

    // Skin Diver certification / prior experience
    if (certList.includes(CERTIFICATIONS.PADI_SKIN_DIVER)) {
      if (courseId === 'padi-basic-freediver') return 100
      if (courseId === 'padi-freediver') return 98
      if (courseId === 'padi-dsd') return 95
      if (courseId === 'padi-dsd-ow-combo') return 90
      if (courseId === 'ocean-explorer') return 85
      if (courseId === 'reef-explorer') return 80
      if (courseId === 'dsd-lite') return 75
      if (courseId === 'try-dive') return 70
      return 40
    }

    // Basic Freediver certification
    if (certList.includes(CERTIFICATIONS.BASIC_FREEDIVER)) {
      if (courseId === 'padi-freediver') return 100
      if (courseId === 'padi-dsd') return 90
      if (courseId === 'padi-dsd-ow-combo') return 85
      return 40
    }

    // Bubblemaker prior experience
    if (certList.includes(CERTIFICATIONS.PADI_BUBBLEMAKER)) {
      if (courseId === 'padi-skin-diver') return 100
      if (courseId === 'reef-explorer') return 95
      if (courseId === 'try-dive') return 90
      if (courseId === 'discover-snorkeling') return 85
      return 40
    }

    // Try Dive or Reef Explorer prior experience
    if (certList.includes(CERTIFICATIONS.TRY_DIVE) || certList.includes(CERTIFICATIONS.REEF_EXPLORER)) {
      if (courseId === 'padi-dsd') return 100
      if (courseId === 'dsd-lite') return 95
      if (courseId === 'padi-dsd-ow-combo') return 90
      if (courseId === 'ocean-explorer') return 85
      if (courseId === 'padi-basic-freediver') return 80
      return 40
    }

    // Catch-all for any other certified configuration
    const reqCert = COURSE_CATALOG.find((c) => c.id === courseId)?.prerequisites
    if (reqCert) return 70
    return 30
  }

  return [...eligible].sort((a, b) => getPriorityScore(b.id) - getPriorityScore(a.id))
}

/**
 * Validate participant booking object for integrity before submission.
 *
 * @param {Object} participant Participant data
 * @param {string|null} experience Selected experience ('scuba', 'snorkeling', etc.)
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateParticipantBooking(participant, experience = null) {
  if (!participant) return { valid: false, error: 'Participant data missing.' }
  
  const age = parseInt(participant.age, 10)
  if (isNaN(age) || age < 8 || age > 110) {
    return { valid: false, error: `Invalid age for ${participant.name || 'participant'}. Age must be between 8 and 110 years.` }
  }

  if (!participant.selectedProgram) {
    return { valid: false, error: `No program selected for ${participant.name || 'participant'}.` }
  }

  const course = COURSE_CATALOG.find((c) => c.id === participant.selectedProgram)
  if (!course) {
    return { valid: false, error: `Selected course (${participant.selectedProgram}) does not exist.` }
  }

  if (experience && experience !== 'all' && experience !== 'customize') {
    const courseExp = course.experience || getCourseExperience(course)
    if (courseExp !== experience) {
      return {
        valid: false,
        error: `Selected program (${course.name}) is not valid for the chosen experience (${experience}).`
      }
    }

    // SCUBA DIVING + NO PRIOR SCUBA CERTIFICATIONS VALIDATION
    const hasCert = Boolean(participant.hasCertification)
    const certs = participant.certifications || (participant.experienceLevel ? [participant.experienceLevel] : [])
    const isNoPriorScubaCert = !hasCert || ((Array.isArray(certs) ? certs.length === 0 : !certs) && !hasCert)
    if (experience === 'scuba' && isNoPriorScubaCert) {
      const rawSl = course.slNumber !== undefined ? course.slNumber : getCourseSlNumber(course)
      const normalizedSl = normalizeSlNumber(rawSl)
      if (normalizedSl !== 0) {
        return {
          valid: false,
          error: `Selected program (${course.name}) requires prior scuba certification.`
        }
      }
      return { valid: true }
    }

    // SCUBA DIVING + YES PRIOR SCUBA CERTIFICATIONS VALIDATION
    if (experience === 'scuba' && !isNoPriorScubaCert) {
      const highestLevelInfo = getParticipantHighestScubaLevel(certs)
      const minLevel = highestLevelInfo ? highestLevelInfo.minimumRecommendedLevel : 1
      const rawSl = course.slNumber !== undefined ? course.slNumber : getCourseSlNumber(course)
      const parsedCourseSl = parseSlLevel(rawSl)
      if (!parsedCourseSl || parsedCourseSl.is1a || parsedCourseSl.baseLevel === 0 || parsedCourseSl.baseLevel < minLevel) {
        return {
          valid: false,
          error: `Selected program (${course.name}) is below or equal to participant's current progression level.`
        }
      }
    }
  }

  if (age < course.minimumAge) {
    return {
      valid: false,
      error: `${participant.name || 'Participant'} (age ${age}) does not meet the minimum age (${course.minimumAge}) for ${course.name}.`
    }
  }

  const hasCert = Boolean(participant.hasCertification)
  const certs = participant.certifications || (participant.experienceLevel ? [participant.experienceLevel] : [])

  if (experience === 'scuba' || experience === 'freediving') {
    // Check if participant claims any certification that is age-inappropriate for them
    for (const certId of certs) {
      const certOpt = CERTIFICATION_OPTIONS.find((c) => c.id === certId)
      if (certOpt && age < certOpt.minAgeToHold) {
        return {
          valid: false,
          error: `${participant.name || 'Participant'} (age ${age}) cannot hold certification '${certOpt.name}', which requires minimum age ${certOpt.minAgeToHold}.`
        }
      }
    }
  }

  const effectiveCerts = (experience === 'scuba' || experience === 'freediving') ? certs : []
  const effectiveHasCert = (experience === 'scuba' || experience === 'freediving') ? hasCert : false

  if (!isPrerequisiteSatisfied(course, effectiveHasCert, effectiveCerts)) {
    return {
      valid: false,
      error: `${participant.name || 'Participant'} does not satisfy the prerequisite certifications for ${course.name}. Required: ${course.certLabel}.`
    }
  }

  return { valid: true }
}

export default {
  CERTIFICATIONS,
  CERTIFICATION_OPTIONS,
  COURSE_CATALOG,
  expandUserCertifications,
  isPrerequisiteSatisfied,
  isCourseEligible,
  getEligibleCourses,
  getRecommendedCourses,
  getAvailableCertificationsForAge,
  validateParticipantBooking,
  getCourseExperience,
  NON_CERTIFICATION_COURSES,
  COURSE_SL_NUMBERS,
  getCourseSlNumber,
  normalizeSlNumber,
  parseSlLevel,
  resolveCertSlNumber,
  getCourseDisplayName,
  getParticipantHighestScubaLevel,
  getMinimumRecommendedLevel,
  CERT_ID_TO_SL,
}
