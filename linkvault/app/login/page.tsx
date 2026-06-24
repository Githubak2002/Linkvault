'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/lib/theme-context'

type AuthMode = 'login' | 'signup'

export default function LoginPage() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)
      setSuccess(null)
      setLoading(true)

      const supabase = createClient()

      try {
        if (mode === 'login') {
          const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (authError) throw authError
          router.push('/dashboard')
          router.refresh()
        } else {
          const { error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
            },
          })
          if (authError) throw authError
          setSuccess(
            'Account created! Check your email for a confirmation link.',
          )
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong'
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [email, mode, password, router],
  )

  return (
    <main
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative',
        transition: 'background-color 200ms ease',
      }}
    >
      {/* Theme toggle — top right */}
      <button
        id="login-theme-toggle"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="btn-icon"
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          color: 'var(--color-text-secondary)',
        }}
      >
        {isDark ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1"  x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1"  y1="12" x2="3"  y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78"  x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      {/* Card */}
      <div
        className="animate-fade-up"
        style={{
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 8px 24px rgba(13, 148, 136, 0.35)',
            }}
            aria-hidden="true"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16" r="1" />
            </svg>
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: '1.625rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.03em',
              marginBottom: '0.25rem',
            }}
          >
            Link<span style={{ color: 'var(--color-primary-light)' }}>Vault</span>
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            {mode === 'login' ? 'Welcome back' : 'Create your vault'}
          </p>
        </div>

        {/* Form card */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '18px',
            padding: '1.75rem',
            boxShadow: isDark
              ? '0 24px 64px rgba(0,0,0,0.5)'
              : '0 8px 40px rgba(0,0,0,0.1)',
            transition: 'background-color 200ms ease, border-color 200ms ease',
          }}
        >
          {/* Mode tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.375rem',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: '10px',
              padding: '0.25rem',
              marginBottom: '1.5rem',
            }}
          >
            {(['login', 'signup'] as AuthMode[]).map((m) => (
              <button
                key={m}
                id={`auth-tab-${m}`}
                type="button"
                onClick={() => {
                  setMode(m)
                  setError(null)
                  setSuccess(null)
                }}
                style={{
                  padding: '0.5rem',
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  transition: 'background-color 150ms ease, color 150ms ease, box-shadow 150ms ease',
                  backgroundColor: mode === m ? 'var(--color-surface)' : 'transparent',
                  color: mode === m ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                  boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                {m === 'login' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          <form id="auth-form" onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Email */}
              <div>
                <label
                  htmlFor="auth-email"
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    marginBottom: '0.375rem',
                  }}
                >
                  Email address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-required="true"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="auth-password"
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    marginBottom: '0.375rem',
                  }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    minLength={mode === 'signup' ? 8 : undefined}
                    aria-required="true"
                    style={{ paddingRight: '2.75rem' }}
                  />
                  {/* Show/hide password toggle */}
                  <button
                    type="button"
                    id="toggle-password-visibility"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.25rem',
                      transition: 'color 100ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-text-secondary)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-text-muted)'
                    }}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div
                  role="alert"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: 'var(--color-error)',
                    fontSize: '0.8125rem',
                    lineHeight: 1.5,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0, marginTop: '1px' }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Success message */}
              {success && (
                <div
                  role="status"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    color: 'var(--color-success)',
                    fontSize: '0.8125rem',
                    lineHeight: 1.5,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0, marginTop: '1px' }}>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  {success}
                </div>
              )}

              {/* Submit */}
              <button
                id="auth-submit-btn"
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', height: '46px', marginTop: '0.25rem' }}
              >
                {loading ? (
                  <>
                    <span
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.4)',
                        borderTopColor: 'white',
                        borderRadius: '50%',
                        animation: 'spin 0.7s linear infinite',
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    />
                    {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                  </>
                ) : mode === 'login' ? (
                  'Sign in to your vault'
                ) : (
                  'Create your vault'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            marginTop: '1.25rem',
          }}
        >
          Your bookmarks are private and secure.
        </p>
      </div>
    </main>
  )
}
