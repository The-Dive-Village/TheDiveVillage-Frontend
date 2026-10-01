import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import bannerImg from '../assets/banner.png'

const pop1 = 'https://res.cloudinary.com/bbgt5nk7/image/upload/v1790244009/dive-village/products/qqpya5ppncnjorf4csbf.jpg'
const pop2 = 'https://res.cloudinary.com/bbgt5nk7/image/upload/v1790244010/dive-village/products/zueb8bj6rg6iiit2wfqw.jpg'

export default function MerchBannerCTA({ className = '' }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/shop')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={`w-full ${className}`}>
      <div
        onClick={handleClick}
        className="group relative rounded-[24px] sm:rounded-[36px] lg:rounded-[40px] overflow-hidden bg-[#001428] shadow-lift border border-white/10 w-full aspect-[2170/725] flex items-center justify-end cursor-pointer transition-all duration-300 hover:scale-[1.008] hover:border-white/30"
      >
        <img
          src={bannerImg}
          alt="Merchandise Banner"
          className="w-full h-full object-contain sm:object-cover object-center pointer-events-none block"
        />

        {/* Left Side Bottom: View More Button */}
        <div className="absolute left-3.5 xs:left-5 sm:left-8 lg:left-12 bottom-3 xs:bottom-4 sm:bottom-6 lg:bottom-8 z-20 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 sm:gap-2.5 rounded-full bg-[#FFCD00] text-[#001e3d] px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold tracking-wide shadow-[0_4px_20px_rgba(255,205,0,0.45)] transition-all duration-300 group-hover:bg-white group-hover:scale-105">
            <span>View More</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Right Column: 3D Flipping Product Tag */}
        <div className="absolute right-3 sm:right-8 lg:right-12 top-0 bottom-0 z-10 shrink-0 h-full flex items-center pointer-events-none">
          <FlippingProductTag />
        </div>
      </div>
    </div>
  )
}

function FlippingProductTag() {
  return (
    <div className="relative h-full flex flex-col items-center justify-center select-none pointer-events-none py-2 sm:py-4">
      {/* Hanging Cord */}
      <div className="w-0.5 h-3 sm:h-5 lg:h-6 bg-gradient-to-b from-white/40 via-[#FFCD00] to-white/60 shadow-sm mb-[-2px] relative z-20 shrink-0">
        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#FFCD00] -top-1 -left-[2px] sm:-left-[3px] absolute shadow-sm" />
      </div>

      {/* 3D Perspective Container matched to exact 447x864 image aspect ratio */}
      <div className="perspective-1000 h-[calc(100%-12px)] sm:h-[calc(100%-20px)] max-h-[180px] sm:max-h-[260px] lg:max-h-[330px] aspect-[447/864] relative">
        <motion.div
          animate={{ rotateY: -360 }}
          transition={{
            duration: 18,
            ease: 'linear',
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="w-full h-full preserve-3d relative rounded-xl sm:rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* FRONT SIDE (pop1.jpeg) */}
          <div
            className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl overflow-hidden backface-hidden bg-transparent"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <img
              src={pop1}
              alt="Product Tag Front"
              className="w-full h-full object-fill rounded-xl sm:rounded-2xl"
            />
          </div>

          {/* BACK SIDE (pop2.jpeg) */}
          <div
            className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl overflow-hidden backface-hidden bg-transparent"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <img
              src={pop2}
              alt="Product Tag Back"
              className="w-full h-full object-fill rounded-xl sm:rounded-2xl"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
