'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  Edit,
  Search,
  Filter,
  Plus,
  Folder,
  Image,
  File,
  FileSpreadsheet,
  FilePdf
} from 'lucide-react'

interface Document {
  id: string
  name: string
  type: 'pdf' | 'image' | 'spreadsheet' | 'document' | 'other'
  size: string
  uploadedAt: Date
  uploadedBy: string
  category: 'contract' | 'inspection' | 'financial' | 'legal' | 'marketing' | 'other'
  status: 'active' | 'archived' | 'pending'
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  // Sample documents data
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Purchase Agreement - 123 Main St.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedAt: new Date(),
      uploadedBy: 'Sarah Johnson',
      category: 'contract',
      status: 'active'
    },
    {
      id: '2',
      name: 'Property Photos - Living Room.jpg',
      type: 'image',
      size: '1.8 MB',
      uploadedAt: new Date(Date.now() - 86400000),
      uploadedBy: 'Mike Smith',
      category: 'marketing',
      status: 'active'
    },
    {
      id: '3',
      name: 'Inspection Report.xlsx',
      type: 'spreadsheet',
      size: '856 KB',
      uploadedAt: new Date(Date.now() - 172800000),
      uploadedBy: 'John Doe',
      category: 'inspection',
      status: 'active'
    }
  ])

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FilePdf
      case 'image': return Image
      case 'spreadsheet': return FileSpreadsheet
      case 'document': return FileText
      default: return File
    }
  }

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'text-red-600 bg-red-100'
      case 'image': return 'text-blue-600 bg-blue-100'
      case 'spreadsheet': return 'text-green-600 bg-green-100'
      case 'document': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contract': return 'bg-blue-100 text-blue-700'
      case 'inspection': return 'bg-orange-100 text-orange-700'
      case 'financial': return 'bg-green-100 text-green-700'
      case 'legal': return 'bg-purple-100 text-purple-700'
      case 'marketing': return 'bg-pink-100 text-pink-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      // Handle file upload logic here
      console.log('Files to upload:', files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    handleFileUpload(e.dataTransfer.files)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-2">
              Manage all your transaction documents and files
            </p>
          </div>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
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
                placeholder="Search documents..."
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="contract">Contracts</option>
              <option value="inspection">Inspections</option>
              <option value="financial">Financial</option>
              <option value="legal">Legal</option>
              <option value="marketing">Marketing</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc, index) => {
          const FileIcon = getFileIcon(doc.type)
          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                {/* File Icon and Info */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`p-3 rounded-xl ${getFileColor(doc.type)}`}>
                    <FileIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.size}</p>
                    <p className="text-xs text-gray-400">
                      Uploaded by {doc.uploadedBy} • {doc.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(doc.category)}`}>
                    {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Upload your first document to get started'
            }
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary"
          >
            Upload Document
          </button>
        </motion.div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Upload Document</h3>
            </div>
            
            <div className="p-6">
              {/* Drag and Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Upload className={`h-12 w-12 mx-auto mb-4 ${
                  dragActive ? 'text-blue-500' : 'text-gray-400'
                }`} />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {dragActive ? 'Drop files here' : 'Upload Documents'}
                </h4>
                <p className="text-gray-600 mb-6">
                  Drag and drop files here, or click to browse
                </p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="btn-primary cursor-pointer inline-flex items-center space-x-2"
                >
                  <Upload className="h-5 w-5" />
                  <span>Choose Files</span>
                </label>
                <p className="text-sm text-gray-500 mt-4">
                  Supports PDF, DOC, XLS, JPG, PNG up to 10MB each
                </p>
              </div>

              {/* Document Details */}
              <div className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Category
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="contract">Contract</option>
                    <option value="inspection">Inspection</option>
                    <option value="financial">Financial</option>
                    <option value="legal">Legal</option>
                    <option value="marketing">Marketing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a description for this document..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Level
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="access" value="public" className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">Public</div>
                        <div className="text-sm text-gray-600">Visible to all participants</div>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="access" value="private" className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">Private</div>
                        <div className="text-sm text-gray-600">Only visible to you</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:shadow-lg transition-all">
                Upload Documents
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}