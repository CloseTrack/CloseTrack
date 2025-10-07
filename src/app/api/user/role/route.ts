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

    // Try different approaches to find user
    let user = null
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress
    
    if (!userEmail) {
      return NextResponse.json({ 
        error: 'No email found',
        message: 'Unable to get email from Clerk account'
      }, { status: 400 })
    }
    
    try {
      // First try to find by clerkId
      user = await prisma.user.findUnique({
        where: { clerkId: userId }
      })
      console.log('Found by clerkId:', !!user)
    } catch (error) {
      console.log('clerkId search failed, trying email:', error)
    }
    
    // If not found by clerkId, try email
    if (!user) {
      try {
        user = await prisma.user.findUnique({
          where: { email: userEmail }
        })
        console.log('Found by email:', !!user)
      } catch (error2) {
        console.log('email search failed:', error2)
      }
    }

    // If user doesn't exist, create them; if exists, just update role
    if (!user) {
      console.log('User not found in database, creating new user...')
      
      const userFirstName = clerkUser.firstName || 'User'
      const userLastName = clerkUser.lastName || 'Name'
      
      try {
        // Use upsert to handle duplicate email gracefully
        user = await prisma.user.upsert({
          where: { email: userEmail },
          update: {
            clerkId: userId,
            firstName: userFirstName,
            lastName: userLastName,
            role: role as UserRole
          },
          create: {
            clerkId: userId,
            email: userEmail,
            firstName: userFirstName,
            lastName: userLastName,
            role: role as UserRole
          }
        })
        console.log('Upserted user with Prisma:', user.email)
      } catch (upsertError) {
        console.log('Prisma upsert failed, trying raw SQL:', upsertError)
        
        try {
          // Fallback to raw SQL with ON CONFLICT
          const result = await prisma.$queryRaw<any[]>`
            INSERT INTO user_profiles (id, "clerkId", email, "firstName", "lastName", role)
            VALUES (
              gen_random_uuid()::text,
              ${userId},
              ${userEmail},
              ${clerkUser.firstName || 'User'},
              ${clerkUser.lastName || 'Name'},
              ${role}::"UserRole"
            )
            ON CONFLICT (email) 
            DO UPDATE SET
              "clerkId" = ${userId},
              "firstName" = ${clerkUser.firstName || 'User'},
              "lastName" = ${clerkUser.lastName || 'Name'},
              role = ${role}::"UserRole",
              "updatedAt" = NOW()
            RETURNING *
          `
          
          if (result && result.length > 0) {
            user = result[0]
            console.log('Upserted user with raw SQL:', user.email)
          } else {
            throw new Error('No user returned from raw SQL upsert')
          }
        } catch (rawSqlError) {
          console.error('Error upserting user with raw SQL:', rawSqlError)
          return NextResponse.json({ 
            error: 'Failed to create or update user in database',
            message: rawSqlError instanceof Error ? rawSqlError.message : 'Unknown error',
            details: {
              prismaError: upsertError instanceof Error ? upsertError.message : 'Unknown',
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