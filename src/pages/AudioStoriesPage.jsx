import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Play, Pause, BookOpen } from 'lucide-react'
import { audioAPI } from '../api/client'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'
import MiniPlayer from '../components/MiniPlayer'

const CATS = [
  { id: '', label: 'Tất cả' },
  { id: 'story', label: '📖 Truyện' },
  { id: 'podcast', label: '🎙 Podcast' },
  { id: 'education', label: '🎓 Giáo dục' },
  { id: 'meditation', label: '🧘 Thiền' },
  { id: 'news', label: '📰 Tin tức' },
]

function formatDuration(sec) {
  if (!sec) return ''
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  return h > 0 ? `${h}g ${m}p` : `${m} phút`
}

function AudioCard({ story, onPlay, isPlaying }) {
  return (
    <div className="music-card flex items-center gap-3 p-3">
      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
        {story.cover_url
          ? <img src={story.cover_url} alt={story.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 flex items-center justify-center text-2xl">🎧</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">{story.title}</p>
        <p className="text-white/40 text-xs">{story.user?.display_name || story.user?.username}</p>
        <div className="flex items-center gap-2 mt-1">
          {formatDuration(story.duration) && (
            <span className="text-white/25 text-xs">{formatDuration(story.duration)}</span>
          )}
          <span className="text-white/25 text-xs">·</span>
          <span className="text-white/25 text-xs">{(story.plays || 0).toLocaleString()} nghe</span>
        </div>
      </div>
      <button
        onClick={() => onPlay(story)}
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition active:scale-90
          ${isPlaying ? 'bg-pink-400' : 'bg-white/10 hover:bg-pink-400/30'}`}
      >
        {isPlaying
          ? <Pause size={16} fill="white" className="text-white" />
          : <Play size={16} fill="white" className="text-white ml-0.5" />
        }
      </button>
    </div>
  )
}

export default function AudioStoriesPage() {
  const navigate  = useNavigate()
  const { isLoggedIn } = useAuth()
  const [stories, setStories]   = useState([])
  const [category, setCategory] = useState('')
  const [loading, setLoading]   = useState(true)
  const [playing, setPlaying]   = useState(null)
  const audioRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    audioAPI.list({ category: category || undefined, per_page: 50 })
      .then(r => setStories(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [category])

  const onPlay = (story) => {
    if (playing?.id === story.id) {
      if (audioRef.current.paused) audioRef.current.play()
      else { audioRef.current.pause(); setPlaying(null); return }
    } else {
      if (audioRef.current) {
        audioRef.current.src = story.audio_url
        audioRef.current.play().catch(() => {})
      }
      setPlaying(story)
      audioAPI.play(story.id).catch(() => {})
    }
  }

  return (
    <div className="bg-app min-h-screen pb-32">
      <audio ref={audioRef} onEnded={() => setPlaying(null)} />

      {/* Header */}
      <div className="sticky top-0 z-30 glass-dark px-4 pt-12 pb-4">
        <div className="max-w-md mx-auto flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-pink-400" />
            <h1 className="text-xl font-bold text-white">Audio</h1>
          </div>
          {isLoggedIn && (
            <button onClick={() => navigate('/upload/audio')}
              className="flex items-center gap-1.5 bg-pink-400/15 border border-pink-400/30 text-pink-400 text-xs font-semibold px-3 py-1.5 rounded-full transition hover:bg-pink-400/25">
              <Plus size={14} /> Đăng audio
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                ${category === c.id ? 'bg-pink-400 text-white' : 'bg-white/10 text-white/50 hover:text-white'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-2">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl h-20 animate-pulse" />
          ))
        ) : stories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🎧</p>
            <p className="text-white/40">Chưa có audio nào trong danh mục này</p>
            <button onClick={() => navigate('/upload/audio')} className="btn-pink mt-4 text-sm px-5 py-2.5">
              Đăng audio đầu tiên
            </button>
          </div>
        ) : stories.map(s => (
          <AudioCard
            key={s.id}
            story={s}
            onPlay={onPlay}
            isPlaying={playing?.id === s.id}
          />
        ))}
      </div>

      <MiniPlayer />
      <BottomNav />
    </div>
  )
}
