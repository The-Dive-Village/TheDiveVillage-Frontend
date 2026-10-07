/**
 * TDV Course & Certification Eligibility Engine
 * Source of truth: TDV_Course_MinAge_Certifications.xlsx
 */

// 10 Exact Experience Options
export const EXPERIENCE_OPTIONS = [
  'Scuba Diving',
  'Snorkeling',
  'FreeDiving',
  'Surfing',
  'Canyoneering',
  'Safari',
  'Trekking',
  'Local Sightseeing',
  'Camping / Camper',
  'Liveaboard',
]

// Direct activities that skip participant cert & course eligibility stages
export const DIRECT_ACTIVITIES = [
  'Canyoneering',
  'Safari',
  'Trekking',
  'Local Sightseeing',
  'Camping / Camper',
  'Liveaboard',
]

/**
 * Check if an experience is a direct activity.
 * @param {string} experience
 * @returns {boolean}
 */
export function isDirectActivity(experience) {
  if (!experience) return false
  return DIRECT_ACTIVITIES.includes(experience.trim())
}

/**
 * Strip leading 'PADI ' from customer-facing course display names while preserving original slugs/IDs.
 * @param {Object|string} courseOrName
 * @returns {string}
 */
export function getCourseDisplayName(courseOrName) {
  if (!courseOrName) return ''
  const name = typeof courseOrName === 'string' ? courseOrName : (courseOrName.name || '')
  return name.replace(/\bPADI\s*/gi, '').trim()
}

// Normalized Certification & Prior Experience Keys
export const CERTIFICATIONS = {
  TRY_DIVE: 'try_dive',
  PADI_BUBBLEMAKER: 'padi_bubblemaker',
  PADI_SKIN_DIVER: 'padi_skin_diver',
  REEF_EXPLORER: 'reef_explorer',
  PADI_DSD: 'padi_dsd',
  COMBO_DSD_OW: 'combo-dsd-ow',
  PADI_SCUBA_DIVER: 'padi-scuba-diver',
  EFR_RESCUE_COMBO: 'efr-rescue-combo',
  OPEN_WATER: 'open_water',
  ADVENTURE_DIVER: 'adventure_diver',
  ADVANCED_OPEN_WATER: 'advanced_open_water',
  EFR: 'efr',
  RESCUE_DIVER: 'rescue_diver',
  PEAK_BUOYANCY: 'peak-buoyancy',
  DEEP_DIVER: 'deep-diver',
  WRECK_DIVER: 'wreck-diver',
  NIGHT_DIVER: 'night-diver',
  NITROX: 'enriched-air-nitrox',
  PROJECT_AWARE: 'project-aware',
  DRIFT_DIVER: 'drift-diver',
  LOGGED_40_DIVES: 'logged_40_dives',
  BASIC_FREEDIVER: 'basic_freediver',
  DIVEMASTER: 'divemaster',
}

/**
 * Reusable parser for progression levels / difficulty levels.
 * Handles numeric levels (0, 1, 2... 14) and special variants (1a, 4a, 4b).
 *
 * @param {*} val
 * @returns {{ raw: string, baseLevel: number, variant: string|null, rank: number } | null}
 */
export function parseProgressionLevel(val) {
  if (val === null || val === undefined || val === '') return null
  if (typeof val === 'number') {
    if (isNaN(val)) return null
    return { raw: String(val), baseLevel: val, variant: null, rank: val, isSpecialEntry: false }
  }
  const str = String(val).trim()
  if (str === '' || str.toLowerCase() === 'null' || str.toLowerCase() === 'none') return null

  const match = str.match(/^(\d+)([a-z])?$/i)
  if (!match) return null

  const baseLevel = parseInt(match[1], 10)
  const variant = match[2] ? match[2].toLowerCase() : null

  // 1a is a special entry point immediately BEFORE Level 1
  if (baseLevel === 1 && variant === 'a') {
    return {
      raw: str,
      baseLevel: 1,
      variant: 'a',
      rank: 0.5, // strictly before Level 1 (rank 1.0)
      isSpecialEntry: true,
    }
  }

  // Rank calculation for sorting:
  // 1 has rank 1.0, 2 has rank 2.0
  // 4 has rank 4.0, 4a has 4.05, 4b has 4.10 (grouped with level 4, before 5)
  const variantOffset = variant ? (variant.charCodeAt(0) - 96) * 0.05 : 0
  const rank = baseLevel + variantOffset

  return {
    raw: str,
    baseLevel,
    variant,
    rank,
    isSpecialEntry: false,
  }
}

/**
 * Compare two progression levels by difficulty.
 * Guaranteed order: 1a, 1, 2, 3, 4, 4a, 4b, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14...
 *
 * @param {*} a
 * @param {*} b
 * @returns {number}
 */
export function compareProgressionLevels(a, b) {
  const pA = parseProgressionLevel(a)
  const pB = parseProgressionLevel(b)
  if (!pA && !pB) return 0
  if (!pA) return 1
  if (!pB) return -1
  return pA.rank - pB.rank
}

/**
 * Determine minimum recommended difficulty level based on current certification position.
 * Rule:
 * 1a -> 1 (ALL Level 1 courses and higher)
 * X  -> X + 1
 *
 * @param {Object} currentParsed Current certification parsed level
 * @returns {number}
 */
export function getMinimumRecommendedLevel(currentParsed) {
  if (!currentParsed) return 1
  if (currentParsed.raw && currentParsed.raw.toLowerCase() === '1a') {
    return 1
  }
  return currentParsed.baseLevel + 1
}

/**
 * Determine if a course has higher difficulty progression than user's current difficulty.
 *
 * @param {Object} courseParsed Parsed course difficulty
 * @param {Object} currentParsed Parsed diver current difficulty
 * @returns {boolean}
 */
export function isCourseProgressionHigher(courseParsed, currentParsed) {
  if (!courseParsed || !currentParsed) return false
  // 1a is the participant's current certification level, not a recommended candidate course
  if (courseParsed.raw && courseParsed.raw.toLowerCase() === '1a') {
    return false
  }
  const minLevel = getMinimumRecommendedLevel(currentParsed)
  return courseParsed.baseLevel >= minLevel
}

