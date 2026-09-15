import { NavLink, Outlet } from 'react-router'

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/catalog', label: 'Catalog' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/content', label: 'Content' },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-white/10 backdrop-blur-md border border-white/20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:px-8">
        <aside className="w-full shrink-0 lg:w-56">
          <div className="mb-3 px-1 font-heading text-xs font-bold uppercase tracking-widest text-cta">
            Admin
          </div>
          <nav className="rounded-card border border-white/20 bg-white/10 backdrop-blur-md border border-white/20 p-3 shadow-soft">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `mb-1 block rounded-xl px-4 py-2.5 font-heading text-sm font-semibold transition duration-hover ${
                    isActive ? 'bg-navy text-white' : 'text-white hover:bg-transparent'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
