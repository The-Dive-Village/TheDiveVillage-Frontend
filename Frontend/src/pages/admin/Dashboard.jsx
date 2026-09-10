import { useState, useEffect } from 'react'
import SectionReveal from '../../components/SectionReveal'
import { useReviews } from '../../contexts/ReviewsContext'
import SafeImage from '../../components/SafeImage'
import { bookingService } from '../../services/bookingService'
import { productService } from '../../services/productService'
import { contentService } from '../../services/contentService'

export default function AdminDashboard() {
  const { reviews, pendingReviews, approvedReviews, approveReview, deleteReview } = useReviews()
  const [activeTab, setActiveTab] = useState('pending')

  // Live DB Stats
  const [stats, setStats] = useState({
    pendingBookings: 0,
    totalBookings: 0,
    totalProducts: 0,
    totalGallery: 0,
    totalFaqs: 0,
  })

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
      }
    }
    loadStats()
  }, [])

  return (
    <SectionReveal className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
          Admin <em className="italic text-[#FFCD00]">Dashboard</em>
        </h1>
        <p className="text-white/70 text-sm">Real-time overview of bookings, products, CMS content, and visitor reviews.</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/10 p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Pending Bookings
            </span>
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-3xl font-bold text-white">{stats.pendingBookings}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
              Total {stats.totalBookings}
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/10 p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Products
            </span>
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-3xl font-bold text-white">{stats.totalProducts}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              Live Catalog
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/10 p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Gallery Media
            </span>
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-3xl font-bold text-white">{stats.totalGallery}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
              Photos & Videos
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/10 p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Active FAQs
            </span>
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-3xl font-bold text-white">{stats.totalFaqs}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
              CMS Managed
            </span>
          </div>
        </div>
      </div>

      {/* Review Moderation Panel */}
      <div className="rounded-3xl bg-navy/80 border border-white/20 p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-6 mb-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-white">Review Moderation Panel</h2>
            <p className="text-xs text-white/60 mt-1">Approve submitted reviews to make them visible on the main website.</p>
          </div>

          <div className="flex gap-2 bg-white/10 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'pending'
                  ? 'bg-[#FFCD00] text-navy shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Pending ({pendingReviews.length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'approved'
                  ? 'bg-[#FFCD00] text-navy shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Approved ({approvedReviews.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'pending' && (
          <div>
            {pendingReviews.length === 0 ? (
              <div className="text-center py-12 text-white/60 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <p className="text-base font-bold text-white mb-1">🎉 All Caught Up!</p>
                <p className="text-xs">There are no pending visitor reviews waiting for approval.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FFCD00]/50 shrink-0">
                        <SafeImage src={rev.image} alt={rev.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-white text-base">{rev.name}</h4>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white/70">
                            {rev.role}
                          </span>
                          <span className="text-xs text-white/40">{rev.createdAt}</span>
                        </div>
                        <div className="flex gap-1 text-[#FFCD00]">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <p className="text-sm text-white/90 italic pt-1">"{rev.text}"</p>
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
                        className="px-4 py-2.5 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 font-bold text-xs border border-red-500/30 transition cursor-pointer"
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
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400/50 shrink-0">
                    <SafeImage src={rev.image} alt={rev.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-white text-base">{rev.name}</h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                        Live on Site
                      </span>
                    </div>
                    <div className="flex gap-1 text-[#FFCD00]">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <p className="text-sm text-white/90 italic pt-1">"{rev.text}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => deleteReview(rev.id)}
                    className="px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 font-bold text-xs border border-red-500/30 transition cursor-pointer"
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
