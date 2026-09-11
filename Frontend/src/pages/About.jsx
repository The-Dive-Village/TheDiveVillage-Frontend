import { Link } from 'react-router'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '../components/Button'
import SafeImage from '../components/SafeImage'
import SectionReveal, { StaggerGrid, StaggerItem } from '../components/SectionReveal'
import SEOHead from '../components/SEOHead'
import { IMAGES, CAROUSEL_IMAGES } from '../utils/images'
import img2 from '../assets/2.png'
import panelImg from '../assets/panel3.png'
import divingVid from '../assets/Diving(1).mp4'

const SAFETY_PROMISES = [
  {
    num: '01',
    title: 'Globally Certified Instructors',
    desc: 'Globally certified PADI instructors and professional guides dedicated to your safety and growth.',
  },
  {
    num: '02',
    title: 'Personalized Training',
    desc: 'Personalized training sessions tailored to your individual pace, comfort, and skill level.',
  },
  {
    num: '03',
    title: 'Serviced Equipment',
    desc: 'High-quality, regularly inspected and serviced dive gear for flawless underwater performance.',
  },
  {
    num: '04',
    title: 'Emergency-Ready Staff',
    desc: 'Emergency-ready, rescue-trained staff equipped with complete safety protocols on every dive.',
  },
]

