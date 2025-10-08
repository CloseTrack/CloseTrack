'use client'

import { SignUpButton } from '@clerk/nextjs'
import { ArrowRight, Play, CheckCircle } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
            <CheckCircle className="w-4 h-4 mr-2" />
            Trusted by Real Estate Professionals
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Real Estate Transactions
            <br />
            <span className="gradient-text">Made Simple</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Streamline your deals from offer to closing with automated deadline tracking, 
            document management, and real-time client updates. Built for agents, brokers, and title companies.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <SignUpButton mode="modal">
              <button className="btn-primary text-lg px-8 py-4 flex items-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </SignUpButton>
            
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Play className="w-5 h-5 text-blue-600 ml-1" />
              </div>
              <span className="text-lg font-medium">Watch Demo</span>
            </button>
          </div>

          {/* Social Proof */}
          <div className="text-sm text-gray-500 mb-8">
            <p>No credit card required • 14-day free trial • Cancel anytime</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">$2.5M+</div>
              <div className="text-gray-600">Transactions Managed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">99.8%</div>
              <div className="text-gray-600">On-Time Closings</div>
            </div>
          </div>
        </div>

        {/* Hero Image/Dashboard Preview */}
        <div className="mt-16 relative">
          <div className="relative mx-auto max-w-6xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-2xl transform rotate-1"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform -rotate-1">
              <div className="bg-gray-100 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-500">CloseTrack Dashboard</div>
                </div>
                
                {/* Mock Dashboard Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">Active Transactions</h3>
                        <span className="text-2xl font-bold text-blue-600">12</span>
                      </div>
                      <div className="text-sm text-gray-600">3 closing this week</div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">Revenue Pipeline</h3>
                        <span className="text-2xl font-bold text-green-600">$847K</span>
                      </div>
                      <div className="text-sm text-gray-600">+23% this month</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">Upcoming Deadlines</h3>
                        <span className="text-2xl font-bold text-yellow-600">5</span>
                      </div>
                      <div className="text-sm text-gray-600">2 due tomorrow</div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">Client Satisfaction</h3>
                        <span className="text-2xl font-bold text-purple-600">4.9★</span>
                      </div>
                      <div className="text-sm text-gray-600">Based on 127 reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
