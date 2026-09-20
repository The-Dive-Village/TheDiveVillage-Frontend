import { NavLink, Outlet, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/catalog', label: 'Catalog CMS', icon: '🛍️' },
  { to: '/admin/orders', label: 'Orders & Bookings', icon: '📋' },
  { to: '/admin/customers', label: 'Customer Directory', icon: '👥' },
  { to: '/admin/content', label: 'Site Content & CMS', icon: '✏️' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-[#001021] text-white font-body selection:bg-accent selection:text-navy">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-[#001a35]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-sm font-bold">
              ⚡
            </span>
            <span className="font-heading text-lg font-bold text-white tracking-wide">
              TDV <span className="text-[#FFCD00]">CMS Admin</span>
            </span>
          </Link>
          <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            System Live
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/70">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Logged in as <strong className="text-white">{user?.displayName || user?.email || 'Administrator'}</strong></span>
          </div>

          <Link
            to="/"
            className="text-xs font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 transition"
          >
            🌐 View Site
          </Link>

          <button
            onClick={logout}
            className="text-xs font-bold text-red-300 hover:text-red-200 bg-red-500/10 hover:bg-red-500/20 px-3.5 py-1.5 rounded-full border border-red-500/20 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-64 space-y-4">
          <div className="rounded-3xl bg-[#001e3d]/80 backdrop-blur-xl border border-white/15 p-4 shadow-xl">
            <div className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-[#FFCD00]">
              CMS Management
            </div>
            <nav className="space-y-1">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 font-heading text-xs sm:text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-accent text-navy shadow-md font-extrabold scale-[1.02]'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <span className="text-base">{l.icon}</span>
                  <span>{l.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
