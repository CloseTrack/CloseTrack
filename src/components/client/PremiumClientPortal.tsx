'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Share,
  Bell,
  Star,
  ArrowRight,
  Plus,
  Filter,
  Search,
  BarChart3,
  Activity,
  Target,
  Home,
  Users,
  Settings
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { format, formatDistanceToNow, isAfter, isBefore, addDays } from 'date-fns'
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
  salePrice?: number | null
  commission?: number | null
  contractDate?: Date | null
  closingDate?: Date | null
  createdAt: Date
  updatedAt: Date
  agent: {
    firstName: string | null
    lastName: string | null
    email: string
    phone?: string | null
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
    fileName: string
    fileUrl: string
    fileSize: number
    isSigned: boolean
    signedAt?: Date | null
    createdAt: Date
  }>
  deadlines: Array<{
    id: string
    title: string
    description?: string | null
    dueDate: Date
    isCompleted: boolean
    completedAt?: Date | null
  }>
  activities: Array<{
    id: string
    type: string
    description?: string | null
    createdAt: Date
    user: {
      firstName: string | null
      lastName: string | null
    }
  }>
}

interface PremiumClientPortalProps {
  transactions: Transaction[]
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
    role: string
  }
}

const statusConfig = {
  DRAFT: { 
    label: 'Draft', 
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Building2,
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

export default function PremiumClientPortal({ transactions, user }: PremiumClientPortalProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

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

  const getUpcomingDeadlines = () => {
    const today = new Date()
    const nextWeek = addDays(today, 7)
    
    return transactions.flatMap(transaction =>
      transaction.deadlines
        .filter(deadline => 
          !deadline.isCompleted && 
          isAfter(deadline.dueDate, today) && 
          isBefore(deadline.dueDate, nextWeek)
        )
        .map(deadline => ({ ...deadline, transaction }))
    )
  }

  const getRecentActivities = () => {
    return transactions
      .flatMap(transaction =>
        transaction.activities.map(activity => ({ ...activity, transaction }))
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'deadlines', label: 'Deadlines', icon: Clock },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'team', label: 'Team', icon: Users },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-8 border border-blue-100"
      >
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
          Welcome, {user.firstName}! 👋
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Stay updated on your real estate transaction progress
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>Call your agent anytime</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MessageSquare className="h-4 w-4" />
            <span>24/7 support available</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Bell className="h-4 w-4" />
            <span>Real-time updates</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Active Transactions</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {transactions.filter(t => t.status !== 'CLOSED' && t.status !== 'CANCELLED').length}
          </p>
          <p className="text-sm text-gray-600">Currently in progress</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {transactions.filter(t => t.status === 'CLOSED').length}
          </p>
          <p className="text-sm text-gray-600">Successfully closed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Upcoming Deadlines</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {getUpcomingDeadlines().length}
          </p>
          <p className="text-sm text-gray-600">Next 7 days</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Building2 className="h-5 w-5 text-primary-600 mr-2" />
                Your Transactions
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {transactions.map((transaction, index) => {
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
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {transaction.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>
                            {transaction.propertyAddress}, {transaction.propertyCity}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{transaction.agent.firstName} {transaction.agent.lastName}</span>
                          </div>
                          {transaction.salePrice && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{formatCurrency(transaction.salePrice)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span>{statusConfig.label}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{transaction.deadlines.filter(d => !d.isCompleted).length} deadlines</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>{transaction.documents.length} documents</span>
                        </div>
                      </div>
                      {daysUntilClosing !== null && (
                        <div className={`text-sm font-medium ${
                          daysUntilClosing <= 7 ? 'text-red-600' : 
                          daysUntilClosing <= 14 ? 'text-orange-600' : 'text-gray-600'
                        }`}>
                          {daysUntilClosing > 0 ? `${daysUntilClosing} days to closing` : 
                           daysUntilClosing === 0 ? 'Closing today' : 'Past closing date'}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {/* Agent Contact */}
          {transactions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 text-primary-600 mr-2" />
                Your Agent
              </h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {transactions[0].agent.firstName?.[0]}{transactions[0].agent.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {transactions[0].agent.firstName} {transactions[0].agent.lastName}
                  </p>
                  <p className="text-sm text-gray-600">Real Estate Agent</p>
                </div>
              </div>
              <div className="space-y-3">
                <a
                  href={`tel:${transactions[0].agent.phone}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {transactions[0].agent.phone}
                  </span>
                </a>
                <a
                  href={`mailto:${transactions[0].agent.email}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {transactions[0].agent.email}
                  </span>
                </a>
              </div>
            </div>
          )}

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 text-primary-600 mr-2" />
              Upcoming Deadlines
            </h3>
            {getUpcomingDeadlines().length > 0 ? (
              <div className="space-y-3">
                {getUpcomingDeadlines().slice(0, 3).map((deadline) => (
                  <div key={deadline.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="font-medium text-gray-900 text-sm">{deadline.title}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {deadline.transaction.title}
                    </p>
                    <p className="text-xs text-orange-600 font-medium mt-1">
                      Due {format(deadline.dueDate, 'MMM dd')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No upcoming deadlines</p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 text-primary-600 mr-2" />
              Recent Activity
            </h3>
            {getRecentActivities().length > 0 ? (
              <div className="space-y-3">
                {getRecentActivities().slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                      <p className="text-xs text-gray-600 truncate">
                        {activity.transaction.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Transaction Detail Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTransaction(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedTransaction.title}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {selectedTransaction.propertyAddress}, {selectedTransaction.propertyCity}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <XCircle className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Transaction Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Transaction Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {getStatusConfig(selectedTransaction.status).label}
                          </span>
                        </div>
                        {selectedTransaction.salePrice && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Sale Price:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(selectedTransaction.salePrice)}
                            </span>
                          </div>
                        )}
                        {selectedTransaction.closingDate && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Closing Date:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {format(selectedTransaction.closingDate, 'MMM dd, yyyy')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Documents */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Documents</h3>
                      {selectedTransaction.documents.length > 0 ? (
                        <div className="space-y-2">
                          {selectedTransaction.documents.slice(0, 3).map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-gray-600" />
                                <span className="text-sm text-gray-900">{doc.title}</span>
                              </div>
                              {doc.isSigned && (
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No documents yet</p>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Progress</h3>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                          className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
                          style={{ width: `${getProgressPercentage(selectedTransaction)}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        {Math.round(getProgressPercentage(selectedTransaction))}% complete
                      </p>
                    </div>

                    {/* Deadlines */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Upcoming Deadlines</h3>
                      {selectedTransaction.deadlines.filter(d => !d.isCompleted).length > 0 ? (
                        <div className="space-y-2">
                          {selectedTransaction.deadlines
                            .filter(d => !d.isCompleted)
                            .slice(0, 3)
                            .map((deadline) => (
                              <div key={deadline.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-900">{deadline.title}</span>
                                <span className="text-xs text-gray-600">
                                  {format(deadline.dueDate, 'MMM dd')}
                                </span>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No upcoming deadlines</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
