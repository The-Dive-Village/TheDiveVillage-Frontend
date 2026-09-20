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

// User-facing normalized certification and prior experience options
export const CERTIFICATION_OPTIONS = [
  // Age 8-9 prior experience options (supported by TDV spreadsheet)
  { id: CERTIFICATIONS.TRY_DIVE, name: 'Try Dive', minAgeToHold: 8 },
  { id: CERTIFICATIONS.PADI_BUBBLEMAKER, name: 'PADI Bubblemaker', minAgeToHold: 8, maxAgeToHold: 10 },
  { id: CERTIFICATIONS.PADI_SKIN_DIVER, name: 'PADI Skin Diver', minAgeToHold: 8 },
  { id: CERTIFICATIONS.REEF_EXPLORER, name: 'Reef Explorer', minAgeToHold: 8 },

  // Age 10+ formal certifications
  { id: CERTIFICATIONS.PADI_DSD, name: 'PADI Discover Scuba Dive (DSD)', minAgeToHold: 10 },
  { id: CERTIFICATIONS.OPEN_WATER, name: 'PADI Open Water Diver (or equivalent)', minAgeToHold: 10 },
  { id: CERTIFICATIONS.ADVENTURE_DIVER, name: 'PADI Adventure Diver', minAgeToHold: 10 },
  { id: CERTIFICATIONS.ADVANCED_OPEN_WATER, name: 'PADI Advanced Open Water', minAgeToHold: 12 },
  { id: CERTIFICATIONS.EFR, name: 'EFR Primary & Secondary Care', minAgeToHold: 12 },
  { id: CERTIFICATIONS.RESCUE_DIVER, name: 'PADI Rescue Diver', minAgeToHold: 12 },
  { id: CERTIFICATIONS.LOGGED_40_DIVES, name: '40+ Logged Dives', minAgeToHold: 10 },
  { id: CERTIFICATIONS.BASIC_FREEDIVER, name: 'PADI Basic Freediver (or equivalent)', minAgeToHold: 12 },
  { id: CERTIFICATIONS.DIVEMASTER, name: 'PADI Divemaster / Pro', minAgeToHold: 18 },
]

/**
 * Get user-selectable certification / experience options available for a given age.
 *
 * @param {number|string} age Participant age
 * @returns {Object[]} Available certification/experience options for this age
 */
export function getAvailableCertificationsForAge(age) {
  const numericAge = parseInt(age, 10)
  if (isNaN(numericAge) || numericAge < 8 || numericAge > 110) return []
  return CERTIFICATION_OPTIONS.filter((opt) => {
    if (numericAge < opt.minAgeToHold) return false
    if (opt.maxAgeToHold && numericAge > opt.maxAgeToHold) return false
    return true
  })
}

