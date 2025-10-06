import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...')
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL not configured',
        message: 'Database URL is not set in environment variables'
      }, { status: 500 })
    }

    // Test basic connection
    await prisma.$connect()
    console.log('Database connected successfully')

    // Test if we can query the user table
    const userCount = await prisma.user.count()
    console.log('User count:', userCount)

    // Test if we can create a test user
    const testUser = await prisma.user.create({
      data: {
        clerkId: 'test-' + Date.now(),
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'real_estate_agent'
      }
    })
    console.log('Test user created:', testUser.id)

    // Clean up test user
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    console.log('Test user deleted')

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        userCount,
        testUserCreated: true,
        databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Missing',
        connectionString: process.env.DATABASE_URL.substring(0, 50) + '...'
      }
    })
  } catch (error) {
    console.error('Database test error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      data: {
        databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Missing',
        connectionString: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'Not set'
      }
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
