'use client'

import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Calendar, 
  Shield,
  Edit,
  Camera,
  Save,
  X
} from 'lucide-react'
import { useState } from 'react'

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    license: '',
    bio: ''
  })

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please sign in to view your profile.</p>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving profile:', formData)
    setIsEditing(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="text-center">
              {/* Profile Image */}
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-4xl font-bold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* User Info */}
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                {user.primaryEmailAddress?.emailAddress}
              </p>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 mb-4">
                <Shield className="h-3 w-3 mr-1" />
                Agent
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <p className="text-xs text-gray-600">Active Deals</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-xs text-gray-600">Total Closed</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Email verified</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              {isEditing && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors inline-flex items-center space-x-1"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-1"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.firstName || user.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{user.firstName || 'Not set'}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.lastName || user.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{user.lastName || 'Not set'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{user.primaryEmailAddress?.emailAddress}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{formData.phone || 'Not set'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Info */}
              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company/Brokerage
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your Company Name"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <Building2 className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{formData.company || 'Not set'}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.license}
                        onChange={(e) => handleInputChange('license', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="License #"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <Shield className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{formData.license || 'Not set'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="pt-6 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Bio
                </label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your experience and specialties..."
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-900">
                      {formData.bio || 'No bio added yet. Click "Edit Profile" to add your professional background.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { id: 'email', label: 'Email Notifications', desc: 'Receive email updates about your transactions' },
                { id: 'sms', label: 'SMS Notifications', desc: 'Get text messages for urgent updates' },
                { id: 'deadline', label: 'Deadline Reminders', desc: 'Reminders for upcoming deadlines' },
                { id: 'marketing', label: 'Marketing Emails', desc: 'Receive tips and updates from CloseTrack' }
              ].map(pref => (
                <label key={pref.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked={pref.id !== 'marketing'}
                  />
                  <div>
                    <div className="font-medium text-gray-900">{pref.label}</div>
                    <div className="text-sm text-gray-600">{pref.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

