import { useState } from 'react'
import { Link } from 'react-router'
import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/formatCurrency'
import Button from '../components/Button'

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [shippingMethod, setShippingMethod] = useState('standard')

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Karnataka',
    postalCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    upiId: '',
    saveInfo: true,
  })

  const shippingCost = shippingMethod === 'express' ? 199 : (subtotal >= 1999 || subtotal === 0 ? 0 : 99)
  const grandTotal = subtotal + shippingCost

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const generatedId = `DV-${Math.floor(100000 + Math.random() * 900000)}`
    setOrderId(generatedId)
    setSuccess(true)
    clearCart()
  }

  if (success) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen flex flex-col items-center justify-center px-4 py-24 text-navy font-body" style={{ textShadow: 'none' }}>
        <div className="rounded-[40px] bg-white p-8 sm:p-14 shadow-float max-w-xl w-full border border-navy/5 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-3xl shadow-soft">
            ✓
          </div>
          
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-3 inline-block">
            Order Confirmed
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy mb-2">
            Thank You for Your Order!
          </h2>
          <p className="text-navy/70 text-sm mb-6 leading-relaxed">
            Your official Dive Village merchandise order <strong className="text-navy font-mono font-bold">#{orderId}</strong> has been received and is being prepared for dispatch.
          </p>

          <div className="bg-[#F0F4F8] rounded-3xl p-6 mb-8 text-left text-xs space-y-3">
            <div className="flex justify-between border-b border-navy/10 pb-2">
              <span className="text-navy/60">Estimated Delivery</span>
              <strong className="text-navy">Confirmed via WhatsApp</strong>
            </div>
            <div className="flex justify-between border-b border-navy/10 pb-2">
              <span className="text-navy/60">Confirmation Sent To</span>
              <strong className="text-navy">{formData.email || 'your registered email'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/60">Payment Method</span>
              <strong className="text-navy uppercase">{paymentMethod}</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/shop"
              className="rounded-full bg-navy px-8 py-4 text-sm font-bold text-white transition hover:bg-accent shadow-md text-center"
            >
              Continue Shopping →
            </Link>
            <Link
              to="/"
              className="rounded-full bg-[#F0F2F5] px-8 py-4 text-sm font-bold text-navy transition hover:bg-navy/10 text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-navy font-body pt-24 sm:pt-32 pb-24" style={{ textShadow: 'none' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 border-b border-navy/10 pb-6 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent mb-1 block">Final Step</span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-navy tracking-tight">Secure Checkout</h1>
          </div>
          <Link to="/cart" className="text-xs sm:text-sm font-bold text-navy hover:text-accent transition underline">
            ← Return to Cart
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Main Checkout Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* 1. Contact Info */}
              <section className="bg-white rounded-[32px] border border-navy/5 p-6 sm:p-8 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white text-xs font-bold">1</span>
                  <h3 className="font-heading text-xl font-bold text-navy">Contact Details</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold text-navy/70">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-2xl bg-[#F0F2F5] px-4 py-3.5 text-xs sm:text-sm text-navy outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold text-navy/70">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 89710 01010"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-2xl bg-[#F0F2F5] px-4 py-3.5 text-xs sm:text-sm text-navy outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>
                </div>
              </section>

              {/* 2. Shipping Address */}
              <section className="bg-white rounded-[32px] border border-navy/5 p-6 sm:p-8 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white text-xs font-bold">2</span>
                  <h3 className="font-heading text-xl font-bold text-navy">Shipping Destination</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-xs font-bold text-navy/70">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full rounded-2xl bg-[#F0F2F5] px-4 py-3.5 text-xs sm:text-sm text-navy outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-bold text-navy/70">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full rounded-2xl bg-[#F0F2F5] px-4 py-3.5 text-xs sm:text-sm text-navy outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-navy/70">Street Address / Resort Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="House/Villa no., street, locality"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full rounded-2xl bg-[#F0F2F5] px-4 py-3.5 text-xs sm:text-sm text-navy outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="mb-2 block text-xs font-bold text-navy/70">City *</label>
                      <input
                        type="text"
                        name="city"
                        autoComplete="address-level2"
                        required
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full rounded-2xl bg-[#F0F2F5] px-4 py-3.5 text-xs sm:text-sm text-navy outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-bold text-navy/70">State / Region *</label>
                      <input
                        type="text"
                        name="state"
                        autoComplete="address-level1"
                        required
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full rounded-2xl bg-[#F0F2F5] px-4 py-3.5 text-xs sm:text-sm text-navy outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-bold text-navy/70">PIN / Postal Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        required
                        placeholder="PIN Code"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full rounded-2xl bg-[#F0F2F5] px-4 py-3.5 text-xs sm:text-sm text-navy outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Delivery Method */}
              <section className="bg-white rounded-[32px] border border-navy/5 p-6 sm:p-8 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white text-xs font-bold">3</span>
                  <h3 className="font-heading text-xl font-bold text-navy">Delivery Speed</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <label
                    className={`rounded-2xl border p-4 flex items-center justify-between cursor-pointer transition ${
                      shippingMethod === 'standard' ? 'border-navy bg-navy/5 shadow-sm' : 'border-navy/15 hover:border-navy/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="w-4 h-4 text-navy"
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-navy">Standard Delivery</p>
                        <p className="text-[11px] text-navy/60">Delivery date and time will be confirmed through whatsapp.</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700">
                      {subtotal >= 1999 ? 'FREE' : '₹99'}
                    </span>
                  </label>

                  <label
                    className={`rounded-2xl border p-4 flex items-center justify-between cursor-pointer transition ${
                      shippingMethod === 'express' ? 'border-navy bg-navy/5 shadow-sm' : 'border-navy/15 hover:border-navy/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="w-4 h-4 text-navy"
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-navy">Express Delivery</p>
                        <p className="text-[11px] text-navy/60">Delivery date and time will be confirmed through whatsapp.</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-navy">₹199</span>
                  </label>
                </div>
              </section>

              {/* 4. Payment Methods */}
              <section className="bg-white rounded-[32px] border border-navy/5 p-6 sm:p-8 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white text-xs font-bold">4</span>
                  <h3 className="font-heading text-xl font-bold text-navy">Payment Method</h3>
                </div>

                <div className="space-y-3 mb-6">
                  {/* Payment Options */}
                  <label
                    className={`rounded-2xl border p-4 block cursor-pointer transition ${
                      paymentMethod === 'upi' ? 'border-navy bg-navy/5' : 'border-navy/15 hover:border-navy/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="w-4 h-4 text-navy"
                        />
                        <span className="text-xs sm:text-sm font-bold text-navy">UPI (GPay, PhonePe, Paytm)</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">Instant</span>
                    </div>
                  </label>

                  <label
                    className={`rounded-2xl border p-4 block cursor-pointer transition ${
                      paymentMethod === 'card' ? 'border-navy bg-navy/5' : 'border-navy/15 hover:border-navy/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="w-4 h-4 text-navy"
                        />
                        <span className="text-xs sm:text-sm font-bold text-navy">Credit / Debit Card</span>
                      </div>
                      <div className="flex gap-1 text-[10px] text-navy/60 font-mono">
                        <span>Visa</span> • <span>Mastercard</span>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`rounded-2xl border p-4 block cursor-pointer transition ${
                      paymentMethod === 'netbanking' ? 'border-navy bg-navy/5' : 'border-navy/15 hover:border-navy/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="netbanking"
                          checked={paymentMethod === 'netbanking'}
                          onChange={() => setPaymentMethod('netbanking')}
                          className="w-4 h-4 text-navy"
                        />
                        <span className="text-xs sm:text-sm font-bold text-navy">Netbanking</span>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery / Pay at Island */}
                  <label
                    className={`rounded-2xl border p-4 block cursor-pointer transition ${
                      paymentMethod === 'cod' ? 'border-navy bg-navy/5' : 'border-navy/15 hover:border-navy/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="w-4 h-4 text-navy"
                        />
                        <span className="text-xs sm:text-sm font-bold text-navy">Pay on Island Arrival / COD</span>
                      </div>
                      <span className="text-xs font-bold text-navy/60">Island Hubs</span>
                    </div>
                  </label>
                </div>
              </section>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-full bg-navy py-5 text-base font-bold text-white transition hover:bg-accent shadow-lift flex items-center justify-center gap-2"
              >
                <span>Complete Purchase ({formatCurrency(grandTotal)})</span>
                <span>→</span>
              </button>

            </form>
          </div>

          {/* Sticky Order Summary Sidebar */}
          <div className="lg:col-span-4 sticky top-32 rounded-[36px] bg-white border border-navy/5 p-6 sm:p-8 shadow-float">
            <h3 className="font-heading text-xl font-bold text-navy mb-6 pb-4 border-b border-navy/10">
              Order Summary ({items.length})
            </h3>

            {/* Itemized list */}
            <div className="space-y-4 mb-6 max-h-[36vh] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="w-14 h-16 rounded-xl bg-[#F0F2F5] p-1 shrink-0 flex items-center justify-center relative">
                    <img
                      src={item.product?.image}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                    />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-navy text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-navy truncate">{item.product?.name}</h4>
                    <p className="text-[10px] text-navy/60">
                      {item.product?.selectedSize && `Size: ${item.product.selectedSize}`} {item.product?.selectedColor && `• ${item.product.selectedColor}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations removed */}

            <div className="rounded-2xl bg-[#F0F4F8] p-4 text-[11px] text-navy/70 space-y-1.5">
              <p className="flex items-center gap-1.5 font-bold text-navy">
                <span>🔒</span> 256-Bit SSL Encrypted
              </p>
              <p>Your transaction is safe and protected by industry-standard protocols.</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
