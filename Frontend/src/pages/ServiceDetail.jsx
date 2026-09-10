import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { SERVICES_DATA, CATEGORIES } from '../data/servicesData'
import SafeImage from '../components/SafeImage'
import Button from '../components/Button'
import { IMAGES } from '../utils/images'
import { contentService } from '../services/contentService'

const FAQS = [
  {
    q: "Do I need to be a strong swimmer?",
    a: "For entry-level programs like Try Dive or Discover Scuba, basic water comfort is enough. For full certifications, you must be able to swim 200m continuously and float for 10 minutes."
  },
  {
    q: "Is scuba diving safe?",
    a: "Yes! Scuba diving is extremely safe when guided by our certified PADI professionals. We maintain strict safety protocols and a maximum 4:1 student-to-instructor ratio."
  },
  {
    q: "What should I bring with me?",
    a: "Just bring your swimsuit, a towel, reef-safe sunscreen, and a sense of adventure! We provide all the premium scuba equipment you'll need."
  }
]

export default function ServiceDetail() {
  const { id } = useParams()
  const [openFaq, setOpenFaq] = useState(null)
  const [faqList, setFaqList] = useState(FAQS)
  
  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await contentService.getFaqs()
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const mapped = res.data.data.map((f) => ({
            q: f.question,
            a: f.answer,
          }))
          setFaqList(mapped)
        }
      } catch (err) {
        console.warn('Could not load FAQs from DB, using fallback:', err)
      }
    }
    loadFaqs()
  }, [])
  
  const service = SERVICES_DATA.find((s) => s.id === id)

  if (!service) {
    return <Navigate to="/services" replace />
  }

  const categoryLabel = CATEGORIES.find(c => c.key === service.category)?.label

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-navy font-body overflow-x-hidden" style={{ textShadow: 'none' }}>
      
      {/* 1. HERO BANNER */}
      <div className="relative w-full min-h-[70vh] sm:min-h-[80vh] bg-navy overflow-hidden flex flex-col justify-end pt-32 pb-36 sm:pb-48">
        {service.video ? (
          <video src={service.video} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-100" />
        ) : (
          <SafeImage src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover opacity-100" />
        )}
        
        {/* Short clean bottom gradient overlay right at the edge */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/70 to-transparent pointer-events-none z-10" />
        
        <div className="relative z-20 w-full px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
          >
            <span className="inline-block bg-accent/20 border border-accent/40 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-widest mb-4">
              {categoryLabel}
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-none mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              {service.title}
            </h1>
            <p className="max-w-2xl text-lg sm:text-xl font-medium text-white/90 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {service.short_desc}
            </p>
          </motion.div>
        </div>
      </div>

      {/* 2. CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Left Column: Description */}
        <div className="lg:col-span-7 xl:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg text-navy/80 leading-relaxed font-medium"
          >
            <h2 className="font-heading text-3xl font-bold text-navy mb-6">Overview</h2>
            <p className="text-lg mb-12">{service.long_desc}</p>

            {/* INCLUSIONS */}
            <div className="mb-16">
              <h3 className="font-heading text-2xl font-bold text-navy mb-6">What's Included</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy/5">
                  <h4 className="text-sm font-bold text-navy mb-4 flex items-center gap-2">
                    <span className="text-green-500">✅</span> Included
                  </h4>
                  <ul className="space-y-3">
                    <li className="text-sm font-medium text-navy/70 flex items-center gap-2">Premium Dive Equipment</li>
                    <li className="text-sm font-medium text-navy/70 flex items-center gap-2">Certified PADI Instructor</li>
                    <li className="text-sm font-medium text-navy/70 flex items-center gap-2">Underwater Photos & Videos</li>
                    <li className="text-sm font-medium text-navy/70 flex items-center gap-2">Safety Briefing & Training</li>
                  </ul>
                </div>
                <div className="bg-[#F0F2F5] rounded-2xl p-6 border border-navy/5">
                  <h4 className="text-sm font-bold text-navy mb-4 flex items-center gap-2">
                    <span className="text-red-400">❌</span> Excluded
                  </h4>
                  <ul className="space-y-3">
                    <li className="text-sm font-medium text-navy/70 flex items-center gap-2">Flights & Accommodation</li>
                    <li className="text-sm font-medium text-navy/70 flex items-center gap-2">Personal Travel Insurance</li>
                    <li className="text-sm font-medium text-navy/70 flex items-center gap-2">Meals & Beverages</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* GALLERY */}
            <div className="mb-16">
              <h3 className="font-heading text-2xl font-bold text-navy mb-6">Experience Gallery</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-64 sm:h-80 rounded-3xl overflow-hidden relative">
                  <SafeImage src={IMAGES.gallery1} alt="Diving" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                </div>
                <div className="grid grid-rows-2 gap-4 h-64 sm:h-80">
                  <div className="rounded-3xl overflow-hidden relative h-full">
                    <SafeImage src={IMAGES.scubaFeat1} alt="Diving" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                  </div>
                  <div className="rounded-3xl overflow-hidden relative h-full">
                    <SafeImage src={IMAGES.dest3} alt="Diving" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="mb-8">
              <h3 className="font-heading text-2xl font-bold text-navy mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqList.map((faq, idx) => {
                  const isOpen = openFaq === idx
                  return (
                    <div key={idx} className="bg-white rounded-2xl border border-navy/5 overflow-hidden shadow-sm">
                      <button 
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-navy hover:bg-navy/5 transition-colors text-sm sm:text-base"
                      >
                        {faq.q}
                        <span className={`text-2xl transition-transform ${isOpen ? 'rotate-45 text-accent' : ''}`}>+</span>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <div className="px-6 pb-5 text-navy/70 text-sm font-medium leading-relaxed">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>

          </motion.div>
        </div>

        {/* Right Column: Sticky Sidebar / Details */}
        <div className="lg:col-span-5 xl:col-span-4 relative">
          <div className="sticky top-32 bg-white rounded-[32px] p-8 shadow-card border border-navy/5">
            <h3 className="font-heading text-xl font-bold text-navy mb-6 uppercase tracking-wider text-sm">Service Details</h3>
            
            <ul className="space-y-5 mb-10">
              {service.highlights && (
                <li className="flex items-start gap-4 text-sm font-medium text-navy/80">
                  <div className="w-10 h-10 rounded-full bg-[#F0F2F5] flex items-center justify-center shrink-0 text-accent">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-wider text-navy/50 font-bold mb-0.5">Highlights</span>
                    <span>{service.highlights}</span>
                  </div>
                </li>
              )}
              {service.days_min && (
                <li className="flex items-start gap-4 text-sm font-medium text-navy/80">
                  <div className="w-10 h-10 rounded-full bg-[#F0F2F5] flex items-center justify-center shrink-0 text-accent">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-wider text-navy/50 font-bold mb-0.5">Duration</span>
                    <span>{service.days_min}{service.days_max && service.days_max !== service.days_min ? ` - ${service.days_max}` : ''} Days</span>
                  </div>
                </li>
              )}
              {service.min_age && (
                <li className="flex items-start gap-4 text-sm font-medium text-navy/80">
                  <div className="w-10 h-10 rounded-full bg-[#F0F2F5] flex items-center justify-center shrink-0 text-accent">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-wider text-navy/50 font-bold mb-0.5">Requirements</span>
                    <span>Minimum Age {service.min_age}</span>
                  </div>
                </li>
              )}
            </ul>

            <div className="flex flex-col gap-3">
              <Button as={Link} to="/book-us" variant="primary" className="w-full justify-center py-4 shadow-md">
                Book Now
              </Button>
              <Button as={Link} to="/contact" variant="outline" className="w-full justify-center py-4 bg-[#F0F2F5] border-none hover:bg-navy/10">
                Enquire More
              </Button>
            </div>
          </div>
        </div>
      </div>



    </div>
  )
}
