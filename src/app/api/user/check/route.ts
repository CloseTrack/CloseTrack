import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user data from Clerk
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return NextResponse.json({ 
        error: 'Unable to get user data from Clerk',
        message: 'Please try signing in again'
      }, { status: 400 })
    }

    // First, let's check what columns exist in the user_profiles table
    let tableInfo = null
    try {
      // This will show us the actual table structure
      const result = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        ORDER BY ordinal_position;
      `
      tableInfo = result
    } catch (error) {
      console.error('Error getting table info:', error)
    }

    // Try to find user with different field names
    let dbUser = null
    let searchMethod = 'none'
    
    try {
      // Try with clerkId
      dbUser = await prisma.user.findUnique({
        where: { clerkId: userId }
      })
      searchMethod = 'clerkId'
    } catch (error) {
      console.log('clerkId search failed:', error)
      
      try {
        // Try with id (if clerkId is stored as id)
        dbUser = await prisma.user.findFirst({
          where: { 
            OR: [
              { clerkId: userId },
              { id: userId }
            ]
          }
        })
        searchMethod = 'id_or_clerkId'
      } catch (error2) {
        console.log('id search failed:', error2)
        
        try {
          // Try with email
          dbUser = await prisma.user.findUnique({
            where: { email: clerkUser.emailAddresses[0]?.emailAddress || '' }
          })
          searchMethod = 'email'
        } catch (error3) {
          console.log('email search failed:', error3)
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        clerkUserId: userId,
        clerkUser: {
          email: clerkUser.emailAddresses[0]?.emailAddress,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName
        },
        tableInfo: tableInfo,
        dbUser: dbUser ? {
          id: dbUser.id,
          email: dbUser.email,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          role: dbUser.role,
          clerkId: dbUser.clerkId
        } : null,
        userExistsInDb: !!dbUser,
        searchMethod: searchMethod
      }
    })
  } catch (error) {
    console.error('User check error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check user',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}