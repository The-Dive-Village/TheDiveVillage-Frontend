import { lazy, Suspense, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import Button from '../components/Button'
import SafeImage from '../components/SafeImage'
import SectionReveal, { StaggerGrid, StaggerItem } from '../components/SectionReveal'
import SEOHead from '../components/SEOHead'
import { IMAGES, CAROUSEL_IMAGES, PANEL_IMAGES } from '../utils/images'
import { useReviews } from '../contexts/ReviewsContext'
import img1 from '../assets/1.png'
import img2 from '../assets/2.png'
import img3 from '../assets/3.png'
import img4 from '../assets/4.png'
import travelVid from '../assets/Gallery/boat.mp4'
import stayImg from '../assets/Gallery/Stay.jpg'
import foodImg from '../assets/Gallery/food.jpg'
import itineraryVid from '../assets/Gallery/gallery1.mp4'
import imgIntroductoryPrograms from '../assets/Gallery/Introductory Programs.png'
import imgGuidedSnorkeling from '../assets/Gallery/Snorkeling.png'
import imgCertifiedCourses from '../assets/Gallery/Certified Courses.jpg'
import imgFreeDiving from '../assets/Gallery/Free Diving.png'
import imgFlexibleFunDives from '../assets/Gallery/Flexible Fun Dives.png'

import ProgramsPreview from '../components/ProgramsPreview'
import GalleryPreview from '../components/GalleryPreview'
import CustomizeExperiencePanel from '../components/CustomizeExperiencePanel'

const ADVENTURE_CALM_IMAGES = PANEL_IMAGES


const HIGHLIGHTS_DATA = [
  {
    id: 'scuba',
    title: 'Introductory Programs',
    desc: 'Experience scuba safely in shallow water alongside our professionals.',
    image: imgIntroductoryPrograms,
    link: '/services?category=programs',
    btnText: 'Explore'
  },
  {
    id: 'snorkeling',
    title: 'Guided Snorkeling',
    desc: 'Discover snorkeling and explore the coral reefs along side our experts.',
    image: imgGuidedSnorkeling,
    link: '/services?category=snorkeling',
    btnText: 'Explore'
  },
  {
    id: 'courses',
    title: 'Certified Courses',
    desc: 'From your first breath underwater to professional divemaster courses.',
    image: imgCertifiedCourses,
    link: '/services?category=courses',
    btnText: 'Explore'
  },
  {
    id: 'surfing',
    title: 'Freediving',
    desc: 'Explore the ocean with free diving and rely on your natural abilities.',
    image: imgFreeDiving,
    link: '/services?category=freediving',
    btnText: 'Explore'
  },
  {
    id: 'products',
    title: 'Flexible Fun Dives',
    desc: 'Every single experience is one step deeper into the world of the ocean.',
    image: imgFlexibleFunDives,
    link: '/services?category=fundives',
    btnText: 'Explore'
  },
]

const TESTIMONIALS = [
  {
    name: "Sofia Stalance",
    role: "Open Water Diver",
    text: "The Dive Village completely changed my perspective on the ocean. The instructors were incredibly patient, and the focus on safety made my first dive unforgettable.",
    image: CAROUSEL_IMAGES[1]
  },
  {
    name: "Krishawn Rahul",
    role: "Marine Biologist",
    text: "I've dived all over the world, but the dedication to eco-stewardship here is unmatched. It's inspiring to see a dive center that truly cares about coral restoration and leaving no trace.",
    image: CAROUSEL_IMAGES[2]
  },
  {
    name: "Michael Antony",
    role: "Advanced Adventurer",
    text: "From the seamless booking process to the personalized dive charters, everything was flawless. A vibrant community that genuinely feels like a second home.",
    image: CAROUSEL_IMAGES[0]
  }
]

const FAQ_DATA = [
  {
    q: 'Do I need to know how to swim to try scuba diving?',
    a: 'No prior swimming experience or scuba certification is required for our Try Scuba or Discover Scuba Diving (DSD) programs. Our certified PADI/SSI instructors guide you 1-on-1 every step of the way in calm, shallow reef waters.'
  },
  {
    q: 'What is the minimum age for scuba diving and snorkeling?',
    a: 'Snorkeling is open to all ages (children 5+ recommended). For Scuba, the minimum age is 8 years for the PADI Bubblemaker program, and 10 years for Junior Open Water Diver and Discover Scuba programs.'
  },
  {
    q: 'How do I reach Neil Island (Shaheed Dweep)?',
    a: 'Neil Island is accessible via high-speed government and private ferries (Makruzz, Nautika, Green Ocean) operating daily from Port Blair (approx. 90 mins) and Havelock Island (approx. 45 mins). We can assist in arranging your ferry tickets and island transfers!'
  },
  {
    q: 'What should I bring for my dive trip?',
    a: 'Bring your swimwear, a towel, reef-safe sunscreen, comfortable beachwear, and a reusable water bottle. All high-end diving and snorkeling gear (wetsuits, masks, fins, tanks, BCDs) is fully provided by The Dive Village.'
  },
  {
    q: 'When is the best season for diving in the Andaman Islands?',
    a: 'The prime diving season runs from October through May, offering crystal-clear visibility (up to 25+ meters), calm seas, warm water (28°C–30°C), and abundant marine life encounters including turtles, manta rays, and vibrant corals.'
  }
]

export default function Home() {
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const { approvedReviews, addReview } = useReviews()
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [revName, setRevName] = useState('')
  const [revRole, setRevRole] = useState('')
  const [revText, setRevText] = useState('')
  const [revRating, setRevRating] = useState(5)
  const [activeFaq, setActiveFaq] = useState(null)

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!revName.trim() || !revText.trim()) return
    addReview({ name: revName, role: revRole, text: revText, rating: revRating })
    setReviewSubmitted(true)
    setTimeout(() => {
      setReviewSubmitted(false)
      setShowReviewModal(false)
      setRevName('')
      setRevRole('')
      setRevText('')
      setRevRating(5)
    }, 2800)
  }

  return (
    <div className="overflow-x-hidden relative isolate pointer-events-none">
      <SEOHead
        title="The Dive Village | It's a Community"
        description="Experience world-class scuba diving, professional certifications, guided snorkeling tours, and freediving with The Dive Village. Explore ocean gear and sustainable apparel."
        keywords="scuba diving center, certification courses, guided snorkeling tours, freediving school, ocean apparel, dive gear shop, eco diving village"
        canonicalUrl="https://thedivevillage.com/"
      />

      {/* 1. HERO */}
      <section className="relative -mt-16 flex min-h-screen sm:min-h-screen items-start sm:items-end justify-start pb-16 pt-44 xs:pt-52 sm:-mt-[72px] sm:pb-16 sm:pt-[120px] pointer-events-none">

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pointer-events-none">
          <div className="max-w-3xl">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto"
            >
              <h1 className="mt-2 sm:mt-5 font-heading text-[3.1rem] xs:text-[3.8rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[7rem] font-bold uppercase tracking-tight sm:tracking-normal text-white leading-[0.92] flex flex-col drop-shadow-2xl">
                <span className="block text-sm xs:text-base sm:text-lg font-bold tracking-[0.2em] mb-2 sm:mb-3 text-white/95">MORE THAN A DESTINATION</span>
                <span className="block text-white mb-1 sm:mb-2">IT IS A</span>
                <span className="block text-[#FFCD00]">COMMUNITY.</span>
              </h1>
              <div className="mt-3.5 sm:mt-6 h-1 w-16 sm:w-20 bg-[#FFCD00]"></div>
              <p className="mt-3.5 sm:mt-8 max-w-xs xs:max-w-sm sm:max-w-2xl text-[15px] xs:text-base sm:text-xl md:text-2xl font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-snug sm:leading-relaxed text-left">
                <span className="sm:hidden">
                  The life-changing magic of the ocean<br />is a feeling to be shared.
                </span>
                <span className="hidden sm:inline">
                  The life-changing magic of the ocean<br />is a feeling that is meant to be shared.
                </span>
              </p>
              <div className="mt-6 sm:mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  to="/book-us"
                  className="w-fit inline-flex items-center justify-between gap-2.5 sm:gap-3 rounded-full bg-[#FFCD00] text-navy px-5 xs:px-6 sm:px-8 py-3 sm:py-4 font-body text-xs sm:text-sm tracking-widest font-bold uppercase shadow-[0_8px_32px_0_rgba(255,205,0,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 group"
                >
                  <span>Book Your Dive</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1 shrink-0"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </Link>
                <Link
                  to="/shop"
                  className="w-fit inline-flex items-center justify-between gap-2.5 sm:gap-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/40 px-5 xs:px-6 sm:px-8 py-3 sm:py-4 font-body text-xs sm:text-sm tracking-widest font-bold text-white uppercase shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-105 hover:bg-[#FFCD00] hover:text-navy hover:border-[#FFCD00] active:scale-95 group"
                >
                  <span>Shop Merch</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1 shrink-0"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
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
      <section className="relative z-10 pb-6 sm:pb-24 pt-8 sm:pt-20 pointer-events-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal className="mb-4 sm:mb-12 flex flex-col items-center text-center">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] leading-tight">
              Explore Our <span className="text-[#FFCD00]">Programs</span>
            </h2>
            <p className="mt-2 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg text-white/90 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-justify">
              From your very first breath under the water <br />To professional dive master certifications.
            </p>
          </SectionReveal>
        </div>
        <div className="w-full max-w-[98vw] 2xl:max-w-[1800px] mx-auto px-1 sm:px-2">
          <SectionReveal>
            <InteractiveHighlights />
          </SectionReveal>
        </div>
      </section>

      {/* 4. WHO CAN DIVE */}
      <section id="who-can-dive-section" className="relative py-6 sm:py-32 pointer-events-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal className="mb-4 sm:mb-16 flex flex-col items-center text-center">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] leading-tight">
              The Ocean <span className="text-[#FFCD00]">Welcomes All</span>
            </h2>
            <p className="mt-2 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg text-white/90 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-center sm:text-justify">
              <span className="sm:hidden">You don't need to be an expert to dive.<br />You only need curiosity to explore.</span>
              <span className="hidden sm:inline">You don't need to be an athlete or an expert to dive<br />You only need curiosity to explore what lies below.</span>
            </p>
          </SectionReveal>

          <StaggerGrid className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 gap-2.5 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 mt-2 sm:mt-24 sm:overflow-visible px-1">
            {[
              {
                t: 'Enthusiastic Beginners',
                img: img1,
                bgImg: CAROUSEL_IMAGES[0],
                desc: "New to diving? Start your journey with confidence, our expert guidance and support every step."
              },
              {
                t: 'Families & Groups',
                img: img2,
                bgImg: CAROUSEL_IMAGES[1],
                desc: "Shared memories. Deeper connections. Perfect experiences with who matter the most to you."
              },
              {
                t: 'Professionals',
                img: img3,
                bgImg: CAROUSEL_IMAGES[2],
                desc: "For those who work beneath the surface. Training, support and solutions you can always rely on."
              },
              {
                t: 'Adventure Seekers',
                img: img4,
                bgImg: CAROUSEL_IMAGES[3],
                desc: "For the bold, the curious and all the ocean lovers. Explore more. Dive deeper. Live the adventure."
              }
            ].map((item, i) => (
              <StaggerItem key={i} className="w-[30vw] min-w-[108px] max-w-[130px] xs:w-[31vw] xs:min-w-[115px] sm:w-auto shrink-0 snap-center h-full">
                <div
                  onClick={() => {
                    navigate('/gallery')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="h-full group cursor-pointer relative mt-4 sm:mt-8 flex flex-col pointer-events-auto"
                >

                  {/* Floating transparent PNG image centered with respect to bg panel with automatic slow floating animation */}
                  {item.img ? (
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3.2 + (i * 0.4), repeat: Infinity, ease: 'easeInOut' }}
                      className={`absolute top-0.5 sm:top-2 inset-x-0 mx-auto w-full flex items-center justify-center z-20 pointer-events-none px-1 ${
                        i === 1 || i === 2
                          ? 'max-w-[95px] sm:max-w-[270px] h-[90px] xs:h-[105px] sm:h-[260px]'
                          : 'max-w-[110px] sm:max-w-[320px] h-[100px] xs:h-[115px] sm:h-[290px]'
                      }`}
                    >
                      <img
                        src={item.img}
                        alt={item.t}
                        className={`w-full h-full max-w-full max-h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] transition-all duration-500 ${
                          i === 1 || i === 2 ? 'scale-95' : 'scale-105'
                        }`}
                      />
                    </motion.div>
                  ) : null}

                  {/* Actual Card Background & Content */}
                  <div className="h-full w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/30 relative flex flex-col p-2.5 xs:p-3 sm:p-6 pt-24 xs:pt-28 sm:pt-72 pb-3 sm:pb-7 z-10 transition duration-500 group-hover:border-white/60 shadow-2xl justify-end">

                    {item.bgImg ? (
                      <img
                        src={item.bgImg}
                        alt={item.t}
                        className="absolute inset-0 w-full h-full object-cover z-0 opacity-85 blur-[2px] scale-105 transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : null}

                    <div className="absolute bottom-0 inset-x-0 h-3/5 bg-gradient-to-t from-navy via-navy/80 to-transparent z-0 pointer-events-none" />

                    <div className="relative z-10 flex flex-col justify-end h-full mt-auto">
                      <h3 className="font-heading text-[11px] xs:text-xs sm:text-xl font-bold text-white uppercase tracking-wider mb-1 sm:mb-2 leading-tight text-center sm:text-left drop-shadow-md min-h-[30px] sm:min-h-[48px] flex items-center sm:items-end justify-center sm:justify-start">
                        {item.t}
                      </h3>

                      <div className="hidden sm:block w-8 h-[3px] bg-[#FFCD00] mb-3 shadow-sm shrink-0"></div>

                      <p className="hidden sm:flex text-white/90 text-sm font-medium mb-4 leading-relaxed text-justify drop-shadow-sm min-h-[64px] items-start whitespace-pre-line">
                        {item.desc}
                      </p>

                      <div className="mt-auto shrink-0 pt-1 flex justify-center w-full">
                        <div className="inline-flex items-center gap-1 sm:gap-2 font-body text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-white/15 backdrop-blur-xl border border-white/30 text-white rounded-full px-2.5 sm:px-5 py-1 sm:py-2.5 transition-all duration-300 group-hover:bg-[#FFCD00] group-hover:text-navy group-hover:border-[#FFCD00] shadow-md cursor-pointer">
                          <span>Dive In</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hidden xs:inline transition-transform duration-300 group-hover:translate-x-1">
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
      </section>

      {/* 7. TESTIMONIALS (COMMUNITY VOICES) */}
      <section id="testimonials-section" className="relative py-12 sm:py-32 pointer-events-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-[#FFCD00] font-bold tracking-widest uppercase text-xs mb-3 block drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Community Voices
            </span>
            <h2
              className="font-heading text-3xl sm:text-5xl font-bold text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.95)]"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.9)' }}
            >
              What Our Divers Say
            </h2>
            <p
              className="mt-4 text-white/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] text-justify"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.85)' }}
            >
              Don't just take our word for it.<br />Hear from the community of ocean lovers who have dived with us.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 transition-all duration-300 hover:scale-105 hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] shadow-[0_4px_16px_rgba(0,0,0,0.6)] cursor-pointer"
              >
                <span>+ Write a Review</span>
              </button>
            </div>
          </SectionReveal>

          <StaggerGrid className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 gap-3 md:grid md:grid-cols-3 md:gap-8 items-stretch md:overflow-visible px-1">
            {approvedReviews.slice(0, 3).map((t, i) => (
              <StaggerItem key={t.id || i} className="w-[210px] xs:w-[230px] shrink-0 md:w-auto snap-center h-full">
                <div className="h-full flex flex-col justify-between bg-white/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:bg-white/15 hover:border-white/40 hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-all duration-500">
                  <div>
                    <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-6">
                      {[...Array(t.rating || 5)].map((_, j) => (
                        <svg key={j} className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#FFCD00]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-white/95 font-medium mb-3 sm:mb-8 text-xs sm:text-base leading-relaxed text-justify line-clamp-4 sm:line-clamp-none">
                      "{t.text}"
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 sm:gap-4 mt-auto">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-white/30 shrink-0 shadow-md">
                      <SafeImage src={t.image} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm tracking-wide truncate max-w-[120px] sm:max-w-none">
                        {t.name}
                      </h4>
                      <span className="text-[10px] sm:text-xs text-[#FFCD00] font-medium block truncate max-w-[120px] sm:max-w-none">
                        {t.role}
                      </span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 6. AIRPORT TO AIRPORT - HOSPITALITY */}
      <section className="relative py-12 sm:py-32 text-white pointer-events-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal className="text-center mb-8 sm:mb-16 max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] mb-4">
              From Airport to Airport<br />
              <span className="text-[#FFCD00] font-bold">We've Got You Covered</span>
            </h2>
            <p className="text-sm sm:text-lg text-white/90 font-medium leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]">
              Relax, Slow down and immerse yourself.<br />We handle every detail of your holiday.
            </p>
          </SectionReveal>

          <StaggerGrid className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 gap-3 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 sm:overflow-visible px-1">
            {[
              {
                num: '01',
                title: 'Travel Logistics',
                desc: 'Seamless transfers and hassle free travel, arrival to departure.',
                video: travelVid,
                icon: (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#00AEC7]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                )
              },
              {
                num: '02',
                title: 'Comfortable Stays',
                desc: 'Handpicked accommodations for a perfect escape, made easy.',
                img: stayImg,
                icon: (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#00AEC7]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
                  </svg>
                )
              },
              {
                num: '03',
                title: 'Local Cuisine',
                desc: 'Savor authentic flavors, freshly crafted delicacies by local chefs.',
                img: foodImg,
                icon: (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#00AEC7]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.55 3.89 3.54 4.23L6.5 22h3l-.04-8.77C11.45 12.89 13 11.12 13 9V2h-2v7zm9-7h-1c-1.66 0-3 1.34-3 3v5c0 1.66 1.34 3 3 3h1v9h2V2h-2z" />
                  </svg>
                )
              },
              {
                num: '04',
                title: 'Personal Itineraries',
                desc: 'Custom experiences tailored to your travel style and made to fit.',
                video: itineraryVid,
                img: CAROUSEL_IMAGES[1],
                icon: (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#00AEC7]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
                  </svg>
                )
              },
            ].map((item, i) => (
              <StaggerItem key={i} className="w-[62vw] min-w-[215px] max-w-[270px] aspect-square sm:w-auto sm:aspect-auto shrink-0 snap-center h-full">
                <div
                  onClick={() => navigate('/contact')}
                  className="group relative h-full w-full rounded-2xl sm:rounded-[28px] lg:rounded-[32px] bg-[#00172b]/40 backdrop-blur-2xl border border-white/20 p-3 sm:p-5 lg:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-3 hover:bg-[#00172b]/60 hover:border-[#00AEC7] hover:shadow-[0_12px_40px_rgba(0,174,199,0.25)] flex flex-col justify-between cursor-pointer"
                >
                  <div className="flex flex-col flex-1">
                    {/* Top Bar: Icon Box & Number */}
                    <div className="flex items-center justify-between mb-1.5 sm:mb-4">
                      <div className="w-7 h-7 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl bg-[#00AEC7]/20 border border-[#00AEC7]/50 flex items-center justify-center shadow-sm group-hover:bg-[#00AEC7]/30 group-hover:border-[#00AEC7] transition duration-300">
                        {item.icon}
                      </div>
                      <span className="font-heading font-bold text-xs sm:text-lg text-[#FFCD00] tracking-wider">
                        {item.num}
                      </span>
                    </div>

                    {/* Main Heading Text */}
                    <h3 className="font-heading text-xs xs:text-sm sm:text-xl lg:text-2xl font-bold text-white uppercase tracking-wide leading-tight mb-1 sm:mb-2 text-left group-hover:text-[#FFCD00] transition-colors truncate sm:whitespace-normal">
                      {item.title}
                    </h3>

                    {/* Description Text */}
                    <p className="hidden sm:block text-white/85 text-xs lg:text-sm font-medium leading-relaxed mb-5 text-left min-h-[40px]">
                      {item.desc}
                    </p>

                    {/* Media Frame (Video or Image) */}
                    <div className="relative w-full aspect-[16/10] sm:aspect-[16/11] rounded-xl sm:rounded-2xl overflow-hidden bg-black/40 mb-1.5 sm:mb-5 border border-white/20 shadow-md flex-1">
                      {item.video ? (
                        <video
                          src={item.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : item.img ? (
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Footer: Learn More & Circular Arrow (Desktop Only) */}
                  <div className="hidden sm:flex items-center justify-between pt-3 border-t border-white/20 text-xs font-bold">
                    <span className="text-white/90 group-hover:text-[#FFCD00] transition-colors">
                      Learn more
                    </span>
                    <div className="w-8 h-8 rounded-full border border-[#00AEC7] bg-[#00AEC7]/10 flex items-center justify-center text-[#00AEC7] group-hover:bg-[#FFCD00] group-hover:border-[#FFCD00] group-hover:text-[#001e3d] transition-all duration-300 shadow-sm">
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
      </section>

      {/* 7.5 CUSTOMIZE DIVE EXPERIENCE */}
      <section id="customize-dive-section" className="py-6 sm:py-16 pointer-events-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal className="hidden sm:block text-center mb-8 max-w-3xl mx-auto">
            <span className="inline-block bg-[#FFCD00]/15 border border-[#FFCD00]/30 rounded-full px-5 py-2 text-xs font-bold text-[#FFCD00] uppercase tracking-widest mb-4 shadow-sm backdrop-blur-md">
              Plan Your Trip
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-white leading-tight drop-shadow-md mb-4">
              Design Your <span className="text-[#FFCD00]">Dream Experience</span>
            </h2>
            <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed drop-shadow-sm max-w-2xl mx-auto">
              Select your dives, island stays, and extra adventures to build a custom itinerary and see an instant price estimate.
            </p>
          </SectionReveal>

          <CustomizeExperiencePanel />
        </div>
      </section>

      {/* 8. EXPLORE OUR PROGRAMS (Interactive Carousel - Desktop Only duplicate) */}
      <section id="services" className="hidden sm:block relative py-24 sm:py-32 pointer-events-auto overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal className="text-center mb-8 max-w-3xl mx-auto">
            <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-xs font-bold text-[#FFCD00] uppercase tracking-widest mb-4 shadow-sm">
              Discover Possibilities
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-md mb-4">
              Explore Our <span className="text-[#FFCD00] font-bold">Programs</span>
            </h2>
            <p className="text-base sm:text-lg text-white/90 font-medium leading-relaxed drop-shadow-sm">
              From your very first breath underwater to professional instructor certifications.
            </p>
          </SectionReveal>
        </div>

        <InteractiveHighlights />
      </section>

      {/* 9. THE DIVE VILLAGE GALLERY CAROUSEL */}
      <GalleryPreview />

      {/* 10. FAQ SECTION (Desktop Only) */}
      <section className="hidden sm:block relative py-24 sm:py-32 text-white pointer-events-auto">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionReveal className="text-center mb-16">
            <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-xs font-bold text-[#FFCD00] uppercase tracking-widest mb-4 shadow-sm">
              Got Questions?
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-md mb-4">
              Frequently Asked <span className="text-[#FFCD00] font-bold">Questions</span>
            </h2>
            <p className="text-base sm:text-lg text-white/90 font-medium leading-relaxed drop-shadow-sm max-w-2xl mx-auto">
              Everything you need to know about diving in Neil Island with The Dive Village.
            </p>
          </SectionReveal>

          <div className="space-y-4">
            {FAQ_DATA.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden shadow-lg transition duration-300 hover:border-white/40"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer select-none"
                >
                  <span className="font-heading text-lg sm:text-xl font-bold text-white pr-4">
                    {faq.q}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-white shrink-0">
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-[#FFCD00]' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 text-white/90 font-medium text-sm sm:text-base leading-relaxed border-t border-white/10 mt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEW MODAL */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#00172b] border border-white/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>

              <h3 className="font-heading text-2xl font-bold text-white mb-2">Write a Review</h3>
              <p className="text-white/80 text-sm mb-6">Share your diving experience with our community.</p>

              {reviewSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#00AEC7]/20 border border-[#00AEC7] rounded-full flex items-center justify-center mx-auto mb-4 text-[#00AEC7]">
                    ✓
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">Thank you!</h4>
                  <p className="text-white/80 text-sm">Your review has been submitted and is pending moderation.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white/90 text-xs font-bold uppercase tracking-wider mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FFCD00]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-xs font-bold uppercase tracking-wider mb-1">Diver Role / Level</label>
                    <input
                      type="text"
                      required
                      value={revRole}
                      onChange={(e) => setRevRole(e.target.value)}
                      placeholder="e.g. Advanced Adventurer"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FFCD00]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-xs font-bold uppercase tracking-wider mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRevRating(star)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                            revRating >= star ? 'bg-[#FFCD00] text-[#001e3d]' : 'bg-white/10 text-white/50'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/90 text-xs font-bold uppercase tracking-wider mb-1">Your Experience</label>
                    <textarea
                      required
                      rows={4}
                      value={revText}
                      onChange={(e) => setRevText(e.target.value)}
                      placeholder="Tell us about the reefs, instructors, or your holiday..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FFCD00] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#FFCD00] text-[#001e3d] font-bold text-sm uppercase tracking-wider transition hover:brightness-110 shadow-lg cursor-pointer mt-2"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CLOSING CTA WITH CAROUSEL */}
      <section className="py-16 sm:py-24 bg-transparent pointer-events-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <AutoCarousel images={ADVENTURE_CALM_IMAGES} />
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}

function InteractiveHighlights() {
  const navigate = useNavigate()
  const [scrollPos, setScrollPos] = useState(0)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const scrollAtStart = useRef(0)
  const isHovered = useRef(false)
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(1400)

  // Measure container width dynamically to guarantee cards fit on screen
  useEffect(() => {
    if (!containerRef.current) return
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }
    updateWidth()
    const ro = new ResizeObserver(updateWidth)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Repeat HIGHLIGHTS_DATA 6 times for ultra-smooth continuous infinite looping
  const repeatedData = [
    ...HIGHLIGHTS_DATA,
    ...HIGHLIGHTS_DATA,
    ...HIGHLIGHTS_DATA,
    ...HIGHLIGHTS_DATA,
    ...HIGHLIGHTS_DATA,
    ...HIGHLIGHTS_DATA
  ]

  const itemsInSet = HIGHLIGHTS_DATA.length
  const cardGap = containerWidth < 640 ? 10 : 16 // px gap between cards

  // Responsively show 3.1 cards on mobile to match Ocean Welcomes All (3 per row), 3.5 on tablet, 5 on desktop
  const cardsToShow = containerWidth < 640 ? 3.1 : (containerWidth < 1024 ? 3.5 : 5)
  const cardWidth = Math.floor((containerWidth - (Math.ceil(cardsToShow) - 1) * cardGap) / cardsToShow)
  const singleSetWidth = itemsInSet * (cardWidth + cardGap)

  useEffect(() => {
    let animationFrameId
    const step = () => {
      if (!isDragging.current && !isHovered.current) {
        setScrollPos((prev) => prev - 1.35) // Increased left-to-right auto-scroll speed
      }
      animationFrameId = requestAnimationFrame(step)
    }
    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  const hasMoved = useRef(false)

  const handlePointerDown = (e) => {
    isDragging.current = true
    hasMoved.current = false
    dragStartX.current = e.clientX
    scrollAtStart.current = scrollPos
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current) return
    const deltaX = e.clientX - dragStartX.current
    if (Math.abs(deltaX) > 8) {
      hasMoved.current = true
      try {
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.setPointerCapture(e.pointerId)
        }
      } catch { }
    }
    setScrollPos(scrollAtStart.current - deltaX)
  }

  const handlePointerUp = (e) => {
    if (isDragging.current) {
      isDragging.current = false
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId)
        }
      } catch { }
    }
  }

  const handlePrev = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setScrollPos((prev) => prev - (cardWidth + cardGap))
  }

  const handleNext = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setScrollPos((prev) => prev + (cardWidth + cardGap))
  }

  const handleNavigate = (e, targetLink) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (hasMoved.current) {
      return
    }
    const destination = targetLink || '/services'
    navigate(destination)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Calculate seamless looping modulo offset
  let normalizedScroll = scrollPos % singleSetWidth
  if (normalizedScroll < 0) {
    normalizedScroll += singleSetWidth
  }

  return (
    <div
      onMouseEnter={() => { isHovered.current = true }}
      onMouseLeave={() => { isHovered.current = false }}
      className="relative w-full max-w-[1800px] mx-auto my-4 pointer-events-auto px-1 sm:px-2"
    >
      {/* Sleek Floating Arrow Buttons outside cards */}
      <button
        type="button"
        onClick={handlePrev}
        onMouseEnter={(e) => { e.stopPropagation(); isHovered.current = true }}
        onMouseLeave={(e) => { e.stopPropagation(); isHovered.current = true }}
        className="carousel-arrow-btn absolute -left-1 sm:left-2 lg:left-3 top-1/2 -translate-y-1/2 z-40 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/15 border border-white/30 text-white hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-2xl flex items-center justify-center cursor-pointer select-none transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Previous Slide"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        type="button"
        onClick={handleNext}
        onMouseEnter={(e) => { e.stopPropagation(); isHovered.current = true }}
        onMouseLeave={(e) => { e.stopPropagation(); isHovered.current = true }}
        className="carousel-arrow-btn absolute -right-1 sm:right-2 lg:right-3 top-1/2 -translate-y-1/2 z-40 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/15 border border-white/30 text-white hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-2xl flex items-center justify-center cursor-pointer select-none transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Next Slide"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Main Track Viewport */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full py-4 overflow-hidden cursor-grab active:cursor-grabbing select-none"
      >
        <div
          className="flex"
          style={{
            gap: `${cardGap}px`,
            transform: `translateX(-${normalizedScroll}px)`,
            width: `${repeatedData.length * (cardWidth + cardGap)}px`
          }}
        >
          {repeatedData.map((current, i) => (
            <div
              key={`${current.id}-${i}`}
              onClick={(e) => handleNavigate(e, current.link)}
              style={{ width: `${cardWidth}px` }}
              className="h-[210px] xs:h-[235px] sm:h-[450px] flex-shrink-0 rounded-xl sm:rounded-[28px] overflow-hidden shadow-2xl relative border border-white/20 bg-[#001E36] group cursor-pointer pointer-events-auto transition-all duration-500 hover:border-[#FFCD00]/70 hover:shadow-[0_12px_36px_rgba(0,0,0,0.85)] hover:-translate-y-1.5"
            >
              {current.image ? (
                <img
                  src={current.image}
                  alt={current.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-[#001224] via-[#001428]/60 to-transparent pointer-events-none" />

              <div className="absolute inset-0 p-2.5 xs:p-3 sm:p-6 lg:p-7 flex flex-col justify-end pointer-events-auto">
                <div className="mt-auto flex flex-col">
                  <span className="hidden sm:inline-flex items-center self-start text-[#FFCD00] font-heading font-bold text-[7px] sm:text-[10px] uppercase tracking-widest bg-[#FFCD00]/15 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#FFCD00]/30 mb-1 sm:mb-2.5 pointer-events-none shadow-sm backdrop-blur-md">
                    Featured
                  </span>
                  <h3 className="font-heading text-[11px] xs:text-xs sm:text-2xl font-bold text-white leading-tight mb-1.5 sm:mb-2 pointer-events-none drop-shadow-md line-clamp-2 sm:whitespace-normal">
                    {current.title}
                  </h3>
                  <p className="hidden sm:block text-white/85 text-xs sm:text-[13px] line-clamp-2 leading-relaxed mb-5 pointer-events-none text-left">
                    {current.desc}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => handleNavigate(e, current.link)}
                    className="w-full py-1.5 xs:py-2 sm:py-3 px-1.5 sm:px-5 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 text-white font-bold text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] hover:shadow-[0_8px_30px_rgba(255,205,0,0.5)] shadow-lg pointer-events-auto cursor-pointer relative z-30 flex items-center justify-center gap-1 sm:gap-2 group/btn"
                  >
                    <span>{current.btnText || 'Explore'}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1">
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
  const [prevIndex, setPrevIndex] = useState(0)

  useEffect(() => {
    if (!images || images.length === 0) return
    const timer = setInterval(() => {
      setIndex((curr) => {
        setPrevIndex(curr)
        return (curr + 1) % images.length
      })
    }, 3200)
    return () => clearInterval(timer)
  }, [images])

  return (
    <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] w-full h-[420px] lg:h-[480px] bg-[#001e3d] border border-white/20">
      {/* Base Layer: Previous image stays 100% solid underneath so background is NEVER visible during transition */}
      {images[prevIndex] && (
        <img
          src={images[prevIndex]}
          alt="Ocean Life"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />
      )}

      {/* Active Layer: Current image smoothly fades in on top of previous image */}
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Marine Life ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out pointer-events-none ${
            i === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
          loading="lazy"
        />
      ))}

      {/* Full-bleed ambient overlay so image is completely visible across both sides of the panel without blank spaces */}
      <div className="absolute inset-0 bg-[#00172b]/20 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none z-10" />

      {showContent && (
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-6 sm:p-10 lg:p-16 pointer-events-none">
          <div className="max-w-2xl pointer-events-auto flex flex-col justify-center">
            <span className="inline-block self-start bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 text-xs font-bold text-[#FFCD00] uppercase tracking-widest mb-4 shadow-sm">
              The Sea is Calling
            </span>
            <h3
              className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-tight mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.9)' }}
            >
              COME FOR THE ADVENTURE.<br />
              <span className="font-heading font-bold text-[#FFCD00]">STAY FOR THE CALM.</span>
            </h3>
            <p
              className="text-white/90 font-medium text-sm sm:text-base mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] max-w-xl leading-relaxed"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}
            >
              Leave with stories that last a lifetime.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/book-us"
                className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 px-7 py-3.5 font-body text-xs sm:text-sm tracking-wider font-bold text-white uppercase shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 hover:scale-105 hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] hover:shadow-[0_12px_40px_rgba(255,205,0,0.5)] cursor-pointer"
              >
                <span>Book Your Dive</span>
                <ArrowIcon />
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 px-7 py-3.5 font-body text-xs sm:text-sm tracking-wider font-bold text-white uppercase shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 hover:scale-105 hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] hover:shadow-[0_12px_40px_rgba(255,205,0,0.5)] cursor-pointer"
              >
                <span>View Gallery</span>
                <ArrowIcon />
              </Link>
            </div>
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
