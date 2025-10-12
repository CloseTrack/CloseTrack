'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Building2, 
  Clock, 
  DollarSign,
  FileText,
  Target,
  Calendar,
  CheckCircle,
  AlertCircle,
  Shield,
  Briefcase,
  AlertTriangle,
  Search,
  Plus,
  FolderOpen
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface TitleCompanyDashboardProps {
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

export default function TitleCompanyDashboard({ data, user }: TitleCompanyDashboardProps) {
  // Title company specific stats
  const titleStats = [
    {
      name: 'Active Closings',
      value: data.activeTransactions,
      change: 'On schedule',
      changeType: 'positive',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      gradient: 'from-blue-500 to-blue-600',
      href: '/dashboard/transactions',
      subtitle: 'In escrow'
    },
    {
      name: 'Pending Title Searches',
      value: '8',
      change: '3 urgent',
      changeType: 'urgent',
      icon: Search,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      gradient: 'from-orange-500 to-orange-600',
      href: '/dashboard/tasks',
      subtitle: 'Requires attention'
    },
    {
      name: 'Documents Ready',
      value: '12',
      change: '+4 today',
      changeType: 'positive',
      icon: FileText,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      gradient: 'from-emerald-500 to-emerald-600',
      href: '/dashboard/documents',
      subtitle: 'Ready for signing'
    },
    {
      name: 'Closings This Week',
      value: data.upcomingDeadlines,
      change: '2 scheduled today',
      changeType: 'neutral',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      gradient: 'from-purple-500 to-purple-600',
      href: '/dashboard/calendar',
      subtitle: 'Upcoming'
    },
  ]

  // Closing pipeline for title companies
  const closingPipeline = [
    { stage: 'Title Search', count: 8, color: 'bg-gray-400', icon: Search },
    { stage: 'Underwriting', count: 6, color: 'bg-blue-400', icon: Shield },
    { stage: 'Document Prep', count: 12, color: 'bg-yellow-400', icon: FileText },
    { stage: 'Ready to Close', count: 5, color: 'bg-emerald-400', icon: CheckCircle },
    { stage: 'Closed', count: 24, color: 'bg-green-400', icon: Building2 },
  ]

  // Recent closings
  const recentClosings = [
    { property: '123 Main St, Princeton NJ', status: 'Closed', date: '2024-01-15', amount: 750000, agent: 'Sarah Johnson' },
    { property: '456 Oak Ave, Edison NJ', status: 'Scheduled', date: '2024-01-18', amount: 525000, agent: 'Mike Thompson' },
    { property: '789 Pine Rd, New Brunswick NJ', status: 'Pending Docs', date: '2024-01-20', amount: 620000, agent: 'Lisa Chen' },
  ]

  // Title issues/alerts
  const titleIssues = [
    { property: '321 Elm St', issue: 'Outstanding lien discovered', severity: 'high', daysOpen: 3 },
    { property: '654 Maple Dr', issue: 'Survey discrepancy', severity: 'medium', daysOpen: 5 },
    { property: '987 Oak Ln', issue: 'Missing documentation', severity: 'low', daysOpen: 2 },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header - Title Company Specific */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            Title Company Dashboard 📋
          </h1>
          <p className="text-emerald-100 text-lg">
            You have <span className="font-semibold text-white">{data.activeTransactions} active closings</span> and <span className="font-semibold text-white">8 pending title searches</span> to complete
          </p>
          <div className="mt-6 flex items-center space-x-4">
            <Link href="/dashboard/tasks" className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all inline-flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>View Pending Tasks</span>
            </Link>
            <Link href="/dashboard/documents" className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-400 transition-all inline-flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Documents</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Title Company Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {titleStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link key={stat.name} href={stat.href} className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 min-w-0 cursor-pointer"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      stat.changeType === 'positive' ? 'bg-green-100 text-green-700' :
                      stat.changeType === 'urgent' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.name}</h3>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
              </motion.div>
            </Link>
          )
        })}
      </div>

      {/* Closing Pipeline & Title Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Closing Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Briefcase className="h-6 w-6 text-emerald-600 mr-2" />
              Closing Pipeline
            </h2>
            <Link href="/dashboard/transactions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {closingPipeline.map((stage, index) => {
              const Icon = stage.icon
              return (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 ${stage.color} rounded-lg`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{stage.count}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Title Issues & Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
              Active Issues
            </h2>
            <Link href="/dashboard/tasks" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {titleIssues.map((issue, index) => (
              <motion.div
                key={issue.property}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-900">{issue.property}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                    issue.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {issue.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{issue.issue}</p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{issue.daysOpen} days open</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Closings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Closings</h2>
          <Link href="/dashboard/transactions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Property</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Closing Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Agent</th>
              </tr>
            </thead>
            <tbody>
              {recentClosings.map((closing, index) => (
                <motion.tr
                  key={closing.property}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-4 px-4">
                    <p className="text-sm font-medium text-gray-900">{closing.property}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      closing.status === 'Closed' ? 'bg-green-100 text-green-700' :
                      closing.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {closing.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600">{closing.date}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(closing.amount)}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600">{closing.agent}</p>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions for Title Companies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Link href="/dashboard/tasks" className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg text-white hover:shadow-xl transition-all">
          <Search className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold mb-1">New Title Search</h3>
          <p className="text-sm text-blue-100">Initiate a new title search</p>
        </Link>
        <Link href="/dashboard/documents" className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg text-white hover:shadow-xl transition-all">
          <FileText className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold mb-1">Prepare Documents</h3>
          <p className="text-sm text-emerald-100">Generate closing documents</p>
        </Link>
        <Link href="/dashboard/calendar" className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg text-white hover:shadow-xl transition-all">
          <Calendar className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold mb-1">Schedule Closing</h3>
          <p className="text-sm text-purple-100">Set up a closing appointment</p>
        </Link>
      </motion.div>
    </div>
  )
}

