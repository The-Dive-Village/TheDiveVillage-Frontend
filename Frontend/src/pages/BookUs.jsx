import { useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense } from 'react'
import { useSearchParams } from 'react-router'
import { motion } from 'framer-motion'
const InteractiveDiveMap = lazy(() => import('../components/InteractiveDiveMap'))
import CompactTwoMonthCalendarPopover from '../components/CompactTwoMonthCalendarPopover'
import SEOHead from '../components/SEOHead'
import { diveSiteService, normalizeCountryKey } from '../services/diveSiteService'
import { getDiveSiteCreatureInfo } from '../data/diveSiteImages'
import { bookingService } from '../services/bookingService'
import {
  COURSE_CATALOG,
  CERTIFICATION_OPTIONS,
  getEligibleCourses,
  getAvailableCertificationsForAge,
  validateParticipantBooking,
} from '../utils/courseEligibility'
import { triggerHaptic, triggerSuccessHaptic, triggerErrorHaptic } from '../utils/haptics'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import turtleAnnaVideo from '../assets/New folder/Turtle Anna.mp4'
import compiledNightDiveVideoLocal from '../assets/Compiled Night Dive Video(2).mp4'
const compiledNightDiveVideo = 'https://res.cloudinary.com/bbgt5nk7/video/upload/v1790244122/dive-village/ui-videos/compiled_night_dive_video_2_mp4.mp4'
import useNightDive from '../hooks/useNightDive'

// Backwards-compatible export alias for any legacy imports
export const PROGRAMS_CATALOG = COURSE_CATALOG

