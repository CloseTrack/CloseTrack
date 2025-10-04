import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import TransactionList from '@/components/transactions/TransactionList'
import TransactionFilters from '@/components/transactions/TransactionFilters'

export default async function TransactionsPage() {
  const user = await requireAuth()

  // Fetch transactions based on user role
  const transactions = await prisma.transaction.findMany({
    where: {
      ...(user.role === 'real_estate_agent' && { agentId: user.id }),
      ...(user.role === 'BROKER' && {
        agent: {
          // Broker can see all transactions from their agents
          // This would need to be implemented based on your broker-agent relationship
        }
      }),
      ...(user.role === 'TITLE_COMPANY' && {
        participants: {
          some: {
            userId: user.id
          }
        }
      }),
      ...(user.role === 'CLIENT' && {
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
          isCritical: true
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
