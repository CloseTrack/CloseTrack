'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Circle, 
  AlertCircle, 
  User, 
  Tag, 
  MoreVertical,
  Edit,
  Trash2,
  Flag,
  Star,
  ArrowLeft,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format, isToday, isTomorrow, isPast, addDays } from 'date-fns'

interface Task {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'completed'
  dueDate?: Date
  assignedTo?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  transactionId?: string
  transactionTitle?: string
}

export default function TaskManagementPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [expandedTask, setExpandedTask] = useState<string | null>(null)

  // Sample tasks data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Schedule home inspection for 123 Main St',
      description: 'Contact inspector and coordinate with buyer for property inspection',
      priority: 'high',
      status: 'todo',
      dueDate: new Date(),
      assignedTo: 'Sarah Johnson',
      tags: ['inspection', 'buyer'],
      createdAt: new Date(),
      updatedAt: new Date(),
      transactionId: 'txn-1',
      transactionTitle: '123 Main Street, Princeton NJ'
    },
    {
      id: '2',
      title: 'Review purchase agreement',
      description: 'Go through contract terms with client and address any concerns',
      priority: 'urgent',
      status: 'in_progress',
      dueDate: addDays(new Date(), 1),
      assignedTo: 'Mike Smith',
      tags: ['contract', 'legal'],
      createdAt: new Date(),
      updatedAt: new Date(),
      transactionId: 'txn-2',
      transactionTitle: '456 Oak Avenue, Edison NJ'
    },
    {
      id: '3',
      title: 'Prepare listing presentation',
      description: 'Create comprehensive market analysis and pricing strategy',
      priority: 'medium',
      status: 'todo',
      dueDate: addDays(new Date(), 3),
      assignedTo: 'Sarah Johnson',
      tags: ['listing', 'marketing'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      title: 'Follow up with mortgage broker',
      description: 'Check on loan approval status and required documentation',
      priority: 'high',
      status: 'completed',
      dueDate: addDays(new Date(), -1),
      assignedTo: 'John Doe',
      tags: ['mortgage', 'financing'],
      createdAt: new Date(),
      updatedAt: new Date(),
      transactionId: 'txn-1',
      transactionTitle: '123 Main Street, Princeton NJ'
    },
    {
      id: '5',
      title: 'Schedule final walkthrough',
      description: 'Coordinate final property inspection before closing',
      priority: 'medium',
      status: 'todo',
      dueDate: addDays(new Date(), 5),
      assignedTo: 'Sarah Johnson',
      tags: ['walkthrough', 'closing'],
      createdAt: new Date(),
      updatedAt: new Date(),
      transactionId: 'txn-3',
      transactionTitle: '789 Pine Road, New Brunswick NJ'
    }
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return Flag
      case 'high': return AlertCircle
      case 'medium': return Clock
      case 'low': return Circle
      default: return Circle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-blue-600 bg-blue-100'
      case 'todo': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDueDateStatus = (dueDate?: Date) => {
    if (!dueDate) return { text: 'No due date', color: 'text-gray-500' }
    
    if (isPast(dueDate)) return { text: 'Overdue', color: 'text-red-600' }
    if (isToday(dueDate)) return { text: 'Due today', color: 'text-orange-600' }
    if (isTomorrow(dueDate)) return { text: 'Due tomorrow', color: 'text-yellow-600' }
    
    return { text: `Due ${format(dueDate, 'MMM d')}`, color: 'text-gray-600' }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || task.status === selectedFilter
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority
    return matchesSearch && matchesFilter && matchesPriority
  })

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    overdue: tasks.filter(t => t.dueDate && isPast(t.dueDate) && t.status !== 'completed').length
  }

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'todo' : 'completed'
        return { ...task, status: newStatus, updatedAt: new Date() }
      }
      return task
    }))
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600 mt-2">
              Stay organized and never miss important deadlines
            </p>
          </div>
          
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">To Do</p>
              <p className="text-2xl font-bold text-gray-600">{taskStats.todo}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-xl">
              <Circle className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{taskStats.overdue}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search tasks..."
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="lg:w-48">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task, index) => {
          const PriorityIcon = getPriorityIcon(task.priority)
          const dueDateStatus = getDueDateStatus(task.dueDate)
          
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`mt-1 p-1 rounded-lg transition-all ${
                      task.status === 'completed' 
                        ? 'text-green-600 hover:text-green-700' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-lg ${
                          task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-gray-600 mt-2">{task.description}</p>
                        )}
                        
                        {/* Task Meta */}
                        <div className="flex items-center space-x-4 mt-4">
                          {/* Priority */}
                          <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                            <PriorityIcon className="h-4 w-4" />
                            <span className="capitalize">{task.priority}</span>
                          </div>

                          {/* Status */}
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                            <span className="capitalize">{task.status.replace('_', ' ')}</span>
                          </div>

                          {/* Due Date */}
                          {task.dueDate && (
                            <div className={`inline-flex items-center space-x-1 text-sm ${dueDateStatus.color}`}>
                              <Calendar className="h-4 w-4" />
                              <span>{dueDateStatus.text}</span>
                            </div>
                          )}

                          {/* Assigned To */}
                          {task.assignedTo && (
                            <div className="inline-flex items-center space-x-1 text-sm text-gray-600">
                              <User className="h-4 w-4" />
                              <span>{task.assignedTo}</span>
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {task.tags.map((tag) => (
                              <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Transaction Link */}
                        {task.transactionId && task.transactionTitle && (
                          <div className="mt-3">
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                              View Transaction: {task.transactionTitle}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedFilter !== 'all' || selectedPriority !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first task to get started'
            }
          </p>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="btn-primary"
          >
            Create Task
          </button>
        </motion.div>
      )}

      {/* New Task Modal */}
      <AnimatePresence>
        {showNewTaskModal && (
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
                <h3 className="text-xl font-semibold text-gray-900">Create New Task</h3>
                <p className="text-gray-600 mt-1">Add a new task to your workflow</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {/* Task Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter task title..."
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
                      placeholder="Add task description..."
                    />
                  </div>

                  {/* Priority and Due Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority *
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Assign To */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign To
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select team member...</option>
                      <option value="sarah">Sarah Johnson</option>
                      <option value="mike">Mike Smith</option>
                      <option value="john">John Doe</option>
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter tags separated by commas (e.g., inspection, buyer, urgent)"
                    />
                  </div>

                  {/* Related Transaction */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Related Transaction
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select transaction (optional)...</option>
                      <option value="txn-1">123 Main Street, Princeton NJ</option>
                      <option value="txn-2">456 Oak Avenue, Edison NJ</option>
                      <option value="txn-3">789 Pine Road, New Brunswick NJ</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-100">
                <button
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:shadow-lg transition-all inline-flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Create Task</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}