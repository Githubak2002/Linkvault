'use client'

import { useTheme } from '@/lib/theme-context'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

interface BottomNavProps {
  onAddClick: () => void
  userEmail?: string
}

export default function BottomNav({ onAddClick, userEmail }: BottomNavProps) {
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const isDark = theme === 'dark'

  const handleSignOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }, [router])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
      <nav className="bottom-nav sm:hidden fixed bottom-0 left-0 w-full z-50 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md border-t border-black/10 dark:border-white/10 pb-safe">
      {/* Home */}
      <button className="nav-item" onClick={scrollToTop} aria-label="Home">
        <svg className="nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" fillOpacity="0.12" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Home</span>
      </button>

      {/* Theme */}
      <button className="nav-item" onClick={toggleTheme} aria-label="Toggle theme">
        {isDark ? (
          <svg className="nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.12" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          <svg className="nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" fillOpacity="0.12" />
          </svg>
        )}
        <span>{isDark ? 'Light' : 'Dark'}</span>
      </button>

      {/* Add — same nav-item style, accent color to mark it as primary */}
      <button className="nav-item nav-item-accent" onClick={onAddClick} aria-label="Add bookmark">
        <svg className="nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.12" />
          <path d="M12 8v8M8 12h8" />
        </svg>
        <span>Add</span>
      </button>

      {/* Logout / Profile */}
      {userEmail ? (
        <button className="nav-item" onClick={handleSignOut} aria-label="Sign out">
          <svg className="nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" fill="currentColor" fillOpacity="0.12" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      ) : (
        <div className="nav-item" style={{ opacity: 0.4 }}>
          <svg className="nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" fill="currentColor" fillOpacity="0.12" />
          </svg>
          <span>Profile</span>
        </div>
      )}
    </nav>
  )
}
