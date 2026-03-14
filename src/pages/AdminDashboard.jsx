import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Music2, Video, BookOpen,
  ShieldCheck, FileText, CheckCircle, XCircle, Eye,
  ArrowLeft, RefreshCw, Flag
} from 'lucide-react'
import toast from 'react-hot-toast'
import { adminAPI } from '../api/client'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

const TABS = [
  { id: 'stats',         label: 'Tổng quan',    icon: LayoutDashboard },
  { id: 'users',         label: 'Người dùng',   icon: Users },
  { id: 'verifications', label: 'Xác minh',     icon: ShieldCheck },
  { id: 'music',         label: 'Nhạc',         icon: Music2 },
  { id: 'mv',            label: 'M/V',          icon: Video },
  { id: 'audio',         label: 'Audio',        icon: BookOpen },
  { id: 'reports',       label: 'Báo cáo',      icon: Flag },
  { id: 'logs',          label: 'Nhật ký',      icon: FileText },
]

function StatBox({ label, value, color = 'pink' }) {
  return (
    <div className="glass rounded-2xl p-4 text-center">
      <p className={`text-2xl font-bold text-${color}-400`}>{value?.toLocaleString() || 0}</p>
      <p className="text-white/50 text-xs mt-1">{label}</p>
    </div>
  )
}

