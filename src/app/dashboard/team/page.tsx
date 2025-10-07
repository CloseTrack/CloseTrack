import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import TeamOverview from '@/components/broker/TeamOverview'
import TeamAnalytics from '@/components/broker/TeamAnalytics'

export default async function TeamPage() {
  const user = await requireRole('real_estate_agent')

  // For now, only show the current user's own data
  // In a full implementation, this would show team members under a broker
  const [
    agents,
    teamTransactions,
    teamRevenue,
    complianceStats
  ] = await Promise.all([
    // Only show current user
    Promise.resolve([user]),
    // Only get current user's transactions
    prisma.transaction.findMany({
      where: {
        agentId: user.id
      },
      include: {
        agent: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    }).catch(() => []),
    prisma.transaction.aggregate({
      where: {
        agentId: user.id,
        status: 'CLOSED'
      },
      _sum: {
        salePrice: true
      }
    }).catch(() => ({ _sum: { salePrice: null } })),
    prisma.deadline.groupBy({
      by: ['isCompleted'],
      where: {
        transaction: {
          agentId: user.id
        }
      },
      _count: {
        isCompleted: true
      }
    }).catch(() => [])
  ])

  const teamData = {
    agents,
    transactions: teamTransactions,
    totalRevenue: teamRevenue._sum.salePrice || 0,
    complianceRate: complianceStats.find(stat => stat.isCompleted)?._count.isCompleted || 0
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
        <p className="text-gray-600 mt-2">
          Oversee your team's performance and ensure compliance across all transactions.
        </p>
      </div>

      <TeamOverview data={teamData} />
      <TeamAnalytics data={teamData} />
    </div>
  )
}
