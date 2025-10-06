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

    console.log('Current DATABASE_URL:', process.env.DATABASE_URL.substring(0, 50) + '...')

    // Test multiple connection methods
    const connectionTests = []

    // Test 1: Direct Connection
    try {
      const directUrl = process.env.DATABASE_URL.replace(
        'aws-1-us-east-2.pooler.supabase.com:6543',
        'db.gkmmpupkvhgpqikusq.supabase.co:5432'
      ).replace(
        'postgres.gkmmpupkvhgpqikusqho:',
        'postgres:'
      )

      const { PrismaClient } = await import('@prisma/client')
      const prismaDirect = new PrismaClient({
        datasources: {
          db: {
            url: directUrl,
          },
        },
      })

      await prismaDirect.$connect()
      const userCount = await prismaDirect.user.count()
      await prismaDirect.$disconnect()

      connectionTests.push({
        type: 'Direct Connection',
        success: true,
        userCount,
        url: directUrl.substring(0, 50) + '...'
      })
    } catch (error) {
      connectionTests.push({
        type: 'Direct Connection',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 2: Session Pooler
    try {
      const sessionUrl = process.env.DATABASE_URL.replace(
        'aws-1-us-east-2.pooler.supabase.com:6543',
        'aws-1-us-east-2.pooler.supabase.com:5432'
      )

      const { PrismaClient } = await import('@prisma/client')
      const prismaSession = new PrismaClient({
        datasources: {
          db: {
            url: sessionUrl,
          },
        },
      })

      await prismaSession.$connect()
      const userCount = await prismaSession.user.count()
      await prismaSession.$disconnect()

      connectionTests.push({
        type: 'Session Pooler',
        success: true,
        userCount,
        url: sessionUrl.substring(0, 50) + '...'
      })
    } catch (error) {
      connectionTests.push({
        type: 'Session Pooler',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 3: Transaction Pooler (Original)
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prismaTransaction = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      })

      await prismaTransaction.$connect()
      const userCount = await prismaTransaction.user.count()
      await prismaTransaction.$disconnect()

      connectionTests.push({
        type: 'Transaction Pooler',
        success: true,
        userCount,
        url: process.env.DATABASE_URL.substring(0, 50) + '...'
      })
    } catch (error) {
      connectionTests.push({
        type: 'Transaction Pooler',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    const successfulConnections = connectionTests.filter(test => test.success)
    const hasSuccess = successfulConnections.length > 0

    return NextResponse.json({
      success: hasSuccess,
      message: hasSuccess ? 
        `Found ${successfulConnections.length} working connection(s)` : 
        'All connection methods failed',
      data: {
        databaseUrl: 'Configured',
        currentUrl: process.env.DATABASE_URL.substring(0, 50) + '...',
        connectionTests,
        recommendedConnection: successfulConnections[0] || null,
        timestamp: new Date().toISOString()
      }
    })

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
