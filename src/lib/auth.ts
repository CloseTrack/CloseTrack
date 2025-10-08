import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

export type AuthUser = {
  id: string
  clerkId: string | null
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  role: UserRole
  companyName: string | null
  licenseNumber: string | null
  profileImageUrl: string | null
  isActive: boolean
  subscriptionId: string | null
  subscriptionStatus: string | null
  stripeCustomerId: string | null
  createdAt: Date | null
  updatedAt: Date | null
  isTemporary?: boolean
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return null
    }

    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not available, returning temporary user')
      const clerkUser = await currentUser()
      if (clerkUser) {
        return {
          id: 'temp-' + userId,
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName || 'User',
          lastName: clerkUser.lastName || 'Name',
          phone: null,
          role: UserRole.agent,
          companyName: null,
          licenseNumber: null,
          profileImageUrl: null,
          isActive: true,
          subscriptionId: null,
          subscriptionStatus: null,
          stripeCustomerId: null,
          createdAt: null,
          updatedAt: null,
          isTemporary: true
        }
      }
      return null
    }

    // First try to find user in database
    let user = null
    try {
      user = await prisma.user.findUnique({
        where: { clerkId: userId }
      })
      console.log('User found by clerkId:', user ? 'Yes' : 'No')
      
      // If not found by clerkId, try by email
      if (!user) {
        const clerkUser = await currentUser()
        if (clerkUser?.emailAddresses[0]?.emailAddress) {
          user = await prisma.user.findUnique({
            where: { email: clerkUser.emailAddresses[0].emailAddress }
          })
          console.log('User found by email:', user ? 'Yes' : 'No')
          
          // If found by email but not clerkId, update the clerkId
          if (user && !user.clerkId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { clerkId: userId }
            })
            console.log('Updated user with clerkId')
          }
        }
      }
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
          phone: null,
          role: UserRole.agent,
          companyName: null,
          licenseNumber: null,
          profileImageUrl: null,
          isActive: true,
          subscriptionId: null,
          subscriptionStatus: null,
          stripeCustomerId: null,
          createdAt: null,
          updatedAt: null,
          isTemporary: true
        }
      }
      return null
    }

    // If user doesn't exist in database, create them
    if (!user) {
      console.log('User not found in database, creating new user...')
      const clerkUser = await currentUser()
      
      if (clerkUser) {
        try {
          user = await prisma.user.create({
            data: {
              clerkId: userId,
              email: clerkUser.emailAddresses[0]?.emailAddress || '',
              firstName: clerkUser.firstName || 'User',
              lastName: clerkUser.lastName || 'Name',
              role: UserRole.agent,
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
            phone: null,
            role: UserRole.agent,
            companyName: null,
            licenseNumber: null,
            profileImageUrl: null,
            isActive: true,
            subscriptionId: null,
            subscriptionStatus: null,
            stripeCustomerId: null,
            createdAt: null,
            updatedAt: null,
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

export async function requireAuth(): Promise<AuthUser> {
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

export async function requireRole(role: UserRole): Promise<AuthUser> {
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

export async function requireRoles(roles: UserRole[]): Promise<AuthUser> {
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
