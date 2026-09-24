import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Button from '../components/Button'
import SafeImage from '../components/SafeImage'
import LazyVideo from '../components/LazyVideo'
import SEOHead from '../components/SEOHead'
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from '../utils/galleryData'
import { contentService } from '../services/contentService'
import { triggerHaptic } from '../utils/haptics'
import { shareContent } from '../utils/share'
import ctaVideo from '../assets/New folder/Dive.MP4'

export default function Gallery() {
  const [itemsList, setItemsList] = useState(GALLERY_ITEMS)
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null)
  const [lightboxZoom, setLightboxZoom] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStartRef = useRef({ x: 0, y: 0 })
  const filmstripRef = useRef(null)
  const reduce = useReducedMotion()

  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const filteredItems = useMemo(() => {
    return itemsList.filter((item) => {
      if (activeCategory === 'all') return true
      if (activeCategory === 'videos') return item.type === 'video'
      if (activeCategory === 'photos') return item.type === 'image'
      return item.category === activeCategory
    })
  }, [itemsList, activeCategory])

  // Reset zoom & pan when switching media in lightbox
  useEffect(() => {
    setLightboxZoom(1)
    setPanOffset({ x: 0, y: 0 })
  }, [selectedMediaIndex])

  // High-Res Preloading for adjacent images in Lightbox
  useEffect(() => {
    if (selectedMediaIndex === null || !filteredItems.length) return
    const prevIdx = (selectedMediaIndex - 1 + filteredItems.length) % filteredItems.length
    const nextIdx = (selectedMediaIndex + 1) % filteredItems.length

    ;[prevIdx, nextIdx].forEach((idx) => {
      const item = filteredItems[idx]
      if (item && item.type !== 'video' && item.src) {
        const img = new Image()
        img.src = item.src
      }
    })
  }, [selectedMediaIndex, filteredItems])

  // Scroll active thumbnail into center view
  useEffect(() => {
    if (selectedMediaIndex !== null && filmstripRef.current) {
      const activeEl = filmstripRef.current.children[selectedMediaIndex]
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [selectedMediaIndex])

  const handleLightboxTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleLightboxTouchEnd = (e) => {
    if (lightboxZoom > 1) return // Ignore swipe if zoomed in
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const deltaY = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        nextMedia()
      } else {
        prevMedia()
      }
    }
  }

  const handleWheelZoom = (e) => {
    if (currentItem?.type === 'video') return
    e.preventDefault()
    const zoomDelta = e.deltaY < 0 ? 0.25 : -0.25
    setLightboxZoom((prev) => {
      const next = Math.min(Math.max(1, prev + zoomDelta), 3.5)
      if (next === 1) setPanOffset({ x: 0, y: 0 })
      return next
    })
  }

  const handleDoubleClickZoom = () => {
    if (currentItem?.type === 'video') return
    if (lightboxZoom > 1) {
      setLightboxZoom(1)
      setPanOffset({ x: 0, y: 0 })
    } else {
      setLightboxZoom(2.5)
    }
  }

  const handlePanMouseDown = (e) => {
    if (lightboxZoom <= 1) return
    setIsPanning(true)
    panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y }
  }

  const handlePanMouseMove = (e) => {
    if (!isPanning || lightboxZoom <= 1) return
    setPanOffset({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y
    })
  }

  const handlePanMouseUp = () => {
    setIsPanning(false)
  }

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

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedMediaIndex === null) return
      if (e.key === 'Escape') setSelectedMediaIndex(null)
      if (e.key === 'ArrowRight') {
        triggerHaptic(8)
        setSelectedMediaIndex((prev) => (prev + 1) % filteredItems.length)
      }
      if (e.key === 'ArrowLeft') {
        triggerHaptic(8)
        setSelectedMediaIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedMediaIndex, filteredItems.length])

  const openLightbox = (index) => {
    triggerHaptic(10)
    setSelectedMediaIndex(index)
  }

  const nextMedia = () => {
    triggerHaptic(8)
    setSelectedMediaIndex((prev) => (prev + 1) % filteredItems.length)
  }

  const prevMedia = () => {
    triggerHaptic(8)
    setSelectedMediaIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
  }

  const currentItem = selectedMediaIndex !== null ? filteredItems[selectedMediaIndex] : null

  const handleShareVisual = async (item = currentItem) => {
    if (!item) return
    triggerHaptic(15)
    await shareContent({
      title: `${item.title || 'Underwater Visual'} | The Dive Village Gallery`,
      text: `Explore this stunning underwater moment from The Dive Village!`,
      url: window.location.href,
    })
  }

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
                triggerHaptic(8)
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
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8 mb-16 sm:mb-24">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.25) }}
              className="group flex flex-col rounded-2xl sm:rounded-[24px] overflow-hidden bg-white border border-navy/10 shadow-sm hover:shadow-xl hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              {/* Media Container */}
              <div className="relative aspect-[4/3] xs:aspect-square sm:aspect-[16/11] w-full overflow-hidden bg-navy/10">
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
                <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-navy/85 backdrop-blur-md border border-white/20 text-accent font-heading font-bold text-[9px] sm:text-xs shadow-md tracking-wider">
                  #{String(idx + 1).padStart(2, '0')}
                </div>

                {/* Hover Dark Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                
                {/* Expand Icon on Hover */}
                <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-110 shadow-md [&>svg]:w-3 [&>svg]:h-3 sm:[&>svg]:w-4 sm:[&>svg]:h-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
              </div>

              {/* Information Panel Below Media - Title and Serial Number */}
              <div className="p-3 sm:p-5 flex items-center justify-between gap-2 sm:gap-3 bg-white">
                <h3 className="font-heading text-xs xs:text-sm sm:text-lg font-bold text-navy group-hover:text-accent transition duration-200 line-clamp-1 flex-1 leading-tight">
                  {item.title}
                </h3>
                <span className="text-[9px] sm:text-xs font-bold font-mono text-navy/50 bg-[#F0F2F5] px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
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
            onTouchStart={handleLightboxTouchStart}
            onTouchEnd={handleLightboxTouchEnd}
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
              className="relative max-h-[94vh] max-w-5xl w-full flex flex-col rounded-3xl overflow-hidden bg-[#001e3d] border border-white/20 shadow-2xl text-white select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Media Stage with Wheel Zoom & Pan Dragging */}
              <div 
                className={`relative w-full h-[52vh] sm:h-[60vh] flex items-center justify-center bg-black/80 overflow-hidden ${lightboxZoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
                onWheel={handleWheelZoom}
                onDoubleClick={handleDoubleClickZoom}
                onMouseDown={handlePanMouseDown}
                onMouseMove={handlePanMouseMove}
                onMouseUp={handlePanMouseUp}
                onMouseLeave={handlePanMouseUp}
              >
                {currentItem.type === 'video' ? (
                  <video
                    src={currentItem.src}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="max-h-full w-auto max-w-full object-contain"
                  />
                ) : (
                  <img
                    src={currentItem.src}
                    alt={currentItem.title || 'Gallery visual'}
                    draggable={false}
                    className="max-h-full w-auto max-w-full object-contain transition-transform duration-100 ease-out select-none pointer-events-none"
                    style={{
                      transform: `scale(${lightboxZoom}) translate(${panOffset.x / lightboxZoom}px, ${panOffset.y / lightboxZoom}px)`,
                    }}
                  />
                )}

                {/* Floating Desktop Zoom Status Badge & Hints */}
                {currentItem.type !== 'video' && (
                  <div className="hidden sm:flex absolute bottom-3 right-3 items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono border border-white/10 z-10">
                    <button
                      type="button"
                      onClick={() => setLightboxZoom((prev) => Math.max(1, prev - 0.5))}
                      className="hover:text-accent font-bold px-1 transition"
                      title="Zoom Out"
                    >
                      −
                    </button>
                    <span className="text-accent font-bold px-1">{Math.round(lightboxZoom * 100)}%</span>
                    <button
                      type="button"
                      onClick={() => setLightboxZoom((prev) => Math.min(3.5, prev + 0.5))}
                      className="hover:text-accent font-bold px-1 transition"
                      title="Zoom In"
                    >
                      +
                    </button>
                    {lightboxZoom > 1 && (
                      <button
                        type="button"
                        onClick={() => { setLightboxZoom(1); setPanOffset({ x: 0, y: 0 }); }}
                        className="text-[10px] uppercase font-bold text-white/70 hover:text-white ml-1 border-l border-white/20 pl-1.5 transition"
                      >
                        Reset
                      </button>
                    )}
                    <span className="text-[9px] text-white/50 ml-1 hidden md:inline">
                      (Scroll wheel / Double-click to zoom)
                    </span>
                  </div>
                )}
              </div>

              {/* Desktop Bottom Thumbnail Strip */}
              <div 
                ref={filmstripRef}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#001428] border-t border-white/10 overflow-x-auto scrollbar-none"
              >
                {filteredItems.map((thumbItem, tIdx) => {
                  const isActive = tIdx === selectedMediaIndex
                  return (
                    <button
                      key={thumbItem.id || tIdx}
                      type="button"
                      onClick={() => {
                        triggerHaptic(8)
                        setSelectedMediaIndex(tIdx)
                      }}
                      className={`relative shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'border-accent scale-105 shadow-md shadow-accent/20 opacity-100 ring-2 ring-accent/40'
                          : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/40'
                      }`}
                      title={thumbItem.title}
                    >
                      <img
                        src={thumbItem.thumbnail || thumbItem.poster || thumbItem.src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {thumbItem.type === 'video' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[9px]">
                          ▶
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Lightbox Footer Bar - Title, Serial Number, Native Share, Action */}
              <div className="p-3.5 sm:p-5 bg-[#001830] border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 max-w-2xl min-w-0">
                  <span className="text-xs sm:text-sm font-bold font-mono text-accent bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 shrink-0">
                    #{String(selectedMediaIndex + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-sm sm:text-xl font-bold font-heading text-white truncate">
                    {currentItem.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleShareVisual(currentItem)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition active:scale-95 cursor-pointer shadow-sm"
                    title="Share this visual"
                    aria-label="Share visual"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                    <span>Share</span>
                  </button>

                  <span className="text-xs sm:text-sm font-bold text-white/60 tracking-wider">
                    {selectedMediaIndex + 1} / {filteredItems.length}
                  </span>

                  <Button as={Link} to="/book-us" variant="primary" className="text-xs sm:text-sm py-1.5 sm:py-2 px-3.5 sm:px-5 font-bold shadow-md">
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
