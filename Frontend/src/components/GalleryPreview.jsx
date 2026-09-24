import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import SectionReveal from './SectionReveal'
import Button from './Button'
import { GALLERY_ITEMS } from '../utils/galleryData'
import { contentService } from '../services/contentService'

export default function GalleryPreview() {
  const navigate = useNavigate()
  const scrollContainerRef = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const [isHovered, setIsHovered] = useState(false)
  const [itemsList, setItemsList] = useState(GALLERY_ITEMS)

  useEffect(() => {
    async function loadGalleryPreview() {
      try {
        const res = await contentService.getGallery()
        const rawItems = res.data?.data?.items || (Array.isArray(res.data?.data) ? res.data.data : [])
        if (Array.isArray(rawItems) && rawItems.length > 0) {
          const dbMapped = rawItems.map((item) => ({
            id: item.id,
            title: item.title || 'Underwater Moment',
            category: item.category ? item.category.toLowerCase() : 'photos',
            type: (item.type || item.mediaType || 'image').toLowerCase(),
            src: item.src,
          }))
          const hasDbVideos = dbMapped.some((item) => item.type === 'video')
          if (hasDbVideos) {
            setItemsList(dbMapped)
          } else {
            const localVideos = GALLERY_ITEMS.filter((g) => g.type === 'video')
            setItemsList([...dbMapped, ...localVideos])
          }
        }
      } catch (err) {
        console.warn('Could not load live gallery preview from DB:', err)
      }
    }
    loadGalleryPreview()
  }, [])

  const previewItems = itemsList.slice(0, 16)

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
          <h2
            className="font-heading text-h2 font-bold text-white"
            style={{ textShadow: '0 2px 14px rgba(0, 0, 0, 0.85), 0 1px 4px rgba(0, 0, 0, 0.95)' }}
          >
            The Dive Village <span className="font-heading font-bold text-accent">Gallery</span>
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-white font-medium text-center"
            style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.85), 0 1px 4px rgba(0, 0, 0, 0.95)' }}
          >
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
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-navy/80 border border-white/30 text-white flex items-center justify-center shadow-2xl backdrop-blur-md hover:bg-accent hover:text-navy transition-all duration-300 cursor-pointer"
          aria-label="Previous Gallery Image"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[22px] sm:h-[22px]">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 sm:left-auto sm:right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-navy/80 border border-white/30 text-white flex items-center justify-center shadow-2xl backdrop-blur-md hover:bg-accent hover:text-navy transition-all duration-300 cursor-pointer"
          aria-label="Next Gallery Image"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[22px] sm:h-[22px]">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(0,15,40,0.8), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, rgba(0,15,40,0.8), transparent)' }} />

        <div 
          ref={scrollContainerRef}
          onMouseDown={handlePointerDown}
          onMouseLeave={handlePointerLeave}
          onMouseUp={handlePointerUp}
          onMouseMove={handlePointerMove}
          className="flex gap-2.5 sm:gap-4 overflow-x-auto scrollbar-none no-scrollbar cursor-grab active:cursor-grabbing select-none py-2 px-3 sm:px-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {[...previewItems, ...previewItems, ...previewItems].map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              onClick={goToGallery}
              className="relative flex-shrink-0 w-[44vw] min-w-[155px] max-w-[210px] aspect-square sm:aspect-auto sm:w-[230px] sm:h-[310px] lg:w-[260px] lg:h-[350px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl group cursor-pointer bg-navy/20"
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
              {/* Overlay with Title and Serial Number */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent flex flex-col justify-end p-2.5 sm:p-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[9px] sm:text-[11px] font-bold font-mono text-accent bg-black/40 px-1.5 py-0.5 rounded border border-white/10 shrink-0">
                    #{String((i % previewItems.length) + 1).padStart(2, '0')}
                  </span>
                  <h4 className="text-white font-heading font-bold text-xs sm:text-base leading-tight drop-shadow-md truncate">
                    {item.title}
                  </h4>
                </div>
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
