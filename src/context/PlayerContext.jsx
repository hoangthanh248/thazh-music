import { createContext, useContext, useState, useRef, useCallback } from 'react'
import { musicAPI } from '../api/client'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying]       = useState(false)
  const [queue, setQueue]               = useState([])
  const [queueIndex, setQueueIndex]     = useState(0)
  const audioRef = useRef(null)

  const play = useCallback((track, trackQueue = []) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    if (trackQueue.length) {
      setQueue(trackQueue)
      setQueueIndex(trackQueue.findIndex(t => t.id === track.id))
    }
    musicAPI.play(track.id).catch(() => {})
  }, [])

  const togglePlay = useCallback(() => setIsPlaying(p => !p), [])

  const next = useCallback(() => {
    if (!queue.length) return
    const newIdx = (queueIndex + 1) % queue.length
    setQueueIndex(newIdx)
    play(queue[newIdx], queue)
  }, [queue, queueIndex, play])

  const prev = useCallback(() => {
    if (!queue.length) return
    const newIdx = (queueIndex - 1 + queue.length) % queue.length
    setQueueIndex(newIdx)
    play(queue[newIdx], queue)
  }, [queue, queueIndex, play])

  const close = useCallback(() => {
    setCurrentTrack(null)
    setIsPlaying(false)
  }, [])

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, queue, play, togglePlay, next, prev, close, audioRef }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)
