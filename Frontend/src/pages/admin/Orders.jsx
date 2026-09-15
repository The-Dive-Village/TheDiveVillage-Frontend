import { useAdminOrders } from '../../hooks/useOrders'
import SectionReveal from '../../components/SectionReveal'

export default function AdminOrders() {
  const { data: orders = [], loading, error, refetch } = useAdminOrders()

  const orderList = Array.isArray(orders) ? orders : []

  return (
    <SectionReveal>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
          <div>
            <span className="text-accent text-xs font-bold uppercase tracking-wider block mb-1">Order Management</span>
            <h1 className="font-heading text-3xl font-bold text-white">Customer Orders ({orderList.length})</h1>
          </div>
          <button
            onClick={refetch}
            className="bg-white/10 text-white px-5 py-2.5 rounded-full font-bold text-xs hover:bg-white/20 transition cursor-pointer"
          >
            🔄 Refresh Orders
          </button>
        </div>

        {/* List View */}
        {loading ? (
          <div className="p-12 text-center text-white/50 bg-white/5 rounded-3xl border border-white/10">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Loading customer orders...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-300 bg-rose-500/10 rounded-3xl border border-rose-500/20 text-sm font-bold">
            ⚠️ Failed to load orders.
          </div>
        ) : orderList.length === 0 ? (
          <div className="p-12 text-center text-white/50 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-base font-bold text-white mb-1">No orders found</p>
            <p className="text-xs">There are no customer orders in the system yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
            <table className="w-full text-left text-sm text-white">
              <thead className="bg-white/10 text-xs uppercase tracking-wider text-accent border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-bold">Order #</th>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Total Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-medium">
                {orderList.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 font-mono font-bold text-accent">
                      {ord.orderNumber || ord.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{ord.customer?.fullName || ord.shippingFullName || 'Customer'}</p>
                      <p className="text-xs text-white/60">{ord.customer?.email || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-white/70">
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-white">
                      ₹{ord.totalAmount ? Number(ord.totalAmount).toLocaleString('en-IN') : '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        ord.orderStatus === 'paid' || ord.orderStatus === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : ord.orderStatus === 'shipped'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : ord.orderStatus === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
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
