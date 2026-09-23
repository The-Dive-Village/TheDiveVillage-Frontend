import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Button from '../components/Button'
import SafeImage from '../components/SafeImage'
import LazyVideo from '../components/LazyVideo'
import SEOHead from '../components/SEOHead'
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from '../utils/galleryData'
import { contentService } from '../services/contentService'
import ctaVideo from '../assets/New folder/Dive.MP4'

export default function Gallery() {
  const [itemsList, setItemsList] = useState(GALLERY_ITEMS)
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await contentService.getGallery()
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const mapped = res.data.data.map((item) => ({
            id: item.id,
            title: item.title || 'Underwater Moment',
            species: item.species || item.subtitle || undefined,
            category: item.category ? item.category.toLowerCase() : 'underwater',
            location: item.location || 'The Dive Village',
            type: (item.mediaType || 'IMAGE').toLowerCase(),
            src: item.src,
            poster: item.thumbnail || undefined,
            thumbnail: item.thumbnail || item.src,
          }))
          setItemsList(mapped)
        }
      } catch (err) {
        console.warn('Could not load live gallery from DB, using fallback:', err)
      }
    }
    loadGallery()
  }, [])

  const filteredItems = itemsList.filter((item) => {
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
            Moments frozen in time beneath the waves. Explore our underwater expeditions, marine encounters, species identification, and village life.
          </p>
        </div>

        {/* 2. CATEGORIES FILTER */}
        <div className="flex gap-2 sm:gap-3 mb-12 border-b border-navy/10 pb-6 overflow-x-auto scrollbar-none flex-nowrap sm:flex-wrap">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key)
                setSelectedMediaIndex(null)
              }}
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
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
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 lg:gap-8 mb-16 sm:mb-24">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.25) }}
              className="group flex flex-col rounded-xl sm:rounded-[24px] overflow-hidden bg-white border border-navy/10 shadow-sm hover:shadow-xl hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              {/* Media Container */}
              <div className="relative aspect-square sm:aspect-[16/11] w-full overflow-hidden bg-navy/10">
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
                    alt={item.title || 'Gallery item'}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                )}

                {/* Serial Number Badge */}
                <div className="absolute top-1.5 left-1.5 sm:top-3.5 sm:left-3.5 z-10 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-navy/85 backdrop-blur-md border border-white/20 text-accent font-heading font-bold text-[8px] sm:text-xs shadow-md tracking-wider">
                  #{String(idx + 1).padStart(2, '0')}
                </div>

                {/* Hover Dark Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                
                {/* Expand Icon on Hover */}
                <div className="absolute top-1.5 right-1.5 sm:top-3.5 sm:right-3.5 h-6 w-6 sm:h-9 sm:w-9 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-110 shadow-md [&>svg]:w-2.5 [&>svg]:h-2.5 sm:[&>svg]:w-4 sm:[&>svg]:h-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
              </div>

              {/* Information Panel Below Media - Title and Serial Number */}
              <div className="p-1.5 sm:p-5 flex items-center justify-between gap-1 sm:gap-3 bg-white">
                <h3 className="font-heading text-[10px] xs:text-xs sm:text-lg font-bold text-navy group-hover:text-accent transition duration-200 line-clamp-1 flex-1 leading-tight">
                  {item.title}
                </h3>
                <span className="text-[8px] sm:text-xs font-bold font-mono text-navy/50 bg-[#F0F2F5] px-1 sm:px-2 py-0.5 rounded-full shrink-0 hidden xs:inline sm:inline">
                  #{String(idx + 1).padStart(2, '0')}
                </span>
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

        {/* 5. CALL TO ACTION WITH BACKGROUND VIDEO */}
        <div className="rounded-[40px] bg-navy text-white p-10 sm:p-16 lg:p-20 relative overflow-hidden shadow-lift group border border-white/10">
          {/* Background Video */}
          <video
            src={ctaVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] group-hover:scale-105 opacity-50 z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/40 z-0" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none z-0" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-block bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-widest mb-6 border border-white/10">
              Create Your Own Stories
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6">
              Ready to Be in the Next Frame?
            </h2>
            <p className="text-lg text-white/80 max-w-xl mb-10 leading-relaxed font-medium">
              Join us for certified diving, reef safaris, and surfing camps. Experience the serenity that only the ocean can offer.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Button as={Link} to="/book-us" variant="primary">
                Book Your Dive Adventure →
              </Button>
              <Button as={Link} to="/contact" variant="secondary">
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 sm:p-6 backdrop-blur-md"
            onClick={() => setSelectedMediaIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMediaIndex(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-accent hover:text-navy hover:scale-110 cursor-pointer shadow-lg backdrop-blur-md"
              aria-label="Close Lightbox"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Left Nav */}
            <button
              onClick={(e) => { e.stopPropagation(); prevMedia() }}
              className="absolute left-2 sm:left-8 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-accent hover:text-navy hover:scale-110 cursor-pointer shadow-lg backdrop-blur-md"
              aria-label="Previous media"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Nav */}
            <button
              onClick={(e) => { e.stopPropagation(); nextMedia() }}
              className="absolute right-2 sm:right-8 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-accent hover:text-navy hover:scale-110 cursor-pointer shadow-lg backdrop-blur-md"
              aria-label="Next media"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[92vh] max-w-5xl w-full flex flex-col rounded-3xl overflow-hidden bg-[#001e3d] border border-white/20 shadow-2xl text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-h-[70vh] flex items-center justify-center bg-black/70 overflow-hidden">
                {currentItem.type === 'video' ? (
                  <video
                    src={currentItem.src}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="max-h-[70vh] w-auto max-w-full object-contain"
                  />
                ) : (
                  <img
                    src={currentItem.src}
                    alt={currentItem.title || 'Gallery visual'}
                    className="max-h-[70vh] w-auto max-w-full object-contain"
                  />
                )}
              </div>

              {/* Lightbox Footer Bar - Title, Serial Number, Action */}
              <div className="p-5 sm:p-6 bg-[#001830] border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 max-w-2xl">
                  <span className="text-xs sm:text-sm font-bold font-mono text-accent bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 shrink-0">
                    #{String(selectedMediaIndex + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-lg sm:text-2xl font-bold font-heading text-white">
                    {currentItem.title}
                  </h2>
                </div>

                <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xs sm:text-sm font-bold text-white/60 tracking-wider">
                    {selectedMediaIndex + 1} / {filteredItems.length}
                  </span>
                  <Button as={Link} to="/book-us" variant="primary" className="text-xs sm:text-sm py-2 px-5 font-bold shadow-md">
                    Join Expedition
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
