import { Bookmark, BookmarkInput } from '@/types/bookmark'
import { createClient } from '@/lib/supabase/client'

/**
 * Supabase-backed data-layer utilities (Phase 2).
 * All bookmark CRUD is isolated here — components never touch Supabase directly.
 *
 * ─── DB Schema (run in Supabase SQL Editor) ─────────────────────────────────
 *
 * create table public.bookmarks (
 *   id          uuid primary key default gen_random_uuid(),
 *   user_id     uuid not null references auth.users(id) on delete cascade,
 *   name        text not null,
 *   url         text not null,
 *   description text not null default '',
 *   group_name  text not null default '',
 *   created_at  timestamptz not null default now()
 * );
 *
 * alter table public.bookmarks enable row level security;
 *
 * create policy "Users can manage own bookmarks"
 *   on public.bookmarks for all
 *   using (auth.uid() = user_id)
 *   with check (auth.uid() = user_id);
 *
 * create index bookmarks_user_id_idx
 *   on public.bookmarks (user_id, created_at desc);
 *
 * ────────────────────────────────────────────────────────────────────────────
 */

/** Shape of a row as returned by Supabase */
interface BookmarkRow {
  id: string
  user_id: string
  name: string
  url: string
  description: string
  group_name: string
  created_at: string
}

/** Convert a DB row to a typed Bookmark */
function rowToBookmark(row: BookmarkRow): Bookmark {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    description: row.description,
    group: row.group_name,
    createdAt: new Date(row.created_at),
  }
}

/** Fetch all bookmarks for the current user, newest first */
export async function fetchBookmarks(): Promise<Bookmark[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as BookmarkRow[]).map(rowToBookmark)
}

/** Insert a new bookmark; returns the created record */
export async function addBookmark(input: BookmarkInput): Promise<Bookmark> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('bookmarks')
    .insert({
      user_id: user.id,
      name: input.name,
      url: input.url,
      description: input.description,
      group_name: input.group,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return rowToBookmark(data as BookmarkRow)
}

/** Delete a bookmark by ID */
export async function deleteBookmark(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('bookmarks').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

/**
 * Filter bookmarks client-side by query.
 * Matches name, description, url, and group (case-insensitive substring).
 */
export function searchBookmarks(query: string, bookmarks: Bookmark[]): Bookmark[] {
  const q = query.trim().toLowerCase()
  if (!q) return bookmarks
  return bookmarks.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.url.toLowerCase().includes(q) ||
      b.group.toLowerCase().includes(q),
  )
}

/**
 * Group bookmarks into an ordered map.
 * Named groups are sorted A→Z; ungrouped ('') is always last.
 * Returns: [ [groupName, Bookmark[]], ... ]
 */
export function groupBookmarks(bookmarks: Bookmark[]): [string, Bookmark[]][] {
  const map = new Map<string, Bookmark[]>()

  for (const b of bookmarks) {
    const key = b.group.trim()
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(b)
  }

  // Sort: named groups alphabetically, '' at the end
  const entries = Array.from(map.entries())
  entries.sort(([a], [b]) => {
    if (a === '') return 1
    if (b === '') return -1
    return a.localeCompare(b)
  })

  return entries
}

/** Get sorted list of unique group names (excludes '' ungrouped) */
export function getUniqueGroups(bookmarks: Bookmark[]): string[] {
  const groups = new Set<string>()
  for (const b of bookmarks) {
    if (b.group.trim()) groups.add(b.group.trim())
  }
  return Array.from(groups).sort()
}

/** Extract the display hostname from a URL (strips www.) */
export function getDisplayHost(url: string): string {
  try {
    const { hostname } = new URL(url)
    return hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/** Get the first letter of a URL's hostname for the favicon placeholder */
export function getHostInitial(url: string): string {
  return getDisplayHost(url).charAt(0).toUpperCase()
}
