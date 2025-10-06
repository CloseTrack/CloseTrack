import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

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

    // Check if user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    return NextResponse.json({
      success: true,
      data: {
        clerkUserId: userId,
        clerkUser: {
          email: clerkUser.emailAddresses[0]?.emailAddress,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName
        },
        dbUser: dbUser ? {
          id: dbUser.id,
          email: dbUser.email,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          role: dbUser.role
        } : null,
        userExistsInDb: !!dbUser
      }
    })
  } catch (error) {
    console.error('User check error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check user',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
