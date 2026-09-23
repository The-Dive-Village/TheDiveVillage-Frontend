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
    <div className="min-h-screen bg-[#021426] font-body text-white pt-20 sm:pt-28 pb-12 sm:pb-16" style={{ textShadow: 'none' }}>
      <Navbar />
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:gap-8 px-3 sm:px-6 lg:flex-row lg:px-8">
        
        {/* Navigation Tabs (Horizontal Pill Bar on Mobile, Sticky Sidebar on Desktop) */}
        <aside className="w-full shrink-0 lg:w-64">
          <nav className="rounded-2xl sm:rounded-3xl bg-[#003865]/90 border border-white/15 p-1.5 sm:p-4 shadow-card sticky top-20 sm:top-28 lg:top-32 backdrop-blur-xl z-20 overflow-x-auto no-scrollbar flex flex-row lg:flex-col gap-1.5 sm:gap-2">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `shrink-0 whitespace-nowrap rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold transition duration-200 ${
                    isActive 
                      ? 'bg-accent text-[#001e3d] shadow-md font-extrabold' 
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content Area in Brand Blue */}
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl sm:rounded-3xl bg-[#003865]/90 border border-white/15 p-4 sm:p-8 lg:p-12 shadow-card min-h-[50vh] sm:min-h-[60vh] backdrop-blur-xl text-white">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  )
}