const TESTIMONIALS = [
  {
    name: "Alex Johnson",
    role: "PADI Open Water Diver",
    text: "The Dive Village completely changed my perspective on the ocean. The instructors were incredibly patient, and the focus on safety made my first dive an unforgettable and peaceful experience.",
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
    text: "From the seamless booking process to the personalized dive charters, everything was flawless. A vibrant community that genuinely feels like a second home beneath the waves.",
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

  return (
    <div className="bg-[#003865] min-h-screen font-body overflow-x-hidden pointer-events-none relative">
      <SEOHead
        title="About Us | Certified PADI Scuba Instructors & Ocean Sanctuary | The Dive Village"
        description="Discover the story behind The Dive Village. Dedicated to safety, marine conservation, PADI diving excellence, and building an inclusive underwater community."
        keywords="about the dive village, PADI certified instructors, marine conservation dive center, eco scuba diving, ocean community"
        canonicalUrl="https://thedivevillage.com/about"
      />
      
      {/* FULL-SCREEN 360 VIDEO BACKGROUND (Diving(1).mp4 ONLY) */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <video
          src={divingVid}
          autoPlay
          loop
          muted
          playsInline
          onPlay={(e) => { e.currentTarget.playbackRate = 0.7 }}
          className="w-full h-full object-cover opacity-35 filter brightness-90 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#003865]/80 via-[#003865]/50 to-[#003865]/90 mix-blend-multiply" />
      </div>

      {/* 1. HERO BANNER — STAGGERED WORD ANIMATION (NO "ABOUT THE DIVE VILLAGE" TEXT) */}
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
                className={word === "Ocean" || word === "Community" ? "text-[#FFCD00] italic font-bold" : "text-white"}
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

      {/* 2. MAIN CONTENT AREA — BRAND COLORS ONLY (#003865, #00AEC7, #FFCD00) */}
      <div className="bg-white/95 backdrop-blur-md text-[#003865] rounded-t-[48px] pt-16 sm:pt-24 pb-24 shadow-[0_-20px_40px_rgba(0,0,0,0.15)] pointer-events-auto relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 2.1 VISION & MISSION — BRAND COLORS #003865 & #00AEC7 */}
        <div className="grid md:grid-cols-2 gap-8 mb-28">
          
          {/* Vision: Slide in from Left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-[32px] bg-[#003865] text-white p-8 sm:p-10 shadow-2xl transition-all duration-500 border border-[#00AEC7]/30 hover:border-[#00AEC7] hover:shadow-[0_20px_50px_rgba(0,174,199,0.3)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#00AEC7]/15 border border-[#00AEC7]/40 flex items-center justify-center shadow-inner text-[#00AEC7]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <span className="font-heading font-bold text-xl text-[#00AEC7] tracking-wider">
                  01
                </span>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide leading-tight mb-4">
                OUR VISION
              </h3>

              <blockquote className="text-white/90 text-lg sm:text-xl leading-relaxed font-body italic border-l-4 border-[#00AEC7] pl-4">
                “To unite the world's ocean lovers into a global community—driven by passion, connected by purpose, and committed to protection.”
              </blockquote>
            </div>
          </motion.div>

          {/* Mission: Slide in from Right */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="h-full rounded-[32px] bg-[#003865] text-white p-8 sm:p-10 shadow-2xl transition-all duration-500 border border-[#00AEC7]/30 hover:border-[#00AEC7] hover:shadow-[0_20px_50px_rgba(0,174,199,0.3)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#00AEC7]/15 border border-[#00AEC7]/40 flex items-center justify-center shadow-inner text-[#00AEC7]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.5-3.5-3.5-7.5-4 11z"/>
                  </svg>
                </div>
                <span className="font-heading font-bold text-xl text-[#00AEC7] tracking-wider">
                  02
                </span>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide leading-tight mb-4">
                OUR MISSION
              </h3>

              <blockquote className="text-white/90 text-base sm:text-lg leading-relaxed font-body italic border-l-4 border-[#00AEC7] pl-4">
                “At The Dive Village, our mission is to inspire adventure and foster respect for the ocean by providing safe, sustainable, and unforgettable scuba diving experiences. We are committed to building a platform and educating Divers of all levels, protecting marine ecosystems, and building a community that shares a passion for exploring the ocean world.”
              </blockquote>
            </div>
          </motion.div>

        </div>

        {/* 2.2 FOUNDER'S NOTE — BRAND COLORS #003865, #00AEC7, #FFCD00 */}
        <div className="relative rounded-[40px] bg-[#003865] text-white border-none p-0 shadow-2xl mb-28 overflow-hidden">
          {/* Floating PNG Accent (2.png) */}
          <img
            src={img2}
            alt=""
            className="absolute top-6 right-6 sm:top-8 sm:right-8 w-24 sm:w-36 h-auto object-contain opacity-80 drop-shadow-2xl animate-[floatPngSlow_6s_easeInOut_infinite] pointer-events-none z-10"
          />

          <div className="grid lg:grid-cols-12 items-stretch">
            {/* Left Content */}
            <div className="lg:col-span-7 p-8 sm:p-14 lg:p-16 flex flex-col justify-center relative z-20">
              <span className="inline-block self-start bg-[#FFCD00]/20 text-[#FFCD00] font-heading font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-[#FFCD00]/30 shadow-sm">
                Founder's Note — Sanjeev Bajaj
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-white leading-tight mb-6">
                Built by Ocean Lovers, <br />
                <span className="text-[#FFCD00] italic font-bold">For Ocean Lovers</span>
              </h2>
              <p className="text-white/85 leading-relaxed text-base sm:text-lg font-body font-medium mb-4">
                The Dive Village began with one man and one belief. For Sanjeev, the ocean was more than a passion—it was a sanctuary. A place of healing, discovery, and profound transformation. And he knew, deep down, that this magic was not meant to be kept to himself.
              </p>
              <p className="text-white/85 leading-relaxed text-base sm:text-lg font-body font-medium mb-6">
                So he built a door to “The Dive Village” , a community for divers. A home beneath the waves, built by ocean lovers, for ocean lovers. A place where anyone, from all walks of life, could feel the rhythm of the currents and in doing so rediscover themselves.
              </p>
              <p className="text-white/95 leading-relaxed text-base sm:text-lg font-body font-bold italic border-l-4 border-[#FFCD00] pl-6 mb-8 bg-white/5 py-4 pr-4 rounded-r-2xl border-t border-b border-white/10">
                “Today, Sanjeev's vision lives on in every dive, every story, and every stranger who arrives—and leaves as family member of this community. This is The Dive Village. Your Diving Community.”
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-[#FFCD00] shadow-md shrink-0">
                  <img src={panelImg} alt="Sanjeev Bajaj" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-base">Sanjeev Bajaj</h4>
                  <p className="text-xs text-[#FFCD00] font-heading font-bold">Founder & Master Instructor</p>
                </div>
              </div>
            </div>

            {/* Right Photo Frame: Flush Top to Bottom with No Borders */}
            <div className="lg:col-span-5 relative min-h-[360px] lg:min-h-full">
              <img 
                src={panelImg} 
                alt="Sanjeev Bajaj - Founder" 
                className="w-full h-full object-cover absolute inset-0 rounded-b-[40px] lg:rounded-b-none lg:rounded-r-[40px]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003865]/80 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 2.3 TRAINING & SAFETY — THE DIVE VILLAGE (SWIM · SCUBA · FREEDIVE) */}
        <div className="rounded-[44px] bg-white border border-[#003865]/10 p-8 sm:p-14 lg:p-20 shadow-soft mb-28">
          <SectionReveal className="text-center mb-16 max-w-3xl mx-auto">
            <span className="inline-block bg-[#003865]/5 rounded-full px-4 py-1.5 text-xs font-heading font-bold text-[#003865]/70 uppercase tracking-widest mb-4 border border-[#003865]/10">
              THE DIVE VILLAGE (SWIM · SCUBA · FREEDIVE)
            </span>
            <h2 className="font-heading text-4xl sm:text-6xl font-bold text-[#003865] leading-tight mb-4">
              Training & Safety — <span className="text-[#00AEC7] italic font-bold">Confidence Beneath Every Wave</span>
            </h2>
            <p className="text-[#003865]/75 text-base sm:text-lg font-body font-medium leading-relaxed">
              At Dive Village, every adventure begins with safety. Our focus is on comfort, skill, and confidence for every participant.
            </p>
          </SectionReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {SAFETY_PROMISES.map((s, i) => (
              <div key={i} className="rounded-[32px] bg-[#003865]/5 p-6 sm:p-8 flex flex-col justify-between hover:bg-[#003865] hover:text-white transition duration-500 group border border-[#003865]/10">
                <div>
                  <span className="font-heading font-bold text-sm text-[#003865]/40 group-hover:text-[#00AEC7] tracking-widest block mb-4 transition">
                    {s.num}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-[#003865] group-hover:text-white mb-3 transition">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-[#003865]/70 group-hover:text-white/80 leading-relaxed font-body font-medium transition">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-8 border-t border-[#003865]/10">
            <blockquote className="font-heading text-xl sm:text-2xl italic font-bold text-[#003865] max-w-2xl mx-auto">
              “You'll never dive alone — you'll always be guided, supported, and cared for. Because trust is the deepest dive of all.”
            </blockquote>
          </div>
        </div>

        {/* 2.4 COMMUNITY VOICES */}
        <div className="mb-24">
          <SectionReveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#00AEC7] font-heading font-bold tracking-widest uppercase text-xs mb-3 block">
              Community Voices
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#003865]">
              What Our Divers Say
            </h2>
          </SectionReveal>
          
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-[#003865]/10 shadow-card hover:-translate-y-2 transition duration-500">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-[#FFCD00]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#003865]/80 italic mb-8 leading-relaxed font-body font-medium">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#003865]/10">
                    <SafeImage src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-[#003865] text-sm">{t.name}</h4>
                    <span className="text-xs text-[#003865]/60 font-body">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2.5 CALL TO ACTION (CTA) — ONLY DIVING(1).MP4 USED */}
        <div className="rounded-[40px] text-white p-10 sm:p-16 lg:p-20 relative overflow-hidden shadow-lift group bg-[#003865]">
          <video
            src={divingVid}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] group-hover:scale-110 opacity-70"
          />
          <div className="absolute inset-0 bg-[#003865]/70 pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#00AEC7]/30 rounded-full blur-3xl pointer-events-none mix-blend-overlay" />
          
          <div className="relative z-10 max-w-3xl">
            <span className="inline-block bg-white/10 rounded-full px-4 py-1.5 text-xs font-heading font-bold text-[#FFCD00] uppercase tracking-widest mb-6 backdrop-blur-sm border border-white/10">
              Join Our Community
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6 drop-shadow-md">
              Ready to Explore the Ocean With Us?
            </h2>
            <p className="text-lg text-white/90 max-w-xl mb-10 leading-relaxed drop-shadow-md font-body font-medium">
              Whether it's your very first breath underwater or your next technical certification, we are ready to guide you every step of the way.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Button as={Link} to="/book-us" variant="primary">
                Book Your Dive Now →
              </Button>
              <Button as={Link} to="/contact" variant="secondary">
                Contact Our Team
              </Button>
            </div>
          </div>
        </div>

        </div>
      </div>
    </div>
  )
}
