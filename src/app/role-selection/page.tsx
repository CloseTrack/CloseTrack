'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserRole } from '@prisma/client'

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const roles = [
    {
      value: 'real_estate_agent',
      label: 'Real Estate Agent',
      description: 'Manage transactions, clients, and deals',
      icon: '🏠'
    },
    {
      value: 'buyer',
      label: 'Buyer',
      description: 'Track your home buying process',
      icon: '🔍'
    },
    {
      value: 'seller',
      label: 'Seller',
      description: 'Monitor your home selling progress',
      icon: '📈'
    },
    {
      value: 'title_insurance_agent',
      label: 'Title Insurance Agent',
      description: 'Collaborate on transaction documentation',
      icon: '📋'
    }
  ]

  const handleRoleSelection = async (role: string) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/user/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })
      
      if (response.ok) {
        // Redirect to dashboard after successful role update
        router.push('/dashboard')
      } else {
        console.error('Failed to update role')
        alert('Failed to update role. Please try again.')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Error updating role. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to CloseTrack!
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Please select your role to get started
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => handleRoleSelection(role.value)}
              disabled={isLoading}
              className="p-6 text-left border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-4xl mb-4">{role.icon}</div>
              <div className="font-semibold text-lg text-gray-900 mb-2">
                {role.label}
              </div>
              <div className="text-gray-600">{role.description}</div>
            </button>
          ))}
        </div>
        
        {isLoading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Setting up your account...</p>
          </div>
        )}
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            You can change your role later in settings
          </p>
        </div>
      </div>
    </div>
  )
}
