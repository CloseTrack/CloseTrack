'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus,
  Edit,
  Trash2,
  Video,
  Phone,
  Building2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday } from 'date-fns'

interface Meeting {
  id: string
  title: string
  type: 'in_person' | 'video' | 'phone'
  date: Date
  time: string
  duration: number
  location?: string
  attendees: string[]
  description?: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export default function NewMeetingPage() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    type: 'in_person' as 'in_person' | 'video' | 'phone',
    duration: 60,
    location: '',
    attendees: '',
    description: ''
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Meeting scheduled:', formData)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Schedule New Meeting</h1>
        <p className="text-gray-600 mt-2">
          Book a client meeting, property showing, or consultation
        </p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-8">
            {/* Meeting Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Meeting Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="Property showing, client consultation, contract review..."
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Time *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Meeting Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Meeting Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { type: 'in_person', label: 'In Person', icon: MapPin, desc: 'Property showing, office meeting' },
                  { type: 'video', label: 'Video Call', icon: Video, desc: 'Zoom, Teams, Google Meet' },
                  { type: 'phone', label: 'Phone Call', icon: Phone, desc: 'Quick consultation call' }
                ].map(({ type, label, icon: Icon, desc }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange('type', type)}
                    className={`p-6 border-2 rounded-xl transition-all ${
                      formData.type === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`h-8 w-8 mx-auto mb-3 ${
                      formData.type === type ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <div className={`font-semibold mb-1 ${
                      formData.type === type ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {label}
                    </div>
                    <div className={`text-sm ${
                      formData.type === type ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      {desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Duration *
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            {/* Location (for in-person meetings) */}
            {formData.type === 'in_person' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Property address, office location, or meeting spot"
                  required
                />
              </div>
            )}

            {/* Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Attendees
              </label>
              <input
                type="text"
                value={formData.attendees}
                onChange={(e) => handleInputChange('attendees', e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email addresses separated by commas (client@email.com, agent@email.com)"
              />
              <p className="text-sm text-gray-500 mt-2">
                Meeting invitations will be sent to these email addresses
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Meeting Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Meeting agenda, special instructions, or notes..."
              />
            </div>

            {/* Special Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Meeting Features
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { feature: 'reminder', label: 'Send Reminder', desc: 'Email reminder 24 hours before' },
                  { feature: 'recording', label: 'Record Meeting', desc: 'Save video/audio for records' },
                  { feature: 'followup', label: 'Follow-up Task', desc: 'Create task after meeting' },
                  { feature: 'calendar', label: 'Calendar Sync', desc: 'Sync with Google/Outlook' }
                ].map(({ feature, label, desc }) => (
                  <label key={feature} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
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
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-primary text-white rounded-xl font-medium hover:shadow-lg transition-all inline-flex items-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>Schedule Meeting</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
