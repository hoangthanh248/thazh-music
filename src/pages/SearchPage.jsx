import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { musicAPI } from '../api/client'
import MusicCard from '../components/MusicCard'
import BottomNav from '../components/BottomNav'
import MiniPlayer from '../components/MiniPlayer'

export default function SearchPage() {
  const [q, setQ]           = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (q.length < 2) { setResults([]); return }
    setLoading(true)
    const t = setTimeout(() => {
      musicAPI.list({ search: q, per_page: 30 })
        .then(r => setResults(r.data))
        .catch(() => {})
        .finally(() => setLoading(false))
    }, 350)
    return () => clearTimeout(t)
  }, [q])

  return (
    <div className="bg-app min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-dark pt-12 pb-4 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-white mb-3">Tìm kiếm</h1>
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              className="input-field pl-10 pr-10"
              placeholder="Bài nhạc, nghệ sĩ, thể loại..."
              value={q}
              onChange={e => setQ(e.target.value)}
              autoFocus
            />
            {q && (
              <button onClick={() => setQ('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4">
        {!q && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-white/40">Nhập tên bài nhạc hoặc nghệ sĩ</p>
          </div>
        )}
        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        )}
        {!loading && q.length >= 2 && results.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🎵</p>
            <p className="text-white/40">Không tìm thấy kết quả cho "<span className="text-pink-400">{q}</span>"</p>
          </div>
        )}
        {!loading && results.length > 0 && (
          <div className="space-y-2">
            <p className="text-white/40 text-xs mb-3">{results.length} kết quả cho "{q}"</p>
            {results.map(track => (
              <MusicCard key={track.id} track={track} queue={results} horizontal />
            ))}
          </div>
        )}
      </div>

      <MiniPlayer />
      <BottomNav />
    </div>
  )
}
