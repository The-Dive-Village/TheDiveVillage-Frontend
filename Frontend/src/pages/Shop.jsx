import { useState, useEffect, useMemo, useRef, useDeferredValue } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { SHOP_PRODUCTS, GROUP_PHOTOS } from '../utils/products'
import { productService } from '../services/productService'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/Button'
import SEOHead from '../components/SEOHead'

import { triggerHaptic, triggerSuccessHaptic } from '../utils/haptics'
import picture3 from '../assets/Picture3.webp'
const bannerImg = 'https://res.cloudinary.com/qvbunv8y/image/upload/v1791458229/TDV-Media/Products/banner.webp';
import divingVidLocal from '../assets/Diving(1).mp4'
const pop1Local = 'https://res.cloudinary.com/qvbunv8y/image/upload/v1791458274/TDV-Media/Products/pop1.webp';
const pop2Local = 'https://res.cloudinary.com/qvbunv8y/image/upload/v1791458275/TDV-Media/Products/pop2.webp';
const divingVid = 'https://res.cloudinary.com/qvbunv8y/video/upload/v1790244035/dive-village/ui-videos/diving_1_mp4.mp4'
const pop1 = pop1Local
const pop2 = pop2Local

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
  const deferredSearchQuery = useDeferredValue(searchQuery)
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
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    triggerSuccessHaptic()
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
    if (!Array.isArray(productsList)) return []
    return productsList.filter((product) => {
      if (!product) return false
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const titleOrName = (product.title || product.name || '')
      const desc = (product.description || '')
      const query = (deferredSearchQuery || '').toLowerCase()
      const matchesSearch =
        titleOrName.toLowerCase().includes(query) ||
        desc.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (Number(a?.price) || 0) - (Number(b?.price) || 0)
      if (sortBy === 'price-high') return (Number(b?.price) || 0) - (Number(a?.price) || 0)
      if (sortBy === 'rating') return (Number(b?.rating) || 5) - (Number(a?.rating) || 5)
      return 0
    })
  }, [productsList, selectedCategory, deferredSearchQuery, sortBy])

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-navy font-body pt-24 sm:pt-32 pb-24 overflow-x-hidden">
      <SEOHead
        title="Dive Shop & Sustainable Marine Apparel | The Dive Village"
        description="Shop high-performance ocean gear, eco-friendly dive apparel, dive suits, and diving accessories. Designed for comfort, durability, and marine conservation."
        keywords="scuba diving shop, dive gear store, ocean apparel, dive suits, eco-friendly swimsuits, dive village merch"
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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12">
        <div className="relative rounded-[24px] sm:rounded-[36px] lg:rounded-[40px] overflow-hidden bg-[#001428] shadow-lift border border-white/10 w-full h-[190px] xs:h-[230px] sm:h-[280px] lg:h-[450px] flex items-center justify-end">
          <img
            src={bannerImg}
            alt="Merchandise Banner"
            className="w-full h-full object-cover object-center pointer-events-none block"
          />

          {/* Left Side Blue Gradient Overlay */}
          <div
            className="absolute inset-y-0 left-0 w-[45%] sm:w-[38%] lg:w-[32%] pointer-events-none z-10"
            style={{
              background:
                'linear-gradient(to right, #003865 0%, rgba(0, 56, 101, 0.96) 20%, rgba(0, 56, 101, 0.82) 42%, rgba(0, 56, 101, 0.58) 64%, rgba(0, 56, 101, 0.28) 82%, rgba(0, 56, 101, 0.08) 93%, transparent 100%)',
            }}
          />

          {/* Left Side Typography: MADE FOR ALL BODY TYPES */}
          <div className="absolute left-4 xs:left-7 sm:left-10 lg:left-14 top-0 bottom-0 flex flex-col justify-center z-20 pointer-events-none w-[60%] xs:w-[55%] sm:max-w-md pr-2">
            <h2 className="font-heading text-base xs:text-lg sm:text-3xl lg:text-5xl font-black text-white uppercase tracking-tight leading-[1.05] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] text-left sm:text-justify sm:[text-align-last:justify] mb-2 sm:mb-6">
              MADE TO FIT<br />
              <span className="text-[#FFCD00] block mt-0.5 sm:mt-0">ALL BODY TYPES</span>
            </h2>
          </div>

          {/* Right Column: 3D Flipping Product Tag */}
          <div className="absolute right-3 sm:right-8 lg:right-12 top-0 bottom-0 z-10 shrink-0 h-full flex items-center">
            <FlippingProductTag />
          </div>
        </div>
      </section>

      {/* 2. STORE CONTROLS TOOLBAR IN BRAND BLUE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <div className="rounded-[28px] bg-white md:bg-[#003865] p-4 sm:p-6 shadow-card md:shadow-lift border border-navy/10 md:border-white/15 text-navy md:text-white flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-xl transition-colors duration-300">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search rash guards, suits, gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-navy/15 md:border-white/20 bg-[#F0F2F5] md:bg-[#00223D]/80 pl-12 pr-8 py-3 text-sm text-navy md:text-white placeholder:text-navy/40 md:placeholder:text-white/60 focus:border-accent focus:bg-white md:focus:bg-[#00223D] focus:outline-none transition shadow-inner"
            />
            <svg className="absolute left-4 top-3.5 h-5 w-5 text-navy/40 md:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-3.5 text-xs text-navy/50 md:text-white/70 hover:text-accent font-bold cursor-pointer">✕</button>}
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
            <span className="text-xs font-extrabold text-navy/60 md:text-cyan-400/90 uppercase tracking-wider whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                triggerHaptic(8)
                setSortBy(e.target.value)
              }}
              style={{ backgroundPosition: 'right 16px center' }}
              className="rounded-full border border-navy/15 md:border-white/20 bg-[#F0F2F5] md:bg-[#00223D]/80 pl-4 pr-10 py-2.5 text-xs sm:text-sm font-bold text-navy md:text-white focus:border-navy/15 md:focus:border-white/20 focus:outline-none focus:ring-0 transition cursor-pointer"
            >
              <option value="featured" className="text-navy bg-white md:bg-[#00223D] md:text-white">Featured / Newest</option>
              <option value="price-low" className="text-navy bg-white md:bg-[#00223D] md:text-white">Price: Low to High</option>
              <option value="price-high" className="text-navy bg-white md:bg-[#00223D] md:text-white">Price: High to Low</option>
              <option value="rating" className="text-navy bg-white md:bg-[#00223D] md:text-white">Highest Rated</option>
            </select>

            <Link
              to="/wishlist"
              className="rounded-full bg-navy/5 md:bg-white/10 hover:!bg-[#FFCD00] hover:!text-[#001e3d] text-navy md:text-white font-bold px-5 py-2.5 text-xs sm:text-sm transition-all duration-200 shadow-sm md:shadow-md flex items-center gap-2 whitespace-nowrap border border-navy/10 md:border-white/20 cursor-pointer"
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
              onClick={() => {
                triggerHaptic(8)
                setSelectedCategory(cat.key)
              }}
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${selectedCategory === cat.key
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
      <section className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-8">
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCardItem
                key={product.id}
                product={product}
                onQuickAdd={handleQuickAdd}
                isWishlisted={isWishlisted(product.id)}
                onToggleWishlist={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  triggerHaptic(15)
                  toggleWishlist(product)
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. GROUP SHOWCASE & COMMUNITY GALLERY */}
      <GroupGallerySection />


    </div>
  )
}

