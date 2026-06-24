'use client'

import { useTheme } from '@/lib/theme-context'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

interface HeaderProps {
  onAddClick: () => void
  userEmail?: string
}

export default function Header({ onAddClick, userEmail }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  const handleSignOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }, [router])

  const isDark = theme === 'dark'

  return (
    <header
      style={{
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        transition: 'background-color 200ms ease, border-color 200ms ease',
      }}
      className="sticky top-0 z-30 w-full"
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        {/* Logo / App name */}
        <div className="flex items-center gap-2.5">
          {/* Vault icon */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
              borderRadius: '9px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16" r="1" />
            </svg>
          </div>
          <span
            className="font-display text-xl font-bold tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Link<span style={{ color: 'var(--color-primary-light)' }}>Vault</span>
          </span>
        </div>

        {/* Right actions */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Theme toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="btn-icon"
            style={{
              color: 'var(--color-text-secondary)',
              width: '36px',
              height: '36px',
            }}
          >
            {isDark ? (
              /* Sun icon — switch to light */
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1"  x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1"  y1="12" x2="3"  y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78"  x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22" />
              </svg>
            ) : (
              /* Moon icon — switch to dark */
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* User avatar + sign-out */}
          {userEmail && (
            <div className="flex items-center gap-2">
              {/* Avatar dot with initial */}
              <div
                title={userEmail}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  color: 'white',
                  flexShrink: 0,
                  cursor: 'default',
                }}
                aria-label={`Signed in as ${userEmail}`}
              >
                {userEmail.charAt(0).toUpperCase()}
              </div>

              {/* Sign out */}
              <button
                id="sign-out-btn"
                onClick={handleSignOut}
                className="btn-icon"
                aria-label="Sign out"
                title="Sign out"
                style={{ color: 'var(--color-text-secondary)', width: '32px', height: '32px' }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          )}

          {/* Add bookmark button */}
          <button
            id="open-add-sheet-btn"
            onClick={onAddClick}
            className="btn btn-primary"
            aria-label="Add new bookmark"
            style={{ gap: '0.375rem', paddingLeft: '0.875rem', paddingRight: '1rem' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span className="font-body text-sm font-semibold">Add</span>
          </button>
        </div>
      </div>
    </header>
  )
}
