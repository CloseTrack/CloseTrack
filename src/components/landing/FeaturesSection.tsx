'use client'

import { 
  Calendar, 
  FileText, 
  Users, 
  Shield, 
  Bell, 
  BarChart3, 
  Smartphone, 
  Cloud,
  Clock,
  CheckCircle,
  MessageSquare,
  TrendingUp
} from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: 'Automated Deadline Tracking',
      description: 'Never miss another inspection, appraisal, or closing deadline. Get automated reminders and alerts.',
      benefits: ['NJ-specific transaction timelines', 'Smart deadline calculations', 'Multi-channel notifications']
    },
    {
      icon: FileText,
      title: 'Secure Document Management',
      description: 'Centralized document storage with version control, e-signatures, and secure sharing.',
      benefits: ['AWS S3 secure storage', 'DocuSign integration', 'Version control & audit trails']
    },
    {
      icon: Users,
      title: 'Multi-Party Collaboration',
      description: 'Seamlessly collaborate with agents, brokers, title companies, and clients in one platform.',
      benefits: ['Role-based access control', 'Real-time updates', 'Client portal access']
    },
    {
      icon: Shield,
      title: 'Compliance Engine',
      description: 'Automated compliance checking ensures all required documents and deadlines are met.',
      benefits: ['Regulatory compliance alerts', 'Missing document detection', 'Audit trail generation']
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Intelligent notifications via email, SMS, and in-app alerts keep everyone informed.',
      benefits: ['Twilio SMS integration', 'Email notifications', 'Customizable alert preferences']
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Comprehensive dashboards and reports for agents, brokers, and title companies.',
      benefits: ['Revenue pipeline tracking', 'Performance analytics', 'Exportable reports']
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description: 'Full functionality on mobile devices with responsive design and future app support.',
      benefits: ['Responsive design', 'Mobile-optimized workflows', 'Future iOS/Android apps']
    },
    {
      icon: Cloud,
      title: 'Cloud Infrastructure',
      description: 'Built on scalable cloud infrastructure with 99.9% uptime and enterprise security.',
      benefits: ['AWS infrastructure', 'Automatic backups', 'Enterprise security']
    }
  ]

  const workflows = [
    {
      step: 1,
      title: 'Create Transaction',
      description: 'Agents create new transactions and invite all parties',
      icon: CheckCircle
    },
    {
      step: 2,
      title: 'Upload Documents',
      description: 'Secure document upload and sharing with all stakeholders',
      icon: FileText
    },
    {
      step: 3,
      title: 'Track Deadlines',
      description: 'Automated deadline tracking with smart reminders',
      icon: Clock
    },
    {
      step: 4,
      title: 'Client Updates',
      description: 'Real-time status updates keep clients informed',
      icon: MessageSquare
    },
    {
      step: 5,
      title: 'Close Deal',
      description: 'Streamlined closing process with all parties coordinated',
      icon: TrendingUp
    }
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to
            <span className="gradient-text"> Close Deals Faster</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            CloseTrack provides a comprehensive suite of tools designed specifically 
            for real estate professionals to streamline transactions and delight clients.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="feature-card">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Workflow Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How CloseTrack Works
            </h3>
            <p className="text-xl text-gray-600">
              From transaction creation to closing, CloseTrack streamlines every step
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {workflows.map((workflow, index) => {
              const Icon = workflow.icon
              return (
                <div key={index} className="text-center relative">
                  {/* Connector Line */}
                  {index < workflows.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200 transform translate-x-4"></div>
                  )}
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-sm font-bold text-blue-600">{workflow.step}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {workflow.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {workflow.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
