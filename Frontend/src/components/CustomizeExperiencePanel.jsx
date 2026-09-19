import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { PANEL_IMAGES } from '../utils/images'

const CUSTOM_ACTIVITIES = [
  { id: 'canyoneering', name: 'Canyoneering', icon: '⛰️' },
  { id: 'safari', name: 'Safari', icon: '🚙' },
  { id: 'trekking', name: 'Trekking', icon: '🥾' },
  { id: 'surfing', name: 'Surfing', icon: '🏄' },
  { id: 'sightseeing', name: 'Local Sightseeing', icon: '🏝️' },
  { id: 'snorkeling', name: 'Snorkeling', icon: '🤿' },
  { id: 'custom', name: 'Custom Request', icon: '✨' },
]

export default function CustomizeExperiencePanel({ className = '' }) {
  const navigate = useNavigate()
  const [selectedActivities, setSelectedActivities] = useState([])
  const [customText, setCustomText] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [bgIndex] = useState(0)

  const toggleActivity = (id) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedActivities.length === 0 && !customText.trim()) {
      return
    }

    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setSelectedActivities([])
      setCustomText('')
      setContactEmail('')
    }, 4000)
  }

  return (
    <div className={`relative overflow-hidden rounded-[32px] sm:rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] w-full bg-[#001e3d] border border-white/20 text-white ${className}`}>
      {/* Background Image & Gradient Overlays */}
      <img
        src={PANEL_IMAGES[bgIndex] || PANEL_IMAGES[0]}
        alt="Customize Island Experience"
        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.15] opacity-40 transition-opacity duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#001428]/95 via-[#001e3d]/90 to-[#001428]/85 z-10" />
      <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-20 p-6 sm:p-10 lg:p-14">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center sm:text-left mb-8">
            <span className="inline-block text-[#FFCD00] font-heading font-bold uppercase tracking-widest text-xs mb-3 bg-[#FFCD00]/15 px-4 py-1.5 rounded-full border border-[#FFCD00]/30 shadow-sm backdrop-blur-md">
              Bespoke Island Itineraries
            </span>
            <h3
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.9)' }}
            >
              Customize Your <span className="text-[#FFCD00]">Dive Experience</span>
            </h3>
            <p className="text-white/90 font-medium text-sm sm:text-base max-w-2xl leading-relaxed">
              Curate your dream island getaway. Select your favorite adventures or tell us exactly what you wish to experience.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="submitted"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-3xl bg-emerald-500/20 border border-emerald-500/40 p-8 text-center text-emerald-200 backdrop-blur-xl shadow-2xl my-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl text-emerald-300 shadow-md">
                  ✓
                </div>
                <h4 className="text-2xl font-bold font-heading text-white mb-2">Custom Request Received!</h4>
                <p className="text-sm max-w-md mx-auto text-emerald-100/90 leading-relaxed">
                  Thank you! Our dive team and island concierge will tailor a custom itinerary around your selections.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Interactive Multi-Select Chips */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/80 mb-3">
                    Select Activities & Adventures
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                    {CUSTOM_ACTIVITIES.map((activity) => {
                      const isSelected = selectedActivities.includes(activity.id)
                      return (
                        <button
                          key={activity.id}
                          type="button"
                          onClick={() => toggleActivity(activity.id)}
                          className={`group flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 border text-left cursor-pointer select-none ${
                            isSelected
                              ? 'bg-[#FFCD00] text-[#001e3d] border-[#FFCD00] shadow-[0_4px_20px_rgba(255,205,0,0.4)] scale-[1.02]'
                              : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 backdrop-blur-md'
                          }`}
                        >
                          <span className="text-base sm:text-lg">{activity.icon}</span>
                          <span className="flex-1 truncate">{activity.name}</span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#001e3d] text-[#FFCD00] flex items-center justify-center text-[10px] font-black shrink-0">
                              ✓
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Custom Request Textarea */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/80 mb-2">
                    Custom Requests & Itinerary Details
                  </label>
                  <textarea
                    rows={3}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Tell us about special requirements, preferred destinations, group details, or specific dive sites you want to explore..."
                    className="w-full rounded-2xl bg-[#001428]/80 border border-white/25 px-4 py-3.5 text-sm text-white placeholder-white/50 outline-none focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] transition backdrop-blur-md shadow-inner"
                  />
                </div>

                {/* Contact Email & Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-white/15">
                  <div className="flex-1 max-w-sm">
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Your email (optional for direct quote)"
                      className="w-full rounded-full bg-white/10 border border-white/20 px-5 py-3 text-xs sm:text-sm text-white placeholder-white/50 outline-none focus:border-[#FFCD00] transition"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCD00] hover:bg-white text-[#001e3d] font-bold text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 transition-all duration-300 hover:scale-105 shadow-[0_8px_30px_rgba(255,205,0,0.4)] cursor-pointer"
                    >
                      <span>Submit Request</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </button>

                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 transition-all duration-300 hover:scale-105 backdrop-blur-md cursor-pointer"
                    >
                      <span>Talk to Us</span>
                    </Link>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
