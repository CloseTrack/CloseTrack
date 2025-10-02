'use client'

import { Star, Quote } from 'lucide-react'

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Senior Real Estate Agent',
      company: 'Premier Properties',
      image: '/api/placeholder/64/64',
      content: 'CloseTrack has revolutionized how I manage my transactions. I used to spend hours tracking deadlines and updating clients. Now everything is automated, and my clients love the real-time updates.',
      rating: 5,
      metric: 'Saved 15 hours per week'
    },
    {
      name: 'Michael Chen',
      role: 'Broker',
      company: 'Elite Realty Group',
      image: '/api/placeholder/64/64',
      content: 'As a broker managing 25 agents, CloseTrack gives me complete visibility into all transactions. The compliance alerts have prevented several potential issues, and my agents are more productive than ever.',
      rating: 5,
      metric: '99.8% on-time closings'
    },
    {
      name: 'Jennifer Martinez',
      role: 'Title Company Owner',
      company: 'Secure Title Services',
      image: '/api/placeholder/64/64',
      content: 'The collaboration features are incredible. I can securely share documents with all parties, track closing progress, and ensure nothing falls through the cracks. Our closing efficiency has improved by 40%.',
      rating: 5,
      metric: '40% faster closings'
    },
    {
      name: 'David Thompson',
      role: 'Real Estate Agent',
      company: 'Thompson Realty',
      image: '/api/placeholder/64/64',
      content: 'My clients absolutely love the transparency. They can see exactly where their transaction stands at any time. The automated updates keep them informed without me having to constantly call or email.',
      rating: 5,
      metric: '4.9★ client satisfaction'
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Broker',
      company: 'Coastal Properties',
      image: '/api/placeholder/64/64',
      content: 'The analytics dashboard is a game-changer. I can see revenue projections, track agent performance, and identify bottlenecks in our process. It\'s like having a business intelligence tool built specifically for real estate.',
      rating: 5,
      metric: '23% revenue increase'
    },
    {
      name: 'Robert Kim',
      role: 'Real Estate Agent',
      company: 'Metro Real Estate',
      image: '/api/placeholder/64/64',
      content: 'The document management system is flawless. No more lost contracts or version control issues. Everything is organized, secure, and easily accessible. It\'s eliminated so much stress from my workflow.',
      rating: 5,
      metric: 'Zero document issues'
    }
  ]

  const stats = [
    { number: '500+', label: 'Active Users' },
    { number: '$2.5M+', label: 'Transactions Managed' },
    { number: '99.8%', label: 'On-Time Closings' },
    { number: '4.9★', label: 'Average Rating' }
  ]

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Loved by Real Estate
            <span className="gradient-text"> Professionals</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what agents, brokers, and title companies are saying about CloseTrack
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 relative">
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="w-8 h-8 text-blue-200" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Metric */}
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
                {testimonial.metric}
              </div>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  <div className="text-gray-500 text-sm">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Join Hundreds of Successful Real Estate Professionals
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start your free trial today and experience the difference CloseTrack can make for your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-primary text-lg px-8 py-4">
              Start Free Trial
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
