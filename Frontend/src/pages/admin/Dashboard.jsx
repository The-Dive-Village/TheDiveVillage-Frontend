import { useState } from 'react'
import SectionReveal from '../../components/SectionReveal'
import { useReviews } from '../../contexts/ReviewsContext'
import SafeImage from '../../components/SafeImage'

export default function AdminDashboard() {
  const { reviews, pendingReviews, approvedReviews, approveReview, deleteReview } = useReviews()
  const [activeTab, setActiveTab] = useState('pending')

  return (
    <SectionReveal className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
          Admin <em className="italic text-[#FFCD00]">Dashboard</em>
        </h1>
        <p className="text-white/70 text-sm">Manage website content, merchandise catalog, and visitor reviews.</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-card">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FFCD00] block mb-1">
            Pending Reviews
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-4xl font-bold text-white">{pendingReviews.length}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#FFCD00]/20 text-[#FFCD00] font-bold">
              Needs Action
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-card">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
            Live Reviews
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-4xl font-bold text-white">{approvedReviews.length}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              Published
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-card">
          <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-1">
            Total Submissions
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-4xl font-bold text-white">{reviews.length}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/80 font-bold">
              All Time
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
