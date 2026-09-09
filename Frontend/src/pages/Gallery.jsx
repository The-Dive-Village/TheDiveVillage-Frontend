import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Button from '../components/Button'
import SafeImage from '../components/SafeImage'
import LazyVideo from '../components/LazyVideo'
import SEOHead from '../components/SEOHead'
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from '../utils/galleryData'

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null)
  const reduce = useReducedMotion()

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true
    if (activeCategory === 'videos') return item.type === 'video'
    if (activeCategory === 'photos') return item.type === 'image'
    return item.category === activeCategory
  })

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedMediaIndex === null) return
      if (e.key === 'Escape') setSelectedMediaIndex(null)
      if (e.key === 'ArrowRight') {
        setSelectedMediaIndex((prev) => (prev + 1) % filteredItems.length)
      }
      if (e.key === 'ArrowLeft') {
        setSelectedMediaIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedMediaIndex, filteredItems.length])

  const openLightbox = (index) => {
    setSelectedMediaIndex(index)
  }

  const nextMedia = () => {
    setSelectedMediaIndex((prev) => (prev + 1) % filteredItems.length)
  }

  const prevMedia = () => {
    setSelectedMediaIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
  }

  const currentItem = selectedMediaIndex !== null ? filteredItems[selectedMediaIndex] : null

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
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key)
                setSelectedMediaIndex(null)
              }}
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
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
              transition={{ delay: Math.min(idx * 0.03, 0.3) }}
              className="group relative rounded-[28px] overflow-hidden bg-navy/10 shadow-card hover:shadow-float transition duration-300 aspect-[4/3] cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              {item.type === 'video' ? (
                <LazyVideo
                  src={item.src}
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <SafeImage
                  src={item.src}
                  alt="Gallery item"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              )}

              {/* Hover Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
              
              {/* Top Media Type Badge */}
              <div className="absolute top-4 left-4">
                <span className="rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-sm flex items-center gap-1.5">
                  {item.type === 'video' ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      Video
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      Photo
                    </>
                  )}
                </span>
              </div>

              {/* Expand / Play Icon on Hover */}
              <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-110">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
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
                Every moment tells a story of discovery and courage. Share your dive logs, underwater encounters, and island moments with <span className="font-bold text-navy">@TheDiveVillage</span> on Instagram to get featured on our wall.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-navy text-white px-8 py-4 text-center text-sm font-bold shadow-soft hover:bg-accent hover:text-navy transition"
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
        {selectedMediaIndex !== null && currentItem && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-md"
            onClick={() => setSelectedMediaIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMediaIndex(null)}
              className="absolute top-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-accent hover:text-navy hover:scale-110 cursor-pointer"
              aria-label="Close Lightbox"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Left Nav */}
            <button
              onClick={(e) => { e.stopPropagation(); prevMedia() }}
              className="absolute left-4 sm:left-8 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-accent hover:text-navy hover:scale-110 cursor-pointer"
              aria-label="Previous media"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Nav */}
            <button
              onClick={(e) => { e.stopPropagation(); nextMedia() }}
              className="absolute right-4 sm:right-8 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-accent hover:text-navy hover:scale-110 cursor-pointer"
              aria-label="Next media"
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
              className="relative max-h-[92vh] max-w-5xl w-full flex flex-col rounded-3xl overflow-hidden bg-navy/95 border border-white/20 shadow-2xl text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-h-[76vh] flex items-center justify-center bg-black/60 overflow-hidden">
                {currentItem.type === 'video' ? (
                  <video
                    src={currentItem.src}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="max-h-[76vh] w-auto max-w-full object-contain"
                  />
                ) : (
                  <img
                    src={currentItem.src}
                    alt="Gallery visual"
                    className="max-h-[76vh] w-auto max-w-full object-contain"
                  />
                )}
              </div>

              {/* Lightbox Footer Bar (clean, no titles or locations) */}
              <div className="p-4 sm:p-6 bg-navy flex justify-between items-center">
                <span className="text-xs sm:text-sm font-bold text-white/60 tracking-wider">
                  {selectedMediaIndex + 1} / {filteredItems.length}
                </span>

                <Button as={Link} to="/book-us" className="bg-accent text-navy text-xs py-2 px-5 font-bold border-none hover:bg-white hover:text-navy">
                  Join Expedition
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
