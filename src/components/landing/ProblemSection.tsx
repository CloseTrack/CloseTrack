'use client'

import { AlertTriangle, Clock, FileX, Users } from 'lucide-react'

export default function ProblemSection() {
  const problems = [
    {
      icon: Clock,
      title: 'Missed Deadlines',
      description: 'Critical inspection and appraisal deadlines slip through the cracks, causing delays and frustrated clients.',
      impact: 'Average 7-day delay per transaction'
    },
    {
      icon: FileX,
      title: 'Lost Documents',
      description: 'Important contracts and paperwork get lost in email threads, leading to compliance issues.',
      impact: '23% of deals have missing documents'
    },
    {
      icon: Users,
      title: 'Poor Communication',
      description: 'Clients are left in the dark about transaction progress, leading to anxiety and complaints.',
      impact: '67% of clients feel uninformed'
    },
    {
      icon: AlertTriangle,
      title: 'Compliance Risks',
      description: 'Manual tracking leads to missed regulatory requirements and potential legal issues.',
      impact: '12% compliance audit failure rate'
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The Real Estate Industry is
            <span className="text-red-600"> Broken</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real estate professionals waste countless hours on administrative tasks, 
            while clients remain frustrated with lack of transparency and communication delays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {problem.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {problem.description}
                </p>
                <div className="inline-block bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  {problem.impact}
                </div>
              </div>
            )
          })}
        </div>

        {/* Solution Introduction */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            There's a Better Way
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            CloseTrack eliminates these pain points with automated deadline tracking, 
            secure document management, and real-time client communication.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-700">Reduction in missed deadlines</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">80%</div>
              <div className="text-gray-700">Less time on admin tasks</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">4.9★</div>
              <div className="text-gray-700">Client satisfaction rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