// User-facing normalized certification and prior experience options
export const CERTIFICATION_OPTIONS = [
  // SL 1a: DSD + Open Water (first certified progression option)
  { id: 'combo-dsd-ow', name: 'DSD + Open Water', slNumber: '1a', minAgeToHold: 10, experience: 'Scuba Diving' },
  { id: 'padi-dsd-ow-combo', name: 'DSD + Open Water', slNumber: '1a', minAgeToHold: 10, experience: 'Scuba Diving' },

  // SL 1: Scuba Diver (Level 1)
  { id: 'padi-scuba-diver', name: 'Scuba Diver', slNumber: 1, minAgeToHold: 10, experience: 'Scuba Diving' },

  // SL 2: EFR + Rescue Diver
  { id: 'efr-rescue-combo', name: 'EFR + Rescue Diver', slNumber: 2, minAgeToHold: 12, experience: 'Scuba Diving' },
  { id: 'combo-efr-rescue', name: 'EFR + Rescue Diver', slNumber: 2, minAgeToHold: 12, experience: 'Scuba Diving' },

  // SL 3: Open Water Diver & Divemaster
  { id: CERTIFICATIONS.OPEN_WATER, name: 'Open Water Diver (or equivalent)', slNumber: 3, minAgeToHold: 10, experience: 'Scuba Diving' },
  { id: 'padi-open-water', name: 'Open Water Diver (or equivalent)', slNumber: 3, minAgeToHold: 10, experience: 'Scuba Diving' },
  { id: CERTIFICATIONS.DIVEMASTER, name: 'Divemaster / Pro', slNumber: 3, minAgeToHold: 18, experience: 'Scuba Diving' },
  { id: 'padi-divemaster', name: 'Divemaster / Pro', slNumber: 3, minAgeToHold: 18, experience: 'Scuba Diving' },

  // SL 4: Advanced Open Water & DM Combos
  { id: CERTIFICATIONS.ADVANCED_OPEN_WATER, name: 'Advanced Open Water', slNumber: 4, minAgeToHold: 12, experience: 'Scuba Diving' },
  { id: 'padi-advanced-ow', name: 'Advanced Open Water', slNumber: 4, minAgeToHold: 12, experience: 'Scuba Diving' },
  { id: 'efr-rescue-dm-combo', name: 'EFR + Rescue + Divemaster', slNumber: '4a', minAgeToHold: 18, experience: 'Scuba Diving' },
  { id: 'efr-rescue-dm-prereqs', name: 'EFR + Rescue + DM (prereqs)', slNumber: '4b', minAgeToHold: 18, experience: 'Scuba Diving' },

  // SL 5: Adventure Diver
  { id: CERTIFICATIONS.ADVENTURE_DIVER, name: 'Adventure Diver', slNumber: 5, minAgeToHold: 10, experience: 'Scuba Diving' },
  { id: 'padi-adventure-diver', name: 'Adventure Diver', slNumber: 5, minAgeToHold: 10, experience: 'Scuba Diving' },

  // SL 6: Bubblemaker (youth age 8-10)
  { id: CERTIFICATIONS.PADI_BUBBLEMAKER, name: 'Bubblemaker', slNumber: 6, minAgeToHold: 8, maxAgeToHold: 10, experience: 'Scuba Diving' },
  { id: 'padi-bubblemaker', name: 'Bubblemaker', slNumber: 6, minAgeToHold: 8, maxAgeToHold: 10, experience: 'Scuba Diving' },

  // SL 7: Rescue Diver
  { id: CERTIFICATIONS.RESCUE_DIVER, name: 'Rescue Diver', slNumber: 7, minAgeToHold: 12, experience: 'Scuba Diving' },
  { id: 'padi-rescue-diver', name: 'Rescue Diver', slNumber: 7, minAgeToHold: 12, experience: 'Scuba Diving' },

  // SL 8: EFR Primary & Secondary Care
  { id: CERTIFICATIONS.EFR, name: 'EFR Primary & Secondary Care', slNumber: 8, minAgeToHold: 12, experience: 'Scuba Diving' },
  { id: 'efr-primary-secondary', name: 'EFR Primary & Secondary Care', slNumber: 8, minAgeToHold: 12, experience: 'Scuba Diving' },

  // SL 9: Peak Performance Buoyancy
  { id: 'peak-buoyancy', name: 'Peak Performance Buoyancy', slNumber: 9, minAgeToHold: 10, experience: 'Scuba Diving' },

  // SL 10: Deep Diver
  { id: 'deep-diver', name: 'Deep Diver', slNumber: 10, minAgeToHold: 15, experience: 'Scuba Diving' },

  // SL 11: Wreck Diver
  { id: 'wreck-diver', name: 'Wreck Diver', slNumber: 11, minAgeToHold: 15, experience: 'Scuba Diving' },

  // SL 12: Night Diver
  { id: 'night-diver', name: 'Night Diver', slNumber: 12, minAgeToHold: 12, experience: 'Scuba Diving' },

  // SL 13: Enriched Air Nitrox
  { id: 'enriched-air-nitrox', name: 'Enriched Air Nitrox', slNumber: 13, minAgeToHold: 12, experience: 'Scuba Diving' },

  // SL 14: Project AWARE & Drift Diver
  { id: 'project-aware', name: 'Project AWARE', slNumber: 14, minAgeToHold: 10, experience: 'Scuba Diving' },
  { id: 'drift-diver', name: 'Drift Diver', slNumber: 14, minAgeToHold: 12, experience: 'Scuba Diving' },

  // Other / Freediving
  { id: CERTIFICATIONS.LOGGED_40_DIVES, name: '40+ Logged Dives', slNumber: null, minAgeToHold: 10, experience: 'Scuba Diving' },
  { id: CERTIFICATIONS.BASIC_FREEDIVER, name: 'Basic Freediver (or equivalent)', slNumber: 1, minAgeToHold: 12, experience: 'FreeDiving' },

  // Excluded options (remain for catalog & validation reference)
  { id: CERTIFICATIONS.TRY_DIVE, name: 'Try Dive', slNumber: 0, minAgeToHold: 8, experience: 'Scuba Diving' },
  { id: CERTIFICATIONS.PADI_DSD, name: 'Discover Scuba Dive (DSD)', slNumber: 0, minAgeToHold: 10, experience: 'Scuba Diving' },
  { id: CERTIFICATIONS.PADI_SKIN_DIVER, name: 'Skin Diver', slNumber: 2, minAgeToHold: 8, experience: 'Snorkeling' },
  { id: CERTIFICATIONS.REEF_EXPLORER, name: 'Reef Explorer', slNumber: null, minAgeToHold: 8, experience: 'Snorkeling' },
]

