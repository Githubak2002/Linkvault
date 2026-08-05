'use client'

import { useTheme } from '@/lib/theme-context'

export default function Footer() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <footer
      style={{
        padding: '3rem 1.5rem',
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <span
            className="font-display"
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.03em',
            }}
          >
            Link<span style={{ color: 'var(--color-primary-light)' }}>Vault</span>
          </span>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textAlign: 'center', maxWidth: '300px' }}>
          Organize your bookmarks with beautiful simplicity.
        </p>
      </div>

      {/* Social / Portfolio Links */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a
          href="https://dev-anurag.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          title="Portfolio"
          style={{
            color: 'var(--color-text-secondary)',
            transition: 'color 150ms ease, transform 150ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            textDecoration: 'none',
          }}
          className="hover:text-[var(--color-primary)] hover:scale-105"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Portfolio
        </a>
        <a
          href="https://github.com/githubak2002"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
          style={{
            color: 'var(--color-text-secondary)',
            transition: 'color 150ms ease, transform 150ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            textDecoration: 'none',
          }}
          className="hover:text-[var(--color-primary)] hover:scale-105"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/anuraglohar"
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn"
          style={{
            color: 'var(--color-text-secondary)',
            transition: 'color 150ms ease, transform 150ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            textDecoration: 'none',
          }}
          className="hover:text-[#0A66C2] hover:scale-105"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
          LinkedIn
        </a>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          height: '1px',
          background: 'var(--color-border)',
        }}
      />

      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--color-text-muted)',
        }}
      >
        © {new Date().getFullYear()} LinkVault by Anurag Lohar. All rights reserved.
      </p>
    </footer>
  )
}
