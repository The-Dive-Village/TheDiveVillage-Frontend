import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { SHOP_PRODUCTS } from '../utils/products'
import { productService } from '../services/productService'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/Button'
import SEOHead from '../components/SEOHead'
import CustomerReviews from '../components/CustomerReviews'
import picture3 from '../assets/Picture3.png'
import divingVid from '../assets/Diving(1).mp4'
import pop1 from '../assets/Products/pop1.jpeg'
import pop2 from '../assets/Products/pop2.jpeg'

const CATEGORIES = [
  { key: 'all', label: 'All Merchandise' },
  { key: 'Tops', label: 'Tops' },
  { key: 'Skin Wear', label: 'Skin Wear' },
  { key: 'Bottoms', label: 'Bottoms' },
  { key: 'Accessories', label: 'Accessories & Bags' },
]

export default function Shop() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [productsList, setProductsList] = useState(SHOP_PRODUCTS)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [addedToast, setAddedToast] = useState(null)
  const { addItem, itemCount } = useCart()
  const { count: wishlistCount, toggle: toggleWishlist, isWishlisted } = useWishlist()

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await productService.getProducts()
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setProductsList(res.data.data)
        }
      } catch (err) {
        console.warn('Could not load live products from DB, using fallback:', err)
      }
    }
    loadProducts()
  }, [])

  const handleQuickAdd = (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user?.uid) {
      navigate('/login')
      return
    }
    const firstColor = product.colors?.[0]?.name || 'Standard'
    const firstSize = product.sizes?.[0] || 'Standard'
    addItem({
      inventoryId: `${product.id}-${firstSize}-${firstColor}`,
      quantity: 1,
      product: {
        id: product.id,
        name: product.title || product.name,
        title: product.title || product.name,
        price: product.price,
        image: product.image,
        selectedSize: firstSize,
        selectedColor: firstColor,
      },
    })
    setAddedToast(product.title || product.name)
    setTimeout(() => setAddedToast(null), 3000)
  }

  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesSearch =
        (product.title || product.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5)
      return 0
    })
  }, [selectedCategory, searchQuery, sortBy])

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-navy font-body pt-24 sm:pt-32 pb-24 overflow-x-hidden">
      <SEOHead
        title="Dive Shop & Sustainable Marine Apparel | The Dive Village"
        description="Shop high-performance ocean gear, eco-friendly dive apparel, UPF rashguards, and diving accessories. Designed for comfort, durability, and marine conservation."
        keywords="scuba diving shop, dive gear store, ocean apparel, UPF rashguards, dive suits, eco-friendly swimsuits, dive village merch"
        canonicalUrl="https://thedivevillage.com/shop"
      />
      {/* Toast Notification */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-[999] bg-navy text-white px-5 py-3 rounded-2xl shadow-float flex items-center gap-3 border border-white/20 text-xs font-bold"
          >
            <span>✓ Added <strong className="text-accent">{addedToast}</strong> to cart!</span>
            <Link to="/cart" className="ml-3 rounded-full bg-accent px-3.5 py-1.5 text-xs font-bold text-navy hover:bg-white transition">
              View Cart
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative rounded-[40px] overflow-hidden bg-navy text-white shadow-lift border border-white/10 flex flex-col md:flex-row items-center justify-between min-h-[380px] p-8 sm:p-12 lg:p-14 gap-8">
          <video
            src={divingVid}
            autoPlay
            loop
            muted
            playsInline
            onPlay={(e) => { e.currentTarget.playbackRate = 0.7 }}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-navy/30" />

          {/* Left Column: Title & Text */}
          <div className="relative z-10 max-w-xl">

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-3 text-white drop-shadow-lg">
              Merchandise
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-lg">
              Gear up with The Dive Village. High-performance apparel, dive suits, caps, and accessories.
            </p>
          </div>

          {/* Right Column: 3D Flipping Product Tag */}
          <div className="relative z-10 shrink-0 self-center md:self-auto py-2 md:mr-16 lg:mr-28 xl:mr-36">
            <FlippingProductTag />
          </div>
        </div>
      </section>

      {/* 2. STORE CONTROLS TOOLBAR IN BRAND BLUE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <div className="rounded-[28px] bg-[#003865] p-4 sm:p-6 shadow-lift border border-white/15 text-white flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-xl">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search rash guards, suits, gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-white/20 bg-[#00223D]/80 pl-12 pr-8 py-3 text-sm text-white placeholder:text-white/60 focus:border-accent focus:bg-[#00223D] focus:outline-none transition shadow-inner"
            />
            <svg className="absolute left-4 top-3.5 h-5 w-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-3.5 text-xs text-white/70 hover:text-accent font-bold cursor-pointer">✕</button>}
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
            <span className="text-xs font-extrabold text-cyan-400/90 uppercase tracking-wider whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-white/20 bg-[#00223D]/80 px-4 py-2.5 text-xs sm:text-sm font-bold text-white focus:border-accent focus:outline-none transition cursor-pointer"
            >
              <option value="featured">Featured / Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <Link
              to="/wishlist"
              className="rounded-full bg-white/10 hover:!bg-[#FFCD00] hover:!text-[#001e3d] text-white font-bold px-5 py-2.5 text-xs sm:text-sm transition-all duration-200 shadow-md flex items-center gap-2 whitespace-nowrap border border-white/20 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-accent text-[#001e3d] text-[11px] font-extrabold px-2 py-0.5 rounded-full ml-0.5">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="rounded-full bg-accent hover:bg-white text-navy font-extrabold px-5 py-2.5 text-xs sm:text-sm transition-all duration-200 shadow-md flex items-center gap-2 whitespace-nowrap border border-transparent cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>View Cart</span>
              {itemCount > 0 && (
                <span className="bg-[#001e3d] text-accent text-[11px] font-extrabold px-2 py-0.5 rounded-full ml-0.5">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 mt-6 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-accent text-[#001e3d] shadow-md font-extrabold'
                  : 'bg-white text-navy/70 border border-navy/10 hover:bg-[#003865] hover:text-white hover:border-[#003865]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. PRODUCT LISTINGS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center text-xs font-bold text-navy/60">
          <span>Showing {filteredProducts.length} product{filteredProducts.length !== 1 && 's'}</span>
          {selectedCategory !== 'all' && (
            <button onClick={() => { setSelectedCategory('all'); setSearchQuery('') }} className="text-accent hover:underline">Clear filters</button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-card border border-navy/5 my-8">
            <h3 className="font-heading text-2xl font-bold mb-2">No products matched.</h3>
            <Button onClick={() => { setSelectedCategory('all'); setSearchQuery('') }} className="bg-navy text-white">Reset Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCardItem
                key={product.id}
                product={product}
                onQuickAdd={handleQuickAdd}
                isWishlisted={isWishlisted(product.id)}
                onToggleWishlist={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleWishlist(product)
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. CUSTOMER REVIEWS & SHOWCASE */}
      <CustomerReviews />
    </div>
  )
}

