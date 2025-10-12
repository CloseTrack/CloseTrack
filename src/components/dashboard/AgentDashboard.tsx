'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Building2, 
  Clock, 
  DollarSign,
  Users,
  Target,
  Calendar,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  TrendingDown,
  ArrowUpRight,
  Plus
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface AgentDashboardProps {
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

export default function AgentDashboard({ data, user }: AgentDashboardProps) {
  // Agent-specific stats
  const agentStats = [
    {
      name: 'Active Listings',
      value: data.activeTransactions,
      change: '+3 this week',
      changeType: 'positive',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      gradient: 'from-blue-500 to-blue-600',
      href: '/dashboard/transactions',
      subtitle: 'Your active deals'
    },
    {
      name: 'Commission Pipeline',
      value: formatCurrency(data.totalRevenue),
      change: '+$12.5K this month',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      gradient: 'from-emerald-500 to-emerald-600',
      href: '/dashboard/analytics',
      subtitle: 'Pending commissions'
    },
    {
      name: 'Active Clients',
      value: '18',
      change: '+4 new this month',
      changeType: 'positive',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      gradient: 'from-purple-500 to-purple-600',
      href: '/dashboard/clients',
      subtitle: 'Buyers & sellers'
    },
    {
      name: 'Urgent Tasks',
      value: data.upcomingDeadlines,
      change: '2 due today',
      changeType: 'urgent',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      gradient: 'from-orange-500 to-orange-600',
      href: '/dashboard/tasks',
      subtitle: 'Requires attention'
    },
  ]

  // Deal pipeline stages for agents
  const dealPipeline = [
    { stage: 'Lead', count: 12, color: 'bg-gray-400', value: 12 },
    { stage: 'Showing', count: 8, color: 'bg-blue-400', value: 8 },
    { stage: 'Offer', count: 5, color: 'bg-yellow-400', value: 5 },
    { stage: 'Under Contract', count: 4, color: 'bg-purple-400', value: 4 },
    { stage: 'Closing', count: 2, color: 'bg-green-400', value: 2 },
  ]

  // Top performing listings
  const topListings = [
    { address: '123 Main St, Princeton NJ', status: 'Under Contract', price: 750000, days: 12 },
    { address: '456 Oak Ave, Edison NJ', status: 'Active', price: 525000, days: 8 },
    { address: '789 Pine Rd, New Brunswick NJ', status: 'Pending', price: 620000, days: 15 },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header - Agent Specific */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.firstName || 'Agent'}! 🏡
          </h1>
          <p className="text-blue-100 text-lg">
            You have <span className="font-semibold text-white">{data.activeTransactions} active deals</span> and <span className="font-semibold text-white">{data.upcomingDeadlines} upcoming tasks</span> today
          </p>
          <div className="mt-6 flex items-center space-x-4">
            <Link href="/dashboard/transactions/new" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all inline-flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>New Listing</span>
            </Link>
            <Link href="/dashboard/clients/new" className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-400 transition-all inline-flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Add Client</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Agent Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {agentStats.map((stat, index) => {
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
                      'bg-gray-100 text-gray-700'
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

      {/* Deal Pipeline & Top Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deal Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Target className="h-6 w-6 text-blue-600 mr-2" />
              Deal Pipeline
            </h2>
            <Link href="/dashboard/transactions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {dealPipeline.map((stage, index) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                  <span className="text-sm font-semibold text-gray-900">{stage.count} deals</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stage.value / 12) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className={`${stage.color} h-3 rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-6 w-6 text-emerald-600 mr-2" />
              Hot Listings
            </h2>
            <Link href="/dashboard/transactions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {topListings.map((listing, index) => (
              <motion.div
                key={listing.address}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{listing.address}</p>
                  <p className="text-xs text-gray-600 mt-1">{formatCurrency(listing.price)}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      listing.status === 'Under Contract' ? 'bg-green-100 text-green-700' :
                      listing.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {listing.status}
                    </span>
                    <span className="text-xs text-gray-500">{listing.days} days on market</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <Link href="/dashboard/transactions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All →
          </Link>
        </div>
        {data.recentActivities.length > 0 ? (
          <div className="space-y-4">
            {data.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                  {activity.description && (
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  )}
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <Link href={`/dashboard/transactions/${activity.transaction.id}`} className="text-xs text-blue-600 hover:text-blue-700">
                      {activity.transaction.title}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

