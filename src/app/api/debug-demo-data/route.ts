import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check if demo users exist
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: ['agent@closetrack.app', 'broker@closetrack.app', 'title@closetrack.app']
        }
      },
      include: {
        transactions: {
          include: {
            activities: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        transactionCount: user.transactions.length,
        activityCount: user.transactions.reduce((acc, t) => acc + t.activities.length, 0)
      }))
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
