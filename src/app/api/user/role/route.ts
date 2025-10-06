import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { role } = await request.json()
    
    if (!role || !Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
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

    // First, try to find the user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    // If user doesn't exist, create them
    if (!user) {
      const clerkUser = await auth()
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: 'user@example.com', // We'll get this from Clerk if needed
          firstName: 'User',
          lastName: 'Name',
          role: role as UserRole
        }
      })
    } else {
      // Update existing user's role
      user = await prisma.user.update({
        where: { clerkId: userId },
        data: { role: role as UserRole }
      })
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        role: user.role,
        email: user.email
      },
      message: 'Role updated successfully' 
    })
  } catch (error) {
    console.error('Role update error:', error)
    
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
        error: 'Failed to update role',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
