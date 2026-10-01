import { useAdminOrders } from '../../hooks/useOrders'
import SectionReveal from '../../components/SectionReveal'

export default function AdminOrders() {
  const { data: orders = [], loading, error, refetch } = useAdminOrders()

  const orderList = Array.isArray(orders) ? orders : []

  return (
    <SectionReveal className="antialiased">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-gray-200/90 p-6 rounded-2xl shadow-xs">
          <div>
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block mb-0.5">Order Management</span>
            <h1 className="text-2xl font-bold text-slate-900">Customer Orders ({orderList.length})</h1>
          </div>
          <button
            onClick={refetch}
            className="bg-white border border-gray-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-xs hover:bg-slate-50 transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            Refresh Orders
          </button>
        </div>

        {/* List View */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-gray-200 shadow-xs">
            <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-medium">Loading customer orders...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-rose-700 bg-rose-50 rounded-2xl border border-rose-200 text-xs sm:text-sm font-semibold">
            Failed to load orders. Please try again.
          </div>
        ) : orderList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-gray-200 shadow-xs">
            <p className="text-sm font-bold text-slate-900 mb-1">No orders found</p>
            <p className="text-xs text-slate-500">There are no customer orders in the system yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm text-slate-800">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Order #</th>
                  <th className="px-6 py-3.5 font-bold">Customer</th>
                  <th className="px-6 py-3.5 font-bold">Date</th>
                  <th className="px-6 py-3.5 font-bold">Total Amount</th>
                  <th className="px-6 py-3.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {orderList.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      {ord.orderNumber || ord.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{ord.customer?.fullName || ord.shippingFullName || 'Customer'}</p>
                      <p className="text-xs text-slate-500">{ord.customer?.email || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                      ₹{ord.totalAmount ? Number(ord.totalAmount).toLocaleString('en-IN') : '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase ${
                        ord.orderStatus === 'paid' || ord.orderStatus === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ord.orderStatus === 'shipped'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : ord.orderStatus === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {ord.orderStatus || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </SectionReveal>
  )
}
