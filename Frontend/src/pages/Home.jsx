import { lazy, Suspense, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import Button from '../components/Button'
import SafeImage from '../components/SafeImage'
import SectionReveal, { StaggerGrid, StaggerItem } from '../components/SectionReveal'
import { IMAGES, CAROUSEL_IMAGES } from '../utils/images'
import img1 from '../assets/1.png'
import img2 from '../assets/2.png'
import img3 from '../assets/3.png'
import img4 from '../assets/4.png'
const ProgramsPreview = lazy(() => import('../components/ProgramsPreview'))

const GalleryPreview = lazy(() => import('../components/GalleryPreview'))
const InteractiveDiveMap = lazy(() => import('../components/InteractiveDiveMap'))


const HIGHLIGHTS_DATA = [
  {
    id: 'scuba',
    title: 'Introductory Programs',
    desc: 'Experience scuba safely in shallow water with professional supervision.',
    image: IMAGES.scubaHero,
    link: '/services',
    btnText: 'Explore'
  },
  {
    id: 'snorkeling',
    title: 'Guided Snorkeling',
    desc: 'Discover snorkeling and explore the ocean up close. The ocean welcomes all.',
    image: IMAGES.snorkelingHero,
    link: '/services',
    btnText: 'Explore'
  },
  {
    id: 'courses',
    title: 'Certified Courses',
    desc: 'From your very first breath under the water to professional divemaster certifications.',
    image: IMAGES.hero,
    link: '/services',
    btnText: 'Explore'
  },
  {
    id: 'surfing',
    title: 'Freediving',
    desc: 'Breath-hold freediving to explore the ocean with just your natural abilities.',
    image: IMAGES.surfingHero,
    link: '/services',
    btnText: 'Explore'
  },
  {
    id: 'products',
    title: 'Flexible Fun Dives',
    desc: 'Every experience is a step deeper into the world of the ocean.',
    image: IMAGES.gear1,
    link: '/services',
    btnText: 'Explore'
  },
]

const TESTIMONIALS = [
  {
    name: "Alex Johnson",
    role: "PADI Open Water Diver",
    text: "The Dive Village completely changed my perspective on the ocean. The instructors were incredibly patient, and the focus on safety made my first dive unforgettable.",
    image: CAROUSEL_IMAGES[1]
  },
  {
    name: "Maria Garcia",
    role: "Marine Biologist",
    text: "I've dived all over the world, but the dedication to eco-stewardship here is unmatched. It's inspiring to see a dive center that truly cares about coral restoration and leaving no trace.",
    image: CAROUSEL_IMAGES[2]
  },
  {
    name: "David Chen",
    role: "Advanced Adventurer",
    text: "From the seamless booking process to the personalized dive charters, everything was flawless. A vibrant community that genuinely feels like a second home.",
    image: CAROUSEL_IMAGES[0]
  }
]

export default function Home() {
  const reduce = useReducedMotion()
  const navigate = useNavigate()

  return (
    <div className="overflow-x-hidden relative isolate pointer-events-none">

      {/* 1. HERO */}
      <section className="relative -mt-16 flex min-h-screen items-end justify-start pb-8 pt-32 sm:-mt-[72px] sm:pb-16 sm:pt-[120px] pointer-events-none">

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pointer-events-none">
          <div className="max-w-3xl">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto"
            >
              <h1 className="mt-5 font-heading text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[7rem] font-bold uppercase tracking-normal text-white leading-[0.9] flex flex-col drop-shadow-2xl">
                <span className="block text-[0.35em] tracking-[0.1em] mb-2 opacity-90">MORE THAN A DESTINATION</span>
                <span className="block text-white mb-2">IT IS A</span>
                <span className="block text-[#FFCD00]">COMMUNITY.</span>
              </h1>
              <div className="mt-6 h-1 w-20 bg-[#FFCD00]"></div>
              <p className="mt-8 max-w-2xl text-lg sm:text-xl md:text-2xl font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-relaxed text-justify">
                The life-changing magic of the ocean<br />Is a feeling meant to be shared.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link
                  to="/book-us"
                  className="rounded-full bg-white/15 backdrop-blur-xl border border-white/40 px-8 py-4 font-body text-xs sm:text-sm tracking-widest font-bold text-white uppercase shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 hover:scale-105 hover:bg-[#FFCD00] hover:text-navy hover:border-[#FFCD00] hover:shadow-[0_12px_40px_rgba(255,205,0,0.6)] flex items-center gap-3 active:scale-95 group"
                >
                  Book Your Dive
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </Link>
                <Link
                  to="/shop"
                  className="rounded-full bg-white/10 backdrop-blur-xl border border-white/25 px-8 py-4 font-body text-xs sm:text-sm tracking-widest font-bold text-white uppercase shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-105 hover:bg-[#FFCD00] hover:text-navy hover:border-[#FFCD00] hover:shadow-[0_12px_40px_rgba(255,205,0,0.6)] active:scale-95"
                >
                  Shop Merch
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar overlay */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-2 left-0 right-0 w-full px-6 lg:px-12 flex items-center justify-center pointer-events-none text-white font-body text-xs tracking-widest font-bold uppercase opacity-80"
        >
          {/* Center: Scroll to explore */}
          <div className="flex flex-col items-center gap-2">
            <svg width="20" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-1"><rect x="5" y="2" width="14" height="20" rx="7"></rect><path d="M12 6v4"></path></svg>
            <span className="text-[10px] text-white/70">SCROLL TO EXPLORE</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFCD00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path></svg>
          </div>
        </motion.div>
      </section >

      {/* HIGHLIGHTS */}
      <section className="relative z-10 pb-24 pt-16 sm:pt-20 pointer-events-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal className="mb-12 flex flex-col items-center text-center">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] leading-tight">
              Explore Our <span className="text-[#FFCD00] italic">Programs</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-white/90 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-justify">
              From your very first breath under the water to professional dive master certifications.
            </p>
          </SectionReveal>
          <SectionReveal>
            <InteractiveHighlights />
          </SectionReveal>
        </div>
      </section>



      {/* 4. WHO CAN DIVE */}
      < section id="who-can-dive-section" className="relative py-24 sm:py-32 pointer-events-auto" >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal className="mb-16 flex flex-col items-center text-center">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] leading-tight">
              The Ocean <span className="text-[#FFCD00] italic">Welcomes All</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-white/90 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-justify">
              You don't need to be an athlete or an expert to dive<br />Only curious enough to explore.
            </p>
          </SectionReveal>

          <StaggerGrid className="grid gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-24">
            {[
              {
                t: 'Enthusiastic Beginners',
                img: img1,
                bgImg: CAROUSEL_IMAGES[0],
                desc: "New to diving? Start your journey with confidence. We'll guide you every step of the way."
              },
              {
                t: 'Families & Groups',
                img: img2,
                bgImg: CAROUSEL_IMAGES[1],
                desc: "Shared memories.\nDeeper connections.\nPerfect experiences for the people who matter most."
              },
              {
                t: 'Professionals',
                img: img3,
                bgImg: CAROUSEL_IMAGES[2],
                desc: "For those who work beneath the surface. Training, support and solutions you can rely on."
              },
              {
                t: 'Adventure Seekers',
                img: img4,
                bgImg: CAROUSEL_IMAGES[3],
                desc: "For the bold, the curious and the ocean lovers. Explore more. Dive deeper. Live the adventure."
              }
            ].map((item, i) => (
              <StaggerItem key={i}>
                <div className="h-full group cursor-pointer relative mt-8 flex flex-col">

                  {/* Floating transparent PNG image - 3rd image sticks to right edge, hover triggers slow up/down float */}
                  <img
                    src={item.img}
                    alt={item.t}
                    className={`absolute h-auto object-contain drop-shadow-2xl z-20 pointer-events-none hover-float-png transition-all duration-500 ${i === 2
                      ? 'top-2 right-0 w-[80%] max-w-[210px]'
                      : 'top-12 sm:top-16 left-0 right-0 mx-auto w-[100%] max-w-[260px]'
                      }`}
                  />

                  {/* Actual Card Background & Content - Panel 1, 2, 3, 4 images as background */}
                  <div className="h-full w-full rounded-2xl overflow-hidden border border-white/30 relative flex flex-col p-6 sm:p-8 pt-56 sm:pt-60 z-10 transition duration-500 group-hover:border-white/60 shadow-2xl justify-end">

                    {/* Panel Background Image (panel1, panel2, panel3, panel4) - Stable background without zoom */}
                    <img
                      src={item.bgImg}
                      alt={item.t}
                      className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
                    />

                    {/* Bottom gradient overlay restricted strictly to bottom half of panel */}
                    <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-navy/95 via-navy/70 to-transparent z-0 pointer-events-none" />

                    {/* Content wrapper - lowered and aligned */}
                    <div className="relative z-10 flex flex-col justify-end h-full mt-auto">
                      <h3 className="font-heading text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-3 leading-tight text-left drop-shadow-md min-h-[56px] flex items-end">
                        {item.t}
                      </h3>

                      {/* Yellow divider */}
                      <div className="w-8 h-[3px] bg-[#FFCD00] mb-4 shadow-sm shrink-0"></div>

                      {/* Description text - consistent height block */}
                      <p className="text-white/90 text-sm font-medium mb-6 leading-relaxed text-justify drop-shadow-sm min-h-[72px] flex items-start whitespace-pre-line">
                        {item.desc}
                      </p>

                      {/* Button - centered across all cards with glassmorphic style and #FFCD00 hover */}
                      <div className="mt-auto shrink-0 pt-1 flex justify-center w-full">
                        <div className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest bg-white/15 backdrop-blur-xl border border-white/30 text-white rounded-full px-5 py-2.5 transition-all duration-300 group-hover:bg-[#FFCD00] group-hover:text-navy group-hover:border-[#FFCD00] shadow-md cursor-pointer">
                          <span>Dive In</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section >

      {/* 7. TESTIMONIALS */}
      <section className="relative py-24 sm:py-32 pointer-events-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#FFCD00] font-bold tracking-widest uppercase text-xs mb-3 block">
              Community Voices
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
              What Our Divers Say
            </h2>
            <p className="mt-4 text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-justify">
              Don't just take our word for it.<br />Hear from the community of ocean lovers who have dived with us.
            </p>
          </SectionReveal>

          <StaggerGrid className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <StaggerItem key={i}>
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-card hover:-translate-y-2 transition duration-500">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 text-[#FFCD00]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white/90 italic mb-8 leading-relaxed text-justify">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                      <SafeImage src={t.image} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{t.name}</h4>
                      <span className="text-xs text-white/60">{t.role}</span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section >

      {/* 6. AIRPORT TO AIRPORT - HOSPITALITY */}
      < section className="relative py-24 text-white sm:py-32 pointer-events-auto" >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal className="text-center mb-16 max-w-3xl mx-auto">
            <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-widest mb-4 shadow-sm">
              End-to-End Island Care
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg mb-4">From Airport to Airport<br />
              <span className="text-accent font-bold">We've Got You Covered</span>
            </h2>
            <p className="text-base sm:text-lg text-white/80 font-medium leading-relaxed drop-shadow-md text-justify">
              Relax and immerse yourself in the ocean.<br />We handle every detail of your island holiday from arrival to departure.
            </p>
          </SectionReveal>

          <StaggerGrid className="grid gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: '01',
                title: 'Travel Logistics',
                desc: 'Seamless transfers and hassle-free travel.',
                img: CAROUSEL_IMAGES[4],
                icon: (
                  <svg className="w-5 h-5 text-[#00AEC7]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                )
              },
              {
                num: '02',
                title: 'Comfortable Stays',
                desc: 'Handpicked accommodations for your perfect escape.',
                img: CAROUSEL_IMAGES[5],
                icon: (
                  <svg className="w-5 h-5 text-[#00AEC7]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
                  </svg>
                )
              },
              {
                num: '03',
                title: 'Local Cuisine',
                desc: 'Savor authentic flavors crafted by local chefs.',
                img: CAROUSEL_IMAGES[0],
                icon: (
                  <svg className="w-5 h-5 text-[#00AEC7]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.55 3.89 3.54 4.23L6.5 22h3l-.04-8.77C11.45 12.89 13 11.12 13 9V2h-2v7zm9-7h-1c-1.66 0-3 1.34-3 3v5c0 1.66 1.34 3 3 3h1v9h2V2h-2z" />
                  </svg>
                )
              },
              {
                num: '04',
                title: 'Personal Itineraries',
                desc: 'Custom experiences tailored to your travel style.',
                img: CAROUSEL_IMAGES[1],
                icon: (
                  <svg className="w-5 h-5 text-[#00AEC7]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
                  </svg>
                )
              },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <div
                  onClick={() => navigate('/contact')}
                  className="group relative h-full rounded-[32px] bg-[#00223D]/85 backdrop-blur-xl border border-[#00AEC7]/30 p-6 sm:p-7 shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:border-[#00AEC7] hover:shadow-[0_20px_50px_rgba(0,174,199,0.3)] flex flex-col justify-between cursor-pointer"
                >
                  <div className="flex flex-col flex-1">
                    {/* Top Bar: Icon Box & Number */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#00AEC7]/10 border border-[#00AEC7]/40 flex items-center justify-center shadow-inner group-hover:bg-[#00AEC7]/20 group-hover:border-[#00AEC7] transition duration-300">
                        {item.icon}
                      </div>
                      <span className="font-heading font-bold text-lg text-[#00AEC7] tracking-wider">
                        {item.num}
                      </span>
                    </div>

                    {/* Main Heading Text */}
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-white uppercase tracking-wide leading-tight mb-2 text-left group-hover:text-[#00AEC7] transition-colors">
                      {item.title}
                    </h3>

                    {/* Description Text */}
                    <p className="text-white/70 text-xs sm:text-sm font-medium leading-relaxed mb-6 text-justify min-h-[40px]">
                      {item.desc}
                    </p>

                    {/* Ocean Image Frame */}
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black/30 mb-6 border border-white/10 shadow-inner">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#00223D]/60 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Footer: Learn More & Circular Arrow */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-bold">
                    <span className="text-white/90 group-hover:text-[#00AEC7] transition-colors">Learn more</span>
                    <div className="w-8 h-8 rounded-full border border-[#00AEC7] flex items-center justify-center text-[#00AEC7] group-hover:bg-[#00AEC7] group-hover:text-[#00223D] transition-all duration-300 shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section >

      {/* 8. GALLERY PREVIEW */}
      < div id="gallery-section" className="pointer-events-auto" >
        <Suspense fallback={<div className="py-20 text-center text-navy/50">Loading Gallery...</div>}>
          <GalleryPreview />
        </Suspense>
      </div >


      {/* CLOSING CTA WITH CAROUSEL */}
      < section className="py-16 sm:py-24 bg-transparent pointer-events-auto" >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <AutoCarousel images={CAROUSEL_IMAGES} />
          </SectionReveal>
        </div>
      </section >
    </div >
  )
}

function InteractiveHighlights() {
  const navigate = useNavigate()
  const [rotation, setRotation] = useState(0)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const rotationAtStart = useRef(0)
  const isHovered = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging.current && !isHovered.current) {
        setRotation((prev) => prev + 0.45)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [])

  const handlePointerDown = (e) => {
    isDragging.current = true
    dragStartX.current = e.clientX
    rotationAtStart.current = rotation
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch { }
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current) return
    const deltaX = e.clientX - dragStartX.current
    setRotation(rotationAtStart.current + deltaX * 0.25)
  }

  const handlePointerUp = (e) => {
    if (isDragging.current) {
      isDragging.current = false
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch { }
    }
  }

  const handlePrev = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setRotation((prev) => prev - 36)
  }

  const handleNext = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setRotation((prev) => prev + 36)
  }

  const handleNavigate = (e, targetLink) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const destination = targetLink || '/services'
    navigate(destination)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      onMouseEnter={() => { isHovered.current = true }}
      onMouseLeave={() => { isHovered.current = false }}
      className="relative w-full max-w-[90vw] lg:max-w-6xl mx-auto my-12 pointer-events-auto px-4 sm:px-8"
    >


      {/* Navigation Arrows positioned slightly closer to carousel */}
      <button
        type="button"
        onClick={handlePrev}
        onMouseEnter={(e) => { e.stopPropagation(); isHovered.current = true }}
        onMouseLeave={(e) => { e.stopPropagation(); isHovered.current = true }}
        className="carousel-arrow-btn absolute -left-3 sm:-left-8 lg:-left-14 xl:-left-18 top-1/2 -translate-y-1/2 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-navy/90 border border-white/40 text-white flex items-center justify-center shadow-2xl backdrop-blur-xl cursor-pointer select-none"
        aria-label="Previous Slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        type="button"
        onClick={handleNext}
        onMouseEnter={(e) => { e.stopPropagation(); isHovered.current = true }}
        onMouseLeave={(e) => { e.stopPropagation(); isHovered.current = true }}
        className="carousel-arrow-btn absolute -right-3 sm:-right-8 lg:-right-14 xl:-right-18 top-1/2 -translate-y-1/2 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-navy/90 border border-white/40 text-white flex items-center justify-center shadow-2xl backdrop-blur-xl cursor-pointer select-none"
        aria-label="Next Slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="perspective-[1500px] w-full h-[450px] sm:h-[550px] flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing touch-none select-none"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 1.5%, black 98.5%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 1.5%, black 98.5%, transparent 100%)'
        }}
      >
        <div
          className="relative w-full h-full preserve-3d transition-transform ease-out"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transitionDuration: isDragging.current ? '0ms' : '300ms'
          }}
        >
          {[...HIGHLIGHTS_DATA, ...HIGHLIGHTS_DATA].map((current, i) => (
            <div
              key={`${current.id}-${i}`}
              className="absolute inset-0 flex items-center justify-center backface-hidden pointer-events-auto"
              style={{
                transform: `rotateY(${i * 36}deg) translateZ(clamp(280px, 55vw, 600px))`
              }}
            >
              <div
                onClick={(e) => handleNavigate(e, current.link)}
                className="w-[260px] sm:w-[320px] h-[360px] sm:h-[420px] rounded-2xl overflow-hidden shadow-2xl relative border border-white/20 bg-navy/10 group cursor-pointer pointer-events-auto z-20"
              >
                <img
                  src={current.image}
                  alt={current.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent opacity-90 transition duration-300 pointer-events-none" />

                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end pointer-events-auto">
                  <span className="inline-block text-accent font-heading font-bold uppercase tracking-widest text-[10px] mb-2 pointer-events-none">
                    Featured
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight mb-3 pointer-events-none">
                    {current.title}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm mb-6 line-clamp-3 pointer-events-none text-justify">
                    {current.desc}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => handleNavigate(e, current.link)}
                    className="program-panel-btn py-2.5 px-4 text-sm w-full rounded-full shadow-md pointer-events-auto cursor-pointer relative z-30 flex items-center justify-center gap-2 group/btn"
                  >
                    <span>{current.btnText || 'Explore'}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/btn:translate-x-1">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AutoCarousel({ images, showContent = true }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] shadow-float w-full h-[400px] lg:h-[450px]">
      <AnimatePresence>
        <motion.img
          key={index}
          src={images[index]}
          alt="Ocean Journey"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-navy/10 mix-blend-multiply z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/40 to-transparent z-10" />

      {showContent && (
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 sm:p-12 lg:p-16">
          <div className="max-w-xl">
            <span className="inline-block text-accent font-heading font-bold uppercase tracking-widest text-xs mb-4">
              The Sea is Calling
            </span>
            <h3 className="font-heading text-4xl sm:text-5xl lg:text-5xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Come for the adventure.<br />
              <span className="text-white/60">Stay for the calm.</span>
            </h3>
            <p className="text-white/80 font-medium text-base sm:text-lg mb-8 max-w-sm text-justify">
              Leave with stories that last a lifetime.
            </p>
            <Button
              as={Link}
              to="/book-us"
              variant="secondary"
              className="!bg-white !text-navy !border-0 hover:!bg-accent hover:!text-white shadow-sm transition-all duration-300 hover:scale-105"
            >
              Book Your Dive
              <ArrowIcon />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InstructIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 19c1.2-3.5 3.8-5 7-5s5.8 1.5 7 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function SupportIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 12a8 8 0 0116 0v5a2 2 0 01-2 2h-2v-6h4M4 13h4v6H6a2 2 0 01-2-2v-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function TrainIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 19h16M7 19V7l5-3 5 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function GroupIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function OceanIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 14c2 1 3 1 5 0s3-1 5 0 3 1 5 0 3-1 3 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 18c2 1 3 1 5 0s3-1 5 0 3 1 5 0 3-1 3 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
