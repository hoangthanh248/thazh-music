import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const navigate      = useNavigate()
  const { register }  = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '', display_name: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handle = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) return toast.error('Mật khẩu phải ít nhất 8 ký tự')
    setLoading(true)
    try {
      await register(form)
      toast.success('Tạo tài khoản thành công! 🎉')
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
            <User size={24} className="text-pink-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Tạo tài khoản</h1>
          <p className="text-white/40 text-sm mt-1">Bắt đầu hành trình âm nhạc của bạn</p>
        </div>

        <form onSubmit={handle} className="space-y-4">
          {[
            { key: 'display_name', label: 'Tên hiển thị', placeholder: 'Tên của bạn', type: 'text' },
            { key: 'username', label: 'Tên đăng nhập', placeholder: 'username', type: 'text' },
            { key: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">{label}</label>
              <input
                type={type}
                required
                value={form[key]}
                onChange={set(key)}
                className="input-field"
                placeholder={placeholder}
              />
            </div>
          ))}

          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                required
                minLength={8}
                value={form.password}
                onChange={set('password')}
                className="input-field pr-12"
                placeholder="Tối thiểu 8 ký tự"
              />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-pink w-full py-4 mt-2">
            {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
          </button>

          <p className="text-center text-white/40 text-sm pt-2">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-pink-400 font-semibold hover:underline">Đăng nhập</Link>
          </p>
          <p className="text-center text-white/30 text-xs">
            Bằng cách đăng ký, bạn đồng ý với{' '}
            <Link to="/terms" className="text-pink-400 hover:underline">Điều khoản dịch vụ</Link>
            {' '}và{' '}
            <Link to="/privacy" className="text-pink-400 hover:underline">Chính sách bảo mật</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
