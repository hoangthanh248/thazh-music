import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Pause, SkipForward, X } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, next, close } = usePlayer()
  const audioRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return
    if (isPlaying) audioRef.current.play().catch(() => {})
    else audioRef.current.pause()
  }, [isPlaying, currentTrack])

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return
    audioRef.current.src = currentTrack.audio_url
    audioRef.current.play().catch(() => {})
  }, [currentTrack])

  if (!currentTrack) return null

  return (
    <>
      <audio ref={audioRef} onEnded={next} preload="auto" />
      <div
        className="fixed bottom-16 left-0 right-0 z-40 max-w-md mx-auto px-3 pb-2"
        style={{ left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '448px' }}
      >
        <div
          className="glass-dark rounded-2xl px-3 py-2.5 flex items-center gap-3 cursor-pointer"
          style={{ boxShadow: '0 -4px 30px rgba(242,90,151,0.15)' }}
        >
          {/* Cover */}
          <div
            className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
            onClick={() => navigate(`/music/${currentTrack.id}`)}
          >
            {currentTrack.cover_url
              ? <img src={currentTrack.cover_url} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-pink-400/20 flex items-center justify-center text-pink-400 text-lg">♪</div>
            }
          </div>

          {/* Info */}
          <div
            className="flex-1 min-w-0"
            onClick={() => navigate(`/music/${currentTrack.id}`)}
          >
            <p className="text-white text-sm font-semibold truncate">{currentTrack.title}</p>
            <p className="text-white/40 text-xs truncate">
              {currentTrack.artist?.stage_name || currentTrack.artist?.user?.display_name}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-pink-400 flex items-center justify-center transition active:scale-90"
            >
              {isPlaying
                ? <Pause size={16} fill="white" className="text-white" />
                : <Play size={16} fill="white" className="text-white ml-0.5" />
              }
            </button>
            <button onClick={next} className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white">
              <SkipForward size={16} />
            </button>
            <button onClick={close} className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/60">
              <X size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
