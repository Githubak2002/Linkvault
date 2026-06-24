'use client'

import { useCallback } from 'react'

interface SearchBarProps {
  query: string
  onChange: (query: string) => void
  resultCount: number
  totalCount: number
}

export default function SearchBar({
  query,
  onChange,
  resultCount,
  totalCount,
}: SearchBarProps) {
  const handleClear = useCallback(() => {
    onChange('')
  }, [onChange])

  const isFiltering = query.length > 0

  return (
    <div
      style={{ backgroundColor: 'var(--color-bg)' }}
      className="sticky top-[65px] z-20 w-full pb-2 pt-3"
    >
      <div className="mx-auto max-w-2xl px-4">
        <div className="relative">
          {/* Search icon */}
          <div
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                color: isFiltering
                  ? 'var(--color-primary-light)'
                  : 'var(--color-text-muted)',
                transition: 'color 150ms ease',
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>

          {/* Input */}
          <input
            id="bookmark-search"
            type="search"
            role="searchbox"
            aria-label="Search bookmarks by name, URL, or description"
            placeholder="Search bookmarks…"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            style={{
              paddingLeft: '2.75rem',
              paddingRight: isFiltering ? '5.5rem' : '1rem',
              background: 'var(--color-surface)',
              border: '1.5px solid var(--color-border)',
              borderRadius: '12px',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              height: '48px',
              width: '100%',
              outline: 'none',
              transition: 'border-color 150ms ease, box-shadow 150ms ease',
              boxShadow: isFiltering
                ? '0 0 0 3px rgba(13,148,136,0.18), 0 0 20px rgba(13,148,136,0.08)'
                : 'none',
              borderColor: isFiltering ? 'var(--color-primary)' : 'var(--color-border)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)'
              e.currentTarget.style.boxShadow =
                '0 0 0 3px rgba(13,148,136,0.18), 0 0 20px rgba(13,148,136,0.08)'
            }}
            onBlur={(e) => {
              if (!isFiltering) {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          />

          {/* Right side: result count + clear */}
          {isFiltering && (
            <div
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5"
              style={{ animation: 'card-enter 150ms ease both' }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-display)',
                  whiteSpace: 'nowrap',
                }}
              >
                {resultCount}/{totalCount}
              </span>
              <button
                id="clear-search-btn"
                onClick={handleClear}
                aria-label="Clear search"
                style={{
                  padding: '4px',
                  borderRadius: '6px',
                  background: 'var(--color-surface-3)',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 100ms ease, color 100ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-error)'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--color-surface-3)'
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
