import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Embla Carousel Loop React',
  description: 'Embla carousel implementation with Next.js, React and TypeScript',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="theme-dark">
      <body>{children}</body>
    </html>
  )
}