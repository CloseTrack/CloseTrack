import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { role } = await request.json()
    
    if (!role || !Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Get user data from Clerk
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return NextResponse.json({ 
        error: 'Unable to get user data from Clerk',
        message: 'Please try signing in again'
      }, { status: 400 })
    }

    // Try different approaches to find/create user
    let user = null
    
    try {
      // First try to find by clerkId
      user = await prisma.user.findUnique({
        where: { clerkId: userId }
      })
    } catch (error) {
      console.log('clerkId search failed, trying email:', error)
      
      try {
        // Try to find by email
        user = await prisma.user.findUnique({
          where: { email: clerkUser.emailAddresses[0]?.emailAddress || '' }
        })
      } catch (error2) {
        console.log('email search failed:', error2)
      }
    }

    // If user doesn't exist, create them
    if (!user) {
      console.log('User not found in database, creating new user...')
      
      const userEmail = clerkUser.emailAddresses[0]?.emailAddress || `user-${userId}@closetrack.app`
      const userFirstName = clerkUser.firstName || 'User'
      const userLastName = clerkUser.lastName || 'Name'
      
      try {
        // Try to create with Prisma first
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            email: userEmail,
            firstName: userFirstName,
            lastName: userLastName,
            role: role as UserRole
          }
        })
        console.log('Created user with Prisma:', user.email)
      } catch (createError) {
        console.log('Prisma create failed, trying raw SQL:', createError)
        
        try {
          // Fallback to raw SQL
          const result = await prisma.$queryRaw<any[]>`
            INSERT INTO user_profiles (id, "clerkId", email, "firstName", "lastName", role)
            VALUES (
              gen_random_uuid()::text,
              ${userId},
              ${userEmail},
              ${userFirstName},
              ${userLastName},
              ${role}::"UserRole"
            )
            RETURNING *
          `
          
          if (result && result.length > 0) {
            user = result[0]
            console.log('Created user with raw SQL:', user.email)
          } else {
            throw new Error('No user returned from raw SQL insert')
          }
        } catch (rawSqlError) {
          console.error('Error creating user with raw SQL:', rawSqlError)
          return NextResponse.json({ 
            error: 'Failed to create user in database',
            message: rawSqlError instanceof Error ? rawSqlError.message : 'Unknown error',
            details: {
              prismaError: createError instanceof Error ? createError.message : 'Unknown',
              rawSqlError: rawSqlError instanceof Error ? rawSqlError.message : 'Unknown'
            }
          }, { status: 500 })
        }
      }
    } else {
      console.log('User found in database, updating role...')
      // Update existing user's role
      try {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { role: role as UserRole }
        })
        console.log('Updated user role:', user.role)
      } catch (updateError) {
        console.error('Error updating user role:', updateError)
        return NextResponse.json({ 
          error: 'Failed to update user role',
          message: updateError instanceof Error ? updateError.message : 'Unknown error'
        }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        clerkId: user.clerkId
      },
      message: 'Role updated successfully' 
    })
  } catch (error) {
    console.error('Role update error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to update role',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}