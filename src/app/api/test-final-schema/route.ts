import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user data from Clerk
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return NextResponse.json({ 
        error: 'Unable to get user data from Clerk',
        message: 'Please try signing in again'
      }, { status: 400 })
    }

    // Test creating a user with all required fields
    try {
      const testUser = await prisma.user.create({
        data: {
          clerkId: `test-${Date.now()}`,
          email: `test-${Date.now()}@example.com`,
          firstName: 'Test',
          lastName: 'User',
          role: UserRole.real_estate_agent
        }
      })
      
      // Test finding the user
      const foundUser = await prisma.user.findUnique({
        where: { clerkId: testUser.clerkId! }
      })
      
      // Clean up test user
      await prisma.user.delete({
        where: { id: testUser.id }
      })

      return NextResponse.json({
        success: true,
        message: 'Database schema is perfect! User creation and lookup works.',
        testResult: {
          created: true,
          found: !!foundUser,
          deleted: true,
          user: {
            id: testUser.id,
            clerkId: testUser.clerkId,
            email: testUser.email,
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            role: testUser.role
          }
        }
      })
    } catch (createError) {
      return NextResponse.json({
        success: false,
        message: 'Database schema still has issues',
        error: createError instanceof Error ? createError.message : 'Unknown error',
        suggestion: 'Please run the cleanup-duplicate-columns.sql script in Supabase SQL Editor'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Schema test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to test schema',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
