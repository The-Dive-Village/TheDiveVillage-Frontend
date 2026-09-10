import api from './api'

export const galleryService = {
  getGalleryItems: (params) => api.get('/api/content/gallery', { params }),
  upsertGalleryItem: (payload) => api.post('/api/content/gallery', payload),
  deleteGalleryItem: (id) => api.delete(`/api/content/gallery/${id}`),
}
