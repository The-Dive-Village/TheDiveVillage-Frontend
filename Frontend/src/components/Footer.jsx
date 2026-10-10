import { useState } from 'react'
import { Link } from 'react-router'
import footerLogoImg from '../assets/footer logo.png'
import ViberQRModal from './ViberQRModal'

const QUICK = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/book-us', label: 'Book Us' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/shop', label: 'Shop' },
  { to: '/contact', label: 'Contact Us' },
]

const LEGAL = [
  { to: '/contact', label: 'Privacy Policy' },
  { to: '/contact', label: 'Terms of Service' },
  { to: '/contact', label: 'Cancellation Policy' },
  { to: '/contact', label: 'Safety Guidelines' },
]

const SOCIALS = [
  { label: 'Instagram', to: 'https://www.instagram.com/thedivevillage', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
  { label: 'Facebook', to: 'https://www.facebook.com/profile.php?id=61595366960524', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3.81l.39-4h-4.2V7a1 1 0 011-1h3z"/></svg> },
  { label: 'LinkedIn', to: 'https://www.linkedin.com/company/the-dive-village/', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { label: 'YouTube', to: 'https://www.youtube.com/@thedivevillage', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33 2.78 2.78 0 001.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg> },
  { label: 'WhatsApp', to: 'https://wa.me/918971001010', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg> },
  {
    label: 'Viber',
    to: 'viber://add?number=918971001010',
    isViber: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.5 14.5c0 3.3-3.8 6-8.5 6-1.5 0-2.9-.3-4.1-.8L3.5 21l1.4-3.8C3.8 16 3 14.3 3 12.5c0-4.4 4.3-8 9.5-8s9.5 3.6 9.5 8c0 .7-.1 1.4-.4 2" />
        <path d="M9 10a5 5 0 0 1 5 5" />
        <path d="M9 7.5a7.5 7.5 0 0 1 7.5 7.5" />
      </svg>
    )
  },
]

export default function Footer() {
  const [isViberQrOpen, setIsViberQrOpen] = useState(false)

  const handleSocialClick = (s, e) => {
    if (s.isViber) {
      e.preventDefault()
      const isMobilePhone = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      if (isMobilePhone) {
        const start = Date.now()
        window.location.href = 'viber://add?number=918971001010'
        setTimeout(() => {
          if (!document.hidden && Date.now() - start < 2000) {
            setIsViberQrOpen(true)
          }
        }, 1200)
      } else {
        setIsViberQrOpen(true)
      }
    }
  }

  return (
    <>
      <footer className="bg-navy text-white mt-auto relative z-10 pointer-events-auto">
        {/* ================= MOBILE FOOTER (md:hidden) ================= */}
        <div className="md:hidden bg-[#071d37] text-white px-5 sm:px-6 pt-10 pb-8">
          {/* Centered Brand Block */}
          <div className="flex flex-col items-center text-center">
            <Link to="/" className="inline-block transition-opacity active:opacity-80">
              <img
                src={footerLogoImg}
                alt="The Dive Village"
                className="h-24 w-auto object-contain brightness-0 invert drop-shadow-md"
                loading="lazy"
                width="180"
                height="96"
              />
            </Link>
            <div className="mt-4 text-center">
              <p className="text-[16px] text-white/90 font-light tracking-wide">
                More than a destination.
              </p>
              <p className="text-[16px] text-white/90 font-light tracking-wide mt-1">
                It is a community.
              </p>
            </div>
          </div>

          {/* Quick Links & Legal 2-Column Grid */}
          <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-4">
            {/* QUICK LINKS */}
            <div>
              <h3 className="font-heading text-xl font-bold tracking-wider text-accent uppercase mb-3">
                QUICK LINKS
              </h3>
              <ul className="flex flex-col">
                {QUICK.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="flex items-center justify-between py-1.5 text-[15px] text-white/85 hover:text-white active:text-accent transition-colors"
                    >
                      <span>{item.label}</span>
                      <svg
                        className="w-3.5 h-3.5 text-white/50 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <h3 className="font-heading text-xl font-bold tracking-wider text-accent uppercase mb-3">
                LEGAL
              </h3>
              <ul className="flex flex-col">
                {LEGAL.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="flex items-center justify-between py-1.5 text-[15px] text-white/85 hover:text-white active:text-accent transition-colors"
                    >
                      <span>{item.label}</span>
                      <svg
                        className="w-3.5 h-3.5 text-white/50 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="my-7 border-t border-white/15" />

          {/* CONTACT */}
          <div>
            <h3 className="font-heading text-xl font-bold tracking-wider text-accent uppercase mb-4">
              CONTACT
            </h3>
            <div className="flex items-center justify-between flex-wrap gap-y-3">
              {/* 4 Social Circles */}
              <div className="flex items-center gap-2.5 shrink-0">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/thedivevillage"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-sm active:scale-95 transition-transform"
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61595366960524"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[#1877F2] shadow-sm active:scale-95 transition-transform"
                >
                  <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/the-dive-village/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[#0A66C2] shadow-sm active:scale-95 transition-transform"
                >
                  <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@thedivevillage"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FF0000] shadow-sm active:scale-95 transition-transform"
                >
                  <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>

              {/* Vertical divider */}
              <div className="hidden min-[360px]:block h-7 w-[1px] bg-white/20 mx-1 shrink-0" />

              {/* Email Link */}
              <a
                href="mailto:info@thedivevillage.co"
                className="inline-flex items-center gap-2 text-white hover:text-accent active:opacity-80 transition-colors group min-w-0"
              >
                <div className="w-9 h-9 rounded-full border border-sky-400/40 flex items-center justify-center shrink-0 group-hover:border-accent transition-colors">
                  <svg className="w-4 h-4 text-white group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <span className="text-[13px] sm:text-sm font-normal text-white/95 group-hover:text-accent transition-colors truncate">
                  info@thedivevillage.co
                </span>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="my-7 border-t border-white/15" />

          {/* Bottom Bar */}
          <div className="flex items-center justify-between text-xs text-white/70">
            <p>© {new Date().getFullYear()} The Dive Village</p>
            <div className="flex items-center gap-2">
              <Link to="/contact" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span className="text-white/40">|</span>
              <Link to="/contact" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* ================= DESKTOP FOOTER (hidden md:block) ================= */}
        <div className="hidden md:block">
          <div className="mx-auto grid max-w-7xl gap-8 lg:gap-10 px-4 py-12 sm:py-14 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="flex flex-col items-center sm:items-start justify-between lg:col-span-3">
              <div className="flex flex-col items-center w-fit">
                <Link to="/" className="inline-block transition duration-300 hover:opacity-90">
                  <img
                    src={footerLogoImg}
                    alt="The Dive Village"
                    className="h-20 sm:h-28 lg:h-32 xl:h-36 w-auto object-contain brightness-0 invert drop-shadow-md"
                  />
                </Link>
                <div className="mt-3 w-fit text-white/80">
                  <p className="text-xs sm:text-sm font-light tracking-normal whitespace-nowrap text-center">
                    More than a destination
                  </p>
                  <div className="flex w-full justify-between text-xs sm:text-sm font-light tracking-normal mt-0.5 whitespace-nowrap">
                    <span>It</span>
                    <span>is</span>
                    <span>a</span>
                    <span>community.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: 3 Columns on same row (Quick Links, Legal, Contact) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 lg:col-span-9 lg:grid-cols-3 items-stretch">
              <div className="flex flex-col col-start-1 sm:col-auto h-full">
                <h3 className="font-heading text-base sm:text-lg font-bold uppercase tracking-wider sm:tracking-widest text-accent">
                  Quick Links
                </h3>
                <ul className="mt-3 sm:mt-4 flex flex-1 flex-col justify-between space-y-2 sm:space-y-0">
                  {QUICK.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-xs sm:text-sm text-white/80 transition duration-hover hover:text-accent whitespace-nowrap"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col col-start-2 sm:col-auto h-full">
                <h3 className="font-heading text-base sm:text-lg font-bold uppercase tracking-wider sm:tracking-widest text-accent">
                  Legal
                </h3>
                <ul className="mt-3 sm:mt-4 flex flex-1 flex-col justify-between space-y-2 sm:space-y-0">
                  {LEGAL.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-xs sm:text-sm text-white/80 transition duration-hover hover:text-accent whitespace-nowrap"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col col-start-1 col-span-2 sm:col-span-1 sm:col-start-auto mt-2 sm:mt-0 h-full">
                <h3 className="font-heading text-base sm:text-lg font-bold uppercase tracking-wider sm:tracking-widest text-accent">
                  Contact
                </h3>
                <div className="mt-3 sm:mt-4 flex flex-1 flex-col justify-between space-y-2 sm:space-y-0">
                  <ul className="flex flex-1 flex-col justify-between space-y-2 sm:space-y-0">
                    {SOCIALS.map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.to}
                          onClick={(e) => handleSocialClick(s, e)}
                          target={s.to.startsWith('http') ? '_blank' : '_self'}
                          rel={s.to.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="group inline-flex items-center text-xs sm:text-sm text-white/80 hover:text-accent transition duration-200"
                        >
                          <span className="font-medium group-hover:text-accent transition-colors whitespace-nowrap">
                            {s.label}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="border-t border-white/10">
            <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8 text-xs text-white/60 text-center">
              <p>© {new Date().getFullYear()} TheDiveVillage. A Brand of CAF Sourcing.</p>
            </div>
          </div>
        </div>
      </footer>

      <ViberQRModal
        isOpen={isViberQrOpen}
        onClose={() => setIsViberQrOpen(false)}
      />
    </>
  )
}
