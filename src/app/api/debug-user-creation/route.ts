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

    const debugInfo: any = {
      clerkUserId: userId,
      clerkUser: {
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName
      }
    }

    // Check database connection
    try {
      await prisma.$connect()
      debugInfo.databaseConnection = 'Connected'
    } catch (error) {
      debugInfo.databaseConnection = `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      return NextResponse.json({ success: false, debugInfo })
    }

    // Check table structure
    try {
      const tableInfo = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        ORDER BY ordinal_position;
      `
      debugInfo.tableStructure = tableInfo
    } catch (error) {
      debugInfo.tableStructure = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    // Check if table exists
    try {
      const tableExists = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'user_profiles'
        );
      `
      debugInfo.tableExists = tableExists
    } catch (error) {
      debugInfo.tableExists = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    // Try to count users
    try {
      const userCount = await prisma.user.count()
      debugInfo.userCount = userCount
    } catch (error) {
      debugInfo.userCount = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    // Try to find user by different methods
    const searchMethods = []
    
    try {
      const userByClerkId = await prisma.user.findUnique({
        where: { clerkId: userId }
      })
      searchMethods.push({ method: 'clerkId', found: !!userByClerkId, user: userByClerkId })
    } catch (error) {
      searchMethods.push({ method: 'clerkId', error: error instanceof Error ? error.message : 'Unknown error' })
    }

    try {
      const userByEmail = await prisma.user.findUnique({
        where: { email: clerkUser.emailAddresses[0]?.emailAddress || '' }
      })
      searchMethods.push({ method: 'email', found: !!userByEmail, user: userByEmail })
    } catch (error) {
      searchMethods.push({ method: 'email', error: error instanceof Error ? error.message : 'Unknown error' })
    }

    debugInfo.searchMethods = searchMethods

    // Try to create a test user to see what happens
    try {
      const testUser = await prisma.user.create({
        data: {
          email: `test-${Date.now()}@example.com`,
          firstName: 'Test',
          lastName: 'User',
          role: 'agent'
        }
      })
      debugInfo.testUserCreation = { success: true, user: testUser }
      
      // Clean up test user
      await prisma.user.delete({
        where: { id: testUser.id }
      })
    } catch (error) {
      debugInfo.testUserCreation = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }

    return NextResponse.json({
      success: true,
      debugInfo
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to debug',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
