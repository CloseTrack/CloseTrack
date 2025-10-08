import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import TransactionList from '@/components/transactions/TransactionList'
import TransactionFilters from '@/components/transactions/TransactionFilters'

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
          lastName: true
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
        where: {
          isCompleted: false
        },
        select: {
          id: true,
          title: true,
          dueDate: true,
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-2">
            Manage your real estate transactions and track progress
          </p>
        </div>
        <button className="btn-primary">
          Create Transaction
        </button>
      </div>

      <TransactionFilters />
      <TransactionList transactions={transactions} userRole={user.role} />
    </div>
  )
}
