import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Button from '../components/Button'
import SafeImage from '../components/SafeImage'
import SEOHead from '../components/SEOHead'
import { IMAGES, CAROUSEL_IMAGES } from '../utils/images'

import c1 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.42 AM (1).jpeg'
import c2 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.42 AM.jpeg'
import c3 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.43 AM (1).jpeg'
import c4 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.43 AM (2).jpeg'
import c5 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.43 AM.jpeg'
import c6 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.44 AM.jpeg'

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Havelock Deep Wall Exploration',
    location: 'Havelock Island, Andamans',
    category: 'scuba',
    categoryLabel: 'Scuba Diving',
    src: c1,
    desc: 'Divers descending along the vibrant gorgonian sea fan garden at 22 meters.',
  },
  {
    id: 2,
    title: 'Coral Garden & Schooling Fish',
    location: 'Goa Coast',
    category: 'marine',
    categoryLabel: 'Marine Life',
    src: c2,
    desc: 'Golden trevally and snappers swirling around the pinnacle reef.',
  },
  {
    id: 3,
    title: 'Crystal Clear Lagoon Drift',
    location: 'Lakshadweep Islands',
    category: 'snorkeling',
    categoryLabel: 'Snorkeling',
    src: c3,
    desc: 'Gliding through shallow turquoise waters with gentle green sea turtles.',
  },
  {
    id: 4,
    title: 'Sunset Wave Session',
    location: 'Pondicherry Coast',
    category: 'surfing',
    categoryLabel: 'Surfing',
    src: c4,
    desc: 'Catching the clean evening rollers during our weekend surf camp.',
  },
  {
    id: 5,
    title: 'Ocean Awakening Briefing',
    location: 'Andaman Sea',
    category: 'community',
    categoryLabel: 'Community',
    src: c5,
    desc: 'Morning safety checks and dive team briefing before the boat departure.',
  },
  {
    id: 6,
    title: 'Netrani Island Reefs',
    location: 'Netrani Island, Karnataka',
    category: 'scuba',
    categoryLabel: 'Scuba Diving',
    src: c6,
    desc: 'Exploring massive hard coral formations teeming with parrotfish and stingrays.',
  },
  {
    id: 7,
    title: 'Majestic Manta Encounter',
    location: 'Lakshadweep Outer Reef',
    category: 'marine',
    categoryLabel: 'Marine Life',
    src: IMAGES.dest1,
    desc: 'A resident oceanic manta ray gliding silently past our dive group.',
  },
  {
    id: 8,
    title: 'Open Water Certification Grad Day',
    location: 'Havelock Island',
    category: 'community',
    categoryLabel: 'Community',
    src: IMAGES.hero,
    desc: 'Celebration underwater with new PADI Open Water certified divers.',
  },
  {
    id: 9,
    title: 'Coral Reef Biodiversity Survey',
    location: 'Kadmat Island',
    category: 'marine',
    categoryLabel: 'Marine Life',
    src: IMAGES.scubaFeat1,
    desc: 'Mapping healthy staghorn and brain coral clusters during our eco-dive.',
  },
  {
    id: 10,
    title: 'Family Snorkel Expedition',
    location: 'Bangaram Lagoon',
    category: 'snorkeling',
    categoryLabel: 'Snorkeling',
    src: IMAGES.snorkelingFeat1,
    desc: 'First-time snorkelers marveling at the shallow coral gardens.',
  },
  {
    id: 11,
    title: 'Dawn Patrol Surfing',
    location: 'Mahabalipuram Point',
    category: 'surfing',
    categoryLabel: 'Surfing',
    src: IMAGES.surfingFeat1,
    desc: 'Perfect right-hand peelers under the morning golden light.',
  },
  {
    id: 12,
    title: 'Deep Blue Serenity',
    location: 'Dixon\'s Pinnacle, Andamans',
    category: 'scuba',
    categoryLabel: 'Scuba Diving',
    src: IMAGES.scubaStats,
    desc: 'Pure calm and weightlessness at 30 meters depth.',
  },
]

