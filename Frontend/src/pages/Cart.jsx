import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/formatCurrency'
import Button from '../components/Button'

export default function Cart() {
  const { items, itemCount, subtotal, loading, removeItem, updateQuantity } = useCart()
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState('')

  const freeShippingThreshold = 1999
  const amountAwayFromFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99
  const finalTotal = Math.max(0, subtotal - discount + shippingFee)

  const handleApplyPromo = (e) => {
    e.preventDefault()
    setPromoError('')
    setPromoSuccess('')

    const code = promoCode.trim().toUpperCase()
    if (code === 'DIVE10' || code === 'VILLAGE10') {
      const disc = Math.round(subtotal * 0.1)
      setDiscount(disc)
      setPromoSuccess(`🎉 10% discount applied! You saved ${formatCurrency(disc)}`)
    } else if (code === 'FREESHIP') {
      setDiscount(shippingFee)
      setPromoSuccess('🎉 Free shipping coupon applied!')
    } else {
      setPromoError('Invalid coupon code. Try "DIVE10" for 10% off.')
    }
  }

  return (
    <div
      className={isDashboard ? 'text-navy font-body' : 'min-h-screen bg-[#FAFAFA] text-navy font-body pt-24 sm:pt-32 pb-24'}
      style={{ textShadow: 'none' }}
    >
      <div className={isDashboard ? 'w-full' : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'}>
        
        {/* Header */}
        <div className="mb-8 border-b border-navy/10 pb-6 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent mb-1 block">Shopping Bag</span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-navy tracking-tight">Your Cart</h1>
            <p className="mt-1 text-sm text-navy/60 font-medium">
              {loading ? 'Updating cart...' : `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`}
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-navy hover:text-accent transition underline decoration-2 underline-offset-4"
          >
            ← Continue Shopping
          </Link>
        </div>

        {items.length === 0 && !loading ? (
          <div className="py-16 sm:py-20 text-center max-w-xl mx-auto bg-[#F8FAFC] rounded-[36px] p-8 sm:p-12 shadow-sm border border-navy/5">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm border border-navy/10">
              🛍️
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3 text-navy">Your cart is empty.</h2>
            <p className="text-navy/60 mb-8 text-sm leading-relaxed max-w-md mx-auto">
              Explore our ocean-crafted hoodies, pro dive suits, UPF 50+ rash guards, and branded essentials, or reserve your next certification course.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button as={Link} to="/shop" className="w-full sm:w-auto justify-center bg-navy text-white hover:bg-accent">
                Explore Merchandise Store →
              </Button>
              <Button as={Link} to="/book-us" variant="secondary" className="w-full sm:w-auto justify-center border-navy/20 text-navy hover:bg-navy/5">
                Explore Courses
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Free Shipping Progress Alert */}
              <div className="rounded-2xl bg-white border border-navy/10 p-4 shadow-sm">
                {amountAwayFromFreeShipping === 0 ? (
                  <p className="text-xs font-bold text-emerald-700 flex items-center gap-2">
                    <span>🎉</span> You have qualified for <strong>FREE Express Shipping</strong>!
                  </p>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-navy/80 mb-2">
                      Add <strong className="text-accent">{formatCurrency(amountAwayFromFreeShipping)}</strong> more to unlock <strong>FREE Shipping</strong>!
                    </p>
                    <div className="w-full h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="bg-white rounded-[32px] border border-navy/5 p-6 sm:p-8 shadow-card divide-y divide-navy/10">
                {items.map((item) => {
                  const product = item.product || {}
                  const itemPrice = item.price ?? product.price ?? 0
                  const itemSubtotal = item.subtotal ?? itemPrice * (item.quantity || 1)

                  return (
                    <div key={item.id || item.inventoryId} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                      
                      {/* Image */}
                      <Link
                        to={`/shop/${product.id || ''}`}
                        className="w-24 sm:w-28 h-28 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-[#F0F2F5] p-2 flex items-center justify-center hover:opacity-90 transition"
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.title || product.name || 'Product'}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <div className="text-2xl text-navy/40">🤿</div>
                        )}
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-1 sm:gap-4 mb-2">
                          <Link
                            to={`/shop/${product.id || ''}`}
                            className="font-heading text-base sm:text-lg font-bold text-navy hover:text-accent transition leading-snug"
                          >
                            {product.title || product.name || 'Dive Item'}
                          </Link>
                          <span className="font-heading text-base font-bold text-navy sm:text-right shrink-0">
                            {formatCurrency(itemSubtotal)}
                          </span>
                        </div>

                        {/* Metadata & Unit Price */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-navy/60 mb-4">
                          <span className="font-bold text-navy">
                            {formatCurrency(itemPrice)} each
                          </span>
                          {product.selectedSize && product.selectedSize !== 'Standard' && (
                            <span className="bg-[#F0F2F5] px-2.5 py-1 rounded-lg font-semibold text-navy">
                              Size: {product.selectedSize}
                            </span>
                          )}
                          {product.selectedColor && product.selectedColor !== 'Standard' && (
                            <span className="bg-[#F0F2F5] px-2.5 py-1 rounded-lg font-semibold text-navy">
                              Color: {product.selectedColor}
                            </span>
                          )}
                          {product.category && (
                            <span className="text-[10px] uppercase font-bold text-accent tracking-wider">
                              {product.category}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls & Remove */}
                        <div className="flex items-center justify-between gap-4 pt-1">
                          <div className="inline-flex items-center rounded-xl border border-navy/20 p-0.5 bg-white shadow-xs">
                            <button
                              type="button"
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-navy transition hover:bg-[#F0F2F5] font-bold cursor-pointer disabled:opacity-40"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-navy">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-navy transition hover:bg-[#F0F2F5] font-bold cursor-pointer"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-800 transition flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-rose-50 cursor-pointer"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                            Remove
                          </button>
                        </div>

                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Promo Code Input */}
              <div className="bg-white rounded-3xl border border-navy/5 p-6 shadow-card">
                <h3 className="font-heading text-sm font-bold text-navy mb-3">Have a Promo or Gift Code?</h3>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. DIVE10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 rounded-2xl bg-[#F0F2F5] px-4 py-2.5 text-xs sm:text-sm text-navy uppercase font-bold outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <button
                    type="submit"
                    className="rounded-2xl bg-navy text-white px-5 py-2.5 text-xs font-bold hover:bg-accent transition cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
                {promoSuccess && <p className="text-xs font-bold text-emerald-600 mt-2">{promoSuccess}</p>}
                {promoError && <p className="text-xs font-bold text-red-500 mt-2">{promoError}</p>}
              </div>

            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4 sticky top-28 rounded-[36px] bg-white border border-navy/5 p-6 sm:p-8 shadow-card space-y-6">
              <h2 className="font-heading text-xl font-bold text-navy pb-4 border-b border-navy/10">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm font-medium text-navy/70">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span className="font-bold text-navy">{itemCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-navy">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className={`font-bold ${shippingFee === 0 ? 'text-emerald-600' : 'text-navy'}`}>
                    {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount</span>
                    <span>- {formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-navy pt-4 border-t border-navy/10">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-heading font-bold text-2xl text-navy">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-navy hover:bg-accent text-white hover:text-navy px-8 py-4 text-sm font-bold transition shadow-md cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <span>→</span>
              </Link>

              <div className="space-y-2 pt-4 border-t border-navy/5 text-[11px] text-navy/60 text-center">
                <p>🔒 256-Bit Bank Grade SSL Encryption</p>
                <p>📦 100% Genuine Branded Merchandise Guarantee</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

