import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Flag, CheckCircle, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

const CONTENT_TYPES = [
  { id: 'music',   label: '🎵 Bài nhạc' },
  { id: 'mv',      label: '🎬 M/V' },
  { id: 'audio',   label: '🎧 Audio / Podcast' },
  { id: 'profile', label: '👤 Hồ sơ người dùng' },
]

const REASONS = [
  { id: 'copyright',     label: '© Vi phạm bản quyền', desc: 'Nội dung sử dụng tác phẩm của tôi mà không được phép' },
  { id: 'inappropriate', label: '🔞 Nội dung không phù hợp', desc: 'Khiêu dâm, bạo lực, ngôn ngữ thù địch...' },
  { id: 'spam',          label: '🚫 Spam / Lừa đảo', desc: 'Nội dung spam, giả mạo hoặc gây hiểu lầm' },
  { id: 'misinformation',label: '❌ Thông tin sai lệch', desc: 'Tin giả, thông tin gây hại cộng đồng' },
  { id: 'hate_speech',   label: '💢 Kỳ thị / Phân biệt', desc: 'Phân biệt chủng tộc, giới tính, tôn giáo...' },
  { id: 'privacy',       label: '🔒 Vi phạm quyền riêng tư', desc: 'Chia sẻ thông tin cá nhân trái phép' },
  { id: 'other',         label: '📋 Lý do khác', desc: 'Lý do khác không có trong danh sách' },
]

