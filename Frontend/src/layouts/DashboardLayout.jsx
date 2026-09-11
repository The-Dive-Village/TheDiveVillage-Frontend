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
    <div className="min-h-screen bg-[#021426] font-body text-white pt-24" style={{ textShadow: 'none' }}>
      <Navbar />
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:px-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full shrink-0 lg:w-64">
          <nav className="rounded-3xl bg-[#003865] border border-white/15 p-4 shadow-card sticky top-32 backdrop-blur-xl">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `mb-2 block rounded-2xl px-5 py-3 text-sm font-bold transition duration-200 ${
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
          <div className="rounded-3xl bg-[#003865] border border-white/15 p-8 lg:p-12 shadow-card min-h-[60vh] backdrop-blur-xl text-white">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  )
}
