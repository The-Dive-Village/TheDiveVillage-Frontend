import { Link } from 'react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { IMAGES } from '../utils/images'
import Button from '../components/Button'

export default function AllCourses() {
  const reduce = useReducedMotion()

  const CATEGORIES = [
    {
      title: 'Scuba Diving',
      desc: 'A form of underwater diving where divers use a Self-Contained Underwater Breathing Apparatus to explore beneath the surface.',
      img: IMAGES.scubaHero,
      link: '/courses/scuba'
    },
    {
      title: 'Snorkeling',
      desc: 'Discover snorkeling and explore the ocean up close. The ocean welcomes all.',
      img: IMAGES.snorkelingHero,
      link: '/courses/snorkeling'
    },
    {
      title: 'Freediving',
      desc: 'Focus on breath-hold diving and safe descents.',
      img: IMAGES.surfingHero,
      link: '/courses/surfing'
    }
  ]

  return (
    <div className="bg-[#f0f9ff] min-h-screen text-navy font-body overflow-x-hidden pt-24 sm:pt-[120px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block">Our Programs</span>
        <h1 className="font-serif text-5xl sm:text-7xl text-navy leading-[1.1] mb-6">
          All Courses
        </h1>
        <p className="text-navy/70 leading-relaxed text-lg max-w-2xl mx-auto">
          Whether you want to dive deep, stay near the surface, or ride the waves, we have the perfect ocean experience waiting for you.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24 grid md:grid-cols-3 gap-8">
        {CATEGORIES.map((cat, i) => (
          <motion.div 
            key={i}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group block relative rounded-[40px] overflow-hidden aspect-[3/4] shadow-xl"
          >
            <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <h2 className="font-serif text-4xl text-white mb-2">{cat.title}</h2>
              <p className="text-white/80 mb-6">{cat.desc}</p>
              <Button as={Link} to={cat.link} variant="glass">
                Explore {cat.title}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-[40px] bg-navy text-white p-10 sm:p-16 lg:p-20 relative overflow-hidden shadow-lift">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <span className="inline-block bg-white/10 rounded-full px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-widest mb-6">
              Start Your Certification
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6">
              Not Sure Which Program is Right for You?
            </h2>
            <p className="text-lg text-white/80 max-w-xl mb-10 leading-relaxed">
              Talk to our PADI Master Instructors. We will guide you to the perfect training path based on your schedule, experience, and goals.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Button as={Link} to="/book-us" variant="primary">
                Book a Course Today →
              </Button>
              <Button as={Link} to="/services" variant="secondary">
                View All Services
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
