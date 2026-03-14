import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Clock, XCircle, Upload, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { artistAPI } from '../api/client'
import { useAuth } from '../context/AuthContext'

const VERIFY_TYPES = [
  { id: 'individual', label: 'Cá nhân', desc: 'Nghệ sĩ solo, rapper, ca sĩ...' },
  { id: 'band',       label: 'Ban nhạc / Nhóm', desc: 'Ban nhạc, idol group...' },
  { id: 'label',      label: 'Label âm nhạc', desc: 'Công ty, nhãn hiệu âm nhạc' },
]

const DOC_HINTS = [
  'CMND/CCCD (nghệ sĩ cá nhân)',
  'Giấy phép hoạt động nghệ thuật',
  'Link mạng xã hội chính thức (có nhiều followers)',
  'Hợp đồng với label / đơn vị quản lý',
  'Bằng chứng hoạt động nghệ thuật (bài viết báo, v.v.)',
]

export default function ArtistVerifyPage() {
  const navigate         = useNavigate()
  const { user, isArtist } = useAuth()
  const [profile, setProfile]   = useState(null)
  const [type, setType]         = useState('individual')
  const [docs, setDocs]         = useState([])       // uploaded doc URLs
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isArtist) { navigate('/home'); return }
    artistAPI.myProfile().then(r => setProfile(r.data)).catch(() => {})
  }, [isArtist, navigate])

  const uploadDoc = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (docs.length >= 5) return toast.error('Tối đa 5 tài liệu')
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const { data } = await artistAPI.uploadDoc(form)
      setDocs(d => [...d, data.url])
      toast.success('Đã tải tài liệu')
    } catch {
      toast.error('Upload thất bại')
    } finally {
      setUploading(false)
    }
  }

  const submit = async () => {
    if (!docs.length) return toast.error('Vui lòng tải lên ít nhất 1 tài liệu')
    setSubmitting(true)
    try {
      await artistAPI.submitVerify({ verification_type: type, doc_urls: docs })
      toast.success('Đã gửi yêu cầu xác minh! Chúng tôi sẽ xem xét trong 3-5 ngày làm việc.')
      navigate('/profile')
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Gửi thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  // Status display
  const renderStatus = () => {
    if (!profile) return null
    const s = profile.verification_status
    if (s === 'approved' || profile.is_officially_verified) return (
      <div className="glass rounded-2xl p-6 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-pink-400 flex items-center justify-center mx-auto text-3xl">✓</div>
        <h2 className="text-xl font-bold text-white">Đã xác minh!</h2>
        <p className="text-white/50 text-sm">Tài khoản của bạn đã được xác minh chính thức với tick hồng ✓</p>
      </div>
    )
    if (s === 'pending') return (
      <div className="glass rounded-2xl p-6 text-center space-y-3">
        <Clock size={48} className="text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Đang xem xét</h2>
        <p className="text-white/50 text-sm">Yêu cầu của bạn đang được admin xem xét. Thường mất 3-5 ngày làm việc.</p>
      </div>
    )
    if (s === 'rejected') return (
      <div className="space-y-4">
        <div className="glass rounded-2xl p-4 border border-red-400/30">
          <div className="flex items-center gap-3 mb-2">
            <XCircle size={20} className="text-red-400" />
            <p className="text-red-400 font-semibold">Yêu cầu bị từ chối</p>
          </div>
          {profile.rejection_reason && (
            <p className="text-white/50 text-sm">{profile.rejection_reason}</p>
          )}
        </div>
        <p className="text-white/40 text-sm text-center">Bạn có thể gửi lại yêu cầu với tài liệu khác.</p>
        {renderForm()}
      </div>
    )
    return renderForm()
  }

  const renderForm = () => (
    <div className="space-y-6">
      {/* Type */}
      <div>
        <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Loại tài khoản</p>
        <div className="space-y-2">
          {VERIFY_TYPES.map(vt => (
            <button
              key={vt.id}
              onClick={() => setType(vt.id)}
              className={`w-full glass rounded-xl p-4 text-left transition-all
                ${type === vt.id ? 'border-pink-400 bg-pink-400/10' : 'border-transparent'}`}
            >
              <p className="text-white font-semibold text-sm">{vt.label}</p>
              <p className="text-white/40 text-xs mt-0.5">{vt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Docs needed */}
      <div className="glass rounded-xl p-4">
        <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Tài liệu cần cung cấp</p>
        <ul className="space-y-1.5">
          {DOC_HINTS.map(h => (
            <li key={h} className="flex items-start gap-2 text-white/50 text-xs">
              <span className="text-pink-400 mt-0.5">·</span> {h}
            </li>
          ))}
        </ul>
      </div>

      {/* Upload docs */}
      <div>
        <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">
          Tải lên tài liệu ({docs.length}/5)
        </p>
        <label className={`upload-zone ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <input type="file" className="hidden" onChange={uploadDoc} accept="image/*,.pdf" disabled={uploading} />
          <Upload size={24} className="text-white/30" />
          <p className="text-white/50 text-sm">{uploading ? 'Đang upload...' : 'Click để tải tài liệu'}</p>
          <p className="text-white/30 text-xs">JPEG, PNG, PDF – tối đa 10MB</p>
        </label>
        {docs.length > 0 && (
          <div className="mt-3 space-y-2">
            {docs.map((url, i) => (
              <div key={i} className="glass rounded-xl px-4 py-2 flex items-center justify-between">
                <p className="text-white/60 text-xs truncate flex-1">Tài liệu {i + 1}</p>
                <button onClick={() => setDocs(d => d.filter((_, j) => j !== i))}
                  className="text-red-400 text-xs ml-3">Xóa</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={submit} disabled={submitting || !docs.length} className="btn-pink w-full py-4">
        {submitting ? 'Đang gửi...' : 'Gửi yêu cầu xác minh'}
      </button>
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
            <ShieldCheck size={24} className="text-pink-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Xác minh Artist</h1>
          <p className="text-white/40 text-sm mt-1">Nhận tick hồng ✓ xác minh chính thức</p>
        </div>

        {renderStatus()}
      </div>
    </div>
  )
}
