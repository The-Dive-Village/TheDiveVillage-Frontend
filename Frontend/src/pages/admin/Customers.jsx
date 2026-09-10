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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
          <div>
            <span className="text-accent text-xs font-bold uppercase tracking-wider block mb-1">Customer Management</span>
            <h1 className="font-heading text-3xl font-bold text-white">Booking Requests ({bookings.length})</h1>
          </div>
          <button
            onClick={fetchBookings}
            className="bg-white/10 text-white px-5 py-2.5 rounded-full font-bold text-xs hover:bg-white/20 transition cursor-pointer"
          >
            🔄 Refresh List
          </button>
        </div>

        {/* Filter & Search */}
        <form onSubmit={handleSearchSubmit} className="grid sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by customer name, email, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:col-span-2 bg-white/5 border border-white/15 rounded-2xl px-5 py-3.5 text-sm font-medium text-white placeholder-white/40 outline-none focus:border-accent transition"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#00284e] border border-white/15 rounded-2xl px-5 py-3.5 text-sm font-bold text-white outline-none focus:border-accent transition cursor-pointer"
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
          <div className="p-12 text-center text-white/50 bg-white/5 rounded-3xl border border-white/10">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Loading booking requests...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-300 bg-rose-500/10 rounded-3xl border border-rose-500/20 text-sm font-bold">
            ⚠️ {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-white/50 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-base font-bold text-white mb-1">No booking requests found</p>
            <p className="text-xs">No customer booking submissions match the current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
            <table className="w-full text-left text-sm text-white">
              <thead className="bg-white/10 text-xs uppercase tracking-wider text-accent border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Location & Country</th>
                  <th className="px-6 py-4 font-bold">Preferred Date</th>
                  <th className="px-6 py-4 font-bold">Group</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-medium">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{b.contactName}</p>
                      <p className="text-xs text-white/60">{b.contactEmail}</p>
                      {b.contactPhone && <p className="text-[11px] text-accent font-mono">{b.contactPhone}</p>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-white">{b.location}</p>
                      <p className="text-xs text-white/50">{b.country}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-accent">
                      {b.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold">
                      {b.groupSize} Person(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        b.status === 'NEW'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : b.status === 'CONTACTED'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : b.status === 'CONFIRMED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="px-3.5 py-1.5 rounded-xl bg-accent text-navy font-bold text-xs hover:bg-white transition cursor-pointer shadow-sm"
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-[#00284e] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-white shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs text-accent font-bold uppercase tracking-wider block">Booking Request Detail</span>
                    <h3 className="font-heading text-2xl font-bold">{selectedBooking.contactName}</h3>
                  </div>
                  <button onClick={() => setSelectedBooking(null)} className="text-white/60 hover:text-white text-lg">✕</button>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div>
                      <span className="text-white/50 block font-bold mb-0.5">Contact Email</span>
                      <span className="font-bold text-white text-sm">{selectedBooking.contactEmail}</span>
                    </div>
                    <div>
                      <span className="text-white/50 block font-bold mb-0.5">Phone Number</span>
                      <span className="font-bold text-accent text-sm">{selectedBooking.contactPhone || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div>
                      <span className="text-white/50 block font-bold mb-0.5">Location & Country</span>
                      <span className="font-bold text-white">{selectedBooking.location} ({selectedBooking.country})</span>
                    </div>
                    <div>
                      <span className="text-white/50 block font-bold mb-0.5">Preferred Date</span>
                      <span className="font-bold text-accent">{selectedBooking.date}</span>
                    </div>
                  </div>

                  {/* Participants Summary */}
                  {Array.isArray(selectedBooking.participants) && selectedBooking.participants.length > 0 && (
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                      <span className="text-white/50 block font-bold uppercase tracking-wider text-[10px]">
                        Participants ({selectedBooking.participants.length})
                      </span>
                      {selectedBooking.participants.map((p, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl border border-white/5 text-xs">
                          <div>
                            <span className="font-bold text-white block">{p.name || `Participant ${idx + 1}`}</span>
                            <span className="text-[10px] text-white/50">Age: {p.age || 'N/A'}</span>
                          </div>
                          <span className="font-bold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full text-[10px]">
                            {p.selectedProgram || 'Selected Course'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedBooking.specialRequests && (
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <span className="text-white/50 block font-bold mb-1 uppercase tracking-wider text-[10px]">Special Requests / Notes</span>
                      <p className="text-white/90 text-xs italic">{selectedBooking.specialRequests}</p>
                    </div>
                  )}

                  {/* Status Updater */}
                  <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                    <span className="text-white/70 font-bold uppercase tracking-wider text-[10px]">Update Booking Status</span>
                    <div className="flex flex-wrap gap-2">
                      {['NEW', 'CONTACTED', 'CONFIRMED', 'CANCELLED'].map((st) => (
                        <button
                          key={st}
                          disabled={updatingStatus}
                          onClick={() => handleUpdateStatus(selectedBooking.id, st)}
                          className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                            selectedBooking.status === st
                              ? 'bg-accent text-navy shadow-md ring-2 ring-accent/50'
                              : 'bg-white/10 text-white hover:bg-white/20'
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
                    className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </SectionReveal>
  )
}
