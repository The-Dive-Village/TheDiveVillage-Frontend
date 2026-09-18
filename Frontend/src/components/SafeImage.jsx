import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

function Placeholder({ alt, className }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-accent/10 text-white ${className}`}
      role="img"
      aria-label={alt || 'Image unavailable'}
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="#00AEC7" strokeWidth="1.5" />
        <path
          d="M7 14c2-3 4-4.5 6-5 0 2.5-.5 5-2 7-2 .6-3.5.2-4-2z"
          fill="#003865"
          opacity="0.85"
        />
        <circle cx="15.5" cy="8.5" r="1.5" fill="#FF6106" />
      </svg>
      <span className="text-xs font-heading font-semibold text-white/70">TheDiveVillage</span>
    </div>
  )
}

export default function SafeImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  ...props
}) {
  const [failed, setFailed] = useState(false)
  const containerRef = useRef(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  // Parallax shifts image up and down within its bounds. We use a larger scale to prevent edges showing.
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  if (!src || failed) {
    return <div className={className} />
  }

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <motion.img
        style={reduce ? {} : { y, scale: 1.25 }}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${imgClassName}`}
        {...props}
      />
    </div>
  )
}
