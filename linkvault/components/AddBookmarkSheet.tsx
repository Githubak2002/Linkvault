'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { BookmarkInput } from '@/types/bookmark'

interface AddBookmarkSheetProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (input: BookmarkInput) => void | Promise<void>
  existingGroups?: string[]   // autocomplete suggestions
}

const INITIAL_FORM: BookmarkInput = {
  name: '',
  url: '',
  description: '',
  group: '',
}

type FormErrors = Partial<Record<keyof BookmarkInput, string>>

export default function AddBookmarkSheet({
  isOpen,
  onClose,
  onAdd,
  existingGroups = [],
}: AddBookmarkSheetProps) {
  const [form, setForm] = useState<BookmarkInput>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [groupSuggestions, setGroupSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLUListElement>(null)

  // Focus first input on open
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false)
      setForm(INITIAL_FORM)
      setErrors({})
      setShowSuggestions(false)
      const t = setTimeout(() => nameRef.current?.focus(), 150)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 240)
  }, [onClose])

  function validate(): boolean {
    const next: FormErrors = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.url.trim()) {
      next.url = 'URL is required'
    } else {
      try {
        new URL(form.url.trim().startsWith('http') ? form.url.trim() : `https://${form.url.trim()}`)
      } catch {
        next.url = 'Enter a valid URL'
      }
    }
    if (!form.description.trim()) next.description = 'Description is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    const normalizedUrl = form.url.trim().startsWith('http')
      ? form.url.trim()
      : `https://${form.url.trim()}`

    await onAdd({
      name: form.name.trim(),
      url: normalizedUrl,
      description: form.description.trim(),
      group: form.group.trim(),
    })

    setIsSubmitting(false)
    handleClose()
  }

  function handleChange<K extends keyof BookmarkInput>(field: K, value: BookmarkInput[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleGroupInput(value: string) {
    handleChange('group', value)
    if (value.trim()) {
      const filtered = existingGroups.filter((g) =>
        g.toLowerCase().includes(value.toLowerCase()),
      )
      setGroupSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setGroupSuggestions(existingGroups)
      setShowSuggestions(existingGroups.length > 0)
    }
  }

  function selectSuggestion(group: string) {
    handleChange('group', group)
    setShowSuggestions(false)
  }

  if (!isOpen && !isClosing) return null

  return (
    <>
      {/* Backdrop */}
      <div
        id="sheet-backdrop"
        role="presentation"
        onClick={handleClose}
        className={isClosing ? 'animate-overlay-exit' : 'animate-overlay-enter'}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          backgroundColor: 'var(--color-overlay)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Sheet panel */}
      <div
        id="add-bookmark-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Add bookmark"
        className={isClosing ? 'animate-sheet-exit' : 'animate-sheet-enter'}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
          transition: 'background-color 200ms ease',
        }}
      >
        {/* Sheet header */}
        <div
          style={{
            padding: '1.25rem 1.25rem 1rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              className="font-display"
              style={{
                fontSize: '1.0625rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Add bookmark
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.125rem' }}>
              Save a link to your vault
            </p>
          </div>
          <button
            id="close-sheet-btn"
            onClick={handleClose}
            aria-label="Close sheet"
            className="btn-icon"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form
          id="add-bookmark-form"
          onSubmit={handleSubmit}
          noValidate
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Name */}
          <div>
            <label htmlFor="bookmark-name" style={labelStyle}>
              Name <span aria-hidden="true" style={{ color: 'var(--color-error)' }}>*</span>
            </label>
            <input
              ref={nameRef}
              id="bookmark-name"
              type="text"
              className="input-field"
              placeholder="e.g. My Portfolio"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              maxLength={120}
            />
            {errors.name && <FieldError id="name-error">{errors.name}</FieldError>}
          </div>

          {/* URL */}
          <div>
            <label htmlFor="bookmark-url" style={labelStyle}>
              URL <span aria-hidden="true" style={{ color: 'var(--color-error)' }}>*</span>
            </label>
            <input
              id="bookmark-url"
              type="url"
              className="input-field"
              placeholder="https://example.com"
              value={form.url}
              onChange={(e) => handleChange('url', e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.url}
              aria-describedby={errors.url ? 'url-error' : undefined}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem' }}
            />
            {errors.url && <FieldError id="url-error">{errors.url}</FieldError>}
          </div>

          {/* Group (optional) */}
          <div style={{ position: 'relative' }}>
            <label htmlFor="bookmark-group" style={labelStyle}>
              Group
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: '0.375rem' }}>
                (optional)
              </span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="bookmark-group"
                type="text"
                className="input-field"
                placeholder="e.g. Personal Website, Dev Tools…"
                value={form.group}
                onChange={(e) => handleGroupInput(e.target.value)}
                onFocus={() => {
                  setGroupSuggestions(
                    form.group.trim()
                      ? existingGroups.filter((g) => g.toLowerCase().includes(form.group.toLowerCase()))
                      : existingGroups,
                  )
                  setShowSuggestions(existingGroups.length > 0)
                }}
                onBlur={() => {
                  // Delay to allow click on suggestion
                  setTimeout(() => setShowSuggestions(false), 150)
                }}
                maxLength={60}
                autoComplete="off"
                style={{ paddingRight: form.group ? '2.5rem' : undefined }}
              />
              {/* Clear group button */}
              {form.group && (
                <button
                  type="button"
                  onClick={() => { handleChange('group', ''); setShowSuggestions(false) }}
                  aria-label="Clear group"
                  style={{
                    position: 'absolute',
                    right: '0.625rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                    padding: '2px',
                    transition: 'color 100ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-error)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Autocomplete suggestions dropdown */}
            {showSuggestions && groupSuggestions.length > 0 && (
              <ul
                ref={suggestionsRef}
                role="listbox"
                aria-label="Group suggestions"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  zIndex: 60,
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  padding: '0.375rem',
                  margin: 0,
                  listStyle: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  animation: 'card-enter 150ms ease both',
                }}
              >
                {groupSuggestions.map((g) => (
                  <li key={g}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={form.group === g}
                      onClick={() => selectSuggestion(g)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 0.625rem',
                        borderRadius: '7px',
                        background: form.group === g ? 'var(--color-surface-3)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.875rem',
                        color: 'var(--color-text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'background 100ms ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-3)' }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = form.group === g ? 'var(--color-surface-3)' : 'transparent'
                      }}
                    >
                      {/* Folder icon */}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                      </svg>
                      {g}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.375rem' }}>
              Type a new name or pick an existing group
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="bookmark-description" style={labelStyle}>
              Description <span aria-hidden="true" style={{ color: 'var(--color-error)' }}>*</span>
            </label>
            <textarea
              id="bookmark-description"
              className="input-field"
              placeholder="What is this link about?"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'desc-error' : undefined}
              rows={4}
              maxLength={400}
              style={{ resize: 'vertical', minHeight: '96px' }}
            />
            <div style={{ display: 'flex', justifyContent: errors.description ? 'space-between' : 'flex-end', marginTop: '0.375rem' }}>
              {errors.description && <FieldError id="desc-error">{errors.description}</FieldError>}
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}>
                {form.description.length}/400
              </span>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            gap: '0.75rem',
            flexShrink: 0,
            backgroundColor: 'var(--color-surface)',
            transition: 'background-color 200ms ease',
          }}
        >
          <button id="cancel-add-btn" type="button" onClick={handleClose} className="btn btn-ghost" style={{ flex: 1 }}>
            Cancel
          </button>
          <button
            id="submit-add-btn"
            type="submit"
            form="add-bookmark-form"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ flex: 2 }}
          >
            {isSubmitting ? (
              <>
                <span style={spinnerStyle} aria-hidden="true" />
                Saving…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                Save bookmark
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

/* ── Shared style objects ── */
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'var(--color-text-secondary)',
  marginBottom: '0.375rem',
  fontFamily: 'var(--font-body)',
}

const spinnerStyle: React.CSSProperties = {
  width: '14px',
  height: '14px',
  border: '2px solid rgba(255,255,255,0.4)',
  borderTopColor: 'white',
  borderRadius: '50%',
  animation: 'spin 0.7s linear infinite',
  display: 'inline-block',
}

/* ── FieldError helper ── */
function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p
      id={id}
      role="alert"
      style={{
        fontSize: '0.75rem',
        color: 'var(--color-error)',
        marginTop: '0.375rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      {children}
    </p>
  )
}
