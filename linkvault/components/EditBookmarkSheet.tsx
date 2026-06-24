'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Bookmark, BookmarkInput } from '@/types/bookmark'

interface EditBookmarkSheetProps {
  bookmark: Bookmark | null
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, input: BookmarkInput) => void | Promise<void>
  existingGroups?: string[]
}

type FormErrors = Partial<Record<keyof BookmarkInput, string>>

export default function EditBookmarkSheet({
  bookmark,
  isOpen,
  onClose,
  onSave,
  existingGroups = [],
}: EditBookmarkSheetProps) {
  const [form, setForm] = useState<BookmarkInput>({ name: '', url: '', description: '', group: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [groupSuggestions, setGroupSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  // Populate form when bookmark changes
  useEffect(() => {
    if (isOpen && bookmark) {
      setIsClosing(false)
      setForm({
        name: bookmark.name,
        url: bookmark.url,
        description: bookmark.description,
        group: bookmark.group,
      })
      setErrors({})
      setShowSuggestions(false)
      setTimeout(() => nameRef.current?.focus(), 150)
    }
  }, [isOpen, bookmark])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => { setIsClosing(false); onClose() }, 240)
  }, [onClose])

  function validate(): boolean {
    const next: FormErrors = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.url.trim()) {
      next.url = 'URL is required'
    } else {
      try {
        new URL(form.url.trim().startsWith('http') ? form.url.trim() : `https://${form.url.trim()}`)
      } catch { next.url = 'Enter a valid URL' }
    }
    if (!form.description.trim()) next.description = 'Description is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || !bookmark) return
    setIsSubmitting(true)
    const normalizedUrl = form.url.trim().startsWith('http') ? form.url.trim() : `https://${form.url.trim()}`
    await onSave(bookmark.id, {
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
      const filtered = existingGroups.filter((g) => g.toLowerCase().includes(value.toLowerCase()))
      setGroupSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setGroupSuggestions(existingGroups)
      setShowSuggestions(existingGroups.length > 0)
    }
  }

  if (!isOpen && !isClosing) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={isClosing ? 'animate-overlay-exit' : 'animate-overlay-enter'}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          backgroundColor: 'var(--color-overlay)',
          backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Sheet */}
      <div
        role="dialog" aria-modal="true" aria-label="Edit bookmark"
        className={isClosing ? 'animate-sheet-exit' : 'animate-sheet-enter'}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 50,
          width: '100%', maxWidth: '440px',
          backgroundColor: 'var(--color-surface-solid)',
          borderLeft: '1px solid var(--color-border)',
          display: 'flex', flexDirection: 'column',
          boxShadow: 'var(--shadow-sheet)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 className="font-display" style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              Edit bookmark
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.125rem' }}>
              Update your saved link
            </p>
          </div>
          <button onClick={handleClose} aria-label="Close" className="btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Form */}
        <form id="edit-bookmark-form" onSubmit={handleSubmit} noValidate
          style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Name */}
          <div>
            <label htmlFor="edit-name" style={labelStyle}>Name <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input ref={nameRef} id="edit-name" type="text" className="input-field" placeholder="e.g. My Portfolio"
              value={form.name} onChange={(e) => handleChange('name', e.target.value)} maxLength={120} />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </div>

          {/* URL */}
          <div>
            <label htmlFor="edit-url" style={labelStyle}>URL <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input id="edit-url" type="url" className="input-field" placeholder="https://example.com"
              value={form.url} onChange={(e) => handleChange('url', e.target.value)}
              style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem' }} />
            {errors.url && <FieldError>{errors.url}</FieldError>}
          </div>

          {/* Group */}
          <div style={{ position: 'relative' }}>
            <label htmlFor="edit-group" style={labelStyle}>Group <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span></label>
            <input id="edit-group" type="text" className="input-field" placeholder="e.g. Personal Website"
              value={form.group} onChange={(e) => handleGroupInput(e.target.value)}
              onFocus={() => { setGroupSuggestions(existingGroups); setShowSuggestions(existingGroups.length > 0) }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              maxLength={60} autoComplete="off" />
            {showSuggestions && groupSuggestions.length > 0 && (
              <ul role="listbox" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 60,
                backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: '10px',
                padding: '0.375rem', margin: 0, listStyle: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
                {groupSuggestions.map((g) => (
                  <li key={g}>
                    <button type="button" onClick={() => { handleChange('group', g); setShowSuggestions(false) }}
                      style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.625rem', borderRadius: '7px',
                        background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                        fontSize: '0.875rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                      </svg>
                      {g}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="edit-description" style={labelStyle}>Description <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <textarea id="edit-description" className="input-field" placeholder="What is this link about?"
              value={form.description} onChange={(e) => handleChange('description', e.target.value)}
              rows={4} maxLength={400} style={{ resize: 'vertical', minHeight: '96px' }} />
            <div style={{ display: 'flex', justifyContent: errors.description ? 'space-between' : 'flex-end', marginTop: '0.375rem' }}>
              {errors.description && <FieldError>{errors.description}</FieldError>}
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}>{form.description.length}/400</span>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.75rem', flexShrink: 0, backgroundColor: 'var(--color-surface-solid)' }}>
          <button type="button" onClick={handleClose} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
          <button type="submit" form="edit-bookmark-form" className="btn btn-primary" disabled={isSubmitting} style={{ flex: 2 }}>
            {isSubmitting ? (
              <><span style={spinnerStyle} aria-hidden="true" />Saving…</>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>
                </svg>
                Save changes
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }
const spinnerStyle: React.CSSProperties = { width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }

function FieldError({ children }: { children: React.ReactNode }) {
  return <p role="alert" style={{ fontSize: '0.75rem', color: 'var(--color-error)', marginTop: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
    {children}
  </p>
}
