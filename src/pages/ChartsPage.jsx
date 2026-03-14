import { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import { musicAPI } from '../api/client'
import MusicCard from '../components/MusicCard'
import BottomNav from '../components/BottomNav'
import MiniPlayer from '../components/MiniPlayer'

export default function ChartsPage() {
  const [tracks, setTracks]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    musicAPI.trending(50)
      .then(r => setTracks(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-app min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-dark pt-12 pb-4 px-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <TrendingUp size={22} className="text-pink-400" />
          <div>
            <h1 className="text-xl font-bold text-white">Bảng xếp hạng</h1>
            <p className="text-white/40 text-xs">Top 50 bài nhạc hot nhất</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-2">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl h-20 animate-pulse" />
          ))
        ) : tracks.map((track, i) => (
          <div key={track.id} className="flex items-center gap-3">
            {/* Rank number */}
            <div className={`w-8 flex-shrink-0 text-center font-bold text-lg
              ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-white/60' : i === 2 ? 'text-amber-700' : 'text-white/25'}`}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <MusicCard track={track} queue={tracks} horizontal />
            </div>
          </div>
        ))}
      </div>

      <MiniPlayer />
      <BottomNav />
    </div>
  )
}