const CATEGORIES = [
  { key: 'all', label: 'All Photos' },
  { key: 'scuba', label: 'Scuba Diving' },
  { key: 'marine', label: 'Marine Life & Reefs' },
  { key: 'snorkeling', label: 'Snorkeling' },
  { key: 'surfing', label: 'Surfing' },
  { key: 'community', label: 'Community & Divers' },
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const reduce = useReducedMotion()

  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory)

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return
      if (e.key === 'Escape') setSelectedImageIndex(null)
      if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev + 1) % filteredItems.length)
      }
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImageIndex, filteredItems.length])

  const openLightbox = (index) => {
    setSelectedImageIndex(index)
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % filteredItems.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
  }

  const currentItem = selectedImageIndex !== null ? filteredItems[selectedImageIndex] : null

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-navy font-body pt-24 sm:pt-32 pb-24 overflow-x-hidden" style={{ textShadow: 'none' }}>
      <SEOHead
        title="Underwater Photography & Scuba Gallery | The Dive Village"
        description="Explore our visual gallery of underwater expeditions, vibrant coral reefs, sea turtle encounters, and diving moments captured at The Dive Village."
        keywords="underwater photography, scuba diving gallery, marine life photos, coral reef images, dive village photos"
        canonicalUrl="https://thedivevillage.com/gallery"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
          <div>
            <span className="inline-block bg-black/5 rounded-full px-4 py-1.5 text-xs font-bold text-navy/60 uppercase tracking-widest mb-4">
              Visual Chronicles
            </span>
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-navy leading-none">
              Gallery
            </h1>
          </div>
          <p className="max-w-md text-base sm:text-lg font-medium text-navy/70 leading-relaxed lg:pb-4">
            Moments frozen in time beneath the waves. Explore our underwater expeditions, coral encounters, surf sessions, and village life.
          </p>
        </div>

        {/* 2. CATEGORIES FILTER */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-12 border-b border-navy/10 pb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key)
                setSelectedImageIndex(null)
              }}
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeCategory === cat.key
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-[#F0F2F5] text-navy/70 hover:bg-navy/10 hover:text-navy'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 3. GALLERY MASONRY / GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-24">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={reduce ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04 }}
              className="group relative rounded-[32px] overflow-hidden bg-navy/10 shadow-card hover:shadow-float transition duration-300 aspect-[4/3] cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              <SafeImage
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent opacity-60 sm:opacity-0 group-hover:opacity-100 transition duration-300" />
              
              {/* Category Pill */}
              <div className="absolute top-4 left-4">
                <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-navy shadow-sm">
                  {item.categoryLabel}
                </span>
              </div>

              {/* Zoom icon button */}
              <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </div>

              {/* Text metadata */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform sm:translate-y-2 group-hover:translate-y-0 transition duration-300">
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent block mb-1">
                  {item.location}
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold leading-snug">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4. INSTAGRAM & COMMUNITY SECTION */}
        <div className="rounded-[40px] bg-[#F0F2F5] p-8 sm:p-14 mb-24">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="text-accent font-bold tracking-widest uppercase text-xs mb-3 block">
                #TheDiveVillage
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy mb-4">
                Tag Us in Your Ocean Adventures
              </h2>
              <p className="text-navy/75 text-sm sm:text-base leading-relaxed max-w-2xl">
                Every photo tells a story of discovery and courage. Share your dive logs, underwater encounters, and island moments with <span className="font-bold text-navy">@TheDiveVillage</span> on Instagram to get featured on our wall.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-navy text-white px-8 py-4 text-center text-sm font-bold shadow-soft hover:bg-accent transition"
              >
                Follow on Instagram →
              </a>
              <Button as={Link} to="/book-us" variant="secondary" className="justify-center !border-navy/20 !text-navy hover:!bg-navy/5">
                Join Next Expedition
              </Button>
            </div>
          </div>
        </div>

        {/* 5. CALL TO ACTION */}
        <div className="rounded-[40px] bg-navy text-white p-10 sm:p-16 lg:p-20 relative overflow-hidden shadow-lift">
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <span className="inline-block bg-white/10 rounded-full px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-widest mb-6">
              Create Your Own Stories
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6">
              Ready to Be in the Next Frame?
            </h2>
            <p className="text-lg text-white/80 max-w-xl mb-10 leading-relaxed">
              Join us for certified diving, reef safaris, and surfing camps. Experience the serenity that only the ocean can offer.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Button as={Link} to="/book-us" className="bg-accent text-navy hover:bg-white hover:text-navy border-none">
                Book Your Dive Adventure →
              </Button>
              <Button as={Link} to="/contact" variant="secondary" className="!border-white/30 !text-white hover:!bg-white/10">
                Inquire With Us
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* 6. FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImageIndex !== null && currentItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-md">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-accent hover:scale-110"
              aria-label="Close Lightbox"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Left Nav */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage() }}
              className="absolute left-4 sm:left-8 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-accent hover:scale-110"
              aria-label="Previous image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Nav */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              className="absolute right-4 sm:right-8 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-accent hover:scale-110"
              aria-label="Next image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[90vh] max-w-5xl w-full flex flex-col rounded-3xl overflow-hidden bg-navy/95 border border-white/20 shadow-2xl text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-h-[68vh] flex items-center justify-center bg-black/40 overflow-hidden">
                <img
                  src={currentItem.src}
                  alt={currentItem.title}
                  className="max-h-[68vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="p-6 sm:p-8 bg-navy flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="rounded-full bg-accent/20 text-accent px-2.5 py-0.5 text-xs font-bold">
                      {currentItem.categoryLabel}
                    </span>
                    <span className="text-xs text-white/60 font-medium">{currentItem.location}</span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold">{currentItem.title}</h3>
                  <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-2xl">{currentItem.desc}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-bold text-white/50">
                    {selectedImageIndex + 1} of {filteredItems.length}
                  </span>
                  <Button as={Link} to="/book-us" className="bg-accent text-navy text-xs py-2.5 px-4 font-bold border-none hover:bg-white">
                    Book Trip
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
