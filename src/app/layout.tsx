import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CloseTrack - Real Estate Transaction Management',
  description: 'Streamline your real estate transactions with CloseTrack. Manage deals, track deadlines, and keep clients updated with our comprehensive transaction management platform.',
  keywords: 'real estate, transaction management, closing, realtor, broker, title company',
  authors: [{ name: 'CloseTrack' }],
  openGraph: {
    title: 'CloseTrack - Real Estate Transaction Management',
    description: 'Streamline your real estate transactions with CloseTrack.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloseTrack - Real Estate Transaction Management',
    description: 'Streamline your real estate transactions with CloseTrack.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}