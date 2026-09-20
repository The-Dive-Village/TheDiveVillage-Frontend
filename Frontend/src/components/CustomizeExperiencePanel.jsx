import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
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
  const navigate = useNavigate()
  
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

  const handleContactUs = () => {
    const selectedNames = CUSTOM_ACTIVITIES.filter((a) => selectedActivities.includes(a.id)).map((a) => a.name)
    const parts = []
    if (selectedNames.length > 0) {
      parts.push(`Selected Activities: ${selectedNames.join(', ')}`)
    }
    if (customText.trim()) {
      parts.push(`Custom Details: ${customText.trim()}`)
    }
    const fullMessage = parts.join('\n\n')

    const searchParams = new URLSearchParams()
    if (fullMessage) {
      searchParams.set('message', fullMessage)
      searchParams.set('subject', 'Special Request')
    } else {
      searchParams.set('subject', 'Special Request')
    }

    navigate(
      {
        pathname: '/contact',
        search: `?${searchParams.toString()}`,
      },
      {
        state: {
          message: fullMessage,
          subject: 'Special Request',
        },
      }
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-[36px] sm:rounded-[44px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] w-full min-h-[460px] lg:min-h-[520px] flex flex-col justify-center border border-white/20 text-white ${className}`}>
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

      {/* Uniform Light Ambient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#001428]/95 via-[#001428]/75 to-[#001428]/45 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#001428]/90 via-transparent to-black/20 pointer-events-none z-10" />
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#FFCD00]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-20 p-6 sm:p-10 lg:p-14">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
          
          {/* Left Column: Heading & Activity Chips */}
          <div className="flex-1">
            <span className="inline-block self-start bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 text-xs font-bold text-[#FFCD00] uppercase tracking-widest mb-4 shadow-sm">
              Tailor Made Adventures
            </span>
            
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-tight mb-4 drop-shadow-md">
              Customize Your <span className="font-heading font-bold text-[#FFCD00]"><br />Dive Experience</span>
            </h2>
            
            <p className="text-white/90 text-sm sm:text-base font-medium mb-6 drop-shadow-sm max-w-xl leading-relaxed">
              Select your favorite add-ons to build your perfect ocean journey:
            </p>

            {/* Catchy Pill Badges */}
            <div className="flex flex-wrap gap-2.5">
              {CUSTOM_ACTIVITIES.map((activity) => {
                const isSelected = selectedActivities.includes(activity.id)
                return (
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => toggleActivity(activity.id)}
                    className={`group inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 border cursor-pointer select-none active:scale-95 ${
                      isSelected
                        ? 'bg-[#FFCD00] text-[#001e3d] border-[#FFCD00] shadow-[0_4px_16px_rgba(255,205,0,0.45)] scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-white border-white/25 hover:border-[#FFCD00] backdrop-blur-md hover:text-[#FFCD00]'
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

          {/* Right Column: Translucent Glass Box */}
          <div className="w-full lg:w-[440px] flex flex-col gap-4 shrink-0 bg-white/10 backdrop-blur-2xl p-6 sm:p-8 rounded-[28px] border border-white/20 shadow-2xl">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/90 mb-2">
                Custom Requests & Details
              </label>
              <textarea
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="E.g., 3-day scuba package with sunset surfing & local food tour..."
                className="w-full rounded-2xl bg-white/10 border border-white/20 p-4 text-xs sm:text-sm text-white placeholder-white/55 outline-none focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00]/50 transition resize-none leading-relaxed"
              />
            </div>

            <button
              type="button"
              onClick={handleContactUs}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider py-4 px-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 hover:scale-105 active:scale-95 hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] hover:shadow-[0_12px_40px_rgba(255,205,0,0.5)] cursor-pointer"
            >
              <span>Contact Us</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
