import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionReveal from '../../components/SectionReveal'
import { bookingService } from '../../services/bookingService'

const STATUS_OPTIONS = ['ALL', 'NEW', 'CONTACTED', 'CONFIRMED', 'CANCELLED']

export default function AdminCustomers() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const fetchBookings = async () => {
    setLoading(true)
    setError('')
    try {
      const statusParam = selectedStatus !== 'ALL' ? selectedStatus : undefined
      const res = await bookingService.getBookings({ search, status: statusParam })
      setBookings(res.data?.data?.bookings || [])
    } catch {
      setError('Failed to load booking requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [selectedStatus])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchBookings()
  }

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setUpdatingStatus(true)
    try {
      await bookingService.updateStatus(bookingId, newStatus)
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking((prev) => ({ ...prev, status: newStatus }))
      }
      fetchBookings()
    } catch {
      alert('Failed to update booking status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <SectionReveal>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-gray-200/90 p-6 rounded-2xl shadow-xs">
          <div>
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block mb-0.5">Customer Inquiries</span>
            <h1 className="text-2xl font-bold text-slate-900">Booking Requests ({bookings.length})</h1>
          </div>
          <button
            onClick={fetchBookings}
            className="bg-white border border-gray-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-xs hover:bg-slate-50 transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            Refresh List
          </button>
        </div>

        {/* Filter & Search */}
        <form onSubmit={handleSearchSubmit} className="grid sm:grid-cols-3 gap-3 sm:gap-4">
          <input
            type="text"
            placeholder="Search by customer name, email, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:col-span-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition shadow-2xs"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition cursor-pointer shadow-2xs"
          >
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                Status: {st}
              </option>
            ))}
          </select>
        </form>

        {/* List View */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-gray-200 shadow-xs">
            <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-medium">Loading booking requests...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-rose-700 bg-rose-50 rounded-2xl border border-rose-200 text-xs sm:text-sm font-semibold">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-gray-200 shadow-xs">
            <p className="text-sm font-bold text-slate-900 mb-1">No booking requests found</p>
            <p className="text-xs text-slate-500">No submissions match the current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm text-slate-800">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Customer</th>
                  <th className="px-6 py-3.5 font-bold">Location & Country</th>
                  <th className="px-6 py-3.5 font-bold">Preferred Date</th>
                  <th className="px-6 py-3.5 font-bold">Group</th>
                  <th className="px-6 py-3.5 font-bold">Status</th>
                  <th className="px-6 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{b.contactName}</p>
                      <p className="text-xs text-slate-500">{b.contactEmail}</p>
                      {b.contactPhone && <p className="text-[11px] text-slate-400 font-mono">{b.contactPhone}</p>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-slate-900">{b.location}</p>
                      <p className="text-xs text-slate-500">{b.country}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">
                      {b.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                      {b.groupSize} Person(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase ${
                        b.status === 'NEW'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : b.status === 'CONTACTED'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : b.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                      >
                        Inspect Request
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detailed Booking Inspection Modal */}
        <AnimatePresence>
          {selectedBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 max-w-xl w-full text-slate-900 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Booking Details</span>
                    <h3 className="text-xl font-bold text-slate-900">{selectedBooking.contactName}</h3>
                  </div>
                  <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-gray-200">
                    <div>
                      <span className="text-slate-500 block font-semibold mb-0.5">Email</span>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{selectedBooking.contactEmail}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-semibold mb-0.5">Phone</span>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{selectedBooking.contactPhone || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-gray-200">
                    <div>
                      <span className="text-slate-500 block font-semibold mb-0.5">Location</span>
                      <span className="font-bold text-slate-900">{selectedBooking.location} ({selectedBooking.country})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-semibold mb-0.5">Preferred Date</span>
                      <span className="font-bold text-slate-900">{selectedBooking.date}</span>
                    </div>
                  </div>

                  {/* Participants Summary */}
                  {Array.isArray(selectedBooking.participants) && selectedBooking.participants.length > 0 && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
                      <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[10px]">
                        Participants ({selectedBooking.participants.length})
                      </span>
                      {selectedBooking.participants.map((p, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-gray-200 text-xs">
                          <div>
                            <span className="font-semibold text-slate-900 block">{p.name || `Participant ${idx + 1}`}</span>
                            <span className="text-[10px] text-slate-400">Age: {p.age || 'N/A'}</span>
                          </div>
                          <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md text-[10px]">
                            {p.selectedProgram || 'Selected Course'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedBooking.specialRequests && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200">
                      <span className="text-slate-500 block font-semibold mb-1 uppercase tracking-wider text-[10px]">Special Requests / Notes</span>
                      <p className="text-slate-700 text-xs leading-relaxed">{selectedBooking.specialRequests}</p>
                    </div>
                  )}

                  {/* Status Updater */}
                  <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Update Status</span>
                    <div className="flex flex-wrap gap-2">
                      {['NEW', 'CONTACTED', 'CONFIRMED', 'CANCELLED'].map((st) => (
                        <button
                          key={st}
                          disabled={updatingStatus}
                          onClick={() => handleUpdateStatus(selectedBooking.id, st)}
                          className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition cursor-pointer ${
                            selectedBooking.status === st
                              ? 'bg-slate-900 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </SectionReveal>
  )
}
