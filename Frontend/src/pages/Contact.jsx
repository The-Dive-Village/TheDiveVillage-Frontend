import { useState, useEffect } from 'react'
import { Link, useSearchParams, useLocation } from 'react-router'
import { motion, useReducedMotion } from 'framer-motion'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { IMAGES, CAROUSEL_IMAGES, PANEL_IMAGES } from '../utils/images'
const bookVideo = 'https://res.cloudinary.com/bbgt5nk7/video/upload/v1790242027/dive-village/hero-360/duskamhque0kugdulev7.mp4'
const compiledNightDiveVideo = 'https://res.cloudinary.com/bbgt5nk7/video/upload/v1790244122/dive-village/ui-videos/compiled_night_dive_video_2_mp4.mp4'
import useNightDive from '../hooks/useNightDive'
import SEOHead from '../components/SEOHead'
import api from '../services/api'

export default function Contact() {
  const isNightDive = useNightDive()
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const getInitialMessage = () => {
    return searchParams.get('message') || searchParams.get('special_requests') || location.state?.message || ''
  }

  const getInitialSubject = () => {
    return searchParams.get('subject') || location.state?.subject || (getInitialMessage() ? 'Special Request' : 'General Enquiry')
  }

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: getInitialSubject(),
    message: getInitialMessage(),
  })

  useEffect(() => {
    const msg = searchParams.get('message') || searchParams.get('special_requests') || location.state?.message
    const subj = searchParams.get('subject') || location.state?.subject
    if (msg !== undefined && msg !== null) {
      setFormData((prev) => ({
        ...prev,
        message: msg,
        subject: subj || prev.subject || 'Special Request'
      }))
    }
  }, [searchParams, location.state])
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
      await api.post('/api/content/contact', {
        fullName: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      })

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
    <div className={`min-h-screen text-navy font-body overflow-x-hidden ${isNightDive ? 'bg-[#0b1726]' : 'bg-[#FAFAFA]'}`} style={{ textShadow: 'none' }}>
      <SEOHead
        title="Contact Us & Custom Dive Charters | The Dive Village"
        description="Get in touch with The Dive Village for custom scuba itineraries, diving course enquiries, private boat charters, and island travel logistics."
        keywords="contact dive village, scuba diving inquiry, course booking, custom dive charter, island travel assistance"
        canonicalUrl="https://thedivevillage.com/contact"
      />

      {/* 1. HEADER VIDEO HERO (DYNAMIC COMPILED NIGHT DIVE VIDEO) */}
      <section className="relative h-[56vh] min-h-[420px] lg:h-[60vh] lg:min-h-[460px] w-full flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%)'
          }}
        >
          <video
            key={isNightDive ? 'night-compiled' : 'day-book'}
            src={isNightDive ? compiledNightDiveVideo : bookVideo}
            autoPlay
            loop
            muted
            playsInline
            onPlay={(e) => { e.currentTarget.playbackRate = 0.7 }}
            className="w-full h-full object-cover scale-135 sm:scale-145 lg:scale-155 origin-center transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#001428]/65 via-[#001428]/25 to-transparent pointer-events-none" />
        </div>

        {/* Bottom Ultra-Smooth Dissolve & Merge Layer */}
        <div 
          className={`absolute bottom-0 inset-x-0 h-28 sm:h-36 lg:h-44 pointer-events-none z-[5] transition-colors duration-500 ${
            isNightDive 
              ? 'bg-gradient-to-t from-[#0b1726] via-[#0b1726]/85 via-45% to-transparent' 
              : 'bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/90 via-45% to-transparent'
          }`} 
        />

        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto pt-4 sm:pt-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-heading text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-white leading-none drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
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

      {/* 2. MAIN FORM SECTION */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-16 sm:pb-24 w-full min-w-0">

        {/* Form Container - Centered, Compact Width & Optimized Internal Spacing */}
        <div className="max-w-xl mx-auto w-full bg-white rounded-2xl sm:rounded-[36px] p-4 xs:p-6 sm:p-10 border border-navy/5 shadow-card">
          <div className="mb-4 sm:mb-6 text-left">
            <span className="text-accent font-bold tracking-widest uppercase text-[9px] sm:text-xs mb-1 block">Direct Inquiry</span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-navy">Send Us a Message</h2>
            <p className="text-xs sm:text-sm text-navy/70 mt-1">Fill out the details below and our team will get back to you promptly.</p>
          </div>

          {success && (
            <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-emerald-50 p-3 sm:p-4 text-xs sm:text-sm font-semibold text-emerald-700 border border-emerald-100">
              ✅ Your message has been sent to our team! We will get back to you shortly.
            </div>
          )}
          {error && (
            <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-red-50 p-3 sm:p-4 text-xs sm:text-sm font-semibold text-red-700 border border-red-100">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-5 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="mb-1 sm:mb-1.5 block text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-[#F0F2F5] px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition placeholder:text-navy/30"
                />
              </div>
              <div>
                <label className="mb-1 sm:mb-1.5 block text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-[#F0F2F5] px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition placeholder:text-navy/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="mb-1 sm:mb-1.5 block text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">Phone Number</label>
                <PhoneInput
                  defaultCountry="IN"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
                  className="w-full rounded-xl bg-[#F0F2F5] px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-navy outline-none focus-within:ring-2 focus-within:ring-accent/50 transition [&_.PhoneInputCountryIcon]:rounded-sm [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:border-none [&_.PhoneInputCountrySelect]:outline-none [&_.PhoneInputCountryIcon--border]:border-none [&_.PhoneInputInput]:ml-2"
                />
              </div>
              <div>
                <label className="mb-1 sm:mb-1.5 block text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">Select Your Subject</label>
                <div className="relative">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-[#F0F2F5] px-3.5 py-2.5 sm:px-4 sm:py-3 pr-8 text-xs sm:text-sm font-semibold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition appearance-none cursor-pointer"
                  >
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Post Update">Post Update</option>
                    <option value="Certifications">Certifications</option>
                    <option value="Special Request">Special Request</option>
                    <option value="Support">Support</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-navy/60">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 sm:mb-1.5 block text-[9px] sm:text-xs font-bold text-navy/70 uppercase tracking-wider">Message / Special Requests</label>
              <textarea
                name="message"
                placeholder="Anything else we should know?"
                rows="3"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full rounded-xl sm:rounded-2xl bg-[#F0F2F5] p-3 sm:p-4 text-xs sm:text-sm font-semibold text-navy outline-none focus:ring-2 focus:ring-accent/50 transition placeholder:text-navy/30 resize-none"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-navy text-white hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Blocks - 3 buttons in a single line, whole box acts as clickable redirect button */}
        <div className="mt-10 sm:mt-16 lg:mt-20 grid grid-cols-3 gap-2 xs:gap-3 sm:gap-6 text-center max-w-4xl mx-auto w-full min-w-0">
          
          {/* Box 1: Call & WhatsApp */}
          <a
            href="tel:+918971001010"
            className="flex flex-col items-center justify-center bg-white p-2.5 xs:p-3.5 sm:p-6 rounded-xl xs:rounded-2xl sm:rounded-3xl border border-navy/5 shadow-card hover:shadow-float hover:border-[#FFCD00]/50 hover:-translate-y-1 transition-all duration-300 group cursor-pointer active:scale-95 text-center min-w-0"
          >
            <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full bg-navy/5 text-navy group-hover:bg-[#FFCD00] group-hover:text-navy flex items-center justify-center mb-1.5 sm:mb-3 transition-colors shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
            </div>
            <h4 className="font-bold text-navy mb-0.5 sm:mb-1.5 text-[11px] xs:text-xs sm:text-base group-hover:text-navy truncate max-w-full">Call Us</h4>
            <span className="text-[9px] xs:text-[10px] sm:text-sm text-navy/70 group-hover:text-[#FFCD00] font-bold transition-colors truncate max-w-full block">+91 89710 01010</span>
          </a>

          {/* Box 2: Write to Us */}
          <a
            href="mailto:sanjeev.bajaj@thedivevillage.co"
            className="flex flex-col items-center justify-center bg-white p-2.5 xs:p-3.5 sm:p-6 rounded-xl xs:rounded-2xl sm:rounded-3xl border border-navy/5 shadow-card hover:shadow-float hover:border-[#FFCD00]/50 hover:-translate-y-1 transition-all duration-300 group cursor-pointer active:scale-95 text-center min-w-0"
          >
            <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full bg-navy/5 text-navy group-hover:bg-[#FFCD00] group-hover:text-navy flex items-center justify-center mb-1.5 sm:mb-3 transition-colors shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></svg>
            </div>
            <h4 className="font-bold text-navy mb-0.5 sm:mb-1.5 text-[11px] xs:text-xs sm:text-base group-hover:text-navy truncate max-w-full">Mail Us</h4>
            <span className="text-[9px] xs:text-[10px] sm:text-sm text-navy/70 group-hover:text-[#FFCD00] font-bold transition-colors truncate max-w-full block">sanjeev.bajaj@thedivevillage.co</span>
          </a>

          {/* Box 3: Availability */}
          <a
            href="https://wa.me/918971001010"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center bg-white p-2.5 xs:p-3.5 sm:p-6 rounded-xl xs:rounded-2xl sm:rounded-3xl border border-navy/5 shadow-card hover:shadow-float hover:border-[#FFCD00]/50 hover:-translate-y-1 transition-all duration-300 group cursor-pointer active:scale-95 text-center min-w-0"
          >
            <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full bg-navy/5 text-navy group-hover:bg-[#FFCD00] group-hover:text-navy flex items-center justify-center mb-1.5 sm:mb-3 transition-colors shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            </div>
            <h4 className="font-bold text-navy mb-0.5 sm:mb-1.5 text-[11px] xs:text-xs sm:text-base group-hover:text-navy truncate max-w-full">Availability</h4>
            <span className="text-[9px] xs:text-[10px] sm:text-sm text-navy/70 group-hover:text-[#FFCD00] font-bold transition-colors truncate max-w-full block">Open 24/7 • Chat</span>
          </a>
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

        {/* Bottom CTA Banner with Video on Desktop & Image on Mobile */}
        <div className="mt-24 sm:mt-32 rounded-[40px] text-white p-8 sm:p-14 lg:p-20 relative overflow-hidden shadow-2xl border border-white/20 group">
          {/* Mobile Background Image (Mobile Only) */}
          <img
            src={PANEL_IMAGES[6]}
            alt="Ocean Escape"
            className="block md:hidden absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />

          {/* Desktop Video Background (Desktop Only) */}
          <video
            src={isNightDive ? compiledNightDiveVideo : divingVid}
            autoPlay
            loop
            muted
            playsInline
            className="hidden md:block absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] group-hover:scale-105 opacity-60"
          />

          {/* Ambient Overlays for Contrast & Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#001428]/95 via-[#001428]/70 to-[#001428]/35 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001428]/85 via-transparent to-black/20 pointer-events-none" />
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

          {/* Content Overlay */}
          <div className="relative z-10 max-w-2xl flex flex-col justify-center">
            <span className="inline-block self-start bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-widest mb-6 shadow-sm">
              Start Now
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4 drop-shadow-md">
              Discover Your Next <span className="font-heading font-bold text-accent"><br />Ocean Escape</span>
            </h2>
            <p className="text-base sm:text-lg font-medium text-white/90 leading-relaxed max-w-xl mb-8 drop-shadow-sm">
              Ready to take the plunge? Plan your trip in minutes and enjoy every moment of your dive adventure with certified dive experts.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
              <Link
                to="/book-us"
                className="rounded-full bg-white/15 backdrop-blur-xl border border-white/30 text-white font-bold px-5 py-2.5 sm:px-8 sm:py-4 text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex items-center gap-1.5 sm:gap-2 cursor-pointer"
              >
                <span>Book Your Dive Now</span>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/services"
                className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-4 py-2.5 sm:px-6 sm:py-4 text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] cursor-pointer"
              >
                Explore Programs
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