function GroupGallerySection() {
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-navy/10 mt-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-extrabold uppercase tracking-widest text-accent block mb-2">
          Community & Group Moments
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-navy tracking-tight mb-4">
          The Dive Village Community
        </h2>
        <p className="text-navy/70 text-sm sm:text-base leading-relaxed">
          Behind every dive suit, expedition bag, and rash guard is a vibrant community of divers, ocean lovers, and adventurers exploring the deep blue together.
        </p>
      </div>

      {/* Group Photos Masonry / Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {GROUP_PHOTOS.map((photo, idx) => (
          <div
            key={photo.id || idx}
            onClick={() => {
              triggerHaptic(8)
              setSelectedPhoto(photo)
            }}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-sm hover:shadow-float transition duration-300 border border-navy/5"
          >
            <img
              src={photo.src}
              alt={photo.title || 'Group Photo'}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-3">
              <span className="text-xs font-bold text-white tracking-wide truncate">
                {photo.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden bg-navy border border-white/15 shadow-2xl flex flex-col items-center justify-center p-2"
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-accent hover:text-navy flex items-center justify-center transition cursor-pointer font-bold"
                aria-label="Close photo"
              >
                ✕
              </button>
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="max-h-[80vh] w-auto object-contain rounded-2xl"
              />
              <div className="py-3 px-6 text-center">
                <h4 className="text-base font-bold text-white tracking-wide">{selectedPhoto.title}</h4>
                <p className="text-xs text-white/60">The Dive Village Group Showcase</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function ProductCardItem({ product, onQuickAdd, isWishlisted, onToggleWishlist }) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [hasHovered, setHasHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
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
      return () => {
        active = false
        if (el) {
          el.removeEventListener('load', handleLoad)
        }
      }
    }
    const fallbackTimer = setTimeout(() => {
      if (active) setIsLoaded(true)
    }, 300)
    return () => {
      active = false
      clearTimeout(fallbackTimer)
    }
  }, [product?.glb, hasHovered])

  const show3D = isHovered && hasHovered

  return (
    <div
      onClick={() => navigate(`/shop/${product.id}`)}
      onMouseEnter={() => {
        setIsHovered(true)
        setHasHovered(true)
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="group rounded-2xl sm:rounded-[32px] bg-white border border-navy/5 p-3 sm:p-6 shadow-card hover:shadow-float transition duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      <div>
        <div className="relative mb-3 sm:mb-5">
          <div className="aspect-[4/5] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#F0F2F5] flex items-center justify-center p-2.5 sm:p-4 relative">
            {/* Low-contrast Skeleton Shimmer Placeholder */}
            {!imgLoaded && (
              <div className="absolute inset-0 skeleton-shimmer bg-navy/5 z-0" aria-hidden="true" />
            )}
            <img
              src={product.image}
              alt={product.title}
              onLoad={() => setImgLoaded(true)}
              className={`max-h-full max-w-full object-contain relative z-[1] ${!imgLoaded ? 'opacity-0' : show3D ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
            />
            {product.glb && hasHovered && (
              <div
                className={`absolute inset-0 w-full h-full z-10 bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EDF2F7] flex items-center justify-center transition-opacity duration-300 cursor-grab active:cursor-grabbing ${show3D ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
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
                  exposure={product.id === 'product-dive-cap' || (typeof product.glb === 'string' && product.glb.toLowerCase().includes('cap')) ? '2.5' : '1.35'}
                  shadow-intensity={product.id === 'product-dive-cap' || (typeof product.glb === 'string' && product.glb.toLowerCase().includes('cap')) ? '0.08' : '0.4'}
                  shadow-softness="0.9"
                  tone-mapping="commerce"
                  bounds="tight"
                  style={{ width: '100%', height: '100%' }}
                >
                  <div slot="poster" className="w-full h-full flex items-center justify-center p-4 bg-transparent">
                    <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" />
                  </div>
                </model-viewer>
              </div>
            )}
          </div>
        </div>

        <div className="mb-2 sm:mb-4">
          <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-accent block mb-0.5 sm:mb-1">{product.category}</span>
          <h3 className="font-heading text-xs xs:text-sm sm:text-xl font-bold text-navy leading-tight sm:leading-snug group-hover:text-accent transition line-clamp-2 sm:line-clamp-none">{product.title}</h3>
          <p className="text-[10px] sm:text-xs text-navy/70 line-clamp-1 sm:line-clamp-2 mt-1 sm:mt-2 leading-relaxed hidden xs:block">{product.description}</p>
        </div>
      </div>

      <div className="pt-2 sm:pt-4 border-t border-navy/10 flex items-center justify-between gap-1.5 sm:gap-3">
        <span className="text-[9px] sm:text-[10px] text-emerald-600 font-bold hidden sm:inline">Inquire within</span>
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto sm:ml-0">
          <button
            type="button"
            onClick={onToggleWishlist}
            className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-navy/10 hover:bg-navy border border-navy/20 text-navy hover:text-white flex items-center justify-center shadow-sm transition duration-200 hover:scale-110 active:scale-95 cursor-pointer shrink-0"
            aria-label="Wishlist"
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <svg
              className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]"
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
          <button onClick={(e) => onQuickAdd(product, e)} className="rounded-full bg-navy text-white px-3 py-1.5 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-bold hover:bg-accent hover:text-navy active:scale-95 transition shadow-sm flex items-center gap-1 cursor-pointer whitespace-nowrap">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
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
    <>
      <style>
        {`
          @keyframes spinY {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(-360deg); }
          }
        `}
      </style>
      <div className="relative h-full flex flex-col items-center justify-center select-none py-2 sm:py-4 group cursor-pointer">
        {/* Hanging Cord */}
        <div className="w-0.5 h-2.5 sm:h-3.5 lg:h-4 bg-white/90 shadow-[0_0_6px_rgba(255,255,255,0.7)] mb-[-2px] relative z-20 shrink-0 pointer-events-none">
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white -top-1 -left-[2px] sm:-left-[3px] absolute shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
        </div>

        {/* 3D Perspective Container matched to exact 447x864 image aspect ratio */}
        <div className="perspective-1000 h-[105px] xs:h-[125px] sm:h-[160px] lg:h-[195px] aspect-[447/864] relative">
          <div
            className="w-full h-full preserve-3d relative rounded-xl sm:rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.4)] animate-[spinY_18s_linear_infinite] group-hover:[animation-play-state:paused]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* FRONT SIDE (pop1.webp) */}
            <div
              className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl overflow-hidden backface-hidden bg-transparent"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <img
                src={pop1}
                alt="Product Tag Front"
                className="w-full h-full object-fill rounded-xl sm:rounded-2xl pointer-events-none"
              />
            </div>

            {/* BACK SIDE (pop2.webp) */}
            <div
              className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl overflow-hidden backface-hidden bg-transparent"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <img
                src={pop2}
                alt="Product Tag Back"
                className="w-full h-full object-fill rounded-xl sm:rounded-2xl pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
