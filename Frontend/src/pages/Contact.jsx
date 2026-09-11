import { useState } from 'react'
import { Link } from 'react-router'
import { motion, useReducedMotion } from 'framer-motion'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { IMAGES, CAROUSEL_IMAGES, PANEL_IMAGES } from '../utils/images'
import bookVideo from '../assets/Book(2).mp4'
import jellyfishVideo from '../assets/jelly fish.mp4'
import useNightDive from '../hooks/useNightDive'
import InteractiveVideoSphere from '../components/InteractiveVideoSphere'
import SEOHead from '../components/SEOHead'

export default function Contact() {
  const isNightDive = useNightDive()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Enquiry',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const reduce = useReducedMotion()

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('http://localhost:5000/api/content/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message. Please try again.')
      }

      setSuccess(true)
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'General Enquiry',
        message: '',
      })
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-navy font-body overflow-x-hidden" style={{ textShadow: 'none' }}>
      <SEOHead
        title="Contact Us & Custom Dive Charters | The Dive Village"
        description="Get in touch with The Dive Village for custom scuba itineraries, PADI course enquiries, private boat charters, and island travel logistics."
        keywords="contact dive village, scuba diving inquiry, PADI course booking, custom dive charter, island travel assistance"
        canonicalUrl="https://thedivevillage.com/contact"
      />

      {/* 1. HEADER VIDEO HERO (DYNAMIC NIGHT DIVE JELLYFISH VIDEO) */}
      <section className="relative h-[75vh] min-h-[540px] w-full flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)'
          }}
        >
          <video
            key={isNightDive ? 'night-jellyfish' : 'day-book'}
            src={isNightDive ? jellyfishVideo : bookVideo}
            autoPlay
            loop
            muted
            playsInline
            onPlay={(e) => { e.currentTarget.playbackRate = 0.7 }}
            className="w-full h-full object-cover transition-opacity duration-700"
          />
          <div className={`absolute inset-0 bg-gradient-to-b from-[#001428]/60 via-[#001428]/35 ${isNightDive ? 'to-[#030a12]' : 'to-[#FAFAFA]'}`}></div>
        </div>

        {/* Bottom Smooth Dissolve & Merge Layer */}
        <div 
          className={`absolute bottom-0 inset-x-0 h-44 sm:h-64 pointer-events-none z-[5] transition-colors duration-500 ${
            isNightDive 
              ? 'bg-gradient-to-t from-[#030a12] via-[#030a12]/85 to-transparent' 
              : 'bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent'
          }`} 
        />

        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto pt-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-widest mb-6 border border-white/20 shadow-sm"
          >
            Plan Your Journey
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-white leading-none drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
          >
            Contact <span className="text-[#FFCD00]">Us</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl font-medium text-white/90 max-w-xl leading-relaxed drop-shadow-md text-center"
          >
            Tell us when and where you'd like to dive and we'll confirm availability within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* 2. MAIN FORM & INTERACTIVE SPHERE SECTION */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

        {/* Main Split Section */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* Form */}
          <div className="w-full bg-white rounded-[36px] p-6 sm:p-10 border border-navy/5 shadow-card">
            <div className="mb-8">
              <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">Direct Inquiry</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy">Send Us a Message</h2>
              <p className="text-xs sm:text-sm text-navy/70 mt-1">Fill out the details below and our team will get back to you promptly.</p>
            </div>

            {success && (
              <div className="mb-8 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 border border-emerald-100">
                ✅ Your message has been sent to our team! We will get back to you shortly.
              </div>
            )}
            {error && (
              <div className="mb-8 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700 border border-red-100">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="mb-3 block text-xs font-bold text-navy/70">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 text-sm text-navy outline-none focus:ring-2 focus:ring-accent/50 transition placeholder:text-navy/30"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-xs font-bold text-navy/70">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 text-sm text-navy outline-none focus:ring-2 focus:ring-accent/50 transition placeholder:text-navy/30"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="mb-3 block text-xs font-bold text-navy/70">Phone Number</label>
                  <PhoneInput
                    defaultCountry="IN"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
                    className="w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 text-sm font-bold text-navy outline-none focus-within:ring-2 focus-within:ring-accent/50 transition [&_.PhoneInputCountryIcon]:rounded-sm [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:border-none [&_.PhoneInputCountrySelect]:outline-none [&_.PhoneInputCountryIcon--border]:border-none [&_.PhoneInputInput]:ml-3"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-xs font-bold text-navy/70">Select Your Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 text-sm text-navy outline-none focus:ring-2 focus:ring-accent/50 transition appearance-none cursor-pointer"
                  >
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Post Update">Post Update</option>
                    <option value="Certifications">Certifications</option>
                    <option value="Special Request">Special Request</option>
                    <option value="Support">Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-xs font-bold text-navy/70">Message / Special Requests</label>
                <textarea
                  name="message"
                  placeholder="Anything else we should know?"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full rounded-3xl bg-[#F0F2F5] p-5 text-sm text-navy outline-none focus:ring-2 focus:ring-accent/50 transition placeholder:text-navy/30 resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto rounded-full bg-navy text-white hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] px-8 py-4 text-sm font-bold transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Reserve Your Spot'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Video / Interactive Sphere */}
          <div className="relative w-full aspect-[3/4] lg:aspect-auto min-h-[460px] rounded-[36px] overflow-hidden shadow-card border border-navy/5">
            <InteractiveVideoSphere autoRotate={false} />
          </div>
        </div>

        {/* Info Blocks */}
        <div className="mt-24 sm:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
          <div className="flex flex-col items-center bg-white p-8 rounded-3xl border border-navy/5 shadow-card hover:shadow-float transition">
            <div className="w-12 h-12 rounded-full bg-navy/5 text-navy flex items-center justify-center mb-5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
            </div>
            <h4 className="font-bold text-navy mb-2">Call & WhatsApp</h4>
            <a href="tel:+918971001010" className="text-xs text-navy/70 hover:text-accent font-semibold transition">+91 89710 01010</a>
          </div>

          <div className="flex flex-col items-center bg-white p-8 rounded-3xl border border-navy/5 shadow-card hover:shadow-float transition">
            <div className="w-12 h-12 rounded-full bg-navy/5 text-navy flex items-center justify-center mb-5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></svg>
            </div>
            <h4 className="font-bold text-navy mb-2">Write to Us</h4>
            <a href="mailto:sanjeev.bajaj@thedivevillage.co" className="text-xs text-navy/70 hover:text-accent font-semibold transition truncate max-w-full">sanjeev.bajaj@thedivevillage.co</a>
          </div>

          <div className="flex flex-col items-center bg-white p-8 rounded-3xl border border-navy/5 shadow-card hover:shadow-float transition">
            <div className="w-12 h-12 rounded-full bg-navy/5 text-navy flex items-center justify-center mb-5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            </div>
            <h4 className="font-bold text-navy mb-2">Availability</h4>
            <span className="text-xs text-navy/80 font-bold">Always open to guide your dive</span>
            <span className="text-xs text-navy/60">Reach out anytime</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-16 flex justify-center gap-4 sm:gap-6">
          <a href="#" className="w-11 h-11 rounded-full bg-white border border-navy/10 shadow-sm flex items-center justify-center text-navy/70 hover:bg-accent hover:text-navy hover:border-accent transition" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
          </a>
          <a href="https://m.me/IamSanjeevbajaj" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-white border border-navy/10 shadow-sm flex items-center justify-center text-navy/70 hover:bg-accent hover:text-navy hover:border-accent transition" aria-label="Facebook Messenger">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3.81l.39-4h-4.2V7a1 1 0 011-1h3z" /></svg>
          </a>
          <a href="#" className="w-11 h-11 rounded-full bg-white border border-navy/10 shadow-sm flex items-center justify-center text-navy/70 hover:bg-accent hover:text-navy hover:border-accent transition" aria-label="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
          </a>
          <a href="#" className="w-11 h-11 rounded-full bg-white border border-navy/10 shadow-sm flex items-center justify-center text-navy/70 hover:bg-accent hover:text-navy hover:border-accent transition" aria-label="YouTube">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33 2.78 2.78 0 001.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33 29 29 0 00-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
          </a>
          <a href="https://wa.me/918971001010" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-white border border-navy/10 shadow-sm flex items-center justify-center text-navy/70 hover:bg-accent hover:text-navy hover:border-accent transition" aria-label="WhatsApp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
          </a>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-24 sm:mt-32 rounded-[40px] bg-[#003865] text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-white/15">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#00AEC7]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="inline-block self-start bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-widest mb-6">
                Start Now
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
                Discover Your Next <span className="font-heading italic font-bold text-accent"><br />Ocean Escape</span>
              </h2>
              <p className="text-base sm:text-lg font-medium text-white/85 leading-relaxed max-w-lg mb-8">
                Ready to take the plunge? Plan your trip in minutes and enjoy every moment of your dive adventure with certified PADI experts.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/book-us"
                  className="rounded-full bg-white/15 backdrop-blur-xl border border-white/25 text-white font-bold px-8 py-4 text-sm uppercase tracking-wider transition-all duration-300 hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>Book Your Dive Now</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to="/services"
                  className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-6 py-4 text-sm uppercase tracking-wider transition duration-300 hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] cursor-pointer"
                >
                  Explore Programs
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 h-72 sm:h-80 lg:h-96 w-full rounded-[32px] overflow-hidden shadow-float relative group border border-white/15">
              <img
                src={PANEL_IMAGES[6]}
                alt="Ocean Escape"
                className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003865]/60 via-transparent to-transparent pointer-events-none" />

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
