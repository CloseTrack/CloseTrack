'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  Building,
  Crown
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardSidebarProps {
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    role: string
    profileImageUrl?: string | null
  }
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: ['agent', 'buyer', 'seller', 'title_company']
      },
      {
        name: 'Transactions',
        href: '/dashboard/transactions',
        icon: FileText,
        roles: ['agent', 'buyer', 'seller', 'title_company']
      },
      {
        name: 'Calendar',
        href: '/dashboard/calendar',
        icon: Calendar,
        roles: ['agent', 'buyer', 'seller']
      },
      {
        name: 'Documents',
        href: '/dashboard/documents',
        icon: FileText,
        roles: ['agent', 'buyer', 'seller', 'title_company']
      }
    ]

    // Add role-specific items
    if (user.role === 'agent') {
      baseItems.push(
        {
          name: 'Team Management',
          href: '/dashboard/team',
          icon: Users,
          roles: ['agent']
        },
        {
          name: 'Analytics',
          href: '/dashboard/analytics',
          icon: BarChart3,
          roles: ['agent']
        }
      )
    }

    if (user.role === 'agent' || user.role === 'buyer') {
      baseItems.push({
        name: 'Clients',
        href: '/dashboard/clients',
        icon: Users,
        roles: ['agent', 'buyer']
      })
    }

    baseItems.push({
      name: 'Notifications',
      href: '/dashboard/notifications',
      icon: Bell,
      roles: ['agent', 'buyer', 'seller', 'title_company']
    })

    baseItems.push({
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      roles: ['agent', 'buyer', 'seller', 'title_company']
    })

    return baseItems.filter(item => item.roles.includes(user.role))
  }

  const navigationItems = getNavigationItems()

  const getRoleIcon = () => {
    switch (user.role) {
      case 'agent':
        return Home
      case 'title_company':
        return Crown
      default:
        return Users
    }
  }

  const RoleIcon = getRoleIcon()

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CT</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CloseTrack</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={`${user.firstName || 'User'} ${user.lastName || 'Name'}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-sm">
                  {(user.firstName || 'U').charAt(0)}{(user.lastName || 'N').charAt(0)}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName || 'User'} {user.lastName || 'Name'}
                </p>
                <div className="flex items-center space-x-1">
                  <RoleIcon className="w-3 h-3 text-gray-500" />
                  <p className="text-xs text-gray-500 truncate">
                    {user.role.replace('_', ' ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              CloseTrack v1.0.0
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
