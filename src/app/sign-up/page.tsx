'use client'

import { useState } from 'react'
import { SignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function CustomSignUpPage() {
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const router = useRouter()

  const roles = [
    {
      value: 'real_estate_agent',
      label: 'Real Estate Agent',
      description: 'Manage transactions, clients, and deals'
    },
    {
      value: 'buyer',
      label: 'Buyer',
      description: 'Track your home buying process'
    },
    {
      value: 'seller',
      label: 'Seller',
      description: 'Monitor your home selling progress'
    },
    {
      value: 'title_insurance_agent',
      label: 'Title Insurance Agent',
      description: 'Collaborate on transaction documentation'
    }
  ]

  const handleRoleSelection = async (role: string) => {
    setSelectedRole(role)
    setShowRoleSelection(false)
    
    // Update user role via API
    try {
      const response = await fetch('/api/user/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })
      
      if (response.ok) {
        console.log('Role updated successfully')
      } else {
        console.error('Failed to update role')
      }
    } catch (error) {
      console.error('Error updating role:', error)
    }
  }

  if (showRoleSelection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Choose Your Role
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Select the role that best describes you
            </p>
          </div>
          
          <div className="space-y-4">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => handleRoleSelection(role.value)}
                className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="font-semibold text-gray-900">{role.label}</div>
                <div className="text-sm text-gray-600">{role.description}</div>
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowRoleSelection(false)}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign up to get started with CloseTrack
          </p>
        </div>
        
        <div className="mt-8">
          <SignUp 
            afterSignUpUrl="/role-selection"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
              }
            }}
          />
        </div>
        
        <div className="text-center">
          <button
            onClick={() => setShowRoleSelection(true)}
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            Need to select a different role? Click here
          </button>
        </div>
      </div>
    </div>
  )
}