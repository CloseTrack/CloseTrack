import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PremiumClientPortal from '@/components/client/PremiumClientPortal'

export default async function ClientPortalPage() {
  const user = await requireAuth()

  // Fetch client's transactions
  const transactions = await prisma.transaction.findMany({
    where: {
      participants: {
        some: {
          userId: user.id
        }
      }
    },
    include: {
      agent: {
        select: {
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
          fileName: true,
          fileUrl: true,
          fileSize: true,
          createdAt: true,
          isSigned: true,
          signedAt: true
        }
      },
      deadlines: {
        select: {
          id: true,
          title: true,
          description: true,
          dueDate: true,
          isCompleted: true,
          completedAt: true
        }
      },
      activities: {
        select: {
          id: true,
          type: true,
          description: true,
          createdAt: true,
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
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  return (
    <PremiumClientPortal transactions={transactions} user={user} />
  )
}
