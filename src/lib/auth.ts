import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

export async function getCurrentUser() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return null
    }

    // First try to find user in database
    let user = null
    try {
      user = await prisma.user.findUnique({
        where: { clerkId: userId }
      })
    } catch (dbError) {
      console.error('Database error in getCurrentUser:', dbError)
      // If database is down, return a minimal user object
      const clerkUser = await currentUser()
      if (clerkUser) {
        return {
          id: 'temp-' + userId,
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName || 'User',
          lastName: clerkUser.lastName || 'Name',
          role: UserRole.real_estate_agent,
          isTemporary: true
        }
      }
      return null
    }

    // If user doesn't exist in database, create them
    if (!user) {
      const clerkUser = await currentUser()
      
      if (clerkUser) {
        try {
          user = await prisma.user.create({
            data: {
              clerkId: userId,
              email: clerkUser.emailAddresses[0]?.emailAddress || '',
              firstName: clerkUser.firstName || 'User',
              lastName: clerkUser.lastName || 'Name',
              role: UserRole.real_estate_agent,
            },
          })
          console.log('Created user in database:', user.email)
        } catch (createError) {
          console.error('Error creating user:', createError)
          // Return temporary user if database creation fails
          return {
            id: 'temp-' + userId,
            clerkId: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            firstName: clerkUser.firstName || 'User',
            lastName: clerkUser.lastName || 'Name',
            role: UserRole.real_estate_agent,
            isTemporary: true
          }
        }
      }
    }

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAuth() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      redirect('/sign-in')
    }

    const user = await getCurrentUser()
    
    if (!user) {
      console.error('No user found after authentication')
      redirect('/sign-in')
    }

    return user
  } catch (error) {
    console.error('Error in requireAuth:', error)
    redirect('/sign-in')
  }
}

export async function requireRole(role: string) {
  try {
    const user = await requireAuth()
    
    if (user.role !== role) {
      redirect('/dashboard')
    }

    return user
  } catch (error) {
    console.error('Error in requireRole:', error)
    redirect('/sign-in')
  }
}

export async function requireRoles(roles: string[]) {
  try {
    const user = await requireAuth()
    
    if (!roles.includes(user.role)) {
      redirect('/dashboard')
    }

    return user
  } catch (error) {
    console.error('Error in requireRoles:', error)
    redirect('/sign-in')
  }
}
