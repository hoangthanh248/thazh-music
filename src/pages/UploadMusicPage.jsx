import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Music2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { musicAPI } from '../api/client'
import { useAuth } from '../context/AuthContext'
import UploadZone from '../components/UploadZone'

const GENRES = ['Pop','R&B','Hip-Hop','EDM','Rock','Indie','Ballad','Jazz','Classical','Folk','Rap','Khác']

export default function UploadMusicPage() {
  const navigate  = useNavigate()
  const { isArtist } = useAuth()
  const [form, setForm] = useState({ title: '', genre: '', lyrics: '' })
  const [coverUrl, setCoverUrl]     = useState(null)
  const [audioUrl, setAudioUrl]     = useState(null)
  const [audioDuration, setAudioDuration] = useState(0)
  const [audioPublicId, setAudioPublicId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  if (!isArtist) {
    navigate('/home')
    return null
  }

  const handleCoverUpload = async (file) => {
    const form = new FormData()
    form.append('file', file)
    const { data } = await musicAPI.uploadCover(form)
    setCoverUrl(data.url)
    return data
  }

  const handleAudioUpload = async (file, onProgress) => {
    const form = new FormData()
    form.append('file', file)
    const { data } = await musicAPI.uploadAudio(form, onProgress)
    setAudioUrl(data.url)
    setAudioDuration(Math.round(data.duration || 0))
    setAudioPublicId(data.public_id)
    return data
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!audioUrl) return toast.error('Vui lòng upload file nhạc')
    if (!form.title) return toast.error('Vui lòng nhập tên bài nhạc')
    setSubmitting(true)
    try {
      await musicAPI.create({
        title: form.title,
        genre: form.genre || null,
        lyrics: form.lyrics || null,
        cover_url: coverUrl || null,
        audio_url: audioUrl,
        cloudinary_public_id: audioPublicId,
        duration: audioDuration,
      })
      setDone(true)
      toast.success('Đã tải nhạc! Đang chờ duyệt.')
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Tải nhạc thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) return (
    <div className="bg-app min-h-screen flex flex-col items-center justify-center px-6 text-center gap-5">
      <div className="w-20 h-20 rounded-full bg-emerald-400/20 flex items-center justify-center">
        <CheckCircle size={44} className="text-emerald-400" />
      </div>
      <h2 className="text-2xl font-bold text-white">Đã tải lên!</h2>
      <p className="text-white/50 max-w-xs">Bài nhạc của bạn đang được admin xem xét. Sau khi duyệt sẽ xuất hiện trên Thazh.</p>
      <div className="flex gap-3">
        <button onClick={() => setDone(false)} className="btn-ghost">Tải thêm</button>
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
            <Music2 size={24} className="text-pink-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Tải lên nhạc</h1>
          <p className="text-white/40 text-sm mt-1">MP3, WAV, FLAC – tối đa 100MB</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Audio file */}
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">File nhạc *</p>
            <UploadZone
              label="Kéo thả file nhạc vào đây"
              accept={{ 'audio/*': ['.mp3', '.wav', '.flac'] }}
              maxSize={100 * 1024 * 1024}
              hint="MP3 · WAV · FLAC – tối đa 100MB"
              onUpload={handleAudioUpload}
            />
          </div>

          {/* Cover */}
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Ảnh bìa</p>
            <UploadZone
              label="Ảnh bìa bài nhạc"
              accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
              maxSize={10 * 1024 * 1024}
              hint="JPEG · PNG · WEBP – 1:1 tốt nhất"
              onUpload={handleCoverUpload}
            />
            {coverUrl && (
              <div className="mt-3 flex items-center gap-3 glass rounded-xl p-3">
                <img src={coverUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <p className="text-white/60 text-xs">Ảnh bìa đã được tải lên</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Tên bài nhạc *</label>
            <input type="text" required value={form.title} onChange={set('title')}
              className="input-field" placeholder="Tên bài nhạc" />
          </div>

          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Thể loại</label>
            <select value={form.genre} onChange={set('genre')} className="input-field">
              <option value="">Chọn thể loại</option>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Lời bài hát</label>
            <textarea rows={6} value={form.lyrics} onChange={set('lyrics')}
              className="input-field resize-none" placeholder="Dán lời bài hát vào đây..." />
          </div>

          <div className="glass rounded-xl p-4 flex items-start gap-3">
            <span className="text-amber-400 text-lg">⚠</span>
            <p className="text-white/50 text-xs leading-relaxed">
              Bài nhạc sẽ được admin xem xét trước khi xuất hiện công khai.
              Không tải nhạc vi phạm bản quyền.
            </p>
          </div>

          <button type="submit" disabled={submitting || !audioUrl} className="btn-pink w-full py-4">
            {submitting ? 'Đang tải lên...' : 'Tải lên bài nhạc'}
          </button>
        </form>
      </div>
    </div>
  )
}
