import type { Metadata } from 'next'
import type React from 'react'
import { ThemeProvider } from '@/lib/theme-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ak LinkVault - Personal Bookmark Manager',
  description:
    'Save, browse, and search your personal web bookmarks. A fast, focused, premium-quality link vault built for developers.',
  keywords: ['bookmarks', 'links', 'productivity', 'personal', 'web', 'developer tools'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
