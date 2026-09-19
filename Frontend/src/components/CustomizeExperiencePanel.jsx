import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { PANEL_IMAGES } from '../utils/images'

const CUSTOM_ACTIVITIES = [
  { id: 'canyoneering', name: 'Canyoneering' },
  { id: 'safari', name: 'Safari' },
  { id: 'trekking', name: 'Trekking' },
  { id: 'surfing', name: 'Surfing' },
  { id: 'sightseeing', name: 'Local Sightseeing' },
  { id: 'snorkeling', name: 'Snorkeling' },
]

export default function CustomizeExperiencePanel({ className = '', images = PANEL_IMAGES }) {
  const [selectedActivities, setSelectedActivities] = useState([])
  const [customText, setCustomText] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Dynamic Background Image Carousel (Identical to Come for Adventure panel)
  const [index, setIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(0)

  useEffect(() => {
    if (!images || images.length === 0) return
    const timer = setInterval(() => {
      setIndex((curr) => {
        setPrevIndex(curr)
        return (curr + 1) % images.length
      })
    }, 3400)
    return () => clearInterval(timer)
  }, [images])

  const toggleActivity = (id) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedActivities.length === 0 && !customText.trim()) return

    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setSelectedActivities([])
      setCustomText('')
      setContactInfo('')
    }, 3500)
  }

  return (
    <div className={`relative overflow-hidden rounded-[28px] sm:rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] w-full bg-[#001e3d] border border-white/20 text-white ${className}`}>
      {/* Base Layer: Previous image stays solid extending fully to both ends */}
      {images[prevIndex] && (
        <img
          src={images[prevIndex]}
          alt="Ocean Background"
          className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center pointer-events-none"
        />
      )}

      {/* Active Layer: Current image smoothly fades in extending fully to both ends */}
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Island Activity ${i + 1}`}
          className={`absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center transition-opacity duration-1000 ease-in-out pointer-events-none ${
            i === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
          loading="lazy"
        />
      ))}

      {/* Uniform Light Ambient Overlay extending evenly across both left and right edges */}
      <div className="absolute inset-0 bg-[#00172b]/25 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#00172b]/50 via-transparent to-[#00172b]/25 pointer-events-none z-10" />

      {/* Compact Main Content */}
      <div className="relative z-20 p-5 sm:p-8 lg:p-10">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-3xl bg-emerald-500/20 border border-emerald-500/40 p-8 text-center text-emerald-200 backdrop-blur-xl shadow-2xl my-4"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/25 border border-emerald-400 flex items-center justify-center mx-auto mb-3 text-2xl text-emerald-300 shadow-md">
                ✓
              </div>
              <h4 className="text-xl sm:text-2xl font-bold font-heading text-white mb-2">Custom Request Received!</h4>
              <p className="text-xs sm:text-sm max-w-md mx-auto text-emerald-100/90 leading-relaxed">
                Thank you! Our dive masters & island concierge will craft a customized itinerary for your trip.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
              
              {/* Left Column: Heading & Activity Chips */}
              <div className="flex-1">
                <span className="inline-block text-[#FFCD00] font-heading font-bold uppercase tracking-widest text-[11px] mb-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  Tailor Made Adventures
                </span>
                
                <h3
                  className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-2 tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
                  style={{ textShadow: '0 3px 12px rgba(0,0,0,0.95)' }}
                >
                  Customize Your <span className="text-[#FFCD00]">Dive Experience</span>
                </h3>
                
                <p
                  className="text-white/95 text-xs sm:text-sm font-medium mb-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] max-w-xl"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
                >
                  Select your favorite add-ons to build your perfect ocean journey:
                </p>

                {/* Catchy Pill Badges without emojis */}
                <div className="flex flex-wrap gap-2">
                  {CUSTOM_ACTIVITIES.map((activity) => {
                    const isSelected = selectedActivities.includes(activity.id)
                    return (
                      <button
                        key={activity.id}
                        type="button"
                        onClick={() => toggleActivity(activity.id)}
                        className={`group inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border cursor-pointer select-none active:scale-95 ${
                          isSelected
                            ? 'bg-[#FFCD00] text-[#001e3d] border-[#FFCD00] shadow-[0_4px_16px_rgba(255,205,0,0.45)] scale-105'
                            : 'bg-[#00172b]/50 hover:bg-[#00172b]/70 text-white border-white/25 hover:border-[#FFCD00]/60 backdrop-blur-md hover:text-[#FFCD00]'
                        }`}
                      >
                        <span>{activity.name}</span>
                        {isSelected && (
                          <span className="ml-1 text-[11px] font-black">✓</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Sleek Compact Input & Actions */}
              <div className="w-full lg:w-[420px] flex flex-col gap-3 shrink-0 bg-[#00172b]/40 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/90 mb-1.5">
                    Custom Requests & Details
                  </label>
                  <textarea
                    rows={2}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="E.g., 3-day scuba package with sunset surfing & local food tour..."
                    className="w-full rounded-xl bg-white/10 border border-white/20 p-2.5 text-xs text-white placeholder-white/55 outline-none focus:border-[#FFCD00] transition resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="Email or WhatsApp (optional)"
                    className="flex-1 rounded-full bg-white/10 border border-white/20 px-3.5 py-2 text-xs text-white placeholder-white/55 outline-none focus:border-[#FFCD00] transition"
                  />
                  
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FFCD00] hover:bg-white text-[#001e3d] font-bold text-xs uppercase tracking-wider px-5 py-2 transition-all duration-300 hover:scale-105 shadow-[0_4px_16px_rgba(255,205,0,0.4)] cursor-pointer shrink-0"
                  >
                    <span>Send</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

            </form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
