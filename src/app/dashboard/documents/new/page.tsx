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
  FilePdf,
  ArrowLeft
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NewDocumentPage() {
  const router = useRouter()
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    category: 'contract',
    description: '',
    accessLevel: 'public'
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files)
      setSelectedFiles(prev => [...prev, ...newFiles])
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

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf': return FilePdf
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return Image
      case 'xlsx':
      case 'xls': return FileSpreadsheet
      case 'doc':
      case 'docx': return FileText
      default: return File
    }
  }

  const getFileColor = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf': return 'text-red-600 bg-red-100'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'text-blue-600 bg-blue-100'
      case 'xlsx':
      case 'xls': return 'text-green-600 bg-green-100'
      case 'doc':
      case 'docx': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Uploading files:', selectedFiles, formData)
    router.push('/dashboard/documents')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Upload Document</h1>
            <p className="text-gray-600 mt-2">
              Add new documents to your transaction files
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-8">
            {/* Drag and Drop Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Files *
              </label>
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
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Selected Files ({selectedFiles.length})
                </h4>
                <div className="space-y-3">
                  {selectedFiles.map((file, index) => {
                    const FileIcon = getFileIcon(file.name)
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getFileColor(file.name)}`}>
                            <FileIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{file.name}</div>
                            <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Document Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Document Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="contract">Contract</option>
                <option value="inspection">Inspection Report</option>
                <option value="financial">Financial Documents</option>
                <option value="legal">Legal Documents</option>
                <option value="marketing">Marketing Materials</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a description for these documents..."
              />
            </div>

            {/* Access Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Access Level *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="accessLevel"
                    value="public"
                    checked={formData.accessLevel === 'public'}
                    onChange={(e) => handleInputChange('accessLevel', e.target.value)}
                    className="mt-1 h-4 w-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Public</div>
                    <div className="text-sm text-gray-600">Visible to all transaction participants</div>
                  </div>
                </label>
                <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="accessLevel"
                    value="private"
                    checked={formData.accessLevel === 'private'}
                    onChange={(e) => handleInputChange('accessLevel', e.target.value)}
                    className="mt-1 h-4 w-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Private</div>
                    <div className="text-sm text-gray-600">Only visible to you and your team</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Additional Options
              </label>
              <div className="space-y-3">
                {[
                  { option: 'notify', label: 'Notify Participants', desc: 'Send email notification when documents are uploaded' },
                  { option: 'signature', label: 'Require Signature', desc: 'Mark documents as requiring electronic signature' },
                  { option: 'deadline', label: 'Set Review Deadline', desc: 'Set a deadline for document review' }
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
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-100 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedFiles.length === 0}
              className="px-8 py-4 bg-gradient-primary text-white rounded-xl font-medium hover:shadow-lg transition-all inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Documents</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
