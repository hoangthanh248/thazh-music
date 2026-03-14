import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Music2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate   = useNavigate()
  const { login }  = useAuth()
  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/home')
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-app min-h-screen flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-pink-400 flex items-center justify-center animate-pulse-pink">
          <Music2 size={30} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Thazh</h1>
        <p className="text-white/40 text-sm">Âm nhạc không giới hạn</p>
      </div>

      <form onSubmit={handle} className="w-full max-w-sm space-y-4">
        <div>
          <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">
            Email
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
            className="input-field"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              required
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              className="input-field pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              onClick={() => setShowPwd(v => !v)}
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-pink w-full mt-6 py-4">
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        <div className="text-center space-y-3 pt-2">
          <p className="text-white/40 text-sm">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-pink-400 font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
          <p className="text-white/30 text-sm">
            Là nghệ sĩ?{' '}
            <Link to="/register/artist" className="text-pink-400 font-semibold hover:underline">
              Tạo tài khoản artist
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
