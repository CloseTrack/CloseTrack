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
  Plus,
  Upload,
  Edit,
  Trash2,
  Eye,
  Download
} from 'lucide-react'
import { formatCurrency, formatDate, formatDateTime, getStatusColor, calculateDaysUntilDeadline } from '@/lib/utils'
import { Decimal } from '@prisma/client/runtime/library'

interface TransactionDetailsProps {
  transaction: {
    id: string
    title: string
    description?: string | null
    status: string
    propertyAddress: string
    propertyCity: string
    propertyState: string
    propertyZip: string
    listingPrice?: Decimal | null
    salePrice?: Decimal | null
    commission?: Decimal | null
    contractDate?: Date | null
    closingDate?: Date | null
    inspectionDate?: Date | null
    appraisalDate?: Date | null
    mortgageCommitmentDate?: Date | null
    attorneyReviewDate?: Date | null
    createdAt: Date
    updatedAt: Date
    agent: {
      id: string
      firstName: string | null
      lastName: string | null
      email: string
      phone?: string | null
    }
    participants: Array<{
      id: string
      role: string
      isPrimary: boolean
      user: {
        id: string
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
      order: number
      completedBy?: {
        firstName: string | null
        lastName: string | null
      } | null
    }>
    activities: Array<{
      id: string
      type: string
      title: string
      description?: string | null
      metadata?: any
      createdAt: Date
      user: {
        firstName: string | null
        lastName: string | null
      }
    }>
  }
  user: {
    id: string
    role: string
  }
}

export default function TransactionDetails({ transaction, user }: TransactionDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'deadlines', name: 'Deadlines', icon: Calendar },
    { id: 'checklist', name: 'Checklist', icon: CheckCircle },
    { id: 'participants', name: 'Participants', icon: Users },
    { id: 'activity', name: 'Activity', icon: Clock }
  ]

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

  const getUrgentDeadlines = () => {
    return transaction.deadlines.filter(deadline => {
      if (deadline.isCompleted) return false
      const daysUntil = calculateDaysUntilDeadline(deadline.dueDate)
      return daysUntil <= 3
    })
  }

  const urgentDeadlines = getUrgentDeadlines()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{transaction.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
              {transaction.status.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{transaction.propertyAddress}, {transaction.propertyCity}, {transaction.propertyState}</span>
            </div>
            {transaction.salePrice && (
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span>{formatCurrency(Number(transaction.salePrice))}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button className="btn-secondary">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </button>
        </div>
      </div>

      {/* Urgent Alerts */}
      {urgentDeadlines.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-sm font-medium text-red-800">Urgent Deadlines</h3>
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transaction Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Property Address</label>
                    <p className="text-gray-900">{transaction.propertyAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">City, State, ZIP</label>
                    <p className="text-gray-900">{transaction.propertyCity}, {transaction.propertyState} {transaction.propertyZip}</p>
                  </div>
                  {transaction.listingPrice && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Listing Price</label>
                      <p className="text-gray-900">{formatCurrency(Number(transaction.listingPrice))}</p>
                    </div>
                  )}
                  {transaction.salePrice && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Sale Price</label>
                      <p className="text-gray-900">{formatCurrency(Number(transaction.salePrice))}</p>
                    </div>
                  )}
                  {transaction.commission && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Commission</label>
                      <p className="text-gray-900">{Number(transaction.commission)}%</p>
                    </div>
                  )}
                  {transaction.contractDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contract Date</label>
                      <p className="text-gray-900">{formatDate(transaction.contractDate)}</p>
                    </div>
                  )}
                  {transaction.closingDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Closing Date</label>
                      <p className="text-gray-900">{formatDate(transaction.closingDate)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {transaction.activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        {activity.description && (
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDateTime(activity.createdAt)} • {activity.user.firstName || 'User'} {activity.user.lastName || 'Name'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Agent Info */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {(transaction.agent.firstName || 'A').charAt(0)}{(transaction.agent.lastName || 'A').charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.agent.firstName || 'Agent'} {transaction.agent.lastName || 'Name'}
                    </p>
                    <p className="text-sm text-gray-600">{transaction.agent.email}</p>
                    {transaction.agent.phone && (
                      <p className="text-sm text-gray-600">{transaction.agent.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Documents</span>
                    <span className="text-sm font-medium text-gray-900">{transaction.documents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Deadlines</span>
                    <span className="text-sm font-medium text-gray-900">{transaction.deadlines.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Participants</span>
                    <span className="text-sm font-medium text-gray-900">{transaction.participants.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Activities</span>
                    <span className="text-sm font-medium text-gray-900">{transaction.activities.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
              <button className="btn-primary">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transaction.documents.map((document) => (
                <div key={document.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{document.title}</h4>
                      <p className="text-sm text-gray-600">{document.type}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Uploaded by {document.uploadedBy.firstName || 'User'} {document.uploadedBy.lastName || 'Name'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDateTime(document.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'deadlines' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Deadlines</h3>
              <button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Deadline
              </button>
            </div>
            <div className="space-y-4">
              {transaction.deadlines.map((deadline) => {
                const daysUntil = calculateDaysUntilDeadline(deadline.dueDate)
                const isOverdue = daysUntil < 0 && !deadline.isCompleted
                const isUrgent = daysUntil <= 3 && !deadline.isCompleted
                
                return (
                  <div key={deadline.id} className={`card ${isOverdue ? 'border-red-200 bg-red-50' : isUrgent ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${deadline.isCompleted ? 'bg-green-500' : isOverdue ? 'bg-red-500' : isUrgent ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{deadline.title}</h4>
                          {deadline.description && (
                            <p className="text-sm text-gray-600">{deadline.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatDate(deadline.dueDate)}</p>
                        <p className="text-xs text-gray-500">
                          {deadline.isCompleted 
                            ? `Completed by ${deadline.completedBy?.firstName || 'User'} ${deadline.completedBy?.lastName || 'Name'}`
                            : isOverdue 
                            ? `${Math.abs(daysUntil)} days overdue`
                            : `${daysUntil} days left`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Add other tab content here */}
      </div>
    </div>
  )
}
