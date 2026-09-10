import api from './api'

export const contentService = {
  // FAQs
  getFaqs: (params) => api.get('/api/content/faq', { params }),
  upsertFaq: (payload) => api.post('/api/content/faq', payload),
  deleteFaq: (id) => api.delete(`/api/content/faq/${id}`),

  // Gallery
  getGallery: (params) => api.get('/api/content/gallery', { params }),
  upsertGalleryItem: (payload) => api.post('/api/content/gallery', payload),
  deleteGalleryItem: (id) => api.delete(`/api/content/gallery/${id}`),

  // Audit Logs
  getAuditLogs: () => api.get('/api/admin/audit-logs'),
}

