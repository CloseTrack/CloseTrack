'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Save,
  Eye,
  Upload,
  Phone,
  Mail,
  Home,
  Car,
  TreePine,
  Waves
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface TransactionFormData {
  // Basic Property Info
  propertyAddress: string
  propertyCity: string
  propertyState: string
  propertyZip: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  squareFootage: number
  lotSize: number
  yearBuilt: number
  
  // Transaction Details
  listingPrice: number
  salePrice: number
  commission: number
  contractDate: string
  closingDate: string
  
  // Client Information
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  sellerName: string
  sellerEmail: string
  sellerPhone: string
  
  // Additional Details
  description: string
  specialFeatures: string[]
  inspectionDate: string
  appraisalDate: string
  
  // Documents
  documents: File[]
}

const propertyTypes = [
  { value: 'single_family', label: 'Single Family Home', icon: Home },
  { value: 'condo', label: 'Condominium', icon: Building2 },
  { value: 'townhouse', label: 'Townhouse', icon: Building2 },
  { value: 'multi_family', label: 'Multi-Family', icon: Building2 },
  { value: 'land', label: 'Land', icon: TreePine },
  { value: 'commercial', label: 'Commercial', icon: Building2 },
  { value: 'mobile', label: 'Mobile Home', icon: Car },
  { value: 'other', label: 'Other', icon: Building2 }
]

const specialFeatures = [
  'Pool', 'Garage', 'Fireplace', 'Hardwood Floors', 'Updated Kitchen',
  'Updated Bathroom', 'Central Air', 'Hardwood Floors', 'Granite Countertops',
  'Stainless Steel Appliances', 'Walk-in Closet', 'Master Suite', 'Deck/Patio',
  'Basement', 'Attic', 'Garden', 'Waterfront', 'Mountain View', 'City View'
]

