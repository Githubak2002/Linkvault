'use client'

import { useState } from 'react'
import { Bookmark } from '@/types/bookmark'
import { groupBookmarks } from '@/lib/bookmark-utils'
import BookmarkCard from './BookmarkCard'

/* ── Empty States ─────────────────────────────────────────── */

interface EmptyStateProps {
  variant: 'no-bookmarks' | 'no-results'
  query?: string
  onAddClick?: () => void
  onClearSearch?: () => void
}

function EmptyState({ variant, query, onAddClick, onClearSearch }: EmptyStateProps) {
  if (variant === 'no-bookmarks') {
    return (
      <div
        className="flex flex-col items-center justify-center px-6 text-center"
        style={{ paddingTop: '5rem', paddingBottom: '5rem' }}
        role="status"
        aria-live="polite"
      >
        <div className="animate-float" style={{ marginBottom: '1.5rem' }} aria-hidden="true">
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '22px',
              background: 'linear-gradient(135deg, var(--color-surface-2), var(--color-surface-3))',
              border: '1.5px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px var(--color-primary-glow)',
            }}
          >
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16" r="1" />
            </svg>
          </div>
        </div>
        <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Your vault is empty
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '280px', lineHeight: 1.6 }}>
          Save your first link and start building your personal knowledge vault.
        </p>
        <button id="empty-state-add-btn" onClick={onAddClick} className="btn btn-primary" style={{ fontSize: '0.9375rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add your first bookmark
        </button>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col items-center justify-center px-6 text-center"
      style={{ paddingTop: '4rem', paddingBottom: '4rem' }}
      role="status"
      aria-live="polite"
    >
      <div style={{ marginBottom: '1.25rem' }} aria-hidden="true">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <h2 className="font-display" style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.375rem', letterSpacing: '-0.02em' }}>
        No matches for{' '}
        <span style={{ color: 'var(--color-primary-light)' }}>&ldquo;{query}&rdquo;</span>
      </h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
        Try a different keyword or clear your search.
      </p>
      <button id="no-results-clear-btn" onClick={onClearSearch} className="btn btn-ghost" style={{ fontSize: '0.875rem' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
        Clear search
      </button>
    </div>
  )
}

/* ── Group Section ────────────────────────────────────────── */

interface GroupSectionProps {
  groupName: string
  bookmarks: Bookmark[]
  baseDelay: number
  onDelete: (bookmark: Bookmark) => void
  onEdit: (bookmark: Bookmark) => void
  onDeleteGroup: (groupName: string, count: number) => void
  defaultOpen?: boolean
}

function GroupSection({ groupName, bookmarks, baseDelay, onDelete, onEdit, onDeleteGroup, defaultOpen = true }: GroupSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isGroupHovered, setIsGroupHovered] = useState(false)
  const label = groupName || 'Ungrouped'
  const isUngrouped = !groupName

  return (
    <div style={{ marginBottom: '0.5rem' }}>
      {/* Group header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          marginBottom: isOpen ? '0.5rem' : '0.25rem',
        }}
        onMouseEnter={() => setIsGroupHovered(true)}
        onMouseLeave={() => setIsGroupHovered(false)}
      >
        <button
          id={`group-toggle-${label.replace(/\s+/g, '-').toLowerCase()}`}
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls={`group-content-${label}`}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          {/* Chevron */}
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="var(--color-text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms var(--ease-out)', flexShrink: 0 }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>

          {/* Folder icon */}
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={isUngrouped ? 'var(--color-text-muted)' : 'var(--color-primary)'}
            strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}
          >
            {isUngrouped ? (
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" strokeDasharray="4 2" />
            ) : (
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            )}
          </svg>

          {/* Group name */}
          <span
            className="font-display"
            style={{
              fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: isUngrouped ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
              flex: 1,
            }}
          >
            {label}
          </span>

          {/* Count badge */}
          <span
            style={{
              fontSize: '0.6875rem', fontFamily: 'var(--font-display)', fontWeight: 600,
              padding: '0.125rem 0.5rem', borderRadius: '99px',
              backgroundColor: isUngrouped ? 'var(--color-surface-2)' : 'var(--color-primary-glow)',
              color: isUngrouped ? 'var(--color-text-muted)' : 'var(--color-primary)',
              border: `1px solid ${isUngrouped ? 'var(--color-border)' : 'rgba(99,102,241,0.2)'}`,
              flexShrink: 0,
            }}
          >
            {bookmarks.length}
          </span>
        </button>

        {/* Delete group button — shows on hover, only for named groups */}
        {!isUngrouped && (
          <button
            id={`delete-group-${label.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={() => onDeleteGroup(groupName, bookmarks.length)}
            aria-label={`Delete group ${label}`}
            className="btn-icon"
            style={{
              flexShrink: 0,
              opacity: isGroupHovered ? 1 : 0,
              transform: isGroupHovered ? 'scale(1)' : 'scale(0.8)',
              transition: 'opacity 150ms ease, transform 150ms ease',
              pointerEvents: isGroupHovered ? 'auto' : 'none',
              color: 'var(--color-text-muted)',
            }}
            title="Delete entire group"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
          </button>
        )}
      </div>

      {/* Cards */}
      <div
        id={`group-content-${label}`}
        style={{
          overflow: 'hidden',
          maxHeight: isOpen ? '9999px' : '0',
          transition: isOpen
            ? 'max-height 350ms var(--ease-out)'
            : 'max-height 200ms var(--ease-in)',
        }}
      >
        {bookmarks.map((bookmark, idx) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onDelete={onDelete}
            onEdit={onEdit}
            animationDelay={baseDelay + idx * 40}
          />
        ))}
      </div>
    </div>
  )
}

/* ── BookmarkList (main export) ───────────────────────────── */

interface BookmarkListProps {
  bookmarks: Bookmark[]
  filteredBookmarks: Bookmark[]
  query: string
  onDelete: (bookmark: Bookmark) => void
  onEdit: (bookmark: Bookmark) => void
  onDeleteGroup: (groupName: string, count: number) => void
  onAddClick: () => void
  onClearSearch: () => void
}

export default function BookmarkList({
  bookmarks,
  filteredBookmarks,
  query,
  onDelete,
  onEdit,
  onDeleteGroup,
  onAddClick,
  onClearSearch,
}: BookmarkListProps) {
  const hasBookmarks = bookmarks.length > 0
  const hasResults = filteredBookmarks.length > 0
  const isFiltering = query.length > 0

  if (!hasBookmarks) {
    return <EmptyState variant="no-bookmarks" onAddClick={onAddClick} />
  }

  if (isFiltering && !hasResults) {
    return <EmptyState variant="no-results" query={query} onClearSearch={onClearSearch} />
  }

  const grouped = groupBookmarks(filteredBookmarks)
  let delayOffset = 0

  return (
    <section aria-label="Bookmarks list" style={{ paddingTop: '0.25rem', paddingBottom: '6rem' }}>
      {isFiltering && (
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)', marginBottom: '0.875rem', paddingLeft: '0.25rem' }}>
          {filteredBookmarks.length} result{filteredBookmarks.length !== 1 ? 's' : ''}
          {' '}across {grouped.length} group{grouped.length !== 1 ? 's' : ''}
        </p>
      )}

      {grouped.map(([groupName, items]) => {
        const sectionDelay = delayOffset
        delayOffset += items.length * 40
        return (
          <GroupSection
            key={groupName || '__ungrouped__'}
            groupName={groupName}
            bookmarks={items}
            baseDelay={sectionDelay}
            onDelete={onDelete}
            onEdit={onEdit}
            onDeleteGroup={onDeleteGroup}
            defaultOpen={true}
          />
        )
      })}
    </section>
  )
}