// Certifications/experiences that must NOT be selectable options for Scuba Diving
export const EXCLUDED_SCUBA_CERT_OPTIONS = new Set([
  CERTIFICATIONS.TRY_DIVE,
  CERTIFICATIONS.PADI_SKIN_DIVER,
  CERTIFICATIONS.REEF_EXPLORER,
  CERTIFICATIONS.PADI_DSD,
])

/**
 * Get user-selectable certification / experience options available for a given age and experience.
 * Sorted strictly by difficulty progression level (1a, 2, 3, 4, 5... 14).
 *
 * @param {number|string} age Participant age
 * @param {string} [experience='Scuba Diving'] Active experience
 * @returns {Object[]} Available certification/experience options
 */
export function getAvailableCertificationsForAge(age, experience = 'Scuba Diving') {
  const numericAge = parseInt(age, 10)
  if (isNaN(numericAge) || numericAge < 8 || numericAge > 110) return []

  const normExp = normalizeExperienceKey(experience)

  if (normExp === 'freediving') {
    return CERTIFICATION_OPTIONS.filter((opt) => opt.id === CERTIFICATIONS.BASIC_FREEDIVER && numericAge >= opt.minAgeToHold)
  }

  if (normExp !== 'scuba' || isDirectActivity(experience)) {
    return []
  }

  // Scuba Diving certifications (exclude non-certifications and non-scuba options)
  const filtered = CERTIFICATION_OPTIONS.filter((opt) => {
    if (EXCLUDED_SCUBA_CERT_OPTIONS.has(opt.id)) return false
    if (opt.id === CERTIFICATIONS.BASIC_FREEDIVER) return false
    if (opt.experience && opt.experience !== 'Scuba Diving') return false
    if (numericAge < opt.minAgeToHold) return false
    if (opt.maxAgeToHold && numericAge > opt.maxAgeToHold) return false
    return true
  })

  // Deduplicate by name to keep canonical unique display options
  const seenNames = new Set()
  const unique = []
  for (const item of filtered) {
    if (!seenNames.has(item.name)) {
      seenNames.add(item.name)
      unique.push(item)
    }
  }

  // Sort strictly in difficulty progression order: 1a, 2, 3, 4, 4a, 4b, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14...
  return unique.sort((a, b) => compareProgressionLevels(a.slNumber, b.slNumber))
}

