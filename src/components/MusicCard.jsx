import { Play, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext'

function formatDuration(seconds) {
  if (!seconds) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function MusicCard({ track, queue = [], horizontal = false }) {
  const navigate  = useNavigate()
  const { play, currentTrack, isPlaying } = usePlayer()
  const isActive = currentTrack?.id === track.id

  if (horizontal) {
    return (
      <div
        className="music-card flex items-center gap-3 p-3"
        onClick={() => play(track, queue)}
      >
        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
          {track.cover_url
            ? <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-pink-400/20 flex items-center justify-center text-pink-400">♪</div>
          }
          {isActive && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${isActive ? 'text-pink-400' : 'text-white'}`}>
            {track.title}
          </p>
          <p className="text-white/40 text-xs truncate">
            {track.artist?.stage_name || 'Unknown Artist'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-white/30 text-xs">{formatDuration(track.duration)}</span>
          <button className={`w-8 h-8 rounded-full flex items-center justify-center transition
            ${isActive ? 'bg-pink-400' : 'bg-white/10 hover:bg-pink-400/30'}`}
          >
            <Play size={13} fill="white" className="text-white ml-0.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="music-card" onClick={() => navigate(`/music/${track.id}`)}>
      <div className="relative aspect-square">
        {track.cover_url
          ? <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-pink-400/20 to-purple-400/20 flex items-center justify-center text-4xl">♪</div>
        }
        <button
          className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center shadow-lg transition active:scale-90"
          onClick={(e) => { e.stopPropagation(); play(track, queue) }}
        >
          <Play size={16} fill="white" className="text-white ml-0.5" />
        </button>
        {isActive && (
          <div className="absolute top-2 left-2 bg-pink-400 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
            ▶ Đang phát
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-white text-sm font-semibold truncate">{track.title}</p>
        <p className="text-white/40 text-xs truncate">{track.artist?.stage_name || 'Unknown'}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white/25 text-xs">{(track.plays || 0).toLocaleString()} plays</span>
          {track.genre && <span className="text-pink-400/60 text-xs">· {track.genre}</span>}
        </div>
      </div>
    </div>
  )
}
