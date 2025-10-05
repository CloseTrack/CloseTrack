import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import TeamOverview from '@/components/broker/TeamOverview'
import TeamAnalytics from '@/components/broker/TeamAnalytics'

export default async function TeamPage() {
  const broker = await requireRole('real_estate_agent')

  // Fetch team data
  const [
    agents,
    teamTransactions,
    teamRevenue,
    complianceStats
  ] = await Promise.all([
    // Get all agents (this would need proper broker-agent relationship in real implementation)
    prisma.user.findMany({
      where: {
        role: 'real_estate_agent',
        isActive: true
      },
      include: {
        _count: {
          select: {
            transactions: true
          }
        }
      }
    }),
    prisma.transaction.findMany({
      where: {
        agent: {
          role: 'real_estate_agent'
        }
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
    }),
    prisma.transaction.aggregate({
      where: {
        agent: {
          role: 'real_estate_agent'
        },
        status: 'CLOSED'
      },
      _sum: {
        salePrice: true
      }
    }),
    prisma.deadline.groupBy({
      by: ['isCompleted'],
      where: {
        transaction: {
          agent: {
            role: 'real_estate_agent'
          }
        }
      },
      _count: {
        isCompleted: true
      }
    })
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
