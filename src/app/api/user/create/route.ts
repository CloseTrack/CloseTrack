import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ 
        error: 'Database not configured',
        message: 'DATABASE_URL is not set in environment variables'
      }, { status: 500 })
    }

    // Try to connect to database
    await prisma.$connect()

    // Get user info from Clerk
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'User not found in Clerk' }, { status: 404 })
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (user) {
      return NextResponse.json({ 
        success: true, 
        message: 'User already exists',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      })
    }

    // Create new user
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || 'user@example.com',
        firstName: clerkUser.firstName || 'User',
        lastName: clerkUser.lastName || 'Name',
        role: UserRole.agent
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    })
  } catch (error) {
    console.error('User creation error:', error)
    
    // Check if it's a database connection error
    if (error instanceof Error) {
      if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
        return NextResponse.json({ 
          error: 'Database connection failed',
          message: 'Unable to connect to database. Please check your DATABASE_URL.'
        }, { status: 500 })
      }
      
      if (error.message.includes('relation') || error.message.includes('table')) {
        return NextResponse.json({ 
          error: 'Database tables not found',
          message: 'Please run the database setup script in Supabase.'
        }, { status: 500 })
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create user',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
