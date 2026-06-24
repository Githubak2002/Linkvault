export interface Bookmark {
  id: string
  name: string
  url: string
  description: string
  group: string        // '' = ungrouped; any other value = group name
  createdAt: Date
}

export type BookmarkInput = Omit<Bookmark, 'id' | 'createdAt'>