export default function ReportContentPage() {
  const navigate       = useNavigate()
  const [params]       = useSearchParams()
  const { user }       = useAuth()

  const [form, setForm] = useState({
    content_type: params.get('type') || 'music',
    content_id:   params.get('id')   || '',
    content_url:  params.get('url')  || '',
    reason:       '',
    description:  '',
    reporter_name:    user?.display_name || user?.username || '',
    reporter_email:   user?.email || '',
    evidence_urls:    '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]             = useState(false)
  const [ticketId, setTicketId]     = useState(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.reason)       return toast.error('Vui lòng chọn lý do báo cáo')
    if (!form.description || form.description.trim().length < 20)
      return toast.error('Mô tả cần ít nhất 20 ký tự')
    if (!form.reporter_email) return toast.error('Vui lòng nhập email liên hệ')

    setSubmitting(true)
    try {
      const payload = {
        ...form,
        evidence_urls: form.evidence_urls
          ? form.evidence_urls.split('\n').map(u => u.trim()).filter(Boolean)
          : [],
        reporter_user_id: user?.id || null,
      }
      const { data } = await api.post('/reports', payload)
      setTicketId(data.ticket_id)
      setDone(true)
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Gửi báo cáo thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── SUCCESS SCREEN ───────────────────────────────────────────
  if (done) return (
    <div className="bg-app min-h-screen flex flex-col items-center justify-center px-6 text-center gap-5">
      <div className="w-20 h-20 rounded-full bg-emerald-400/15 flex items-center justify-center">
        <CheckCircle size={44} className="text-emerald-400" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Báo cáo đã gửi!</h2>
        <p className="text-white/50 max-w-xs leading-relaxed">
          Chúng tôi đã nhận được báo cáo của bạn và sẽ xem xét trong vòng <strong className="text-white">3–5 ngày làm việc</strong>.
        </p>
      </div>

      {ticketId && (
        <div className="glass rounded-2xl px-6 py-4 text-center">
          <p className="text-white/40 text-xs mb-1">Mã tra cứu báo cáo</p>
          <p className="text-pink-400 font-mono font-bold text-lg tracking-widest">{ticketId}</p>
          <p className="text-white/30 text-xs mt-1">Lưu mã này để theo dõi trạng thái</p>
        </div>
      )}

      <div className="glass rounded-2xl p-4 max-w-xs text-left space-y-2">
        <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Bước tiếp theo</p>
        {[
          'Chúng tôi sẽ kiểm tra nội dung được báo cáo',
          'Email xác nhận sẽ được gửi đến địa chỉ bạn cung cấp',
          'Nếu vi phạm được xác nhận, nội dung sẽ bị gỡ trong 24–48 giờ',
          'Kết quả xử lý sẽ được thông báo qua email',
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-2 text-white/50 text-sm">
            <span className="text-pink-400 font-bold flex-shrink-0">{i + 1}.</span> {s}
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-2">
        <button onClick={() => navigate(-1)} className="btn-ghost px-5 py-3">
          Quay lại
        </button>
        <button onClick={() => navigate('/home')} className="btn-pink px-5 py-3">
          Về trang chủ
        </button>
      </div>
    </div>
  )

  // ── FORM ────────────────────────────────────────────────────
  return (
    <div className="bg-app min-h-screen px-4 py-10">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <button onClick={() => navigate(-1)} className="text-white/50 hover:text-white mb-8 flex items-center gap-2">
          <ArrowLeft size={20} /> Quay lại
        </button>

        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl bg-red-400/15 flex items-center justify-center mb-4">
            <Flag size={24} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Yêu cầu gỡ nội dung</h1>
          <p className="text-white/40 text-sm mt-1 leading-relaxed">
            Báo cáo nội dung vi phạm để được xem xét và gỡ bỏ khỏi nền tảng Thazh.
          </p>
        </div>

        {/* Notice */}
        <div className="glass rounded-2xl p-4 mb-6 flex items-start gap-3 border border-amber-400/20">
          <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-white/50 text-xs leading-relaxed">
            Báo cáo sai sự thật có thể bị xử lý theo chính sách của Thazh.
            Chỉ báo cáo khi bạn có đủ căn cứ.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">

          {/* ── Loại nội dung ── */}
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">
              Loại nội dung cần báo cáo *
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CONTENT_TYPES.map(ct => (
                <button
                  key={ct.id}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, content_type: ct.id }))}
                  className={`glass rounded-xl py-3 text-sm font-semibold transition-all text-center
                    ${form.content_type === ct.id
                      ? 'border-pink-400 bg-pink-400/15 text-pink-400'
                      : 'text-white/50 hover:text-white/80'}`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── ID / URL nội dung ── */}
          <div className="space-y-3">
            <div>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">
                ID nội dung
              </label>
              <input
                type="text"
                value={form.content_id}
                onChange={set('content_id')}
                className="input-field"
                placeholder="VD: 42 (lấy từ URL trang nội dung)"
              />
            </div>
            <div>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">
                URL nội dung
              </label>
              <input
                type="url"
                value={form.content_url}
                onChange={set('content_url')}
                className="input-field"
                placeholder="https://thazh.vercel.app/music/42"
              />
            </div>
          </div>

          {/* ── Lý do báo cáo ── */}
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">
              Lý do báo cáo *
            </p>
            <div className="space-y-2">
              {REASONS.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, reason: r.id }))}
                  className={`w-full glass rounded-xl p-3.5 text-left transition-all
                    ${form.reason === r.id
                      ? 'border-pink-400 bg-pink-400/10'
                      : 'hover:border-white/20'}`}
                >
                  <p className={`text-sm font-semibold ${form.reason === r.id ? 'text-pink-400' : 'text-white'}`}>
                    {r.label}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ── Mô tả chi tiết ── */}
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">
              Mô tả chi tiết *
            </label>
            <textarea
              rows={5}
              required
              minLength={20}
              value={form.description}
              onChange={set('description')}
              className="input-field resize-none"
              placeholder="Mô tả rõ vấn đề bạn gặp phải. Càng chi tiết càng giúp chúng tôi xử lý nhanh hơn. (Tối thiểu 20 ký tự)"
            />
            <p className="text-white/25 text-xs mt-1 text-right">{form.description.length} ký tự</p>
          </div>

          {/* ── Bằng chứng ── */}
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">
              Link bằng chứng <span className="text-white/30 font-normal">(tùy chọn)</span>
            </label>
            <textarea
              rows={3}
              value={form.evidence_urls}
              onChange={set('evidence_urls')}
              className="input-field resize-none"
              placeholder="Mỗi link một dòng&#10;VD: https://drive.google.com/..."
            />
            <p className="text-white/30 text-xs mt-1">Ảnh chụp màn hình, link chứng minh bản quyền, v.v.</p>
          </div>

          {/* ── Thông tin liên hệ ── */}
          <div className="space-y-3">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">
              Thông tin liên hệ *
            </p>
            <div>
              <label className="text-white/40 text-xs mb-1.5 block">Tên của bạn</label>
              <input
                type="text"
                value={form.reporter_name}
                onChange={set('reporter_name')}
                className="input-field"
                placeholder="Tên đầy đủ hoặc tổ chức"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1.5 block">Email *</label>
              <input
                type="email"
                required
                value={form.reporter_email}
                onChange={set('reporter_email')}
                className="input-field"
                placeholder="email@example.com"
              />
              <p className="text-white/25 text-xs mt-1">Kết quả xử lý sẽ được gửi qua email này</p>
            </div>
          </div>

          {/* ── Cam kết ── */}
          <div className="glass rounded-xl p-4 space-y-2">
            <p className="text-white/60 text-xs font-semibold">Bằng cách gửi báo cáo này, tôi xác nhận:</p>
            {[
              'Thông tin tôi cung cấp là trung thực và chính xác',
              'Tôi có quyền hợp pháp để gửi yêu cầu này',
              'Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của Thazh',
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-white/40 text-xs">
                <span className="text-pink-400 flex-shrink-0 mt-0.5">✓</span> {c}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting || !form.reason}
            className="btn-pink w-full py-4 flex items-center justify-center gap-2"
          >
            <Flag size={17} />
            {submitting ? 'Đang gửi báo cáo...' : 'Gửi yêu cầu gỡ nội dung'}
          </button>

          <p className="text-center text-white/25 text-xs pb-4">
            Báo cáo khẩn về nội dung nguy hiểm? Liên hệ ngay:{' '}
            <a href="mailto:report@thazh.com" className="text-pink-400 hover:underline">
              report@thazh.com
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
