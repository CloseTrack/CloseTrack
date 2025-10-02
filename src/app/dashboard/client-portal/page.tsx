import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ClientPortal from '@/components/client/ClientPortal'

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
          firstName: true
          lastName: true
          email: true
          phone: true
        }
      },
      participants: {
        include: {
          user: {
            select: {
              firstName: true
              lastName: true
              role: true
            }
          }
        }
      },
      documents: {
        where: {
          // Only show documents client should see
          type: {
            in: ['CONTRACT', 'INSPECTION_REPORT', 'APPRAISAL', 'CLOSING_DOCUMENT']
          }
        },
        select: {
          id: true
          title: true
          type: true
          fileName: true
          createdAt: true
          isSigned: true
        }
      },
      deadlines: {
        where: {
          // Only show deadlines relevant to client
          title: {
            contains: 'client'
          }
        },
        select: {
          id: true
          title: true
          dueDate: true
          isCompleted: true
          isCritical: true
        }
      },
      activities: {
        where: {
          // Only show client-relevant activities
          type: {
            in: ['status_change', 'document_upload', 'note']
          }
        },
        select: {
          id: true
          type: true
          title: true
          description: true
          createdAt: true
          user: {
            select: {
              firstName: true
              lastName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  return (
    <div className="space-y-6">
      <ClientPortal transactions={transactions} user={user} />
    </div>
  )
}
