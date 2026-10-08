import LazyVideo from '../components/LazyVideo'
import { useParams, Link, useNavigate } from 'react-router'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SHOP_PRODUCTS } from '../utils/products'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { useAuth } from '../hooks/useAuth'
import Product3DViewer from '../components/Product3DViewer'
import SEOHead from '../components/SEOHead'
import { triggerHaptic, triggerSuccessHaptic } from '../utils/haptics'
import { shareContent } from '../utils/share'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addItem } = useCart()
  const { toggle: toggleWishlist, isWishlisted } = useWishlist()
  const sizeChartRef = useRef(null)

  const product = SHOP_PRODUCTS.find((p) => p.id === id) || SHOP_PRODUCTS[0]

  const relatedScrollRef = useRef(null)

  const scrollRelated = (direction) => {
    if (relatedScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320
      relatedScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const cap = SHOP_PRODUCTS.find((p) => p.id === 'product-dive-cap')
  const bag = SHOP_PRODUCTS.find((p) => p.id === 'product-ocean-bag')
  const others = SHOP_PRODUCTS.filter(
    (p) => p.id !== product.id && p.id !== 'product-dive-cap' && p.id !== 'product-ocean-bag'
  )

  let relatedProducts = []
  if (product.id === 'product-dive-cap') {
    relatedProducts = bag ? [bag, ...others] : others
  } else if (product.id === 'product-ocean-bag') {
    relatedProducts = cap ? [cap, ...others] : others
  } else {
    const priority = [cap, bag].filter(Boolean)
    relatedProducts = [...priority, ...others]
  }

  // Construct media items: 3D Model appears FIRST by default, followed by Front, Back, Open 1, Open 2, etc.
  const buildMediaItems = (p, color) => {
    const items = []
    const glbUrl = (color && p.glbByColor && p.glbByColor[color.name]) || p.glb
    if (glbUrl) {
      items.push({ type: 'glb', src: glbUrl, id: 'glb-0', label: '3D Model' })
    }
    if (p.images && p.images.length > 0) {
      const defaultLabels = ['Front', 'Back', 'Open 1', 'Open 2', 'Interior']
      p.images.forEach((img, idx) => {
        if (!img) return
        const label = p.imageLabels && p.imageLabels[idx] ? p.imageLabels[idx] : (defaultLabels[idx] || `View ${idx + 1}`)
        items.push({ type: 'image', src: img, id: `img-${idx}`, label })
      })
    } else if (p.image) {
      items.push({ type: 'image', src: p.image, id: 'img-front', label: 'Front' })
    }
    return items
  }

  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : { name: 'Standard', hex: '#FFFFFF' })
  const mediaItems = buildMediaItems(product, selectedColor)

  const [activeMedia, setActiveMedia] = useState(mediaItems[0] || null)
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : 'Standard')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('details')
  const [toastMessage, setToastMessage] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [floatingImage, setFloatingImage] = useState(null)
  const [floatingZoom, setFloatingZoom] = useState(1)

  const thumbsRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkThumbScroll = () => {
    if (!thumbsRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = thumbsRef.current
    setCanScrollLeft(scrollLeft > 5)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5)
  }

  const scrollThumbs = (direction) => {
    triggerHaptic(6)
    if (thumbsRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200
      thumbsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      checkThumbScroll()
    }, 150)
    window.addEventListener('resize', checkThumbScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkThumbScroll)
    }
  }, [mediaItems, activeMedia])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setFloatingImage(null)
    }
    if (floatingImage) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [floatingImage])

  const swipeTouchStartX = useRef(0)
  const swipeTouchStartY = useRef(0)

  const handleMediaTouchStart = (e) => {
    swipeTouchStartX.current = e.touches[0].clientX
    swipeTouchStartY.current = e.touches[0].clientY
  }

  const handleMediaTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - swipeTouchStartX.current
    const deltaY = e.changedTouches[0].clientY - swipeTouchStartY.current
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      const currentIndex = mediaItems.findIndex((m) => m.id === activeMedia?.id || m.src === activeMedia?.src)
      if (currentIndex !== -1) {
        if (deltaX < 0 && currentIndex < mediaItems.length - 1) {
          setActiveMedia(mediaItems[currentIndex + 1])
        } else if (deltaX > 0 && currentIndex > 0) {
          setActiveMedia(mediaItems[currentIndex - 1])
        }
      }
    }
  }

  useEffect(() => {
    const p = SHOP_PRODUCTS.find((item) => item.id === id) || SHOP_PRODUCTS[0]
    const initialColor = p.colors && p.colors.length > 0 ? p.colors[0] : { name: 'Standard', hex: '#FFFFFF' }
    setSelectedColor(initialColor)
    const items = buildMediaItems(p, initialColor)
    setActiveMedia(items[0] || null)
    if (p.sizes && p.sizes.length > 0) {
      setSelectedSize(p.sizes[0])
    }
    setQuantity(1)
  }, [id])

  // Sync active 3D model if user changes color (e.g., Yellow <-> Grey Full Body Skin)
  useEffect(() => {
    if (product.glbByColor && activeMedia?.type === 'glb') {
      const activeGlb = product.glbByColor[selectedColor?.name] || product.glb
      if (activeGlb && activeGlb !== activeMedia.src) {
        setActiveMedia({ type: 'glb', src: activeGlb, id: 'glb-0', label: '3D Model' })
      }
    }
  }, [selectedColor, product])

  const handleAddToCart = () => {
    triggerSuccessHaptic()
    if (!user?.uid) {
      navigate('/login')
      return
    }
    setIsAdding(true)
    addItem({
      inventoryId: `${product.id}-${selectedSize}-${selectedColor.name}`,
      quantity,
      product: {
        id: product.id,
        name: product.title || product.name,
        price: product.price,
        image: activeMedia?.type === 'image' ? activeMedia.src : product.image,
        selectedSize,
        selectedColor: selectedColor.name,
      },
    })

    setToastMessage(`Added ${quantity}x ${product.title} (${selectedSize} / ${selectedColor.name}) to cart`)
    setTimeout(() => {
      setIsAdding(false)
      setToastMessage(null)
    }, 3500)
  }

  const handleBuyNow = () => {
    triggerSuccessHaptic()
    if (!user?.uid) {
      navigate('/login')
      return
    }
    addItem({
      inventoryId: `${product.id}-${selectedSize}-${selectedColor.name}`,
      quantity,
      product: {
        id: product.id,
        name: product.title || product.name,
        price: product.price,
        image: activeMedia?.type === 'image' ? activeMedia.src : product.image,
        selectedSize,
        selectedColor: selectedColor.name,
      },
    })
    navigate('/checkout')
  }

  const handleShare = async () => {
    triggerHaptic(15)
    await shareContent({
      title: `${product.title || product.name} | The Dive Village`,
      text: product.description || 'Check out this ocean gear from The Dive Village!',
      url: window.location.href,
    })
  }

  // Keyboard arrow navigation for desktop media gallery
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return
      if (e.key === 'ArrowRight') {
        const currIdx = mediaItems.findIndex((m) => m.id === activeMedia?.id || m.src === activeMedia?.src)
        if (currIdx !== -1 && currIdx < mediaItems.length - 1) {
          triggerHaptic(8)
          setActiveMedia(mediaItems[currIdx + 1])
        }
      } else if (e.key === 'ArrowLeft') {
        const currIdx = mediaItems.findIndex((m) => m.id === activeMedia?.id || m.src === activeMedia?.src)
        if (currIdx > 0) {
          triggerHaptic(8)
          setActiveMedia(mediaItems[currIdx - 1])
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeMedia, mediaItems])

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-24 text-center">
        <h2 className="text-2xl font-bold text-navy mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-accent hover:underline font-bold">
          ← Back to Merchandise Store
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-navy font-body pt-24 sm:pt-32 pb-32 sm:pb-24 overflow-x-hidden">
      <SEOHead
        title={`${product.title || product.name} | Ocean Apparel | The Dive Village`}
        description={`${product.description}. Premium quality dive gear and eco-friendly apparel crafted by The Dive Village.`}
        keywords={`${product.title || product.name}, dive apparel, ocean wear, scuba gear, sustainable marine clothing, ${product.category}`}
        canonicalUrl={`https://thedivevillage.com/shop/${product.id}`}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 right-4 z-50 rounded-2xl bg-navy text-white px-6 py-4 shadow-float flex items-center gap-3 border border-white/20"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs">
                ✓
              </span>
              <div>
                <p className="text-xs text-white/70">Cart Updated</p>
                <p className="text-sm font-bold">{toastMessage}</p>
              </div>
              <Link to="/cart" className="ml-3 rounded-full bg-white/10 text-white hover:bg-[#FFCD00] hover:text-[#001e3d] px-3.5 py-1.5 text-xs font-bold transition border border-white/20">
                View Cart
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breadcrumb Navigation Header */}
        {/* Top Header Bar: Back Button & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(8)
                navigate('/shop')
              }}
              aria-label="Back to store"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-navy/15 text-navy font-bold text-xs shadow-xs hover:bg-[#FFCD00] hover:text-[#001e3d] hover:border-[#FFCD00] transition active:scale-95 cursor-pointer group shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs font-bold text-navy/60">
              <Link to="/" className="hover:text-navy transition">Home</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-navy transition">Merchandise Store</Link>
              <span>/</span>
              <span className="text-navy/80">{product.category}</span>
              <span>/</span>
              <span className="text-navy truncate max-w-[160px] sm:max-w-xs">{product.title}</span>
            </nav>
          </div>
        </div>

        {/* Main Product Details Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20 items-start">
          
          {/* Left Column: Integrated Multi-Media Showcase (Photos + Video + 3D Model) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Main Product Card Media Display with Touch Swipe & Zoom Support */}
            <div 
              onTouchStart={activeMedia?.type !== 'glb' ? handleMediaTouchStart : undefined}
              onTouchEnd={activeMedia?.type !== 'glb' ? handleMediaTouchEnd : undefined}
              className="w-full rounded-[28px] overflow-hidden bg-white border border-navy/10 h-[460px] xs:h-[500px] sm:h-[560px] lg:h-[600px] relative shadow-card group"
            >
              {activeMedia?.type === 'glb' ? (
                <Product3DViewer key={activeMedia.src} src={activeMedia.src} alt={product.title} productId={product.id} />
              ) : activeMedia?.type === 'video' ? (
                <>
                  <LazyVideo
                    src={activeMedia.src}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover rounded-[28px]"
                  />
                </>
              ) : (
                <InteractiveProductImage
                  src={activeMedia?.src || product.image}
                  alt={product.title}
                  onOpenFloating={(imgSrc) => {
                    triggerHaptic(8)
                    setFloatingImage(imgSrc)
                    setFloatingZoom(1)
                  }}
                />
              )}
            </div>

            {/* Mobile Media Swipe Indicator Dots */}
            {mediaItems.length > 1 && (
              <div className="flex sm:hidden justify-center items-center gap-1.5 -mt-1 mb-1">
                {mediaItems.map((m, idx) => {
                  const isSelected = (activeMedia?.id === m.id || activeMedia?.src === m.src)
                  return (
                    <button
                      key={m.id || idx}
                      type="button"
                      onClick={() => {
                        triggerHaptic(8)
                        setActiveMedia(m)
                      }}
                      aria-label={`View ${m.label}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isSelected ? 'w-5 bg-navy' : 'w-1.5 bg-navy/20'
                      }`}
                    />
                  )
                })}
              </div>
            )}

            {/* Thumbnail Selectors Below Product Image */}
            <div className="relative w-full flex items-center gap-2">
              {/* Left Scroll Arrow */}
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={() => scrollThumbs('left')}
                  aria-label="Scroll left thumbnails"
                  className="shrink-0 w-8 h-8 rounded-full bg-white border border-navy/15 text-navy shadow-md flex items-center justify-center hover:bg-[#FFCD00] hover:text-[#001e3d] hover:border-[#FFCD00] transition active:scale-90 cursor-pointer z-10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
              )}

              {/* Scrollable Thumbnails Track */}
              <div
                ref={thumbsRef}
                onScroll={checkThumbScroll}
                className="flex items-center gap-3 overflow-x-auto w-full py-2 px-1 scrollbar-none scroll-smooth"
              >
                {mediaItems.map((item, i) => (
                  <div key={item.id || i} className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        triggerHaptic(8)
                        setActiveMedia(item)
                      }}
                      className={`flex-shrink-0 w-16 h-20 sm:w-18 sm:h-22 rounded-2xl overflow-hidden border-2 transition relative cursor-pointer ${
                        activeMedia?.id === item.id || activeMedia?.src === item.src
                          ? 'border-navy shadow-md ring-2 ring-navy/20 scale-102'
                          : 'border-transparent hover:border-navy/30 bg-[#F0F2F5]'
                      }`}
                    >
                      {item.type === 'image' ? (
                        <img src={item.src} alt={item.label} className="w-full h-full object-cover bg-white" />
                      ) : item.type === 'video' ? (
                        <div className="relative w-full h-full bg-black flex items-center justify-center">
                          <LazyVideo src={item.src} className="w-full h-full object-cover opacity-70 pointer-events-none" muted />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <span className="w-6 h-6 rounded-full bg-accent text-navy flex items-center justify-center text-xs font-bold shadow-sm">
                              ▶
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full bg-[#001E36] flex flex-col items-center justify-center text-[#FFCD00] p-1 border border-[#FFCD00]/30 shadow-inner">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                          <span className="text-[8px] font-bold tracking-wider uppercase text-white mt-1">3D MODEL</span>
                        </div>
                      )}
                    </button>
                    <span className="text-[10px] font-bold text-navy/80 tracking-tight text-center max-w-[72px] leading-tight">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Right Scroll Arrow */}
              {canScrollRight && (
                <button
                  type="button"
                  onClick={() => scrollThumbs('right')}
                  aria-label="Scroll right thumbnails"
                  className="shrink-0 w-8 h-8 rounded-full bg-white border border-navy/15 text-navy shadow-md flex items-center justify-center hover:bg-[#FFCD00] hover:text-[#001e3d] hover:border-[#FFCD00] transition active:scale-90 cursor-pointer z-10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Desktop Product Specifications & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-start lg:sticky lg:top-28 lg:self-start">
            
            {/* Category & Native Share Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-navy/50">
                  {product.category}
                </span>
              </div>

              {/* Native Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-navy/15 text-navy text-xs font-bold hover:bg-navy hover:text-white transition shadow-sm active:scale-95 cursor-pointer"
                title="Share this product"
                aria-label="Share product"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                <span>Share</span>
              </button>
            </div>

            {/* Product Title */}
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-navy leading-tight mb-3 text-left tracking-tight">
              {product.title}
            </h1>

            {/* Product Description */}
            <p className="text-navy/75 text-sm sm:text-base leading-relaxed mb-6 text-left">
              {product.description}
            </p>

            {/* 1. Color Variant Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6 pt-5 border-t border-navy/10">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-navy/70">
                    Color: <span className="font-bold text-navy normal-case text-sm ml-1">{selectedColor.name}</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        triggerHaptic(10)
                        setSelectedColor(color)
                      }}
                      title={color.name}
                      className={`w-9 h-9 rounded-full transition relative flex items-center justify-center cursor-pointer ${
                        selectedColor.name === color.name
                          ? 'ring-2 ring-offset-2 ring-navy scale-105'
                          : 'opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor.name === color.name && (
                        <span className={`text-[10px] font-bold ${['#F9FAFB', '#F3F4F6', '#FFFFFF'].includes(color.hex) ? 'text-black' : 'text-white'}`}>
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Size Information & Options */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-navy/70">
                  Size: <span className="font-bold text-navy normal-case text-sm ml-1">{selectedSize}</span>
                </p>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    triggerHaptic(8)
                    setActiveTab('sizeGuide')
                    setTimeout(() => {
                      sizeChartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }, 50)
                  }} 
                  className="text-xs font-bold text-navy/70 hover:text-navy underline transition cursor-pointer flex items-center gap-1"
                >
                  Size Guide
                </button>
              </div>

              {/* Size Option Selector Buttons */}
              {product.sizes && product.sizes.length > 1 && (
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        triggerHaptic(10)
                        setSelectedSize(sz)
                      }}
                      className={`px-4 py-3 rounded-2xl text-xs font-bold transition border cursor-pointer active:scale-95 ${
                        selectedSize === sz
                          ? 'bg-navy text-white border-navy shadow-md ring-2 ring-navy/20'
                          : 'bg-white text-navy border-navy/20 hover:border-navy'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              )}

              {/* Size Info Card */}
              <div className="flex items-center gap-3 rounded-2xl bg-navy/[0.04] border border-navy/10 px-4 py-3 text-xs text-navy/80 font-medium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-navy/60 shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span><strong>Adaptive Fit:</strong> 4-way ultra-stretch fabric. <strong>One size fits most</strong>.</span>
              </div>
            </div>

            {/* 3. Quantity */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-navy/70 mb-3">Quantity</p>
              <div className="inline-flex items-center rounded-2xl border border-navy/15 bg-white p-1 shadow-sm">
                <button
                  onClick={() => {
                    triggerHaptic(10)
                    setQuantity((q) => Math.max(1, q - 1))
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-navy hover:bg-[#F0F2F5] active:scale-90 transition text-base font-bold cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-sm text-navy">{quantity}</span>
                <button
                  onClick={() => {
                    triggerHaptic(10)
                    setQuantity((q) => q + 1)
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-navy hover:bg-[#F0F2F5] active:scale-90 transition text-base font-bold cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full sm:w-44 lg:w-48 bg-navy hover:bg-[#002b4e] active:scale-[0.98] text-white font-bold py-3.5 sm:py-4 px-4 sm:px-5 rounded-full transition shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer shrink-0"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full sm:w-44 lg:w-48 bg-navy hover:bg-[#FFCD00] hover:text-[#001e3d] active:scale-[0.98] text-white font-bold py-3.5 sm:py-4 px-5 rounded-full transition border border-navy shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer shrink-0"
                >
                  Buy Now →
                </button>

                <div className="flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(15)
                      toggleWishlist(product)
                    }}
                    className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-white border border-navy/15 transition duration-200 flex items-center justify-center shadow-sm hover:border-navy hover:scale-105 active:scale-90 cursor-pointer"
                    title={isWishlisted(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    aria-label="Wishlist"
                  >
                    <svg
                      className="w-5 h-5 sm:w-[22px] sm:h-[22px]"
                      viewBox="0 0 24 24"
                      fill={isWishlisted(product.id) ? '#FFCD00' : 'none'}
                      stroke={isWishlisted(product.id) ? '#FFCD00' : '#003865'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-white border border-navy/15 transition duration-200 flex items-center justify-center shadow-sm hover:border-navy hover:scale-105 active:scale-90 cursor-pointer"
                    title="Share this product"
                    aria-label="Share"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specifications and Details */}
        <div ref={sizeChartRef} className="rounded-[28px] sm:rounded-[40px] bg-white border border-navy/5 p-5 sm:p-14 shadow-card mb-20">
          <div className="flex border-b border-navy/10 mb-8 overflow-x-auto scrollbar-none gap-2">
            {[
              { key: 'details', label: 'Product Features' },
              { key: 'sizeGuide', label: 'Size Guide & Fit' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  triggerHaptic(8)
                  setActiveTab(tab.key)
                }}
                className={`pb-4 px-6 font-heading font-bold text-sm whitespace-nowrap transition-colors duration-200 border-b-2 bg-transparent cursor-pointer select-none outline-none focus:outline-none ${
                  activeTab === tab.key
                    ? 'border-navy text-navy font-bold'
                    : 'border-transparent text-navy/50 hover:text-navy hover:bg-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'details' && (
            <div className="space-y-6">
              <h3 className="font-heading text-2xl font-bold text-navy">Engineering & Design Highlights</h3>
              <p className="text-navy/80 text-sm leading-relaxed max-w-3xl">
                {product.description}
              </p>
              {product.features && (
                <ul className="grid sm:grid-cols-2 gap-4 mt-6">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-navy/85 bg-[#FAFAFA] p-4 rounded-2xl border border-navy/5">
                      <span className="text-accent font-bold mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === 'sizeGuide' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-2xl font-bold text-navy mb-2">Universal Sizing Chart</h3>
                <div className="bg-[#F0F2F5] border border-navy/10 rounded-2xl p-4 mb-4">
                  <p className="text-xs sm:text-sm text-navy/80 leading-relaxed font-medium">
                    <strong>One Size Fits Most (Adaptive Stretch):</strong> Crafted from 4-way ultra-stretch performance fabric. Choose <strong>(S-M)</strong> for sizes S to M or <strong>(L-XXL)</strong> for sizes L to XXL.
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#F0F2F5] text-navy font-bold">
                      <th className="p-3.5 rounded-l-xl">Option</th>
                      <th className="p-3.5">Fits Sizes</th>
                      <th className="p-3.5">Chest / Bust (in)</th>
                      <th className="p-3.5">Waist (in)</th>
                      <th className="p-3.5">Height (cm)</th>
                      <th className="p-3.5 rounded-r-xl">Weight (kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/10 text-navy/80">
                    <tr><td className="p-3.5 font-bold text-navy">(S-M)</td><td className="p-3.5 font-semibold">S to M</td><td className="p-3.5">32 - 40</td><td className="p-3.5">26 - 33</td><td className="p-3.5">155 - 180</td><td className="p-3.5">48 - 78</td></tr>
                    <tr><td className="p-3.5 font-bold text-navy">(L-XXL)</td><td className="p-3.5 font-semibold">L to XXL</td><td className="p-3.5">41 - 48</td><td className="p-3.5">34 - 42</td><td className="p-3.5">175 - 195</td><td className="p-3.5">75 - 105</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* You May Also Like / Recommendations */}
        <div className="relative">
          <div className="mb-6 sm:mb-8">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-accent block">Explore More</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-navy">You May Also Like</h2>
          </div>

          <div className="relative group/carousel">
            {/* Left Navigation Arrow on the side */}
            <button
              type="button"
              onClick={() => scrollRelated('left')}
              aria-label="Previous products"
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-navy/15 shadow-float backdrop-blur-md flex items-center justify-center text-navy hover:text-accent hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Carousel Row */}
            <div
              ref={relatedScrollRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-4 pt-1 no-scrollbar px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/shop/${p.id}`}
                  className="group w-[220px] xs:w-[250px] sm:w-[270px] lg:w-[285px] shrink-0 rounded-2xl sm:rounded-3xl bg-white border border-navy/5 p-3 sm:p-5 shadow-card hover:shadow-float transition duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#F0F2F5] mb-2.5 sm:mb-4 flex items-center justify-center p-2 sm:p-3 relative">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-accent block mb-0.5 sm:mb-1">
                      {p.category}
                    </span>
                    <h3 className="font-heading font-bold text-xs sm:text-sm text-navy group-hover:text-accent transition line-clamp-2 leading-snug">
                      {p.title}
                    </h3>
                  </div>

                  <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-navy/5 flex justify-end items-center">
                    <span className="text-[10px] sm:text-xs font-bold text-accent group-hover:underline">
                      View Gear →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Right Navigation Arrow on the side */}
            <button
              type="button"
              onClick={() => scrollRelated('right')}
              aria-label="Next products"
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-navy/15 shadow-float backdrop-blur-md flex items-center justify-center text-navy hover:text-accent hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

      </div>

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-navy/10 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-2.5 animate-fade-in">
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-navy uppercase tracking-wider truncate max-w-[150px]">
            {product.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-navy/5 border border-navy/15 flex items-center justify-center text-navy active:scale-90 transition shrink-0"
            aria-label="Share"
            title="Share"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(15)
              toggleWishlist(product)
            }}
            className="w-10 h-10 rounded-full bg-navy/5 border border-navy/15 flex items-center justify-center text-navy active:scale-90 transition shrink-0"
            aria-label="Wishlist"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isWishlisted(product.id) ? '#FFCD00' : 'none'}
              stroke={isWishlisted(product.id) ? '#FFCD00' : 'currentColor'}
              strokeWidth="2"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-navy active:scale-95 hover:bg-[#002b4e] text-white font-bold py-2.5 px-4 sm:px-5 rounded-full transition shadow-md flex items-center gap-1.5 text-xs cursor-pointer disabled:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>

      {/* Floating Window Lightbox Modal */}
      <AnimatePresence>
        {floatingImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFloatingImage(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 md:p-8 select-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-3xl sm:rounded-[36px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-navy/10 flex flex-col overflow-hidden max-h-[92vh]"
            >
              {/* Floating Header */}
              <div className="flex items-center justify-between px-5 py-4 sm:px-7 sm:py-5 border-b border-navy/10 bg-slate-50/80 backdrop-blur-md">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">Product Visual Preview</span>
                  <h3 className="font-heading text-sm sm:text-lg font-bold text-navy">{product.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFloatingZoom((prev) => Math.max(1, prev - 0.5))}
                    disabled={floatingZoom <= 1}
                    className="w-8 h-8 rounded-full bg-white border border-navy/15 text-navy disabled:opacity-35 flex items-center justify-center text-sm font-bold shadow-sm hover:bg-navy/5 active:scale-95 transition cursor-pointer"
                    title="Zoom Out"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => setFloatingZoom((prev) => Math.min(3, prev + 0.5))}
                    disabled={floatingZoom >= 3}
                    className="w-8 h-8 rounded-full bg-white border border-navy/15 text-navy disabled:opacity-35 flex items-center justify-center text-sm font-bold shadow-sm hover:bg-navy/5 active:scale-95 transition cursor-pointer"
                    title="Zoom In"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8)
                      setFloatingImage(null)
                    }}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-navy/10 hover:bg-navy text-navy hover:text-white flex items-center justify-center transition shadow-sm active:scale-90 cursor-pointer ml-1 sm:ml-2"
                    aria-label="Close floating window"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Center Floating Content Container (Strict FIT bounds) */}
              <div className="relative w-full h-[55vh] sm:h-[62vh] min-h-[300px] bg-[#F8FAFC] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                  <img
                    src={floatingImage}
                    alt={product.title}
                    className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-300 select-none drop-shadow-md"
                    style={{ transform: `scale(${floatingZoom})` }}
                    draggable={false}
                  />
                </div>
              </div>

              {/* Bottom Thumbnail Switcher if multiple images exist */}
              {mediaItems.filter((m) => m.type === 'image').length > 1 && (
                <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-navy/10 bg-white flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto">
                  {mediaItems
                    .filter((m) => m.type === 'image')
                    .map((m, idx) => {
                      const isSelected = floatingImage === m.src
                      return (
                        <button
                          key={m.id || idx}
                          type="button"
                          onClick={() => {
                            triggerHaptic(6)
                            setFloatingImage(m.src)
                            setFloatingZoom(1)
                            setActiveMedia(m)
                          }}
                          className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer p-1 bg-[#F0F2F5] shrink-0 ${
                            isSelected ? 'border-accent shadow-md scale-105 bg-white' : 'border-navy/10 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={m.src} alt={m.label} className="w-full h-full object-contain" />
                        </button>
                      )
                    })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function InteractiveProductImage({ src, alt, onOpenFloating }) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

  const startDist = useRef(0)
  const startScale = useRef(1)
  const startPos = useRef({ x: 0, y: 0 })
  const startTouch = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      startDist.current = Math.hypot(dx, dy)
      startScale.current = scale

      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2
      startTouch.current = { x: midX, y: midY }
      startPos.current = { ...position }
      isDragging.current = true
    }
  }

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && isDragging.current) {
      e.preventDefault()
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      const newScale = Math.min(Math.max(startScale.current * (dist / (startDist.current || 1)), 0.8), 3.5)
      setScale(newScale)

      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2
      const deltaX = midX - startTouch.current.x
      const deltaY = midY - startTouch.current.y
      setPosition({
        x: startPos.current.x + deltaX,
        y: startPos.current.y + deltaY,
      })
    }
  }

  const handleTouchEnd = () => {
    isDragging.current = false
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 })
      setScale(1)
    }
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => onOpenFloating && onOpenFloating(src)}
      className="w-full h-full flex items-center justify-center overflow-hidden touch-none relative select-none cursor-zoom-in group/img"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain p-6 pointer-events-none select-none transition-transform duration-300 group-hover/img:scale-105"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
        draggable={false}
      />

      {/* Floating Window Hint Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (onOpenFloating) onOpenFloating(src)
        }}
        className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-navy/80 hover:text-accent shadow-md border border-navy/10 flex items-center justify-center transition hover:scale-110 active:scale-95 cursor-pointer z-10"
        title="Open in floating window"
        aria-label="Expand image in floating window"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </button>

      {scale > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setScale(1)
            setPosition({ x: 0, y: 0 })
          }}
          className="absolute bottom-4 right-4 bg-navy/80 hover:bg-navy text-white text-[10px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 z-10 shadow-md transition cursor-pointer"
        >
          Reset Zoom
        </button>
      )}
    </div>
  )
}

