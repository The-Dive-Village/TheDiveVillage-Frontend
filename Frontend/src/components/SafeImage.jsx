import { useState, useRef, useMemo, useEffect } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import {
  getLqipUrl,
  getOptimizedImageUrl,
  getResponsiveSrcSet,
  MEDIA_PRESETS,
  isMediaLoaded,
  markMediaLoaded,
} from '../utils/mediaOptimizer'

function Placeholder({ alt, className }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-[#00172b] text-white/50 ${className}`}
      role="img"
      aria-label={alt || 'Image unavailable'}
    >
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="#00AEC7" strokeWidth="1.5" />
        <path
          d="M7 14c2-3 4-4.5 6-5 0 2.5-.5 5-2 7-2 .6-3.5.2-4-2z"
          fill="#003865"
          opacity="0.85"
        />
        <circle cx="15.5" cy="8.5" r="1.5" fill="#FF6106" />
      </svg>
      <span className="text-[11px] font-heading font-semibold text-white/50">TheDiveVillage</span>
    </div>
  )
}

export default function SafeImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  priority = false,
  responsive = false,
  preset = null,
  targetWidth = null,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px',
  aspectRatio = null,
  width = null,
  height = null,
  lqip = true,
  disableParallax = true,
  onLoad,
  onError,
  ...props
}) {
  const resolvedWidth = useMemo(() => {
    if (targetWidth) return targetWidth
    if (preset && MEDIA_PRESETS[preset]) return MEDIA_PRESETS[preset].width
    return 900
  }, [targetWidth, preset])

  const targetSrc = useMemo(() => {
    if (!src) return ''
    return getOptimizedImageUrl(src, { width: resolvedWidth }) || src
  }, [src, resolvedWidth])

  const srcSet = useMemo(() => {
    if (!responsive || !src || !src.includes('res.cloudinary.com')) return undefined
    const widths = [320, 480, 640, 800, 1024, 1280, 1600]
    return getResponsiveSrcSet(src, widths)
  }, [responsive, src])

  // Check if image is already cached or previously loaded in this session
  const alreadyCached = useMemo(() => isMediaLoaded(targetSrc), [targetSrc])
  const [loaded, setLoaded] = useState(alreadyCached || priority)
  const [failed, setFailed] = useState(false)
  const imgRef = useRef(null)
  const containerRef = useRef(null)
  const reduce = useReducedMotion()

  // Reset when src changes
  useEffect(() => {
    const isCached = isMediaLoaded(targetSrc)
    if (isCached || priority) {
      setLoaded(true)
    } else {
      setLoaded(false)
    }
    setFailed(false)
  }, [targetSrc, priority])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Parallax shifts image up and down within its bounds
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  // Ultra-lightweight ~400-byte Low Quality Image Placeholder
  const lqipUrl = useMemo(() => {
    if (!lqip || !src || alreadyCached || priority) return null
    return getLqipUrl(src)
  }, [src, lqip, alreadyCached, priority])

  // Check if browser has it in memory cache already on mount
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0 && !loaded) {
      setLoaded(true)
      markMediaLoaded(targetSrc)
    }
  }, [targetSrc, loaded])

  const handleLoadSuccess = (e) => {
    setLoaded(true)
    markMediaLoaded(targetSrc)
    if (typeof onLoad === 'function') {
      onLoad(e)
    }
  }

  const handleLoadError = (e) => {
    setFailed(true)
    if (typeof onError === 'function') {
      onError(e)
    }
  }

  if (!src || failed) {
    return (
      <div
        className={`overflow-hidden relative bg-[#00172b] ${className}`}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <Placeholder alt={alt} className="w-full h-full" />
      </div>
    )
  }

  const useParallaxMotion = !reduce && !disableParallax

  const containerStyle = {
    ...(aspectRatio ? { aspectRatio } : {}),
  }

  const baseImgProps = {
    ref: imgRef,
    src: targetSrc,
    srcSet,
    sizes: srcSet ? sizes : undefined,
    alt,
    width: width || undefined,
    height: height || undefined,
    loading: priority ? 'eager' : 'lazy',
    fetchPriority: priority ? 'high' : 'auto',
    decoding: priority ? 'sync' : 'async',
    onLoad: handleLoadSuccess,
    onError: handleLoadError,
    className: `h-full w-full ${imgClassName?.includes('object-') ? '' : 'object-cover'} relative z-[1] ${
      loaded ? 'opacity-100' : 'opacity-0'
    } ${alreadyCached || priority ? '' : 'transition-opacity duration-300 ease-out'} ${imgClassName}`,
    ...props,
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden relative bg-[#00172b] ${className}`}
      style={containerStyle}
    >
      {/* 1. Low Quality Image Placeholder (LQIP): Instant blurred frame */}
      {lqipUrl && !alreadyCached && !priority && (
        <img
          src={lqipUrl}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={`absolute inset-0 w-full h-full ${imgClassName?.includes('object-') ? '' : 'object-cover'} filter blur-[10px] scale-110 pointer-events-none z-0 ${imgClassName}`}
        />
      )}

      {/* 2. Proper High-Resolution Responsive Media */}
      {useParallaxMotion ? (
        <motion.img
          style={{ y, scale: 1.25 }}
          {...baseImgProps}
        />
      ) : (
        <img {...baseImgProps} />
      )}
    </div>
  )
}
