import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const SAFETY_PROMISES = [
  {
    title: 'Globally Certified Instructors',
    desc: 'Professional guides trained to handle any situation with calm and expertise.',
  },
  {
    title: 'Personalized Training',
    desc: 'Instruction tailored to your skill level, whether you are a beginner or a pro.',
  },
  {
    title: 'High-Quality Equipment',
    desc: 'Top-tier dive gear that is regularly serviced and rigorously checked.',
  },
  {
    title: 'Emergency-Ready Staff',
    desc: 'Rescue-trained professionals prepared for any scenario on the water.',
  },
]

export default function TrainingSafety() {
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Header Animation (0.0 to 0.2)
  const headerOpacity = useTransform(
    scrollYProgress,
    [0, 0.05],
    [0, 1]
  )
  const headerScale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.15, 0.2],
    [0.5, 1, 1, 0.8]
  )
  const headerY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.2],
    ["0vh", "0vh", "-35vh"] 
  )

  // Closing Phrase Animation (0.95 to 1.0)
  const closingOpacity = useTransform(
    scrollYProgress,
    [0.9, 0.95],
    [0, 1]
  )

  return (
    <section ref={containerRef} id="training-safety-section" className="relative h-[500vh] w-full text-white pointer-events-auto">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Header - Starts centered, zooms in, then moves up */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            style={{ opacity: headerOpacity, scale: headerScale, y: headerY }}
            className="w-full text-center z-10 px-4 pointer-events-auto"
          >
            <h2 className="font-heading text-4xl sm:text-h2 font-bold drop-shadow-md">
              Confidence Beneath <em className="font-heading italic font-bold text-[#FFCD00]">Every Wave</em>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/90 drop-shadow-md font-medium text-lg">
              At Dive Village, every adventure begins with safety. Our focus is on comfort, skill, and confidence for every participant.
            </p>
          </motion.div>
        </div>

        {/* The 4 promises animating sequentially (0.2 to 1.0) */}
        {SAFETY_PROMISES.map((promise, i) => (
          <SafetyPromiseCard
            key={promise.title}
            promise={promise}
            i={i}
            scrollYProgress={scrollYProgress}
            totalCount={SAFETY_PROMISES.length}
          />
        ))}

        {/* Closing phrase at the very bottom of the sticky container */}
        <motion.div 
          style={{ opacity: closingOpacity }}
          className="absolute bottom-20 w-full text-center z-10 px-4"
        >
          <p className="font-heading text-xl sm:text-2xl font-bold text-[#FFCD00] drop-shadow-md">
            Because trust is the deepest dive of all.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function SafetyPromiseCard({ promise, i, scrollYProgress, totalCount }) {
  const step = 0.8 / totalCount
  const start = 0.2 + (i * step)
  const end = start + step

  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [0, 1, 1, 0]
  )

  const exitX = i % 2 === 0 ? -1200 : 1200
  const x = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [0, 0, 0, exitX]
  )

  const scale = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [0.8, 1, 1, 0.9]
  )

  return (
    <motion.div
      style={{ opacity, x, scale }}
      className="absolute w-full max-w-3xl px-6 z-20 mt-20"
    >
      <div className="rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 p-8 sm:p-12 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFCD00] text-navy">
          <CheckIcon />
        </div>
        <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-4">{promise.title}</h3>
        <p className="text-lg text-white/90 leading-relaxed font-medium">{promise.desc}</p>
      </div>
    </motion.div>
  )
}

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

