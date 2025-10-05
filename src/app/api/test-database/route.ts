import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test basic connection
    await prisma.$connect()
    
    // Test if we can query the user table
    const userCount = await prisma.user.count()
    
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
    
    // Clean up test user
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        userCount,
        testUserCreated: true,
        databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Missing'
      }
    })
  } catch (error) {
    console.error('Database test error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      data: {
        databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Missing'
      }
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
