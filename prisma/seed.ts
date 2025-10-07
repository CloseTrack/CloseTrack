import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@closetrack.app' },
    update: {},
    create: {
      email: 'demo@closetrack.app',
      firstName: 'Demo',
      lastName: 'Agent',
      role: UserRole.real_estate_agent,
      phone: '+1 (555) 123-4567',
      companyName: 'Prime Realty Group',
      licenseNumber: 'NJ12345678',
      isActive: true
    }
  })

  console.log('Created demo user:', demoUser.email)

  // Create sample transactions
  const transactions = [
    {
      title: '123 Main Street, Edison NJ',
      description: 'Beautiful 4BR colonial in desirable neighborhood',
      propertyAddress: '123 Main Street',
      propertyCity: 'Edison',
      propertyState: 'NJ',
      propertyZip: '08820',
      status: 'UNDER_CONTRACT',
      listingPrice: 575000,
      salePrice: 560000,
      commission: 3.0,
      contractDate: new Date('2024-01-15'),
      closingDate: new Date('2024-03-01'),
      inspectionDate: new Date('2024-01-25'),
      appraisalDate: new Date('2024-02-05'),
      agentId: demoUser.id
    },
    {
      title: '456 Oak Avenue, Somerset NJ',
      description: 'Luxury townhome with modern upgrades',
      propertyAddress: '456 Oak Avenue',
      propertyCity: 'Somerset',
      propertyState: 'NJ',
      propertyZip: '08873',
      status: 'CLOSED',
      listingPrice: 425000,
      salePrice: 425000,
      commission: 2.5,
      contractDate: new Date('2023-11-01'),
      closingDate: new Date('2023-12-15'),
      agentId: demoUser.id
    },
    {
      title: '789 Pine Lane, New Brunswick NJ',
      description: 'Charming ranch-style home with large yard',
      propertyAddress: '789 Pine Lane',
      propertyCity: 'New Brunswick',
      propertyState: 'NJ',
      propertyZip: '08901',
      status: 'INSPECTION',
      listingPrice: 385000,
      salePrice: 375000,
      commission: 3.0,
      contractDate: new Date('2024-01-20'),
      closingDate: new Date('2024-03-15'),
      inspectionDate: new Date('2024-02-01'),
      agentId: demoUser.id
    },
    {
      title: '321 Maple Drive, Piscataway NJ',
      description: 'Move-in ready home with updated kitchen',
      propertyAddress: '321 Maple Drive',
      propertyCity: 'Piscataway',
      propertyState: 'NJ',
      propertyZip: '08854',
      status: 'DRAFT',
      listingPrice: 495000,
      agentId: demoUser.id
    }
  ]

  for (const transactionData of transactions) {
    const transaction = await prisma.transaction.create({
      data: transactionData
    })
    console.log('Created transaction:', transaction.title)

    // Create deadlines for active transactions
    if (transaction.status !== 'DRAFT' && transaction.status !== 'CLOSED') {
      await prisma.deadline.create({
        data: {
          transactionId: transaction.id,
          title: 'Home Inspection',
          description: 'Schedule and complete home inspection',
          dueDate: transaction.inspectionDate || new Date(),
          isCompleted: transaction.status === 'CLOSED',
          isCritical: true
        }
      })

      await prisma.deadline.create({
        data: {
          transactionId: transaction.id,
          title: 'Appraisal',
          description: 'Property appraisal appointment',
          dueDate: transaction.appraisalDate || new Date(),
          isCompleted: false,
          isCritical: true
        }
      })

      await prisma.deadline.create({
        data: {
          transactionId: transaction.id,
          title: 'Final Walkthrough',
          description: 'Buyer final walkthrough before closing',
          dueDate: new Date(transaction.closingDate || new Date()),
          isCompleted: false,
          isCritical: true
        }
      })
    }

    // Create activity for each transaction
    await prisma.activity.create({
      data: {
        transactionId: transaction.id,
        userId: demoUser.id,
        type: 'status_change',
        title: `Transaction Status: ${transaction.status}`,
        description: `Transaction status updated to ${transaction.status}`
      }
    })
  }

  // Create notifications
  await prisma.notification.create({
    data: {
      userId: demoUser.id,
      type: 'DEADLINE',
      title: 'Upcoming Deadline',
      message: 'Home inspection for 123 Main Street is scheduled for tomorrow',
      isRead: false
    }
  })

  await prisma.notification.create({
    data: {
      userId: demoUser.id,
      type: 'STATUS_UPDATE',
      title: 'Transaction Update',
      message: '789 Pine Lane has moved to inspection phase',
      isRead: false
    }
  })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

