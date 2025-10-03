'use client'

import { useState } from 'react'
import { 
  Calendar, 
  FileText, 
  Users, 
  DollarSign, 
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Download,
  MessageSquare,
  Phone,
  Mail
} from 'lucide-react'
import { formatCurrency, formatDate, formatDateTime, getStatusColor, calculateDaysUntilDeadline } from '@/lib/utils'
import { Decimal } from '@prisma/client/runtime/library'

interface ClientPortalProps {
  transactions: Array<{
    id: string
    title: string
    description?: string | null
    status: string
    propertyAddress: string
    propertyCity: string
    propertyState: string
    propertyZip: string
    salePrice?: Decimal | null
    contractDate?: Date | null
    closingDate?: Date | null
    createdAt: Date
    updatedAt: Date
    agent: {
      firstName: string
      lastName: string
      email: string
      phone?: string | null
    }
    participants: Array<{
      id: string
      role: string
      isPrimary: boolean
      user: {
        firstName: string
        lastName: string
        role: string
      }
    }>
    documents: Array<{
      id: string
      title: string
      type: string
      fileName: string
      createdAt: Date
      isSigned: boolean
    }>
    deadlines: Array<{
      id: string
      title: string
      dueDate: Date
      isCompleted: boolean
      isCritical: boolean
    }>
    activities: Array<{
      id: string
      type: string
      title: string
      description?: string | null
      createdAt: Date
      user: {
        firstName: string
        lastName: string
      }
    }>
  }>
  user: {
    id: string
    firstName: string
    lastName: string
    role: string
  }
}

