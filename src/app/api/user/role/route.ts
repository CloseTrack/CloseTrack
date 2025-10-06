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
      
      try {
        // Try to create with clerkId
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || 'user@example.com',
            firstName: clerkUser.firstName || 'User',
            lastName: clerkUser.lastName || 'Name',
            role: role as UserRole
          }
        })
        console.log('Created user with clerkId:', user.email)
      } catch (createError) {
        console.log('Failed to create with clerkId, trying without:', createError)
        
        try {
          // Try to create without clerkId (in case the field doesn't exist)
          user = await prisma.user.create({
            data: {
              email: clerkUser.emailAddresses[0]?.emailAddress || 'user@example.com',
              firstName: clerkUser.firstName || 'User',
              lastName: clerkUser.lastName || 'Name',
              role: role as UserRole
            }
          })
          console.log('Created user without clerkId:', user.email)
        } catch (createError2) {
          console.error('Error creating user:', createError2)
          return NextResponse.json({ 
            error: 'Failed to create user in database',
            message: createError2 instanceof Error ? createError2.message : 'Unknown error'
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