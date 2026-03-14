import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('thazh_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem('thazh_token')
    if (!token) { setLoading(false); return }
    authAPI.me()
      .then(({ data }) => setUser(data))
      .catch(() => { localStorage.removeItem('thazh_token'); localStorage.removeItem('thazh_user'); setUser(null) })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password })
    localStorage.setItem('thazh_token', data.access_token)
    localStorage.setItem('thazh_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (formData) => {
    const { data } = await authAPI.register(formData)
    localStorage.setItem('thazh_token', data.access_token)
    localStorage.setItem('thazh_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const registerArtist = useCallback(async (formData) => {
    const { data } = await authAPI.registerArtist(formData)
    localStorage.setItem('thazh_token', data.access_token)
    localStorage.setItem('thazh_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('thazh_token')
    localStorage.removeItem('thazh_user')
    setUser(null)
  }, [])

  const updateUser = useCallback((updated) => {
    const merged = { ...user, ...updated }
    setUser(merged)
    localStorage.setItem('thazh_user', JSON.stringify(merged))
  }, [user])

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    isArtist:   user?.role === 'artist' || user?.role === 'admin',
    isAdmin:    user?.role === 'admin',
    login,
    register,
    registerArtist,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
