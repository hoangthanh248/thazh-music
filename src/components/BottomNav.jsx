import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Music2, BookOpen, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/home',   icon: Home,    label: 'Trang chủ' },
  { to: '/search', icon: Search,  label: 'Tìm kiếm' },
  { to: '/charts', icon: Music2,  label: 'Bảng xếp' },
  { to: '/audio',  icon: BookOpen, label: 'Audio' },
  { to: '/profile', icon: User,   label: 'Cá nhân' },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  const { isLoggedIn } = useAuth()

  return (
    <nav className="bottom-nav">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={isLoggedIn ? to : '/login'}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200
                ${active ? 'text-pink-400' : 'text-white/40 hover:text-white/70'}`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{label}</span>
              {active && (
                <span className="w-1 h-1 rounded-full bg-pink-400 mt-0.5" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
