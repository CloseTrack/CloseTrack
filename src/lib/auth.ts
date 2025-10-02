import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'

export async function getCurrentUser() {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })

  return user
}

export async function requireAuth() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  return user
}

export async function requireRole(role: string) {
  const user = await requireAuth()
  
  if (user.role !== role) {
    redirect('/dashboard')
  }

  return user
}

export async function requireRoles(roles: string[]) {
  const user = await requireAuth()
  
  if (!roles.includes(user.role)) {
    redirect('/dashboard')
  }

  return user
}
