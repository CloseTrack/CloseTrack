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

    // Test with direct connection (not pooler)
    const directUrl = process.env.DATABASE_URL.replace(
      'aws-1-us-east-2.pooler.supabase.com:6543',
      'db.gkmmpupkvhgpqikusqho.supabase.co:5432'
    ).replace(
      'postgres.gkmmpupkvhgpqikusqho:',
      'postgres:'
    )

    console.log('Testing with direct connection URL:', directUrl.substring(0, 50) + '...')

    // Test basic connection with a simple query
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: directUrl,
        },
      },
    })

    try {
      await prisma.$connect()
      
      // Try a simple query
      const userCount = await prisma.user.count()
      
      return NextResponse.json({
        success: true,
        message: 'Database connection successful with direct connection',
        data: {
          databaseUrl: 'Configured',
          connectionType: 'Direct Connection',
          connectionString: directUrl.substring(0, 50) + '...',
          userCount: userCount,
          timestamp: new Date().toISOString()
        }
      })
    } catch (dbError) {
      console.error('Direct connection error:', dbError)
      return NextResponse.json({
        success: false,
        error: 'Direct connection failed',
        message: dbError instanceof Error ? dbError.message : 'Unknown database error',
        data: {
          databaseUrl: 'Configured',
          connectionType: 'Direct Connection',
          connectionString: directUrl.substring(0, 50) + '...',
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
