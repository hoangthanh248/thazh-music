import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('thazh_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 → redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('thazh_token')
      localStorage.removeItem('thazh_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ─── AUTH ─────────────────────────────────────────────────────
export const authAPI = {
  register:       (data) => api.post('/auth/register', data),
  registerArtist: (data) => api.post('/auth/register/artist', data),
  login:          (data) => api.post('/auth/login', data),
  me:             ()     => api.get('/auth/me'),
  updateMe:       (data) => api.put('/auth/me', data),
  uploadAvatar:   (form) => api.post('/auth/me/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (old_password, new_password) => api.post('/auth/change-password', null, { params: { old_password, new_password } }),
}

// ─── ARTISTS ──────────────────────────────────────────────────
export const artistAPI = {
  get:            (id)   => api.get(`/artists/${id}`),
  byUser:         (uid)  => api.get(`/artists/by-user/${uid}`),
  myProfile:      ()     => api.get('/artists/me/profile'),
  updateProfile:  (data) => api.put('/artists/me/profile', data),
  submitVerify:   (data) => api.post('/artists/me/verify', data),
  uploadDoc:      (form) => api.post('/artists/me/verification-doc', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMusic:       (id)   => api.get(`/artists/${id}/music`),
  getStats:       (id)   => api.get(`/artists/${id}/stats`),
}

// ─── MUSIC ────────────────────────────────────────────────────
export const musicAPI = {
  uploadCover:  (form) => api.post('/music/upload/cover', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadAudio:  (form, onProgress) => api.post('/music/upload/audio', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
  }),
  uploadVideo:  (form, onProgress) => api.post('/music/upload/video', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
  }),
  create:       (data) => api.post('/music/', data),
  list:         (params) => api.get('/music/', { params }),
  trending:     (limit = 20) => api.get('/music/trending', { params: { limit } }),
  myMusic:      (status)     => api.get('/music/my', { params: { status } }),
  get:          (id)   => api.get(`/music/${id}`),
  play:         (id)   => api.post(`/music/${id}/play`),
  update:       (id, data) => api.put(`/music/${id}`, data),
  delete:       (id)   => api.delete(`/music/${id}`),
  // MV
  createMV:     (data) => api.post('/music/mv', data),
  listMVs:      (params) => api.get('/music/mv/list', { params }),
  getMV:        (id)   => api.get(`/music/mv/${id}`),
  viewMV:       (id)   => api.post(`/music/mv/${id}/view`),
}

// ─── AUDIO STORIES ────────────────────────────────────────────
export const audioAPI = {
  uploadFile:   (form, onProgress) => api.post('/audio/upload/file', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
  }),
  uploadCover:  (form) => api.post('/audio/upload/cover', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  create:       (data) => api.post('/audio/', data),
  list:         (params) => api.get('/audio/', { params }),
  myAudio:      ()     => api.get('/audio/my'),
  get:          (id)   => api.get(`/audio/${id}`),
  play:         (id)   => api.post(`/audio/${id}/play`),
  delete:       (id)   => api.delete(`/audio/${id}`),
}

// ─── ADMIN ────────────────────────────────────────────────────
export const adminAPI = {
  stats:             ()              => api.get('/admin/stats'),
  users:             (params)        => api.get('/admin/users', { params }),
  toggleUser:        (id, is_active) => api.put(`/admin/users/${id}/status`, null, { params: { is_active } }),
  verifications:     (status)        => api.get('/admin/verifications', { params: { status } }),
  approveVerify:     (id, notes)     => api.put(`/admin/verifications/${id}/approve`, null, { params: { notes } }),
  rejectVerify:      (id, data)      => api.put(`/admin/verifications/${id}/reject`, data),
  pendingMusic:      (params)        => api.get('/admin/music/pending', { params }),
  approveMusic:      (id)            => api.put(`/admin/music/${id}/approve`),
  rejectMusic:       (id, data)      => api.put(`/admin/music/${id}/reject`, data),
  pendingMVs:        ()              => api.get('/admin/mv/pending'),
  approveMV:         (id)            => api.put(`/admin/mv/${id}/approve`),
  rejectMV:          (id, data)      => api.put(`/admin/mv/${id}/reject`, data),
  pendingAudio:      ()              => api.get('/admin/audio/pending'),
  approveAudio:      (id)            => api.put(`/admin/audio/${id}/approve`),
  rejectAudio:       (id, data)      => api.put(`/admin/audio/${id}/reject`, data),
  logs:              (params)        => api.get('/admin/logs', { params }),
}

export default api
