import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Cosmic Explorer - Universe & Black Hole Simulations',
  description: 'Interactive 3D simulations of the cosmos. Explore the universe and witness the power of black holes.',
  keywords: 'universe, black hole, 3D simulation, cosmos, space, WebGL, Three.js',
  authors: [{ name: 'Manoj' }],
  openGraph: {
    title: 'Cosmic Explorer - Universe & Black Hole Simulations',
    description: 'Interactive 3D simulations of the cosmos. Explore the universe and witness the power of black holes.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cosmic Explorer - Universe & Black Hole Simulations',
    description: 'Interactive 3D simulations of the cosmos. Explore the universe and witness the power of black holes.',
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
      <body className={`${outfit.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}

