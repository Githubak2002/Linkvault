'use client'

import { useState, useCallback } from 'react'
import { Bookmark } from '@/types/bookmark'
import { getDisplayHost, getHostInitial } from '@/lib/bookmark-utils'

/** Deterministic gradient based on hostname initial */
const INITIAL_GRADIENTS: Record<string, string> = {
  A: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
  B: 'linear-gradient(135deg, #EC4899, #F43F5E)',
  C: 'linear-gradient(135deg, #14B8A6, #0D9488)',
  D: 'linear-gradient(135deg, #F59E0B, #EF4444)',
  E: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
  F: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
  G: 'linear-gradient(135deg, #22C55E, #14B8A6)',
  H: 'linear-gradient(135deg, #F97316, #EF4444)',
  I: 'linear-gradient(135deg, #A855F7, #6366F1)',
  J: 'linear-gradient(135deg, #06B6D4, #0D9488)',
  K: 'linear-gradient(135deg, #84CC16, #22C55E)',
  L: 'linear-gradient(135deg, #F59E0B, #F97316)',
  M: 'linear-gradient(135deg, #EC4899, #A855F7)',
  N: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
  O: 'linear-gradient(135deg, #F97316, #F59E0B)',
  P: 'linear-gradient(135deg, #A855F7, #8B5CF6)',
  Q: 'linear-gradient(135deg, #14B8A6, #06B6D4)',
  R: 'linear-gradient(135deg, #EF4444, #F97316)',
  S: 'linear-gradient(135deg, #0D9488, #14B8A6)',
  T: 'linear-gradient(135deg, #6366F1, #A855F7)',
  U: 'linear-gradient(135deg, #22C55E, #84CC16)',
  V: 'linear-gradient(135deg, #F43F5E, #EC4899)',
  W: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
  X: 'linear-gradient(135deg, #06B6D4, #0EA5E9)',
  Y: 'linear-gradient(135deg, #EF4444, #F43F5E)',
  Z: 'linear-gradient(135deg, #14B8A6, #22C55E)',
}

function getFaviconGradient(initial: string): string {
  return INITIAL_GRADIENTS[initial.toUpperCase()] ?? 'linear-gradient(135deg, #0D9488, #14B8A6)'
}

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (bookmark: Bookmark) => void
  onEdit: (bookmark: Bookmark) => void
  animationDelay?: number
}

export default function BookmarkCard({
  bookmark,
  onDelete,
  onEdit,
  animationDelay = 0,
}: BookmarkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isHovered, setIsHovered] = useState(false)


  const initial = getHostInitial(bookmark.url)
  const host = getDisplayHost(bookmark.url)
  const gradient = getFaviconGradient(initial)

  const handleDelete = useCallback(() => {
    onDelete(bookmark)
  }, [onDelete, bookmark])

  const handleEdit = useCallback(() => {
    onEdit(bookmark)
  }, [onEdit, bookmark])

  // Called after confirm dialog completes
  const triggerExitAnimation = useCallback(() => {
    setIsDeleting(true)
  }, [])

  // Expose triggerExitAnimation via data attribute (used by parent)
  void triggerExitAnimation

  return (
    <article
      id={`bookmark-card-${bookmark.id}`}
      className={`glass-card ${isDeleting ? 'animate-card-exit' : 'animate-card-enter'}`}
      style={{
        animationDelay: isDeleting ? '0ms' : `${animationDelay}ms`,
        padding: '1rem',
        marginBottom: '0.75rem',
        position: 'relative',
        cursor: 'default',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Bookmark: ${bookmark.name}`}
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex items-start gap-3">
          {/* Favicon placeholder */}
          <div
            aria-hidden="true"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1rem',
              color: 'white',
              letterSpacing: '-0.02em',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {initial}
          </div>

          {/* Title & URL */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Name */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                color: 'var(--color-text-primary)',
                marginBottom: '0.2rem',
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {bookmark.name}
            </h2>

            {/* URL */}
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${bookmark.name} in new tab`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                color: 'var(--color-text-accent)',
                textDecoration: 'none',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                transition: 'color 150ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary-light)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-accent)' }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {host}
            </a>
          </div>

          {/* Action buttons → Delete & Edit — reveal on hover (or always visible on touch) */}
          <div
            className="flex items-center gap-1"
            style={{
              flexShrink: 0,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1)' : 'scale(0.8)',
              transition: 'opacity 150ms ease, transform 150ms ease',
              pointerEvents: isHovered ? 'auto' : 'none',
            }}
          >
            {/* Edit */}
            <button
              id={`edit-bookmark-${bookmark.id}`}
              onClick={handleEdit}
              aria-label={`Edit ${bookmark.name}`}
              className="btn-icon"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
              </svg>
            </button>

            {/* Delete */}
            <button
              id={`delete-bookmark-${bookmark.id}`}
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label={`Delete ${bookmark.name}`}
              className="btn-icon hover:text-red-500 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        {bookmark.description && (
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontFamily: 'var(--font-body)',
            }}
          >
            {bookmark.description}
          </p>
        )}
      </div>
    </article>
  )
}