function ActionButtons({ onApprove, onReject, item, type }) {
  const [loading, setLoading] = useState(null)
  const [reason, setReason]   = useState('')
  const [showReject, setShowReject] = useState(false)

  const approve = async () => {
    setLoading('approve')
    try { await onApprove(item.id); toast.success('Đã duyệt') }
    catch { toast.error('Thất bại') }
    finally { setLoading(null) }
  }
  const reject = async () => {
    if (!reason) return toast.error('Nhập lý do từ chối')
    setLoading('reject')
    try { await onReject(item.id, { action: 'reject', rejection_reason: reason }); toast.success('Đã từ chối') }
    catch { toast.error('Thất bại') }
    finally { setLoading(null); setShowReject(false) }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button onClick={approve} disabled={loading === 'approve'}
          className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-500/30 transition">
          <CheckCircle size={13} /> {loading === 'approve' ? '...' : 'Duyệt'}
        </button>
        <button onClick={() => setShowReject(v => !v)}
          className="flex items-center gap-1 bg-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition">
          <XCircle size={13} /> Từ chối
        </button>
      </div>
      {showReject && (
        <div className="flex gap-2">
          <input value={reason} onChange={e => setReason(e.target.value)}
            className="input-field text-xs py-2 flex-1" placeholder="Lý do từ chối..." />
          <button onClick={reject} disabled={loading === 'reject'}
            className="bg-red-500/20 text-red-400 text-xs px-3 rounded-lg">
            {loading === 'reject' ? '...' : 'Gửi'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const navigate    = useNavigate()
  const { isAdmin } = useAuth()
  const [tab, setTab]     = useState('stats')
  const [stats, setStats] = useState(null)
  const [data, setData]   = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAdmin) { navigate('/home'); return }
    loadStats()
  }, [isAdmin, navigate])

  const loadStats = () => {
    adminAPI.stats().then(r => setStats(r.data)).catch(() => {})
  }

  const loadTab = async (t) => {
    setTab(t)
    setData([])
    if (t === 'stats') { loadStats(); return }
    setLoading(true)
    try {
      let res
      if (t === 'users')         res = await adminAPI.users()
      if (t === 'verifications') res = await adminAPI.verifications('pending')
      if (t === 'music')         res = await adminAPI.pendingMusic()
      if (t === 'mv')            res = await adminAPI.pendingMVs()
      if (t === 'audio')         res = await adminAPI.pendingAudio()
      if (t === 'reports')       res = await api.get('/reports/admin/list')
      if (t === 'logs')          res = await adminAPI.logs()
      setData(res?.data || [])
    } catch { toast.error('Tải dữ liệu thất bại') }
    finally { setLoading(false) }
  }

  // Reload current tab after action
  const reload = () => loadTab(tab)

  const renderStats = () => !stats ? (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 8 }).map((_, i) => <div key={i} className="glass rounded-2xl h-20 animate-pulse" />)}
    </div>
  ) : (
    <div className="space-y-5">
      <div>
        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Người dùng</p>
        <div className="grid grid-cols-3 gap-2">
          <StatBox label="Tổng" value={stats.users?.total} color="pink" />
          <StatBox label="Artist" value={stats.users?.artists} color="purple" />
          <StatBox label="Thường" value={stats.users?.regular} color="blue" />
        </div>
      </div>
      <div>
        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Nội dung chờ duyệt</p>
        <div className="grid grid-cols-3 gap-2">
          <StatBox label="Nhạc" value={stats.content?.music_pending} color="amber" />
          <StatBox label="M/V" value={stats.content?.mv_pending} color="amber" />
          <StatBox label="Audio" value={stats.content?.audio_pending} color="amber" />
        </div>
      </div>
      <div>
        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Nội dung đã duyệt</p>
        <div className="grid grid-cols-3 gap-2">
          <StatBox label="Nhạc" value={stats.content?.music_approved} color="emerald" />
          <StatBox label="M/V" value={stats.content?.mv_approved} color="emerald" />
          <StatBox label="Audio" value={stats.content?.audio_approved} color="emerald" />
        </div>
      </div>
      <div>
        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Xác minh Artist</p>
        <div className="grid grid-cols-2 gap-2">
          <StatBox label="Chờ xác minh" value={stats.verifications?.pending} color="amber" />
          <StatBox label="Đã xác minh" value={stats.verifications?.verified} color="pink" />
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    if (tab === 'stats') return renderStats()
    if (loading) return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="glass rounded-2xl h-28 animate-pulse" />)}
      </div>
    )
    if (!data.length) return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">✨</p>
        <p className="text-white/40">Không có dữ liệu</p>
      </div>
    )

    if (tab === 'users') return (
      <div className="space-y-2">
        {data.map(u => (
          <div key={u.id} className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="text-white font-semibold text-sm">{u.display_name || u.username}</p>
                <p className="text-white/40 text-xs">{u.email}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full
                    ${u.role === 'admin' ? 'bg-purple-400/20 text-purple-400' :
                      u.role === 'artist' ? 'bg-pink-400/20 text-pink-400' : 'bg-white/10 text-white/50'}`}>
                    {u.role}
                  </span>
                  <span className={u.is_active ? 'badge-approved' : 'badge-rejected'}>
                    {u.is_active ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => adminAPI.toggleUser(u.id, !u.is_active).then(reload).catch(() => toast.error('Thất bại'))}
                className={`text-xs px-3 py-1.5 rounded-lg transition flex-shrink-0
                  ${u.is_active ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25' : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'}`}
              >
                {u.is_active ? 'Khóa' : 'Mở khóa'}
              </button>
            </div>
          </div>
        ))}
      </div>
    )

    if (tab === 'verifications') return (
      <div className="space-y-3">
        {data.map(a => (
          <div key={a.id} className="glass rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white font-semibold">{a.stage_name}</p>
                <p className="text-white/40 text-xs">{a.verification_type} · Gửi: {a.submitted_at ? new Date(a.submitted_at).toLocaleDateString('vi') : '-'}</p>
                {a.genre && <p className="text-pink-400 text-xs">{a.genre}</p>}
              </div>
              <span className="badge-pending">Chờ duyệt</span>
            </div>
            {a.verification_docs?.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {a.verification_docs.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 bg-white/10 text-white/60 text-xs px-2 py-1 rounded-lg hover:text-white">
                    <Eye size={11} /> Tài liệu {i + 1}
                  </a>
                ))}
              </div>
            )}
            <ActionButtons
              item={a}
              onApprove={(id) => adminAPI.approveVerify(id).then(reload)}
              onReject={(id, d) => adminAPI.rejectVerify(id, d).then(reload)}
            />
          </div>
        ))}
      </div>
    )

    if (tab === 'music') return (
      <div className="space-y-3">
        {data.map(m => (
          <div key={m.id} className="glass rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              {m.cover_url
                ? <img src={m.cover_url} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                : <div className="w-12 h-12 rounded-xl bg-pink-400/20 flex items-center justify-center text-xl flex-shrink-0">♪</div>
              }
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{m.title}</p>
                <p className="text-white/40 text-xs">{m.artist?.stage_name}</p>
                {m.genre && <p className="text-pink-400 text-xs">{m.genre}</p>}
              </div>
              <a href={m.audio_url} target="_blank" rel="noreferrer"
                className="text-white/30 hover:text-white transition">
                <Eye size={16} />
              </a>
            </div>
            <ActionButtons
              item={m}
              onApprove={(id) => adminAPI.approveMusic(id).then(reload)}
              onReject={(id, d) => adminAPI.rejectMusic(id, d).then(reload)}
            />
          </div>
        ))}
      </div>
    )

    if (tab === 'mv') return (
      <div className="space-y-3">
        {data.map(v => (
          <div key={v.id} className="glass rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              {v.thumbnail_url
                ? <img src={v.thumbnail_url} alt="" className="w-16 h-10 rounded-lg object-cover flex-shrink-0" />
                : <div className="w-16 h-10 rounded-lg bg-pink-400/20 flex items-center justify-center text-lg flex-shrink-0">🎬</div>
              }
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{v.title}</p>
                <p className="text-white/40 text-xs">{v.artist?.stage_name}</p>
              </div>
              <a href={v.video_url} target="_blank" rel="noreferrer"
                className="text-white/30 hover:text-white transition">
                <Eye size={16} />
              </a>
            </div>
            <ActionButtons
              item={v}
              onApprove={(id) => adminAPI.approveMV(id).then(reload)}
              onReject={(id, d) => adminAPI.rejectMV(id, d).then(reload)}
            />
          </div>
        ))}
      </div>
    )

    if (tab === 'audio') return (
      <div className="space-y-3">
        {data.map(s => (
          <div key={s.id} className="glass rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              {s.cover_url
                ? <img src={s.cover_url} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                : <div className="w-12 h-12 rounded-xl bg-purple-400/20 flex items-center justify-center text-xl flex-shrink-0">🎧</div>
              }
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{s.title}</p>
                <p className="text-white/40 text-xs">{s.user?.display_name} · {s.category}</p>
              </div>
              <a href={s.audio_url} target="_blank" rel="noreferrer"
                className="text-white/30 hover:text-white transition">
                <Eye size={16} />
              </a>
            </div>
            <ActionButtons
              item={s}
              onApprove={(id) => adminAPI.approveAudio(id).then(reload)}
              onReject={(id, d) => adminAPI.rejectAudio(id, d).then(reload)}
            />
          </div>
        ))}
      </div>
    )

    if (tab === 'reports') {
      const STATUS_COLORS = {
        pending:   'badge-pending',
        reviewing: 'bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full',
        resolved:  'badge-approved',
        dismissed: 'bg-white/10 text-white/40 text-xs px-2 py-0.5 rounded-full',
      }
      const STATUS_LABELS = { pending: 'Chờ xử lý', reviewing: 'Đang xem xét', resolved: 'Đã xử lý', dismissed: 'Bác bỏ' }
      const REASON_LABELS = {
        copyright: '© Bản quyền', inappropriate: '🔞 Không phù hợp',
        spam: '🚫 Spam', misinformation: '❌ Sai lệch',
        hate_speech: '💢 Kỳ thị', privacy: '🔒 Riêng tư', other: '📋 Khác',
      }
      return (
        <div className="space-y-3">
          {data.map(r => (
            <div key={r.id} className="glass rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-pink-400 font-mono text-xs">{r.ticket_id}</span>
                    <span className={STATUS_COLORS[r.status] || 'badge-pending'}>{STATUS_LABELS[r.status]}</span>
                  </div>
                  <p className="text-white font-semibold text-sm">{REASON_LABELS[r.reason] || r.reason}</p>
                  <p className="text-white/40 text-xs">{r.content_type} {r.content_id ? `#${r.content_id}` : ''}</p>
                  {r.reporter_email && <p className="text-white/30 text-xs mt-0.5">{r.reporter_name || ''} · {r.reporter_email}</p>}
                </div>
              </div>
              {r.description && (
                <p className="text-white/50 text-xs leading-relaxed bg-white/5 rounded-xl p-3">{r.description}</p>
              )}
              {r.content_url && (
                <a href={r.content_url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1 text-blue-400 text-xs hover:underline">
                  <Eye size={11} /> Xem nội dung bị báo cáo
                </a>
              )}
              {r.evidence_urls?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {r.evidence_urls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 bg-white/10 text-white/60 text-xs px-2 py-1 rounded-lg hover:text-white">
                      <Eye size={11} /> Bằng chứng {i + 1}
                    </a>
                  ))}
                </div>
              )}
              {/* Admin actions */}
              {r.status === 'pending' || r.status === 'reviewing' ? (
                <div className="flex gap-2 flex-wrap">
                  {r.status === 'pending' && (
                    <button
                      onClick={() => api.put(`/reports/admin/${r.id}`, { status: 'reviewing' }).then(reload).catch(() => toast.error('Thất bại'))}
                      className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-500/30 transition">
                      Bắt đầu xem xét
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const notes = window.prompt('Ghi chú xử lý (tùy chọn):')
                      api.put(`/reports/admin/${r.id}`, { status: 'resolved', admin_notes: notes }).then(reload).catch(() => toast.error('Thất bại'))
                    }}
                    className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-500/30 transition">
                    <CheckCircle size={13} /> Đã xử lý (gỡ nội dung)
                  </button>
                  <button
                    onClick={() => {
                      const notes = window.prompt('Lý do bác bỏ:')
                      api.put(`/reports/admin/${r.id}`, { status: 'dismissed', admin_notes: notes }).then(reload).catch(() => toast.error('Thất bại'))
                    }}
                    className="flex items-center gap-1 bg-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition">
                    <XCircle size={13} /> Bác bỏ báo cáo
                  </button>
                </div>
              ) : (
                r.admin_notes && <p className="text-white/30 text-xs italic">Ghi chú: {r.admin_notes}</p>
              )}
            </div>
          ))}
        </div>
      )
    }

    if (tab === 'logs') return (
      <div className="space-y-2">
        {data.map(log => (
          <div key={log.id} className="glass rounded-xl px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-pink-400 text-xs font-mono">{log.action}</span>
                <span className="text-white/30 text-xs mx-1">·</span>
                <span className="text-white/50 text-xs">{log.target_type} #{log.target_id}</span>
              </div>
              <span className="text-white/25 text-xs">{new Date(log.created_at).toLocaleDateString('vi')}</span>
            </div>
            {log.notes && <p className="text-white/30 text-xs mt-1 truncate">{log.notes}</p>}
          </div>
        ))}
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="bg-app min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-dark border-b border-white/5">
        <div className="max-w-md mx-auto px-4 pt-12 pb-0 flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/home')} className="text-white/50 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white flex-1">Admin Dashboard</h1>
          <button onClick={reload} className="text-white/40 hover:text-white transition">
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-0 px-4 scrollbar-none">
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => loadTab(t.id)}
                className={`flex items-center gap-1.5 flex-shrink-0 px-3 py-2.5 text-xs font-semibold border-b-2 transition-all
                  ${tab === t.id ? 'border-pink-400 text-pink-400' : 'border-transparent text-white/40 hover:text-white/70'}`}
              >
                <Icon size={13} /> {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-5">
        {renderContent()}
      </div>
    </div>
  )
}