// Master 44-Course Catalog from TDV_Course_MinAge_Certifications.xlsx
export const COURSE_CATALOG = [
  // 1. Try Dive
  {
    id: 'try-dive',
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
  // 4. Skin Diver
  {
    id: 'padi-skin-diver',
    name: 'Skin Diver',
    category: 'Snorkeling',
    minimumAge: 8,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required'
  },
  // 8. Scuba Diver
  {
    id: 'padi-scuba-diver',
    name: 'Scuba Diver',
    category: 'Certification Courses',
    minimumAge: 10,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required'
  },
  // 9. Open Water Diver
  {
    id: 'padi-open-water',
    name: 'Open Water Diver',
    category: 'Certification Courses',
    minimumAge: 10,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior certification required'
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
      type: 'SINGLE',
      requirement: CERTIFICATIONS.OPEN_WATER
    },
    certLabel: 'Open Water Diver'
  },
  // 12. EFR Primary & Secondary Care
  {
    id: 'efr-primary-secondary',
    name: 'EFR Primary & Secondary Care',
    category: 'First Aid & CPR',
    minimumAge: 12,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No scuba certification required'
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
    certLabel: 'Advanced Open Water + EFR'
  },
  // 14. Reactivate (with dive)
  {
    id: 'padi-reactivate',
    name: 'Reactivate (with dive)',
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
    certLabel: 'Adventure Diver OR Advanced Open Water'
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
    certLabel: 'Adventure Diver OR Advanced Open Water'
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
    certLabel: 'Open Water Diver (or equivalent)'
  },
  {
    id: '2-dives',
    name: '2 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver (or equivalent)'
  },
  {
    id: '4-dives',
    name: '4 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver (or equivalent)'
  },
  {
    id: '6-dives',
    name: '6 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver (or equivalent)'
  },
  {
    id: '8-dives',
    name: '8 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver (or equivalent)'
  },
  {
    id: '10-dives',
    name: '10 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver (or equivalent)'
  },
  {
    id: '12-dives',
    name: '12 Dives',
    category: 'Fun Dives',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver (or equivalent)'
  },
  {
    id: 'post-12-dives',
    name: 'Post 12 (extra 2 dives)',
    category: 'Fun Dives',
    minimumAge: 10,
    bookingType: 'certification_required',
    prerequisites: { type: 'SINGLE', requirement: CERTIFICATIONS.OPEN_WATER },
    certLabel: 'Open Water Diver (or equivalent)'
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
    certLabel: 'Open Water Diver (or equivalent)'
  },
  // 33. DSD + Open Water (Bundled Pathway)
  {
    id: 'padi-dsd-ow-combo',
    name: 'DSD + Open Water',
    category: 'Bundled Pathways',
    minimumAge: 10,
    bookingType: 'pathway',
    prerequisites: null,
    certLabel: 'Pathway from beginner to Open Water'
  },
  // 34. OW + Advanced (Bundled Pathway)
  {
    id: 'padi-ow-aow-combo',
    name: 'OW + Advanced',
    category: 'Bundled Pathways',
    minimumAge: 12,
    bookingType: 'pathway',
    prerequisites: null,
    certLabel: 'Pathway from beginner to Advanced'
  },
  // 35. EFR + Rescue Diver (Bundled Pathway)
  {
    id: 'efr-rescue-combo',
    name: 'EFR + Rescue Diver',
    category: 'Bundled Pathways',
    minimumAge: 12,
    bookingType: 'certification_required',
    prerequisites: {
      type: 'SINGLE',
      requirement: CERTIFICATIONS.ADVANCED_OPEN_WATER
    },
    certLabel: 'Advanced Open Water'
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
    certLabel: 'Rescue Diver + EFR + 40 logged dives'
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
      requirements: [CERTIFICATIONS.ADVANCED_OPEN_WATER, CERTIFICATIONS.LOGGED_40_DIVES]
    },
    certLabel: 'Advanced Open Water + 40 logged dives'
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
      requirements: [CERTIFICATIONS.ADVANCED_OPEN_WATER, CERTIFICATIONS.LOGGED_40_DIVES]
    },
    certLabel: 'Advanced Open Water + 40 logged dives'
  },
  // 39. Zero to Hero (OW to DM)
  {
    id: 'zero-to-hero',
    name: 'Zero to Hero (OW to DM)',
    category: 'Professional Track',
    minimumAge: 18,
    bookingType: 'pathway',
    prerequisites: null,
    certLabel: 'Complete Pathway from Beginner to Pro'
  },
  // 40. Basic Freediver
  {
    id: 'padi-basic-freediver',
    name: 'Basic Freediver',
    category: 'Freediving',
    minimumAge: 12,
    bookingType: 'beginner',
    prerequisites: null,
    certLabel: 'No prior freediving certification required'
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

  // Hierarchy progressions
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
  // Beginner and unconstrained pathway courses do not require prior certifications
  if (course.bookingType === 'beginner' || course.bookingType === 'pathway' || !course.prerequisites) {
    // If user has no certification, these are always eligible
    return true
  }

  // If user explicitly has no certification, certification_required courses are blocked
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
export function isCourseEligible(course, age, hasCert = false, userCerts = []) {
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

  // Check prerequisites
  return isPrerequisiteSatisfied(course, hasCert, userCerts)
}

/**
 * Get all eligible courses for a participant.
 *
 * @param {number|string} age Participant age
 * @param {boolean} hasCert Whether participant holds prior certifications
 * @param {string[]|string} userCerts Selected certifications
 * @returns {Object[]} List of eligible courses
 */
export function getEligibleCourses(age, hasCert = false, userCerts = []) {
  const numericAge = parseInt(age, 10)
  if (isNaN(numericAge) || numericAge < 8 || numericAge > 110) {
    return []
  }

  return COURSE_CATALOG.filter((course) => isCourseEligible(course, numericAge, hasCert, userCerts))
}

/**
 * Validate participant booking object for integrity before submission.
 *
 * @param {Object} participant Participant data
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateParticipantBooking(participant) {
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

  if (age < course.minimumAge) {
    return {
      valid: false,
      error: `${participant.name || 'Participant'} (age ${age}) does not meet the minimum age (${course.minimumAge}) for ${course.name}.`
    }
  }

  const hasCert = Boolean(participant.hasCertification)
  const certs = participant.certifications || (participant.experienceLevel ? [participant.experienceLevel] : [])

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

  if (!isPrerequisiteSatisfied(course, hasCert, certs)) {
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
  getAvailableCertificationsForAge,
  validateParticipantBooking,
}
