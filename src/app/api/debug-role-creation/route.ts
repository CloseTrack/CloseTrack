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
    
    // Check database schema
    const schemaCheck = await prisma.$queryRaw<any[]>`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'user_profiles' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `

    // Check if user exists
    let userExists = null
    try {
      userExists = await prisma.user.findUnique({
        where: { clerkId: userId }
      })
    } catch (error) {
      console.error('Error finding user:', error)
    }

    // Try a simple create to see what error we get
    let testCreateError = null
    try {
      await prisma.$queryRaw`
        INSERT INTO user_profiles (id, email, role)
        VALUES (gen_random_uuid()::text, 'test@example.com', 'agent'::public."UserRole")
        ON CONFLICT (email) DO NOTHING
      `
    } catch (error) {
      testCreateError = error instanceof Error ? error.message : 'Unknown error'
    }

    return NextResponse.json({
      success: true,
      data: {
        clerkUserId: userId,
        clerkEmail: clerkUser?.emailAddresses[0]?.emailAddress,
        userExistsInDb: !!userExists,
        dbUser: userExists,
        schemaColumns: schemaCheck.map(col => ({
          name: col.column_name,
          type: col.data_type,
          nullable: col.is_nullable,
          default: col.column_default
        })),
        testCreateError
      }
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

