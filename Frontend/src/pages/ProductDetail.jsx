import { useParams, Link, useNavigate } from 'react-router'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SHOP_PRODUCTS } from '../utils/products'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { useAuth } from '../hooks/useAuth'
import { formatCurrency } from '../utils/formatCurrency'
import Button from '../components/Button'
import Product3DViewer from '../components/Product3DViewer'
import SEOHead from '../components/SEOHead'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addItem } = useCart()
  const { toggle: toggleWishlist, isWishlisted } = useWishlist()
  const sizeChartRef = useRef(null)

  const product = SHOP_PRODUCTS.find((p) => p.id === id) || SHOP_PRODUCTS[0]

  let relatedProducts = []
  if (product.id === 'product-dive-cap') {
    const bag = SHOP_PRODUCTS.find((p) => p.id === 'product-ocean-bag')
    const others = SHOP_PRODUCTS.filter((p) => p.id !== product.id && p.id !== 'product-ocean-bag').slice(0, 3)
    relatedProducts = bag ? [bag, ...others] : others
  } else if (product.id === 'product-ocean-bag') {
    const cap = SHOP_PRODUCTS.find((p) => p.id === 'product-dive-cap')
    const others = SHOP_PRODUCTS.filter((p) => p.id !== product.id && p.id !== 'product-dive-cap').slice(0, 3)
    relatedProducts = cap ? [cap, ...others] : others
  } else {
    relatedProducts = SHOP_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4)
  }

  // Construct media items: 3D Model appears FIRST by default, followed by Front, Back, Open 1, Open 2, etc.
  const buildMediaItems = (p) => {
    const items = []
    if (p.glb) {
      items.push({ type: 'glb', src: p.glb, id: 'glb-0', label: '3D Model' })
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

  const mediaItems = buildMediaItems(product)

  const [activeMedia, setActiveMedia] = useState(mediaItems[0] || null)
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : 'Standard')
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : { name: 'Standard', hex: '#FFFFFF' })
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('features')
  const [toastMessage, setToastMessage] = useState(null)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    const p = SHOP_PRODUCTS.find((item) => item.id === id) || SHOP_PRODUCTS[0]
    const items = buildMediaItems(p)
    setActiveMedia(items[0] || null)
    if (p.sizes && p.sizes.length > 0) {
      setSelectedSize(p.sizes[0])
    }
    if (p.colors && p.colors.length > 0) {
      setSelectedColor(p.colors[0])
    }
    setQuantity(1)
  }, [id])

  const handleAddToCart = () => {
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
    <div className="bg-[#FAFAFA] min-h-screen text-navy font-body pt-24 sm:pt-32 pb-24 overflow-x-hidden">
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
              <Link to="/cart" className="ml-3 rounded-full bg-accent px-3.5 py-1.5 text-xs font-bold text-navy hover:bg-white transition">
                View Cart
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold text-navy/60 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-navy transition">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-navy transition">Merchandise Store</Link>
          <span>/</span>
          <span className="text-accent">{product.category}</span>
          <span>/</span>
          <span className="text-navy truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Main Product Details Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20 items-start">
          
          {/* Left Column: Integrated Multi-Media Showcase (Photos + Video + 3D Model) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex gap-4 flex-col-reverse sm:flex-row items-start">
              {/* Thumbnail Selectors */}
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0">
                {mediaItems.map((item, i) => (
                  <div key={item.id || i} className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      onClick={() => setActiveMedia(item)}
                      className={`flex-shrink-0 w-16 h-20 sm:w-18 sm:h-22 rounded-2xl overflow-hidden border-2 transition relative cursor-pointer ${
                        activeMedia?.id === item.id || activeMedia?.src === item.src
                          ? 'border-navy shadow-md ring-2 ring-navy/20'
                          : 'border-transparent hover:border-navy/30 bg-[#F0F2F5]'
                      }`}
                    >
                      {item.type === 'image' ? (
                        <img src={item.src} alt={item.label} className="w-full h-full object-cover bg-white" />
                      ) : item.type === 'video' ? (
                        <div className="relative w-full h-full bg-black flex items-center justify-center">
                          <video src={item.src} className="w-full h-full object-cover opacity-70 pointer-events-none" muted />
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

              {/* Main Product Card Media Display */}
              <div className="flex-1 w-full rounded-[28px] overflow-hidden bg-white border border-navy/10 aspect-square sm:aspect-[4/4] max-h-[460px] relative shadow-card group">
                {activeMedia?.type === 'glb' ? (
                  <Product3DViewer src={activeMedia.src} alt={product.title} productId={product.id} />
                ) : activeMedia?.type === 'video' ? (
                  <>
                    <video
                      src={activeMedia.src}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover rounded-[28px]"
                    />
                    <div className="absolute top-4 right-4 bg-navy/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-[#FFCD00] rounded-full shadow-lg z-10 border border-[#FFCD00]/40 flex items-center gap-2 pointer-events-none">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFCD00] animate-ping" />
                      <span>360 view of the Product</span>
                    </div>
                  </>
                ) : (
                  <InteractiveProductImage
                    src={activeMedia?.src || product.image}
                    alt={product.title}
                  />
                )}
                {product.tag && (
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-bold text-navy rounded-full shadow-sm z-10 pointer-events-none">
                    {product.tag}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Product Specifications & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            
            {/* Category & Stock Header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-navy/50">
                {product.category}
              </span>
              <span className="h-1 w-1 rounded-full bg-navy/20" />
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {product.stockStatus || 'In Stock'}
              </span>
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
                      onClick={() => setSelectedColor(color)}
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
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-3 rounded-2xl text-xs font-bold transition border cursor-pointer ${
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
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-navy hover:bg-[#F0F2F5] transition text-base font-bold cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-sm text-navy">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-navy hover:bg-[#F0F2F5] transition text-base font-bold cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 w-full bg-navy hover:bg-[#002b4e] text-white font-bold py-4 px-6 rounded-full transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
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
                className="flex-1 w-full bg-[#FFCD00] hover:bg-navy hover:text-white text-navy font-bold py-4 px-6 rounded-full transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="w-14 h-14 shrink-0 rounded-full bg-white border border-navy/15 transition duration-200 flex items-center justify-center shadow-sm hover:border-navy hover:scale-105 active:scale-95 cursor-pointer"
                title={isWishlisted(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                aria-label="Wishlist"
              >
                <svg
                  width="22"
                  height="22"
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
            </div>
          </div>
        </div>

        {/* Tabbed Specifications and Details */}
        <div ref={sizeChartRef} className="rounded-[40px] bg-white border border-navy/5 p-8 sm:p-14 shadow-card mb-20">
          <div className="flex border-b border-navy/10 mb-8 overflow-x-auto scrollbar-none gap-2">
            {[
              { key: 'details', label: 'Product Features' },
              { key: 'sizeGuide', label: 'Size Guide & Fit' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-4 px-6 font-heading font-bold text-sm whitespace-nowrap transition border-b-2 ${
                  activeTab === tab.key
                    ? 'border-navy text-navy font-bold'
                    : 'border-transparent text-navy/50 hover:text-navy'
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
                    ✨ <strong>One Size Fits Most (Adaptive Stretch):</strong> Crafted from 4-way ultra-stretch performance fabric. Choose <strong>Type A</strong> for sizes XS to M or <strong>Type B</strong> for sizes L to XXL.
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
                    <tr><td className="p-3.5 font-bold text-navy">Type A</td><td className="p-3.5 font-semibold">XS to M</td><td className="p-3.5">32 - 40</td><td className="p-3.5">26 - 33</td><td className="p-3.5">155 - 180</td><td className="p-3.5">48 - 78</td></tr>
                    <tr><td className="p-3.5 font-bold text-navy">Type B</td><td className="p-3.5 font-semibold">L to XXL</td><td className="p-3.5">41 - 48</td><td className="p-3.5">34 - 42</td><td className="p-3.5">175 - 195</td><td className="p-3.5">75 - 105</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* You May Also Like / Recommendations */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent block">Explore More</span>
              <h2 className="font-heading text-3xl font-bold text-navy">You May Also Like</h2>
            </div>
            <Link to="/shop" className="text-sm font-bold text-navy hover:text-accent transition flex items-center gap-1">
              View Entire Store →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                to={`/shop/${p.id}`}
                className="group rounded-3xl bg-white border border-navy/5 p-5 shadow-card hover:shadow-float transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#F0F2F5] mb-4 flex items-center justify-center p-3 relative">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                    {p.tag && (
                      <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-0.5 text-[10px] font-bold rounded-full text-navy shadow-sm">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">
                    {p.category}
                  </span>
                  <h3 className="font-heading font-bold text-sm text-navy group-hover:text-accent transition line-clamp-2">
                    {p.title}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-navy/5 flex justify-between items-baseline">
                  <span className="font-heading font-bold text-navy text-base">
                    
                  </span>
                  <span className="text-xs font-bold text-accent group-hover:underline">
                    View Gear →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

function InteractiveProductImage({ src, alt }) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full h-full flex items-center justify-center overflow-hidden touch-none relative select-none"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain p-6 transition-transform duration-75 will-change-transform pointer-events-none select-none"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
        draggable={false}
      />
      {scale > 1 && (
        <button
          type="button"
          onClick={() => {
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

