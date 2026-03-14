import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { PlayerProvider } from './context/PlayerContext'

// Pages
import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import ArtistRegisterPage from './pages/ArtistRegisterPage'
import ArtistVerifyPage   from './pages/ArtistVerifyPage'
import HomePage           from './pages/HomePage'
import SearchPage         from './pages/SearchPage'
import ChartsPage         from './pages/ChartsPage'
import AudioStoriesPage   from './pages/AudioStoriesPage'
import UploadMusicPage    from './pages/UploadMusicPage'
import UploadMVPage       from './pages/UploadMVPage'
import UploadAudioPage    from './pages/UploadAudioPage'
import ProfilePage        from './pages/ProfilePage'
import AdminDashboard     from './pages/AdminDashboard'
import ReportContentPage  from './pages/ReportContentPage'
import { TermsPage, PrivacyPage } from './pages/LegalPages'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <Routes>
            <Route path="/"                element={<Navigate to="/login" replace />} />
            <Route path="/login"           element={<LoginPage />} />
            <Route path="/register"        element={<RegisterPage />} />
            <Route path="/register/artist" element={<ArtistRegisterPage />} />
            <Route path="/home"            element={<HomePage />} />
            <Route path="/search"          element={<SearchPage />} />
            <Route path="/charts"          element={<ChartsPage />} />
            <Route path="/audio"           element={<AudioStoriesPage />} />
            <Route path="/profile"         element={<ProfilePage />} />
            <Route path="/verify"          element={<ArtistVerifyPage />} />
            <Route path="/upload/music"    element={<UploadMusicPage />} />
            <Route path="/upload/mv"       element={<UploadMVPage />} />
            <Route path="/upload/audio"    element={<UploadAudioPage />} />
            <Route path="/admin"           element={<AdminDashboard />} />
            <Route path="/report-content"  element={<ReportContentPage />} />
            <Route path="/terms"           element={<TermsPage />} />
            <Route path="/privacy"         element={<PrivacyPage />} />
            <Route path="*"               element={<Navigate to="/home" replace />} />
          </Routes>

          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: 'rgba(25,25,25,0.95)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                backdropFilter: 'blur(20px)',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: { iconTheme: { primary: '#f25a97', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#f87171', secondary: '#fff' } },
            }}
          />
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
