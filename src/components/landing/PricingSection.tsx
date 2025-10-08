'use client'

import { Check, Star, Users, Building, Crown } from 'lucide-react'
import { SignUpButton } from '@clerk/nextjs'

export default function PricingSection() {
  const plans = [
    {
      name: 'Agent',
      description: 'Perfect for individual real estate agents',
      price: 29,
      period: 'month',
      icon: Users,
      popular: false,
      features: [
        'Unlimited transactions',
        'Automated deadline tracking',
        'Document management',
        'Client portal access',
        'Email & SMS notifications',
        'Basic analytics',
        'Mobile responsive',
        'Email support'
      ],
      cta: 'Start Free Trial',
      color: 'blue'
    },
    {
      name: 'Broker',
      description: 'Ideal for brokers managing multiple agents',
      price: 49,
      period: 'month',
      icon: Building,
      popular: true,
      features: [
        'Everything in Agent plan',
        'Multi-agent management',
        'Advanced analytics & reporting',
        'Compliance oversight',
        'Team performance tracking',
        'Custom branding',
        'Priority support',
        'API access'
      ],
      cta: 'Start Free Trial',
      color: 'purple'
    },
    {
      name: 'Title Company',
      description: 'Professional collaboration tools for title companies',
      price: 19,
      period: 'month',
      icon: Crown,
      popular: false,
      features: [
        'Join unlimited transactions',
        'Secure document exchange',
        'Closing coordination tools',
        'Client communication',
        'Deadline reminders',
        'Advanced reporting',
        'Mobile access',
        'Priority support'
      ],
      cta: 'Start Free Trial',
      color: 'green'
    }
  ]

  const faqs = [
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing differences.'
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No setup fees, no hidden costs. You only pay the monthly subscription fee. We also offer a 14-day free trial with no credit card required.'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'Your data is always yours. You can export all your transactions and documents before canceling, and we\'ll keep your data for 90 days after cancellation.'
    },
    {
      question: 'Do you offer custom enterprise plans?',
      answer: 'Yes, we offer custom enterprise plans for large brokerages with 50+ agents. Contact us for a personalized quote and demo.'
    }
  ]

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent
            <span className="gradient-text"> Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial with no credit card required.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const isPopular = plan.popular
            
            return (
              <div 
                key={index} 
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  isPopular 
                    ? 'border-purple-200 transform scale-105' 
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      plan.color === 'blue' ? 'bg-blue-100' :
                      plan.color === 'purple' ? 'bg-purple-100' :
                      'bg-green-100'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        plan.color === 'blue' ? 'text-blue-600' :
                        plan.color === 'purple' ? 'text-purple-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600 ml-2">
                        /{plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <SignUpButton mode="modal">
                    <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                      isPopular
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}>
                      {plan.cta}
                    </button>
                  </SignUpButton>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-xl text-gray-600">
              Everything you need to know about CloseTrack pricing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="text-center mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Need a Custom Solution?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We offer enterprise plans for large brokerages with custom features, 
            dedicated support, and volume discounts.
          </p>
          <button className="btn-primary text-lg px-8 py-4">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  )
}
