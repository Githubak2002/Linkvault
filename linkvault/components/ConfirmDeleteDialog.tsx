'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export interface ConfirmDeleteConfig {
  /** What are we deleting? e.g. "bookmark" or "group" */
  type: 'bookmark' | 'group'
  /** The exact name the user must type to confirm */
  confirmText: string
  /** Display label for what's being deleted */
  label: string
  /** Count of items (for groups) */
  count?: number
}

interface ConfirmDeleteDialogProps {
  config: ConfirmDeleteConfig | null
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDeleteDialog({
  config,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) {
  const [input, setInput] = useState('')
  const [isClosing, setIsClosing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isMatch = input.trim() === config?.confirmText

  useEffect(() => {
    if (config) {
      setInput('')
      setIsClosing(false)
      setTimeout(() => inputRef.current?.focus(), 180)
    }
  }, [config])

  // Close on Escape
  useEffect(() => {
    if (!config) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCancel()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

  const handleCancel = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onCancel()
    }, 200)
  }, [onCancel])

  const handleConfirm = useCallback(() => {
    if (!isMatch) return
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onConfirm()
    }, 200)
  }, [isMatch, onConfirm])

  if (!config && !isClosing) return null

  const isGroup = config?.type === 'group'

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleCancel}
        className={isClosing ? 'animate-overlay-exit' : 'animate-overlay-enter'}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          backgroundColor: 'var(--color-overlay)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      {/* Dialog */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={`Confirm delete ${config?.label}`}
        className={isClosing ? 'animate-overlay-exit' : 'animate-fade-up'}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 61,
          width: '92%',
          maxWidth: '400px',
          backgroundColor: 'var(--color-surface-solid)',
          border: '1px solid var(--color-border)',
          borderRadius: '20px',
          padding: '1.75rem',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        {/* Warning icon */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="rgba(239,68,68,0.1)" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        {/* Title */}
        <h2
          className="font-display"
          style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          Delete {isGroup ? 'group' : 'bookmark'}
        </h2>

        {/* Description */}
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '0.25rem' }}>
          {isGroup ? (
            <>
              This will permanently delete the group{' '}
              <strong style={{ color: 'var(--color-text-primary)' }}>&ldquo;{config?.label}&rdquo;</strong>
              {config?.count ? ` and all ${config.count} bookmark${config.count > 1 ? 's' : ''} inside it` : ''}.
            </>
          ) : (
            <>
              This will permanently delete{' '}
              <strong style={{ color: 'var(--color-text-primary)' }}>&ldquo;{config?.label}&rdquo;</strong>.
            </>
          )}
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          This action cannot be undone.
        </p>

        {/* Confirmation input */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="confirm-delete-input"
            style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              marginBottom: '0.5rem',
            }}
          >
            Type <strong style={{ color: 'var(--color-error)', fontFamily: 'var(--font-display)' }}>{config?.confirmText}</strong> to confirm
          </label>
          <input
            ref={inputRef}
            id="confirm-delete-input"
            type="text"
            className="input-field"
            placeholder={config?.confirmText ?? ''}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isMatch) handleConfirm()
            }}
            autoComplete="off"
            spellCheck={false}
            style={{
              borderColor: input.length > 0 && !isMatch ? 'rgba(239,68,68,0.4)' : undefined,
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleCancel}
            className="btn btn-ghost"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isMatch}
            className="btn"
            style={{
              flex: 1,
              background: isMatch ? 'var(--color-error)' : 'var(--color-surface-3)',
              color: isMatch ? '#fff' : 'var(--color-text-muted)',
              cursor: isMatch ? 'pointer' : 'not-allowed',
              transition: 'background-color 160ms ease, color 160ms ease',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </>
  )
}
