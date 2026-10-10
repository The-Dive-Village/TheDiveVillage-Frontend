import LazyVideo from '../components/LazyVideo'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { motion } from 'framer-motion'
import PhoneInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import CompactTwoMonthCalendarPopover from '../components/CompactTwoMonthCalendarPopover'
import SEOHead from '../components/SEOHead'
import padiCountries from '../data/padiCountries.json'
import { bookingService } from '../services/bookingService'
import { FUN_DIVES_PACKAGES } from '../data/servicesData'
import {
  COURSE_CATALOG,
  CERTIFICATION_OPTIONS,
  EXPERIENCE_OPTIONS,
  ADD_ON_OPTIONS,
  isDirectActivity,
  getCourseDisplayName,
  getEligibleCourses,
  getRecommendedCourses,
  getAvailableCertificationsForAge,
  sortCoursesByDifficulty,
  validateParticipantBooking,
} from '../utils/courseEligibility'
import { triggerHaptic, triggerSuccessHaptic, triggerErrorHaptic } from '../utils/haptics'

import turtleAnnaVideo from '../assets/Media/Background/Turtle.mp4'
import compiledNightDiveVideo from '../assets/Media/Background/Night Dive.mp4'
import useNightDive from '../hooks/useNightDive'
import DiveExplorerMap from '../components/DiveExplorerMap'
import { loadDiveSites } from '../utils/diveSitesLoader'
import { getIslandsForCountry, getSitesForIsland, getIslandForSite } from '../utils/diveIslandCatalog'


// Backwards-compatible export alias for any legacy imports
export const PROGRAMS_CATALOG = COURSE_CATALOG

/**
 * Maps service page IDs → { courseId, experience, funDivesCount? }
 * so that arriving from a 'Book' button auto-selects the program and skips Step 3.
 */
const SERVICE_TO_PROGRAM = {
  // Introductory Programs
  'prog-1': { courseId: 'try-dive',            experience: 'Scuba Diving' },
  'prog-2': { courseId: 'dsd-lite',             experience: 'Scuba Diving' },
  'prog-3': { courseId: 'padi-dsd',             experience: 'Scuba Diving' },
  'prog-4': { courseId: 'add-dive-after-dsd',   experience: 'Scuba Diving' },
  'prog-5': { courseId: 'padi-bubblemaker',     experience: 'Scuba Diving' },
  // Snorkeling
  'snork-1': { courseId: 'discover-snorkeling', experience: 'Snorkeling' },
  'snork-2': { courseId: 'padi-skin-diver',     experience: 'Snorkeling' },
  'snork-3': { courseId: 'reef-explorer',       experience: 'Snorkeling' },
  // Certification Courses
  'course-1':  { courseId: 'padi-skin-diver',        experience: 'Snorkeling'   },
  'course-2':  { courseId: 'padi-scuba-diver',        experience: 'Scuba Diving' },
  'course-3':  { courseId: 'padi-open-water',         experience: 'Scuba Diving' },
  'course-4':  { courseId: 'padi-adventure-diver',    experience: 'Scuba Diving' },
  'course-5':  { courseId: 'padi-advanced-ow',        experience: 'Scuba Diving' },
  'course-6':  { courseId: 'efr-primary-secondary',   experience: 'Scuba Diving' },
  'course-7':  { courseId: 'padi-rescue-diver',       experience: 'Scuba Diving' },
  'course-8':  { courseId: 'padi-reactivate',         experience: 'Scuba Diving' },
  'course-9':  { courseId: 'full-refresher',          experience: 'Scuba Diving' },
  'course-10': { courseId: 'lite-refresher',          experience: 'Scuba Diving' },
  // Specialties
  'spec-1': { courseId: 'peak-buoyancy',       experience: 'Scuba Diving' },
  'spec-2': { courseId: 'project-aware',       experience: 'Scuba Diving' },
  'spec-3': { courseId: 'deep-diver',          experience: 'Scuba Diving' },
  'spec-4': { courseId: 'wreck-diver',         experience: 'Scuba Diving' },
  'spec-5': { courseId: 'night-diver',         experience: 'Scuba Diving' },
  'spec-6': { courseId: 'enriched-air-nitrox', experience: 'Scuba Diving' },
  'spec-7': { courseId: 'drift-diver',         experience: 'Scuba Diving' },
  // Combos & Packages
  'combo-1':        { courseId: 'padi-dsd-ow-combo',  experience: 'Scuba Diving' },
  'combo-2':        { courseId: 'padi-ow-aow-combo',  experience: 'Scuba Diving' },
  'combo-3':        { courseId: 'efr-rescue-combo',   experience: 'Scuba Diving' },
  'combo-fundives': { courseId: 'fun-day-dive',        experience: 'Scuba Diving' },
  // Pro Courses
  'pro-1': { courseId: 'padi-divemaster',       experience: 'Scuba Diving' },
  'pro-2': { courseId: 'efr-rescue-dm-combo',   experience: 'Scuba Diving' },
  'pro-3': { courseId: 'efr-rescue-dm-prereqs', experience: 'Scuba Diving' },
  'pro-4': { courseId: 'zero-to-hero',          experience: 'Scuba Diving' },
  // Freediving
  'free-1': { courseId: 'padi-basic-freediver', experience: 'FreeDiving' },
  'free-2': { courseId: 'padi-freediver',       experience: 'FreeDiving' },
  // Surfing
  'surf-1': { courseId: 'discover-surfing',      experience: 'Surfing' },
  'surf-3': { courseId: '3-day-surf-academy',    experience: 'Surfing' },
  // Fun Dives (individual packages — auto-select day dive + count)
  'fun-1':    { courseId: 'fun-day-dive', experience: 'Scuba Diving', funDivesCount: 1  },
  'fun-2':    { courseId: 'fun-day-dive', experience: 'Scuba Diving', funDivesCount: 2  },
  'fun-4':    { courseId: 'fun-day-dive', experience: 'Scuba Diving', funDivesCount: 4  },
  'fun-6':    { courseId: 'fun-day-dive', experience: 'Scuba Diving', funDivesCount: 6  },
  'fun-8':    { courseId: 'fun-day-dive', experience: 'Scuba Diving', funDivesCount: 8  },
  'fun-10':   { courseId: 'fun-day-dive', experience: 'Scuba Diving', funDivesCount: 10 },
  'fun-12':   { courseId: 'fun-day-dive', experience: 'Scuba Diving', funDivesCount: 12 },
  'fun-post': { courseId: 'fun-day-dive', experience: 'Scuba Diving', funDivesCount: 2  },
}

