import { useState } from 'react'
import { Link } from 'react-router'
import footerLogoImg from '../assets/footer logo.png'
import ViberQRModal from './ViberQRModal'

const QUICK = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/book-us', label: 'Book Us' },
  { to: '/services', label: 'Services' },
  { to: '/dive-explorer', label: 'Dive Explorer' },
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
  { label: 'Facebook Messenger', to: 'https://m.me/IamSanjeevbajaj', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3.81l.39-4h-4.2V7a1 1 0 011-1h3z"/></svg> },
  { label: 'LinkedIn', to: 'https://www.linkedin.com/in/sanjeev-bajaj-caf-sourcing-b6a35b12', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { label: 'YouTube', to: '#', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33 2.78 2.78 0 001.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg> },
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

          {/* Desktop: 3 Columns on same row (Quick Links, Legal, Contact). Mobile: Quick Links & Legal on top row, Contact below Quick Links */}
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
                {/* Social Media Vertical List */}
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

        {/* Bottom Copyright Bar without social icons */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8 text-xs text-white/60 text-center">
            <p>© {new Date().getFullYear()} TheDiveVillage. A Brand of CAF Sourcing.</p>
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