function ProductCardItem({ product, onQuickAdd, isWishlisted, onToggleWishlist }) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const viewerRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !customElements.get('model-viewer')) {
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js'
      document.head.appendChild(script)
    }
  }, [])

  useEffect(() => {
    let active = true
    const el = viewerRef.current
    if (el) {
      const applyMatte = () => {
        try {
          if (el.model && el.model.materials) {
            el.model.materials.forEach((mat) => {
              if (typeof mat.setDoubleSided === 'function') {
                mat.setDoubleSided(true)
              } else {
                mat.doubleSided = true
              }
              const pbr = mat.pbrMetallicRoughness
              if (pbr) {
                pbr.setRoughnessFactor(0.82)
                pbr.setMetallicFactor(0.0)
              }
            })
          }
        } catch (e) { }
      }

      if (el.loaded) {
        setIsLoaded(true)
        applyMatte()
      }
      const handleLoad = () => {
        if (active) {
          setIsLoaded(true)
          applyMatte()
        }
      }
      el.addEventListener('load', handleLoad)
    }
    const fallbackTimer = setTimeout(() => {
      if (active) setIsLoaded(true)
    }, 300)
    return () => {
      active = false
      if (el) {
        el.removeEventListener('load', () => setIsLoaded(true))
      }
      clearTimeout(fallbackTimer)
    }
  }, [product.glb])

  const show3D = isHovered

  return (
    <div
      onClick={() => navigate(`/shop/${product.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group rounded-[32px] bg-white border border-navy/5 p-6 shadow-card hover:shadow-float transition duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        <div className="relative mb-5">
          <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#F0F2F5] flex items-center justify-center p-4 relative">
            <img
              src={product.image}
              alt={product.title}
              className={`max-h-full max-w-full object-contain transition-all duration-300 group-hover:scale-105 ${show3D ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
            />
            {product.glb && (
              <div
                className={`absolute inset-0 w-full h-full z-10 bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EDF2F7] flex items-center justify-center transition-opacity duration-300 ${show3D ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
              >
                <model-viewer
                  ref={viewerRef}
                  src={product.glb}
                  alt={product.title}
                  loading="eager"
                  reveal="auto"
                  auto-rotate
                  auto-rotate-delay="0"
                  rotation-per-second="150deg"
                  camera-orbit="0deg 75deg 120%"
                  camera-target="auto auto auto"
                  disable-zoom
                  disable-pan
                  min-camera-orbit="auto 75deg auto"
                  max-camera-orbit="auto 75deg auto"
                  interaction-prompt="none"
                  environment-image="neutral"
                  exposure={product.id === 'product-dive-cap' || product.glb?.toLowerCase().includes('cap') ? '2.5' : '1.35'}
                  shadow-intensity={product.id === 'product-dive-cap' || product.glb?.toLowerCase().includes('cap') ? '0.08' : '0.4'}
                  shadow-softness="0.9"
                  tone-mapping="commerce"
                  bounds="tight"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            )}
          </div>
          {product.tag && (
            <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-navy rounded-full shadow-sm z-10">
              {product.tag}
            </span>
          )}
        </div>

        <div className="mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-accent block mb-1">{product.category}</span>
          <h3 className="font-heading text-xl font-bold text-navy leading-snug group-hover:text-accent transition">{product.title}</h3>
          <p className="text-xs text-navy/70 line-clamp-2 mt-2 leading-relaxed">{product.description}</p>
          <div className="mt-4 pt-3 border-t border-navy/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-navy/50 text-[10px] uppercase font-bold mr-1">Colors:</span>
              {product.colors?.slice(0, 4).map((c, idx) => (
                <span key={idx} className="w-3.5 h-3.5 rounded-full border border-white shadow-sm" style={{ backgroundColor: c.hex }} />
              ))}
            </div>
            <div className="text-navy/60 font-semibold text-[11px]">
              Size: {product.sizes?.[0] || 'One Size'}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-navy/10 flex items-center justify-between gap-3">
        <span className="text-[10px] text-emerald-600 font-bold">Inquire within</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleWishlist}
            className="w-9 h-9 rounded-full bg-navy/10 hover:bg-navy border border-navy/20 text-navy hover:text-white flex items-center justify-center shadow-sm transition duration-200 hover:scale-110 active:scale-95 cursor-pointer shrink-0"
            aria-label="Wishlist"
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isWishlisted ? '#FFCD00' : 'none'}
              stroke={isWishlisted ? '#FFCD00' : 'currentColor'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
          <button onClick={(e) => onQuickAdd(product, e)} className="rounded-full bg-navy text-white px-5 py-2.5 text-xs font-bold hover:bg-accent hover:text-navy transition shadow-sm flex items-center gap-1.5 cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

function programTag(tag) {
  return tag || 'Official'
}

function FlippingProductTag() {
  return (
    <div className="relative flex flex-col items-center justify-center select-none pointer-events-none">
      {/* Hanging Cord */}
      <div className="w-0.5 h-6 bg-gradient-to-b from-white/40 via-accent to-white/60 shadow-sm mb-[-2px] relative z-20">
        <div className="w-2 h-2 rounded-full bg-accent -top-1.5 -left-[3px] absolute shadow-sm" />
      </div>

      {/* 3D Perspective Container matched to exact 447x864 image aspect ratio */}
      <div className="perspective-1000 h-[280px] sm:h-[340px] aspect-[447/864] relative">
        <motion.div
          animate={{ rotateY: 360 }}
          transition={{
            duration: 18,
            ease: 'linear',
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="w-full h-full preserve-3d relative rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* FRONT SIDE (pop1.jpeg) */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden backface-hidden bg-transparent"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <img
              src={pop1}
              alt="Product Tag Front"
              className="w-full h-full object-fill rounded-2xl"
            />
          </div>

          {/* BACK SIDE (pop2.jpeg) */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden backface-hidden bg-transparent"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <img
              src={pop2}
              alt="Product Tag Back"
              className="w-full h-full object-fill rounded-2xl"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
