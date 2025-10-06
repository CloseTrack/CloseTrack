import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL not configured',
        message: 'Database URL is not set in environment variables'
      })
    }

    console.log('Current DATABASE_URL:', process.env.DATABASE_URL.substring(0, 50) + '...')

    // Extract password from current URL
    const currentUrl = process.env.DATABASE_URL
    const passwordMatch = currentUrl.match(/postgres:([^@]+)@/)
    const password = passwordMatch ? passwordMatch[1] : 'RxgzmrMDVfybLYCD'

    // Test different hostname formats
    const hostnameTests = [
      'db.gkmmpupkvhgpqikusq.supabase.co:5432',
      'db.gkmmpupkvhgpqikusqho.supabase.co:5432', // With 'ho'
      'aws-0-us-east-1.pooler.supabase.com:6543', // Different region
      'aws-1-us-east-2.pooler.supabase.com:6543', // Your current region
      'aws-0-us-east-1.pooler.supabase.com:5432', // Session pooler
      'aws-1-us-east-2.pooler.supabase.com:5432', // Session pooler
    ]

    const connectionTests = []

    for (const hostname of hostnameTests) {
      try {
        const testUrl = `postgresql://postgres:${password}@${hostname}/postgres`
        
        const { PrismaClient } = await import('@prisma/client')
        const prisma = new PrismaClient({
          datasources: {
            db: {
              url: testUrl,
            },
          },
        })

        await prisma.$connect()
        const userCount = await prisma.user.count()
        await prisma.$disconnect()

        connectionTests.push({
          hostname,
          success: true,
          userCount,
          url: testUrl.substring(0, 50) + '...'
        })

        // If we find a working connection, return it immediately
        return NextResponse.json({
          success: true,
          message: `Found working connection with ${hostname}`,
          data: {
            workingHostname: hostname,
            workingUrl: testUrl,
            userCount,
            allTests: connectionTests,
            timestamp: new Date().toISOString()
          }
        })

      } catch (error) {
        connectionTests.push({
          hostname,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // If no connection worked, return all results
    return NextResponse.json({
      success: false,
      message: 'All hostname variations failed',
      data: {
        password: password,
        connectionTests,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('General error:', error)
    return NextResponse.json({
      success: false,
      error: 'General error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
