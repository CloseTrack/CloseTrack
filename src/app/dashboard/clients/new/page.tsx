'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  DollarSign, 
  Home, 
  Car, 
  Briefcase, 
  Heart, 
  Star,
  ArrowLeft,
  CheckCircle,
  Plus,
  X
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ClientFormData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  
  // Address Information
  currentAddress: string
  currentCity: string
  currentState: string
  currentZip: string
  
  // Client Type and Preferences
  clientType: 'buyer' | 'seller' | 'both'
  budgetMin: string
  budgetMax: string
  preferredLocations: string[]
  propertyTypes: string[]
  
  // Additional Information
  occupation: string
  employer: string
  income: string
  creditScore: string
  timeline: string
  motivation: string
  notes: string
  
  // Communication Preferences
  preferredContact: 'email' | 'phone' | 'text' | 'any'
  bestTimeToContact: string
  marketingConsent: boolean
}

export default function ClientRegistrationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<ClientFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    currentAddress: '',
    currentCity: '',
    currentState: '',
    currentZip: '',
    clientType: 'buyer',
    budgetMin: '',
    budgetMax: '',
    preferredLocations: [],
    propertyTypes: [],
    occupation: '',
    employer: '',
    income: '',
    creditScore: '',
    timeline: '',
    motivation: '',
    notes: '',
    preferredContact: 'any',
    bestTimeToContact: '',
    marketingConsent: false
  })

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Address', icon: MapPin },
    { id: 3, title: 'Preferences', icon: Heart },
    { id: 4, title: 'Financial', icon: DollarSign },
    { id: 5, title: 'Communication', icon: Phone }
  ]

  const propertyTypes = [
    { id: 'single_family', label: 'Single Family Home', icon: Home },
    { id: 'condo', label: 'Condominium', icon: Building2 },
    { id: 'townhouse', label: 'Townhouse', icon: Building2 },
    { id: 'multi_family', label: 'Multi-Family', icon: Building2 },
    { id: 'land', label: 'Land/Lot', icon: MapPin },
    { id: 'commercial', label: 'Commercial', icon: Briefcase }
  ]

  const timelineOptions = [
    { value: 'immediate', label: 'Immediately (0-30 days)' },
    { value: 'soon', label: 'Soon (1-3 months)' },
    { value: 'moderate', label: 'Moderate (3-6 months)' },
    { value: 'flexible', label: 'Flexible (6+ months)' }
  ]

  const handleInputChange = (field: keyof ClientFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayToggle = (field: 'preferredLocations' | 'propertyTypes', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Client registered:', formData)
    setIsSubmitting(false)
    router.push('/dashboard/clients')
  }

  const addLocation = () => {
    const location = prompt('Enter preferred location:')
    if (location && !formData.preferredLocations.includes(location)) {
      handleArrayToggle('preferredLocations', location)
    }
  }

  const removeLocation = (location: string) => {
    handleArrayToggle('preferredLocations', location)
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
            <h1 className="text-3xl font-display font-bold text-gray-900">Client Registration</h1>
            <p className="text-gray-600 mt-2">
              Register a new client and capture all their information
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isActive 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="h-6 w-6 text-blue-600 mr-3" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Address Information */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                Current Address
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.currentAddress}
                    onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.currentCity}
                      onChange={(e) => handleInputChange('currentCity', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={formData.currentState}
                      onChange={(e) => handleInputChange('currentState', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={formData.currentZip}
                      onChange={(e) => handleInputChange('currentZip', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Preferences */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Heart className="h-6 w-6 text-blue-600 mr-3" />
                Client Preferences
              </h2>
              
              <div className="space-y-8">
                {/* Client Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Client Type *
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { type: 'buyer', label: 'Buyer', desc: 'Looking to purchase property' },
                      { type: 'seller', label: 'Seller', desc: 'Looking to sell property' },
                      { type: 'both', label: 'Both', desc: 'Buying and selling' }
                    ].map(({ type, label, desc }) => (
                      <label key={type} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="clientType"
                          value={type}
                          checked={formData.clientType === type}
                          onChange={(e) => handleInputChange('clientType', e.target.value)}
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

                {/* Budget Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Budget
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.budgetMin}
                        onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Budget
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.budgetMax}
                        onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Locations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Locations
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.preferredLocations.map((location) => (
                      <span key={location} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                        {location}
                        <button
                          type="button"
                          onClick={() => removeLocation(location)}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addLocation}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Location
                  </button>
                </div>

                {/* Property Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Property Types of Interest
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {propertyTypes.map(({ id, label, icon: Icon }) => (
                      <label key={id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.propertyTypes.includes(id)}
                          onChange={() => handleArrayToggle('propertyTypes', id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <Icon className="h-5 w-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Financial Information */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <DollarSign className="h-6 w-6 text-blue-600 mr-3" />
                Financial Information
              </h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occupation
                    </label>
                    <input
                      type="text"
                      value={formData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employer
                    </label>
                    <input
                      type="text"
                      value={formData.employer}
                      onChange={(e) => handleInputChange('employer', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Income
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.income}
                        onChange={(e) => handleInputChange('income', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credit Score Range
                    </label>
                    <select
                      value={formData.creditScore}
                      onChange={(e) => handleInputChange('creditScore', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select range...</option>
                      <option value="excellent">Excellent (750+)</option>
                      <option value="good">Good (700-749)</option>
                      <option value="fair">Fair (650-699)</option>
                      <option value="poor">Poor (Below 650)</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select timeline...</option>
                    {timelineOptions.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivation
                  </label>
                  <textarea
                    rows={3}
                    value={formData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What's driving their decision to buy/sell?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any other important information about this client..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Communication Preferences */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Phone className="h-6 w-6 text-blue-600 mr-3" />
                Communication Preferences
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Contact Method *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { method: 'email', label: 'Email', desc: 'Send updates via email' },
                      { method: 'phone', label: 'Phone', desc: 'Call for important updates' },
                      { method: 'text', label: 'Text', desc: 'Send SMS notifications' },
                      { method: 'any', label: 'Any', desc: 'Use any method' }
                    ].map(({ method, label, desc }) => (
                      <label key={method} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value={method}
                          checked={formData.preferredContact === method}
                          onChange={(e) => handleInputChange('preferredContact', e.target.value)}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Best Time to Contact
                  </label>
                  <input
                    type="text"
                    value={formData.bestTimeToContact}
                    onChange={(e) => handleInputChange('bestTimeToContact', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Weekdays 9AM-5PM, Evenings after 7PM"
                  />
                </div>
                <div>
                  <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.marketingConsent}
                      onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Marketing Communications</div>
                      <div className="text-sm text-gray-600">
                        I consent to receive marketing emails, newsletters, and promotional materials from CloseTrack.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between p-8 border-t border-gray-100">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-4">
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:shadow-lg transition-all inline-flex items-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Registering Client...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Register Client</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}