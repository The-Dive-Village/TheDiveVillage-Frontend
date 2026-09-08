import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import merch1 from '../assets/New folder/merch1.jpg'
import merch2 from '../assets/New folder/merch2.jpg'
import merch3 from '../assets/New folder/merch3.jpg'
import merch4 from '../assets/New folder/merch4.jpg'
import merch5 from '../assets/New folder/merch 5.mp4'

export const MERCH_MEDIA_ITEMS = [
  { id: 'm1', src: merch1, type: 'image', alt: 'Customer Merch 1' },
  { id: 'm2', src: merch2, type: 'image', alt: 'Customer Merch 2' },
  { id: 'm3', src: merch3, type: 'image', alt: 'Customer Merch 3' },
  { id: 'm4', src: merch4, type: 'image', alt: 'Customer Merch 4' },
  { id: 'm5', src: merch5, type: 'video', alt: 'Customer Merch 5' },
]

export default function CustomerReviews({ className = '' }) {
  const [activeMedia, setActiveMedia] = useState(null)

  return (
    <section className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 ${className}`} id="customer-reviews">
      {/* Section Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-block rounded-full bg-navy/10 border border-navy/20 px-4 py-1.5 text-xs font-bold text-navy uppercase tracking-widest mb-3">
          Community Showcase
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
          Customer Reviews
        </h2>
      </div>

      {/* Media Grid: 5 Items (Images & Video) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {MERCH_MEDIA_ITEMS.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setActiveMedia(item)}
            className="group relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-[#EAEFF4] border border-navy/10 shadow-card hover:shadow-float hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
          >
            {item.type === 'video' ? (
              <div className="w-full h-full relative">
                <video
                  src={item.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-navy/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  Video
                </div>
              </div>
            ) : (
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}

            {/* Hover Glass Overlay */}
            <div className="absolute inset-0 bg-navy/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-navy shadow-lg">
                🔍 View
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeMedia && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer"
            onClick={() => setActiveMedia(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden bg-black flex items-center justify-center shadow-2xl border border-white/20"
            >
              <button
                type="button"
                onClick={() => setActiveMedia(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center font-bold text-lg hover:bg-black transition cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>

              {activeMedia.type === 'video' ? (
                <video
                  src={activeMedia.src}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="max-h-[85vh] max-w-full object-contain"
                />
              ) : (
                <img
                  src={activeMedia.src}
                  alt={activeMedia.alt}
                  className="max-h-[85vh] max-w-full object-contain"
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
