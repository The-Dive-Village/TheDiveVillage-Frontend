import { NavLink, Outlet } from 'react-router'
import Navbar from '../components/Navbar'

const LINKS = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/profile', label: 'Profile' },
  { to: '/dashboard/orders', label: 'Orders' },
  { to: '/dashboard/wishlist', label: 'Wishlist' },
  { to: '/dashboard/cart', label: 'Cart' },
]

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-body text-navy pt-24" style={{ textShadow: 'none' }}>
      <Navbar />
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:px-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full shrink-0 lg:w-64">
          <nav className="rounded-3xl bg-white border border-navy/5 p-4 shadow-sm sticky top-32">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `mb-2 block rounded-2xl px-5 py-3 text-sm font-bold transition duration-hover ${
                    isActive ? 'bg-[#F0F2F5] text-navy' : 'text-navy/60 hover:bg-[#F0F2F5] hover:text-navy'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="min-w-0 flex-1">
          <div className="rounded-3xl bg-white border border-navy/5 p-8 lg:p-12 shadow-sm min-h-[60vh]">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  )
}
