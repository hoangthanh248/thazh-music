import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Settings, LogOut, Upload, Music2, Video, Headphones,
  ShieldCheck, BarChart2, ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { artistAPI, musicAPI } from '../api/client'
import MusicCard from '../components/MusicCard'
import BottomNav from '../components/BottomNav'
import MiniPlayer from '../components/MiniPlayer'

export default function ProfilePage() {
  const navigate           = useNavigate()
  const { user, isArtist, isAdmin, logout } = useAuth()
  const [artistProfile, setArtistProfile] = useState(null)
  const [myMusic, setMyMusic]   = useState([])
  const [stats, setStats]       = useState(null)
  const [activeTab, setActiveTab] = useState('music')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (isArtist) {
      artistAPI.myProfile().then(r => {
        setArtistProfile(r.data)
        return artistAPI.getStats(r.data.id)
      }).then(r => setStats(r.data)).catch(() => {})
      musicAPI.myMusic().then(r => setMyMusic(r.data)).catch(() => {})
    }
  }, [user, isArtist, navigate])

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Đã đăng xuất')
  }

  return (
    <div className="bg-app min-h-screen pb-32">
      {/* Header gradient */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-b from-pink-400/25 via-pink-400/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4">
          <div className="max-w-md mx-auto flex items-end gap-4 pb-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-pink-400/40 flex-shrink-0 bg-gradient-to-br from-pink-400/30 to-purple-400/30">
              {user.avatar_url
                ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/40">
                    {(user.display_name || user.username)?.[0]?.toUpperCase()}
                  </div>
              }
            </div>
            {/* Basic info */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-bold text-white truncate">
                  {user.display_name || user.username}
                </h1>
                {artistProfile?.is_officially_verified && (
                  <span className="verified-tick text-white">✓</span>
                )}
              </div>
              <p className="text-white/40 text-sm">@{user.username}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block
                ${user.role === 'admin' ? 'bg-purple-400/20 text-purple-400' :
                  user.role === 'artist' ? 'bg-pink-400/20 text-pink-400' : 'bg-white/10 text-white/50'}`}>
                {user.role === 'admin' ? 'Admin' : user.role === 'artist' ? 'Artist' : 'Thành viên'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {/* Artist stats */}
        {isArtist && stats && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Bài nhạc', value: stats.total_music },
              { label: 'Lượt nghe', value: stats.total_plays?.toLocaleString() },
              { label: 'M/V', value: stats.total_mvs },
            ].map(s => (
              <div key={s.label} className="glass rounded-xl p-3 text-center">
                <p className="text-white font-bold text-lg">{s.value || 0}</p>
                <p className="text-white/40 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Bio */}
        {user.bio && (
          <div className="glass rounded-2xl p-4">
            <p className="text-white/60 text-sm leading-relaxed">{user.bio}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          {/* Artist specific */}
          {isArtist && (
            <>
              <button onClick={() => navigate('/upload/music')}
                className="w-full glass rounded-2xl p-4 flex items-center gap-3 hover:border-pink-400/30 transition">
                <div className="w-10 h-10 rounded-xl bg-pink-400/20 flex items-center justify-center">
                  <Upload size={18} className="text-pink-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm">Tải nhạc lên</p>
                  <p className="text-white/40 text-xs">MP3, WAV, FLAC</p>
                </div>
                <ChevronRight size={16} className="text-white/30" />
              </button>
              <button onClick={() => navigate('/upload/mv')}
                className="w-full glass rounded-2xl p-4 flex items-center gap-3 hover:border-pink-400/30 transition">
                <div className="w-10 h-10 rounded-xl bg-purple-400/20 flex items-center justify-center">
                  <Video size={18} className="text-purple-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm">Tải M/V lên</p>
                  <p className="text-white/40 text-xs">MP4, MOV</p>
                </div>
                <ChevronRight size={16} className="text-white/30" />
              </button>
              <button onClick={() => navigate('/verify')}
                className="w-full glass rounded-2xl p-4 flex items-center gap-3 hover:border-pink-400/30 transition">
                <div className="w-10 h-10 rounded-xl bg-pink-400/20 flex items-center justify-center">
                  <ShieldCheck size={18} className="text-pink-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm">
                    Xác minh Artist
                    {artistProfile?.is_officially_verified && (
                      <span className="ml-1 text-pink-400">✓</span>
                    )}
                  </p>
                  <p className="text-white/40 text-xs">
                    {artistProfile?.verification_status === 'pending' ? 'Đang xem xét...' :
                     artistProfile?.is_officially_verified ? 'Đã xác minh' : 'Nhận tick hồng'}
                  </p>
                </div>
                <ChevronRight size={16} className="text-white/30" />
              </button>
            </>
          )}

          {/* All users */}
          <button onClick={() => navigate('/upload/audio')}
            className="w-full glass rounded-2xl p-4 flex items-center gap-3 hover:border-pink-400/30 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-400/20 flex items-center justify-center">
              <Headphones size={18} className="text-blue-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-semibold text-sm">Đăng Audio</p>
              <p className="text-white/40 text-xs">Truyện, podcast, thiền...</p>
            </div>
            <ChevronRight size={16} className="text-white/30" />
          </button>

          {isAdmin && (
            <button onClick={() => navigate('/admin')}
              className="w-full glass rounded-2xl p-4 flex items-center gap-3 border border-purple-400/30 hover:border-purple-400/60 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-400/20 flex items-center justify-center">
                <BarChart2 size={18} className="text-purple-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-semibold text-sm">Admin Dashboard</p>
                <p className="text-white/40 text-xs">Quản lý nội dung & người dùng</p>
              </div>
              <ChevronRight size={16} className="text-white/30" />
            </button>
          )}

          <button onClick={handleLogout}
            className="w-full glass rounded-2xl p-4 flex items-center gap-3 hover:border-red-400/30 transition">
            <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center">
              <LogOut size={18} className="text-red-400" />
            </div>
            <p className="flex-1 text-left text-white/70 font-semibold text-sm">Đăng xuất</p>
          </button>
        </div>

        {/* Artist music tabs */}
        {isArtist && myMusic.length > 0 && (
          <div>
            <div className="flex gap-3 mb-4">
              {['music', 'pending'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`text-sm font-semibold pb-2 border-b-2 transition-all
                    ${activeTab === t ? 'text-pink-400 border-pink-400' : 'text-white/40 border-transparent'}`}
                >
                  {t === 'music' ? 'Bài nhạc' : 'Chờ duyệt'}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {myMusic
                .filter(m => activeTab === 'music' ? m.status === 'approved' : m.status === 'pending')
                .map(track => (
                  <div key={track.id} className="relative">
                    <MusicCard track={track} queue={myMusic} horizontal />
                    <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full
                      ${track.status === 'approved' ? 'badge-approved' :
                        track.status === 'pending' ? 'badge-pending' : 'badge-rejected'}`}>
                      {track.status === 'approved' ? '✓' : track.status === 'pending' ? 'Chờ' : '✗'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <MiniPlayer />
      <BottomNav />
    </div>
  )
}
