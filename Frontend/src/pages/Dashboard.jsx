import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { useMyOrders } from '../hooks/useOrders'
import { formatCurrency } from '../utils/formatCurrency'

export default function Dashboard() {
  const { user } = useAuth()
  const { count: wishlistCount, items: wishlistItems } = useWishlist()
  const { itemCount: cartCount, subtotal: cartSubtotal, items: cartItems } = useCart()
  const { data: myOrders, loading: ordersLoading } = useMyOrders()

  const orderCount = Array.isArray(myOrders) ? myOrders.length : 0

  const stats = [
    {
      label: 'Orders',
      value: ordersLoading ? '...' : `${orderCount}`,
      subtext: orderCount === 1 ? '1 past order' : `${orderCount} past orders`,
      to: '/dashboard/orders',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      label: 'Wishlist',
      value: `${wishlistCount}`,
      subtext: wishlistCount === 1 ? '1 saved item' : `${wishlistCount} saved items`,
      to: '/dashboard/wishlist',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFCD00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      label: 'Cart',
      value: `${cartCount}`,
      subtext: cartCount > 0 ? formatCurrency(cartSubtotal) : '0 items in cart',
      to: '/dashboard/cart',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
    {
      label: 'Cert Progress',
      value: 'Active',
      subtext: 'PADI Diver & Programs',
      to: '/book-us',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-1 block">Diver Dashboard</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            Hello, {user?.displayName || 'Diver'}
          </h1>
          <p className="mt-1 text-sm text-white/70 font-medium">
            Welcome to your dive dashboard overview. Track your gear, wishlist, orders, and training.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            className="rounded-full bg-accent hover:bg-white text-navy px-5 py-2.5 text-xs font-extrabold transition shadow-md whitespace-nowrap"
          >
            Explore Shop →
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="group rounded-3xl bg-[#00223D]/80 hover:bg-[#002847] p-6 border border-white/10 hover:border-accent/40 transition-all duration-200 shadow-md flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-cyan-400/90 uppercase tracking-wider">{stat.label}</span>
              <div className="w-10 h-10 rounded-2xl bg-white/10 group-hover:bg-accent/20 flex items-center justify-center border border-white/10 transition">
                {stat.icon}
              </div>
            </div>

            <div>
              <p className="font-heading text-3xl font-bold text-white group-hover:text-accent transition">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-semibold text-white/60 flex items-center justify-between">
                <span>{stat.subtext}</span>
                <span className="group-hover:translate-x-1 text-accent transition-transform">→</span>
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Dynamic Sections */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Wishlist or Suggestions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>Saved in Wishlist</span>
              {wishlistCount > 0 && (
                <span className="rounded-full bg-accent text-[#001e3d] px-2.5 py-0.5 text-xs font-extrabold">
                  {wishlistCount}
                </span>
              )}
            </h2>
            <Link to="/dashboard/wishlist" className="text-xs font-bold text-cyan-400 hover:text-accent transition">
              View All →
            </Link>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="rounded-2xl bg-[#00223D]/80 border border-white/10 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 border border-white/10 text-accent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-white">Your wishlist is empty</p>
              <p className="text-xs text-white/60 mt-1 max-w-sm mx-auto mb-4">
                Explore our ocean gear, rash guards, and accessories, and tap the heart icon to save them here.
              </p>
              <Link
                to="/shop"
                className="inline-block rounded-full bg-accent hover:bg-white text-navy px-6 py-2.5 text-xs font-extrabold transition shadow-md"
              >
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#00223D]/80 border border-white/10 p-4 divide-y divide-white/10">
              {wishlistItems.slice(0, 3).map((item) => (
                <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <Link to={`/shop/${item.id}`} className="flex items-center gap-3 min-w-0 group">
                    <div className="w-14 h-14 rounded-xl bg-white/10 p-1 shrink-0 overflow-hidden flex items-center justify-center border border-white/10">
                      <img src={item.image} alt={item.title || item.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate group-hover:text-accent transition">
                        {item.title || item.name}
                      </p>
                      <p className="text-xs font-semibold text-cyan-400 mt-0.5">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </Link>

                  <Link
                    to={`/shop/${item.id}`}
                    className="shrink-0 rounded-full bg-white/10 border border-white/20 hover:!bg-accent hover:!text-navy hover:!border-accent text-white px-4 py-1.5 text-xs font-bold transition-all duration-200 shadow-sm cursor-pointer"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Cart Overview & Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>Current Cart</span>
              {cartCount > 0 && (
                <span className="rounded-full bg-accent text-[#001e3d] px-2.5 py-0.5 text-xs font-extrabold">
                  {cartCount}
                </span>
              )}
            </h2>
            <Link to="/dashboard/cart" className="text-xs font-bold text-cyan-400 hover:text-accent transition">
              View Cart →
            </Link>
          </div>

          <div className="rounded-2xl bg-[#00223D]/80 border border-white/10 p-6 space-y-4 shadow-inner">
            <div className="flex justify-between items-center text-sm font-semibold text-white/70 border-b border-white/10 pb-4">
              <span>Total Items</span>
              <span className="font-bold text-white">{cartCount}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-semibold text-white/70 border-b border-white/10 pb-4">
              <span>Estimated Subtotal</span>
              <span className="font-heading text-lg font-bold text-accent">{formatCurrency(cartSubtotal)}</span>
            </div>

            <div className="pt-2 space-y-2.5">
              {cartCount > 0 ? (
                <Link
                  to="/cart"
                  className="w-full text-center block rounded-full bg-accent hover:bg-white text-navy font-extrabold py-3 px-5 text-xs transition shadow-md"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <Link
                  to="/shop"
                  className="w-full text-center block rounded-full bg-accent hover:bg-white text-navy font-extrabold py-3 px-5 text-xs transition shadow-md"
                >
                  Discover New Arrivals
                </Link>
              )}
              <Link
                to="/book-us"
                className="w-full text-center block rounded-full bg-white/10 border border-white/20 hover:border-accent hover:bg-accent hover:text-navy text-white font-bold py-3 px-5 text-xs transition-all duration-200 shadow-sm cursor-pointer"
              >
                Book a Dive Experience
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}


