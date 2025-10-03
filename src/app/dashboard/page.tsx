import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DashboardOverview from '@/components/dashboard/DashboardOverview'
import { formatCurrency } from '@/lib/utils'

export default async function DashboardPage() {
  const user = await requireAuth()

  // Fetch dashboard data based on user role
  const [
    activeTransactions,
    totalRevenue,
    upcomingDeadlines,
    recentActivities
  ] = await Promise.all([
    prisma.transaction.count({
      where: {
        agentId: user.id,
        status: {
          not: 'CLOSED'
        }
      }
    }),
    prisma.transaction.aggregate({
      where: {
        agentId: user.id,
        status: 'CLOSED'
      },
      _sum: {
        salePrice: true
      }
    }),
    prisma.deadline.count({
      where: {
        transaction: {
          agentId: user.id
        },
        isCompleted: false,
        dueDate: {
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
        }
      }
    }),
    prisma.activity.findMany({
      where: {
        transaction: {
          agentId: user.id
        }
      },
      include: {
        transaction: true,
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })
  ])

  const dashboardData = {
    activeTransactions,
    totalRevenue: totalRevenue._sum.salePrice || 0,
    upcomingDeadlines,
    recentActivities
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your transactions today.
        </p>
      </div>

      <DashboardOverview data={dashboardData} userRole={user.role} />
    </div>
  )
}