export default function NewTransactionPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<TransactionFormData>({
    propertyAddress: '',
    propertyCity: '',
    propertyState: '',
    propertyZip: '',
    propertyType: 'single_family',
    bedrooms: 0,
    bathrooms: 0,
    squareFootage: 0,
    lotSize: 0,
    yearBuilt: new Date().getFullYear(),
    listingPrice: 0,
    salePrice: 0,
    commission: 3.0,
    contractDate: '',
    closingDate: '',
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    sellerName: '',
    sellerEmail: '',
    sellerPhone: '',
    description: '',
    specialFeatures: [],
    inspectionDate: '',
    appraisalDate: '',
    documents: []
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = [
    { number: 1, title: 'Property Details', icon: Building2 },
    { number: 2, title: 'Transaction Info', icon: DollarSign },
    { number: 3, title: 'Client Information', icon: Users },
    { number: 4, title: 'Additional Details', icon: FileText },
    { number: 5, title: 'Review & Submit', icon: CheckCircle }
  ]

  const handleInputChange = (field: keyof TransactionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSpecialFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      specialFeatures: prev.specialFeatures.includes(feature)
        ? prev.specialFeatures.filter(f => f !== feature)
        : [...prev.specialFeatures, feature]
    }))
  }

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...Array.from(files)]
      }))
  }

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Here you would typically send the data to your API
      console.log('Submitting transaction:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to transactions page
      router.push('/dashboard/transactions')
    } catch (error) {
      console.error('Error creating transaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Create New Deal</h1>
        <p className="text-gray-600 mt-2">
          Start a new real estate transaction with our comprehensive form
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.number
            const isCompleted = currentStep > step.number
            
            return (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-primary border-transparent text-white' 
                    : isCompleted 
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          
          {/* Step 1: Property Details */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Building2 className="h-6 w-6 text-blue-600 mr-3" />
                Property Details
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Address */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Address *
                  </label>
                  <input
                    type="text"
                    value={formData.propertyAddress}
                    onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.propertyCity}
                    onChange={(e) => handleInputChange('propertyCity', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Edison"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.propertyState}
                    onChange={(e) => handleInputChange('propertyState', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="NJ"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={formData.propertyZip}
                    onChange={(e) => handleInputChange('propertyZip', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="08820"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {propertyTypes.map(type => {
                      const Icon = type.icon
                      return (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Built
                  </label>
                  <input
                    type="number"
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange('yearBuilt', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms *
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms *
                  </label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Square Footage *
                  </label>
                  <input
                    type="number"
                    value={formData.squareFootage}
                    onChange={(e) => handleInputChange('squareFootage', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lot Size (sq ft)
                  </label>
                  <input
                    type="number"
                    value={formData.lotSize}
                    onChange={(e) => handleInputChange('lotSize', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Transaction Info */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <DollarSign className="h-6 w-6 text-emerald-600 mr-3" />
                Transaction Information
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Listing Price *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.listingPrice}
                      onChange={(e) => handleInputChange('listingPrice', parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.salePrice}
                      onChange={(e) => handleInputChange('salePrice', parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    value={formData.commission}
                    onChange={(e) => handleInputChange('commission', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contract Date
                  </label>
                  <input
                    type="date"
                    value={formData.contractDate}
                    onChange={(e) => handleInputChange('contractDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Closing Date
                  </label>
                  <input
                    type="date"
                    value={formData.closingDate}
                    onChange={(e) => handleInputChange('closingDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inspection Date
                  </label>
                  <input
                    type="date"
                    value={formData.inspectionDate}
                    onChange={(e) => handleInputChange('inspectionDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appraisal Date
                  </label>
                  <input
                    type="date"
                    value={formData.appraisalDate}
                    onChange={(e) => handleInputChange('appraisalDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Client Information */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Users className="h-6 w-6 text-purple-600 mr-3" />
                Client Information
              </h2>
              
              <div className="space-y-8">
                {/* Buyer Information */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Buyer Information
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buyer Name *
                      </label>
                      <input
                        type="text"
                        value={formData.buyerName}
                        onChange={(e) => handleInputChange('buyerName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John & Jane Smith"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buyer Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.buyerEmail}
                          onChange={(e) => handleInputChange('buyerEmail', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="buyers@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buyer Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.buyerPhone}
                          onChange={(e) => handleInputChange('buyerPhone', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seller Information */}
                <div className="bg-emerald-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Seller Information
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seller Name *
                      </label>
                      <input
                        type="text"
                        value={formData.sellerName}
                        onChange={(e) => handleInputChange('sellerName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Mike Johnson"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seller Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.sellerEmail}
                          onChange={(e) => handleInputChange('sellerEmail', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="seller@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seller Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.sellerPhone}
                          onChange={(e) => handleInputChange('sellerPhone', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="(555) 987-6543"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Additional Details */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 text-orange-600 mr-3" />
                Additional Details
              </h2>
              
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Beautiful 4-bedroom colonial home in desirable neighborhood..."
                  />
                </div>

                {/* Special Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Special Features
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {specialFeatures.map(feature => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => handleSpecialFeatureToggle(feature)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          formData.specialFeatures.includes(feature)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Document Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Upload Documents
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drop files here or click to upload</p>
                    <p className="text-sm text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                    >
                      Choose Files
                    </label>
                  </div>
                  
                  {/* Uploaded Files */}
                  {formData.documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.documents.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                Review & Submit
              </h2>
              
              <div className="space-y-6">
                {/* Property Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Address:</span>
                      <p className="text-gray-600">{formData.propertyAddress}, {formData.propertyCity}, {formData.propertyState} {formData.propertyZip}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Property Type:</span>
                      <p className="text-gray-600">{propertyTypes.find(t => t.value === formData.propertyType)?.label}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Bedrooms/Bathrooms:</span>
                      <p className="text-gray-600">{formData.bedrooms} bed / {formData.bathrooms} bath</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Square Footage:</span>
                      <p className="text-gray-600">{formData.squareFootage.toLocaleString()} sq ft</p>
                    </div>
                  </div>
                </div>

                {/* Transaction Summary */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Listing Price:</span>
                      <p className="text-gray-600">{formatCurrency(formData.listingPrice)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Sale Price:</span>
                      <p className="text-gray-600">{formData.salePrice ? formatCurrency(formData.salePrice) : 'TBD'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Commission:</span>
                      <p className="text-gray-600">{formData.commission}%</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Closing Date:</span>
                      <p className="text-gray-600">{formData.closingDate || 'TBD'}</p>
                    </div>
                  </div>
                </div>

                {/* Client Summary */}
                <div className="bg-emerald-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Buyer:</span>
                      <p className="text-gray-600">{formData.buyerName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Seller:</span>
                      <p className="text-gray-600">{formData.sellerName}</p>
                    </div>
                  </div>
                </div>

                {/* Special Features */}
                {formData.specialFeatures.length > 0 && (
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.specialFeatures.map(feature => (
                        <span key={feature} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between p-8 border-t border-gray-100">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard/transactions')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-primary text-white hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Deal...
                    </div>
                  ) : (
                    'Create Deal'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}