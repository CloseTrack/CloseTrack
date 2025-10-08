import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import PremiumTransactionList from '@/components/transactions/PremiumTransactionList'

export default async function TransactionsPage() {
  const user = await requireAuth()

  // Fetch transactions based on user role
  const transactions = await prisma.transaction.findMany({
    where: {
      ...(user.role === UserRole.real_estate_agent && { agentId: user.id }),
      ...(user.role === UserRole.real_estate_agent && {
        agent: {
          // For now, agents can only see their own transactions
          // Broker functionality would need additional implementation
        }
      }),
      ...(user.role === UserRole.title_insurance_agent && {
        participants: {
          some: {
            userId: user.id
          }
        }
      }),
      ...(user.role === UserRole.buyer && {
        participants: {
          some: {
            userId: user.id
          }
        }
      }),
      ...(user.role === UserRole.seller && {
        participants: {
          some: {
            userId: user.id
          }
        }
      })
    },
    include: {
      agent: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      },
      participants: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              role: true
            }
          }
        }
      },
      documents: {
        select: {
          id: true,
          title: true,
          type: true,
          createdAt: true
        }
      },
      deadlines: {
        select: {
          id: true,
          title: true,
          dueDate: true,
          isCompleted: true,
        }
      },
      activities: {
        select: {
          id: true,
          type: true,
          description: true,
          createdAt: true
        }
      },
      _count: {
        select: {
          activities: true,
          documents: true
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  return (
    <PremiumTransactionList transactions={transactions} userRole={user.role} />
  )
}
