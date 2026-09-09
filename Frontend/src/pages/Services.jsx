import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '../components/Button'
import SafeImage from '../components/SafeImage'
import SEOHead from '../components/SEOHead'
import { IMAGES, CAROUSEL_IMAGES } from '../utils/images'
import video2Bg from '../assets/2.mp4'

import { CATEGORIES, SERVICES_DATA } from '../data/servicesData'

export default function Services() {
  const [activeTab, setActiveTab] = useState('all')
  const navigate = useNavigate()
  const reduce = useReducedMotion()

  const isMatch = (service, catKey) => {
    if (service.category === catKey) return true
    if (Array.isArray(service.categories) && service.categories.includes(catKey)) return true
    return false
  }

  const filtered = activeTab === 'all' 
    ? SERVICES_DATA 
    : SERVICES_DATA.filter((s) => isMatch(s, activeTab))

  const grouped = CATEGORIES.slice(1).map(cat => ({
    category: cat,
    services: (activeTab === 'all' ? SERVICES_DATA : filtered).filter(s => isMatch(s, cat.key))
  })).filter(g => g.services.length > 0)

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-navy font-body pt-24 sm:pt-32 pb-24 overflow-x-hidden" style={{ textShadow: 'none' }}>
      <SEOHead
        title="Scuba Diving & Ocean Services | PADI Courses, Snorkeling & Charters | The Dive Village"
        description="Explore professional scuba diving courses, PADI certifications, guided snorkeling safaris, freediving, and bespoke dive charters at The Dive Village."
        keywords="scuba diving services, PADI diving courses, snorkeling excursions, freediving lessons, dive charters, marine gear rental"
        canonicalUrl="https://thedivevillage.com/services"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
          <div>
            <span className="inline-block bg-black/5 rounded-full px-4 py-1.5 text-xs font-bold text-navy/60 uppercase tracking-widest mb-4">
              What We Offer
            </span>
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-navy leading-none">
              Our Services
            </h1>
          </div>
          <p className="max-w-md text-base sm:text-lg font-medium text-navy/70 leading-relaxed lg:pb-4">
            From beginner certifications and reef safaris to full island logistics and gear rentals — everything you need for the ultimate ocean adventure.
          </p>
        </div>

        {/* 2. CATEGORY FILTER TABS */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-16 border-b border-navy/10 pb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === cat.key
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-[#F0F2F5] text-navy/70 hover:bg-navy/10 hover:text-navy'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 3. SERVICES GRID */}
        {grouped.map((group) => (
          <div key={group.category.key} className="mb-24">
            <div className="mb-10">
              <span className="inline-block bg-black/5 rounded-full px-4 py-1.5 text-xs font-bold text-navy/60 uppercase tracking-widest mb-3">
                Category
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-navy leading-none">
                {group.category.label}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {group.services.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: (i % 4) * 0.05 }}
                  onClick={() => navigate(`/services/${service.id}`)}
                  onMouseEnter={(e) => e.currentTarget.querySelector('video')?.play().catch(() => {})}
                  onMouseLeave={(e) => {
                    const vid = e.currentTarget.querySelector('video')
                    if (vid) {
                      vid.pause()
                      vid.currentTime = 0
                    }
                  }}
                  className="group rounded-[32px] bg-white border border-navy/5 shadow-sm hover:shadow-float transition duration-300 flex flex-col justify-between cursor-pointer overflow-hidden relative"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-navy/10 shrink-0">
                    {service.video ? (
                      <video src={service.video} loop muted playsInline className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                    ) : (
                      <SafeImage src={service.image} alt={service.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                    <div className="absolute bottom-4 left-5">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-accent mb-1 block">
                        {CATEGORIES.find(c => c.key === service.category)?.label}
                      </span>
                      <h3 className="font-heading text-xl font-bold text-white leading-tight">{service.title}</h3>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6 flex-1 flex flex-col">
                    <p className="text-sm text-navy/70 leading-relaxed font-medium">
                      {service.short_desc}
                    </p>
                  </div>
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 mt-2">
                    <div className="text-sm font-bold text-navy flex items-center justify-between">
                      <span>View Details</span>
                      <span className="text-xl group-hover:translate-x-1 transition-transform text-accent">→</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* 4. THE POWER OF DIVING */}
        <div className="rounded-[40px] bg-[#F0F2F5] p-8 sm:p-14 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-navy/60 font-bold tracking-widest uppercase text-xs mb-3 block">Transformative Growth</span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">The Power of Diving</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: 1,
                title: 'Unique Skill Development',
                desc: 'Builds confidence, discipline, and responsibility through mastering safety protocols and equipment handling.',
              },
              {
                num: 2,
                title: 'STEM Integration',
                desc: 'Directly connects to biology (self and marine ecosystems), physics (pressure, buoyancy) and environmental science (conservation).',
              },
              {
                num: 3,
                title: 'Physical & Mental Growth',
                desc: 'Enhances fitness, focus, and stress management while encouraging mindfulness in nature.',
              },
              {
                num: 4,
                title: 'Global Citizenship',
                desc: 'Instils respect for oceans and sustainability, aligning with modern educational goals.',
              },
            ].map((p) => (
              <div key={p.num} className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft flex flex-col justify-between hover:-translate-y-1 transition duration-300">
                <div>
                  <div className="w-12 h-12 rounded-full bg-navy text-accent flex items-center justify-center mb-5 text-lg font-bold">
                    {p.num}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-navy mb-3 leading-tight">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-navy/70 leading-relaxed font-medium">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. CALL TO ACTION WITH 2.MP4 VIDEO BACKGROUND */}
        <div 
          onClick={() => navigate('/contact')}
          className="rounded-[40px] bg-navy text-white p-10 sm:p-16 lg:p-20 relative overflow-hidden shadow-lift cursor-pointer group border border-white/10"
        >
          {/* Video Background */}
          <video
            src={video2Bg}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-50 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/40 z-0" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-block bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-widest mb-6 border border-white/10">
              Custom Requirements
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6 group-hover:text-accent transition">
              Have a custom requirement?
            </h2>
            <p className="text-lg sm:text-xl text-white/80 max-w-xl mb-10 leading-relaxed font-medium">
              We organize private boat charters, corporate team retreats, family dive camps, and personalized multi-day dive expeditions.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link
                to="/contact"
                className="rounded-full bg-accent px-8 py-4 text-sm font-bold text-navy transition hover:bg-white shadow-lg flex items-center gap-2 border border-transparent hover:border-accent"
              >
                Contact us for more information →
              </Link>
              <a
                href="tel:+918971001010"
                onClick={(e) => e.stopPropagation()}
                className="rounded-full border border-white/30 backdrop-blur-md px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10 flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                Call Us: +91 89710 01010
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
