'use client'

import { useState } from 'react'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Calendar,
  Eye,
  MessageSquare,
  Phone
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Decimal } from '@prisma/client/runtime/library'

interface TeamOverviewProps {
  data: {
    agents: Array<{
      id: string
      firstName: string | null
      lastName: string | null
      email: string
      phone?: string | null
      createdAt: Date
      _count: {
        transactions: number
      }
    }>
    transactions: Array<{
      id: string
      title: string
      status: string
      salePrice?: Decimal | null
      closingDate?: Date | null
      agent: {
        id: string
        firstName: string | null | null
        lastName: string | null | null
      }
    }>
    totalRevenue: number | Decimal
    complianceRate: number
  }
}

export default function TeamOverview({ data }: TeamOverviewProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  const stats = [
    {
      name: 'Active Agents',
      value: data.agents.length,
      icon: Users,
      color: 'blue',
      change: '+2',
      changeType: 'positive'
    },
    {
      name: 'Team Revenue',
      value: formatCurrency(Number(data.totalRevenue)),
      icon: DollarSign,
      color: 'green',
      change: '+15%',
      changeType: 'positive'
    },
    {
      name: 'Active Transactions',
      value: data.transactions.filter(t => t.status !== 'CLOSED').length,
      icon: FileText,
      color: 'purple',
      change: '+8',
      changeType: 'positive'
    },
    {
      name: 'Compliance Rate',
      value: `${Math.round((data.complianceRate / data.transactions.length) * 100)}%`,
      icon: CheckCircle,
      color: 'green',
      change: '+3%',
      changeType: 'positive'
    }
  ]

  const getAgentStats = (agentId: string) => {
    const agentTransactions = data.transactions.filter(t => t.agent.id === agentId)
    const closedTransactions = agentTransactions.filter(t => t.status === 'CLOSED')
    const totalRevenue = closedTransactions.reduce((sum, t) => sum + (Number(t.salePrice) || 0), 0)
    
    return {
      totalTransactions: agentTransactions.length,
      closedTransactions: closedTransactions.length,
      totalRevenue,
      completionRate: agentTransactions.length > 0 ? (closedTransactions.length / agentTransactions.length) * 100 : 0
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
                  stat.color === 'purple' ? 'bg-purple-100' :
                  'bg-yellow-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'purple' ? 'text-purple-600' :
                    'text-yellow-600'
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

      {/* Team Members */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          <button className="btn-primary">
            Add Agent
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.agents.map((agent) => {
                const agentStats = getAgentStats(agent.id)
                return (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                          {(agent.firstName || 'A').charAt(0)}{(agent.lastName || 'A').charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {agent.firstName || 'Agent'} {agent.lastName || 'Name'}
                          </div>
                          <div className="text-sm text-gray-500">{agent.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{agentStats.totalTransactions}</div>
                      <div className="text-sm text-gray-500">{agentStats.closedTransactions} closed</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(agentStats.totalRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${agentStats.completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900">
                          {Math.round(agentStats.completionRate)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Team Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {data.transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {transaction.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Agent: {transaction.agent.firstName || 'Agent'} {transaction.agent.lastName || 'Name'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.salePrice ? formatCurrency(Number(transaction.salePrice)) : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.closingDate ? formatDate(transaction.closingDate) : 'No date'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Missing Documents</p>
                <p className="text-xs text-yellow-600">3 transactions need attention</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
              <Clock className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">Overdue Deadlines</p>
                <p className="text-xs text-red-600">2 deadlines past due</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">All Clear</p>
                <p className="text-xs text-green-600">No compliance issues</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
