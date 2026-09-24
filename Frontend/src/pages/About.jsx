import { Link } from 'react-router'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '../components/Button'
import SafeImage from '../components/SafeImage'
import SectionReveal, { StaggerGrid, StaggerItem } from '../components/SectionReveal'
import SEOHead from '../components/SEOHead'
import { CAROUSEL_IMAGES } from '../utils/images'
import { useReviews } from '../contexts/ReviewsContext'
import divingVidLocal from '../assets/Diving(1).mp4'
import aboutVidLocal from '../assets/about.mp4'
import jellyfishVideoLocal from '../assets/jelly fish.mp4'

const divingVid = 'https://res.cloudinary.com/bbgt5nk7/video/upload/v1790244035/dive-village/ui-videos/diving_1_mp4.mp4'
const aboutVid = 'https://res.cloudinary.com/bbgt5nk7/video/upload/v1790244047/dive-village/ui-videos/about_mp4.mp4'
const jellyfishVideo = 'https://res.cloudinary.com/bbgt5nk7/video/upload/v1790244064/dive-village/ui-videos/jelly_fish_mp4.mp4'
const nightDiveVideo = 'https://res.cloudinary.com/bbgt5nk7/video/upload/v1790243508/dive-village/hero-360/bpjuqk54webpdtghzbxk.mp4'
import useNightDive from '../hooks/useNightDive'

import zero2HeroImg from '../assets/Gallery/zero2hero.jpg'
import introProgImg from '../assets/Gallery/Introductory Programs.png'
import freeDivingImg from '../assets/Gallery/Free Diving.png'
import flexibleFunImg from '../assets/Gallery/Flexible Fun Dives.png'

const SAFETY_PROMISES = [
  {
    num: '01',
    title: 'Globally Certified Instructors',
    desc: 'Globally certified instructors and professional guides dedicated to your safety and growth.',
    image: zero2HeroImg,
  },
  {
    num: '02',
    title: 'Personalized Training',
    desc: 'Personalized training sessions tailored to your individual pace, comfort, and skill level.',
    image: introProgImg,
  },
  {
    num: '03',
    title: 'Serviced Equipment',
    desc: 'High-quality, regularly inspected and serviced dive gear for flawless underwater performance.',
    image: freeDivingImg,
  },
  {
    num: '04',
    title: 'Emergency-Ready Staff',
    desc: 'Emergency-ready, rescue-trained staff equipped with complete safety protocols on every dive.',
    image: flexibleFunImg,
  },
]

const TESTIMONIALS = [
  {
    id: 'rev-1',
    name: "Sofia Stalance",
    role: "Open Water Diver",
    text: "The Dive Village completely changed my perspective on the ocean. The instructors were incredibly patient, and the focus on safety made my first dive unforgettable.",
    image: CAROUSEL_IMAGES[1]
  },
  {
    id: 'rev-2',
    name: "Krishawn Rahul",
    role: "Marine Biologist",
    text: "I've dived all over the world, but the dedication to eco-stewardship here is unmatched. It's inspiring to see a dive center that truly cares about coral restoration and leaving no trace.",
    image: CAROUSEL_IMAGES[2]
  },
  {
    id: 'rev-3',
    name: "Michael Antony",
    role: "Advanced Adventurer",
    text: "From the seamless booking process to the personalized dive charters, everything was flawless. A vibrant community that genuinely feels like a second home.",
    image: CAROUSEL_IMAGES[0]
  }
]

const titleWords = ["Your", "Ocean", "Community"]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const wordVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 200,
    },
  },
}

