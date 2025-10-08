'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Home,
  TrendingUp,
  Users,
  FileText,
  Calendar,
  Bell,
  Settings,
  ChevronRight,
  BarChart3,
  Building2,
  Clock,
  CheckSquare,
  MessageSquare,
  Shield,
  HelpCircle,
  LogOut,
  Plus
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'Deals',
    href: '/dashboard/transactions',
    icon: Building2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    badge: '12',
  },
  {
    name: 'Tasks',
    href: '/dashboard/tasks',
    icon: CheckSquare,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    badge: '5',
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    name: 'Clients',
    href: '/dashboard/clients',
    icon: Users,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
  {
    name: 'Documents',
    href: '/dashboard/documents',
    icon: FileText,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    name: 'Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    name: 'Notifications',
    href: '/dashboard/notifications',
    icon: Bell,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    badge: '3',
  },
]

const secondaryNavigation = [
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    name: 'Help & Support',
    href: '/dashboard/help',
    icon: HelpCircle,
  },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="navigation"
        aria-label="Main navigation"
        id="main-navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-gray-900">CloseTrack</h1>
              <p className="text-xs text-gray-500 -mt-1">Close Deals Faster</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-100">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Deal</span>
            <span className="sm:hidden">New</span>
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 touch-manipulation ${
                    isActive
                      ? `${item.bgColor} ${item.color} shadow-sm`
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isActive ? item.bgColor : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? item.color : 'text-gray-600'}`} />
                    </div>
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Secondary Navigation */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            )
          })}

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </motion.button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-3">
            <p className="text-xs font-medium text-gray-900 mb-1">Upgrade to Pro</p>
            <p className="text-xs text-gray-600 mb-2">Unlock advanced features</p>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Learn more →
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
