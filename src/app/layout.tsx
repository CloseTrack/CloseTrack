import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import DashboardLayout from '@/components/layout/DashboardLayout'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CloseTrack - Close Deals Faster. Track Everything Effortlessly.',
  description: 'Close Deals Faster. Track everything effortlessly.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CloseTrack',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
        <head>
          {/* iOS Meta Tags */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="CloseTrack" />
          
          {/* Disable tap highlight on iOS */}
          <meta name="format-detection" content="telephone=no" />
          
          {/* Prevent text size adjustment on orientation change */}
          <meta name="mobile-web-app-capable" content="yes" />
        </head>
        <body className="antialiased">
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </body>
      </html>
    </ClerkProvider>
  )
}
