import api from './api'

export const contentService = {
  // FAQs
  getFaqs: (params) => api.get('/api/v1/content/faq', { params }),
  upsertFaq: (payload) => api.post('/api/v1/content/faq', payload),
  deleteFaq: (id) => api.delete(`/api/v1/content/faq/${id}`),

  // Gallery
  getGallery: (params) => api.get('/api/v1/content/gallery', { params }),
  upsertGalleryItem: (payload) => api.post('/api/v1/content/gallery', payload),
  deleteGalleryItem: (id) => api.delete(`/api/v1/content/gallery/${id}`),

  // Audit Logs
  getAuditLogs: () => api.get('/api/admin/audit-logs'),
}


