import { Link } from 'react-router'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '../components/Button'

// Reusable CourseTemplate based on the reference design
export default function CourseTemplate({
  heroImage,
  heroVideo,
  titleTop,
  titleBottom,
  aboutTitle,
  aboutSubtitle,
  aboutText,
  aboutImg1,
  aboutImg2,
  toursTitle = "Most Popular Tours",
  toursSubtitle = "You think you have what it takes?",
  tours = [],
  statsText = "Just take the plunge",
  statsDesc = "Experience the best diving with our highly experienced crew.",
  stats = [],
  statsImage,
  statsQuote = "We get to experience the majestic ocean up close.",
  ctaTitle = "Experience the thrill",
  ctaDesc = "Nothing is more exhilarating than coming face to face with nature.",
  ctaLink = "/book-us",
}) {
  const reduce = useReducedMotion()

  return (
    <div className="bg-[#f0f9ff] text-navy font-body overflow-x-hidden pt-16 sm:pt-[72px]">
      {/* HERO SECTION */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-navy">
        <div className="absolute inset-0 z-0">
          {heroVideo ? (
            <video
              src={heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              poster={heroImage}
            />
          ) : (
            <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/20 to-navy/80"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-serif text-white tracking-tight leading-tight"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
          >
            {titleTop} <br />
            <span className="font-bold italic text-white/95">{titleBottom}</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-10 flex items-center gap-3 bg-white/15 backdrop-blur-md rounded-full px-6 py-3 border border-white/30 shadow-lg text-white font-bold text-xs sm:text-sm tracking-widest uppercase"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <span>PADI Certified Course Experience</span>
          </motion.div>
        </div>
      </section>

      {/* ABOUT US SECTION WITH WAVY BACKGROUND */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 text-white">
           <svg className="relative block w-[calc(149%+1.3px)] h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
           </svg>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block">{aboutSubtitle}</span>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-navy leading-[1.1] mb-6">
                {aboutTitle}
              </h2>
            </div>
            <div>
              <p className="text-navy/70 leading-relaxed text-lg mb-6">
                {aboutText}
              </p>
              <Link to={ctaLink} className="text-accent font-bold hover:text-navy transition">Learn More →</Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-8 relative">
            <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-xl transform translate-y-12">
              <img src={aboutImg1} alt="About 1" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-xl transform -translate-y-12">
              <img src={aboutImg2} alt="About 2" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* TOURS CAROUSEL SECTION */}
      <section className="relative py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block">{toursTitle}</span>
            <h2 className="font-serif text-4xl sm:text-5xl text-navy leading-[1.1] max-w-md">
              {toursSubtitle}
            </h2>
          </div>
          <div className="flex gap-4">
             <button className="w-12 h-12 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy/5 transition"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
             <button className="w-12 h-12 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy/5 transition"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-12 px-4 sm:px-6 lg:px-8 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {tours.map((tour, i) => (
            <div key={i} className="w-[85vw] sm:w-[350px] flex-shrink-0 snap-start bg-[#F8FAFC] rounded-3xl overflow-hidden shadow-sm border border-navy/5 group hover:shadow-xl transition duration-300 relative">
              <div className="aspect-[4/3] relative">
                <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute -bottom-4 right-6 bg-accent text-white font-bold text-sm px-4 py-2 rounded-xl shadow-lg">
                  Inquire
                </div>
              </div>
              <div className="p-8 pt-10">
                <h3 className="font-bold text-xl text-navy mb-2">{tour.title}</h3>
                <p className="text-navy/60 text-sm mb-6">{tour.desc}</p>
                <div className="flex items-center justify-between pt-6 border-t border-navy/10">
                  <div className="flex text-yellow-400 gap-1 text-sm">
                    ★ ★ ★ ★ ★
                  </div>
                  <span className="text-xs font-bold text-navy/50">{tour.spaces} spaces left</span>
                </div>
                <div className="mt-6 flex justify-end">
                  <Link to={ctaLink} className="font-bold text-navy text-sm hover:text-accent transition flex items-center gap-2">
                    Book Now <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS & PLUNGE SECTION */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none text-white opacity-50 pointer-events-none">
           <svg className="relative block w-[calc(149%+1.3px)] h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
           </svg>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block">About Us</span>
              <h2 className="font-serif text-5xl sm:text-6xl text-navy leading-[1.1] mb-6">
                {statsText}
              </h2>
              <p className="text-navy/70 leading-relaxed text-lg mb-10 max-w-md">
                {statsDesc}
              </p>
              <Button as={Link} to={ctaLink} className="bg-accent text-white border-none mb-16">
                Book Now
              </Button>

              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-navy/10">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <div className="font-serif text-4xl text-accent mb-2">{stat.value}</div>
                    <div className="text-xs font-bold text-navy/60 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <div className="rounded-[40px] overflow-hidden aspect-[4/5] shadow-2xl">
                <img src={statsImage} alt="Stats" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-xl max-w-sm border border-navy/5 hidden sm:block">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                </div>
                <p className="text-navy/80 font-medium leading-relaxed text-sm">
                  {statsQuote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-32 bg-white text-center overflow-hidden">
        <div className="mx-auto max-w-3xl px-4 relative z-10">
          <h2 className="font-serif text-4xl sm:text-5xl text-accent leading-[1.1] mb-6">
            {ctaTitle}
          </h2>
          <p className="text-navy/70 leading-relaxed text-lg mb-10 max-w-md mx-auto">
            {ctaDesc}
          </p>
          <Button as={Link} to={ctaLink} className="bg-accent text-white border-none shadow-xl hover:scale-105 transition-all px-8 py-4">
            Book Now
          </Button>
        </div>
        <div className="absolute right-10 bottom-10 opacity-10 pointer-events-none">
           <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        </div>
      </section>
    </div>
  )
}
