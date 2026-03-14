import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Headphones, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { audioAPI } from '../api/client'
import { useAuth } from '../context/AuthContext'
import UploadZone from '../components/UploadZone'

const CATEGORIES = [
  { id: 'story',      label: '📖 Truyện' },
  { id: 'podcast',    label: '🎙 Podcast' },
  { id: 'education',  label: '🎓 Giáo dục' },
  { id: 'meditation', label: '🧘 Thiền' },
  { id: 'news',       label: '📰 Tin tức' },
  { id: 'other',      label: '🎵 Khác' },
]

export default function UploadAudioPage() {
  const navigate     = useNavigate()
  const { isLoggedIn } = useAuth()
  const [form, setForm] = useState({ title: '', description: '', category: 'story', tags: '' })
  const [audioUrl, setAudioUrl]     = useState(null)
  const [coverUrl, setCoverUrl]     = useState(null)
  const [audioPublicId, setAudioPublicId] = useState(null)
  const [audioDuration, setAudioDuration] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  if (!isLoggedIn) { navigate('/login'); return null }

  const handleAudioUpload = async (file, onProgress) => {
    const fd = new FormData()
    fd.append('file', file)
    const { data } = await audioAPI.uploadFile(fd, onProgress)
    setAudioUrl(data.url)
    setAudioPublicId(data.public_id)
    setAudioDuration(Math.round(data.duration || 0))
    return data
  }

  const handleCoverUpload = async (file) => {
    const fd = new FormData()
    fd.append('file', file)
    const { data } = await audioAPI.uploadCover(fd)
    setCoverUrl(data.url)
    return data
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!audioUrl) return toast.error('Vui lòng upload file audio')
    if (!form.title) return toast.error('Vui lòng nhập tiêu đề')
    setSubmitting(true)
    try {
      const tags = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      await audioAPI.create({
        title: form.title,
        description: form.description || null,
        cover_url: coverUrl || null,
        audio_url: audioUrl,
        cloudinary_public_id: audioPublicId,
        duration: audioDuration,
        category: form.category,
        tags,
      })
      setDone(true)
      toast.success('Đã tải audio! Đang chờ duyệt.')
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Tải audio thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) return (
    <div className="bg-app min-h-screen flex flex-col items-center justify-center px-6 text-center gap-5">
      <div className="w-20 h-20 rounded-full bg-emerald-400/20 flex items-center justify-center">
        <CheckCircle size={44} className="text-emerald-400" />
      </div>
      <h2 className="text-2xl font-bold text-white">Audio đã được tải lên!</h2>
      <p className="text-white/50 max-w-xs">Nội dung đang chờ admin duyệt và sẽ sớm xuất hiện.</p>
      <div className="flex gap-3">
        <button onClick={() => { setDone(false); setAudioUrl(null); setCoverUrl(null); setForm({ title: '', description: '', category: 'story', tags: '' }) }} className="btn-ghost">Tải thêm</button>
        <button onClick={() => navigate('/audio')} className="btn-pink">Trang Audio</button>
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
            <Headphones size={24} className="text-pink-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Tải lên Audio</h1>
          <p className="text-white/40 text-sm mt-1">Truyện, podcast, thiền, tin tức... – mở cho tất cả</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">File audio *</p>
            <UploadZone
              label="Kéo thả file audio"
              accept={{ 'audio/*': ['.mp3', '.wav', '.ogg'] }}
              maxSize={200 * 1024 * 1024}
              hint="MP3 · WAV · OGG – tối đa 200MB"
              onUpload={handleAudioUpload}
            />
          </div>

          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Ảnh bìa</p>
            <UploadZone
              label="Ảnh bìa tập audio"
              accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
              maxSize={5 * 1024 * 1024}
              hint="JPEG · PNG · 1:1 tốt nhất"
              onUpload={handleCoverUpload}
            />
          </div>

          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Tiêu đề *</label>
            <input type="text" required value={form.title} onChange={set('title')}
              className="input-field" placeholder="Tên tập audio" />
          </div>

          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Danh mục</p>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(c => (
                <button key={c.id} type="button" onClick={() => setForm(f => ({ ...f, category: c.id }))}
                  className={`glass rounded-xl py-2.5 text-center text-xs font-semibold transition-all
                    ${form.category === c.id ? 'border-pink-400 bg-pink-400/15 text-pink-400' : 'text-white/50'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Mô tả</label>
            <textarea rows={3} value={form.description} onChange={set('description')}
              className="input-field resize-none" placeholder="Mô tả nội dung audio..." />
          </div>

          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Tags</label>
            <input type="text" value={form.tags} onChange={set('tags')}
              className="input-field" placeholder="thiền, thư giãn, ngủ (phân cách bằng dấu phẩy)" />
          </div>

          <button type="submit" disabled={submitting || !audioUrl} className="btn-pink w-full py-4">
            {submitting ? 'Đang tải lên...' : 'Đăng audio'}
          </button>
        </form>
      </div>
    </div>
  )
}
