import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionReveal from '../../components/SectionReveal'
import { productService } from '../../services/productService'
import api from '../../services/api'
import { SHOP_PRODUCTS } from '../../utils/products'

export default function AdminCatalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    sku: '',
    basePrice: '',
    category: 'Tops',
    description: '',
    imageUrl: '',
    isActive: true,
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await productService.list({ includeInactive: true, limit: 100 })
      const fetched = res.data?.data?.products || []
      setProducts(fetched.length > 0 ? fetched : SHOP_PRODUCTS)
    } catch {
      // Fallback to static list if API error
      setProducts(SHOP_PRODUCTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleOpenAdd = () => {
    setEditingProduct(null)
    setFormData({
      title: '',
      sku: `SKU-${Date.now()}`,
      basePrice: '',
      category: 'Tops',
      description: '',
      imageUrl: '',
      isActive: true,
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (p) => {
    setEditingProduct(p)
    setFormData({
      title: p.title || p.name || '',
      sku: p.sku || `SKU-${p.id}`,
      basePrice: p.basePrice || p.price || '',
      category: p.category?.name || p.category || 'Tops',
      description: p.description || '',
      imageUrl: p.mediaUrls?.[0] || p.image || '',
      isActive: p.isActive !== undefined ? p.isActive : true,
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setFormError('')
    try {
      const uploadData = new FormData()
      uploadData.append('image', file)
      const res = await api.post('/api/uploads/product-image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const url = res.data?.data?.url || res.data?.data?.secure_url
      if (url) {
        setFormData((prev) => ({ ...prev, imageUrl: url }))
      }
    } catch {
      setFormError('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.basePrice) {
      setFormError('Title and Price are required.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const payload = {
        title: formData.title,
        sku: formData.sku,
        basePrice: parseFloat(formData.basePrice),
        description: formData.description,
        mediaUrls: formData.imageUrl ? [formData.imageUrl] : [],
        isActive: formData.isActive,
      }

      if (editingProduct?.id && !String(editingProduct.id).startsWith('product-')) {
        await productService.update(editingProduct.id, payload)
      } else {
        await productService.create(payload)
      }
      setIsModalOpen(false)
      fetchProducts()
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (p) => {
    try {
      if (String(p.id).startsWith('product-')) {
        setProducts((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, isActive: !item.isActive } : item))
        )
        return
      }
      await productService.update(p.id, { isActive: !p.isActive })
      fetchProducts()
    } catch {
      alert('Failed to update product status.')
    }
  }

  const filteredProducts = products.filter((p) => {
    const title = (p.title || p.name || '').toLowerCase()
    const cat = (p.category?.name || p.category || '').toLowerCase()
    const matchesSearch = title.includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || cat === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <SectionReveal>
      <div className="space-y-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
          <div>
            <span className="text-accent text-xs font-bold uppercase tracking-wider block mb-1">Catalog Management</span>
            <h1 className="font-heading text-3xl font-bold text-white">Products ({products.length})</h1>
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-accent text-navy px-6 py-3 rounded-full font-bold text-sm hover:bg-white transition duration-hover shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>+ Add New Product</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-3.5 text-sm font-medium text-white placeholder-white/40 outline-none focus:border-accent transition"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#00284e] border border-white/15 rounded-2xl px-5 py-3.5 text-sm font-bold text-white outline-none focus:border-accent transition cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Tops">Tops</option>
            <option value="Bottoms">Bottoms</option>
            <option value="Skin Wear">Skin Wear</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="p-12 text-center text-white/50 bg-white/5 rounded-3xl border border-white/10">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Loading production catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-white/50 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-base font-bold text-white mb-1">No products found</p>
            <p className="text-xs">No catalog items match your search or filter.</p>
          </div>
        ) : (
          /* Products Table Grid */
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
            <table className="w-full text-left text-sm text-white">
              <thead className="bg-white/10 text-xs uppercase tracking-wider text-accent border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-bold">Product</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Price</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-medium">
                {filteredProducts.map((p) => {
                  const title = p.title || p.name
                  const price = p.basePrice || p.price
                  const cat = p.category?.name || p.category || 'Merchandise'
                  const img = p.mediaUrls?.[0] || p.image
                  const isActive = p.isActive !== false

                  return (
                    <tr key={p.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 overflow-hidden shrink-0 border border-white/10">
                          {img ? (
                            <img src={img} alt={title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white/30">No Img</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white leading-snug">{title}</p>
                          <p className="text-xs text-white/50 font-mono">SKU: {p.sku || p.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-accent border border-accent/20">
                          {cat}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-white">
                        ₹{Number(price).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-3.5 py-1.5 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-accent hover:text-navy transition cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Add / Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
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
                className="bg-[#00284e] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl space-y-5"
              >
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <h3 className="font-heading text-xl font-bold">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white text-lg">✕</button>
                </div>

                <form onSubmit={handleSave} className="space-y-4 text-xs font-bold">
                  <div>
                    <label className="block text-white/70 mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-accent text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={formData.basePrice}
                        onChange={(e) => setFormData((prev) => ({ ...prev, basePrice: e.target.value }))}
                        className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-accent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-[#001e3d] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-accent text-xs cursor-pointer"
                      >
                        <option value="Tops">Tops</option>
                        <option value="Bottoms">Bottoms</option>
                        <option value="Skin Wear">Skin Wear</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1">Description</label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-accent text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1">Product Image</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-xs text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-accent file:text-navy cursor-pointer"
                      />
                      {uploading && <span className="text-accent text-xs">Uploading...</span>}
                    </div>
                    {formData.imageUrl && (
                      <div className="mt-2 w-16 h-16 rounded-xl border border-white/15 overflow-hidden">
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
                      ⚠️ {formError}
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving || uploading}
                      className="px-6 py-2.5 rounded-xl bg-accent text-navy font-bold text-xs hover:bg-white transition duration-hover disabled:opacity-50 cursor-pointer"
                    >
                      {saving ? 'Saving...' : 'Save Product'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </SectionReveal>
  )
}