export default function ClientPortal({ transactions, user }: ClientPortalProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    transactions.length > 0 ? transactions[0].id : null
  )

  const currentTransaction = transactions.find(t => t.id === selectedTransaction)

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'closed':
        return CheckCircle
      case 'cancelled':
        return AlertTriangle
      default:
        return Clock
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return CheckCircle
      case 'document_upload':
        return FileText
      case 'note':
        return MessageSquare
      default:
        return Clock
    }
  }

  const getUrgentDeadlines = () => {
    if (!currentTransaction) return []
    return currentTransaction.deadlines.filter(deadline => {
      if (deadline.isCompleted) return false
      const daysUntil = calculateDaysUntilDeadline(deadline.dueDate)
      return daysUntil <= 3
    })
  }

  const urgentDeadlines = getUrgentDeadlines()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your Transactions</h1>
        <p className="text-gray-600 mt-2">
          Track the progress of your real estate transactions and stay updated on important milestones.
        </p>
      </div>

      {/* Transaction Selector */}
      {transactions.length > 1 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Transaction</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transactions.map((transaction) => (
              <button
                key={transaction.id}
                onClick={() => setSelectedTransaction(transaction.id)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedTransaction === transaction.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-medium text-gray-900">{transaction.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {transaction.propertyAddress}, {transaction.propertyCity}
                </p>
                <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status.replace('_', ' ')}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {currentTransaction ? (
        <div className="space-y-6">
          {/* Transaction Overview */}
          <div className="card">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{currentTransaction.title}</h2>
                <div className="flex items-center space-x-4 mt-2 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{currentTransaction.propertyAddress}, {currentTransaction.propertyCity}, {currentTransaction.propertyState}</span>
                  </div>
                  {currentTransaction.salePrice && (
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{formatCurrency(Number(currentTransaction.salePrice))}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentTransaction.status)}`}>
                  {currentTransaction.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Key Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentTransaction.contractDate && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-gray-900">Contract Date</h4>
                  </div>
                  <p className="text-gray-600">{formatDate(currentTransaction.contractDate)}</p>
                </div>
              )}
              {currentTransaction.closingDate && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-gray-900">Closing Date</h4>
                  </div>
                  <p className="text-gray-600">{formatDate(currentTransaction.closingDate)}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <h4 className="font-medium text-gray-900">Last Updated</h4>
                </div>
                <p className="text-gray-600">{formatDateTime(currentTransaction.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Urgent Alerts */}
          {urgentDeadlines.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-medium text-red-800">Upcoming Deadlines</h3>
              </div>
              <div className="space-y-2">
                {urgentDeadlines.map((deadline) => {
                  const daysUntil = calculateDaysUntilDeadline(deadline.dueDate)
                  return (
                    <div key={deadline.id} className="flex items-center justify-between">
                      <span className="text-sm text-red-700">{deadline.title}</span>
                      <span className="text-sm font-medium text-red-800">
                        {daysUntil === 0 ? 'Due today' : `${daysUntil} day${daysUntil === 1 ? '' : 's'} left`}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Documents and Deadlines */}
            <div className="lg:col-span-2 space-y-6">
              {/* Documents */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Documents</h3>
                {currentTransaction.documents.length > 0 ? (
                  <div className="space-y-3">
                    {currentTransaction.documents.map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">{document.title}</h4>
                            <p className="text-sm text-gray-600">{document.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {document.isSigned && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Signed
                            </span>
                          )}
                          <button className="p-2 hover:bg-gray-200 rounded-lg">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-200 rounded-lg">
                            <Download className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No documents available yet</p>
                  </div>
                )}
              </div>

              {/* Deadlines */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Deadlines</h3>
                {currentTransaction.deadlines.length > 0 ? (
                  <div className="space-y-3">
                    {currentTransaction.deadlines.map((deadline) => {
                      const daysUntil = calculateDaysUntilDeadline(deadline.dueDate)
                      const isOverdue = daysUntil < 0 && !deadline.isCompleted
                      const isUrgent = daysUntil <= 3 && !deadline.isCompleted
                      
                      return (
                        <div key={deadline.id} className={`p-3 rounded-lg border ${
                          isOverdue ? 'border-red-200 bg-red-50' : 
                          isUrgent ? 'border-yellow-200 bg-yellow-50' : 
                          deadline.isCompleted ? 'border-green-200 bg-green-50' : 
                          'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                deadline.isCompleted ? 'bg-green-500' : 
                                isOverdue ? 'bg-red-500' : 
                                isUrgent ? 'bg-yellow-500' : 'bg-gray-300'
                              }`} />
                              <div>
                                <h4 className="font-medium text-gray-900">{deadline.title}</h4>
                                <p className="text-sm text-gray-600">{formatDate(deadline.dueDate)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              {deadline.isCompleted ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Completed
                                </span>
                              ) : (
                                <span className={`text-sm font-medium ${
                                  isOverdue ? 'text-red-600' : 
                                  isUrgent ? 'text-yellow-600' : 'text-gray-600'
                                }`}>
                                  {isOverdue ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days left`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No deadlines set yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Team and Activity */}
            <div className="space-y-6">
              {/* Your Agent */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Agent</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {currentTransaction.agent.firstName.charAt(0)}{currentTransaction.agent.lastName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {currentTransaction.agent.firstName} {currentTransaction.agent.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">Your Real Estate Agent</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <a 
                    href={`mailto:${currentTransaction.agent.email}`}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{currentTransaction.agent.email}</span>
                  </a>
                  {currentTransaction.agent.phone && (
                    <a 
                      href={`tel:${currentTransaction.agent.phone}`}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{currentTransaction.agent.phone}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h3>
                {currentTransaction.activities.length > 0 ? (
                  <div className="space-y-4">
                    {currentTransaction.activities.map((activity) => {
                      const ActivityIcon = getActivityIcon(activity.type)
                      return (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <ActivityIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            {activity.description && (
                              <p className="text-sm text-gray-600">{activity.description}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDateTime(activity.createdAt)} • {activity.user.firstName} {activity.user.lastName}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Message Agent</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Call Agent</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">Schedule Meeting</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-500">
            You don't have any active transactions yet. Contact your agent to get started.
          </p>
        </div>
      )}
    </div>
  )
}
