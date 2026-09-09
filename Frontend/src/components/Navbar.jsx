import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { useAuth } from '../hooks/useAuth'
import { prefetchRoute } from '../utils/routePrefetcher'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/shop', label: 'Shop' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/book-us', label: 'Book Us', highlight: true },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [isCallModalOpen, setIsCallModalOpen] = useState(false)
  const { itemCount } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { isAuthenticated, user } = useAuth()
  const reduce = useReducedMotion()

  const location = useLocation()
  const [isNightDive, setIsNightDive] = useState(false)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsNightDive(document.body.classList.contains('night-dive'))
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    setIsNightDive(document.body.classList.contains('night-dive'))
    return () => observer.disconnect()
  }, [])

  const toggleNightDive = () => {
    const isNight = document.body.classList.contains('night-dive')
    if (isNight) {
      document.body.classList.remove('night-dive')
      setIsNightDive(false)
    } else {
      document.body.classList.add('night-dive')
      setIsNightDive(true)
    }
  }

  const isVideoBg = ['/', '/login', '/contact'].includes(location.pathname)
  const isDarkBackground = isVideoBg || isNightDive

  const textColor = isDarkBackground ? 'text-white' : 'text-navy'
  const hoverText = isDarkBackground ? 'hover:text-white' : 'hover:text-navy'
  const textMuted = isDarkBackground ? 'text-white/70' : 'text-navy/70'
  const borderColor = isDarkBackground ? 'border-white/20' : 'border-navy/20'
  const hoverBg = isDarkBackground ? 'hover:bg-white/10' : 'hover:bg-navy/5'
  const bgSoft = isDarkBackground ? 'bg-transparent' : 'bg-transparent'

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] w-full px-2 sm:px-4 lg:px-6 pointer-events-none flex flex-col items-center">
      <div className={`pointer-events-auto mx-auto grid grid-cols-[1fr_auto_1fr] h-[58px] sm:h-[64px] lg:h-[68px] w-full max-w-7xl 2xl:max-w-[1700px] items-center px-4 sm:px-8 lg:px-12 rounded-full border shadow-[0_12px_40px_rgba(0,18,32,0.7)] transition-all duration-300 ${
        location.pathname === '/'
          ? 'bg-[#001e3d]/80 backdrop-blur-xl backdrop-saturate-150 border-cyan-400/30'
          : 'bg-[#00223D]/90 backdrop-blur-xl backdrop-saturate-150 border-cyan-400/30 shadow-[0_12px_40px_rgba(0,18,32,0.6)]'
      }`}>
        
        {/* Left Side: Home, Book Us, Contact Us */}
        <div className="flex items-center justify-start gap-4 lg:gap-8 pl-1 sm:pl-2">
          <NavLink
            to="/"
            end
            onMouseEnter={() => prefetchRoute('/')}
            onTouchStart={() => prefetchRoute('/')}
            className={({ isActive }) =>
              `relative whitespace-nowrap font-body text-[14px] sm:text-[15px] font-bold tracking-wide transition-all duration-300 ${
                isActive 
                  ? 'text-accent after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-accent' 
                  : 'text-white hover:text-accent after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-accent after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/book-us"
            onMouseEnter={() => prefetchRoute('/book-us')}
            onTouchStart={() => prefetchRoute('/book-us')}
            className={({ isActive }) =>
              `relative whitespace-nowrap font-body text-[14px] sm:text-[15px] font-bold tracking-wide transition-all duration-300 ${
                isActive 
                  ? 'text-accent after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-accent' 
                  : 'text-white hover:text-accent after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-accent after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300'
              }`
            }
          >
            Book Us
            <span className="absolute -top-1 -right-2.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
          </NavLink>
          <NavLink
            to="/contact"
            onMouseEnter={() => prefetchRoute('/contact')}
            onTouchStart={() => prefetchRoute('/contact')}
            className={({ isActive }) =>
              `hidden lg:block relative whitespace-nowrap font-body text-[14px] sm:text-[15px] font-bold tracking-wide transition-all duration-300 ${
                isActive 
                  ? 'text-accent after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-accent' 
                  : 'text-white hover:text-accent after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-accent after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300'
              }`
            }
          >
            Contact Us
          </NavLink>
        </div>

        {/* Middle: Logo (Absolute Center) */}
        <div className="flex justify-center items-center px-3 shrink-0">
          <Logo light={true} compact={true} className="[&>img]:h-9 sm:[&>img]:h-11 lg:[&>img]:h-13" />
        </div>

        {/* Right Side: Phone, Night toggle, profile, menu */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3 pr-1 sm:pr-2">

          <button
            type="button"
            onClick={() => setIsCallModalOpen(true)}
            className="flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-xl border border-cyan-400/30 bg-[#001e3d]/50 px-3 text-white transition duration-hover hover:bg-cyan-500/20 hover:border-cyan-400 cursor-pointer shadow-sm"
            aria-label="Call & Contact Options"
          >
            <PhoneIcon />
            <span className="hidden xl:inline text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap">Get In Touch</span>
          </button>

          <button
            type="button"
            onClick={toggleNightDive}
            className="flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-xl border border-cyan-400/30 bg-[#001e3d]/50 px-3 text-white transition duration-hover hover:bg-cyan-500/20 hover:border-cyan-400 shrink-0 cursor-pointer shadow-sm"
            aria-label="Toggle Night Dive mode"
          >
            <ThemeToggle isNightDive={isNightDive} />
            <span className="hidden sm:inline text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap select-none">
              {isNightDive ? 'Day Dive' : 'Night Dive'}
            </span>
          </button>

          <Link
            to={isAuthenticated ? '/dashboard/profile' : '/login'}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-[#001e3d]/50 text-white transition duration-hover hover:bg-cyan-500/20 hover:border-cyan-400 shrink-0 shadow-sm"
            aria-label={isAuthenticated ? 'Account' : 'Login'}
            title={user?.displayName || user?.email || 'Account'}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Profile'}
                className="h-5 w-5 rounded-full object-cover shrink-0"
              />
            ) : (
              <UserIcon />
            )}
          </Link>

          <button
            type="button"
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-[#001e3d]/50 text-white transition duration-hover hover:bg-cyan-500/20 hover:border-cyan-400 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto mt-2 w-full max-w-7xl 2xl:max-w-[1700px] overflow-hidden rounded-3xl border border-cyan-400/30 shadow-2xl bg-[#001e3d]/95 backdrop-blur-3xl text-white"
          >
            <div className="px-6 py-4">
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onMouseEnter={() => prefetchRoute(item.to)}
                    onTouchStart={() => prefetchRoute(item.to)}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-3 font-heading text-[15px] font-bold transition duration-hover ${
                        item.highlight
                          ? 'bg-accent/20 text-accent'
                          : isActive
                          ? (isDarkBackground ? 'bg-white/10 text-white' : 'bg-navy/5 text-navy')
                          : `${textColor} ${hoverBg}`
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <button
                  onClick={() => {
                    setOpen(false)
                    setIsCallModalOpen(true)
                  }}
                  className={`rounded-xl px-4 py-3 font-heading text-[15px] font-bold transition duration-hover text-left flex items-center gap-2 text-accent bg-accent/10`}
                >
                  <PhoneIcon />
                  Call / Connect Options
                </button>
                <button 
                  onClick={() => {
                    toggleNightDive()
                    setOpen(false)
                  }}
                  className={`rounded-xl px-4 py-3 font-heading text-[15px] font-bold transition duration-hover text-left ${textColor} ${hoverBg}`}
                >
                  {isNightDive ? '☀️ Switch to Day Dive' : '🌙 Switch to Night Dive'}
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CallModal isOpen={isCallModalOpen} onClose={() => setIsCallModalOpen(false)} />
    </header>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3h3l1.5 5-2 1.5a12 12 0 005 5L16 13l5 1.5V18a2 2 0 01-2 2A15 15 0 015 5a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h2l2.2 10h9.6L20 8H8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.4" fill="currentColor" />
      <circle cx="17" cy="20" r="1.4" fill="currentColor" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CallModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const options = [
    {
      id: 'phone',
      title: 'Phone Call',
      subtitle: '+91 89710 01010',
      href: 'tel:+918971001010',
      icon: (
        <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      id: 'email',
      title: 'Mail',
      subtitle: 'sanjeev.bajaj@thedivevillage.co',
      href: 'mailto:sanjeev.bajaj@thedivevillage.co',
      icon: (
        <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Message',
      subtitle: 'Instant Chat (+91 89710 01010)',
      href: 'https://wa.me/918971001010',
      icon: (
        <svg className="w-5 h-5 text-navy" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      )
    },
    {
      id: 'messenger',
      title: 'Facebook Messenger',
      subtitle: 'Message us on Facebook',
      href: '#',
      icon: (
        <svg className="w-5 h-5 text-navy" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.074-2.238c1.099.304 2.262.47 3.454.47 6.627 0 12-4.975 12-11.121C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.259 5.889-3.259-6.56 6.963z"/>
        </svg>
      )
    },
    {
      id: 'viber',
      title: 'Viber',
      subtitle: 'Connect via Viber (+91 89710 01010)',
      href: '#',
      icon: (
        <svg className="w-5 h-5 text-navy" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.39 14.88c-.64-.26-3.76-1.85-4.35-2.07-.59-.22-1.02-.33-1.45.33-.43.66-1.68 2.07-2.07 2.51-.39.44-.78.5-1.42.22-3.64-1.57-6.03-5.26-6.42-5.92-.39-.66.39-.66 1.13-2.14.15-.3.07-.56-.04-.78-.11-.22-.98-2.36-1.34-3.23-.35-.85-.71-.73-1-.75l-.85-.02c-.3 0-.78.11-1.19.56-.41.45-1.56 1.52-1.56 3.71 0 2.19 1.6 4.31 1.82 4.61.22.3 3.15 4.81 7.63 6.75 3.7 1.6 4.45 1.28 5.25 1.2.8-.08 2.57-1.05 2.93-2.07.36-1.02.36-1.89.25-2.07-.11-.18-.41-.29-1.05-.55z"/>
        </svg>
      )
    }
  ]

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-navy/10 z-10 text-navy pointer-events-auto max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-navy/10 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60 block">Get in Touch</span>
                <h3 className="font-heading text-2xl font-bold text-navy">Connect With Us</h3>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                className="w-9 h-9 rounded-full bg-navy/5 text-navy font-bold flex items-center justify-center hover:bg-navy hover:text-white transition cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Options Grid */}
            <div className="space-y-3">
              {options.map((opt) => (
                <a
                  key={opt.id}
                  href={opt.href || '#'}
                  target={opt.id === 'whatsapp' ? '_blank' : '_self'}
                  rel={opt.id === 'whatsapp' ? 'noopener noreferrer' : undefined}
                  onClick={(e) => {
                    if (!opt.href || opt.href === '#') {
                      e.preventDefault()
                    }
                    onClose()
                  }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-navy/5 hover:bg-navy/10 border border-navy/10 transition duration-200 group shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-navy/10 flex items-center justify-center shadow-sm shrink-0">
                      {opt.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-navy text-sm group-hover:text-black transition-colors">{opt.title}</h4>
                      <p className="text-xs text-navy/70 font-medium">{opt.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-navy/40 group-hover:text-navy group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}


