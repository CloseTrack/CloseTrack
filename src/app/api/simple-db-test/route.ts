import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL not configured',
        message: 'Database URL is not set in environment variables',
        data: {
          databaseUrl: 'Not Set',
          connectionString: 'Not Available'
        }
      })
    }

    // Test basic connection with a simple query
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })

    try {
      await prisma.$connect()
      
      // Try a simple query
      const userCount = await prisma.user.count()
      
      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        data: {
          databaseUrl: 'Configured',
          connectionString: process.env.DATABASE_URL.substring(0, 50) + '...',
          userCount: userCount,
          timestamp: new Date().toISOString()
        }
      })
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        message: dbError instanceof Error ? dbError.message : 'Unknown database error',
        data: {
          databaseUrl: 'Configured',
          connectionString: process.env.DATABASE_URL.substring(0, 50) + '...',
          errorDetails: dbError instanceof Error ? dbError.message : 'Unknown error'
        }
      }, { status: 500 })
    } finally {
      await prisma.$disconnect()
    }
  } catch (error) {
    console.error('General error:', error)
    return NextResponse.json({
      success: false,
      error: 'General error',
      message: error instanceof Error ? error.message : 'Unknown error',
      data: {
        databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Not Set',
        connectionString: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'Not Available'
      }
    }, { status: 500 })
  }
}
