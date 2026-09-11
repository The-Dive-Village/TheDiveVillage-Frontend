import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import SectionReveal from './SectionReveal'
import Button from './Button'
import { GALLERY_ITEMS } from '../utils/galleryData'

export default function GalleryPreview() {
  const navigate = useNavigate()
  const scrollContainerRef = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const [isHovered, setIsHovered] = useState(false)

  const previewItems = GALLERY_ITEMS.slice(0, 16)

  const goToGallery = () => navigate('/gallery')

  // Auto scroll from left to right using smooth requestAnimationFrame
  useEffect(() => {
    let animId
    let lastTime = performance.now()
    let cachedThirdWidth = scrollContainerRef.current ? scrollContainerRef.current.scrollWidth / 3 : 1000

    const handleResize = () => {
      if (scrollContainerRef.current) {
        cachedThirdWidth = scrollContainerRef.current.scrollWidth / 3
      }
    }
    window.addEventListener('resize', handleResize, { passive: true })

    const loop = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000
      lastTime = currentTime

      if (!isDragging.current && !isHovered && scrollContainerRef.current) {
        // Shift smoothly at ~60px/s
        scrollContainerRef.current.scrollLeft -= 60 * delta
        if (scrollContainerRef.current.scrollLeft <= 5) {
          scrollContainerRef.current.scrollLeft = cachedThirdWidth
        }
      }
      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [isHovered])

  // Initialize scroll position in the middle so left-to-right scrolling works instantly
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth / 3
    }
  }, [])

  const handlePrev = (e) => {
    e.stopPropagation()
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const handleNext = (e) => {
    e.stopPropagation()
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }

  const handlePointerDown = (e) => {
    isDragging.current = true
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft
    scrollLeft.current = scrollContainerRef.current.scrollLeft
  }

  const handlePointerLeave = () => {
    isDragging.current = false
    setIsHovered(false)
  }

  const handlePointerUp = () => {
    isDragging.current = false
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX.current) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk
  }

  return (
    <section id="gallery" className="relative py-16 sm:py-20 scroll-mt-20 pointer-events-auto overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="mb-12 text-center">
          <h2 className="font-heading text-h2 font-bold text-[#FFCD00] drop-shadow-md">
            The Dive Village <em className="font-heading italic font-bold text-[#FFCD00]">Gallery</em>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#00223D] font-bold text-base sm:text-lg text-center drop-shadow-xs">
            Where the sea is your classroom, playground, and escape.
          </p>
        </SectionReveal>
      </div>

      {/* Infinite scroll marquee & drag gallery with navigation arrows */}
      <div 
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-navy/80 border border-white/30 text-white flex items-center justify-center shadow-2xl backdrop-blur-md hover:bg-accent hover:text-navy transition-all duration-300 cursor-pointer"
          aria-label="Previous Gallery Image"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 sm:left-auto sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-navy/80 border border-white/30 text-white flex items-center justify-center shadow-2xl backdrop-blur-md hover:bg-accent hover:text-navy transition-all duration-300 cursor-pointer"
          aria-label="Next Gallery Image"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(0,15,40,0.8), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, rgba(0,15,40,0.8), transparent)' }} />

        <div 
          ref={scrollContainerRef}
          onMouseDown={handlePointerDown}
          onMouseLeave={handlePointerLeave}
          onMouseUp={handlePointerUp}
          onMouseMove={handlePointerMove}
          className="flex gap-4 overflow-x-auto scrollbar-none no-scrollbar cursor-grab active:cursor-grabbing select-none py-2 px-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {[...previewItems, ...previewItems, ...previewItems].map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              onClick={goToGallery}
              className="relative flex-shrink-0 w-[280px] h-[380px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl group cursor-pointer bg-navy/20"
            >
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
              )}
              {/* Overlay with ONLY Title and Location */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent flex flex-col justify-end p-4">
                <h4 className="text-white font-heading font-bold text-base leading-tight drop-shadow-md">
                  {item.title}
                </h4>
                {item.location && (
                  <p className="text-white/80 text-xs font-semibold mt-1 flex items-center gap-1 drop-shadow-sm">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#FFCD00] shrink-0">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="truncate">{item.location}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="mt-10 text-center">
          <Button
            onClick={goToGallery}
            variant="secondary"
            className="!border-white/30 !bg-white/15 !text-white backdrop-blur-xl transition-all duration-300 hover:!bg-[#FFCD00] hover:!text-navy hover:!border-[#FFCD00] shadow-md"
          >
            View Full Gallery
          </Button>
        </SectionReveal>
      </div>
    </section>
  )
}
