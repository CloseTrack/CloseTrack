'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  BookOpen, 
  Video, 
  Download,
  ChevronRight,
  HelpCircle,
  FileText,
  Users,
  Settings,
  CreditCard,
  Shield,
  Zap,
  ArrowLeft
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

interface Article {
  id: string
  title: string
  description: string
  category: string
  readTime: string
  featured: boolean
}

export default function HelpSupportPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'getting-started', name: 'Getting Started', icon: Zap },
    { id: 'transactions', name: 'Transactions', icon: FileText },
    { id: 'team', name: 'Team Management', icon: Users },
    { id: 'billing', name: 'Billing & Plans', icon: CreditCard },
    { id: 'security', name: 'Security & Privacy', icon: Shield },
    { id: 'technical', name: 'Technical Support', icon: Settings }
  ]

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I create my first transaction?',
      answer: 'To create your first transaction, click the "+ New Deal" button in the sidebar or header. Fill out the property details, client information, and transaction specifics. You can save as draft and continue later if needed.',
      category: 'getting-started'
    },
    {
      id: '2',
      question: 'How do I invite team members to my brokerage?',
      answer: 'Go to Team Management in the sidebar, click "Invite Team Member", enter their email and role, then send the invitation. They\'ll receive an email with setup instructions.',
      category: 'team'
    },
    {
      id: '3',
      question: 'Can I upload documents to transactions?',
      answer: 'Yes! In any transaction, go to the Documents tab and click "Upload Document". You can drag and drop files or browse to select them. Supported formats include PDF, DOC, XLS, JPG, and PNG.',
      category: 'transactions'
    },
    {
      id: '4',
      question: 'How do I set up deadline reminders?',
      answer: 'In the Deadlines tab of any transaction, click "Add Deadline". Set the date, time, priority level, and choose reminder settings. You can set multiple reminders (1 week, 3 days, 1 day before, and on the deadline).',
      category: 'transactions'
    },
    {
      id: '5',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and ACH bank transfers. All payments are processed securely through Stripe.',
      category: 'billing'
    },
    {
      id: '6',
      question: 'Is my data secure?',
      answer: 'Yes! We use bank-level encryption (256-bit SSL) to protect your data. All data is stored securely and we\'re SOC 2 compliant. We never share your information with third parties.',
      category: 'security'
    },
    {
      id: '7',
      question: 'How do I schedule client meetings?',
      answer: 'Click the calendar icon in the header or go to Calendar in the sidebar. Click "New Meeting" to schedule property showings, consultations, or contract reviews. You can set up video calls, phone calls, or in-person meetings.',
      category: 'transactions'
    },
    {
      id: '8',
      question: 'Can I customize my dashboard?',
      answer: 'Yes! Your dashboard shows key metrics and recent activity. You can filter transactions by status, search for specific deals, and customize the view based on your preferences.',
      category: 'getting-started'
    }
  ]

  const articles: Article[] = [
    {
      id: '1',
      title: 'Complete Guide to Transaction Management',
      description: 'Learn how to efficiently manage real estate transactions from listing to closing.',
      category: 'transactions',
      readTime: '8 min read',
      featured: true
    },
    {
      id: '2',
      title: 'Setting Up Your Team and Permissions',
      description: 'Configure team roles, permissions, and collaboration features for your brokerage.',
      category: 'team',
      readTime: '5 min read',
      featured: true
    },
    {
      id: '3',
      title: 'Document Management Best Practices',
      description: 'Organize, upload, and share transaction documents securely and efficiently.',
      category: 'transactions',
      readTime: '6 min read',
      featured: false
    },
    {
      id: '4',
      title: 'Calendar and Meeting Management',
      description: 'Schedule showings, consultations, and important meetings with clients.',
      category: 'transactions',
      readTime: '4 min read',
      featured: false
    },
    {
      id: '5',
      title: 'Understanding Your Billing and Plans',
      description: 'Learn about subscription plans, billing cycles, and how to upgrade or downgrade.',
      category: 'billing',
      readTime: '3 min read',
      featured: false
    },
    {
      id: '6',
      title: 'Security and Data Protection',
      description: 'How we protect your data and maintain the highest security standards.',
      category: 'security',
      readTime: '4 min read',
      featured: false
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         article.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto">
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
            <h1 className="text-3xl font-display font-bold text-gray-900">Help & Support</h1>
            <p className="text-gray-600 mt-2">
              Find answers, get help, and learn how to make the most of CloseTrack
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder="Search for help articles, FAQs, or topics..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Categories */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse Topics</h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{category.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Live Chat</div>
                  <div className="text-sm text-gray-600">Chat with support</div>
                </div>
              </button>
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                <Phone className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Call Support</div>
                  <div className="text-sm text-gray-600">973-348-5008</div>
                </div>
              </button>
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                <Mail className="h-6 w-6 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Email Us</div>
                  <div className="text-sm text-gray-600">info.closetrackapp@gmail.com</div>
                </div>
              </button>
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                <Video className="h-6 w-6 text-orange-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Schedule Call</div>
                  <div className="text-sm text-gray-600">Book a demo</div>
                </div>
              </button>
            </div>
          </div>

          {/* Featured Articles */}
          {filteredArticles.filter(article => article.featured).length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredArticles.filter(article => article.featured).map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{article.title}</h4>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{article.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {categories.find(c => c.id === article.category)?.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* All Articles */}
          {filteredArticles.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Help Articles</h3>
              <div className="space-y-3">
                {filteredArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{article.title}</h4>
                      <p className="text-gray-600 text-sm">{article.description}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-all"
                  >
                    <h4 className="font-semibold text-gray-900 pr-4">{faq.question}</h4>
                    <ChevronRight 
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        expandedFAQ === faq.id ? 'rotate-90' : ''
                      }`} 
                    />
                  </button>
                  {expandedFAQ === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-4"
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">Still Need Help?</h3>
            <p className="text-blue-100 mb-6">
              Our support team is here to help you succeed. Reach out anytime!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6" />
                <div>
                  <div className="font-semibold">Response Time</div>
                  <div className="text-sm text-blue-100">Within 2 hours</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6" />
                <div>
                  <div className="font-semibold">Support Hours</div>
                  <div className="text-sm text-blue-100">Mon-Fri 9AM-6PM EST</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6" />
                <div>
                  <div className="font-semibold">Security</div>
                  <div className="text-sm text-blue-100">SOC 2 Compliant</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
