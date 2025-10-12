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
  BarChart3,
  Award,
  TrendingDown,
  ArrowUpRight,
  Plus,
  UserPlus,
  Building
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface BrokerDashboardProps {
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

export default function BrokerDashboard({ data, user }: BrokerDashboardProps) {
  // Broker-specific stats
  const brokerStats = [
    {
      name: 'Office Transactions',
      value: data.activeTransactions * 5, // Multiply by team size
      change: '+18% this month',
      changeType: 'positive',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      gradient: 'from-blue-500 to-blue-600',
      href: '/dashboard/transactions',
      subtitle: 'All office deals'
    },
    {
      name: 'Total Office Revenue',
      value: formatCurrency(data.totalRevenue * 5), // Office total
      change: '+$45.2K this month',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      gradient: 'from-emerald-500 to-emerald-600',
      href: '/dashboard/analytics',
      subtitle: 'Gross commission'
    },
    {
      name: 'Active Agents',
      value: '24',
      change: '+3 new this month',
      changeType: 'positive',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      gradient: 'from-purple-500 to-purple-600',
      href: '/dashboard/team-management',
      subtitle: 'Your team'
    },
    {
      name: 'Office Performance',
      value: '94%',
      change: '+2.5%',
      changeType: 'positive',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      gradient: 'from-orange-500 to-orange-600',
      href: '/dashboard/analytics',
      subtitle: 'Closing rate'
    },
  ]

  // Top performing agents
  const topAgents = [
    { name: 'Sarah Johnson', deals: 12, revenue: 145000, change: '+15%', avatar: 'SJ' },
    { name: 'Mike Thompson', deals: 9, revenue: 118000, change: '+12%', avatar: 'MT' },
    { name: 'Lisa Chen', deals: 8, revenue: 95000, change: '+8%', avatar: 'LC' },
    { name: 'David Rodriguez', deals: 7, revenue: 87000, change: '+6%', avatar: 'DR' },
  ]

  // Office metrics
  const officeMetrics = [
    { metric: 'Average Deal Size', value: '$425,000', change: '+5.2%', trend: 'up' },
    { metric: 'Days to Close', value: '42 days', change: '-3 days', trend: 'up' },
    { metric: 'Client Satisfaction', value: '4.8/5.0', change: '+0.2', trend: 'up' },
    { metric: 'Market Share', value: '12.5%', change: '+1.1%', trend: 'up' },
  ]

  // Recent office activity
  const officeActivity = [
    { agent: 'Sarah Johnson', action: 'Closed deal', property: '123 Main St', amount: 750000, time: '2 hours ago' },
    { agent: 'Mike Thompson', action: 'New listing', property: '456 Oak Ave', amount: 525000, time: '5 hours ago' },
    { agent: 'Lisa Chen', action: 'Offer accepted', property: '789 Pine Rd', amount: 620000, time: '1 day ago' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header - Broker Specific */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            Broker Dashboard - {user.firstName || 'Broker'} 📊
          </h1>
          <p className="text-indigo-100 text-lg">
            Your office has <span className="font-semibold text-white">{data.activeTransactions * 5} active transactions</span> with <span className="font-semibold text-white">24 agents</span> performing at 94%
          </p>
          <div className="mt-6 flex items-center space-x-4">
            <Link href="/dashboard/team-management" className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all inline-flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Invite Agent</span>
            </Link>
            <Link href="/dashboard/analytics" className="bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-400 transition-all inline-flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>View Reports</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Broker Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {brokerStats.map((stat, index) => {
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

      {/* Top Agents & Office Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Agents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Award className="h-6 w-6 text-yellow-600 mr-2" />
              Top Performers
            </h2>
            <Link href="/dashboard/team-management" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {topAgents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-xl font-semibold">
                  {agent.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{agent.name}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-gray-600">{agent.deals} deals</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs font-medium text-emerald-600">{formatCurrency(agent.revenue)}</span>
                  </div>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {agent.change}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Office Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-6 w-6 text-indigo-600 mr-2" />
              Office Metrics
            </h2>
            <Link href="/dashboard/analytics" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Full Report →
            </Link>
          </div>
          <div className="space-y-4">
            {officeMetrics.map((metric, index) => (
              <motion.div
                key={metric.metric}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    metric.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Office Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Office Activity</h2>
          <Link href="/dashboard/transactions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All →
          </Link>
        </div>
        <div className="space-y-4">
          {officeActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl"
            >
              <div className="p-2 bg-indigo-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {activity.agent} - {activity.action}
                </p>
                <p className="text-sm text-gray-600 mt-1">{activity.property}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs font-medium text-emerald-600">{formatCurrency(activity.amount)}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

