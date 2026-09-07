import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useWishlist } from '../hooks/useWishlist'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { formatCurrency } from '../utils/formatCurrency'
import Button from '../components/Button'

export default function Wishlist() {
  const { user } = useAuth()
  const { items, count, remove } = useWishlist()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [addedAllToast, setAddedAllToast] = useState(false)

  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price || 0), 0)
  }, [items])

  const handleAddAllToCart = () => {
    if (!user?.uid) {
      navigate('/login')
      return
    }
    items.forEach((item) => {
      addItem({
        inventoryId: item.inventoryId || `${item.id}-default`,
        quantity: 1,
        product: {
          id: item.id,
          name: item.title || item.name,
          title: item.title || item.name,
          price: item.price,
          image: item.image,
          selectedSize: item.selectedSize || 'Standard',
          selectedColor: item.selectedColor || 'Standard',
        },
      })
    })
    setAddedAllToast(true)
    setTimeout(() => setAddedAllToast(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-navy font-body pt-24 sm:pt-32 pb-24" style={{ textShadow: 'none' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 border-b border-navy/10 pb-6 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent mb-1 block">Saved Items</span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-navy tracking-tight">Your Wishlist</h1>
            <p className="mt-1 text-sm text-navy/60 font-medium">{count} item{count !== 1 && 's'} saved</p>
          </div>
          <Link to="/shop" className="text-xs sm:text-sm font-bold text-navy hover:text-accent transition underline decoration-2 underline-offset-4">
            ← Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center max-w-lg mx-auto bg-white rounded-[40px] p-8 sm:p-12 shadow-card border border-navy/5">
            <div className="w-20 h-20 rounded-full bg-navy flex items-center justify-center mx-auto mb-6 shadow-md border border-white/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFCD00" stroke="#FFCD00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <h2 className="font-heading text-3xl font-bold mb-3 text-navy">Your wishlist is empty.</h2>
            <p className="text-navy/60 mb-8 text-sm leading-relaxed">
              Explore our ocean-crafted hoodies, pro dive suits, UPF 50+ rash guards, and branded essentials, and tap the heart icon on any product to save it here.
            </p>
            <Button as={Link} to="/shop" className="w-full justify-center bg-navy text-white hover:bg-accent">
              Explore Merchandise Store →
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left Column: Wishlist Items List */}
            <div className="lg:col-span-8 space-y-6">
              
              {addedAllToast && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 shadow-soft text-emerald-800 text-xs font-bold flex justify-between items-center">
                  <span>All wishlist items added to your cart!</span>
                  <Link to="/cart" className="underline text-emerald-900">View Cart →</Link>
                </div>
              )}

              <div className="bg-white rounded-[32px] border border-navy/5 p-6 sm:p-8 shadow-card divide-y divide-navy/10">
                {items.map((item) => (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between">
                    
                    <div className="flex gap-4 items-center flex-1 cursor-pointer" onClick={() => navigate(`/shop/${item.id}`)}>
                      <div className="w-24 sm:w-28 h-28 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-[#F0F2F5] p-2 flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.title || item.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
                          {item.category || 'Gear'}
                        </span>
                        <h3 className="font-heading text-lg sm:text-xl font-bold text-navy leading-snug hover:text-accent transition">
                          {item.title || item.name}
                        </h3>
                        <p className="font-heading text-base font-bold text-navy mt-1">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2.5 w-full sm:w-auto shrink-0 justify-end pt-2 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (!user?.uid) {
                            navigate('/login')
                            return
                          }
                          addItem({
                            inventoryId: item.inventoryId || `${item.id}-default`,
                            quantity: 1,
                            product: {
                              id: item.id,
                              name: item.title || item.name,
                              title: item.title || item.name,
                              price: item.price,
                              image: item.image,
                            },
                          })
                        }}
                        className="flex-1 sm:flex-none rounded-full bg-navy hover:bg-accent text-white hover:text-navy px-5 py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        Add to Cart
                      </button>

                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 transition py-1 text-center"
                      >
                        Remove
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Wishlist Summary Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-[32px] border border-navy/5 p-6 sm:p-8 shadow-card space-y-6 sticky top-28">
                <h2 className="font-heading text-2xl font-bold text-navy">Wishlist Summary</h2>
                
                <div className="space-y-3 border-y border-navy/10 py-4 text-sm font-medium text-navy/70">
                  <div className="flex justify-between">
                    <span>Saved Items</span>
                    <span className="font-bold text-navy">{count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Saved Value</span>
                    <span className="font-bold text-navy">{formatCurrency(totalValue)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleAddAllToCart}
                    className="w-full rounded-full bg-accent hover:bg-navy text-navy hover:text-white font-bold py-3.5 px-6 text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Add All Items to Cart
                  </button>

                  <Link
                    to="/shop"
                    className="w-full text-center block rounded-full bg-white border-2 border-navy/20 hover:border-navy hover:bg-navy hover:text-white text-navy font-bold py-3 px-6 text-xs transition-all duration-200 shadow-xs cursor-pointer"
                  >
                    Continue Shopping
                  </Link>
                </div>

                <div className="pt-4 border-t border-navy/10 space-y-2 text-[11px] text-navy/60">
                  <p className="flex items-center gap-2">
                    <span className="text-accent font-bold">✓</span> Free express shipping over ₹1,999
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-accent font-bold">✓</span> 100% Ocean-Tested Quality Guarantee
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