export default function About() {
  const reduce = useReducedMotion()
  const isNightDive = useNightDive()
  const { approvedReviews } = useReviews()
  const reviewsToDisplay = approvedReviews && approvedReviews.length > 0 ? approvedReviews.slice(0, 3) : TESTIMONIALS

  return (
    <div className="min-h-screen font-body overflow-x-hidden pointer-events-none relative bg-[#001e3d] text-white">
      <SEOHead
        title="About Us | Certified Scuba Instructors & Ocean Sanctuary | The Dive Village"
        description="Discover the story behind The Dive Village. Dedicated to safety, marine conservation, diving excellence, and building an inclusive underwater community."
        keywords="about the dive village, certified instructors, marine conservation dive center, eco scuba diving, ocean community"
        canonicalUrl="https://thedivevillage.com/about"
      />
      
      {/* FULL-SCREEN VIDEO BACKGROUND (DYNAMIC FOR NIGHT DIVE ACROSS ENTIRE PAGE) */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <video
          key={isNightDive ? 'night-dive-bg' : 'day-diving-bg'}
          src={isNightDive ? nightDiveVideo : divingVid}
          autoPlay
          loop
          muted
          playsInline
          onPlay={(e) => { e.currentTarget.playbackRate = 0.7 }}
          className="w-full h-full object-cover transition-opacity duration-700 opacity-95 sm:opacity-100"
        />
        <div className={`absolute inset-0 transition-colors duration-700 ${
          isNightDive
            ? 'bg-gradient-to-b from-[#030a12]/30 via-transparent to-[#030a12]/45'
            : 'bg-gradient-to-b from-[#00223D]/35 via-transparent to-[#00223D]/50'
        }`} />
      </div>

      {/* 1. HERO BANNER — STAGGERED WORD ANIMATION */}
      <div className="pt-36 pb-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pointer-events-auto text-white relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-80px" }}
          variants={containerVariants}
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-none text-white drop-shadow-lg mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {titleWords.map((word, idx) => (
              <motion.span
                key={idx}
                variants={wordVariants}
                className={word === "Ocean" || word === "Community" ? "text-[#FFCD00] font-bold" : "text-white"}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="max-w-2xl text-lg sm:text-xl font-body font-medium text-white/90 leading-relaxed text-center drop-shadow-md"
          >
            A feeling meant to be shared. Built by ocean lovers, for ocean lovers. Here, every dive holds a story, and every visitor who arrives leaves as family.
          </motion.p>
        </motion.div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="relative z-10 pointer-events-auto pt-6 sm:pt-10 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 2.1 VISION & MISSION — STACKED ON MOBILE, SIDE-BY-SIDE ON DESKTOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-6 lg:gap-8 mb-16 sm:mb-28">
          
          {/* Vision Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-2xl sm:rounded-[32px] bg-white/10 backdrop-blur-2xl text-white p-6 sm:p-10 shadow-2xl transition-all duration-500 border border-white/20 hover:border-[#FFCD00]/60 hover:bg-white/15 hover:shadow-[0_20px_50px_rgba(255,205,0,0.2)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FFCD00]/15 border border-[#FFCD00]/40 flex items-center justify-center shadow-inner text-[#FFCD00]">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <span className="font-heading font-bold text-base sm:text-xl text-[#FFCD00] tracking-wider">
                  01
                </span>
              </div>

              <h3 className="font-heading text-xl sm:text-3xl font-bold text-white uppercase tracking-wide leading-tight mb-3 sm:mb-4">
                OUR VISION
              </h3>

              <blockquote className="text-white/95 text-sm sm:text-xl leading-relaxed font-body border-l-3 sm:border-l-4 border-[#FFCD00] pl-3.5 sm:pl-4">
                “To unite the world's ocean lovers into a global community—driven by passion, connected by purpose, and committed to protection.”
              </blockquote>
            </div>
          </motion.div>

          {/* Mission Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="h-full rounded-2xl sm:rounded-[32px] bg-white/10 backdrop-blur-2xl text-white p-6 sm:p-10 shadow-2xl transition-all duration-500 border border-white/20 hover:border-[#FFCD00]/60 hover:bg-white/15 hover:shadow-[0_20px_50px_rgba(255,205,0,0.2)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FFCD00]/15 border border-[#FFCD00]/40 flex items-center justify-center shadow-inner text-[#FFCD00]">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.5-3.5-3.5-7.5-4 11z"/>
                  </svg>
                </div>
                <span className="font-heading font-bold text-base sm:text-xl text-[#FFCD00] tracking-wider">
                  02
                </span>
              </div>

              <h3 className="font-heading text-xl sm:text-3xl font-bold text-white uppercase tracking-wide leading-tight mb-3 sm:mb-4">
                OUR MISSION
              </h3>

              <blockquote className="text-white/95 text-sm sm:text-lg leading-relaxed font-body border-l-3 sm:border-l-4 border-[#FFCD00] pl-3.5 sm:pl-4">
                “At The Dive Village, our mission is to inspire adventure and foster respect for the ocean by providing safe, sustainable, and unforgettable scuba diving experiences. We are committed to building a platform and educating Divers of all levels, protecting marine ecosystems, and building a community that shares a passion for exploring the ocean world.”
              </blockquote>
            </div>
          </motion.div>

        </div>

        {/* 2.2 FOUNDER'S NOTE — TRANSLUCENT GLASS BOX */}
        <div className="relative rounded-[40px] bg-white/10 backdrop-blur-2xl text-white border border-white/20 p-0 shadow-2xl mb-28 overflow-hidden">
          <div className="grid lg:grid-cols-12 items-stretch">
            {/* Left Content */}
            <div className="lg:col-span-7 p-8 sm:p-14 lg:p-16 flex flex-col justify-center relative z-20">
              <span className="inline-block self-start bg-white/15 backdrop-blur-md text-[#FFCD00] font-heading font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-white/25 shadow-sm">
                Founder's Note — Sanjeev Bajaj
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-white leading-tight mb-6">
                Built by Ocean Lovers, <br />
                <span className="text-[#FFCD00] font-bold">For Ocean Lovers</span>
              </h2>
              <p className="text-white/90 leading-relaxed text-base sm:text-lg font-body font-medium mb-4">
                The Dive Village began with one man and one belief. For Sanjeev, the ocean was more than a passion—it was a sanctuary. A place of healing, discovery, and profound transformation. And he knew, deep down, that this magic was not meant to be kept to himself.
              </p>
              <p className="text-white/90 leading-relaxed text-base sm:text-lg font-body font-medium mb-6">
                So he built a door to “The Dive Village” , a community for divers. A home beneath the waves, built by ocean lovers, for ocean lovers. A place where anyone, from all walks of life, could feel the rhythm of the currents and in doing so rediscover themselves.
              </p>
              <p className="text-white/95 leading-relaxed text-base sm:text-lg font-body font-bold border-l-4 border-[#FFCD00] pl-6 mb-8 bg-white/10 backdrop-blur-md py-4 pr-4 rounded-r-2xl border-t border-b border-white/15">
                “Today, Sanjeev's vision lives on in every dive, every story, and every stranger who arrives—and leaves as family member of this community. This is The Dive Village. Your Diving Community.”
              </p>
              <div className="pt-4 border-t border-white/15">
                <h4 className="font-heading font-bold text-white text-base">Sanjeev Bajaj</h4>
                <p className="text-xs text-[#FFCD00] font-heading font-bold">Founder & Master Instructor</p>
              </div>
            </div>

            {/* Right Video Frame next to Sanjeev's Story */}
            <div className="lg:col-span-5 relative min-h-[360px] lg:min-h-full overflow-hidden rounded-b-[40px] lg:rounded-b-none lg:rounded-r-[40px]">
              <video 
                src={aboutVid} 
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 2.3 TRAINING & SAFETY — TRANSLUCENT GLASS CONTAINER */}
        <div className="rounded-[44px] bg-white/10 backdrop-blur-2xl border border-white/20 p-8 sm:p-14 lg:p-20 shadow-2xl mb-28 text-white">
          <SectionReveal className="text-center mb-16 max-w-3xl mx-auto">
            <span className="inline-block bg-white/15 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-heading font-bold text-[#FFCD00] uppercase tracking-widest mb-4 border border-white/25 shadow-sm">
              THE DIVE VILLAGE (SWIM · SCUBA · FREEDIVE)
            </span>
            <h2 className="font-heading text-4xl sm:text-6xl font-bold text-white leading-tight mb-4">
              Training & Safety — <span className="text-[#FFCD00] font-bold">Confidence Beneath Every Wave</span>
            </h2>
            <p className="text-white/90 text-base sm:text-lg font-body font-medium leading-relaxed">
              At Dive Village, every adventure begins with safety. Our focus is on comfort, skill, and confidence for every participant.
            </p>
          </SectionReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {SAFETY_PROMISES.map((s, i) => (
              <div key={i} className="rounded-[32px] bg-white/10 backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between hover:bg-white/20 hover:border-[#FFCD00]/50 transition duration-500 group border border-white/15 shadow-lg overflow-hidden">
                <div>
                  {/* Photo Container */}
                  <div className="h-44 w-full rounded-2xl overflow-hidden mb-5 border border-white/15 relative bg-black/20 shadow-md">
                    <img 
                      src={s.image} 
                      alt={s.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-md border border-white/20 text-[#FFCD00] font-heading font-bold text-xs px-2.5 py-1 rounded-full">
                      {s.num}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-[#FFCD00] transition">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-body font-medium transition">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-8 border-t border-white/15">
            <blockquote className="font-heading text-xl sm:text-2xl font-bold text-white max-w-2xl mx-auto">
              “You'll never dive alone — you'll always be guided, supported, and cared for. Because trust is the deepest dive of all.”
            </blockquote>
          </div>
        </div>

        {/* 2.4 COMMUNITY VOICES — TRANSLUCENT TESTIMONIALS */}
        <div className="mb-28">
          <SectionReveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#FFCD00] font-heading font-bold tracking-widest uppercase text-xs mb-3 block">
              Community Voices
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-white">
              What Our Divers Say
            </h2>
          </SectionReveal>
          
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {reviewsToDisplay.map((t, i) => (
              <div key={t.id || i} className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 hover:border-white/30 hover:-translate-y-2 transition duration-500 flex flex-col justify-between h-full">
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating || 5)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 text-[#FFCD00]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white/95 mb-8 leading-relaxed font-body font-medium text-justify">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 shrink-0 shadow-md">
                    <SafeImage src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm">{t.name}</h4>
                    <span className="text-xs text-[#FFCD00] font-heading font-bold">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2.5 READY TO EXPLORE THE OCEAN — FULL-BLEED TRANSLUCENT CTA WITH HERO VIDEO */}
        <div className="rounded-[40px] text-white p-8 sm:p-14 lg:p-20 relative overflow-hidden shadow-2xl border border-white/20 group">
          <video
            src={divingVid}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] group-hover:scale-105 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001428]/95 via-[#001428]/75 to-[#001428]/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001428]/90 via-transparent to-black/20 pointer-events-none" />
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#FFCD00]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl flex flex-col justify-center">
            <span className="inline-block self-start bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 text-xs font-bold text-[#FFCD00] uppercase tracking-widest mb-6 shadow-sm">
              Start Now
            </span>
            <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white leading-tight mb-4 drop-shadow-md">
              Discover Your Next <span className="font-heading font-bold text-[#FFCD00]"><br />Ocean Escape</span>
            </h2>
            <p className="text-base sm:text-lg font-medium text-white/90 leading-relaxed max-w-xl mb-8 drop-shadow-sm">
              Whether it's your very first breath underwater or your next technical certification, we are ready to guide you every step of the way.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
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
                to="/contact"
                className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-4 py-2.5 sm:px-6 sm:py-4 text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] cursor-pointer"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>

        </div>
      </div>
    </div>
  )
}
