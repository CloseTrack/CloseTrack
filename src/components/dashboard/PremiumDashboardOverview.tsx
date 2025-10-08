'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Building2, 
  Clock, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  Plus,
  Activity,
  BarChart3,
  Target
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import AnimatedProgress from '@/components/ui/AnimatedProgress'

interface PremiumDashboardOverviewProps {
  data: {
    activeTransactions: number
    totalRevenue: number
    upcomingDeadlines: number
    recentActivities: Array<{
      id: string
      type: string
      title: string
      description: string | null
      createdAt: Date
      transaction: {
        id: string
        title: string
      }
      user: {
        firstName: string | null
        lastName: string | null
      }
    }>
  }
  user: {
    firstName: string | null
    lastName: string | null
    role: string
  }
}

export default function PremiumDashboardOverview({ data, user }: PremiumDashboardOverviewProps) {
  const stats = [
    {
      name: 'Active Deals',
      value: data.activeTransactions,
      change: '+12%',
      changeType: 'positive',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Total Revenue',
      value: formatCurrency(data.totalRevenue),
      change: '+8.2%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      name: 'Upcoming Deadlines',
      value: data.upcomingDeadlines,
      change: '-3',
      changeType: 'negative',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      gradient: 'from-orange-500 to-orange-600',
    },
    {
      name: 'This Month',
      value: '24',
      change: '+18%',
      changeType: 'positive',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      gradient: 'from-purple-500 to-purple-600',
    },
  ]

  const quickActions = [
    {
      name: 'New Deal',
      description: 'Start a new transaction',
      href: '/dashboard/transactions/new',
      icon: Plus,
      color: 'bg-gradient-primary',
    },
    {
      name: 'Add Client',
      description: 'Register a new client',
      href: '/dashboard/clients/new',
      icon: Users,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
    {
      name: 'Upload Document',
      description: 'Add transaction documents',
      href: '/dashboard/documents/new',
      icon: FileText,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
    },
    {
      name: 'Schedule Meeting',
      description: 'Book a client meeting',
      href: '/dashboard/calendar/new',
      icon: Calendar,
      color: 'bg-gradient-to-r from-indigo-500 to-blue-500',
    },
  ]

  const recentDeals = [
    {
      id: '1',
      title: '123 Main Street',
      status: 'Under Contract',
      price: 450000,
      client: 'John & Jane Smith',
      daysLeft: 15,
      progress: 75,
    },
    {
      id: '2',
      title: '456 Oak Avenue',
      status: 'Inspection',
      price: 320000,
      client: 'Mike Johnson',
      daysLeft: 8,
      progress: 45,
    },
    {
      id: '3',
      title: '789 Pine Road',
      status: 'Appraisal',
      price: 680000,
      client: 'Sarah Williams',
      daysLeft: 22,
      progress: 90,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
          Welcome back, {user.firstName}! 👋
        </h1>
        <p className="text-xl text-gray-600">
          Here's what's happening with your deals today
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-white p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 min-w-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor} flex-shrink-0`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-xs sm:text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                    <span className="truncate">{stat.change}</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate" title={stat.value}>
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.name}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Target className="h-5 w-5 text-primary-600 mr-2" />
                Quick Actions
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <motion.div
                    key={action.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={action.href}
                      className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className={`p-3 rounded-xl ${action.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-200`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{action.name}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 text-primary-600 mr-2" />
                Recent Activity
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {data.recentActivities.length > 0 ? (
                data.recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.type === 'status_change' ? 'Status Change' : 
                           activity.type === 'document_upload' ? 'Document Upload' :
                           activity.type === 'deadline_created' ? 'Deadline Created' :
                           activity.type === 'deadline_completed' ? 'Deadline Completed' :
                           activity.type === 'participant_added' ? 'Participant Added' :
                           activity.type === 'comment_added' ? 'Comment Added' :
                           activity.type.charAt(0).toUpperCase() + activity.type.slice(1).replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description || activity.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDistanceToNow(activity.createdAt, { addSuffix: true })} • 
                          {activity.user.firstName} {activity.user.lastName}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                  <p className="text-sm text-gray-400 mt-1">Activity will appear here as you work on deals</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Deals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 text-primary-600 mr-2" />
                Recent Deals
              </h2>
              <Link
                href="/dashboard/transactions"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900">{deal.title}</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {deal.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{deal.client}</p>
                    <div className="mt-3">
                      <AnimatedProgress
                        progress={deal.progress}
                        size="sm"
                        showPercentage={true}
                        animated={true}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(deal.price)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {deal.daysLeft} days left
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
