import { PrismaClient, UserRole } from '@prisma/client'
import * as dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // ========================================
  // 1. CREATE DEMO USERS FOR EACH ROLE
  // ========================================
  
  console.log('\n📝 Creating demo users...')
  
  // Real Estate Agent Demo Account
  const agentDemo = await prisma.user.upsert({
    where: { email: 'agent@closetrack.app' },
    update: {},
    create: {
      email: 'agent@closetrack.app',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: UserRole.agent,
      phone: '+1 (555) 123-4567',
      companyName: 'Prime Realty Group',
      licenseNumber: 'NJ12345678',
      isActive: true
    }
  })
  console.log('✅ Created Real Estate Agent:', agentDemo.email)

  // Broker Demo Account
  const brokerDemo = await prisma.user.upsert({
    where: { email: 'broker@closetrack.app' },
    update: {},
    create: {
      email: 'broker@closetrack.app',
      firstName: 'Michael',
      lastName: 'Chen',
      role: UserRole.broker,
      phone: '+1 (555) 234-5678',
      companyName: 'Elite Realty Group',
      licenseNumber: 'NJ-BR-87654',
      isActive: true
    }
  })
  console.log('✅ Created Broker:', brokerDemo.email)

  // Title Company Demo Account
  const titleDemo = await prisma.user.upsert({
    where: { email: 'title@closetrack.app' },
    update: {},
    create: {
      email: 'title@closetrack.app',
      firstName: 'Robert',
      lastName: 'Williams',
      role: UserRole.title_company,
      phone: '+1 (555) 456-7890',
      companyName: 'Secure Title Insurance Co.',
      licenseNumber: 'TI-NJ-98765',
      isActive: true
    }
  })
  console.log('✅ Created Title Company:', titleDemo.email)

  // ========================================
  // 2. CREATE TRANSACTIONS FOR AGENT
  // ========================================
  
  console.log('\n🏠 Creating agent transactions...')
  
  const agentTransactions = [
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
      agentId: agentDemo.id
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
      agentId: agentDemo.id
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
      agentId: agentDemo.id
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
      agentId: agentDemo.id
    },
    {
      title: '555 Elm Street, Princeton NJ',
      description: 'Stunning contemporary with gourmet kitchen',
      propertyAddress: '555 Elm Street',
      propertyCity: 'Princeton',
      propertyState: 'NJ',
      propertyZip: '08540',
      status: 'OFFER_SUBMITTED',
      listingPrice: 785000,
      salePrice: 770000,
      commission: 2.75,
      contractDate: new Date('2024-02-01'),
      closingDate: new Date('2024-04-15'),
      agentId: agentDemo.id
    }
  ]

  for (const transactionData of agentTransactions) {
    const transaction = await prisma.transaction.create({
      data: transactionData
    })
    console.log('✅ Created agent transaction:', transaction.title)

    // Create deadlines for active transactions
    if (transaction.status !== 'DRAFT' && transaction.status !== 'CLOSED') {
      await prisma.deadline.create({
        data: {
          transactionId: transaction.id,
          title: 'Home Inspection',
          description: 'Schedule and complete home inspection',
          dueDate: transaction.inspectionDate || new Date(),
          isCompleted: transaction.status === 'CLOSED',
        }
      })

      await prisma.deadline.create({
        data: {
          transactionId: transaction.id,
          title: 'Appraisal',
          description: 'Property appraisal appointment',
          dueDate: transaction.appraisalDate || new Date(),
          isCompleted: false,
        }
      })

      await prisma.deadline.create({
        data: {
          transactionId: transaction.id,
          title: 'Final Walkthrough',
          description: 'Buyer final walkthrough before closing',
          dueDate: new Date(transaction.closingDate || new Date()),
          isCompleted: false,
        }
      })
    }

    // Create activity for each transaction
    await prisma.activity.create({
      data: {
        transactionId: transaction.id,
        userId: agentDemo.id,
        type: 'status_change',
        description: `Transaction status updated to ${transaction.status}`
      }
    })
  }

  // ========================================
  // 3. CREATE NOTIFICATIONS FOR AGENT
  // ========================================
  
  console.log('\n📬 Creating agent notifications...')
  
  await prisma.notification.create({
    data: {
      userId: agentDemo.id,
      type: 'DEADLINE',
      title: 'Upcoming Deadline',
      message: 'Home inspection for 123 Main Street is scheduled for tomorrow',
      isRead: false
    }
  })

  await prisma.notification.create({
    data: {
      userId: agentDemo.id,
      type: 'STATUS_UPDATE',
      title: 'Transaction Update',
      message: '789 Pine Lane has moved to inspection phase',
      isRead: false
    }
  })

  await prisma.notification.create({
    data: {
      userId: agentDemo.id,
      type: 'MILESTONE',
      title: 'Transaction Closed! 🎉',
      message: '456 Oak Avenue has successfully closed. Total commission: $10,625',
      isRead: true
    }
  })

  console.log('\n✅ Seed completed successfully!')
  console.log('\n📊 Demo Accounts Created:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🏠 Real Estate Agent: agent@closetrack.app')
  console.log('   - 5 transactions (various stages)')
  console.log('   - Multiple deadlines and activities')
  console.log('   - $2.2M+ in transaction volume')
  console.log('\n🏢 Broker: broker@closetrack.app')
  console.log('   - Multi-agent management capabilities')
  console.log('   - Advanced analytics and reporting')
  console.log('   - Team oversight features')
  console.log('\n📋 Title Company: title@closetrack.app')
  console.log('   - Professional collaboration tools')
  console.log('   - Document management')
  console.log('   - Closing coordination')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