export default function BookUs() {
  const isNightDive = useNightDive()
  const [searchParams] = useSearchParams()
  const initialProgram = searchParams.get('program') || ''
  const initialCountry = searchParams.get('country') || ''
  const initialSite = searchParams.get('site') || ''
  const initialService = searchParams.get('service') || ''

  // Derive pre-selected program from service link (e.g. /book-us?service=course-3)
  const initialFromService = useMemo(() => {
    if (!initialService) return null
    return SERVICE_TO_PROGRAM[initialService] || null
  }, [initialService])

  const initialAddOn = useMemo(() => {
    if (initialService) {
      if (initialService.includes('trekking')) return 'Trekking'
      if (initialService.includes('sightseeing')) return 'Local Sightseeing'
      if (initialService.includes('camper')) return 'Camping / Camper'
      if (initialService.includes('safari')) return 'Safari'
      if (initialService.includes('liveaboard')) return 'Liveaboard'
      if (initialService.includes('canoneering') || initialService.includes('canyon')) return 'Canyoneering'
    }
    return ''
  }, [initialService])

  const [currentStep, setCurrentStep] = useState(1)

  // Today, 7-day preparation cutoff (dates 7 days after current day are unavailable), & 1 year max date bounds
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])
  const cooldownMinDateStr = useMemo(() => {
    const d = new Date()
    // 7 days after current day are unavailable (e.g. if today is 10, till 17 is unavailable, available from 18)
    d.setDate(d.getDate() + 8)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }, [])
  const maxDateStr = useMemo(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 1)
    return d.toISOString().split('T')[0]
  }, [])

  // Step 1: Country, Island, Dive Site, Experience, Date & Group Size
  const [country, setCountry] = useState(initialCountry)
  const [island, setIsland] = useState('')
  const [allDiveSites, setAllDiveSites] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [locationId, setLocationId] = useState(initialSite)
  const [location, setLocation] = useState(initialSite)
  const [experience, setExperience] = useState(initialFromService?.experience || '')
  const [selectedAddOn, setSelectedAddOn] = useState(initialAddOn)
  const [date, setDate] = useState('')
  const [dateError, setDateError] = useState('')
  const [stepError, setStepError] = useState('')
  const [groupSize, setGroupSize] = useState(1)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const datePickerBtnRef = useRef(null)

  // Load all dive sites to populate islands & sites
  useEffect(() => {
    let isMounted = true
    loadDiveSites().then((data) => {
      if (isMounted && data?.sites) {
        setAllDiveSites(data.sites)
      }
    }).catch(console.error)
    return () => { isMounted = false }
  }, [])

  // Auto-resolve island if initialSite query parameter is provided
  useEffect(() => {
    if (initialSite && allDiveSites.length > 0 && !island) {
      const match = allDiveSites.find((s) => s.id === initialSite || s.siteName === initialSite)
      if (match) {
        if (!country && match.country) setCountry(match.country)
        const siteIsland = getIslandForSite(match)
        if (siteIsland) setIsland(siteIsland)
      }
    }
  }, [initialSite, allDiveSites, island, country])

  // Available islands in selected country
  const availableIslands = useMemo(() => {
    return getIslandsForCountry(country, allDiveSites)
  }, [country, allDiveSites])

  // Available dive sites on selected island
  const availableSitesForIsland = useMemo(() => {
    const list = getSitesForIsland(country, island, allDiveSites)
    return [...list].sort((a, b) => (a.siteName || '').localeCompare(b.siteName || ''))
  }, [country, island, allDiveSites])

  const handleMapSelectCountry = useCallback((newCountry) => {
    setCountry(newCountry || '')
    setIsland('')
    setSelectedLocation(null)
    setLocation('')
    setLocationId('')
    setStepError('')
    triggerHaptic(5)
  }, [])

  const handleMapSelectSite = useCallback((site) => {
    if (!site) return
    if (site.country && site.country !== 'International Waters') {
      setCountry(site.country)
    }
    const siteIsland = getIslandForSite(site)
    if (siteIsland) {
      setIsland(siteIsland)
    }
    if (site.siteName) {
      setLocation(site.siteName)
      setLocationId(site.id || site.siteName)
    }
    setStepError('')
    triggerSuccessHaptic()
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const formEl = document.getElementById('booking-wizard-form')
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [])

  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return ''
    const parts = dateStr.split('-')
    if (parts.length !== 3) return dateStr
    const [year, month, day] = parts
    return `${day}-${month}-${year}`
  }

  // Country list lookup
  const countries = useMemo(() => padiCountries || [], [])

  // Step 1 Handlers
  const handleCountryChange = (newCountry) => {
    setCountry(newCountry)
    setIsland('')
    setSelectedLocation(null)
    setLocationId('')
    setLocation('')
    setStepError('')
  }

  const handleIslandChange = (newIsland) => {
    setIsland(newIsland)
    setSelectedLocation(null)
    setLocationId('')
    setLocation('')
    setStepError('')
    triggerHaptic(5)
  }

  const handleSiteChange = (newSiteName) => {
    setLocation(newSiteName)
    const match = availableSitesForIsland.find((s) => s.siteName === newSiteName)
    setLocationId(match ? (match.id || match.siteName) : newSiteName)
    setStepError('')
    triggerSuccessHaptic()
  }

  const handleExperienceChange = (newExp) => {
    setExperience(newExp)
    setStepError('')
    // Reset experience-specific participant state when experience changes
    setParticipants((prev) =>
      prev.map((p) => ({
        ...p,
        hasCertification: false,
        certifications: [],
        selectedProgram: '',
      }))
    )
  }

  const handleAddOnChange = (newAddOn) => {
    setSelectedAddOn(newAddOn)
    setStepError('')
  }

  // Step 2: Participant Info List
  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: '',
      age: '',
      hasCertification: false,
      certifications: [],
      selectedProgram: initialFromService?.courseId || initialProgram || '',
      funDivesCount: initialFromService?.funDivesCount || undefined,
    }
  ])

  // Step 4: Contact Details
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    requests: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sync group size changes to participants array
  useEffect(() => {
    const count = Math.max(1, parseInt(groupSize, 10) || 1)
    setParticipants((prev) => {
      if (prev.length === count) return prev
      if (prev.length < count) {
        const extra = Array.from({ length: count - prev.length }, (_, i) => ({
          id: prev.length + i + 1,
          name: '',
          age: '',
          hasCertification: false,
          certifications: [],
          selectedProgram: initialFromService?.courseId || '',
          funDivesCount: initialFromService?.funDivesCount || undefined,
        }))
        return [...prev, ...extra]
      }
      return prev.slice(0, count)
    })
  }, [groupSize, initialFromService])

  const handleParticipantChange = (index, field, value) => {
    setParticipants((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }

      if (field === 'hasCertification' && !value) {
        updated[index].certifications = []
      }

      if (field === 'age' || field === 'hasCertification' || field === 'certifications') {
        const p = updated[index]
        const ageNum = parseInt(p.age, 10)
        if (isNaN(ageNum) || ageNum < 8 || ageNum > 110) {
          updated[index].hasCertification = false
          updated[index].certifications = []
          updated[index].selectedProgram = ''
        } else {
          const validCertsForAge = (updated[index].certifications || []).filter((certId) => {
            const opt = CERTIFICATION_OPTIONS.find((c) => c.id === certId)
            return opt && ageNum >= opt.minAgeToHold && (!opt.maxAgeToHold || ageNum <= opt.maxAgeToHold)
          })
          updated[index].certifications = validCertsForAge

          const availableCertOpts = getAvailableCertificationsForAge(ageNum, experience)
          if (availableCertOpts.length === 0) {
            updated[index].hasCertification = false
          }

          const eligible = getRecommendedCourses(p.age, updated[index].hasCertification, updated[index].certifications, experience)
          const isCurrentEligible = eligible.some((course) => course.id === p.selectedProgram)
          if (!isCurrentEligible) {
            updated[index].selectedProgram = ''
          }
        }
      }
      return updated
    })
  }

  // Multi-select certification handler for Scuba & FreeDiving
  const handleSelectCertification = (index, certId) => {
    setParticipants((prev) => {
      const updated = [...prev]
      const p = updated[index]
      const currentCerts = p.certifications || []
      const isCurrentlySelected = currentCerts.includes(certId)

      // Multi-select: toggle clicked certification
      const newCerts = isCurrentlySelected
        ? currentCerts.filter((id) => id !== certId)
        : [...currentCerts, certId]

      updated[index] = {
        ...p,
        hasCertification: true,
        certifications: newCerts,
      }

      const eligible = getRecommendedCourses(p.age, true, newCerts, experience)
      const isCurrentEligible = eligible.some((course) => course.id === p.selectedProgram)
      if (!isCurrentEligible) {
        updated[index].selectedProgram = ''
      }
      return updated
    })
  }

  const handlePrevStep = useCallback(() => {
    if (currentStep > 1) {
      triggerHaptic(8)
      setStepError('')
      const isDirect = (!experience && Boolean(selectedAddOn)) || isDirectActivity(experience)
      if (currentStep === 4 && isDirect) {
        setCurrentStep(1)
      } else if (currentStep === 4 && initialFromService) {
        // Pre-selected from service → step 3 doesn’t exist, go back to step 2
        setCurrentStep(2)
      } else {
        setCurrentStep((prev) => prev - 1)
      }
    }
  }, [currentStep, experience, selectedAddOn, initialFromService])

  const handleNextStep = useCallback(() => {
    if (currentStep === 1) {
      if (!country) {
        triggerErrorHaptic()
        setStepError('Please select a dive country.')
        return false
      }
      if (!island && availableIslands.length > 0) {
        triggerErrorHaptic()
        setStepError('Please select an island / region.')
        return false
      }
      if (!locationId && !selectedLocation && !location) {
        triggerErrorHaptic()
        setStepError('Please select a dive site.')
        return false
      }
      if (!experience && !selectedAddOn) {
        triggerErrorHaptic()
        setStepError('Please select an experience or add-on.')
        return false
      }
      if (!date || date < cooldownMinDateStr || date > maxDateStr) {
        triggerErrorHaptic()
        setDateError('Please select a date after the 7-day advance booking period.')
        setStepError('Please select a valid date after the 7-day advance booking period.')
        return false
      }
      if (!groupSize || parseInt(groupSize, 10) < 1) {
        triggerErrorHaptic()
        setStepError('Please enter a valid number of participants (minimum 1).')
        return false
      }
      setDateError('')
      setStepError('')

      // Direct activity skips course & participant cert eligibility steps directly to Contact Info (Step 4)
      const isDirect = (!experience && Boolean(selectedAddOn)) || isDirectActivity(experience)
      if (isDirect) {
        triggerHaptic(10)
        setCurrentStep(4)
        return true
      }
    }
    if (currentStep === 2) {
      const hasEmpty = participants.some((p) => !p.name || !p.age)
      if (hasEmpty) {
        triggerErrorHaptic()
        setStepError('Please fill in the Name and Age for all participants.')
        return false
      }
      const hasInvalidAge = participants.some((p) => parseInt(p.age, 10) < 8)
      if (hasInvalidAge) {
        triggerErrorHaptic()
        setStepError('Minimum age for participating in activities is 8 years. Participants under 8 cannot proceed.')
        return false
      }
      const hasMissingCert = participants.some((p) => {
        if (!p.hasCertification) return false
        const available = getAvailableCertificationsForAge(p.age, experience)
        return available.length > 0 && (!p.certifications || p.certifications.length === 0)
      })
      if (hasMissingCert) {
        triggerErrorHaptic()
        setStepError('Please select at least one current certification for participants marked as certified.')
        return false
      }
      setStepError('')
      // If coming from a service link, all participants already have program pre-selected—skip step 3
      if (initialFromService) {
        triggerHaptic(10)
        setCurrentStep(4)
        return true
      }
    }
    if (currentStep === 3) {
      const hasUnselected = participants.some((p) => !p.selectedProgram)
      if (hasUnselected) {
        triggerErrorHaptic()
        setStepError('Please select an eligible program for each participant.')
        return false
      }
      const hasMissingFunDivesCount = participants.some((p) => ['fun-day-dive', 'fun-dawn-dive', 'fun-night-dive'].includes(p.selectedProgram) && !p.funDivesCount)
      if (hasMissingFunDivesCount) {
        triggerErrorHaptic()
        setStepError('Please select a dive package (number of dives) for each Fun Dive participant.')
        return false
      }
      for (const p of participants) {
        const val = validateParticipantBooking(p, experience)
        if (!val.valid) {
          triggerErrorHaptic()
          setStepError(val.error || 'Eligibility validation failed.')
          return false
        }
      }
      setStepError('')
    }
    if (currentStep < 4) {
      triggerHaptic(10)
      setStepError('')
      setCurrentStep((prev) => prev + 1)
      return true
    }
    return true
  }, [currentStep, country, locationId, selectedLocation, location, experience, selectedAddOn, date, todayStr, maxDateStr, groupSize, participants, initialFromService])

  // Desktop keyboard step navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'TEXTAREA' || isCalendarOpen) return

      if (e.key === 'Enter' && !e.shiftKey && currentStep < 4) {
        e.preventDefault()
        handleNextStep()
      } else if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'Left')) {
        e.preventDefault()
        handlePrevStep()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNextStep, handlePrevStep, isCalendarOpen, currentStep])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSubmitting) return

    if (!contact.name || !contact.email) {
      setStepError('Please enter your contact Name and Email.')
      return
    }

    const isDirect = (!experience && Boolean(selectedAddOn)) || isDirectActivity(experience)

    // Pre-submission validation for course-based bookings
    if (!isDirect) {
      for (const p of participants) {
        const validation = validateParticipantBooking(p, experience)
        if (!validation.valid) {
          setStepError(validation.error || 'Participant eligibility validation failed.')
          setCurrentStep(2)
          return
        }
      }
    }

    setIsSubmitting(true)
    setStepError('')

    try {
      const res = await bookingService.createBooking({
        country,
        locationId: locationId ? String(locationId) : null,
        location,
        experience: experience || selectedAddOn,
        selectedAddOn: selectedAddOn || null,
        date,
        groupSize: participants.length,
        contactName: contact.name,
        contactEmail: contact.email,
        contactPhone: contact.phone || null,
        specialRequests: contact.requests || null,
        participants: isDirect ? [] : participants,
      })

      const isSuccess = Boolean(
        res && (
          res.status === 'success' ||
          res.data?.status === 'success' ||
          res.data?.booking ||
          res.booking
        )
      )

      if (isSuccess) {
        triggerSuccessHaptic()
        try {
          const newBookingRecord = {
            id: res?.data?.booking?.id || res?.booking?.id || `BK-${Date.now().toString(36).toUpperCase()}`,
            type: 'Booking Request',
            country,
            island: island || null,
            location,
            experience: experience || selectedAddOn,
            selectedAddOn: selectedAddOn || null,
            date,
            groupSize: participants.length,
            contactName: contact.name,
            contactEmail: contact.email,
            contactPhone: contact.phone || null,
            specialRequests: contact.requests || null,
            participants: isDirect ? [] : participants,
            status: 'Pending Review',
            createdAt: new Date().toISOString(),
          }
          const existing = JSON.parse(localStorage.getItem('dive_village_bookings') || '[]')
          localStorage.setItem('dive_village_bookings', JSON.stringify([newBookingRecord, ...existing]))
        } catch (e) {
          console.warn('Could not save booking locally:', e)
        }
        setSubmitted(true)
      } else {
        triggerErrorHaptic()
        throw new Error('Server returned an invalid or incomplete booking response.')
      }
    } catch (err) {
      triggerErrorHaptic()
      console.error('Booking submission error:', err)
      const errorMsg = err.message || 'Failed to submit booking. Please try again.'
      setStepError(`Booking submission failed: ${errorMsg}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    const isDirect = (!experience && Boolean(selectedAddOn)) || isDirectActivity(experience)
    return (
      <div className="bg-[#FAFAFA] flex min-h-[80vh] flex-col items-center justify-center px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="rounded-[40px] bg-white p-8 sm:p-14 shadow-[0_20px_60px_-15px_rgba(0,56,101,0.1)] max-w-xl w-full border border-navy/5 relative overflow-hidden"
        >
          {/* Decorative background flare */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-[0_0_0_10px_rgba(16,185,129,0.1)] relative"
          >
            <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="scale-125"><CheckIcon /></div>
          </motion.div>

          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-navy tracking-tight leading-tight mb-4">
            Great!<br />We'll get in touch with you.
          </h2>
          <p className="text-navy/70 text-sm sm:text-base leading-relaxed">
            Thank you <span className="font-bold text-navy">{contact.name}</span>! We've reserved your request for <span className="font-bold text-accent">{experience || selectedAddOn}</span> at <span className="font-bold text-navy">{location}</span>.
          </p>

          <div className="my-10 relative">
            {/* Ticket Cutout Effect */}
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#FAFAFA] rounded-full shadow-[inset_-3px_0_6px_rgba(0,0,0,0.02)] z-10" />
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#FAFAFA] rounded-full shadow-[inset_3px_0_6px_rgba(0,0,0,0.02)] z-10" />

            <div className="rounded-3xl bg-[#F8F9FA] p-6 text-left space-y-4 text-xs sm:text-sm border border-dashed border-navy/20 relative z-0">
              <div className="flex justify-between items-start border-b border-navy/5 pb-3">
                <span className="text-navy/50 font-semibold uppercase tracking-wider text-[10px] sm:text-xs">Experience & Location</span>
                <span className="font-bold text-navy text-right leading-tight max-w-[60%]">{experience || selectedAddOn} <br /><span className="text-navy/60 font-medium text-[11px] sm:text-xs">{location}</span></span>
              </div>
              {selectedAddOn && experience && (
                <div className="flex justify-between items-start border-b border-navy/5 pb-3">
                  <span className="text-navy/50 font-semibold uppercase tracking-wider text-[10px] sm:text-xs">Add On</span>
                  <span className="font-bold text-accent text-right leading-tight">{selectedAddOn}</span>
                </div>
              )}
              <div className="flex justify-between items-start border-b border-navy/5 pb-3">
                <span className="text-navy/50 font-semibold uppercase tracking-wider text-[10px] sm:text-xs">Date & Group</span>
                <span className="font-bold text-navy text-right leading-tight max-w-[60%]">{formatDateToDDMMYYYY(date)} <br /><span className="text-navy/60 font-medium text-[11px] sm:text-xs">{participants.length} Person{participants.length > 1 ? 's' : ''}</span></span>
              </div>

              {!isDirect && (
                <div className="space-y-3 pt-1">
                  <span className="text-navy/50 font-semibold uppercase tracking-wider text-[10px] sm:text-xs block mb-2">Participants & Programs</span>
                  {participants.map((p, idx) => {
                    const prog = COURSE_CATALOG.find((pr) => pr.id === p.selectedProgram)
                    const certNames = (p.certifications || [])
                      .map((id) => CERTIFICATION_OPTIONS.find((c) => c.id === id)?.name)
                      .filter(Boolean)
                    const certSummary = p.hasCertification
                      ? (certNames.length ? certNames.join(', ') : 'Certified Diver')
                      : 'No Prior Certification (Beginner / Pathway)'

                    return (
                      <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-navy/5">
                        <div className="pr-3">
                          <span className="font-bold text-navy text-sm block mb-0.5">{p.name || `Participant ${idx + 1}`}</span>
                          <span className="text-[10px] sm:text-[11px] text-navy/50 leading-tight block">Age: {p.age || 'N/A'} • {certSummary}</span>
                        </div>
                        <span className="font-bold text-accent text-[10px] bg-accent/10 px-2.5 py-1.5 rounded-full text-center shrink-0 max-w-[110px] leading-tight">
                          {getCourseDisplayName(prog?.name || 'Selected Course')}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="flex justify-between items-start border-t border-navy/10 pt-4 mt-2">
                <span className="text-navy/50 font-semibold uppercase tracking-wider text-[10px] sm:text-xs">Contact Info</span>
                <span className="font-bold text-navy text-right leading-tight max-w-[60%]">{contact.email} <br /><span className="text-navy/60 font-medium text-[11px] sm:text-xs">{contact.phone || 'N/A'}</span></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSubmitted(false)
              setCurrentStep(1)
            }}
            className="relative z-10 rounded-full bg-navy px-8 py-4 sm:py-5 text-sm sm:text-base font-bold text-white transition-all hover:bg-accent hover:text-navy hover:scale-[1.02] active:scale-[0.98] w-full shadow-[0_8px_20px_rgba(0,56,101,0.15)] cursor-pointer"
          >
            Submit Another Booking
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen text-navy font-body overflow-x-clip ${isNightDive ? 'bg-[#0b1726]' : 'bg-[#FAFAFA]'}`} style={{ textShadow: 'none' }}>
      <SEOHead
        title="Book Scuba Diving Courses & Expeditions Online | The Dive Village"
        description="Book certified scuba diving courses, Discovery dives, snorkeling trips, and freediving packages online with instant confirmation at The Dive Village."
        keywords="book scuba dive online, scuba course reservation, dive charter booking, snorkeling trip reservation, dive village booking"
        canonicalUrl="https://thedivevillage.com/book-us"
      />

      {/* 1. HEADER VIDEO HERO (DYNAMIC COMPILED NIGHT DIVE VIDEO - DESKTOP ONLY) */}
      <section className="hidden sm:flex relative h-[56vh] min-h-[420px] lg:h-[60vh] lg:min-h-[460px] w-full items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%)'
          }}
        >
          <LazyVideo
            key={isNightDive ? 'night-compiled' : 'day-turtle'}
            src={isNightDive ? compiledNightDiveVideo : turtleAnnaVideo}
            autoPlay
            loop
            muted
            playsInline
            onPlay={(e) => { e.currentTarget.playbackRate = 0.7 }}
            className="w-full h-full object-cover scale-110 origin-center transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#001428]/65 via-[#001428]/25 to-transparent pointer-events-none" />
        </div>

        {/* Bottom Ultra-Smooth Dissolve & Merge Layer */}
        <div
          className={`absolute bottom-0 inset-x-0 h-28 sm:h-36 lg:h-44 pointer-events-none z-[5] transition-colors duration-500 ${isNightDive
              ? 'bg-gradient-to-t from-[#0b1726] via-[#0b1726]/85 via-45% to-transparent'
              : 'bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/90 via-45% to-transparent'
            }`}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto pt-4 sm:pt-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-white leading-none drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
          >
            Book Your <span className="text-[#FFCD00]">Dive</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl font-medium text-white/90 max-w-xl leading-relaxed drop-shadow-md text-center"
          >
            Select your location, group size, participant details, and programs. Our dive masters will get back to you.
          </motion.p>
        </div>
      </section>

      {/* 2. MAIN 4-STEP BOOKING WIZARD & 2D DIVE EXPLORER MAP */}
      <div className="mx-auto max-w-[1600px] px-3 xs:px-4 sm:px-6 lg:px-8 pt-[74px] sm:pt-6 pb-28 sm:pb-40 w-full min-w-0 relative z-20">
        {/* Responsive Grid Layout (Desktop: Form + Map side-by-side; Mobile: Form on top, Map right below) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">

          {/* Column 1: 4-Step Booking Wizard */}
          <div className="lg:col-span-6 xl:col-span-5 w-full min-w-0">
            <div className="flex flex-col w-full min-w-0">
              <form id="booking-wizard-form" onSubmit={handleSubmit} className="flex-1 flex flex-col bg-white p-4 sm:p-10 rounded-2xl sm:rounded-[36px] border border-navy/10 shadow-sm sm:shadow-card w-full min-w-0 max-w-full min-h-[auto] sm:min-h-[620px] justify-between">
                <div className="flex-1 space-y-3.5 sm:space-y-6">

                  {/* Mobile Step Header */}
                  {(() => {
                    const isDirect = (!experience && Boolean(selectedAddOn)) || isDirectActivity(experience)
                    const totalSteps = isDirect ? 2 : initialFromService ? 3 : 4
                    // Map actual step numbers to display positions
                    const displayStep = isDirect
                      ? (currentStep === 4 ? 2 : 1)
                      : initialFromService
                      ? (currentStep === 4 ? 3 : currentStep)
                      : currentStep
                    return (
                      <div className="sm:hidden pb-3.5 mb-1 border-b border-navy/5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-navy text-white text-base font-bold flex items-center justify-center shrink-0 shadow-md">
                              {displayStep}
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block leading-tight">
                                STEP {displayStep} OF {totalSteps}
                              </span>
                              <h2 className="text-base font-extrabold text-navy truncate block mt-0.5 leading-tight">
                                {currentStep === 1 && 'Location & Experience'}
                                {currentStep === 2 && 'Participant Details'}
                                {currentStep === 3 && 'Programs'}
                                {currentStep === 4 && 'Contact & Details'}
                              </h2>
                              <p className="text-[11px] font-medium text-navy/60 truncate mt-0.5 leading-tight">
                                {currentStep === 1 && 'Where, what, and when would you like to book?'}
                                {currentStep === 2 && 'Add names and diving levels for your group'}
                                {currentStep === 3 && 'Choose your preferred dive or course program'}
                                {currentStep === 4 && 'Please provide your contact information'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 pl-1">
                            {(isDirect ? [1, 4] : initialFromService ? [1, 2, 4] : [1, 2, 3, 4]).map((s) => (
                              <span
                                key={s}
                                className={`h-2 rounded-full transition-all duration-300 ${currentStep === s
                                    ? 'w-7 bg-navy'
                                    : currentStep > s
                                      ? 'w-2 bg-navy'
                                      : 'w-2 bg-slate-300'
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })()}

                  {/* STEP 1: Location, Experience & Date */}
                  {currentStep === 1 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3.5 sm:space-y-6">
                      {/* Desktop Step 1 Header */}
                      <div className="hidden sm:block">
                        <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-accent mb-0.5 block">
                          Step 1 of {((!experience && Boolean(selectedAddOn)) || isDirectActivity(experience)) ? 2 : 4}
                        </span>
                        <h3 className="font-heading text-lg sm:text-3xl font-bold text-navy">Location & Experience</h3>
                        <p className="text-[10px] sm:text-xs text-navy/60 mt-0.5">Where, what, and when would you like to book?</p>
                      </div>

                      {/* 1. SELECT DIVE COUNTRY */}
                      <div>
                        <label className="mb-1 sm:mb-2 block text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">
                          Select Dive Country
                        </label>
                        <div className="relative">
                          <select
                            value={country}
                            onChange={(e) => handleCountryChange(e.target.value)}
                            required
                            className="w-full rounded-lg sm:rounded-2xl bg-[#F0F2F5] px-3 py-2 sm:px-5 sm:py-4 pr-8 sm:pr-10 text-[11px] sm:text-sm font-semibold sm:font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition cursor-pointer appearance-none"
                          >
                            <option value="">Select a country</option>
                            {countries.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-navy/60">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* 2. SELECT ISLAND / REGION */}
                      <div>
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <label className="block text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">
                            Select Island / Region
                          </label>
                          {country && availableIslands.length > 0 && (
                            <span className="text-[9px] sm:text-[10px] font-semibold text-navy/50">
                              {availableIslands.length} {availableIslands.length === 1 ? 'island' : 'islands'}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <select
                            value={island}
                            onChange={(e) => handleIslandChange(e.target.value)}
                            disabled={!country}
                            required
                            className={`w-full rounded-lg sm:rounded-2xl bg-[#F0F2F5] px-3 py-2 sm:px-5 sm:py-4 pr-8 sm:pr-10 text-[11px] sm:text-sm font-semibold sm:font-bold outline-none focus:ring-2 focus:ring-accent/50 transition cursor-pointer appearance-none ${
                              !country ? 'opacity-60 cursor-not-allowed text-navy/40' : !island ? 'text-navy/50' : 'text-navy'
                            }`}
                          >
                            <option value="">
                              {!country
                                ? 'Select a country first'
                                : availableIslands.length === 0
                                ? (allDiveSites.length === 0 ? 'Loading islands...' : 'No specific islands listed')
                                : 'Select an island / region'}
                            </option>
                            {availableIslands.map((isl) => (
                              <option key={isl.name} value={isl.name}>
                                {isl.name} ({isl.count} {isl.count === 1 ? 'site' : 'sites'})
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-navy/60">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* 3. SELECT DIVE SITE */}
                      <div>
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <label className="block text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">
                            Select Dive Site
                          </label>
                          {island && availableSitesForIsland.length > 0 && (
                            <span className="text-[9px] sm:text-[10px] font-semibold text-navy/50">
                              {availableSitesForIsland.length} {availableSitesForIsland.length === 1 ? 'site' : 'sites'}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <select
                            value={location}
                            onChange={(e) => handleSiteChange(e.target.value)}
                            disabled={!country || (!island && availableIslands.length > 0)}
                            required
                            className={`w-full rounded-lg sm:rounded-2xl bg-[#F0F2F5] px-3 py-2 sm:px-5 sm:py-4 pr-8 sm:pr-10 text-[11px] sm:text-sm font-semibold sm:font-bold outline-none focus:ring-2 focus:ring-accent/50 transition cursor-pointer appearance-none ${
                              !country || (!island && availableIslands.length > 0)
                                ? 'opacity-60 cursor-not-allowed text-navy/40'
                                : !location
                                ? 'text-navy/50'
                                : 'text-navy'
                            }`}
                          >
                            <option value="">
                              {!country
                                ? 'Select a country first'
                                : !island && availableIslands.length > 0
                                ? 'Select an island / region first'
                                : availableSitesForIsland.length === 0
                                ? 'No dive sites listed for this selection'
                                : `Select a Dive Site (${availableSitesForIsland.length} available)`}
                            </option>
                            {/* Retain selected site if picked from map or search params */}
                            {location && !availableSitesForIsland.some((s) => s.siteName === location) && (
                              <option value={location}>{location}</option>
                            )}
                            {availableSitesForIsland.map((site) => (
                              <option key={site.id || site.siteName} value={site.siteName}>
                                {site.siteName}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-navy/60">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </div>
                        </div>

                        {/* Selected site indicator pill */}
                        {location && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] sm:text-xs">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-bold text-navy">{location}</span>
                            {island && <span className="text-navy/50">in {island}</span>}
                          </div>
                        )}
                      </div>

                      {/* 3. SELECT YOUR EXPERIENCE */}
                      <div>
                        <label className="mb-2 block text-xs font-bold text-navy/70 uppercase tracking-wider">
                          Select Your Experience
                        </label>
                        <div className="relative">
                          <select
                            value={experience}
                            onChange={(e) => handleExperienceChange(e.target.value)}
                            className={`w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 pr-10 text-sm font-bold outline-none focus:ring-2 focus:ring-accent/50 transition cursor-pointer appearance-none ${!experience ? 'text-navy/40' : 'text-navy'
                              }`}
                          >
                            <option value="">
                              Select Your Experience
                            </option>
                            {EXPERIENCE_OPTIONS.map((exp) => (
                              <option key={exp} value={exp}>
                                {exp}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-navy/60">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* 4. SELECT YOUR ADD ONS */}
                      <div>
                        <label className="mb-2 block text-xs font-bold text-navy/70 uppercase tracking-wider">
                          SELECT YOUR ADD ONS
                        </label>
                        <div className="relative">
                          <select
                            value={selectedAddOn}
                            onChange={(e) => handleAddOnChange(e.target.value)}
                            className={`w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 pr-10 text-sm font-bold outline-none focus:ring-2 focus:ring-accent/50 transition cursor-pointer appearance-none ${!selectedAddOn ? 'text-navy/40' : 'text-navy'
                              }`}
                          >
                            <option value="">
                              Select Your Add Ons
                            </option>
                            {ADD_ON_OPTIONS.map((addOn) => (
                              <option key={addOn} value={addOn}>
                                {addOn}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-navy/60">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* 5. PREFERRED DATE & NUMBER OF PEOPLE */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="relative">
                          <label className="mb-2 block text-xs font-bold text-navy/70 uppercase tracking-wider">
                            Preferred Date
                          </label>
                          <button
                            type="button"
                            ref={datePickerBtnRef}
                            onClick={() => setIsCalendarOpen((prev) => !prev)}
                            className={`w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 text-sm font-bold text-navy outline-none text-left flex items-center justify-between transition cursor-pointer focus:ring-2 ${dateError ? 'border-2 border-red-500 focus:ring-red-300' : 'focus:ring-accent/50'
                              }`}
                          >
                            <span className={date ? 'text-navy' : 'text-navy/40'}>
                              {date ? formatDateToDDMMYYYY(date) : 'dd-mm-yyyy'}
                            </span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy/60 shrink-0">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                          </button>

                          <CompactTwoMonthCalendarPopover
                            isOpen={isCalendarOpen}
                            onClose={() => setIsCalendarOpen(false)}
                            selectedDate={date}
                            onSelectDate={(formattedDDMMYYYY, yyyyMmDd) => {
                              setDate(yyyyMmDd)
                              if (yyyyMmDd && (yyyyMmDd < cooldownMinDateStr || yyyyMmDd > maxDateStr)) {
                                setDateError('Please select a date after the 7-day advance booking period.')
                              } else {
                                setDateError('')
                                setStepError('')
                              }
                              setIsCalendarOpen(false)
                            }}
                            minDate={cooldownMinDateStr}
                            maxDate={maxDateStr}
                            toggleBtnRef={datePickerBtnRef}
                          />

                          {dateError && (
                            <p className="mt-1 text-xs font-bold text-red-500 flex items-center gap-1.5">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                              <span>{dateError}</span>
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-bold text-navy/70 uppercase tracking-wider">
                            Number of Persons
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={groupSize}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, '')
                              setGroupSize(raw)
                              setStepError('')
                            }}
                            onBlur={() => {
                              const val = parseInt(groupSize, 10)
                              if (isNaN(val) || val < 1) {
                                setGroupSize(1)
                              } else if (val > 20) {
                                setGroupSize(20)
                              } else {
                                setGroupSize(val)
                              }
                            }}
                            placeholder="1"
                            required
                            className="w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition"
                          />
                        </div>
                      </div>
                  </motion.div>
                )}

                {/* STEP 2: Name, Age & Certification Eligibility for Each Person */}
                {currentStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3.5 sm:space-y-6">
                    <div className="hidden sm:block">
                      <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-accent mb-0.5 block">Step 2 of 4</span>
                      <h3 className="font-heading text-lg sm:text-3xl font-bold text-navy">Participant Details</h3>
                      <p className="text-[10px] sm:text-xs text-navy/60 mt-0.5">Enter age and prior certification level for each person for {experience}.</p>
                    </div>

                    <div data-lenis-prevent className="space-y-3 sm:space-y-6 max-h-[500px] sm:max-h-[550px] overflow-y-auto overscroll-contain pr-1">
                      {participants.map((p, idx) => {
                        const ageNum = parseInt(p.age, 10)
                        const isAgeValid = !isNaN(ageNum) && ageNum >= 8 && ageNum <= 110
                        const eligibleCourses = isAgeValid ? getEligibleCourses(p.age, p.hasCertification, p.certifications, experience) : []
                        const availableCertOptions = sortCoursesByDifficulty(
                          getAvailableCertificationsForAge(p.age, experience)
                        )

                        return (
                          <div key={p.id} className="rounded-xl sm:rounded-3xl bg-[#FAFAFA] border border-navy/10 p-3 sm:p-6 space-y-2.5 sm:space-y-5">
                            <div className="flex justify-between items-center border-b border-navy/5 pb-2 sm:pb-3">
                              <span className="font-heading font-bold text-navy text-xs sm:text-lg">
                                Person {idx + 1} Details
                              </span>
                              <span className="text-[8px] sm:text-[11px] text-navy/50 font-bold uppercase tracking-wider">
                                Participant #{idx + 1}
                              </span>
                            </div>

                            {/* Name and Age Inputs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                              <div>
                                <label className="mb-1 sm:mb-2 block text-[9px] sm:text-xs font-bold text-navy/70">Full Name</label>
                                <input
                                  type="text"
                                  placeholder={`Name of Person ${idx + 1}`}
                                  value={p.name}
                                  onChange={(e) => handleParticipantChange(idx, 'name', e.target.value)}
                                  required
                                  className="w-full rounded-lg sm:rounded-2xl bg-white border border-navy/10 px-2.5 py-1.5 sm:px-4 sm:py-3.5 text-[11px] sm:text-sm placeholder:text-[10px] sm:placeholder:text-sm font-semibold sm:font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition"
                                />
                              </div>

                              <div>
                                <label className="mb-1 sm:mb-2 block text-[9px] sm:text-xs font-bold text-navy/70">Age (Years)</label>
                                <input
                                  type="number"
                                  min="8"
                                  max="110"
                                  placeholder="e.g. 12"
                                  value={p.age}
                                  onChange={(e) => {
                                    let rawVal = e.target.value
                                    if (rawVal !== '') {
                                      const parsed = parseInt(rawVal, 10)
                                      if (!isNaN(parsed) && parsed > 110) {
                                        rawVal = '110'
                                      }
                                    }
                                    handleParticipantChange(idx, 'age', rawVal)
                                  }}
                                  required
                                  className="w-full rounded-lg sm:rounded-2xl bg-white border border-navy/10 px-2.5 py-1.5 sm:px-4 sm:py-3.5 text-[11px] sm:text-sm placeholder:text-[10px] sm:placeholder:text-sm font-semibold sm:font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition"
                                />
                              </div>
                            </div>

                            {/* Before age is entered */}
                            {p.age === '' && (
                              <div className="rounded-lg sm:rounded-2xl bg-navy/[0.03] border border-navy/10 p-2.5 sm:p-4 text-[10px] sm:text-xs font-medium text-navy/70 flex items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-navy/50"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                                <span>Enter age to see available programs.</span>
                              </div>
                            )}

                            {/* Invalid age notice */}
                            {p.age !== '' && !isAgeValid && (
                              <div className="rounded-lg sm:rounded-2xl bg-red-50 border border-red-200 p-2.5 sm:p-4 text-[10px] sm:text-xs font-medium text-red-600 flex items-start gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-red-600 mt-0.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                                <div>
                                  <span className="font-bold block mb-0.5">
                                    {ageNum < 8 ? 'Minimum Age Requirement (8 Years)' : 'Maximum Age Limit (110 Years)'}
                                  </span>
                                  <span>
                                    {ageNum < 8
                                      ? 'The minimum age for participating in activities is 8 years old.'
                                      : 'Please enter a valid age up to 110 years.'}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Once Age is Valid: Certification Choice */}
                            {isAgeValid && (
                              <div className="space-y-2.5 pt-1">
                                {availableCertOptions.length > 0 && (
                                  <>
                                    <div>
                                      <label className="mb-1.5 block text-[9px] sm:text-xs font-bold text-navy/80 uppercase tracking-wider">
                                        Do you already have a certification?
                                      </label>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                        <button
                                          type="button"
                                          onClick={() => handleParticipantChange(idx, 'hasCertification', false)}
                                          className={`p-2.5 sm:p-4 rounded-lg sm:rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${!p.hasCertification
                                            ? 'bg-navy text-white border-navy shadow-sm'
                                            : 'bg-white text-navy border-navy/15 hover:border-navy/30'
                                            }`}
                                        >
                                          <div>
                                            <span className="font-bold text-[11px] sm:text-sm block">No, I don't have a certification</span>
                                            <span className={`text-[9px] sm:text-[11px] block mt-0.5 ${!p.hasCertification ? 'text-white/70' : 'text-navy/50'}`}>
                                              {ageNum < 10 ? 'Introductory & Beginner options' : 'Beginner & Entry Level options'}
                                            </span>
                                          </div>
                                          <div className={`w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 ${!p.hasCertification ? 'border-white bg-white text-navy' : 'border-navy/20'
                                            }`}>
                                            {!p.hasCertification && <span className="text-[8px] sm:text-[10px] font-bold">✓</span>}
                                          </div>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleParticipantChange(idx, 'hasCertification', true)}
                                          className={`p-2.5 sm:p-4 rounded-lg sm:rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${p.hasCertification
                                            ? 'bg-navy text-white border-navy shadow-sm'
                                            : 'bg-white text-navy border-navy/15 hover:border-navy/30'
                                            }`}
                                        >
                                          <div>
                                            <span className="font-bold text-[11px] sm:text-sm block">
                                              {ageNum < 10 ? 'Yes, I have prior experience' : 'Yes, I have a certification'}
                                            </span>
                                            <span className={`text-[9px] sm:text-[11px] block mt-0.5 ${p.hasCertification ? 'text-white/70' : 'text-navy/50'}`}>
                                              {ageNum < 10 ? 'Select completed youth programs' : 'Advanced, Specialties & Continuing Ed'}
                                            </span>
                                          </div>
                                          <div className={`w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 ${p.hasCertification ? 'border-white bg-white text-navy' : 'border-navy/20'
                                            }`}>
                                            {p.hasCertification && <span className="text-[8px] sm:text-[10px] font-bold">✓</span>}
                                          </div>
                                        </button>
                                      </div>
                                    </div>

                                    {/* If Certified: Options (MULTI SELECT) */}
                                    {p.hasCertification && (
                                      <div className="space-y-1.5 pt-1">
                                        <label className="block text-[9px] sm:text-xs font-bold text-navy/80 uppercase tracking-wider">
                                          Which certification(s) do you currently have?
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                                          {availableCertOptions.map((opt) => {
                                            const isSelected = (p.certifications || []).includes(opt.id)
                                            return (
                                              <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => handleSelectCertification(idx, opt.id)}
                                                className={`p-2 sm:p-3 rounded-lg border text-left text-[10px] sm:text-xs font-semibold sm:font-bold transition flex items-center justify-between gap-1.5 ${isSelected
                                                  ? 'bg-navy text-white border-navy shadow-sm'
                                                  : 'bg-white text-navy/80 border-navy/10 hover:border-navy/30 hover:bg-navy/[0.02]'
                                                  }`}
                                              >
                                                <span className="truncate">{getCourseDisplayName(opt.name)}</span>
                                                <span className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border flex items-center justify-center shrink-0 text-[8px] sm:text-[10px] ${isSelected ? 'bg-white text-navy border-white font-bold' : 'border-navy/20'
                                                  }`}>
                                                  {isSelected ? '✓' : ''}
                                                </span>
                                              </button>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}

                                {/* Dynamic Eligibility Badge */}
                                <div className="rounded-lg sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-2 sm:p-3.5 text-[10px] sm:text-xs text-emerald-800 font-medium flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5 sm:gap-2">
                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                                    <span>
                                      {eligibleCourses.length} course(s) unlocked for age {p.age}
                                    </span>
                                  </div>
                                  <span className="font-bold text-[9px] sm:text-[11px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/15">
                                    {eligibleCourses.length} Available
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Matching Programs Selection */}
                {currentStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3.5 sm:space-y-6">
                    <div className="hidden sm:block">
                      <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-accent mb-0.5 block">Step 3 of 4</span>
                      <h3 className="font-heading text-lg sm:text-3xl font-bold text-navy">Eligible Programs & Courses</h3>
                      <p className="text-[10px] sm:text-xs text-navy/60 mt-0.5">Select a program for each person for {experience}.</p>
                    </div>

                    <div data-lenis-prevent className="space-y-3.5 sm:space-y-8 max-h-[500px] sm:max-h-[550px] overflow-y-auto overscroll-contain pr-1">
                      {participants.map((p, idx) => {
                        const eligible = sortCoursesByDifficulty(
                          getRecommendedCourses(p.age, p.hasCertification, p.certifications, experience)
                        )
                        const certNames = (p.certifications || [])
                          .map((id) => CERTIFICATION_OPTIONS.find((c) => c.id === id)?.name)
                          .filter(Boolean)
                        const certSummary = p.hasCertification
                          ? (certNames.length ? certNames.join(', ') : 'Certified Diver')
                          : 'Beginner / Pathway'

                        return (
                          <div key={p.id} className="rounded-xl sm:rounded-3xl bg-[#FAFAFA] border border-navy/10 p-3 sm:p-6 space-y-2.5 sm:space-y-5">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 border-b border-navy/10 pb-2.5 sm:pb-4">
                              <div>
                                <h4 className="font-heading font-bold text-navy text-sm sm:text-xl">
                                  {p.name || `Person ${idx + 1}`}
                                </h4>
                                <p className="text-[10px] sm:text-xs text-navy/60 mt-0.5">
                                  Age: <span className="font-bold text-navy">{p.age || 'N/A'}</span> • Cert: <span className="font-bold text-navy">{certSummary}</span>
                                </p>
                              </div>
                              <span className="text-[9px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-navy/[0.06] text-navy border border-navy/10">
                                {eligible.length} Suggested Program(s)
                              </span>
                            </div>

                            {eligible.length === 0 ? (
                              <div className="rounded-lg sm:rounded-2xl bg-navy/[0.04] border border-navy/10 p-3 sm:p-4 text-[10px] sm:text-xs font-medium text-navy/80 flex items-start gap-2">
                                <span>No eligible programs found for this age and experience level.</span>
                              </div>
                            ) : (
                              <div className="space-y-2.5">
                                <div className="flex justify-between items-center">
                                  <label htmlFor={`select-program-${p.id}`} className="text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">
                                    Choose Suggested Program
                                  </label>
                                  <span className="text-[9px] sm:text-[11px] text-navy/50 font-medium">Tap any card below</span>
                                </div>

                                {/* Accessible Native Select Dropdown */}
                                <div className="relative">
                                  <select
                                    id={`select-program-${p.id}`}
                                    value={p.selectedProgram}
                                    onChange={(e) => handleParticipantChange(idx, 'selectedProgram', e.target.value)}
                                    required={eligible.length > 0}
                                    aria-label={`Select program for ${p.name || `Person ${idx + 1}`}`}
                                    className="w-full rounded-lg sm:rounded-2xl bg-white border border-navy/10 px-2.5 py-2 sm:px-4 sm:py-3.5 text-[11px] sm:text-sm font-semibold sm:font-bold text-navy outline-none focus:ring-2 focus:ring-navy/20 transition appearance-none shadow-sm cursor-pointer pr-8"
                                  >
                                    <option value="" disabled>Select an eligible course...</option>
                                    {eligible.map((prog) => (
                                      <option key={prog.id} value={prog.id}>
                                        {getCourseDisplayName(prog.name)} [{prog.category}] (Age {prog.minimumAge}+) — {prog.certLabel}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-navy/40">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                                  </div>
                                </div>

                                {/* Interactive Program Cards Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1">
                                  {eligible.map((prog) => {
                                    const isSelected = p.selectedProgram === prog.id
                                    return (
                                      <div
                                        key={prog.id}
                                        onClick={() => handleParticipantChange(idx, 'selectedProgram', prog.id)}
                                        className={`rounded-lg sm:rounded-2xl p-2.5 sm:p-4 border transition-all cursor-pointer flex flex-col justify-between gap-1.5 sm:gap-3 ${isSelected
                                          ? 'bg-navy text-white border-navy shadow-md ring-1 ring-navy'
                                          : 'bg-white text-navy border-navy/10 hover:border-navy/30 hover:bg-navy/[0.02]'
                                          }`}
                                      >
                                        <div className="flex justify-between items-start gap-1.5">
                                          <div>
                                            <span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-widest block mb-0.5 ${isSelected ? 'text-cyan-300' : 'text-navy/50'
                                              }`}>
                                              {prog.category}
                                            </span>
                                            <h5 className="font-heading font-bold text-[11px] sm:text-base leading-snug">
                                              {getCourseDisplayName(prog.name)}
                                            </h5>
                                          </div>
                                          <div className={`w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border shrink-0 flex items-center justify-center mt-0.5 ${isSelected ? 'border-white bg-white text-navy' : 'border-navy/20 bg-transparent'
                                            }`}>
                                            {isSelected && <span className="text-[8px] sm:text-[10px] font-bold">✓</span>}
                                          </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1 pt-1 text-[8px] sm:text-[10px]">
                                          <span className={`px-1.5 py-0.5 rounded-full font-semibold ${isSelected ? 'bg-white/10 text-white/90' : 'bg-navy/[0.05] text-navy/70'
                                            }`}>
                                            Age {prog.minimumAge}+
                                          </span>
                                          <span className={`truncate max-w-[120px] sm:max-w-[170px] ${isSelected ? 'text-white/70' : 'text-navy/50'
                                            }`}>
                                            Prereq: {prog.certLabel}
                                          </span>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                                {['fun-day-dive', 'fun-dawn-dive', 'fun-night-dive'].includes(p.selectedProgram) && (
                                  <div className="mt-3.5 pt-3.5 border-t border-navy/5">
                                    <label className="text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider mb-2 block">
                                      Select Number of Dives
                                    </label>
                                    <div className="relative">
                                      <select
                                        value={p.funDivesCount || ''}
                                        onChange={(e) => handleParticipantChange(idx, 'funDivesCount', e.target.value)}
                                        required
                                        className="w-full rounded-lg sm:rounded-2xl bg-[#F0F2F5] border border-navy/5 px-2.5 py-2 sm:px-4 sm:py-3.5 text-[11px] sm:text-sm font-semibold sm:font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition appearance-none shadow-inner cursor-pointer pr-8"
                                      >
                                        <option value="" disabled>Choose your dive package...</option>
                                        {FUN_DIVES_PACKAGES.map(pkg => (
                                          <option key={pkg.id} value={pkg.id}>{pkg.title} - {pkg.duration}</option>
                                        ))}
                                      </select>
                                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-navy/50">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Contact Details & Special Requests */}
                {currentStep === 4 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3.5 sm:space-y-6">
                    <div className="hidden sm:block">
                      <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-accent mb-0.5 block">
                        Step {((!experience && Boolean(selectedAddOn)) || isDirectActivity(experience)) ? 2 : 4} of {((!experience && Boolean(selectedAddOn)) || isDirectActivity(experience)) ? 2 : 4}
                      </span>
                      <h3 className="font-heading text-lg sm:text-3xl font-bold text-navy">Contact & Booking Details</h3>
                      <p className="text-[10px] sm:text-xs text-navy/60 mt-0.5">Please provide your contact information to finalize the booking request.</p>
                    </div>

                    <div>
                      <label className="mb-1 sm:mb-2 block text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">Primary Contact Name</label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={contact.name}
                        onChange={(e) => setContact((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full rounded-lg sm:rounded-2xl bg-[#F0F2F5] px-3 py-2 sm:px-5 sm:py-4 text-[11px] sm:text-sm placeholder:text-[10px] sm:placeholder:text-sm font-semibold sm:font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition placeholder:text-navy/30"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                      <div>
                        <label className="mb-1 sm:mb-2 block text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={contact.email}
                          onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
                          required
                          className="w-full rounded-lg sm:rounded-2xl bg-[#F0F2F5] px-3 py-2 sm:px-5 sm:py-4 text-[11px] sm:text-sm placeholder:text-[10px] sm:placeholder:text-sm font-semibold sm:font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition placeholder:text-navy/30"
                        />
                      </div>

                      <div>
                        <label className="mb-1 sm:mb-2 block text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">Phone Number</label>
                        <div className="w-full rounded-lg sm:rounded-2xl bg-[#F0F2F5] px-3 py-2 sm:px-5 sm:py-3.5 focus-within:ring-2 focus-within:ring-accent/50 transition">
                          <PhoneInput
                            flags={flags}
                            defaultCountry="IN"
                            international
                            withCountryCallingCode
                            placeholder="Enter phone number"
                            value={contact.phone}
                            onChange={(value) => setContact((prev) => ({ ...prev, phone: value || '' }))}
                            className="w-full text-[11px] sm:text-sm font-semibold sm:font-bold text-navy outline-none placeholder:text-navy/30"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 sm:mb-2 block text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">Special Requests / Notes</label>
                      <textarea
                        placeholder="Any medical conditions, dietary preferences, gear sizes, or custom requests?"
                        value={contact.requests}
                        onChange={(e) => setContact((prev) => ({ ...prev, requests: e.target.value }))}
                        rows="3"
                        className="w-full rounded-lg sm:rounded-2xl bg-[#F0F2F5] px-3 py-2 sm:px-5 sm:py-4 text-[11px] sm:text-sm placeholder:text-[10px] sm:placeholder:text-sm font-semibold sm:font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition placeholder:text-navy/30 resize-y"
                      ></textarea>
                    </div>
                  </motion.div>
                )}

            </div>

            {/* Inline Step Error Message */}
            {stepError && (
              <div className="mt-3 p-2.5 sm:p-3.5 rounded-lg sm:rounded-2xl bg-red-50 border border-red-200 text-red-600 text-[11px] sm:text-xs font-bold flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-red-600"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                <span>{stepError}</span>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="pt-3.5 sm:pt-6 mt-3.5 sm:mt-6 border-t border-navy/5 flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="rounded-full px-3.5 py-2 sm:px-6 sm:py-3.5 text-[11px] sm:text-sm font-bold text-navy hover:bg-[#F0F2F5] active:scale-95 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>← Back</span>
                </button>
              ) : <div />}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="rounded-full bg-navy hover:!bg-accent hover:!text-navy active:scale-95 px-4 py-2 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold text-white transition-all duration-200 shadow-md ml-auto cursor-pointer flex items-center gap-2"
                >
                  <span>Continue →</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-accent hover:!bg-navy hover:!text-white px-4 py-2 sm:px-8 sm:py-4 text-xs sm:text-sm font-extrabold text-[#001e3d] transition-all duration-200 shadow-md ml-auto cursor-pointer border border-[#FFCD00] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-navy border-t-transparent rounded-full animate-spin inline-block" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <span>Confirm Booking Request</span>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Column 2: Interactive 2D Worldwide Dive Map (Beside Booking Form on Desktop, Directly Below on Mobile) */}
      <div id="dive-explorer-map" data-lenis-prevent="true" className="lg:col-span-6 xl:col-span-7 w-full min-w-0 lg:sticky lg:top-28 self-start mt-6 sm:mt-10 lg:mt-0">
        <DiveExplorerMap
          onSelectSite={handleMapSelectSite}
          onBookSite={handleMapSelectSite}
          onSelectCountry={handleMapSelectCountry}
          selectedCountry={country}
          selectedIsland={island}
          selectedSite={location}
          selectedSiteId={locationId}
          title="Dive Explorer"
          subtitle="Explore 3,500+ worldwide dive sites on this interactive 2D map. Click any site to auto-fill your booking location!"
          showHeading={true}
        />
      </div>

    </div>
    </div >
  </div >
  )
}

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
