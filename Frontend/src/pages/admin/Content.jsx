import { useState, useEffect, useCallback } from 'react'
import SectionReveal from '../../components/SectionReveal'
import { contentService } from '../../services/contentService'
import CloudinaryUploadWidget from '../../components/admin/CloudinaryUploadWidget'
import {
  HelpCircle,
  Image as ImageIcon,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Film,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('faq') // 'faq' | 'gallery'

  // FAQ State
  const [faqs, setFaqs] = useState([])
  const [faqLoading, setFaqLoading] = useState(true)
  const [faqSearch, setFaqSearch] = useState('')
  const [faqCategoryFilter, setFaqCategoryFilter] = useState('ALL')
  const [faqModalOpen, setFaqModalOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)

  const [faqFormData, setFaqFormData] = useState({
    id: '',
    question: '',
    answer: '',
    category: 'General',
    displayOrder: 0,
    isActive: true,
  })

  // Gallery State
  const [gallery, setGallery] = useState([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [gallerySearch, setGallerySearch] = useState('')
  const [galleryTypeFilter, setGalleryTypeFilter] = useState('ALL') // 'ALL' | 'IMAGE' | 'VIDEO'
  const [galleryModalOpen, setGalleryModalOpen] = useState(false)
  const [editingGallery, setEditingGallery] = useState(null)

  const [galleryFormData, setGalleryFormData] = useState({
    id: '',
    title: '',
    src: '',
    thumbnail: '',
    mediaType: 'IMAGE',
    category: 'Underwater',
    location: '',
    displayOrder: 0,
    isActive: true,
  })

  // Alert State
  const [notification, setNotification] = useState(null)

  const showToast = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  // -------------------------------------------------------------
  // FAQ FETCH & HANDLERS
  // -------------------------------------------------------------
  const fetchFaqs = useCallback(async () => {
    setFaqLoading(true)
    try {
      const res = await contentService.getFaqs({ includeInactive: true })
      setFaqs(res.data?.data || [])
    } catch (err) {
      console.error('Failed to fetch FAQs:', err)
      showToast('error', 'Failed to load FAQs')
    } finally {
      setFaqLoading(false)
    }
  }, [])

  // -------------------------------------------------------------
  // GALLERY FETCH & HANDLERS
  // -------------------------------------------------------------
  const fetchGallery = useCallback(async () => {
    setGalleryLoading(true)
    try {
      const res = await contentService.getGallery({ includeInactive: true })
      setGallery(res.data?.data || [])
    } catch (err) {
      console.error('Failed to fetch Gallery:', err)
      showToast('error', 'Failed to load Gallery items')
    } finally {
      setGalleryLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFaqs()
    fetchGallery()
  }, [fetchFaqs, fetchGallery])

  // FAQ Modal Handlers
  const handleOpenFaqModal = (faq = null) => {
    if (faq) {
      setEditingFaq(faq)
      setFaqFormData({
        id: faq.id || '',
        question: faq.question || '',
        answer: faq.answer || '',
        category: faq.category || 'General',
        displayOrder: faq.displayOrder || 0,
        isActive: faq.isActive ?? true,
      })
    } else {
      setEditingFaq(null)
      setFaqFormData({
        id: '',
        question: '',
        answer: '',
        category: 'General',
        displayOrder: faqs.length + 1,
        isActive: true,
      })
    }
    setFaqModalOpen(true)
  }

  const handleSaveFaq = async (e) => {
    e.preventDefault()
    try {
      await contentService.upsertFaq(faqFormData)
      showToast('success', editingFaq ? 'FAQ updated successfully!' : 'FAQ created successfully!')
      setFaqModalOpen(false)
      fetchFaqs()
    } catch (err) {
      console.error('Save FAQ Error:', err)
      showToast('error', err.response?.data?.message || 'Failed to save FAQ')
    }
  }

  const handleToggleFaqActive = async (faq) => {
    try {
      await contentService.upsertFaq({
        ...faq,
        isActive: !faq.isActive,
      })
      showToast('success', `FAQ ${!faq.isActive ? 'activated' : 'deactivated'}`)
      fetchFaqs()
    } catch (err) {
      console.error('Toggle FAQ error:', err)
      showToast('error', 'Failed to update FAQ status')
    }
  }

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return
    try {
      await contentService.deleteFaq(id)
      showToast('success', 'FAQ deleted')
      fetchFaqs()
    } catch (err) {
      console.error('Delete FAQ error:', err)
      showToast('error', 'Failed to delete FAQ')
    }
  }

  // Gallery Modal Handlers
  const handleOpenGalleryModal = (item = null) => {
    if (item) {
      setEditingGallery(item)
      setGalleryFormData({
        id: item.id || '',
        title: item.title || '',
        src: item.src || '',
        thumbnail: item.thumbnail || '',
        mediaType: item.mediaType || 'IMAGE',
        category: item.category || 'Underwater',
        location: item.location || '',
        displayOrder: item.displayOrder || 0,
        isActive: item.isActive ?? true,
      })
    } else {
      setEditingGallery(null)
      setGalleryFormData({
        id: '',
        title: '',
        src: '',
        thumbnail: '',
        mediaType: 'IMAGE',
        category: 'Underwater',
        location: '',
        displayOrder: gallery.length + 1,
        isActive: true,
      })
    }
    setGalleryModalOpen(true)
  }

  const handleSaveGallery = async (e) => {
    e.preventDefault()
    if (!galleryFormData.src) {
      showToast('error', 'Please provide an image/video URL or upload a file')
      return
    }

    try {
      await contentService.upsertGalleryItem(galleryFormData)
      showToast('success', editingGallery ? 'Gallery item updated!' : 'Gallery item added!')
      setGalleryModalOpen(false)
      fetchGallery()
    } catch (err) {
      console.error('Save Gallery Error:', err)
      showToast('error', err.response?.data?.message || 'Failed to save Gallery item')
    }
  }

  const handleToggleGalleryActive = async (item) => {
    try {
      await contentService.upsertGalleryItem({
        ...item,
        isActive: !item.isActive,
      })
      showToast('success', `Media ${!item.isActive ? 'published' : 'hidden'}`)
      fetchGallery()
    } catch (err) {
      console.error('Toggle Gallery error:', err)
      showToast('error', 'Failed to update media status')
    }
  }

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media item?')) return
    try {
      await contentService.deleteGalleryItem(id)
      showToast('success', 'Media item deleted')
      fetchGallery()
    } catch (err) {
      console.error('Delete Gallery error:', err)
      showToast('error', 'Failed to delete media item')
    }
  }

  // Filtered lists
  const faqCategories = Array.from(new Set(faqs.map((f) => f.category || 'General')))

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
    const matchesCat = faqCategoryFilter === 'ALL' || faq.category === faqCategoryFilter
    return matchesSearch && matchesCat
  })

  const filteredGallery = gallery.filter((item) => {
    const matchesSearch =
      (item.title || '').toLowerCase().includes(gallerySearch.toLowerCase()) ||
      (item.location || '').toLowerCase().includes(gallerySearch.toLowerCase())
    const matchesType = galleryTypeFilter === 'ALL' || item.mediaType === galleryTypeFilter
    return matchesSearch && matchesType
  })

  return (
    <SectionReveal>
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-2xl transition-all animate-bounce ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-h2 font-bold text-white">Content Management (CMS)</h1>
          <p className="mt-1 text-slate-400 text-sm">
            Manage FAQs and Gallery Media visible on the public website.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'faq'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            FAQs ({faqs.length})
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'gallery'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Gallery Media ({gallery.length})
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FAQ TAB CONTENT */}
      {/* ========================================================================= */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/10">
            <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full bg-slate-800/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              {/* Category Filter */}
              <select
                value={faqCategoryFilter}
                onChange={(e) => setFaqCategoryFilter(e.target.value)}
                className="w-full sm:w-48 bg-slate-800/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="ALL">All Categories</option>
                {faqCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleOpenFaqModal()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add FAQ
            </button>
          </div>

          {/* FAQ Accordion / List */}
          {faqLoading ? (
            <div className="text-center py-16 text-slate-400">Loading FAQs from DB...</div>
          ) : filteredFaqs.length === 0 ? (
            <div className="text-center py-16 text-slate-400 bg-slate-900/40 rounded-2xl border border-white/10">
              No FAQs found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className={`bg-slate-900/60 border rounded-2xl p-5 transition-all ${
                    faq.isActive ? 'border-white/10' : 'border-rose-500/30 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {faq.category || 'General'}
                        </span>
                        <span className="text-xs text-slate-500">Order: {faq.displayOrder}</span>
                        {!faq.isActive && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            Inactive / Hidden
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-white">{faq.question}</h3>
                      <p className="mt-2 text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleFaqActive(faq)}
                        title={faq.isActive ? 'Hide on Public Site' : 'Publish to Public Site'}
                        className={`p-2 rounded-xl border transition-all ${
                          faq.isActive
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {faq.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleOpenFaqModal(faq)}
                        className="p-2 bg-slate-800 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* GALLERY TAB CONTENT */}
      {/* ========================================================================= */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/10">
            <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search media title or location..."
                  value={gallerySearch}
                  onChange={(e) => setGallerySearch(e.target.value)}
                  className="w-full bg-slate-800/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              {/* Media Type Filter */}
              <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setGalleryTypeFilter('ALL')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    galleryTypeFilter === 'ALL'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({gallery.length})
                </button>
                <button
                  onClick={() => setGalleryTypeFilter('IMAGE')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    galleryTypeFilter === 'IMAGE'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Images ({gallery.filter((g) => g.mediaType === 'IMAGE').length})
                </button>
                <button
                  onClick={() => setGalleryTypeFilter('VIDEO')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    galleryTypeFilter === 'VIDEO'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Videos ({gallery.filter((g) => g.mediaType === 'VIDEO').length})
                </button>
              </div>
            </div>

            <button
              onClick={() => handleOpenGalleryModal()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Media
            </button>
          </div>

          {/* Gallery Media Grid */}
          {galleryLoading ? (
            <div className="text-center py-16 text-slate-400">Loading Gallery from DB...</div>
          ) : filteredGallery.length === 0 ? (
            <div className="text-center py-16 text-slate-400 bg-slate-900/40 rounded-2xl border border-white/10">
              No media items found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGallery.map((item) => (
                <div
                  key={item.id}
                  className={`group relative bg-slate-900/80 border rounded-2xl overflow-hidden transition-all flex flex-col justify-between ${
                    item.isActive ? 'border-white/10 hover:border-blue-500/50' : 'border-rose-500/30 opacity-60'
                  }`}
                >
                  {/* Media Preview Thumbnail */}
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    {item.mediaType === 'VIDEO' ? (
                      <video
                        src={item.src}
                        poster={item.thumbnail || undefined}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                      />
                    ) : (
                      <img
                        src={item.src}
                        alt={item.title || 'Gallery item'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}

                    {/* Media Type Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
                      {item.mediaType === 'VIDEO' ? (
                        <>
                          <Film className="w-3.5 h-3.5 text-amber-400" /> Video
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3.5 h-3.5 text-blue-400" /> Image
                        </>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <button
                        onClick={() => handleToggleGalleryActive(item)}
                        className={`p-1.5 rounded-lg border backdrop-blur-md transition-all ${
                          item.isActive
                            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
                            : 'bg-rose-950/80 border-rose-500/40 text-rose-400'
                        }`}
                      >
                        {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-white text-sm line-clamp-1">
                        {item.title || 'Untitled Media'}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                        <span>{item.location || 'The Dive Village'}</span>
                        <span className="text-slate-500">Order: {item.displayOrder}</span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/5">
                      <button
                        onClick={() => handleOpenGalleryModal(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGallery(item.id)}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FAQ MODAL */}
      {/* ========================================================================= */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <h2 className="text-lg font-bold text-white">
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h2>
              <button
                onClick={() => setFaqModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={faqFormData.question}
                  onChange={(e) => setFaqFormData({ ...faqFormData, question: e.target.value })}
                  placeholder="e.g. Do I need previous diving certification?"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Answer *
                </label>
                <textarea
                  required
                  rows={4}
                  value={faqFormData.answer}
                  onChange={(e) => setFaqFormData({ ...faqFormData, answer: e.target.value })}
                  placeholder="Detailed answer text..."
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={faqFormData.category}
                    onChange={(e) => setFaqFormData({ ...faqFormData, category: e.target.value })}
                    placeholder="General, Booking, Safety..."
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={faqFormData.displayOrder}
                    onChange={(e) =>
                      setFaqFormData({ ...faqFormData, displayOrder: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={faqFormData.isActive}
                    onChange={(e) =>
                      setFaqFormData({ ...faqFormData, isActive: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-sm font-semibold text-white">
                  Publish on public site ({faqFormData.isActive ? 'Active' : 'Hidden'})
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GALLERY MODAL */}
      {/* ========================================================================= */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <h2 className="text-lg font-bold text-white">
                {editingGallery ? 'Edit Media Item' : 'Add Gallery Media'}
              </h2>
              <button
                onClick={() => setGalleryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Title / Caption
                </label>
                <input
                  type="text"
                  value={galleryFormData.title}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, title: e.target.value })}
                  placeholder="e.g. Manta Ray Night Dive"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Media Type
                  </label>
                  <select
                    value={galleryFormData.mediaType}
                    onChange={(e) =>
                      setGalleryFormData({ ...galleryFormData, mediaType: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="IMAGE">Image</option>
                    <option value="VIDEO">Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={galleryFormData.location}
                    onChange={(e) =>
                      setGalleryFormData({ ...galleryFormData, location: e.target.value })
                    }
                    placeholder="e.g. Maldives, Nusa Penida"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Upload Widget & URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Media Source URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={galleryFormData.src}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, src: e.target.value })}
                    placeholder="https://res.cloudinary.com/..."
                    className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <CloudinaryUploadWidget
                    onSuccess={(url) => setGalleryFormData({ ...galleryFormData, src: url })}
                  />
                </div>
              </div>

              {/* Thumbnail URL for video */}
              {galleryFormData.mediaType === 'VIDEO' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Poster/Thumbnail Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={galleryFormData.thumbnail}
                    onChange={(e) =>
                      setGalleryFormData({ ...galleryFormData, thumbnail: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={galleryFormData.category}
                    onChange={(e) =>
                      setGalleryFormData({ ...galleryFormData, category: e.target.value })
                    }
                    placeholder="Underwater, Marine Life, Action..."
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={galleryFormData.displayOrder}
                    onChange={(e) =>
                      setGalleryFormData({
                        ...galleryFormData,
                        displayOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={galleryFormData.isActive}
                    onChange={(e) =>
                      setGalleryFormData({ ...galleryFormData, isActive: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-sm font-semibold text-white">
                  Publish on gallery page ({galleryFormData.isActive ? 'Active' : 'Hidden'})
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all"
                >
                  Save Media Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SectionReveal>
  )
}
