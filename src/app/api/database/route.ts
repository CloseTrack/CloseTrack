import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test basic connection
    await prisma.$connect()
    
    // Test if tables exist by trying to query them
    const userCount = await prisma.user.count()
    const transactionCount = await prisma.transaction.count()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      data: {
        userCount,
        transactionCount,
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Missing'
      }
    })
  } catch (error) {
    console.error('Database error:', error)
    
    // Check if it's a connection error
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Database connection failed',
          message: 'Please check your DATABASE_URL environment variable',
          details: error.message
        }, { status: 500 })
      }
      
      if (error.message.includes('relation') || error.message.includes('table')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Database tables not found',
          message: 'Please run database migrations first',
          details: error.message
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Database error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint can be used to initialize the database
    const { action } = await request.json()
    
    if (action === 'init') {
      // Test connection
      await prisma.$connect()
      
      // Try to create a test user to verify schema
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
        message: 'Database initialized successfully' 
      })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action' 
    }, { status: 400 })
    
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Database initialization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
