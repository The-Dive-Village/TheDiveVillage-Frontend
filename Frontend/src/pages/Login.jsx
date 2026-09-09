import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { IMAGES } from '../utils/images'
import vid2 from '../assets/2.mp4'

export default function Login() {
  const navigate = useNavigate()
  const { login, loginWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const u = await login(email, password)
      if (email === 'admin@tdv.com' || u?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard/profile')
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/dashboard/profile')
    } catch (err) {
      setError(err.message || 'Google sign-in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] text-navy font-body relative">
      
      {/* Left side - Background Video (hidden on mobile) */}
      <div className="hidden lg:block lg:w-[62%] relative bg-navy overflow-hidden">
        <video src={vid2} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent pointer-events-none" />
        
        {/* Return to Home on Video Side */}
        <Link
          to="/"
          className="absolute top-8 left-8 z-20 inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 px-5 py-2.5 text-xs font-bold text-white uppercase tracking-wider hover:bg-white hover:text-navy transition duration-300 shadow-lg"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          <span>Return to Home</span>
        </Link>

        <div className="absolute bottom-16 left-16 max-w-lg pointer-events-none z-10">
          <h2 className="font-heading text-5xl font-bold text-white leading-tight mb-4 text-balance drop-shadow-md">
            Welcome back to the deep blue.
          </h2>
          <p className="text-white/80 font-medium drop-shadow-sm">Log in to access your dashboard, bookings, and gear history.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-[38%] flex items-center justify-center p-6 sm:p-12 lg:p-12 relative">
        <div className="w-full max-w-md">
          
          {/* Mobile Return to Home */}
          <div className="mb-6 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-navy/70 hover:text-navy transition">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              <span>Return to Home</span>
            </Link>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-navy tracking-tight mb-3">Sign In</h1>
            <p className="text-navy/60 text-sm font-medium">Enter your details to proceed.</p>
          </div>

          {error && (
            <div className="mb-8 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700 border border-red-100">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-bold text-navy/70">Email Address</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 text-sm text-navy outline-none focus:ring-2 focus:ring-accent/50 transition placeholder:text-navy/30"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-navy/70">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-navy hover:text-accent transition">Forgot?</Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl bg-[#F0F2F5] px-5 py-4 text-sm text-navy outline-none focus:ring-2 focus:ring-accent/50 transition placeholder:text-navy/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black px-8 py-4 text-sm font-bold text-white transition hover:bg-black/80 disabled:opacity-50 mt-4"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-navy/10" />
            </div>
            <span className="relative bg-[#FAFAFA] px-4 text-xs font-bold uppercase tracking-wider text-navy/40">
              Or continue with
            </span>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 rounded-full bg-white border border-navy/10 px-8 py-4 text-sm font-bold text-navy transition hover:bg-slate-50 disabled:opacity-50 shadow-sm"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            Google
          </button>

          <p className="mt-10 text-center text-sm font-medium text-navy/70">
            New here?{' '}
            <Link to="/signup" className="font-bold text-navy hover:text-accent transition">
              Create an account
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}
