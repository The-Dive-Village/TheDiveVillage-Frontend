import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { motion } from 'framer-motion'
import InteractiveDiveMap from '../components/InteractiveDiveMap'
import { padiLocationService } from '../services/padiLocationService'
import {
  COURSE_CATALOG,
  CERTIFICATION_OPTIONS,
  getEligibleCourses,
  validateParticipantBooking,
} from '../utils/courseEligibility'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

// Backwards-compatible export alias for any legacy imports
export const PROGRAMS_CATALOG = COURSE_CATALOG

export default function BookUs() {
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

  // Derived PADI dataset lookups
  const countries = useMemo(() => padiLocationService.getCountries(), [])
  const availableLocations = useMemo(() => padiLocationService.getLocationsByCountry(country), [country])

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
      (l) => String(l.id) === String(newLocationId) || String(l.padiId) === String(newLocationId)
    )
    if (found) {
      setSelectedLocation(found)
      const placeName = padiLocationService.getLocationDisplayName(found)
      setLocation(placeName || found.name)
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

      // Reset selected program if age, hasCertification, or certifications change and current program is no longer eligible
      if (field === 'age' || field === 'hasCertification' || field === 'certifications') {
        const p = updated[index]
        const eligible = getEligibleCourses(p.age, p.hasCertification, p.certifications)
        const isCurrentEligible = eligible.some((course) => course.id === p.selectedProgram)
        if (!isCurrentEligible) {
          updated[index].selectedProgram = eligible[0]?.id || ''
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

  const handleSubmit = (e) => {
    e.preventDefault()

    // Pre-submission validation: Confirm every participant satisfies age & prerequisites
    for (const p of participants) {
      const validation = validateParticipantBooking(p)
      if (!validation.valid) {
        setStepError(validation.error || 'Participant eligibility validation failed.')
        setCurrentStep(2)
        return
      }
    }

    setSubmitted(true)
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
    <div className="bg-[#FAFAFA] min-h-screen text-navy font-body pt-24 sm:pt-32 pb-24" style={{ textShadow: 'none' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
          <div>
            <span className="inline-block bg-black/5 rounded-full px-4 py-1.5 text-xs font-bold text-navy/60 uppercase tracking-widest mb-4">
              Step-by-Step Experience Planner
            </span>
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-navy leading-none">
              Book Your Dive
            </h1>
          </div>
          <p className="max-w-md text-sm sm:text-base font-medium text-navy/70 leading-relaxed lg:pb-4">
            Select your location, group size, participant details, and matching programs. Our dive masters will confirm within 24 hours.
          </p>
        </div>

        {/* Main 4-Step Layout */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Form Wizard Column */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* Step Indicator Bar */}
            <div className="flex items-center justify-between mb-8 bg-white p-4 sm:p-5 rounded-3xl border border-navy/5 shadow-sm overflow-x-auto">
              {[
                { num: 1, title: 'Location & Group' },
                { num: 2, title: 'Participant Details' },
                { num: 3, title: 'Matching Programs' },
                { num: 4, title: 'Contact Info' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-2.5 shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === s.num
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
                  {s.num < 4 && <span className="text-navy/20 text-xs hidden sm:inline mx-1">→</span>}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-white p-6 sm:p-10 rounded-[36px] border border-navy/5 shadow-card">
              <div className="flex-1 space-y-6">

                {/* STEP 1: Location & Group Size */}
                {currentStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-accent mb-1 block">Step 1 of 4</span>
                      <h3 className="font-heading text-3xl font-bold text-navy">Location & Group Size</h3>
                      <p className="text-xs text-navy/60 mt-1">Where and when would you like to dive?</p>
                    </div>

                    {/* 1. SELECT DIVE COUNTRY */}
                    <div>
                      <label className="mb-2 block text-xs font-bold text-navy/70 uppercase tracking-wider">
                        Select Dive Country
                      </label>
                      <div className="relative">
                        <select
                          value={country}
                          onChange={(e) => handleCountryChange(e.target.value)}
                          required
                          className="w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 pr-10 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition cursor-pointer appearance-none"
                        >
                          <option value="">Select a country</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>
                              {c}
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

                    {/* 2. SELECT DIVE LOCATION */}
                    <div>
                      <label className="mb-2 block text-xs font-bold text-navy/70 uppercase tracking-wider">
                        Select Dive Location
                      </label>
                      <div className="relative">
                        <select
                          value={locationId}
                          disabled={!country}
                          onChange={(e) => handleLocationChange(e.target.value)}
                          required
                          className="w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 pr-10 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {!country ? (
                            <option value="">Select a country first</option>
                          ) : (
                            <>
                              <option value="">Select a dive location</option>
                              {availableLocations.map((loc) => {
                                const placeName = padiLocationService.getLocationDisplayName(loc)
                                const optionLabel = placeName && loc.name && placeName.toLowerCase() !== loc.name.toLowerCase()
                                  ? `${placeName} — ${loc.name}`
                                  : (placeName || loc.name)
                                return (
                                  <option key={loc.id} value={loc.id}>
                                    {optionLabel}
                                  </option>
                                )
                              })}
                            </>
                          )}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-navy/60">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* 3. SELECTED LOCATION PREVIEW CARD */}
                    {selectedLocation && (
                      <div className="rounded-2xl bg-[#F0F2F5]/80 border border-navy/10 p-4 space-y-1.5 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-navy px-2.5 py-0.5 rounded-full">
                            {selectedLocation.membershipLevel || 'PADI Dive Center'}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-navy/40">
                            PADI ID: #{selectedLocation.padiId || selectedLocation.id}
                          </span>
                        </div>
                        <p className="font-heading text-sm font-bold text-navy">
                          {selectedLocation.name}
                        </p>
                        {selectedLocation.address && (
                          <p className="text-xs text-navy/60 flex items-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                              <circle cx="12" cy="9" r="2.5" />
                            </svg>
                            <span>{selectedLocation.address}</span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* 4. PREFERRED DATE & NUMBER OF PEOPLE */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="mb-2 block text-xs font-bold text-navy/70 uppercase tracking-wider">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => {
                            const val = e.target.value
                            setDate(val)
                            if (val && (val < todayStr || val > maxDateStr)) {
                              setDateError('Please Select a Proper Date')
                            } else {
                              setDateError('')
                              setStepError('')
                            }
                          }}
                          required
                          min={todayStr}
                          max={maxDateStr}
                          className={`w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 text-sm font-bold text-navy outline-none focus:ring-2 transition ${
                            dateError ? 'border-2 border-red-500 focus:ring-red-300' : 'focus:ring-accent/50'
                          }`}
                        />
                        {dateError && (
                          <p className="mt-1.5 text-xs font-bold text-red-500 flex items-center gap-1.5">
                            <span>⚠️</span> {dateError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold text-navy/70 uppercase tracking-wider">
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
                          className="w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Name, Age & Certification Eligibility for Each Person */}
                {currentStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-accent mb-1 block">Step 2 of 4</span>
                      <h3 className="font-heading text-3xl font-bold text-navy">Participant Details</h3>
                      <p className="text-xs text-navy/60 mt-1">Enter age and prior scuba certification level for each person to unlock eligible programs.</p>
                    </div>

                    <div className="space-y-6 max-h-[550px] overflow-y-auto pr-1">
                      {participants.map((p, idx) => {
                        const ageNum = parseInt(p.age, 10)
                        const isAgeValid = !isNaN(ageNum) && ageNum >= 7
                        const eligibleCourses = isAgeValid ? getEligibleCourses(p.age, p.hasCertification, p.certifications) : []

                        return (
                          <div key={p.id} className="rounded-3xl bg-[#FAFAFA] border border-navy/10 p-5 sm:p-6 space-y-5">
                            <div className="flex justify-between items-center border-b border-navy/5 pb-3">
                              <span className="font-heading font-bold text-navy text-lg flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold">
                                  {idx + 1}
                                </span>
                                Person {idx + 1} Details
                              </span>
                              <span className="text-[11px] text-navy/50 font-bold uppercase tracking-wider">
                                Participant #{idx + 1}
                              </span>
                            </div>

                            {/* Name and Age Inputs */}
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className="mb-2 block text-xs font-bold text-navy/70">Full Name</label>
                                <input
                                  type="text"
                                  placeholder={`Name of Person ${idx + 1}`}
                                  value={p.name}
                                  onChange={(e) => handleParticipantChange(idx, 'name', e.target.value)}
                                  required
                                  className="w-full rounded-2xl bg-white border border-navy/10 px-4 py-3.5 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-xs font-bold text-navy/70">Age (Years)</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  placeholder="e.g. 12"
                                  value={p.age}
                                  onChange={(e) => handleParticipantChange(idx, 'age', e.target.value)}
                                  required
                                  className="w-full rounded-2xl bg-white border border-navy/10 px-4 py-3.5 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition"
                                />
                              </div>
                            </div>

                            {/* Before age is entered */}
                            {p.age === '' && (
                              <div className="rounded-2xl bg-navy/[0.03] border border-navy/10 p-4 text-xs font-medium text-navy/70 flex items-center gap-2.5">
                                <span className="text-base">ℹ️</span>
                                <span>Enter your age to see the courses available to you.</span>
                              </div>
                            )}

                            {/* Age below 7 notice */}
                            {p.age !== '' && !isAgeValid && (
                              <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-medium text-red-600 flex items-start gap-3">
                                <span className="text-base">⚠️</span>
                                <div>
                                  <span className="font-bold block mb-0.5">Age Notice (Under 7)</span>
                                  <span>Minimum age for water & ocean programs is 7 years (Discover Snorkeling). There aren't any courses available for this age yet.</span>
                                </div>
                              </div>
                            )}

                            {/* Once Age is Valid: Certification Choice */}
                            {isAgeValid && (
                              <div className="space-y-4 pt-1">
                                <div>
                                  <label className="mb-2.5 block text-xs font-bold text-navy/80 uppercase tracking-wider">
                                    Do you already have a diving certification?
                                  </label>
                                  <div className="grid sm:grid-cols-2 gap-3">
                                    <button
                                      type="button"
                                      onClick={() => handleParticipantChange(idx, 'hasCertification', false)}
                                      className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                                        !p.hasCertification
                                          ? 'bg-navy text-white border-navy shadow-sm'
                                          : 'bg-white text-navy border-navy/15 hover:border-navy/30'
                                      }`}
                                    >
                                      <div>
                                        <span className="font-bold text-sm block">No, I don't have a certification</span>
                                        <span className={`text-[11px] block mt-0.5 ${!p.hasCertification ? 'text-white/70' : 'text-navy/50'}`}>
                                          Beginner, Discover Scuba & Pathway options
                                        </span>
                                      </div>
                                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                        !p.hasCertification ? 'border-accent bg-accent text-navy' : 'border-navy/20'
                                      }`}>
                                        {!p.hasCertification && <span className="text-[10px] font-bold">✓</span>}
                                      </div>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleParticipantChange(idx, 'hasCertification', true)}
                                      className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                                        p.hasCertification
                                          ? 'bg-navy text-white border-navy shadow-sm'
                                          : 'bg-white text-navy border-navy/15 hover:border-navy/30'
                                      }`}
                                    >
                                      <div>
                                        <span className="font-bold text-sm block">Yes, I have a certification</span>
                                        <span className={`text-[11px] block mt-0.5 ${p.hasCertification ? 'text-white/70' : 'text-navy/50'}`}>
                                          Advanced, Rescue, Specialities & Fun Dives
                                        </span>
                                      </div>
                                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                        p.hasCertification ? 'border-accent bg-accent text-navy' : 'border-navy/20'
                                      }`}>
                                        {p.hasCertification && <span className="text-[10px] font-bold">✓</span>}
                                      </div>
                                    </button>
                                  </div>
                                </div>

                                {/* If Certified: Show Which Certification Do You Have */}
                                {p.hasCertification && (
                                  <div className="space-y-2.5 pt-2">
                                    <label className="block text-xs font-bold text-navy/80 uppercase tracking-wider">
                                      Which certification(s) do you currently have?
                                    </label>
                                    <div className="grid sm:grid-cols-2 gap-2">
                                      {CERTIFICATION_OPTIONS.map((opt) => {
                                        const isSelected = (p.certifications || []).includes(opt.id)
                                        return (
                                          <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => handleToggleCertification(idx, opt.id)}
                                            className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between gap-2 ${
                                              isSelected
                                                ? 'bg-accent/15 text-navy border-accent/60 shadow-sm'
                                                : 'bg-white text-navy/80 border-navy/10 hover:border-navy/30 hover:bg-navy/[0.02]'
                                            }`}
                                          >
                                            <span className="truncate">{opt.name}</span>
                                            <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 text-[10px] ${
                                              isSelected ? 'bg-navy text-white border-navy font-bold' : 'border-navy/20'
                                            }`}>
                                              {isSelected ? '✓' : ''}
                                            </span>
                                          </button>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Dynamic Eligibility Summary Badge */}
                                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-800 font-medium flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                                    <span>
                                      {!p.hasCertification
                                        ? `Beginner mode: ${eligibleCourses.length} course(s) & pathways unlocked for age ${p.age}`
                                        : `${eligibleCourses.length} course(s) unlocked for age ${p.age} with your certification(s)`}
                                    </span>
                                  </div>
                                  <span className="font-bold text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15">
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

                {/* STEP 3: Matching Programs Selection For Each Person */}
                {currentStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-accent mb-1 block">Step 3 of 4</span>
                      <h3 className="font-heading text-3xl font-bold text-navy">Eligible Programs & Courses</h3>
                      <p className="text-xs text-navy/60 mt-1">Based on age and prerequisite certification eligibility matrix, select a program for each person.</p>
                    </div>

                    <div className="space-y-8 max-h-[550px] overflow-y-auto pr-1">
                      {participants.map((p, idx) => {
                        const eligible = getEligibleCourses(p.age, p.hasCertification, p.certifications)
                        const certNames = (p.certifications || [])
                          .map((id) => CERTIFICATION_OPTIONS.find((c) => c.id === id)?.name)
                          .filter(Boolean)
                        const certSummary = p.hasCertification
                          ? (certNames.length ? certNames.join(', ') : 'Certified Diver')
                          : 'No Prior Certification (Beginner / Pathway)'

                        return (
                          <div key={p.id} className="rounded-3xl bg-[#FAFAFA] border border-navy/10 p-5 sm:p-6 space-y-5">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-navy/10 pb-4">
                              <div>
                                <h4 className="font-heading font-bold text-navy text-xl">
                                  {p.name || `Person ${idx + 1}`}
                                </h4>
                                <p className="text-xs text-navy/60 mt-0.5">
                                  Age: <span className="font-bold text-navy">{p.age || 'Not specified'}</span> • Cert: <span className="font-bold text-navy">{certSummary}</span>
                                </p>
                              </div>
                              <span className="text-[11px] font-bold px-3.5 py-1 rounded-full bg-navy/[0.06] text-navy border border-navy/10">
                                {eligible.length} Eligible Program(s)
                              </span>
                            </div>

                            {eligible.length === 0 ? (
                              <div className="rounded-2xl bg-navy/[0.04] border border-navy/10 p-5 text-xs font-medium text-navy/80 flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-navy/10 text-navy shrink-0 flex items-center justify-center font-bold text-[10px] mt-0.5">
                                  i
                                </div>
                                <span>No water or diving programs available for age {p.age || '0–6'} year(s). Minimum age for Snorkeling is 7 years; minimum age for introductory diving is 8 years.</span>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <label htmlFor={`select-program-${p.id}`} className="text-xs font-bold text-navy/70 uppercase tracking-wider">
                                    Select Program for {p.name || `Person ${idx + 1}`}
                                  </label>
                                  <span className="text-[11px] text-navy/50 font-medium">Click a card or select from list</span>
                                </div>

                                {/* Accessible Native Select Dropdown */}
                                <div className="relative">
                                  <select
                                    id={`select-program-${p.id}`}
                                    value={p.selectedProgram}
                                    onChange={(e) => handleParticipantChange(idx, 'selectedProgram', e.target.value)}
                                    required={eligible.length > 0}
                                    aria-label={`Select program for ${p.name || `Person ${idx + 1}`}`}
                                    className="w-full rounded-2xl bg-white border border-navy/10 px-4 py-3.5 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-navy/20 transition appearance-none shadow-sm cursor-pointer pr-10"
                                  >
                                    <option value="" disabled>Select an eligible course...</option>
                                    {eligible.map((prog) => (
                                      <option key={prog.id} value={prog.id}>
                                        {prog.name} [{prog.category}] (Age {prog.minimumAge}+) — {prog.certLabel}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-navy/40">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                                  </div>
                                </div>

                                {/* Interactive Program Cards Grid */}
                                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                                  {eligible.map((prog) => {
                                    const isSelected = p.selectedProgram === prog.id
                                    return (
                                      <div
                                        key={prog.id}
                                        onClick={() => handleParticipantChange(idx, 'selectedProgram', prog.id)}
                                        className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                                          isSelected
                                            ? 'bg-navy text-white border-navy shadow-md ring-1 ring-navy'
                                            : 'bg-white text-navy border-navy/10 hover:border-navy/30 hover:bg-navy/[0.02]'
                                        }`}
                                      >
                                        <div className="flex justify-between items-start gap-2">
                                          <div>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${
                                              isSelected ? 'text-accent' : 'text-navy/50'
                                            }`}>
                                              {prog.category}
                                            </span>
                                            <h5 className="font-heading font-bold text-base leading-snug">
                                              {prog.name}
                                            </h5>
                                          </div>
                                          <div className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center mt-0.5 ${
                                            isSelected ? 'border-accent bg-accent text-navy' : 'border-navy/20 bg-transparent'
                                          }`}>
                                            {isSelected && <span className="text-[10px] font-bold">✓</span>}
                                          </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px]">
                                          <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
                                            isSelected ? 'bg-white/10 text-white/90' : 'bg-navy/[0.05] text-navy/70'
                                          }`}>
                                            Age {prog.minimumAge}+
                                          </span>
                                          <span className={`truncate max-w-[170px] ${
                                            isSelected ? 'text-white/70' : 'text-navy/50'
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
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-accent mb-1 block">Step 4 of 4</span>
                      <h3 className="font-heading text-3xl font-bold text-navy">Contact & Booking Details</h3>
                      <p className="text-xs text-navy/60 mt-1">Please provide your contact information to finalize the booking request.</p>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-navy/70 uppercase tracking-wider">Primary Contact Name</label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={contact.name}
                        onChange={(e) => setContact((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition placeholder:text-navy/30"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="mb-2 block text-xs font-bold text-navy/70 uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={contact.email}
                          onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
                          required
                          className="w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition placeholder:text-navy/30"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold text-navy/70 uppercase tracking-wider">Phone Number</label>
                        <PhoneInput
                          defaultCountry="IN"
                          placeholder="8971001010"
                          value={contact.phone}
                          onChange={(val) => setContact((prev) => ({ ...prev, phone: val }))}
                          className="w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 text-sm font-bold text-navy outline-none focus-within:ring-2 focus-within:ring-accent/50 transition [&_.PhoneInputCountryIcon]:rounded-sm [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:border-none [&_.PhoneInputCountrySelect]:outline-none [&_.PhoneInputCountryIcon--border]:border-none [&_.PhoneInputInput]:ml-3 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-navy/70 uppercase tracking-wider">Special Requests / Notes</label>
                      <textarea
                        placeholder="Any medical conditions, dietary preferences, gear sizes, or custom requests?"
                        value={contact.requests}
                        onChange={(e) => setContact((prev) => ({ ...prev, requests: e.target.value }))}
                        rows="3"
                        className="w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition placeholder:text-navy/30 resize-y"
                      ></textarea>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Inline Step Error Message */}
              {stepError && (
                <div className="mt-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{stepError}</span>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="pt-6 mt-6 border-t border-navy/5 flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setStepError('')
                      setCurrentStep((prev) => prev - 1)
                    }}
                    className="rounded-full px-6 py-3.5 text-sm font-bold text-navy hover:bg-[#F0F2F5] transition"
                  >
                    ← Back
                  </button>
                ) : <div />}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep === 1) {
                        if (!country) {
                          setStepError('Please select a dive country.')
                          return
                        }
                        if (!locationId && !selectedLocation && !location) {
                          setStepError('Please select a dive location.')
                          return
                        }
                        if (!date || date < todayStr || date > maxDateStr) {
                          setDateError('Please Select a Proper Date')
                          setStepError('Please select a valid date for your dive.')
                          return
                        }
                        if (!groupSize || parseInt(groupSize, 10) < 1) {
                          setStepError('Please enter a valid number of participants (minimum 1).')
                          return
                        }
                        setDateError('')
                        setStepError('')
                      }
                      if (currentStep === 2) {
                        const hasEmpty = participants.some((p) => !p.name || !p.age)
                        if (hasEmpty) {
                          setStepError('Please fill in the Name and Age for all participants.')
                          return
                        }
                        const hasInvalidAge = participants.some((p) => parseInt(p.age, 10) < 7)
                        if (hasInvalidAge) {
                          setStepError('Minimum age for booking water & dive programs is 7 years.')
                          return
                        }
                        setStepError('')
                      }
                      if (currentStep === 3) {
                        const hasUnselected = participants.some((p) => !p.selectedProgram)
                        if (hasUnselected) {
                          setStepError('Please select an eligible program for each participant.')
                          return
                        }
                        // Validate eligibility for each participant
                        for (const p of participants) {
                          const val = validateParticipantBooking(p)
                          if (!val.valid) {
                            setStepError(val.error || 'Eligibility validation failed.')
                            return
                          }
                        }
                        setStepError('')
                      }
                      setStepError('')
                      setCurrentStep((prev) => prev + 1)
                    }}
                    className="rounded-full bg-navy px-8 py-4 text-sm font-bold text-white transition hover:bg-accent hover:text-navy shadow-md ml-auto"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="rounded-full bg-accent px-8 py-4 text-sm font-bold text-navy transition hover:bg-navy hover:text-white shadow-md ml-auto"
                  >
                    Confirm Booking Request
                  </button>
                )}
              </div>
            </form>

          </div>

          {/* Interactive Globe Map Column */}
          <div className="lg:col-span-5 relative w-full aspect-[4/5] lg:aspect-auto min-h-[520px] h-full rounded-[36px] overflow-hidden bg-navy flex flex-col pt-8 shadow-card border border-navy/10">
            <div className="text-center px-4 z-10 mb-2 pointer-events-none">
              <span className="text-accent text-[10px] font-bold uppercase tracking-widest">Interactive 3D Globe</span>
              <h3 className="font-heading text-2xl font-bold text-white">Select Dive Location</h3>
            </div>
            <div className="flex-1 w-full relative min-h-0 flex flex-col">
              <InteractiveDiveMap
                selectedCountry={country}
                countryLocations={availableLocations}
                selectedLocation={selectedLocation}
                onCountrySelect={handleCountryChange}
                onLocationSelect={(loc) => {
                  if (loc) {
                    setLocationId(String(loc.id))
                    setSelectedLocation(loc)
                    const placeName = padiLocationService.getLocationDisplayName(loc)
                    setLocation(placeName || loc.name)
                    setStepError('')
                  }
                }}
              />
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
