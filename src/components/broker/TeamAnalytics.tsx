'use client'

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import { Decimal } from '@prisma/client/runtime/library'

interface TeamAnalyticsProps {
  data: {
    agents: Array<{
      id: string
      firstName: string | null
      lastName: string | null
      _count: {
        transactions: number
      }
    }>
    transactions: Array<{
      id: string
      status: string
      salePrice?: Decimal | null
      createdAt: Date | null
      agent: {
        firstName: string | null
        lastName: string | null
      }
    }>
    totalRevenue: number | Decimal
    complianceRate: number
  }
}

export default function TeamAnalytics({ data }: TeamAnalyticsProps) {
  // Prepare data for charts
  const agentPerformance = data.agents.map(agent => {
    const agentTransactions = data.transactions.filter(t => (t.agent.firstName || '') === (agent.firstName || ''))
    const closedTransactions = agentTransactions.filter(t => t.status === 'CLOSED')
    const revenue = closedTransactions.reduce((sum, t) => sum + (Number(t.salePrice) || 0), 0)
    
    return {
      name: `${agent.firstName || 'Agent'} ${agent.lastName || 'Name'}`,
      transactions: agentTransactions.length,
      revenue: revenue,
      completionRate: agentTransactions.length > 0 ? (closedTransactions.length / agentTransactions.length) * 100 : 0
    }
  })

  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000, transactions: 12 },
    { month: 'Feb', revenue: 52000, transactions: 15 },
    { month: 'Mar', revenue: 48000, transactions: 13 },
    { month: 'Apr', revenue: 61000, transactions: 18 },
    { month: 'May', revenue: 55000, transactions: 16 },
    { month: 'Jun', revenue: 67000, transactions: 20 }
  ]

  const statusDistribution = [
    { name: 'Under Contract', value: data.transactions.filter(t => t.status === 'UNDER_CONTRACT').length, color: '#3B82F6' },
    { name: 'Closing Scheduled', value: data.transactions.filter(t => t.status === 'CLOSING_SCHEDULED').length, color: '#10B981' },
    { name: 'Closed', value: data.transactions.filter(t => t.status === 'CLOSED').length, color: '#059669' },
    { name: 'Draft', value: data.transactions.filter(t => t.status === 'DRAFT').length, color: '#6B7280' }
  ]

  const COLORS = ['#3B82F6', '#10B981', '#059669', '#6B7280']

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${Number(data.totalRevenue).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-green-600">+12.5%</span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Transaction Value</p>
              <p className="text-2xl font-bold text-gray-900">$487K</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-green-600">+8.2%</span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">94.2%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-green-600">+2.1%</span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Deals</p>
              <p className="text-2xl font-bold text-gray-900">{data.transactions.filter(t => t.status !== 'CLOSED').length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-red-600">-3.2%</span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `$${value.toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenue' : 'Transactions'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Status Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Transaction Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agent Performance */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Agent Performance</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={agentPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="transactions" fill="#3B82F6" name="Transactions" />
            <Bar dataKey="revenue" fill="#10B981" name="Revenue ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Performance</h3>
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
                  Avg Deal Size
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agentPerformance.map((agent, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {agent.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {agent.transactions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${agent.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${agent.completionRate}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900">
                        {Math.round(agent.completionRate)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${agent.transactions > 0 ? Math.round(agent.revenue / agent.transactions).toLocaleString() : 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
