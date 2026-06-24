'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { Bookmark, BookmarkInput } from '@/types/bookmark'
import {
  fetchBookmarks,
  addBookmark,
  deleteBookmark,
  searchBookmarks,
  getUniqueGroups,
} from '@/lib/bookmark-utils'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import BookmarkList from '@/components/BookmarkList'
import AddBookmarkSheet from '@/components/AddBookmarkSheet'

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [query, setQuery] = useState<string>('')
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined)

  // Load user + bookmarks on mount
  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
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

  /** Real-time filtered bookmarks */
  const filteredBookmarks = useMemo(
    () => searchBookmarks(query, bookmarks),
    [query, bookmarks],
  )

  /** Unique group names for autocomplete in the add sheet */
  const existingGroups = useMemo(() => getUniqueGroups(bookmarks), [bookmarks])

  const handleAdd = useCallback(async (input: BookmarkInput) => {
    try {
      const created = await addBookmark(input)
      setBookmarks((prev) => [created, ...prev])
    } catch (err) {
      console.error('Failed to add bookmark:', err)
    }
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    // Optimistic update — remove immediately for snappy feel
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
    try {
      await deleteBookmark(id)
    } catch (err) {
      console.error('Failed to delete bookmark:', err)
      // Rollback on failure
      const data = await fetchBookmarks()
      setBookmarks(data)
    }
  }, [])

  const handleOpenSheet = useCallback(() => setIsSheetOpen(true), [])
  const handleCloseSheet = useCallback(() => setIsSheetOpen(false), [])
  const handleClearSearch = useCallback(() => setQuery(''), [])

  return (
    <main
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--color-bg)',
        transition: 'background-color 200ms ease',
      }}
    >
      <Header onAddClick={handleOpenSheet} userEmail={userEmail} />

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
            onDelete={handleDelete}
            onAddClick={handleOpenSheet}
            onClearSearch={handleClearSearch}
          />
        )}
      </div>

      <AddBookmarkSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        onAdd={handleAdd}
        existingGroups={existingGroups}
      />
    </main>
  )
}
