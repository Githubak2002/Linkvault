'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { Bookmark, BookmarkInput } from '@/types/bookmark'
import {
  fetchBookmarks,
  addBookmark,
  updateBookmark,
  deleteBookmark,
  deleteBookmarksByGroup,
  searchBookmarks,
  getUniqueGroups,
} from '@/lib/bookmark-utils'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import BookmarkList from '@/components/BookmarkList'
import AddBookmarkSheet from '@/components/AddBookmarkSheet'
import EditBookmarkSheet from '@/components/EditBookmarkSheet'
import BottomNav from '@/components/BottomNav'
import ConfirmDeleteDialog, { ConfirmDeleteConfig } from '@/components/ConfirmDeleteDialog'

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [query, setQuery] = useState<string>('')
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined)

  // Edit state
  const [editTarget, setEditTarget] = useState<Bookmark | null>(null)
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)

  // Delete confirmation state
  const [deleteConfig, setDeleteConfig] = useState<ConfirmDeleteConfig | null>(null)
  const [pendingDeleteAction, setPendingDeleteAction] = useState<(() => Promise<void>) | null>(null)

  // Load user + bookmarks on mount
  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email ?? undefined)

      try {
        const data = await fetchBookmarks()
        setBookmarks(data)
      } catch (err) {
        console.error('Failed to load bookmarks:', err)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const filteredBookmarks = useMemo(
    () => searchBookmarks(query, bookmarks),
    [query, bookmarks],
  )

  const existingGroups = useMemo(() => getUniqueGroups(bookmarks), [bookmarks])

  /* ── Add ── */
  const handleAdd = useCallback(async (input: BookmarkInput) => {
    try {
      const created = await addBookmark(input)
      setBookmarks((prev) => [created, ...prev])
    } catch (err) {
      console.error('Failed to add bookmark:', err)
    }
  }, [])

  /* ── Edit ── */
  const handleEditClick = useCallback((bookmark: Bookmark) => {
    setEditTarget(bookmark)
    setIsEditOpen(true)
  }, [])

  const handleEditSave = useCallback(async (id: string, input: BookmarkInput) => {
    try {
      const updated = await updateBookmark(id, input)
      setBookmarks((prev) => prev.map((b) => (b.id === id ? updated : b)))
    } catch (err) {
      console.error('Failed to update bookmark:', err)
    }
  }, [])

  /* ── Delete single bookmark (via confirm dialog) ── */
  const handleDeleteClick = useCallback((bookmark: Bookmark) => {
    setDeleteConfig({
      type: 'bookmark',
      confirmText: bookmark.name,
      label: bookmark.name,
    })
    setPendingDeleteAction(() => async () => {
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmark.id))
      try {
        await deleteBookmark(bookmark.id)
      } catch (err) {
        console.error('Failed to delete bookmark:', err)
        const data = await fetchBookmarks()
        setBookmarks(data)
      }
    })
  }, [])

  /* ── Delete entire group (via confirm dialog) ── */
  const handleDeleteGroup = useCallback((groupName: string, count: number) => {
    setDeleteConfig({
      type: 'group',
      confirmText: groupName,
      label: groupName,
      count,
    })
    setPendingDeleteAction(() => async () => {
      setBookmarks((prev) => prev.filter((b) => b.group !== groupName))
      try {
        await deleteBookmarksByGroup(groupName)
      } catch (err) {
        console.error('Failed to delete group:', err)
        const data = await fetchBookmarks()
        setBookmarks(data)
      }
    })
  }, [])

  /* ── Confirm / Cancel delete ── */
  const handleConfirmDelete = useCallback(async () => {
    if (pendingDeleteAction) {
      await pendingDeleteAction()
    }
    setDeleteConfig(null)
    setPendingDeleteAction(null)
  }, [pendingDeleteAction])

  const handleCancelDelete = useCallback(() => {
    setDeleteConfig(null)
    setPendingDeleteAction(null)
  }, [])

  const handleOpenAdd = useCallback(() => setIsAddOpen(true), [])
  const handleCloseAdd = useCallback(() => setIsAddOpen(false), [])
  const handleCloseEdit = useCallback(() => { setIsEditOpen(false); setEditTarget(null) }, [])
  const handleClearSearch = useCallback(() => setQuery(''), [])

  return (
    <main
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--color-bg)',
        transition: 'background-color 200ms ease',
      }}
    >
      <Header onAddClick={handleOpenAdd} userEmail={userEmail} />

      <SearchBar
        query={query}
        onChange={setQuery}
        resultCount={filteredBookmarks.length}
        totalCount={bookmarks.length}
      />

      <div className="mx-auto max-w-2xl px-4" style={{ paddingTop: '0.75rem' }}>
        {isLoading ? (
          <div style={{ paddingTop: '1rem' }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: '90px',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '14px',
                  marginBottom: '0.75rem',
                  opacity: 1 - i * 0.18,
                  animation: 'pulse 1.8s ease-in-out infinite',
                  animationDelay: `${i * 120}ms`,
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        ) : (
          <BookmarkList
            bookmarks={bookmarks}
            filteredBookmarks={filteredBookmarks}
            query={query}
            onDelete={handleDeleteClick}
            onEdit={handleEditClick}
            onDeleteGroup={handleDeleteGroup}
            onAddClick={handleOpenAdd}
            onClearSearch={handleClearSearch}
          />
        )}
      </div>

      <BottomNav onAddClick={handleOpenAdd} userEmail={userEmail} />

      <AddBookmarkSheet
        isOpen={isAddOpen}
        onClose={handleCloseAdd}
        onAdd={handleAdd}
        existingGroups={existingGroups}
      />

      <EditBookmarkSheet
        bookmark={editTarget}
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        onSave={handleEditSave}
        existingGroups={existingGroups}
      />

      <ConfirmDeleteDialog
        config={deleteConfig}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </main>
  )
}
