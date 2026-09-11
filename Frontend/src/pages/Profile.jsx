import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { formatCurrency } from '../utils/formatCurrency'

export default function Profile() {
  const navigate = useNavigate()
  const { user, role, logout } = useAuth()
  const { items: cartItems, itemCount, subtotal } = useCart()
  const { count: wishlistCount } = useWishlist()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg text-center py-12">
        <h1 className="font-heading text-3xl font-bold text-white">
          Not Logged In
        </h1>
        <p className="mt-2 text-white/70 font-medium">
          Please sign in to view your profile and account settings.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="mt-6 rounded-full bg-accent hover:bg-white text-navy px-8 py-4 text-sm font-bold transition shadow-md cursor-pointer"
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl text-white">
      <div className="space-y-10">
        
        {/* Main User Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pb-10 border-b border-white/10">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User Profile'}
              className="h-28 w-28 rounded-full border-2 border-accent/40 object-cover shadow-md"
            />
          ) : (
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[#00223D] font-heading text-4xl font-bold text-accent border-2 border-accent/30 shadow-md">
              {(user.displayName || user.email || 'D')[0].toUpperCase()}
            </div>
          )}

          <div className="flex-1 text-center sm:text-left pt-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">
                {user.displayName || 'Diver'}
              </h1>
              <span className="rounded-full bg-accent text-[#001e3d] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                {role || 'Customer'}
              </span>
              {user.emailVerified && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-400/30">
                  <svg className="h-3 w-3 fill-emerald-400" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-white/80 mb-2">{user.email}</p>
            <p className="text-xs text-cyan-400/80 font-mono tracking-wider uppercase">ID: {user.uid}</p>
          </div>
        </div>

        {/* Detailed Metadata Cards */}
        <div>
          <h2 className="font-heading text-xl font-bold text-white mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Account Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#00223D]/80 p-5 border border-white/10 hover:border-cyan-400/30 transition-all shadow-inner">
              <span className="block text-[10px] font-extrabold uppercase tracking-widest text-cyan-400/90">Auth Provider</span>
              <span className="mt-1.5 block font-heading text-base font-bold text-white capitalize">
                {user.providerId === 'google.com' ? 'Google Account' : user.providerId || 'Password'}
              </span>
            </div>

            <div className="rounded-2xl bg-[#00223D]/80 p-5 border border-white/10 hover:border-cyan-400/30 transition-all shadow-inner">
              <span className="block text-[10px] font-extrabold uppercase tracking-widest text-cyan-400/90">Email Status</span>
              <span className={`mt-1.5 block font-heading text-base font-bold ${user.emailVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                {user.emailVerified ? 'Verified Account' : 'Unverified'}
              </span>
            </div>

            {user.creationTime && (
              <div className="rounded-2xl bg-[#00223D]/80 p-5 border border-white/10 hover:border-cyan-400/30 transition-all shadow-inner">
                <span className="block text-[10px] font-extrabold uppercase tracking-widest text-cyan-400/90">Member Since</span>
                <span className="mt-1.5 block font-heading text-base font-bold text-white">
                  {new Date(user.creationTime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            )}

            {user.lastSignInTime && (
              <div className="rounded-2xl bg-[#00223D]/80 p-5 border border-white/10 hover:border-cyan-400/30 transition-all shadow-inner">
                <span className="block text-[10px] font-extrabold uppercase tracking-widest text-cyan-400/90">Last Active</span>
                <span className="mt-1.5 block font-heading text-base font-bold text-white">
                  {new Date(user.lastSignInTime).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-6 border-t border-white/10 flex justify-end">
          <button
            onClick={handleLogout}
            className="rounded-full bg-white/10 border border-white/20 hover:!bg-[#FFCD00] hover:!text-[#001e3d] hover:!border-[#FFCD00] px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 shadow-md cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
