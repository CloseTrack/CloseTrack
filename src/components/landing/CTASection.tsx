'use client'

import { SignUpButton } from '@clerk/nextjs'
import { ArrowRight, CheckCircle, Users, TrendingUp, Shield } from 'lucide-react'

export default function CTASection() {
  const benefits = [
    {
      icon: CheckCircle,
      text: '14-day free trial, no credit card required'
    },
    {
      icon: Users,
      text: 'Join 500+ real estate professionals'
    },
    {
      icon: TrendingUp,
      text: 'Increase closing efficiency by 40%'
    },
    {
      icon: Shield,
      text: 'Enterprise-grade security & compliance'
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main CTA */}
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Ready to Transform Your
          <br />
          Real Estate Business?
        </h2>
        
        <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
          Join hundreds of successful real estate professionals who are closing more deals, 
          keeping clients happy, and growing their business with CloseTrack.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <SignUpButton mode="modal">
            <button className="bg-white text-blue-600 hover:bg-gray-50 font-bold text-lg px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2">
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </SignUpButton>
          
          <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-200">
            Schedule Demo
          </button>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={index} className="flex items-center justify-center space-x-2 text-blue-100">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm md:text-base">{benefit.text}</span>
              </div>
            )
          })}
        </div>

        {/* Trust Indicators */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">$2.5M+</div>
              <div className="text-blue-100">Transactions Managed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">99.8%</div>
              <div className="text-blue-100">On-Time Closings</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-12">
          <p className="text-blue-100 mb-6">
            Don't let another transaction slip through the cracks
          </p>
          <SignUpButton mode="modal">
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold text-xl px-12 py-5 rounded-xl transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center space-x-3 mx-auto">
              <span>Get Started Now</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </SignUpButton>
        </div>
      </div>
    </section>
  )
}
