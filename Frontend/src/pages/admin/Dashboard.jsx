import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import SectionReveal from '../../components/SectionReveal'
import { useReviews } from '../../contexts/ReviewsContext'
import SafeImage from '../../components/SafeImage'
import { bookingService } from '../../services/bookingService'
import { productService } from '../../services/productService'
import { contentService } from '../../services/contentService'

export default function AdminDashboard() {
  const { pendingReviews, approvedReviews, approveReview, deleteReview } = useReviews()
  const [activeTab, setActiveTab] = useState('pending')

  // Live DB Stats
  const [stats, setStats] = useState({
    pendingBookings: 0,
    totalBookings: 0,
    totalProducts: 0,
    totalGallery: 0,
    totalFaqs: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [bookingsRes, productsRes, galleryRes, faqsRes] = await Promise.allSettled([
          bookingService.getBookings(),
          productService.getProducts({ includeInactive: 'true' }),
          contentService.getGallery({ includeInactive: 'true' }),
          contentService.getFaqs({ includeInactive: 'true' }),
        ])

        const bookings = bookingsRes.status === 'fulfilled' ? bookingsRes.value?.data?.data || [] : []
        const products = productsRes.status === 'fulfilled' ? productsRes.value?.data?.data || [] : []
        const gallery = galleryRes.status === 'fulfilled' ? galleryRes.value?.data?.data || [] : []
        const faqs = faqsRes.status === 'fulfilled' ? faqsRes.value?.data?.data || [] : []

        setStats({
          pendingBookings: bookings.filter((b) => b.status === 'PENDING').length,
          totalBookings: bookings.length,
          totalProducts: products.length,
          totalGallery: gallery.length,
          totalFaqs: faqs.length,
        })
      } catch (err) {
        console.error('Failed to load dashboard stats:', err)
      } finally {
        setLoadingStats(false)
      }
    }
    loadStats()
  }, [])

  return (
    <SectionReveal className="space-y-8">
      {/* 1. Header Banner */}
      <div className="rounded-[32px] bg-gradient-to-r from-[#001e3d]/90 via-[#002b54]/85 to-[#001428]/90 border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-accent uppercase tracking-wider mb-3 border border-white/15">
              <span>Overview & Analytics</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Admin <span className="text-[#FFCD00]">Dashboard</span>
            </h1>
            <p className="text-white/70 text-xs sm:text-sm mt-1 max-w-xl">
              Real-time monitoring of active bookings, gear inventory, website content, and guest testimonials.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md px-4 py-2.5 border border-white/15 text-right">
              <span className="text-[10px] uppercase font-bold text-white/50 block">Status</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live & Operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Pending Bookings */}
        <Link
          to="/admin/orders"
          className="group rounded-3xl bg-[#001e3d]/75 backdrop-blur-xl border border-white/15 hover:border-cyan-400/50 p-6 shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Pending Bookings
            </span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-400/10 text-cyan-300 flex items-center justify-center border border-cyan-400/20 group-hover:scale-110 transition duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-4xl font-bold text-white">
              {loadingStats ? '—' : stats.pendingBookings}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-400/15 text-cyan-200 font-bold border border-cyan-400/20">
              Total {stats.totalBookings}
            </span>
          </div>
        </Link>

        {/* Catalog Products */}
        <Link
          to="/admin/catalog"
          className="group rounded-3xl bg-[#001e3d]/75 backdrop-blur-xl border border-white/15 hover:border-emerald-400/50 p-6 shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Gear & Catalog
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-400/10 text-emerald-300 flex items-center justify-center border border-emerald-400/20 group-hover:scale-110 transition duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-4xl font-bold text-white">
              {loadingStats ? '—' : stats.totalProducts}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-200 font-bold border border-emerald-400/20">
              Live Items
            </span>
          </div>
        </Link>

        {/* Gallery Media */}
        <Link
          to="/admin/content"
          className="group rounded-3xl bg-[#001e3d]/75 backdrop-blur-xl border border-white/15 hover:border-[#FFCD00]/50 p-6 shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFCD00]">
              Gallery Media
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FFCD00]/10 text-[#FFCD00] flex items-center justify-center border border-[#FFCD00]/20 group-hover:scale-110 transition duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-4xl font-bold text-white">
              {loadingStats ? '—' : stats.totalGallery}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#FFCD00]/15 text-[#FFCD00] font-bold border border-[#FFCD00]/20">
              Media Assets
            </span>
          </div>
        </Link>

        {/* FAQs & CMS */}
        <Link
          to="/admin/content"
          className="group rounded-3xl bg-[#001e3d]/75 backdrop-blur-xl border border-white/15 hover:border-purple-400/50 p-6 shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Active FAQs
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-400/10 text-purple-300 flex items-center justify-center border border-purple-400/20 group-hover:scale-110 transition duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-4xl font-bold text-white">
              {loadingStats ? '—' : stats.totalFaqs}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-400/15 text-purple-200 font-bold border border-purple-400/20">
              CMS Articles
            </span>
          </div>
        </Link>
      </div>

      {/* 3. Review Moderation Panel */}
      <div className="rounded-[32px] bg-[#001e3d]/80 backdrop-blur-xl border border-white/15 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFCD00]">Moderation</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Guest Reviews Moderation
            </h2>
            <p className="text-xs text-white/60 mt-1">Approve community feedback before displaying it on the live website.</p>
          </div>

          <div className="flex gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-[#FFCD00] text-[#001e3d] shadow-md font-extrabold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Pending Approval ({pendingReviews.length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'approved'
                  ? 'bg-[#FFCD00] text-[#001e3d] shadow-md font-extrabold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Live on Site ({approvedReviews.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'pending' && (
          <div>
            {pendingReviews.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-white mb-1">All Caught Up!</h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto">
                  There are no pending visitor reviews waiting for review. New guest submissions will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#FFCD00]/40 shrink-0 bg-navy">
                        <SafeImage src={rev.image} alt={rev.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h4 className="font-bold text-white text-sm sm:text-base">{rev.name}</h4>
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-medium">
                            {rev.role}
                          </span>
                          <span className="text-[11px] text-white/40">{rev.createdAt}</span>
                        </div>
                        <div className="flex gap-1 text-[#FFCD00] text-sm">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm text-white/90 italic pt-0.5 leading-relaxed break-words">
                          "{rev.text}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                      <button
                        onClick={() => approveReview(rev.id)}
                        className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <span>✓ Approve & Publish</span>
                      </button>
                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="px-4 py-2.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs border border-red-500/30 transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'approved' && (
          <div className="space-y-4">
            {approvedReviews.map((rev) => (
              <div
                key={rev.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-white/[0.03] border border-white/10"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-emerald-400/40 shrink-0 bg-navy">
                    <SafeImage src={rev.image} alt={rev.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h4 className="font-bold text-white text-sm sm:text-base">{rev.name}</h4>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        Live on Site
                      </span>
                    </div>
                    <div className="flex gap-1 text-[#FFCD00] text-sm">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-white/90 italic pt-0.5 leading-relaxed break-words">
                      "{rev.text}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => deleteReview(rev.id)}
                    className="px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs border border-red-500/30 transition cursor-pointer"
                  >
                    Remove Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionReveal>
  )
}
