import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Video, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { musicAPI } from '../api/client'
import { useAuth } from '../context/AuthContext'
import UploadZone from '../components/UploadZone'

export default function UploadMVPage() {
  const navigate     = useNavigate()
  const { isArtist } = useAuth()
  const [form, setForm] = useState({ title: '', description: '' })
  const [videoUrl, setVideoUrl]         = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState(null)
  const [videoPublicId, setVideoPublicId] = useState(null)
  const [videoDuration, setVideoDuration] = useState(0)
  const [submitting, setSubmitting]     = useState(false)
  const [done, setDone] = useState(false)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  if (!isArtist) { navigate('/home'); return null }

  const handleVideoUpload = async (file, onProgress) => {
    const fd = new FormData()
    fd.append('file', file)
    const { data } = await musicAPI.uploadVideo(fd, onProgress)
    setVideoUrl(data.url)
    setVideoPublicId(data.public_id)
    setVideoDuration(Math.round(data.duration || 0))
    return data
  }

  const handleThumbUpload = async (file) => {
    const fd = new FormData()
    fd.append('file', file)
    const { data } = await musicAPI.uploadCover(fd)
    setThumbnailUrl(data.url)
    return data
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!videoUrl) return toast.error('Vui lòng upload file video')
    if (!form.title) return toast.error('Vui lòng nhập tiêu đề M/V')
    setSubmitting(true)
    try {
      await musicAPI.createMV({
        title: form.title,
        description: form.description || null,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || null,
        cloudinary_public_id: videoPublicId,
        duration: videoDuration,
      })
      setDone(true)
      toast.success('Đã tải M/V! Đang chờ duyệt.')
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Tải M/V thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) return (
    <div className="bg-app min-h-screen flex flex-col items-center justify-center px-6 text-center gap-5">
      <div className="w-20 h-20 rounded-full bg-emerald-400/20 flex items-center justify-center">
        <CheckCircle size={44} className="text-emerald-400" />
      </div>
      <h2 className="text-2xl font-bold text-white">M/V đã được tải lên!</h2>
      <p className="text-white/50 max-w-xs">M/V đang chờ admin duyệt. Sau khi duyệt sẽ xuất hiện trên Thazh.</p>
      <div className="flex gap-3">
        <button onClick={() => setDone(false)} className="btn-ghost">Tải M/V khác</button>
        <button onClick={() => navigate('/profile')} className="btn-pink">Về trang cá nhân</button>
      </div>
    </div>
  )

  return (
    <div className="bg-app min-h-screen px-4 py-10">
      <div className="max-w-sm mx-auto">
        <button onClick={() => navigate(-1)} className="text-white/50 hover:text-white mb-8 flex items-center gap-2">
          <ArrowLeft size={20} /> Quay lại
        </button>
        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl bg-pink-400/20 flex items-center justify-center mb-4">
            <Video size={24} className="text-pink-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Tải lên M/V</h1>
          <p className="text-white/40 text-sm mt-1">MP4, MOV – tối đa 500MB</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">File video *</p>
            <UploadZone
              label="Kéo thả file M/V vào đây"
              accept={{ 'video/*': ['.mp4', '.mov', '.avi'] }}
              maxSize={500 * 1024 * 1024}
              hint="MP4 · MOV · AVI – tối đa 500MB"
              onUpload={handleVideoUpload}
            />
          </div>

          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Thumbnail</p>
            <UploadZone
              label="Ảnh thumbnail cho M/V"
              accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
              maxSize={10 * 1024 * 1024}
              hint="16:9 tốt nhất"
              onUpload={handleThumbUpload}
            />
          </div>

          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Tiêu đề M/V *</label>
            <input type="text" required value={form.title} onChange={set('title')}
              className="input-field" placeholder="Tên M/V" />
          </div>
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Mô tả</label>
            <textarea rows={4} value={form.description} onChange={set('description')}
              className="input-field resize-none" placeholder="Mô tả về M/V..." />
          </div>

          <div className="glass rounded-xl p-4 flex items-start gap-3">
            <span className="text-amber-400 text-lg">⚠</span>
            <p className="text-white/50 text-xs leading-relaxed">
              M/V sẽ được admin xem xét trước khi xuất hiện. Upload video có bản quyền đầy đủ.
            </p>
          </div>

          <button type="submit" disabled={submitting || !videoUrl} className="btn-pink w-full py-4">
            {submitting ? 'Đang tải lên...' : 'Tải lên M/V'}
          </button>
        </form>
      </div>
    </div>
  )
}