// Master 44-Course Catalog + Surfing Courses from TDV_Course_MinAge_Certifications.xlsx
export const COURSE_CATALOG = [
  // 1. Try Dive
  {
    id: 'try-dive',
    name: 'Try Dive',
    category: 'Introductory Programs',
    minimumAge: 8,
    maxAge: null,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: 0,
    experience: 'Scuba Diving'
  },
  // 2. DSD Lite
  {
    id: 'dsd-lite',
    name: 'DSD Lite',
    category: 'Introductory Programs',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: 0,
    experience: 'Scuba Diving'
  },
  // 3. Discover Scuba Dive
  {
    id: 'padi-dsd',
    name: 'PADI Discover Scuba Dive',
    category: 'Introductory Programs',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: 0,
    experience: 'Scuba Diving'
  },
  // 4. Discover Snorkeling
  {
    id: 'discover-snorkeling',
    name: 'Discover Snorkeling',
    category: 'Snorkeling',
    minimumAge: 8,
    maxAge: null,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: null,
    experience: 'Snorkeling'
  },
  // 5. Bubblemaker (internal slug padi-bubblemaker, display Bubblemaker)
  {
    id: 'padi-bubblemaker',
    name: 'PADI Bubblemaker',
    category: 'Kids & Family',
    minimumAge: 8,
    maxAge: 10,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: 6,
    experience: 'Scuba Diving'
  },
  // 6. Additional Dive after DSD
  {
    id: 'add-dive-after-dsd',
    name: 'Additional Dive after DSD',
    category: 'Introductory Programs',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.PADI_DSD
    },
    certLabel: 'Discover Scuba Dive (DSD)',
    slNumber: null,
    experience: 'Scuba Diving'
  },
  // 7. Skin Diver
  {
    id: 'padi-skin-diver',
    name: 'PADI Skin Diver',
    category: 'Snorkeling',
    minimumAge: 8,
    maxAge: null,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: 2,
    experience: 'Snorkeling'
  },
  // 8. Scuba Diver
  {
    id: 'padi-scuba-diver',
    name: 'PADI Scuba Diver',
    category: 'Certification Courses',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: 1,
    experience: 'Scuba Diving'
  },
  // 9. Open Water Diver
  {
    id: 'padi-open-water',
    name: 'PADI Open Water Diver',
    category: 'Certification Courses',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: 3,
    experience: 'Scuba Diving'
  },
  // 10. Adventure Diver
  {
    id: 'padi-adventure-diver',
    name: 'PADI Adventure Diver',
    category: 'Continuing Education',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver',
    slNumber: 5,
    experience: 'Scuba Diving'
  },
  // 11. Advanced Open Water
  {
    id: 'padi-advanced-ow',
    name: 'PADI Advanced Open Water',
    category: 'Continuing Education',
    minimumAge: 12,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver',
    slNumber: 4,
    experience: 'Scuba Diving'
  },
  // 12. EFR Primary & Secondary Care
  {
    id: 'efr-primary-secondary',
    name: 'EFR Primary & Secondary Care',
    category: 'First Aid & CPR',
    minimumAge: 12,
    maxAge: null,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: 8,
    experience: 'Scuba Diving'
  },
  // 13. Rescue Diver
  {
    id: 'padi-rescue-diver',
    name: 'PADI Rescue Diver',
    category: 'Continuing Education',
    minimumAge: 12,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'AND',
      requirements: [CERTIFICATIONS.ADVANCED_OPEN_WATER, CERTIFICATIONS.EFR]
    },
    certLabel: 'Advanced Open Water + EFR Primary & Secondary Care',
    slNumber: 7,
    experience: 'Scuba Diving'
  },
  // 14. Reactivate (with dive)
  {
    id: 'padi-reactivate',
    name: 'PADI Reactivate (with dive)',
    category: 'Refreshers',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver (or equivalent)',
    slNumber: 0,
    experience: 'Scuba Diving'
  },
  // 15. Full Refresher (with dive)
  {
    id: 'full-refresher',
    name: 'Full Refresher (with dive)',
    category: 'Refreshers',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver (or equivalent)',
    slNumber: 15,
    experience: 'Scuba Diving'
  },
  // 16. Lite Refresher (confined only)
  {
    id: 'lite-refresher',
    name: 'Lite Refresher (confined only)',
    category: 'Refreshers',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver (or equivalent)',
    slNumber: 16,
    experience: 'Scuba Diving'
  },
  // 17. Peak Performance Buoyancy
  {
    id: 'peak-buoyancy',
    name: 'Peak Performance Buoyancy',
    category: 'Specialties',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver',
    slNumber: 9,
    experience: 'Scuba Diving'
  },
  // 18. Project AWARE
  {
    id: 'project-aware',
    name: 'Project AWARE',
    category: 'Conservation',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: 14,
    experience: 'Scuba Diving'
  },
  // 19. Deep Diver
  {
    id: 'deep-diver',
    name: 'Deep Diver',
    category: 'Specialties',
    minimumAge: 15,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'OR',
      requirements: [CERTIFICATIONS.ADVENTURE_DIVER, CERTIFICATIONS.ADVANCED_OPEN_WATER]
    },
    certLabel: 'Adventure Diver / Advanced Open Water Diver',
    slNumber: 10,
    experience: 'Scuba Diving'
  },
  // 20. Wreck Diver
  {
    id: 'wreck-diver',
    name: 'Wreck Diver',
    category: 'Specialties',
    minimumAge: 15,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'OR',
      requirements: [CERTIFICATIONS.ADVENTURE_DIVER, CERTIFICATIONS.ADVANCED_OPEN_WATER]
    },
    certLabel: 'Adventure Diver / Advanced Open Water Diver',
    slNumber: 11,
    experience: 'Scuba Diving'
  },
  // 21. Night Diver
  {
    id: 'night-diver',
    name: 'Night Diver',
    category: 'Specialties',
    minimumAge: 12,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver',
    slNumber: 12,
    experience: 'Scuba Diving'
  },
  // 22. Enriched Air Nitrox
  {
    id: 'enriched-air-nitrox',
    name: 'Enriched Air Nitrox',
    category: 'Specialties',
    minimumAge: 12,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver',
    slNumber: 13,
    experience: 'Scuba Diving'
  },
  // 23-30. Fun Dive Packages
  {
    id: '1-dive',
    name: '1 Dive',
    category: 'Fun Dives',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver',
    slNumber: null,
    experience: 'Scuba Diving'
  },
  {
    id: '2-dives',
    name: '2 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver',
    slNumber: null,
    experience: 'Scuba Diving'
  },
  {
    id: '4-dives',
    name: '4 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver',
    slNumber: null,
    experience: 'Scuba Diving'
  },
  {
    id: '6-dives',
    name: '6 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver',
    slNumber: null,
    experience: 'Scuba Diving'
  },
  {
    id: '8-dives',
    name: '8 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver',
    slNumber: null,
    experience: 'Scuba Diving'
  },
  {
    id: '10-dives',
    name: '10 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver',
    slNumber: null,
    experience: 'Scuba Diving'
  },
  {
    id: '12-dives',
    name: '12 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver',
    slNumber: null,
    experience: 'Scuba Diving'
  },
  {
    id: 'post-12-dives',
    name: 'Post 12 (extra 2 dives)',
    category: 'Fun Dives',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver',
    slNumber: null,
    experience: 'Scuba Diving'
  },
  {
    id: 'night-dive',
    name: 'Night Dive',
    category: 'Fun Dives',
    minimumAge: 12,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver',
    slNumber: null,
    experience: 'Scuba Diving'
  },
  {
    id: 'dawn-dive',
    name: 'Dawn Dive',
    category: 'Fun Dives',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver',
    slNumber: null,
    experience: 'Scuba Diving'
  },
  // 33. DSD + Open Water (Bundled Pathway)
  {
    id: 'padi-dsd-ow-combo',
    name: 'PADI DSD + Open Water',
    category: 'Bundled Pathways',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'pathway',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: '1a',
    experience: 'Scuba Diving'
  },
  // 34. OW + Advanced (Bundled Pathway)
  {
    id: 'padi-ow-aow-combo',
    name: 'PADI OW + Advanced',
    category: 'Bundled Pathways',
    minimumAge: 12,
    maxAge: null,
    bookingType: 'pathway',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: 1,
    experience: 'Scuba Diving'
  },
  // 35. EFR + Rescue Diver (Bundled Pathway)
  {
    id: 'efr-rescue-combo',
    name: 'EFR + Rescue Diver',
    category: 'Bundled Pathways',
    minimumAge: 12,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.ADVANCED_OPEN_WATER
    },
    certLabel: 'Advanced Open Water',
    slNumber: 2,
    experience: 'Scuba Diving'
  },
  // 36. Divemaster
  {
    id: 'padi-divemaster',
    name: 'PADI Divemaster',
    category: 'Professional Track',
    minimumAge: 18,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'AND',
      requirements: [CERTIFICATIONS.RESCUE_DIVER, CERTIFICATIONS.EFR, CERTIFICATIONS.LOGGED_40_DIVES]
    },
    certLabel: 'Rescue Diver + EFR + 40 logged dives',
    slNumber: 3,
    experience: 'Scuba Diving'
  },
  // 37. EFR + Rescue + Divemaster
  {
    id: 'efr-rescue-dm-combo',
    name: 'EFR + Rescue + Divemaster',
    category: 'Professional Track',
    minimumAge: 18,
    maxAge: null,
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
    certLabel: 'Advanced Open Water + EFR + Rescue Diver + 40 logged dives',
    slNumber: '4a',
    experience: 'Scuba Diving'
  },
  // 38. EFR + Rescue + DM (prereqs)
  {
    id: 'efr-rescue-dm-prereqs',
    name: 'EFR + Rescue + DM (prereqs)',
    category: 'Professional Track',
    minimumAge: 18,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'AND',
      requirements: [
        CERTIFICATIONS.OPEN_WATER,
        CERTIFICATIONS.ADVANCED_OPEN_WATER,
        CERTIFICATIONS.LOGGED_40_DIVES
      ]
    },
    certLabel: 'Open Water + Advanced Open Water + 40 logged dives',
    slNumber: '4b',
    experience: 'Scuba Diving'
  },
  // 39. Zero to Hero (OW to DM)
  {
    id: 'zero-to-hero',
    name: 'Zero to Hero (OW to DM)',
    category: 'Professional Track',
    minimumAge: 18,
    maxAge: null,
    bookingType: 'pathway',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: 1,
    experience: 'Scuba Diving'
  },
  // 40. Basic Freediver
  {
    id: 'padi-basic-freediver',
    name: 'PADI Basic Freediver',
    category: 'Freediving',
    minimumAge: 12,
    maxAge: null,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: 1,
    experience: 'FreeDiving'
  },
  // 41. Freediver
  {
    id: 'padi-freediver',
    name: 'PADI Freediver',
    category: 'Freediving',
    minimumAge: 15,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.BASIC_FREEDIVER
    },
    certLabel: 'Basic Freediver (or equivalent)',
    slNumber: 2,
    experience: 'FreeDiving'
  },
  // 42. Reef Explorer
  {
    id: 'reef-explorer',
    name: 'Reef Explorer',
    category: 'Snorkeling',
    minimumAge: 8,
    maxAge: null,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: null,
    experience: 'Snorkeling'
  },
  // 43. Ocean Explorer
  {
    id: 'ocean-explorer',
    name: 'Ocean Explorer',
    category: 'Snorkeling',
    minimumAge: 10,
    maxAge: null,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: null,
    experience: 'Snorkeling'
  },
  // 44. Drift Diver
  {
    id: 'drift-diver',
    name: 'Drift Diver',
    category: 'Specialties',
    minimumAge: 12,
    maxAge: null,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver',
    slNumber: 14,
    experience: 'Scuba Diving'
  },
  // 45. Discover Surfing
  {
    id: 'discover-surfing',
    name: 'Discover Surfing',
    category: 'Surfing',
    minimumAge: 8,
    maxAge: null,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: null,
    experience: 'Surfing'
  },
  // 46. 3-Day Surf Academy Course
  {
    id: '3-day-surf-academy',
    name: '3-Day Surf Academy Course',
    category: 'Surfing',
    minimumAge: 8,
    maxAge: null,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required',
    slNumber: null,
    experience: 'Surfing'
  }
]

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

  // Map difficulty level numbers and course IDs to prerequisite keys
  for (const item of inputList) {
    if (item === 3 || item === '3' || item === 'padi-open-water' || item === 'difficulty_3') {
      set.add(CERTIFICATIONS.OPEN_WATER)
    }
    if (item === 4 || item === '4' || item === 'padi-advanced-ow' || item === 'padi-advanced' || item === 'difficulty_4') {
      set.add(CERTIFICATIONS.ADVANCED_OPEN_WATER)
      set.add(CERTIFICATIONS.OPEN_WATER)
    }
    if (item === 5 || item === '5' || item === 'padi-adventure-diver' || item === 'difficulty_5') {
      set.add(CERTIFICATIONS.ADVENTURE_DIVER)
      set.add(CERTIFICATIONS.OPEN_WATER)
    }
    if (item === 7 || item === '7' || item === 'padi-rescue-diver' || item === 'padi-rescue' || item === 'difficulty_7') {
      set.add(CERTIFICATIONS.RESCUE_DIVER)
      set.add(CERTIFICATIONS.ADVANCED_OPEN_WATER)
      set.add(CERTIFICATIONS.OPEN_WATER)
    }
    if (item === 8 || item === '8' || item === 'efr-primary-secondary' || item === 'efr-care' || item === 'difficulty_8') {
      set.add(CERTIFICATIONS.EFR)
    }
    if (item === '1a' || item === 'combo-dsd-ow' || item === 'padi-dsd-ow-combo') {
      set.add(CERTIFICATIONS.OPEN_WATER)
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
  // Beginner/pathway programs or courses without prerequisites are always eligible
  if (course.bookingType === 'beginner' || course.bookingType === 'pathway' || !course.prerequisites) {
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
 * Evaluate if a course is eligible for a participant given their age and certifications.
 *
 * @param {Object} course The course object
 * @param {number|string} age Participant age
 * @param {boolean} hasCert Whether user has a diving certification
 * @param {string[]|string} userCerts Selected certifications
 * @returns {boolean}
 */
export function isCourseEligible(course, age, hasCert = false, userCerts = [], experience = 'Scuba Diving') {
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

  // For Scuba Diving initial stage (no prior certifications + SL 0):
  // Include in initial SL 0 recommendation set
  const normExp = normalizeExperienceKey(experience || course.experience || course.category)
  const courseSl = course.slNumber !== undefined ? normalizeProgressionNumber(course.slNumber) : null
  const completedList = Array.isArray(userCerts) ? userCerts : (userCerts ? [userCerts] : [])
  const hasValidCert = Boolean(hasCert) || completedList.length > 0
  if (normExp === 'scuba' && !hasValidCert && courseSl === 0) {
    return true
  }

  // Check prerequisites
  return isPrerequisiteSatisfied(course, hasCert, userCerts)
}

/**
 * Get all eligible courses for a participant within an experience.
 *
 * @param {number|string} age Participant age
 * @param {boolean} hasCert Whether participant holds prior certifications
 * @param {string[]|string} userCerts Selected certifications
 * @param {string} [experience='Scuba Diving'] Active experience
 * @returns {Object[]} List of eligible courses
 */
/**
 * Safe normalization for SL Number.
 * Only genuinely valid numeric SL Numbers are returned as integers.
 * Null, undefined, empty string, or non-numeric strings return null.
 *
 * @param {*} val
 * @returns {number|null}
 */
export function normalizeProgressionNumber(val) {
  if (val === null || val === undefined || val === '') return null
  if (typeof val === 'number') return isNaN(val) ? null : val
  const str = String(val).trim()
  if (str === '' || str.toLowerCase() === 'null' || str.toLowerCase() === 'none') return null
  const match = str.match(/^(\d+)([a-z])?$/i)
  return match ? parseInt(match[1], 10) : null
}

/**
 * Standardize experience name for reliable filtering.
 *
 * @param {string} exp
 * @returns {'scuba'|'snorkeling'|'freediving'|'surfing'}
 */
export function normalizeExperienceKey(exp) {
  if (!exp) return 'scuba'
  const clean = String(exp).toLowerCase().replace(/[\s_-]+/g, '')
  if (clean.includes('scuba')) return 'scuba'
  if (clean.includes('snorkel')) return 'snorkeling'
  if (clean.includes('freediv')) return 'freediving'
  if (clean.includes('surf')) return 'surfing'
  if (clean.includes('custom')) return 'customize'
  return clean
}

export const CERT_ID_TO_SL = {
  [CERTIFICATIONS.TRY_DIVE]: 0,
  [CERTIFICATIONS.PADI_DSD]: 0,
  'combo-dsd-ow': '1a',
  'padi-dsd-ow-combo': '1a',
  'padi-scuba-diver': 1,
  'padi_scuba_diver': 1,
  [CERTIFICATIONS.BASIC_FREEDIVER]: 1,
  [CERTIFICATIONS.PADI_SKIN_DIVER]: 2,
  'efr-rescue-combo': 2,
  'combo-efr-rescue': 2,
  'freediver': 2,
  [CERTIFICATIONS.OPEN_WATER]: 3,
  'padi-open-water': 3,
  [CERTIFICATIONS.DIVEMASTER]: 3,
  'padi-divemaster': 3,
  [CERTIFICATIONS.ADVANCED_OPEN_WATER]: 4,
  'padi-advanced-ow': 4,
  'efr-rescue-dm-combo': '4a',
  'efr-rescue-dm-prereqs': '4b',
  [CERTIFICATIONS.ADVENTURE_DIVER]: 5,
  'padi-adventure-diver': 5,
  [CERTIFICATIONS.PADI_BUBBLEMAKER]: 6,
  'padi-bubblemaker': 6,
  [CERTIFICATIONS.RESCUE_DIVER]: 7,
  'padi-rescue-diver': 7,
  [CERTIFICATIONS.EFR]: 8,
  'efr-primary-secondary': 8,
  'peak-buoyancy': 9,
  'deep-diver': 10,
  'wreck-diver': 11,
  'night-diver': 12,
  'enriched-air-nitrox': 13,
  'project-aware': 14,
  'drift-diver': 14,
  [CERTIFICATIONS.LOGGED_40_DIVES]: null,
  [CERTIFICATIONS.REEF_EXPLORER]: null,
}

export const COURSE_SL_NUMBERS = {
  'try-dive': 0,
  'dsd-lite': 0,
  'padi-dsd': 0,
  'padi-reactivate': 0,
  'full-refresher': 15,
  'lite-refresher': 16,

  'padi-scuba-diver': 1,
  'padi-ow-aow-combo': 1,
  'combo-ow-adv': 1,
  'padi-basic-freediver': 1,
  'zero-to-hero': 1,
  'pro-zero-hero': 1,
  'padi-dsd-ow-combo': '1a',
  'combo-dsd-ow': '1a',

  'efr-rescue-combo': 2,
  'combo-efr-rescue': 2,
  'padi-freediver': 2,
  'padi-skin-diver': 2,

  'padi-open-water': 3,
  'padi-divemaster': 3,
  'pro-divemaster': 3,

  'efr-rescue-dm-combo': '4a',
  'pro-efr-rescue-dm': '4a',
  'efr-rescue-dm-prereqs': '4b',
  'pro-efr-rescue-dm-pre': '4b',
  'padi-advanced-ow': 4,
  'padi-advanced': 4,

  'padi-adventure-diver': 5,
  'padi-bubblemaker': 6,
  'padi-rescue-diver': 7,
  'padi-rescue': 7,
  'efr-primary-secondary': 8,
  'efr-care': 8,
  'peak-buoyancy': 9,
  'deep-diver': 10,
  'wreck-diver': 11,
  'night-diver': 12,
  'enriched-air-nitrox': 13,
  'nitrox': 13,
  'project-aware': 14,
  'drift-diver': 14,
  'search-recovery': 14,

  // Unnumbered courses
  'discover-snorkeling': null,
  'add-dive-after-dsd': null,
  'reef-explorer': null,
  'ocean-explorer': null,
  'discover-surfing': null,
  '3-day-surf-academy': null,
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
}

/**
 * Determine the highest applicable difficulty level among the user's selected certifications.
 *
 * @param {Array|*} userCerts
 * @param {Object[]} [catalog=COURSE_CATALOG]
 * @returns {{ raw: string, baseLevel: number, variant: string|null, rank: number } | null}
 */
export function getHighestSelectedDifficulty(userCerts, catalog = COURSE_CATALOG) {
  const certList = Array.isArray(userCerts) ? userCerts : (userCerts ? [userCerts] : [])
  if (certList.length === 0) return null

  let highest = null

  for (const item of certList) {
    if (item === null || item === undefined || item === '') continue
    let sl = null

    // 1. Direct number or progression string like 2, 3, '1a', 'difficulty_2'
    if (typeof item === 'number' || (typeof item === 'string' && /^\d+([a-z])?$/i.test(item.trim()))) {
      sl = typeof item === 'string' ? item.trim() : item
    } else if (typeof item === 'string' && /^difficulty_(\d+([a-z])?)$/i.test(item.trim())) {
      sl = item.trim().match(/^difficulty_(\d+([a-z])?)$/i)[1]
    } else {
      // 2. Lookup in CERTIFICATION_OPTIONS
      const certOpt = CERTIFICATION_OPTIONS.find((c) => c.id === item || c.name === item)
      if (certOpt && certOpt.slNumber !== null && certOpt.slNumber !== undefined) {
        sl = certOpt.slNumber
      } else if (COURSE_SL_NUMBERS[item] !== undefined && COURSE_SL_NUMBERS[item] !== null) {
        sl = COURSE_SL_NUMBERS[item]
      } else if (CERT_ID_TO_SL[item] !== undefined && CERT_ID_TO_SL[item] !== null) {
        sl = CERT_ID_TO_SL[item]
      } else {
        const course = catalog.find((c) => c.id === item || c.name === item)
        if (course && course.slNumber !== null && course.slNumber !== undefined) {
          sl = course.slNumber
        }
      }
    }

    const parsed = parseProgressionLevel(sl)
    if (parsed) {
      if (!highest || parsed.rank > highest.rank) {
        highest = parsed
      }
    }
  }

  return highest
}

/**
 * Resolve the SL Number for an individual course or certification item.
 *
 * @param {*} courseOrId
 * @param {Object[]} [catalog=COURSE_CATALOG]
 * @returns {number|null}
 */
export function getCourseSlNumber(courseOrId, catalog = COURSE_CATALOG) {
  if (courseOrId === null || courseOrId === undefined || courseOrId === '') return null
  if (typeof courseOrId === 'object') {
    if (courseOrId.slNumber !== undefined && courseOrId.slNumber !== null) {
      return normalizeProgressionNumber(courseOrId.slNumber)
    }
    const id = courseOrId.id || courseOrId.slug || courseOrId.name
    return getCourseSlNumber(id, catalog)
  }
  if (typeof courseOrId === 'number') {
    return normalizeProgressionNumber(courseOrId)
  }
  const str = String(courseOrId).trim()
  if (Object.prototype.hasOwnProperty.call(CERT_ID_TO_SL, str)) {
    return normalizeProgressionNumber(CERT_ID_TO_SL[str])
  }
  const lower = str.toLowerCase()
  if (Object.prototype.hasOwnProperty.call(COURSE_SL_NUMBERS, lower)) {
    return normalizeProgressionNumber(COURSE_SL_NUMBERS[lower])
  }
  const found = catalog.find((c) =>
    c.id.toLowerCase() === lower ||
    (c.slug && c.slug.toLowerCase() === lower) ||
    c.name.toLowerCase() === lower
  )
  if (found && found.slNumber !== undefined) {
    return normalizeProgressionNumber(found.slNumber)
  }
  return null
}

/**
 * Identify the highest completed SL Number among completed courses.
 * Ignores unnumbered courses. If none completed, returns -1.
 *
 * @param {Array|*} completedCourses
 * @param {Object[]} [allCourses=COURSE_CATALOG]
 * @returns {number} Highest completed SL Number or -1 if none
 */
export function getHighestCompletedCourseNumber(completedCourses, allCourses = COURSE_CATALOG) {
  const list = Array.isArray(completedCourses)
    ? completedCourses
    : (completedCourses ? [completedCourses] : [])
  if (list.length === 0) return -1
  let highest = -1
  for (const item of list) {
    if (item === null || item === undefined || item === '') continue
    const sl = getCourseSlNumber(item, allCourses)
    if (sl !== null && typeof sl === 'number' && !isNaN(sl) && sl >= 0) {
      if (sl > highest) {
        highest = sl
      }
    }
  }
  return highest
}

/**
 * Determine next target progression number.
 * If user completed NO numbered courses: returns 0.
 * If user completed one or more numbered courses: returns highest + 1.
 *
 * @param {Array|*} completedCourses
 * @param {Object[]} [allCourses=COURSE_CATALOG]
 * @returns {number}
 */
export function getNextCourseNumber(completedCourses, allCourses = COURSE_CATALOG) {
  const highest = getHighestCompletedCourseNumber(completedCourses, allCourses)
  if (highest === -1) {
    return 0
  }
  return highest + 1
}

/**
 * Get courses belonging to a specific target progression number.
 *
 * @param {number} targetNumber
 * @param {Object[]} [allCourses=COURSE_CATALOG]
 * @param {string} [experience=null]
 * @returns {Object[]}
 */
export function getCoursesForProgressionNumber(targetNumber, allCourses = COURSE_CATALOG, experience = null) {
  const target = normalizeProgressionNumber(targetNumber)
  if (target === null) return []
  const normExp = experience ? normalizeExperienceKey(experience) : null
  return allCourses.filter((course) => {
    if (normExp) {
      const cExp = normalizeExperienceKey(course.experience || course.category)
      if (cExp !== normExp) return false
    }
    const courseSl = course.slNumber !== undefined ? normalizeProgressionNumber(course.slNumber) : getCourseSlNumber(course, allCourses)
    return courseSl === target
  })
}

/**
 * Get all eligible courses for a participant within an experience,
 * strictly filtered by the user's progression level and existing eligibility checks.
 *
 * @param {number|string} age Participant age
 * @param {boolean} hasCert Whether participant holds prior certifications
 * @param {string[]|string} userCerts Selected certifications/completed courses
 * @param {string} [experience='Scuba Diving'] Active experience
 * @param {Object[]} [catalog=COURSE_CATALOG]
 * @returns {Object[]} List of eligible courses
 */
export function getEligibleCourses(age, hasCert = false, userCerts = [], experience = 'Scuba Diving', catalog = COURSE_CATALOG) {
  const numericAge = parseInt(age, 10)
  if (isNaN(numericAge) || numericAge < 8 || numericAge > 110) {
    return []
  }

  if (isDirectActivity(experience)) {
    return []
  }

  const normExp = normalizeExperienceKey(experience)

  // 1. Filter strictly by chosen experience
  const expCourses = catalog.filter((course) => {
    const cExp = normalizeExperienceKey(course.experience || course.category)
    return cExp === normExp
  })

  const completedList = Array.isArray(userCerts) ? userCerts : (userCerts ? [userCerts] : [])
  const hasValidCert = Boolean(hasCert) || completedList.length > 0

  let candidateCourses = []

  if (normExp === 'scuba') {
    if (!hasValidCert) {
      // Uncertified Scuba: strictly SL Number 0
      candidateCourses = expCourses.filter((course) => {
        const cParsed = parseProgressionLevel(course.slNumber)
        return cParsed && cParsed.baseLevel === 0
      })
    } else {
      // Certified Scuba: Higher difficulty progression rule (recommend ALL courses with difficulty > currentDifficulty)
      const currentDifficulty = getHighestSelectedDifficulty(completedList, catalog)
      if (currentDifficulty) {
        candidateCourses = expCourses.filter((course) => {
          const cParsed = parseProgressionLevel(course.slNumber)
          if (!cParsed) return false
          return isCourseProgressionHigher(cParsed, currentDifficulty)
        })
      } else {
        // Fallback if marked certified but none selected yet: higher than beginner
        candidateCourses = expCourses.filter((course) => {
          const cParsed = parseProgressionLevel(course.slNumber)
          return cParsed && cParsed.baseLevel > 0
        })
      }
    }
  } else if (normExp === 'freediving') {
    // Freediving progression: #1 (Basic Freediver) -> #2 (Freediver)
    const fdHighest = getHighestCompletedCourseNumber(completedList, catalog)
    const fdTarget = fdHighest === -1 ? 1 : fdHighest + 1
    candidateCourses = expCourses.filter((course) => {
      const cSl = course.slNumber !== undefined ? normalizeProgressionNumber(course.slNumber) : getCourseSlNumber(course, catalog)
      return cSl === fdTarget
    })
  } else {
    // All other experiences: Snorkeling, Surfing, Customize, etc. -> preserve existing behavior completely
    candidateCourses = expCourses
  }

  // 2. Run existing eligibility, prerequisite, and age checks on candidate courses
  const eligibleCourses = candidateCourses.filter((course) =>
    isCourseEligible(course, numericAge, hasValidCert, completedList, experience)
  )

  // 3. Development-only diagnostic output
  if (
    (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') ||
    (typeof window !== 'undefined' && window.__TDV_DEBUG_PROGRESSION__)
  ) {
    const completedNumbered = completedList
      .map((item) => ({
        title: typeof item === 'object' ? (item.name || item.title || item.id) : String(item),
        slNumber: getCourseSlNumber(item, catalog),
      }))
      .filter((c) => c.slNumber !== null)
    const highest = getHighestCompletedCourseNumber(completedList, catalog)
    const target = highest === -1 ? 0 : highest + 1
    console.log('Completed numbered courses:', completedNumbered)
    console.log('Highest completed number:', highest === -1 ? 'None (-1)' : highest)
    console.log('Next target number:', target)
    console.log('Candidate courses:', candidateCourses.map((c) => ({ name: c.name, slNumber: c.slNumber })))
    console.log('Eligible courses after prerequisite/age checks:', eligibleCourses.map((c) => c.name))
  }

  return eligibleCourses
}

/**
 * Get prioritized recommendation list of eligible courses based on progression level, age, and experience.
 *
 * @param {number|string} age Participant age
 * @param {boolean} hasCert Whether participant holds prior certifications
 * @param {string[]|string} userCerts Selected certifications
 * @param {string} [experience='Scuba Diving'] Active experience
 * @param {Object[]} [catalog=COURSE_CATALOG]
 * @returns {Object[]} List of eligible courses
 */
export function getRecommendedCourses(age, hasCert = false, userCerts = [], experience = 'Scuba Diving', catalog = COURSE_CATALOG) {
  return getEligibleCourses(age, hasCert, userCerts, experience, catalog)
}

/**
 * Validate participant booking object for integrity before submission.
 *
 * @param {Object} participant Participant data
 * @param {string} [experience='Scuba Diving'] Active experience
 * @param {Object[]} [catalog=COURSE_CATALOG]
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateParticipantBooking(participant, experience = 'Scuba Diving', catalog = COURSE_CATALOG) {
  if (!participant) return { valid: false, error: 'Participant data missing.' }

  if (isDirectActivity(experience)) {
    return { valid: true }
  }

  const age = parseInt(participant.age, 10)
  if (isNaN(age) || age < 8 || age > 110) {
    return { valid: false, error: `Invalid age for ${participant.name || 'participant'}. Age must be between 8 and 110 years.` }
  }

  if (!participant.selectedProgram) {
    return { valid: false, error: `No program selected for ${participant.name || 'participant'}.` }
  }

  const course = catalog.find((c) => c.id === participant.selectedProgram)
  if (!course) {
    return { valid: false, error: `Selected course (${participant.selectedProgram}) does not exist.` }
  }

  const normExp = normalizeExperienceKey(experience)
  const courseExp = normalizeExperienceKey(course.experience || course.category)
  if (normExp && courseExp !== normExp) {
    return {
      valid: false,
      error: `Selected program (${course.name}) does not belong to the selected experience (${experience}).`
    }
  }

  if (age < course.minimumAge) {
    return {
      valid: false,
      error: `${participant.name || 'Participant'} (age ${age}) does not meet the minimum age (${course.minimumAge}) for ${getCourseDisplayName(course)}.`
    }
  }

  if (course.maxAge !== null && age > course.maxAge) {
    return {
      valid: false,
      error: `${participant.name || 'Participant'} (age ${age}) exceeds the maximum age (${course.maxAge}) for ${getCourseDisplayName(course)}.`
    }
  }

  const hasCert = Boolean(participant.hasCertification)
  const certs = participant.certifications || (participant.experienceLevel ? [participant.experienceLevel] : [])

  for (const certId of certs) {
    const certOpt = CERTIFICATION_OPTIONS.find((c) => c.id === certId)
    if (certOpt && age < certOpt.minAgeToHold) {
      return {
        valid: false,
        error: `${participant.name || 'Participant'} (age ${age}) cannot hold certification '${certOpt.name}', which requires minimum age ${certOpt.minAgeToHold}.`
      }
    }
  }

  const courseSl = course.slNumber !== undefined ? normalizeProgressionNumber(course.slNumber) : getCourseSlNumber(course, catalog)
  const isInitialSl0Scuba = normExp === 'scuba' && !hasCert && courseSl === 0

  if (!isInitialSl0Scuba && !isPrerequisiteSatisfied(course, hasCert, certs)) {
    return {
      valid: false,
      error: `${participant.name || 'Participant'} does not satisfy the prerequisite certifications for ${getCourseDisplayName(course)}. Required: ${course.certLabel || 'Prior certification'}.`
    }
  }

  // Progression check for numbered courses
  if (courseSl !== null) {
    if (normExp === 'freediving') {
      const fdHighest = getHighestCompletedCourseNumber(certs, catalog)
      const fdTarget = fdHighest === -1 ? 1 : fdHighest + 1
      if (courseSl !== fdTarget) {
        return {
          valid: false,
          error: `Selected program (${getCourseDisplayName(course)}, SL #${courseSl}) does not match participant's target progression level (#${fdTarget}).`
        }
      }
    } else if (normExp === 'scuba') {
      if (!hasCert) {
        if (courseSl !== 0) {
          return {
            valid: false,
            error: `Selected program (${getCourseDisplayName(course)}, SL #${courseSl}) is not available for beginners with no prior certifications.`
          }
        }
      } else {
        const currentDifficulty = getHighestSelectedDifficulty(certs, catalog)
        const courseParsed = parseProgressionLevel(course.slNumber)
        if (currentDifficulty && courseParsed) {
          if (!isCourseProgressionHigher(courseParsed, currentDifficulty)) {
            return {
              valid: false,
              error: `Selected program (${getCourseDisplayName(course)}, SL #${course.slNumber}) must have a higher difficulty level than participant's current certification level (#${currentDifficulty.raw}).`
            }
          }
        }
      }
    }
  }

  return { valid: true }
}

export default {
  EXPERIENCE_OPTIONS,
  DIRECT_ACTIVITIES,
  isDirectActivity,
  getCourseDisplayName,
  CERTIFICATIONS,
  CERTIFICATION_OPTIONS,
  COURSE_CATALOG,
  expandUserCertifications,
  isPrerequisiteSatisfied,
  isCourseEligible,
  normalizeProgressionNumber,
  normalizeExperienceKey,
  getCourseSlNumber,
  getHighestCompletedCourseNumber,
  getNextCourseNumber,
  getCoursesForProgressionNumber,
  getEligibleCourses,
  getRecommendedCourses,
  getAvailableCertificationsForAge,
  EXCLUDED_SCUBA_CERT_OPTIONS,
  parseProgressionLevel,
  compareProgressionLevels,
  getMinimumRecommendedLevel,
  isCourseProgressionHigher,
  getHighestSelectedDifficulty,
  validateParticipantBooking,
}


