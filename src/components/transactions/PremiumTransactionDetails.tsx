'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft,
  Edit,
  Share,
  Download,
  Calendar,
  DollarSign,
  MapPin,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Building2,
  FileText,
  MessageSquare,
  Plus,
  MoreVertical,
  Eye,
  Trash2,
  Send,
  Upload,
  Tag,
  Users,
  TrendingUp,
  Bell,
  Star,
  Link as LinkIcon
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
  salePrice?: any | null // Prisma Decimal type
  commission?: any | null // Prisma Decimal type
  contractDate?: Date | null
  closingDate?: Date | null
  inspectionDate?: Date | null
  appraisalDate?: Date | null
  mortgageCommitmentDate?: Date | null
  attorneyReviewDate?: Date | null
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
      email: string
      phone?: string | null
      role: string
    }
  }>
  documents: Array<{
    id: string
    title: string
    description?: string | null
    type: string
    fileName: string
    fileUrl: string
    fileSize: number
    mimeType: string
    isRequired: boolean
    isSigned: boolean
    signedAt?: Date | null
    createdAt: Date
    uploadedBy: {
      firstName: string | null
      lastName: string | null
    }
  }>
  deadlines: Array<{
    id: string
    title: string
    description?: string | null
    dueDate: Date
    isCompleted: boolean
    completedAt?: Date | null
    completedBy?: {
      firstName: string | null
      lastName: string | null
    } | null
  }>
  checklists: Array<{
    id: string
    title: string
    description?: string | null
    isCompleted: boolean
    completedAt?: Date | null
    completedBy?: {
      firstName: string | null
      lastName: string | null
    } | null
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

interface PremiumTransactionDetailsProps {
  transaction: Transaction
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    role: string
  }
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

export default function PremiumTransactionDetails({ transaction, user }: PremiumTransactionDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [showShareModal, setShowShareModal] = useState(false)
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false)
  const [showAddDeadlineModal, setShowAddDeadlineModal] = useState(false)

  function getStatusConfig(status: string) {
    const statusConfigs = {
      DRAFT: { 
        label: 'Draft', 
        color: 'bg-gray-100 text-gray-800', 
        bgColor: 'bg-gray-50',
        icon: Edit 
      },
      OFFER_SUBMITTED: { 
        label: 'Offer Submitted', 
        color: 'bg-blue-100 text-blue-800', 
        bgColor: 'bg-blue-50',
        icon: Send 
      },
      UNDER_CONTRACT: { 
        label: 'Under Contract', 
        color: 'bg-yellow-100 text-yellow-800', 
        bgColor: 'bg-yellow-50',
        icon: FileText 
      },
      INSPECTION: { 
        label: 'Inspection', 
        color: 'bg-orange-100 text-orange-800', 
        bgColor: 'bg-orange-50',
        icon: Building2 
      },
      APPRAISAL: { 
        label: 'Appraisal', 
        color: 'bg-purple-100 text-purple-800', 
        bgColor: 'bg-purple-50',
        icon: TrendingUp 
      },
      MORTGAGE_COMMITMENT: { 
        label: 'Mortgage Commitment', 
        color: 'bg-indigo-100 text-indigo-800', 
        bgColor: 'bg-indigo-50',
        icon: CheckCircle 
      },
      ATTORNEY_REVIEW: { 
        label: 'Attorney Review', 
        color: 'bg-pink-100 text-pink-800', 
        bgColor: 'bg-pink-50',
        icon: AlertCircle 
      },
      CLOSING_SCHEDULED: { 
        label: 'Closing Scheduled', 
        color: 'bg-green-100 text-green-800', 
        bgColor: 'bg-green-50',
        icon: Calendar 
      },
      CLOSED: { 
        label: 'Closed', 
        color: 'bg-emerald-100 text-emerald-800', 
        bgColor: 'bg-emerald-50',
        icon: CheckCircle 
      }
    }
    return statusConfigs[status as keyof typeof statusConfigs] || statusConfigs.DRAFT
  }

  const statusConfig = getStatusConfig(transaction.status)
  const StatusIcon = statusConfig.icon

  const getProgressPercentage = () => {
    const statusOrder = [
      'DRAFT', 'OFFER_SUBMITTED', 'UNDER_CONTRACT', 'INSPECTION', 
      'APPRAISAL', 'MORTGAGE_COMMITMENT', 'ATTORNEY_REVIEW', 
      'CLOSING_SCHEDULED', 'CLOSED'
    ]
    const currentIndex = statusOrder.indexOf(transaction.status)
    return ((currentIndex + 1) / statusOrder.length) * 100
  }

  const getDaysUntilClosing = () => {
    if (!transaction.closingDate) return null
    const today = new Date()
    const diffTime = transaction.closingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getUrgentDeadlines = () => {
    const today = new Date()
    const nextWeek = addDays(today, 7)
    
    return transaction.deadlines.filter(deadline => 
      !deadline.isCompleted && 
      isAfter(deadline.dueDate, today) && 
      isBefore(deadline.dueDate, nextWeek)
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'documents', label: 'Documents', icon: FileText, count: transaction.documents.length },
    { id: 'deadlines', label: 'Deadlines', icon: Clock, count: transaction.deadlines.length },
    { id: 'participants', label: 'Participants', icon: Users, count: transaction.participants.length },
    { id: 'activity', label: 'Activity', icon: MessageSquare, count: transaction.activities.length },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/transactions"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              {transaction.title}
            </h1>
            <p className="text-gray-600 mt-1">
              {transaction.propertyAddress}, {transaction.propertyCity}, {transaction.propertyState}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowShareModal(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Share className="h-4 w-4" />
            <span>Share</span>
          </button>
          <Link
            href={`/dashboard/transactions/${transaction.id}/edit`}
            className="btn-primary flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Link>
        </div>
      </div>

      {/* Status and Progress */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${statusConfig.bgColor}`}>
              <StatusIcon className={`h-6 w-6 ${statusConfig.color.replace('text-', 'text-').replace('bg-', '')}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {statusConfig.label}
              </h2>
              <p className="text-sm text-gray-600">
                Last updated {formatDistanceToNow(transaction.updatedAt, { addSuffix: true })}
              </p>
            </div>
          </div>
          
          {transaction.closingDate && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Closing Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {format(transaction.closingDate, 'MMM dd, yyyy')}
              </p>
              {getDaysUntilClosing() !== null && (
                <p className={`text-sm font-medium ${
                  getDaysUntilClosing()! <= 7 ? 'text-red-600' : 
                  getDaysUntilClosing()! <= 14 ? 'text-orange-600' : 'text-gray-600'
                }`}>
                  {getDaysUntilClosing()! > 0 ? `${getDaysUntilClosing()} days left` : 
                   getDaysUntilClosing()! === 0 ? 'Today' : 'Past due'}
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">
          {Math.round(getProgressPercentage())}% complete
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {transaction.salePrice && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-medium text-gray-900">Sale Price</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(transaction.salePrice)}
            </p>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900">Participants</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {transaction.participants.length}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="font-medium text-gray-900">Documents</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {transaction.documents.length}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900">Deadlines</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {transaction.deadlines.filter(d => !d.isCompleted).length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Property Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-medium text-gray-900">
                            {transaction.propertyAddress}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">City, State, ZIP</p>
                          <p className="font-medium text-gray-900">
                            {transaction.propertyCity}, {transaction.propertyState} {transaction.propertyZip}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Important Dates */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {transaction.contractDate && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-600">Contract Date</p>
                            <p className="font-medium text-gray-900">
                              {format(transaction.contractDate, 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                      )}
                      {transaction.closingDate && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="h-5 w-5 text-emerald-600" />
                          <div>
                            <p className="text-sm text-gray-600">Closing Date</p>
                            <p className="font-medium text-gray-900">
                              {format(transaction.closingDate, 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                      )}
                      {transaction.inspectionDate && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="h-5 w-5 text-orange-600" />
                          <div>
                            <p className="text-sm text-gray-600">Inspection Date</p>
                            <p className="font-medium text-gray-900">
                              {format(transaction.inspectionDate, 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Agent Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Agent</h3>
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {transaction.agent.firstName?.[0]}{transaction.agent.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.agent.firstName} {transaction.agent.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{transaction.agent.email}</p>
                        {transaction.agent.phone && (
                          <p className="text-sm text-gray-600">{transaction.agent.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                    <button className="btn-primary flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload Document</span>
                    </button>
                  </div>
                  
                  {transaction.documents.length > 0 ? (
                    <div className="space-y-3">
                      {transaction.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{doc.title}</p>
                              <p className="text-sm text-gray-600">
                                {doc.type} • {(doc.fileSize / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {doc.isSigned && (
                              <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                                Signed
                              </span>
                            )}
                            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                              <Download className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No documents uploaded yet</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'deadlines' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Deadlines</h3>
                    <button 
                      onClick={() => setShowAddDeadlineModal(true)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Deadline</span>
                    </button>
                  </div>
                  
                  {transaction.deadlines.length > 0 ? (
                    <div className="space-y-3">
                      {transaction.deadlines.map((deadline) => {
                        const isOverdue = new Date() > deadline.dueDate && !deadline.isCompleted
                        const isUrgent = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) > deadline.dueDate && !deadline.isCompleted
                        
                        return (
                          <div key={deadline.id} className={`p-4 rounded-lg border ${
                            deadline.isCompleted ? 'bg-emerald-50 border-emerald-200' :
                            isOverdue ? 'bg-red-50 border-red-200' :
                            isUrgent ? 'bg-orange-50 border-orange-200' :
                            'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${
                                  deadline.isCompleted ? 'bg-emerald-100' :
                                  isOverdue ? 'bg-red-100' :
                                  isUrgent ? 'bg-orange-100' :
                                  'bg-gray-100'
                                }`}>
                                  <Clock className={`h-4 w-4 ${
                                    deadline.isCompleted ? 'text-emerald-600' :
                                    isOverdue ? 'text-red-600' :
                                    isUrgent ? 'text-orange-600' :
                                    'text-gray-600'
                                  }`} />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{deadline.title}</p>
                                  {deadline.description && (
                                    <p className="text-sm text-gray-600">{deadline.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                  {format(deadline.dueDate, 'MMM dd, yyyy')}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {formatDistanceToNow(deadline.dueDate, { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No deadlines set</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'participants' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Participants</h3>
                    <button 
                      onClick={() => setShowAddParticipantModal(true)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Participant</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {transaction.participants.map((participant) => (
                      <div key={participant.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {participant.user.firstName?.[0]}{participant.user.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {participant.user.firstName} {participant.user.lastName}
                            </p>
                            <p className="text-sm text-gray-600 capitalize">
                              {participant.role.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">{participant.user.email}</p>
                          {participant.user.phone && (
                            <p className="text-sm text-gray-600">{participant.user.phone}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Activity Feed</h3>
                  
                  {transaction.activities.length > 0 ? (
                    <div className="space-y-4">
                      {transaction.activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900">{activity.type}</p>
                              <p className="text-xs text-gray-500">
                                {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                              </p>
                            </div>
                            {activity.description && (
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              by {activity.user.firstName} {activity.user.lastName}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No activity yet</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Add Deadline Modal */}
      <AnimatePresence>
        {showAddDeadlineModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">Add Deadline</h3>
                <p className="text-gray-600 mt-1">Set a new deadline for this transaction</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {/* Deadline Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deadline Title *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Home Inspection, Mortgage Commitment, Final Walkthrough"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add details about this deadline..."
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Time
                      </label>
                      <input
                        type="time"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Priority Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Priority Level *
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value="low"
                          className="h-4 w-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Low</div>
                          <div className="text-sm text-gray-600">Flexible deadline</div>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value="medium"
                          className="h-4 w-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Medium</div>
                          <div className="text-sm text-gray-600">Important deadline</div>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value="high"
                          className="h-4 w-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">High</div>
                          <div className="text-sm text-gray-600">Critical deadline</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Assigned To */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned To
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select participant...</option>
                      <option value="agent">Agent (You)</option>
                      {transaction.participants.map((participant) => (
                        <option key={participant.id} value={participant.id}>
                          {participant.user.firstName} {participant.user.lastName} ({participant.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reminder Settings */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Reminder Settings
                    </label>
                    <div className="space-y-3">
                      {[
                        { days: 7, label: '1 week before', desc: 'Send reminder 7 days before deadline' },
                        { days: 3, label: '3 days before', desc: 'Send reminder 3 days before deadline' },
                        { days: 1, label: '1 day before', desc: 'Send reminder 1 day before deadline' },
                        { days: 0, label: 'On deadline', desc: 'Send reminder on the deadline date' }
                      ].map(({ days, label, desc }) => (
                        <label key={days} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{label}</div>
                            <div className="text-sm text-gray-600">{desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Notification Methods */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Notification Methods
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Email</div>
                          <div className="text-sm text-gray-600">Send email notifications</div>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div>
                          <div className="font-medium text-gray-900">SMS</div>
                          <div className="text-sm text-gray-600">Send text message alerts</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any additional information or special instructions..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-100">
                <button
                  onClick={() => setShowAddDeadlineModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:shadow-lg transition-all inline-flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Create Deadline</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Participant Modal */}
      <AnimatePresence>
        {showAddParticipantModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">Add Participant</h3>
                <p className="text-gray-600 mt-1">Invite someone to join this transaction</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {/* Participant Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Participant Type *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { type: 'buyer', label: 'Buyer', desc: 'Property purchaser' },
                        { type: 'seller', label: 'Seller', desc: 'Property owner' },
                        { type: 'agent', label: 'Agent', desc: 'Real estate agent' },
                        { type: 'broker', label: 'Broker', desc: 'Brokerage representative' },
                        { type: 'lender', label: 'Lender', desc: 'Mortgage provider' },
                        { type: 'attorney', label: 'Attorney', desc: 'Legal representative' },
                        { type: 'inspector', label: 'Inspector', desc: 'Property inspector' },
                        { type: 'appraiser', label: 'Appraiser', desc: 'Property appraiser' },
                        { type: 'title_company', label: 'Title Company', desc: 'Title and escrow services' },
                        { type: 'other', label: 'Other', desc: 'Other participant' }
                      ].map(({ type, label, desc }) => (
                        <label key={type} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="participantType"
                            value={type}
                            className="mt-1 h-4 w-4 text-blue-600"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{label}</div>
                            <div className="text-sm text-gray-600">{desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  {/* Company Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company/Organization
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter company name (optional)"
                    />
                  </div>

                  {/* Access Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Access Level *
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="accessLevel"
                          value="full"
                          className="mt-1 h-4 w-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Full Access</div>
                          <div className="text-sm text-gray-600">Can view all documents, deadlines, and activities</div>
                        </div>
                      </label>
                      <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="accessLevel"
                          value="limited"
                          className="mt-1 h-4 w-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Limited Access</div>
                          <div className="text-sm text-gray-600">Can view only relevant documents and deadlines</div>
                        </div>
                      </label>
                      <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="accessLevel"
                          value="readonly"
                          className="mt-1 h-4 w-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Read Only</div>
                          <div className="text-sm text-gray-600">Can view but cannot edit or upload documents</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Notification Preferences
                    </label>
                    <div className="space-y-3">
                      {[
                        { option: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                        { option: 'sms', label: 'SMS Notifications', desc: 'Receive text message alerts' },
                        { option: 'deadline', label: 'Deadline Reminders', desc: 'Get notified about upcoming deadlines' },
                        { option: 'document', label: 'Document Updates', desc: 'Get notified when documents are uploaded' }
                      ].map(({ option, label, desc }) => (
                        <label key={option} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{label}</div>
                            <div className="text-sm text-gray-600">{desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Welcome Message
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Optional message to include in the invitation..."
                      defaultValue="You've been invited to participate in this real estate transaction. Please review the details and let us know if you have any questions."
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-100">
                <button
                  onClick={() => setShowAddParticipantModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:shadow-lg transition-all inline-flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Send Invitation</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
