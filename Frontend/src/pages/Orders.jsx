import { Link } from 'react-router'
import { useMyOrders } from '../hooks/useOrders'
import { formatCurrency } from '../utils/formatCurrency'

export default function Orders() {
  const { data: orders, loading } = useMyOrders()
  const orderList = Array.isArray(orders) ? orders : []

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-1 block">Account Activity</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">Order History</h1>
          <p className="mt-1 text-sm text-white/70 font-medium">Review your past purchases and diving bookings.</p>
        </div>
        <Link
          to="/shop"
          className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-accent transition underline decoration-2 underline-offset-4"
        >
          Explore Shop →
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-white/60 font-medium text-sm">
          Loading your orders...
        </div>
      ) : orderList.length === 0 ? (
        <div className="mt-10 rounded-[32px] bg-[#00223D]/80 p-12 border border-white/10 text-center flex flex-col items-center justify-center shadow-inner">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-accent mb-4 border border-white/10">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">No orders yet</h3>
          <p className="text-white/60 text-sm max-w-md mb-6">When you purchase gear or book a dive, your order history and receipts will appear here.</p>
          <Link
            to="/shop"
            className="rounded-full bg-accent hover:bg-white text-navy px-6 py-3 text-xs font-extrabold transition shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orderList.map((order) => (
            <div key={order.id} className="rounded-2xl border border-white/10 bg-[#00223D]/80 p-6 shadow-inner flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs font-bold text-cyan-400">#{order.id?.slice(0, 8)}</span>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-400/30 uppercase">
                    {order.status || 'Completed'}
                  </span>
                </div>
                <p className="text-sm font-bold text-white">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent Order'}
                </p>
                <p className="text-xs text-white/60 mt-1">
                  {order.items?.length || 1} item(s) • Total: {formatCurrency(order.totalAmount || order.total || 0)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

