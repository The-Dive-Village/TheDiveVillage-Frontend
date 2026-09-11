import { Link } from 'react-router'
import footerLogoImg from '../assets/footer logo.png'

const QUICK = [
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/shop', label: 'Shop' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/book-us', label: 'Book Us' },
]

const LEGAL = [
  { to: '/contact', label: 'Privacy Policy' },
  { to: '/contact', label: 'Terms of Service' },
  { to: '/contact', label: 'Cancellation Policy' },
  { to: '/contact', label: 'Safety Guidelines' },
]

const SOCIALS = [
  { label: 'Instagram', to: '#', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
  { label: 'Facebook Messenger', to: 'https://m.me/IamSanjeevbajaj', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3.81l.39-4h-4.2V7a1 1 0 011-1h3z"/></svg> },
  { label: 'LinkedIn', to: '#', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg> },
  { label: 'YouTube', to: '#', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33 2.78 2.78 0 001.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg> },
  { label: 'WhatsApp', to: 'https://wa.me/918971001010', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg> },
]

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-white/20 text-white mt-auto relative z-10 pointer-events-auto">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col items-start justify-between">
          <div className="flex flex-col items-center w-fit">
            <Link to="/" className="inline-block transition duration-300 hover:opacity-90">
              <img
                src={footerLogoImg}
                alt="The Dive Village"
                className="h-24 sm:h-28 lg:h-32 xl:h-36 w-auto object-contain brightness-0 invert drop-shadow-md"
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

        <div className="flex flex-col">
          <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-accent">
            Quick Links
          </h3>
          <ul className="mt-4 flex flex-1 flex-col justify-between space-y-2.5 sm:space-y-0">
            {QUICK.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-sm text-white/80 transition duration-hover hover:text-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col">
          <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-accent">
            Legal
          </h3>
          <ul className="mt-4 flex flex-1 flex-col justify-between space-y-5 sm:space-y-0">
            {LEGAL.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-sm text-white/80 transition duration-hover hover:text-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col">
          <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-accent">
            Contact
          </h3>
          <ul className="mt-4 flex flex-col justify-start space-y-3 text-sm text-white/80">
            <li>
              <a href="tel:+918971001010" className="transition duration-hover hover:text-accent">
                +91 89710 01010
              </a>
            </li>
            <li>
              <a
                href="mailto:sanjeev.bajaj@thedivevillage.co"
                className="transition duration-hover hover:text-accent"
              >
                sanjeev.bajaj@thedivevillage.co
              </a>
            </li>
          </ul>

          {/* Social Media Icons under Contact Column */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.to}
                target={s.to.startsWith('http') ? '_blank' : '_self'}
                rel={s.to.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="w-9 h-9 rounded-full bg-white/10 hover:!bg-[#FFCD00] text-white/80 hover:!text-[#001e3d] flex items-center justify-center transition-all duration-200 border border-white/15 hover:!border-[#FFCD00] shadow-sm"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
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
  )
}
