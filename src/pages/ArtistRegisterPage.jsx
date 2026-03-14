import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mic2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const GENRES = ['Pop', 'R&B', 'Hip-Hop', 'EDM', 'Rock', 'Indie', 'Ballad', 'Jazz', 'Classical', 'Khác']

export default function ArtistRegisterPage() {
  const navigate           = useNavigate()
  const { registerArtist } = useAuth()
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    stage_name: '', genre: '', country: 'Việt Nam', bio: '',
  })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handle = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) return toast.error('Mật khẩu phải ít nhất 8 ký tự')
    setLoading(true)
    try {
      await registerArtist(form)
      toast.success('Tài khoản artist đã được tạo! 🎤')
      navigate('/home')
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-app min-h-screen px-6 py-10">
      <div className="max-w-sm mx-auto">
        <button onClick={() => navigate(-1)} className="text-white/50 hover:text-white mb-8 flex items-center gap-2">
          <ArrowLeft size={20} /> Quay lại
        </button>

        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl bg-pink-400/20 flex items-center justify-center mb-4">
            <Mic2 size={24} className="text-pink-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Tài khoản Artist</h1>
          <p className="text-white/40 text-sm mt-1">Tải nhạc, M/V và tiếp cận fan của bạn</p>
        </div>

        {/* Artist perks */}
        <div className="glass rounded-2xl p-4 mb-6 space-y-2">
          {['✦ Tải lên nhạc và M/V', '✦ Xem thống kê lượt nghe', '✦ Xin xác minh tick hồng ✓'].map(p => (
            <p key={p} className="text-white/60 text-sm">{p}</p>
          ))}
        </div>

        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Tên nghệ danh *</label>
            <input type="text" required value={form.stage_name} onChange={set('stage_name')}
              className="input-field" placeholder="Tên nghệ danh của bạn" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Thể loại</label>
              <select value={form.genre} onChange={set('genre')} className="input-field">
                <option value="">Chọn thể loại</option>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Quốc gia</label>
              <input type="text" value={form.country} onChange={set('country')} className="input-field" placeholder="Việt Nam" />
            </div>
          </div>

          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Tên đăng nhập *</label>
            <input type="text" required value={form.username} onChange={set('username')}
              className="input-field" placeholder="username" />
          </div>
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Email *</label>
            <input type="email" required value={form.email} onChange={set('email')}
              className="input-field" placeholder="artist@example.com" />
          </div>
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Mật khẩu *</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} required minLength={8}
                value={form.password} onChange={set('password')}
                className="input-field pr-12" placeholder="Tối thiểu 8 ký tự" />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Giới thiệu</label>
            <textarea rows={3} value={form.bio} onChange={set('bio')}
              className="input-field resize-none" placeholder="Một vài dòng về bạn..." />
          </div>

          <button type="submit" disabled={loading} className="btn-pink w-full py-4 mt-2">
            {loading ? 'Đang tạo...' : 'Tạo tài khoản Artist'}
          </button>

          <p className="text-center text-white/40 text-sm pt-2">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-pink-400 font-semibold hover:underline">Đăng nhập</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
