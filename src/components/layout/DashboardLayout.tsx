'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './Header'
import Sidebar from './Sidebar'
import { ToastContainer, useToast } from '@/components/ui/Toast'
import { createContext, useContext } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Create toast context
const ToastContext = createContext<ReturnType<typeof useToast> | null>(null)

export function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const toast = useToast()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  // Don't show layout for auth pages
  if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up') || pathname === '/') {
    return <>{children}</>
  }

  return (
    <ToastContext.Provider value={toast}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header 
          onToggleSidebar={toggleSidebar} 
          sidebarOpen={sidebarOpen}
        />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={closeSidebar}
          />

          {/* Main Content */}
          <main className={`flex-1 transition-all duration-300 ${
            isMobile ? 'ml-0' : sidebarOpen ? 'ml-72' : 'ml-0'
          }`}>
            <div className="p-4 sm:p-6 lg:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-7xl mx-auto"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>

        {/* Toast Container */}
        <ToastContainer 
          toasts={toast.toasts} 
          onClose={toast.removeToast}
        />
      </div>
    </ToastContext.Provider>
  )
}
