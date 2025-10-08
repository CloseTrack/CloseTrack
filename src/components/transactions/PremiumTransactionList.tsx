'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  DollarSign,
  MapPin,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Building2,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { formatDistanceToNow, format } from 'date-fns'
import Link from 'next/link'

interface Transaction {
  id: string
  title: string
  description?: string | null
  status: string
  propertyAddress: string
  propertyCity: string
  propertyState: string
  propertyZip: string
  salePrice?: any | null // Prisma Decimal type
  commission?: any | null // Prisma Decimal type
  contractDate?: Date | null
  closingDate?: Date | null
  createdAt: Date
  updatedAt: Date
  agent: {
    firstName: string | null
    lastName: string | null
    email: string
  }
  participants: Array<{
    id: string
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
  }>
  deadlines: Array<{
    id: string
    title: string
    dueDate: Date
    isCompleted: boolean
  }>
  activities: Array<{
    id: string
    type: string
    description?: string | null
    createdAt: Date
  }>
}

interface PremiumTransactionListProps {
  transactions: Transaction[]
  userRole: string
}

const statusConfig = {
  DRAFT: { 
    label: 'Draft', 
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Edit,
    bgColor: 'bg-gray-50'
  },
  OFFER_SUBMITTED: { 
    label: 'Offer Submitted', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: TrendingUp,
    bgColor: 'bg-blue-50'
  },
  UNDER_CONTRACT: { 
    label: 'Under Contract', 
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle,
    bgColor: 'bg-emerald-50'
  },
  INSPECTION: { 
    label: 'Inspection', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: AlertCircle,
    bgColor: 'bg-yellow-50'
  },
  APPRAISAL: { 
    label: 'Appraisal', 
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: Building2,
    bgColor: 'bg-orange-50'
  },
  MORTGAGE_COMMITMENT: { 
    label: 'Mortgage Commitment', 
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: DollarSign,
    bgColor: 'bg-purple-50'
  },
  ATTORNEY_REVIEW: { 
    label: 'Attorney Review', 
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: Clock,
    bgColor: 'bg-indigo-50'
  },
  CLOSING_SCHEDULED: { 
    label: 'Closing Scheduled', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: Calendar,
    bgColor: 'bg-green-50'
  },
  CLOSED: { 
    label: 'Closed', 
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle,
    bgColor: 'bg-emerald-50'
  },
  CANCELLED: { 
    label: 'Cancelled', 
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    bgColor: 'bg-red-50'
  },
}

export default function PremiumTransactionList({ transactions, userRole }: PremiumTransactionListProps) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
      
      return matchesStatus
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'title':
          aValue = a.title
          bValue = b.title
          break
        case 'salePrice':
          aValue = a.salePrice || 0
          bValue = b.salePrice || 0
          break
        case 'closingDate':
          aValue = a.closingDate || new Date(0)
          bValue = b.closingDate || new Date(0)
          break
        default:
          aValue = a.updatedAt
          bValue = b.updatedAt
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
  }

  const getProgressPercentage = (transaction: Transaction) => {
    const statusOrder = [
      'DRAFT', 'OFFER_SUBMITTED', 'UNDER_CONTRACT', 'INSPECTION', 
      'APPRAISAL', 'MORTGAGE_COMMITMENT', 'ATTORNEY_REVIEW', 
      'CLOSING_SCHEDULED', 'CLOSED'
    ]
    const currentIndex = statusOrder.indexOf(transaction.status)
    return ((currentIndex + 1) / statusOrder.length) * 100
  }

  const getDaysUntilClosing = (closingDate?: Date | null) => {
    if (!closingDate) return null
    const today = new Date()
    const diffTime = closingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600 mt-1">
            Manage and track your real estate transactions
          </p>
        </div>
        
        <Link
          href="/dashboard/transactions/new"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Deal</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-primary lg:w-48 mobile-button"
          >
            <option value="all">All Statuses</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-primary lg:w-40 mobile-button"
          >
            <option value="updatedAt">Last Updated</option>
            <option value="title">Property Name</option>
            <option value="salePrice">Sale Price</option>
            <option value="closingDate">Closing Date</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors touch-manipulation min-h-[44px]"
          >
            {sortOrder === 'asc' ? (
              <TrendingUp className="h-5 w-5 text-gray-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredTransactions.length} of {transactions.length} deals
        </p>
      </div>

      {/* Transactions Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${statusFilter}-${sortBy}-${sortOrder}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
        >
          {filteredTransactions.map((transaction, index) => {
            const statusConfig = getStatusConfig(transaction.status)
            const StatusIcon = statusConfig.icon
            const progress = getProgressPercentage(transaction)
            const daysUntilClosing = getDaysUntilClosing(transaction.closingDate)

            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-interactive group min-w-0"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate" title={transaction.title}>
                      {transaction.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {transaction.propertyAddress}, {transaction.propertyCity}, {transaction.propertyState}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Status and Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                      <StatusIcon className="h-4 w-4" />
                      <span>{statusConfig.label}</span>
                    </div>
                    {daysUntilClosing !== null && (
                      <div className="text-sm text-gray-600">
                        {daysUntilClosing > 0 ? (
                          <span className="text-orange-600">{daysUntilClosing} days</span>
                        ) : daysUntilClosing === 0 ? (
                          <span className="text-red-600">Today</span>
                        ) : (
                          <span className="text-gray-500">Past due</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Key Info */}
                <div className="space-y-3 mb-4">
                  {transaction.salePrice && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sale Price</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(transaction.salePrice)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Agent</span>
                    <span className="text-sm font-medium text-gray-900">
                      {transaction.agent.firstName} {transaction.agent.lastName}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Participants</span>
                    <span className="text-sm font-medium text-gray-900">
                      {transaction.participants.length}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{transaction.deadlines.length} deadlines</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building2 className="h-4 w-4" />
                    <span>{transaction.documents.length} documents</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/dashboard/transactions/${transaction.id}`}
                    className="flex-1 btn-primary text-center py-2 px-4 text-sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                  <Link
                    href={`/dashboard/transactions/${transaction.id}/edit`}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="h-4 w-4 text-gray-600" />
                  </Link>
                </div>

                {/* Last Updated */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Updated {formatDistanceToNow(transaction.updatedAt, { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No deals found</h3>
          <p className="text-gray-600 mb-6">
            {statusFilter !== 'all' 
              ? 'Try adjusting your filters'
              : 'Get started by creating your first deal'
            }
          </p>
          <Link href="/dashboard/transactions/new" className="btn-primary">
            <Plus className="h-5 w-5 mr-2" />
            Create New Deal
          </Link>
        </motion.div>
      )}
    </div>
  )
}