export default function BookUs() {
  const isNightDive = useNightDive()
  const [searchParams] = useSearchParams()
  const initialProgram = searchParams.get('program') || ''

  const [currentStep, setCurrentStep] = useState(1)

  // Today & 1 year max date bounds
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])
  const maxDateStr = useMemo(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 1)
    return d.toISOString().split('T')[0]
  }, [])

  // Step 1: Country, Location, Date & Group Size
  const [country, setCountry] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [locationId, setLocationId] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [dateError, setDateError] = useState('')
  const [stepError, setStepError] = useState('')
  const [groupSize, setGroupSize] = useState(1)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const datePickerBtnRef = useRef(null)

  const countryRequestVersionRef = useRef(0)

  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return ''
    const parts = dateStr.split('-')
    if (parts.length !== 3) return dateStr
    const [year, month, day] = parts
    return `${day}-${month}-${year}`
  }

  // Derived PADI dataset lookups
  const countries = useMemo(() => diveSiteService.getCountries(), [])
  const [availableLocations, setAvailableLocations] = useState([])
  const [isLocationsLoading, setIsLocationsLoading] = useState(false)

  // Asynchronous location data resolution on country change with atomic transaction version check
  useEffect(() => {
    const currentVersion = ++countryRequestVersionRef.current
    const requestedCountryKey = normalizeCountryKey(country)

    if (!country) {
      setAvailableLocations([])
      setIsLocationsLoading(false)
      return
    }

    setIsLocationsLoading(true)
    diveSiteService
      .getLocationsByCountry(country)
      .then((locs) => {
        if (
          currentVersion === countryRequestVersionRef.current &&
          normalizeCountryKey(country) === requestedCountryKey
        ) {
          setAvailableLocations(locs || [])
          setIsLocationsLoading(false)
        }
      })
      .catch(() => {
        if (
          currentVersion === countryRequestVersionRef.current &&
          normalizeCountryKey(country) === requestedCountryKey
        ) {
          setAvailableLocations([])
          setIsLocationsLoading(false)
        }
      })
  }, [country])

  // Step 1 Handlers
  const handleCountryChange = (newCountry) => {
    setCountry(newCountry)
    setSelectedLocation(null)
    setLocationId('')
    setLocation('')
    setStepError('')
  }

  const handleLocationChange = (newLocationId) => {
    setLocationId(newLocationId)
    const found = availableLocations.find(
      (l) => String(l.id) === String(newLocationId)
    )
    if (found) {
      setSelectedLocation(found)
      const placeName = diveSiteService.getLocationDisplayName(found)
      setLocation(placeName || found.title || found.name)
    } else {
      setSelectedLocation(null)
      setLocation('')
    }
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
      selectedProgram: initialProgram || ''
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
          selectedProgram: ''
        }))
        return [...prev, ...extra]
      }
      return prev.slice(0, count)
    })
  }, [groupSize])

  const handleParticipantChange = (index, field, value) => {
    setParticipants((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }

      // If hasCertification is toggled to false, clear selected certifications
      if (field === 'hasCertification' && !value) {
        updated[index].certifications = []
      }

      // Reset selected program and certification state if age, hasCertification, or certifications change
      if (field === 'age' || field === 'hasCertification' || field === 'certifications') {
        const p = updated[index]
        const ageNum = parseInt(p.age, 10)
        if (isNaN(ageNum) || ageNum < 8 || ageNum > 110) {
          updated[index].hasCertification = false
          updated[index].certifications = []
          updated[index].selectedProgram = ''
        } else {
          // Remove any certifications/experiences that are age-inappropriate for the new age
          const validCertsForAge = (updated[index].certifications || []).filter((certId) => {
            const opt = CERTIFICATION_OPTIONS.find((c) => c.id === certId)
            return opt && ageNum >= opt.minAgeToHold && (!opt.maxAgeToHold || ageNum <= opt.maxAgeToHold)
          })
          updated[index].certifications = validCertsForAge

          const availableCertOpts = getAvailableCertificationsForAge(ageNum)
          if (availableCertOpts.length === 0) {
            updated[index].hasCertification = false
          }

          const eligible = getEligibleCourses(p.age, updated[index].hasCertification, updated[index].certifications)
          const isCurrentEligible = eligible.some((course) => course.id === p.selectedProgram)
          if (!isCurrentEligible) {
            updated[index].selectedProgram = eligible[0]?.id || ''
          }
        }
      }
      return updated
    })
  }

  const handleToggleCertification = (index, certId) => {
    setParticipants((prev) => {
      const updated = [...prev]
      const currentCerts = updated[index].certifications || []
      const newCerts = currentCerts.includes(certId)
        ? currentCerts.filter((c) => c !== certId)
        : [...currentCerts, certId]

      updated[index] = {
        ...updated[index],
        hasCertification: newCerts.length > 0 || updated[index].hasCertification,
        certifications: newCerts
      }

      const p = updated[index]
      const eligible = getEligibleCourses(p.age, p.hasCertification, p.certifications)
      const isCurrentEligible = eligible.some((course) => course.id === p.selectedProgram)
      if (!isCurrentEligible) {
        updated[index].selectedProgram = eligible[0]?.id || ''
      }
      return updated
    })
  }

  const handlePrevStep = useCallback(() => {
    if (currentStep > 1) {
      triggerHaptic(8)
      setStepError('')
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const handleNextStep = useCallback(() => {
    if (currentStep === 1) {
      if (!country) {
        triggerErrorHaptic()
        setStepError('Please select a dive country.')
        return false
      }
      if (!locationId && !selectedLocation && !location) {
        triggerErrorHaptic()
        setStepError('Please select a dive location.')
        return false
      }
      if (!date || date < todayStr || date > maxDateStr) {
        triggerErrorHaptic()
        setDateError('Please Select a Proper Date')
        setStepError('Please select a valid date for your dive.')
        return false
      }
      if (!groupSize || parseInt(groupSize, 10) < 1) {
        triggerErrorHaptic()
        setStepError('Please enter a valid number of participants (minimum 1).')
        return false
      }
      setDateError('')
      setStepError('')
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
        setStepError('Minimum age for participating in diving activities is 8 years. Participants under 8 cannot proceed.')
        return false
      }
      setStepError('')
    }
    if (currentStep === 3) {
      const hasUnselected = participants.some((p) => !p.selectedProgram)
      if (hasUnselected) {
        triggerErrorHaptic()
        setStepError('Please select an eligible program for each participant.')
        return false
      }
      for (const p of participants) {
        const val = validateParticipantBooking(p)
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
  }, [currentStep, country, locationId, selectedLocation, location, date, todayStr, maxDateStr, groupSize, participants])

  // Desktop keyboard step navigation (Enter to advance, Alt + Left Arrow to go back)
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

    // Pre-submission validation: Confirm every participant satisfies age & prerequisites
    for (const p of participants) {
      const validation = validateParticipantBooking(p)
      if (!validation.valid) {
        setStepError(validation.error || 'Participant eligibility validation failed.')
        setCurrentStep(2)
        return
      }
    }

    setIsSubmitting(true)
    setStepError('')

    try {
      const res = await bookingService.createBooking({
        country,
        locationId: locationId ? String(locationId) : null,
        location,
        date,
        groupSize: participants.length,
        contactName: contact.name,
        contactEmail: contact.email,
        contactPhone: contact.phone || null,
        specialRequests: contact.requests || null,
        participants,
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
    return (
      <div className="bg-[#FAFAFA] flex min-h-[80vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="rounded-[40px] bg-white p-10 sm:p-14 shadow-card max-w-xl w-full border border-navy/5">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckIcon />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy">Booking Request Received</h2>
          <p className="mt-3 text-navy/70 text-sm leading-relaxed">
            Thank you <span className="font-bold text-navy">{contact.name}</span>! We've reserved your spot for <span className="font-bold text-navy">{participants.length} participant(s)</span> at <span className="font-bold text-accent">{location}</span>.
          </p>

          <div className="my-8 rounded-3xl bg-[#F0F2F5] p-6 text-left space-y-4 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-navy/10 pb-3">
              <span className="text-navy/60 font-semibold">Location & Date:</span>
              <span className="font-bold text-navy">{location} {date ? `(${date})` : ''}</span>
            </div>
            <div className="space-y-2.5 pt-1">
              <span className="text-navy/60 font-semibold block">Participants & Selected Programs:</span>
              {participants.map((p, idx) => {
                const prog = COURSE_CATALOG.find((pr) => pr.id === p.selectedProgram)
                const certNames = (p.certifications || [])
                  .map((id) => CERTIFICATION_OPTIONS.find((c) => c.id === id)?.name)
                  .filter(Boolean)
                const certSummary = p.hasCertification
                  ? (certNames.length ? certNames.join(', ') : 'Certified Diver')
                  : 'No Prior Certification (Beginner / Pathway)'

                return (
                  <div key={idx} className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-navy/5">
                    <div>
                      <span className="font-bold text-navy block">{p.name || `Participant ${idx + 1}`}</span>
                      <span className="text-[11px] text-navy/50">Age: {p.age || 'N/A'} • {certSummary}</span>
                    </div>
                    <span className="font-bold text-accent text-xs bg-accent/10 px-3 py-1 rounded-full">
                      {prog?.name || 'Selected Course'}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between border-t border-navy/10 pt-3 text-xs">
              <span className="text-navy/60 font-semibold">Contact Email & Phone:</span>
              <span className="font-bold text-navy">{contact.email} ({contact.phone || 'N/A'})</span>
            </div>
          </div>

          <button
            onClick={() => {
              setSubmitted(false)
              setCurrentStep(1)
            }}
            className="rounded-full bg-navy px-8 py-4 text-sm font-bold text-white transition hover:bg-accent hover:text-navy w-full shadow-md"
          >
            Submit Another Booking
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen text-navy font-body overflow-x-hidden ${isNightDive ? 'bg-[#0b1726]' : 'bg-[#FAFAFA]'}`} style={{ textShadow: 'none' }}>
      <SEOHead
        title="Book Scuba Diving Courses & Expeditions Online | The Dive Village"
        description="Book certified scuba diving courses, Discovery dives, snorkeling trips, and freediving packages online with instant confirmation at The Dive Village."
        keywords="book scuba dive online, scuba course reservation, dive charter booking, snorkeling trip reservation, dive village booking"
        canonicalUrl="https://thedivevillage.com/book-us"
      />

      {/* 1. HEADER VIDEO HERO (DYNAMIC COMPILED NIGHT DIVE VIDEO) */}
      <section className="relative h-[56vh] min-h-[420px] lg:h-[60vh] lg:min-h-[460px] w-full flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%)'
          }}
        >
          <video
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
          className={`absolute bottom-0 inset-x-0 h-28 sm:h-36 lg:h-44 pointer-events-none z-[5] transition-colors duration-500 ${
            isNightDive 
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
            Select your location, group size, participant details, and matching programs. Our dive masters will get back to you.
          </motion.p>
        </div>
      </section>

      {/* 2. MAIN 4-STEP BOOKING WIZARD */}
      <div className="mx-auto max-w-7xl px-3 xs:px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-16 sm:pb-24 w-full min-w-0 max-w-full overflow-hidden">
        {/* Main 4-Step Layout */}
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 w-full min-w-0 max-w-full">

          {/* Form Wizard Column */}
          <div className="lg:col-span-7 flex flex-col w-full min-w-0 max-w-full mx-auto">

            {/* Step Indicator Bar - Mobile Compact Version */}
            <div className="sm:hidden flex items-center justify-between mb-3.5 bg-white/95 backdrop-blur-xl p-3 rounded-2xl border border-navy/10 shadow-sm w-full min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-sm">
                  {currentStep}
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-accent block leading-none">Step {currentStep} of 4</span>
                  <span className="text-xs font-bold text-navy truncate block mt-0.5">
                    {currentStep === 1 && 'Location & Group'}
                    {currentStep === 2 && 'Participant Details'}
                    {currentStep === 3 && 'Matching Programs'}
                    {currentStep === 4 && 'Contact Info'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentStep === s
                        ? 'w-5 bg-navy'
                        : currentStep > s
                        ? 'w-2 bg-emerald-500'
                        : 'w-2 bg-navy/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step Indicator Bar - Desktop Full Version */}
            <div className="hidden sm:flex items-center justify-between mb-8 bg-white/90 backdrop-blur-xl p-5 rounded-3xl border border-navy/10 shadow-sm overflow-x-auto scrollbar-none">
              {[
                { num: 1, title: 'Location & Group' },
                { num: 2, title: 'Participant Details' },
                { num: 3, title: 'Matching Programs' },
                { num: 4, title: 'Contact Info' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-2.5 shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === s.num
                    ? 'bg-navy text-white shadow-md ring-2 ring-navy/20'
                    : currentStep > s.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#F0F2F5] text-navy/50'
                    }`}>
                    {currentStep > s.num ? '✓' : s.num}
                  </div>
                  <span className={`text-xs font-bold whitespace-nowrap ${currentStep === s.num ? 'text-navy font-bold' : 'text-navy/40'}`}>
                    {s.title}
                  </span>
                  {s.num < 4 && <span className="text-navy/20 text-xs mx-1">→</span>}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-white p-3.5 xs:p-5 sm:p-10 rounded-2xl sm:rounded-[36px] border border-navy/5 shadow-card w-full min-w-0 max-w-full">
              <div className="flex-1 space-y-3.5 sm:space-y-6">

                {/* STEP 1: Location & Group Size */}
                {currentStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3.5 sm:space-y-6">
                    <div>
                      <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-accent mb-0.5 block">Step 1 of 4</span>
                      <h3 className="font-heading text-lg sm:text-3xl font-bold text-navy">Location & Group Size</h3>
                      <p className="text-[10px] sm:text-xs text-navy/60 mt-0.5">Where and when would you like to dive?</p>
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

                    {/* 2. SELECT DIVE LOCATION */}
                    <div>
                      <label className="mb-1 sm:mb-2 block text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">
                        Select Dive Location
                      </label>
                      <div className="relative">
                        <select
                          value={locationId}
                          disabled={!country || isLocationsLoading}
                          onChange={(e) => handleLocationChange(e.target.value)}
                          required
                          className="w-full rounded-lg sm:rounded-2xl bg-[#F0F2F5] px-3 py-2 sm:px-5 sm:py-4 pr-8 sm:pr-10 text-[11px] sm:text-sm font-semibold sm:font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {!country ? (
                            <option value="">Select a country first</option>
                          ) : isLocationsLoading ? (
                            <option value="">Loading dive locations...</option>
                          ) : (
                            <>
                              <option value="">Select a dive location</option>
                              {availableLocations.map((loc) => {
                                const optionLabel = diveSiteService.getLocationDisplayName(loc)
                                return (
                                  <option key={loc.id} value={loc.id}>
                                    {optionLabel}
                                  </option>
                                )
                              })}
                            </>
                          )}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-navy/60">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* 3. SELECTED LOCATION PREVIEW CARD */}
                    {selectedLocation && (() => {
                      const creature = getDiveSiteCreatureInfo(selectedLocation.id, selectedLocation)
                      return (
                        <div className="rounded-xl sm:rounded-3xl bg-white border border-navy/10 p-2.5 sm:p-4 shadow-sm space-y-2 sm:space-y-3 transition-all">
                          <div className="flex gap-2.5 sm:gap-3.5 items-center">
                            {/* Creature & Dive Thumbnail */}
                            {creature?.image && (
                              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-2xl overflow-hidden bg-navy/10 shrink-0 border border-navy/10 relative group">
                                <img
                                  src={creature.image}
                                  alt={creature.creatureName || 'Marine Life'}
                                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5 sm:mb-1">
                                <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-wider text-accent bg-navy px-1.5 py-0.5 rounded-full truncate">
                                  {creature?.creatureName || selectedLocation.membershipLevel || 'Certified Dive Site'}
                                </span>
                                <span className="text-[8px] sm:text-[10px] font-mono font-bold text-navy/40 shrink-0">
                                  #{selectedLocation.id}
                                </span>
                              </div>

                              <p className="font-heading text-[11px] sm:text-sm font-bold text-navy truncate">
                                {diveSiteService.getLocationDisplayName(selectedLocation)}
                              </p>

                              {(selectedLocation.country || selectedLocation.address) && (
                                <p className="text-[9px] sm:text-[11px] text-navy/60 flex items-center gap-1 mt-0.5 truncate">
                                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                    <circle cx="12" cy="9" r="2.5" />
                                  </svg>
                                  <span className="truncate">{selectedLocation.country || selectedLocation.address}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Species & Habitat description */}
                          {creature?.species && (
                            <div className="pt-1 sm:pt-2 border-t border-navy/5 flex items-center justify-between text-[9px] sm:text-[11px]">
                              <span className="text-navy/50 font-bold uppercase text-[7px] sm:text-[9px]">Marine Life:</span>
                              <span className="font-semibold text-navy truncate max-w-[140px] sm:max-w-[200px]">{creature.species}</span>
                            </div>
                          )}
                        </div>
                      )
                    })()}

                    {/* 4. PREFERRED DATE & NUMBER OF PEOPLE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                      <div className="relative">
                        <label className="mb-1 sm:mb-2 block text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">
                          Preferred Date
                        </label>
                        <button
                          type="button"
                          ref={datePickerBtnRef}
                          onClick={() => setIsCalendarOpen((prev) => !prev)}
                          className={`w-full rounded-lg sm:rounded-2xl bg-[#F0F2F5] px-3 py-2 sm:px-5 sm:py-4 text-[11px] sm:text-sm font-semibold sm:font-bold text-navy outline-none text-left flex items-center justify-between transition cursor-pointer focus:ring-2 ${dateError ? 'border-2 border-red-500 focus:ring-red-300' : 'focus:ring-accent/50'
                            }`}
                        >
                          <span className={date ? 'text-navy' : 'text-navy/40'}>
                            {date ? formatDateToDDMMYYYY(date) : 'dd-mm-yyyy'}
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy/60 shrink-0 sm:w-[18px] sm:h-[18px]">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </button>

                        {/* Compact Two-Month Calendar Popover */}
                        <CompactTwoMonthCalendarPopover
                          isOpen={isCalendarOpen}
                          onClose={() => setIsCalendarOpen(false)}
                          selectedDate={date}
                          onSelectDate={(formattedDDMMYYYY, yyyyMmDd) => {
                            setDate(yyyyMmDd)
                            if (yyyyMmDd && (yyyyMmDd < todayStr || yyyyMmDd > maxDateStr)) {
                              setDateError('Please Select a Proper Date')
                            } else {
                              setDateError('')
                              setStepError('')
                            }
                            setIsCalendarOpen(false)
                          }}
                          minDate={todayStr}
                          maxDate={maxDateStr}
                          toggleBtnRef={datePickerBtnRef}
                        />

                        {dateError && (
                          <p className="mt-1 text-[10px] sm:text-xs font-bold text-red-500 flex items-center gap-1">
                            <span>⚠️</span> {dateError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 sm:mb-2 block text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">
                          Number of People
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={groupSize}
                          onChange={(e) => {
                            const val = Math.max(1, parseInt(e.target.value, 10) || 1)
                            setGroupSize(val)
                            setStepError('')
                          }}
                          required
                          className="w-full rounded-lg sm:rounded-2xl bg-[#F0F2F5] px-3 py-2 sm:px-5 sm:py-4 text-[11px] sm:text-sm font-semibold sm:font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Name, Age & Certification Eligibility for Each Person */}
                {currentStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3.5 sm:space-y-6">
                    <div>
                      <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-accent mb-0.5 block">Step 2 of 4</span>
                      <h3 className="font-heading text-lg sm:text-3xl font-bold text-navy">Participant Details</h3>
                      <p className="text-[10px] sm:text-xs text-navy/60 mt-0.5">Enter age and prior scuba certification level for each person to unlock eligible programs.</p>
                    </div>

                    <div data-lenis-prevent className="space-y-3 sm:space-y-6 max-h-[500px] sm:max-h-[550px] overflow-y-auto overscroll-contain pr-1">
                      {participants.map((p, idx) => {
                        const ageNum = parseInt(p.age, 10)
                        const isAgeValid = !isNaN(ageNum) && ageNum >= 8 && ageNum <= 110
                        const eligibleCourses = isAgeValid ? getEligibleCourses(p.age, p.hasCertification, p.certifications) : []
                        const availableCertOptions = getAvailableCertificationsForAge(p.age)

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
                                <span className="text-xs sm:text-sm">ℹ️</span>
                                <span>Enter age to see available courses.</span>
                              </div>
                            )}

                            {/* Invalid age notice */}
                            {p.age !== '' && !isAgeValid && (
                              <div className="rounded-lg sm:rounded-2xl bg-red-50 border border-red-200 p-2.5 sm:p-4 text-[10px] sm:text-xs font-medium text-red-600 flex items-start gap-2">
                                <span className="text-xs sm:text-sm">⚠️</span>
                                <div>
                                  <span className="font-bold block mb-0.5">
                                    {ageNum < 8 ? 'Minimum Age Requirement (8 Years)' : 'Maximum Age Limit (110 Years)'}
                                  </span>
                                  <span>
                                    {ageNum < 8
                                      ? 'The minimum age for any diving activity is 8 years old.'
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
                                        Do you already have a diving certification?
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
                                              {ageNum < 10 ? 'Introductory & Snorkeling options' : 'Beginner & Discover Scuba options'}
                                            </span>
                                          </div>
                                          <div className={`w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 ${!p.hasCertification ? 'border-accent bg-accent text-navy' : 'border-navy/20'
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
                                              {ageNum < 10 ? 'Select completed youth programs' : 'Advanced, Specialities & Fun Dives'}
                                            </span>
                                          </div>
                                          <div className={`w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 ${p.hasCertification ? 'border-accent bg-accent text-navy' : 'border-navy/20'
                                            }`}>
                                            {p.hasCertification && <span className="text-[8px] sm:text-[10px] font-bold">✓</span>}
                                          </div>
                                        </button>
                                      </div>
                                    </div>

                                    {/* If Certified: Options */}
                                    {p.hasCertification && (
                                      <div className="space-y-1.5 pt-1">
                                        <label className="block text-[9px] sm:text-xs font-bold text-navy/80 uppercase tracking-wider">
                                          {ageNum < 10
                                            ? 'Which program(s) have you previously completed?'
                                            : 'Which certification(s) do you currently have?'}
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                                          {availableCertOptions.map((opt) => {
                                            const isSelected = (p.certifications || []).includes(opt.id)
                                            return (
                                              <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => handleToggleCertification(idx, opt.id)}
                                                className={`p-2 sm:p-3 rounded-lg border text-left text-[10px] sm:text-xs font-semibold sm:font-bold transition flex items-center justify-between gap-1.5 ${isSelected
                                                  ? 'bg-accent/15 text-navy border-accent/60 shadow-sm'
                                                  : 'bg-white text-navy/80 border-navy/10 hover:border-navy/30 hover:bg-navy/[0.02]'
                                                  }`}
                                              >
                                                <span className="truncate">{opt.name}</span>
                                                <span className={`w-3 h-3 sm:w-4 sm:h-4 rounded-md border flex items-center justify-center shrink-0 text-[8px] sm:text-[10px] ${isSelected ? 'bg-navy text-white border-navy font-bold' : 'border-navy/20'
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
                                      {!p.hasCertification
                                        ? `${eligibleCourses.length} course(s) unlocked for age ${p.age}`
                                        : `${eligibleCourses.length} course(s) unlocked for age ${p.age}`}
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
                    <div>
                      <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-accent mb-0.5 block">Step 3 of 4</span>
                      <h3 className="font-heading text-lg sm:text-3xl font-bold text-navy">Eligible Programs & Courses</h3>
                      <p className="text-[10px] sm:text-xs text-navy/60 mt-0.5">Select a program for each person.</p>
                    </div>

                    <div data-lenis-prevent className="space-y-3.5 sm:space-y-8 max-h-[500px] sm:max-h-[550px] overflow-y-auto overscroll-contain pr-1">
                      {participants.map((p, idx) => {
                        const eligible = getEligibleCourses(p.age, p.hasCertification, p.certifications)
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
                                {eligible.length} Eligible Program(s)
                              </span>
                            </div>

                            {eligible.length === 0 ? (
                              <div className="rounded-lg sm:rounded-2xl bg-navy/[0.04] border border-navy/10 p-3 sm:p-4 text-[10px] sm:text-xs font-medium text-navy/80 flex items-start gap-2">
                                <span>Minimum age for any diving activity is 8 years.</span>
                              </div>
                            ) : (
                              <div className="space-y-2.5">
                                <div className="flex justify-between items-center">
                                  <label htmlFor={`select-program-${p.id}`} className="text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">
                                    Select Program
                                  </label>
                                  <span className="text-[9px] sm:text-[11px] text-navy/50 font-medium">Tap card or dropdown</span>
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
                                        {prog.name} [{prog.category}] (Age {prog.minimumAge}+) — {prog.certLabel}
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
                                            <span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-widest block mb-0.5 ${isSelected ? 'text-accent' : 'text-navy/50'
                                              }`}>
                                              {prog.category}
                                            </span>
                                            <h5 className="font-heading font-bold text-[11px] sm:text-base leading-snug">
                                              {prog.name}
                                            </h5>
                                          </div>
                                          <div className={`w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border shrink-0 flex items-center justify-center mt-0.5 ${isSelected ? 'border-accent bg-accent text-navy' : 'border-navy/20 bg-transparent'
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
                    <div>
                      <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-accent mb-0.5 block">Step 4 of 4</span>
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
                        <PhoneInput
                          defaultCountry="IN"
                          placeholder="Phone number"
                          value={contact.phone}
                          onChange={(val) => setContact((prev) => ({ ...prev, phone: val }))}
                          className="w-full rounded-lg sm:rounded-2xl bg-[#F0F2F5] px-3 py-2 sm:px-5 sm:py-4 text-[11px] sm:text-sm font-semibold sm:font-bold text-navy outline-none focus-within:ring-2 focus-within:ring-accent/50 transition [&_.PhoneInputCountryIcon]:rounded-sm [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:border-none [&_.PhoneInputCountrySelect]:outline-none [&_.PhoneInputCountryIcon--border]:border-none [&_.PhoneInputInput]:ml-2 [&_.PhoneInputInput]:text-[11px] sm:[&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:placeholder:text-[10px] sm:[&_.PhoneInputInput]:placeholder:text-sm font-semibold sm:font-bold"
                        />
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
                  <span>⚠️</span>
                  <span>{stepError}</span>
                </div>
              )}

              {/* Navigation Controls */}
              {/* Navigation Controls */}
              <div className="pt-3.5 sm:pt-6 mt-3.5 sm:mt-6 border-t border-navy/5 flex items-center justify-between gap-3">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="rounded-full px-3.5 py-2 sm:px-6 sm:py-3.5 text-[11px] sm:text-sm font-bold text-navy hover:bg-[#F0F2F5] active:scale-95 transition cursor-pointer flex items-center gap-1.5"
                    title="Press Alt + ← to go back"
                  >
                    <span>← Back</span>
                    <kbd className="hidden lg:inline-block text-[9px] font-mono bg-navy/10 px-1.5 py-0.5 rounded text-navy/60">Alt+←</kbd>
                  </button>
                ) : <div />}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="rounded-full bg-navy hover:!bg-accent hover:!text-navy active:scale-95 px-4 py-2 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold text-white transition-all duration-200 shadow-md ml-auto cursor-pointer flex items-center gap-2"
                    title="Press Enter to continue"
                  >
                    <span>Continue →</span>
                    <kbd className="hidden lg:inline-block text-[9px] font-mono bg-white/20 px-1.5 py-0.5 rounded text-white/90">↵</kbd>
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

          {/* Interactive Globe Map Column with Desktop Sticky Pinning */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start relative w-full min-w-0 max-w-full mx-auto h-[500px] xs:h-[540px] sm:h-[580px] lg:h-[calc(100vh-8.5rem)] min-h-[480px] sm:min-h-[520px] rounded-2xl sm:rounded-[36px] overflow-hidden bg-navy flex flex-col pt-4 sm:pt-6 shadow-card border border-navy/10 mt-6 lg:mt-0">
            <div className="text-center px-4 z-10 mb-2 pointer-events-none">
              <span className="text-accent text-[10px] font-bold uppercase tracking-widest">Interactive 3D Globe</span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">Select Dive Location</h3>
            </div>
            <div className="flex-1 w-full relative min-h-0 flex flex-col">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center bg-[#021426] text-white/50 text-sm font-medium">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                    <span>Loading 3D Globe...</span>
                  </div>
                </div>
              }>
                <InteractiveDiveMap
                  selectedCountry={country}
                  countryLocations={availableLocations}
                  selectedLocation={selectedLocation}
                  onCountrySelect={handleCountryChange}
                  onLocationSelect={(loc) => {
                    if (loc) {
                      setLocationId(String(loc.id))
                      setSelectedLocation(loc)
                      const placeName = diveSiteService.getLocationDisplayName(loc)
                      setLocation(placeName || loc.title || loc.name)
                      setStepError('')
                    }
                  }}
                />
              </Suspense>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
