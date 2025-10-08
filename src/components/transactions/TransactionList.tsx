'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Calendar, 
  FileText, 
  Users, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreVertical
} from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor, calculateDaysUntilDeadline } from '@/lib/utils'
import { Decimal } from '@prisma/client/runtime/library'

interface TransactionListProps {
  transactions: Array<{
    id: string
    title: string
    status: string
    propertyAddress: string
    propertyCity: string
    propertyState: string
    salePrice?: Decimal | null
    contractDate?: Date | null
    closingDate?: Date | null
    agent: {
      firstName: string | null
      lastName: string | null
    }
    participants: Array<{
      role: string
      user: {
        firstName: string | null
        lastName: string | null
        role: string
      }
    }>
    documents: Array<{
      id: string
      title: string
      type: string
      createdAt: Date
    }>
    deadlines: Array<{
      id: string
      title: string
      dueDate: Date
    }>
    _count: {
      activities: number
      documents: number
    }
  }>
  userRole: string
}

export default function TransactionList({ transactions, userRole }: TransactionListProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'closed':
        return CheckCircle
      case 'cancelled':
        return AlertTriangle
      case 'closing_scheduled':
        return CheckCircle
      default:
        return Clock
    }
  }

  const getUrgentDeadlines = (deadlines: any[]) => {
    return deadlines.filter(deadline => {
      const daysUntil = calculateDaysUntilDeadline(deadline.dueDate)
      return daysUntil <= 3
    })
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedStatus === 'all') return true
    return transaction.status.toLowerCase() === selectedStatus.toLowerCase()
  })

  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div className="flex space-x-2 mb-6">
        {['all', 'draft', 'under_contract', 'closing_scheduled', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedStatus === status
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Transactions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTransactions.map((transaction) => {
          const StatusIcon = getStatusIcon(transaction.status)
          const urgentDeadlines = getUrgentDeadlines(transaction.deadlines)
          
          return (
            <div key={transaction.id} className="card hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Link 
                    href={`/dashboard/transactions/${transaction.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {transaction.title}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
                    {transaction.propertyAddress}, {transaction.propertyCity}, {transaction.propertyState}
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2 mb-4">
                <StatusIcon className={`w-4 h-4 ${
                  transaction.status === 'closed' ? 'text-green-600' :
                  transaction.status === 'cancelled' ? 'text-red-600' :
                  'text-blue-600'
                }`} />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status.replace('_', ' ')}
                </span>
              </div>

              {/* Key Info */}
              <div className="space-y-3 mb-4">
                {transaction.salePrice && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatCurrency(Number(transaction.salePrice))}
                    </span>
                  </div>
                )}
                
                {transaction.closingDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Closing: {formatDate(transaction.closingDate)}
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Agent: {transaction.agent.firstName || 'Agent'} {transaction.agent.lastName || 'Name'}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <span>{transaction._count.documents} docs</span>
                  <span>{transaction._count.activities} activities</span>
                </div>
                {urgentDeadlines.length > 0 && (
                  <div className="flex items-center space-x-1 text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{urgentDeadlines.length} urgent</span>
                  </div>
                )}
              </div>

              {/* Participants */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {transaction.participants.slice(0, 3).map((participant, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                        title={`${participant.user.firstName || 'User'} ${participant.user.lastName || 'Name'} (${participant.role})`}
                      >
                        {(participant.user.firstName || 'U').charAt(0)}{(participant.user.lastName || 'N').charAt(0)}
                      </div>
                    ))}
                    {transaction.participants.length > 3 && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-semibold border-2 border-white">
                        +{transaction.participants.length - 3}
                      </div>
                    )}
                  </div>
                  <Link 
                    href={`/dashboard/transactions/${transaction.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-500 mb-6">
            {selectedStatus === 'all' 
              ? "Get started by creating your first transaction."
              : `No transactions with status "${selectedStatus}".`
            }
          </p>
          <button className="btn-primary">
            Create Transaction
          </button>
        </div>
      )}
    </div>
  )
}
