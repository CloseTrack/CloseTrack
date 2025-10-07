import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return NextResponse.json({ error: 'No Clerk user' }, { status: 400 })
    }

    const userEmail = clerkUser.emailAddresses[0]?.emailAddress || `user-${userId}@closetrack.app`
    const userFirstName = clerkUser.firstName || 'User'
    const userLastName = clerkUser.lastName || 'Name'
    const testRole = 'real_estate_agent'

    // Test 1: Try raw SQL with explicit cast
    let test1Result = null
    let test1Error = null
    try {
      test1Result = await prisma.$queryRaw<any[]>`
        INSERT INTO user_profiles (id, "clerkId", email, "firstName", "lastName", role)
        VALUES (
          gen_random_uuid()::text,
          ${userId},
          ${userEmail},
          ${userFirstName},
          ${userLastName},
          ${testRole}::"UserRole"
        )
        RETURNING *
      `
    } catch (error) {
      test1Error = error instanceof Error ? error.message : String(error)
    }

    // Test 2: Try Prisma create
    let test2Result = null
    let test2Error = null
    try {
      // First check if user already exists
      const existing = await prisma.user.findUnique({
        where: { email: userEmail }
      })
      
      if (existing) {
        test2Result = { message: 'User already exists', user: existing }
      } else {
        test2Result = await prisma.user.create({
          data: {
            clerkId: userId,
            email: userEmail,
            firstName: userFirstName,
            lastName: userLastName,
            role: testRole as any
          }
        })
      }
    } catch (error) {
      test2Error = error instanceof Error ? error.message : String(error)
    }

    // Test 3: Check what's in the database now
    const dbUsers = await prisma.$queryRaw<any[]>`
      SELECT id, "clerkId", email, "firstName", "lastName", role
      FROM user_profiles
      WHERE email = ${userEmail}
      LIMIT 5
    `

    return NextResponse.json({
      success: true,
      clerkUserId: userId,
      clerkEmail: userEmail,
      tests: {
        test1_rawSql: {
          success: !test1Error,
          result: test1Result,
          error: test1Error
        },
        test2_prismaCreate: {
          success: !test2Error,
          result: test2Result,
          error: test2Error
        },
        test3_dbUsers: dbUsers
      }
    })
  } catch (error) {
    console.error('Test user creation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

