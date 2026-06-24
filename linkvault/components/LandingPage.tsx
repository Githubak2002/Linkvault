'use client'

import Link from 'next/link'
import { useTheme } from '@/lib/theme-context'

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <main
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--color-bg)',
        transition: 'background-color 200ms ease',
        overflowX: 'hidden',
      }}
    >
      {/* ── Nav bar ── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(var(--glass-blur))',
          WebkitBackdropFilter: 'blur(var(--glass-blur))',
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px var(--color-primary-glow)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16" r="1" />
            </svg>
          </div>
          <span
            className="font-display"
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.03em',
            }}
          >
            Link<span style={{ color: 'var(--color-primary-light)' }}>Vault</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="btn-icon"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <Link href="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.125rem', fontSize: '0.875rem' }}>
            Sign In
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          paddingTop: '140px',
          paddingBottom: '80px',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          position: 'relative',
        }}
      >
        {/* Animated vault icon */}
        <div
          className="animate-fade-up"
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            boxShadow: `0 16px 48px var(--color-primary-glow), 0 0 0 1px var(--color-primary-glow)`,
            animation: 'fade-up 500ms var(--ease-spring) both, float 3.5s ease-in-out infinite',
          }}
          aria-hidden="true"
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <circle cx="12" cy="16" r="1" />
          </svg>
        </div>

        <h1
          className="font-display animate-fade-up"
          style={{
            fontSize: 'clamp(2.25rem, 6vw, 3.75rem)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            marginBottom: '1.25rem',
            animationDelay: '80ms',
          }}
        >
          Your Personal{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Link Vault
          </span>
        </h1>

        <p
          className="animate-fade-up"
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'var(--color-text-secondary)',
            maxWidth: '540px',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            animationDelay: '160ms',
          }}
        >
          Save, organize, and instantly find all your bookmarks in one beautiful, secure place. Never lose a link again.
        </p>

        <div className="animate-fade-up" style={{ animationDelay: '240ms' }}>
          <Link
            href="/login"
            className="btn btn-primary"
            style={{
              padding: '0.875rem 2rem',
              fontSize: '1.0625rem',
              borderRadius: '14px',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Get Started Free
          </Link>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section
        style={{
          padding: '80px 1.5rem',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <h2
          className="font-display animate-fade-up"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            textAlign: 'center',
            letterSpacing: '-0.03em',
            marginBottom: '3rem',
          }}
        >
          Everything you need to{' '}
          <span style={{ color: 'var(--color-primary-light)' }}>manage links</span>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '1.25rem',
          }}
        >
          {/* Feature 1: Organize with Groups */}
          <div
            className="glass-card animate-fade-up"
            style={{
              padding: '1.75rem',
              animationDelay: '100ms',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'var(--color-primary-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3
              className="font-display"
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem',
              }}
            >
              Organize with Groups
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Group bookmarks by project, topic, or however you think. Folders on steroids, minus the clutter.
            </p>
          </div>

          {/* Feature 2: Lightning Search */}
          <div
            className="glass-card animate-fade-up"
            style={{
              padding: '1.75rem',
              animationDelay: '180ms',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'var(--color-primary-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3
              className="font-display"
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem',
              }}
            >
              Lightning Search
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Instantly find any saved link by title, URL, or group. Type and it appears — no digging required.
            </p>
          </div>

          {/* Feature 3: Dark & Light Modes */}
          <div
            className="glass-card animate-fade-up"
            style={{
              padding: '1.75rem',
              animationDelay: '260ms',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'var(--color-primary-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </div>
            <h3
              className="font-display"
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem',
              }}
            >
              Dark &amp; Light Modes
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Beautiful OLED-dark and warm-light themes that adapt to your preference. Easy on the eyes, always.
            </p>
          </div>

          {/* Feature 4: Secure & Private */}
          <div
            className="glass-card animate-fade-up"
            style={{
              padding: '1.75rem',
              animationDelay: '340ms',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'var(--color-primary-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3
              className="font-display"
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem',
              }}
            >
              Secure &amp; Private
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Row-level security powered by Supabase. Your data stays yours — no one else can see your bookmarks.
            </p>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        style={{
          padding: '80px 1.5rem',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <h2
          className="font-display animate-fade-up"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            textAlign: 'center',
            letterSpacing: '-0.03em',
            marginBottom: '3.5rem',
          }}
        >
          Up and running in{' '}
          <span style={{ color: 'var(--color-primary-light)' }}>3 steps</span>
        </h2>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
          }}
        >
          {/* Step 1 */}
          <div
            className="animate-fade-up"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.5rem',
              animationDelay: '100ms',
            }}
          >
            <div
              style={{
                minWidth: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px var(--color-primary-glow)',
              }}
            >
              <span
                className="font-display"
                style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}
              >
                1
              </span>
            </div>
            <div>
              <h3
                className="font-display"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.375rem',
                }}
              >
                Sign up free
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Create your account in seconds. No credit card, no friction — just an email and a password.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className="animate-fade-up"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.5rem',
              animationDelay: '200ms',
            }}
          >
            <div
              style={{
                minWidth: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px var(--color-primary-glow)',
              }}
            >
              <span
                className="font-display"
                style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}
              >
                2
              </span>
            </div>
            <div>
              <h3
                className="font-display"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.375rem',
                }}
              >
                Save your links
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Paste a URL, add a title, pick a group. Done. Your bookmark is stored securely in the cloud.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className="animate-fade-up"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.5rem',
              animationDelay: '300ms',
            }}
          >
            <div
              style={{
                minWidth: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px var(--color-primary-glow)',
              }}
            >
              <span
                className="font-display"
                style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}
              >
                3
              </span>
            </div>
            <div>
              <h3
                className="font-display"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.375rem',
                }}
              >
                Find them instantly
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Search by title, URL, or group and find any bookmark in milliseconds. Your links, always at your fingertips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        style={{
          padding: '80px 1.5rem 100px',
          textAlign: 'center',
        }}
      >
        <div
          className="animate-fade-up"
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '3rem 2rem',
            borderRadius: '24px',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--glass-blur))',
            WebkitBackdropFilter: 'blur(var(--glass-blur))',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.03em',
              marginBottom: '0.75rem',
            }}
          >
            Start organizing your web
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '2rem',
              lineHeight: 1.6,
            }}
          >
            Join LinkVault and take control of your bookmarks. Free, fast, and private.
          </p>
          <Link
            href="/login"
            className="btn btn-primary"
            style={{
              padding: '0.875rem 2.5rem',
              fontSize: '1.0625rem',
              borderRadius: '14px',
            }}
          >
            Get Started Free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          padding: '2rem 1.5rem',
          textAlign: 'center',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
          }}
        >
          Built with ❤ by LinkVault
        </p>
      </footer>
    </main>
  )
}
