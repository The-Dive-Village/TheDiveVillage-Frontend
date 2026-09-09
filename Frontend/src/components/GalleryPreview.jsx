import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import SectionReveal from './SectionReveal'
import Button from './Button'

import c1 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.42 AM (1).jpeg'
import c2 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.42 AM.jpeg'
import c3 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.43 AM (1).jpeg'
import c4 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.43 AM (2).jpeg'
import c5 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.43 AM.jpeg'
import c6 from '../assets/Carosel/WhatsApp Image 2026-07-31 at 9.36.44 AM.jpeg'

const GALLERY_IMAGES = [c1, c2, c3, c4, c5, c6]

export default function GalleryPreview() {
  const navigate = useNavigate()
  const scrollContainerRef = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const [isHovered, setIsHovered] = useState(false)

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
          <h2 className="font-heading text-h2 font-bold text-white">
            The Dive Village <em className="font-heading italic font-bold text-accent">Gallery</em>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80 text-justify">
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
          {[...GALLERY_IMAGES, ...GALLERY_IMAGES, ...GALLERY_IMAGES, ...GALLERY_IMAGES].map((src, i) => (
            <div
              key={i}
              onClick={goToGallery}
              className="relative flex-shrink-0 w-[280px] h-[380px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl group cursor-pointer"
            >
              <img
                src={src}
                alt={`Gallery ${(i % 6) + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
