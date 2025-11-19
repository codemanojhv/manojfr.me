import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Manoj - Student • Maker • Tech Explorer',
  description: 'Still in college. Still figuring life. Building shit. Breaking shit. Fixing shit again.',
  keywords: 'Manoj, Student, Maker, Tech Explorer, Designer, Developer, Builder',
  authors: [{ name: 'Manoj' }],
  openGraph: {
    title: 'Manoj - Student • Maker • Tech Explorer',
    description: 'Still in college. Still figuring life. Building shit. Breaking shit. Fixing shit again.',
    type: 'website', 
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manoj - Student • Maker • Tech Explorer',
    description: 'Still in college. Still figuring life. Building shit. Breaking shit. Fixing shit again.',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover' as const, // Supports safe-area-inset for notched devices
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">   
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}

