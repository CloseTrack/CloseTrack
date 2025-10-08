import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PremiumDashboardOverview from '@/components/dashboard/PremiumDashboardOverview'
import { formatCurrency } from '@/lib/utils'

export default async function DashboardPage() {
  try {
    const user = await requireAuth()

    // Check if user is temporary (database connection issue)
    if ((user as any).isTemporary) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome, {user.firstName || 'User'} {user.lastName || 'Name'}! Your role is {user.role}.
          </p>
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
            <p className="font-semibold">Temporary User Mode:</p>
            <p>This user object is temporary because the database could not be reached or the user was not found. Please ensure your DATABASE_URL is correct and the database is accessible.</p>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h2 className="text-xl font-semibold text-blue-800">Authentication Successful!</h2>
            <p className="text-blue-700">
              You have successfully authenticated with Clerk and accessed a protected route.
            </p>
            <p className="text-blue-700 mt-2">
              If you are seeing this, your Clerk setup is likely correct.
            </p>
            <p className="text-blue-700 mt-2">
              If you were expecting to see the full dashboard, there might still be an issue with your database connection or user data synchronization.
            </p>
          </div>
        </div>
      )
    }

    // Fetch dashboard data based on user role with safe defaults
    let activeTransactions = 0
    let totalRevenue: any = { _sum: { salePrice: null } }
    let upcomingDeadlines = 0
    let recentActivities: any[] = []

    try {
      const results = await Promise.all([
        prisma.transaction.count({
          where: {
            agentId: user.id,
            status: {
              not: 'CLOSED'
            }
          }
        }).catch(() => 0),
        prisma.transaction.aggregate({
          where: {
            agentId: user.id,
            status: 'CLOSED'
          },
          _sum: {
            salePrice: true
          }
        }).catch(() => ({ _sum: { salePrice: null } })),
        prisma.deadline.count({
          where: {
            transaction: {
              agentId: user.id
            },
            isCompleted: false,
            dueDate: {
              gte: new Date()
            }
          }
        }).catch(() => 0),
        prisma.activity.findMany({
          where: {
            transaction: {
              agentId: user.id
            }
          },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            transaction: {
              select: {
                title: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }).catch(() => [])
      ])
      
      activeTransactions = results[0] as number
      totalRevenue = results[1]
      upcomingDeadlines = results[2] as number
      recentActivities = results[3] as any[]
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Continue with default values
    }

    return (
      <PremiumDashboardOverview
        data={{
          activeTransactions,
          totalRevenue: Number(totalRevenue._sum.salePrice) || 0,
          upcomingDeadlines,
          recentActivities: recentActivities.map(activity => ({
            id: activity.id,
            type: activity.type,
            title: activity.transaction.title,
            description: activity.description,
            createdAt: activity.createdAt,
            transaction: {
              id: activity.transaction.title, // Using title as ID for now
              title: activity.transaction.title
            },
            user: {
              firstName: activity.user.firstName,
              lastName: activity.user.lastName
            }
          }))
        }}
        user={user}
      />
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-red-900">Error</h1>
        <p className="mt-2 text-red-600">
          There was an error loading the dashboard: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">
            This error suggests there might be an issue with the database connection or user authentication.
            Please check the console for more details.
          </p>
        </div>
      </div>
    )
  }
}