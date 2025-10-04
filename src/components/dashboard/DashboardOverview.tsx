'use client'

import { 
  FileText, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users
} from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Decimal } from '@prisma/client/runtime/library'

interface DashboardOverviewProps {
  data: {
    activeTransactions: number
    totalRevenue: number | Decimal
    upcomingDeadlines: number
    recentActivities: Array<{
      id: string
      type: string
      title: string
      description?: string | null
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
  userRole: string
}

export default function DashboardOverview({ data, userRole }: DashboardOverviewProps) {
  const stats = [
    {
      name: 'Active Transactions',
      value: data.activeTransactions,
      icon: FileText,
      color: 'blue',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Total Revenue',
      value: formatCurrency(Number(data.totalRevenue)),
      icon: DollarSign,
      color: 'green',
      change: '+23%',
      changeType: 'positive'
    },
    {
      name: 'Upcoming Deadlines',
      value: data.upcomingDeadlines,
      icon: Calendar,
      color: 'yellow',
      change: '-5%',
      changeType: 'negative'
    },
    {
      name: 'Completion Rate',
      value: '94%',
      icon: TrendingUp,
      color: 'purple',
      change: '+2%',
      changeType: 'positive'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return CheckCircle
      case 'document_upload':
        return FileText
      case 'deadline_met':
        return CheckCircle
      case 'deadline_missed':
        return AlertTriangle
      case 'note':
        return Clock
      default:
        return Clock
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'status_change':
        return 'text-green-600'
      case 'document_upload':
        return 'text-blue-600'
      case 'deadline_met':
        return 'text-green-600'
      case 'deadline_missed':
        return 'text-red-600'
      case 'note':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'yellow' ? 'bg-yellow-100' :
                  'bg-purple-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'yellow' ? 'text-yellow-600' :
                    'text-purple-600'
                  }`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {data.recentActivities.length > 0 ? (
              data.recentActivities.map((activity, index) => {
                const ActivityIcon = getActivityIcon(activity.type)
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <ActivityIcon className={`w-4 h-4 ${getActivityColor(activity.type)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {activity.description || activity.transaction.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(activity.createdAt)} • {activity.user.firstName || 'User'} {activity.user.lastName || 'Name'}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activities</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Create New Transaction</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Add Client</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Schedule Deadline</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-900">View Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role-specific content */}
      {userRole === 'BROKER' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">12</div>
              <div className="text-sm text-gray-600">Active Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">$2.1M</div>
              <div className="text-sm text-gray-600">Team Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">97%</div>
              <div className="text-sm text-gray-600">Compliance Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
