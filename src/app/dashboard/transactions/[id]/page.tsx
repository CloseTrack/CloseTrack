import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import TransactionDetails from '@/components/transactions/TransactionDetails'

interface TransactionPageProps {
  params: {
    id: string
  }
}

export default async function TransactionPage({ params }: TransactionPageProps) {
  const user = await requireAuth()

  const transaction = await prisma.transaction.findUnique({
    where: {
      id: params.id,
      // Ensure user has access to this transaction
      OR: [
        { agentId: user.id },
        {
          participants: {
            some: {
              userId: user.id
            }
          }
        }
      ]
    },
    include: {
      agent: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true
        }
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              role: true
            }
          }
        }
      },
      documents: {
        include: {
          uploadedBy: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      deadlines: {
        include: {
        completedBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
        },
        orderBy: {
          dueDate: 'asc'
        }
      },
      checklists: {
        include: {
        completedBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
        },
        orderBy: {
          order: 'asc'
        }
      },
      activities: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!transaction) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <TransactionDetails transaction={transaction} user={user} />
    </div>
  )
}
