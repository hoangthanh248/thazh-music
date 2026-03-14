import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import { musicAPI } from '../api/client'
import { useAuth } from '../context/AuthContext'
import MusicCard from '../components/MusicCard'
import BottomNav from '../components/BottomNav'
import MiniPlayer from '../components/MiniPlayer'

const GENRES = ['Tất cả','Pop','R&B','Hip-Hop','EDM','Rock','Indie','Ballad','Rap']

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [trending, setTrending]   = useState([])
  const [recent, setRecent]       = useState([])
  const [genre, setGenre]         = useState('')
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      musicAPI.trending(10),
      musicAPI.list({ per_page: 20, genre: genre || undefined }),
    ]).then(([t, r]) => {
      setTrending(t.data)
      setRecent(r.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [genre])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'

  return (
    <div className="bg-app min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-dark pt-12 pb-4 px-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <p className="text-white/40 text-sm">{greeting}</p>
            <h1 className="text-xl font-bold text-white">
              {user?.display_name || user?.username || 'Bạn'} 👋
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/search')} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white">
              <Search size={18} />
            </button>
            <button className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-400 rounded-full" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-8">
        {/* Trending horizontal scroll */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">🔥 Trending</h2>
            <button onClick={() => navigate('/charts')} className="text-pink-400 text-sm font-semibold">Xem tất cả</button>
          </div>
          {loading ? (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-36 flex-shrink-0 aspect-square rounded-2xl glass animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {trending.map(track => (
                <div key={track.id} className="w-36 flex-shrink-0">
                  <MusicCard track={track} queue={trending} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Genre filter */}
        <section>
          <h2 className="text-white font-bold text-lg mb-4">Khám phá</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
            {GENRES.map(g => (
              <button key={g} onClick={() => setGenre(g === 'Tất cả' ? '' : g)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all
                  ${(genre === g || (g === 'Tất cả' && !genre)) ? 'bg-pink-400 text-white' : 'bg-white/10 text-white/50 hover:text-white'}`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl h-20 animate-pulse" />
              ))
            ) : recent.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/40 text-4xl mb-3">🎵</p>
                <p className="text-white/40">Chưa có bài nhạc nào</p>
              </div>
            ) : recent.map(track => (
              <MusicCard key={track.id} track={track} queue={recent} horizontal />
            ))}
          </div>
        </section>
      </div>

      <MiniPlayer />
      <BottomNav />
    </div>
  )
}
