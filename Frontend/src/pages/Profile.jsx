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
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-heading text-3xl font-bold text-navy">
          Not Logged In
        </h1>
        <p className="mt-2 text-navy/70 font-medium">
          Please sign in to view your profile and account settings.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="mt-6 rounded-full bg-black px-8 py-4 text-sm font-bold text-white transition hover:bg-black/80"
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="space-y-10">
        
        {/* Main User Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pb-10 border-b border-navy/10">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User Profile'}
              className="h-28 w-28 rounded-full border border-navy/10 object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[#F0F2F5] font-heading text-4xl font-bold text-navy border border-navy/5">
              {(user.displayName || user.email || 'D')[0].toUpperCase()}
            </div>
          )}

          <div className="flex-1 text-center sm:text-left pt-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
              <h1 className="font-heading text-3xl font-bold text-navy">
                {user.displayName || 'Diver'}
              </h1>
              <span className="rounded-full bg-navy text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                {role || 'Customer'}
              </span>
              {user.emailVerified && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                  <svg className="h-3 w-3 fill-emerald-600" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-navy/60 mb-2">{user.email}</p>
            <p className="text-xs text-navy/40 font-mono tracking-wider uppercase">ID: {user.uid}</p>
          </div>
        </div>

        {/* Detailed Metadata Cards */}
        <div>
          <h2 className="font-heading text-lg font-bold text-navy mb-4">Account Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#F0F2F5] p-5 border border-navy/5">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-navy/50">Auth Provider</span>
              <span className="mt-1 block font-heading text-base font-bold text-navy capitalize">
                {user.providerId === 'google.com' ? 'Google Account' : user.providerId || 'Password'}
              </span>
            </div>

            <div className="rounded-2xl bg-[#F0F2F5] p-5 border border-navy/5">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-navy/50">Email Status</span>
              <span className={`mt-1 block font-heading text-base font-bold ${user.emailVerified ? 'text-emerald-700' : 'text-amber-600'}`}>
                {user.emailVerified ? 'Verified Account' : 'Unverified'}
              </span>
            </div>

            {user.creationTime && (
              <div className="rounded-2xl bg-[#F0F2F5] p-5 border border-navy/5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-navy/50">Member Since</span>
                <span className="mt-1 block font-heading text-base font-bold text-navy">
                  {new Date(user.creationTime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            )}

            {user.lastSignInTime && (
              <div className="rounded-2xl bg-[#F0F2F5] p-5 border border-navy/5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-navy/50">Last Active</span>
                <span className="mt-1 block font-heading text-base font-bold text-navy">
                  {new Date(user.lastSignInTime).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-6 border-t border-navy/10 flex justify-end">
          <button
            onClick={handleLogout}
            className="rounded-full bg-white border-2 border-navy/20 hover:border-navy hover:bg-navy hover:text-white px-8 py-3.5 text-sm font-bold text-navy transition-all duration-200 shadow-xs cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
