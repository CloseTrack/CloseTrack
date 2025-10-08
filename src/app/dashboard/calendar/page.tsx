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

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')

  // Sample meetings data
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Property Showing - 123 Main St',
      type: 'in_person',
      date: new Date(),
      time: '10:00',
      duration: 60,
      location: '123 Main Street, Edison, NJ',
      attendees: ['John Smith', 'Jane Doe'],
      description: 'Initial property showing for potential buyers',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Client Consultation Call',
      type: 'phone',
      date: addDays(new Date(), 1),
      time: '14:00',
      duration: 30,
      attendees: ['Mike Johnson'],
      description: 'Discuss listing strategy and pricing',
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Contract Review Meeting',
      type: 'video',
      date: addDays(new Date(), 3),
      time: '16:00',
      duration: 45,
      attendees: ['Sarah Williams', 'Legal Team'],
      description: 'Review purchase agreement details',
      status: 'scheduled'
    }
  ])

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter(meeting => isSameDay(meeting.date, date))
  }

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'in_person': return MapPin
      case 'video': return Video
      case 'phone': return Phone
      default: return Calendar
    }
  }

  const getMeetingTypeColor = (type: string) => {
    switch (type) {
      case 'in_person': return 'bg-blue-100 text-blue-700'
      case 'video': return 'bg-purple-100 text-purple-700'
      case 'phone': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const generateCalendarDays = () => {
    const start = startOfWeek(currentDate)
    const end = endOfWeek(currentDate)
    const days = []
    
    for (let day = start; day <= end; day = addDays(day, 1)) {
      days.push(day)
    }
    
    return days
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600 mt-2">
              Manage your meetings, showings, and appointments
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Day
              </button>
            </div>

            {/* New Meeting Button */}
            <button
              onClick={() => setShowNewMeetingModal(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Meeting</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Calendar Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentDate(addDays(currentDate, -7))}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(addDays(currentDate, 7))}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Days */}
        <div className="p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-4">
            {calendarDays.map(day => {
              const dayMeetings = getMeetingsForDate(day)
              const isCurrentMonth = day.getMonth() === currentDate.getMonth()
              const isSelected = isSameDay(day, selectedDate)
              const isTodayDate = isToday(day)

              return (
                <motion.div
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[120px] p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : isTodayDate
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayMeetings.slice(0, 2).map(meeting => {
                      const Icon = getMeetingTypeIcon(meeting.type)
                      return (
                        <div
                          key={meeting.id}
                          className={`text-xs p-2 rounded-lg ${getMeetingTypeColor(meeting.type)}`}
                        >
                          <div className="flex items-center space-x-1">
                            <Icon className="h-3 w-3" />
                            <span className="truncate">{meeting.time}</span>
                          </div>
                          <div className="truncate font-medium">{meeting.title}</div>
                        </div>
                      )
                    })}
                    {dayMeetings.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayMeetings.length - 2} more
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          
          {getMeetingsForDate(selectedDate).length > 0 ? (
            <div className="space-y-4">
              {getMeetingsForDate(selectedDate).map(meeting => {
                const Icon = getMeetingTypeIcon(meeting.type)
                return (
                  <div key={meeting.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className={`p-2 rounded-lg ${getMeetingTypeColor(meeting.type)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{meeting.time} ({meeting.duration} min)</span>
                        </div>
                        {meeting.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{meeting.location}</span>
                          </div>
                        )}
                      </div>
                      {meeting.description && (
                        <p className="text-sm text-gray-600 mt-2">{meeting.description}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-3">
                        <Users className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {meeting.attendees.map((attendee, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {attendee}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No meetings scheduled for this day</p>
              <button
                onClick={() => setShowNewMeetingModal(true)}
                className="mt-4 btn-primary"
              >
                Schedule Meeting
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* New Meeting Modal */}
      {showNewMeetingModal && (
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
              <h3 className="text-xl font-semibold text-gray-900">Schedule New Meeting</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Property showing, client consultation, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Type *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all">
                      <MapPin className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <div className="text-sm font-medium">In Person</div>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all">
                      <Video className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <div className="text-sm font-medium">Video Call</div>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all">
                      <Phone className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <div className="text-sm font-medium">Phone Call</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attendees
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email addresses separated by commas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Meeting agenda, notes, or special instructions..."
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowNewMeetingModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:shadow-lg transition-all">
                Schedule Meeting
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}