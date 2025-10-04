import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Not authenticated' 
      }, { status: 401 })
    }

    // Get Clerk user info
    const clerkUser = await currentUser()
    
    // Check if user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    return NextResponse.json({
      success: true,
      data: {
        clerkUserId: userId,
        clerkUser: clerkUser ? {
          email: clerkUser.emailAddresses[0]?.emailAddress,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
        } : null,
        dbUser: dbUser ? {
          id: dbUser.id,
          email: dbUser.email,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          role: dbUser.role,
        } : null,
        userExistsInDb: !!dbUser
      }
    })
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Auth test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
