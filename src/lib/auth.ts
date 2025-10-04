import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'

export async function getCurrentUser() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

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
