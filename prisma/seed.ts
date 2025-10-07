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
      role: UserRole.real_estate_agent,
      phone: '+1 (555) 123-4567',
      companyName: 'Prime Realty Group',
      licenseNumber: 'NJ12345678',
      isActive: true
    }
  })
  console.log('✅ Created Real Estate Agent:', agentDemo.email)

  // Buyer Demo Account
  const buyerDemo = await prisma.user.upsert({
    where: { email: 'buyer@closetrack.app' },
    update: {},
    create: {
      email: 'buyer@closetrack.app',
      firstName: 'Michael',
      lastName: 'Chen',
      role: UserRole.buyer,
      phone: '+1 (555) 234-5678',
      isActive: true
    }
  })
  console.log('✅ Created Buyer:', buyerDemo.email)

  // Seller Demo Account
  const sellerDemo = await prisma.user.upsert({
    where: { email: 'seller@closetrack.app' },
    update: {},
    create: {
      email: 'seller@closetrack.app',
      firstName: 'Jennifer',
      lastName: 'Martinez',
      role: UserRole.seller,
      phone: '+1 (555) 345-6789',
      isActive: true
    }
  })
  console.log('✅ Created Seller:', sellerDemo.email)

  // Title Insurance Agent Demo Account
  const titleDemo = await prisma.user.upsert({
    where: { email: 'title@closetrack.app' },
    update: {},
    create: {
      email: 'title@closetrack.app',
      firstName: 'Robert',
      lastName: 'Williams',
      role: UserRole.title_insurance_agent,
      phone: '+1 (555) 456-7890',
      companyName: 'Secure Title Insurance Co.',
      licenseNumber: 'TI-NJ-98765',
      isActive: true
    }
  })
  console.log('✅ Created Title Insurance Agent:', titleDemo.email)

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
  // 3. CREATE TRANSACTIONS FOR BUYER
  // ========================================
  
  console.log('\n🔍 Creating buyer transaction...')
  
  const buyerTransaction = await prisma.transaction.create({
    data: {
      title: '999 Willow Court, Highland Park NJ - Buyer View',
      description: 'Your dream home purchase in progress',
      propertyAddress: '999 Willow Court',
      propertyCity: 'Highland Park',
      propertyState: 'NJ',
      propertyZip: '08904',
      status: 'MORTGAGE_COMMITMENT',
      listingPrice: 515000,
      salePrice: 505000,
      commission: 3.0,
      contractDate: new Date('2024-01-10'),
      closingDate: new Date('2024-03-20'),
      inspectionDate: new Date('2024-01-18'),
      appraisalDate: new Date('2024-02-01'),
      mortgageCommitmentDate: new Date('2024-02-15'),
      agentId: agentDemo.id // Real agent handling the transaction
    }
  })
  console.log('✅ Created buyer transaction:', buyerTransaction.title)

  // Add buyer as participant
  await prisma.transactionParticipant.create({
    data: {
      transactionId: buyerTransaction.id,
      userId: buyerDemo.id,
      role: 'buyer',
    }
  })

  // Create buyer-specific deadlines
  await prisma.deadline.create({
    data: {
      transactionId: buyerTransaction.id,
      title: 'Mortgage Pre-Approval',
      description: 'Submit mortgage pre-approval documents',
      dueDate: new Date('2024-02-10'),
      isCompleted: true,
      completedAt: new Date('2024-02-08'),
    }
  })

  await prisma.deadline.create({
    data: {
      transactionId: buyerTransaction.id,
      title: 'Final Walkthrough',
      description: 'Schedule your final walkthrough before closing',
      dueDate: new Date('2024-03-18'),
      isCompleted: false,
    }
  })

  // Create buyer notifications
  await prisma.notification.create({
    data: {
      userId: buyerDemo.id,
      type: 'MILESTONE',
      title: 'Mortgage Approved! 🎉',
      message: 'Your mortgage commitment has been received. Closing is scheduled for March 20th.',
      isRead: false
    }
  })

  await prisma.notification.create({
    data: {
      userId: buyerDemo.id,
      type: 'DEADLINE',
      title: 'Final Walkthrough Coming Up',
      message: 'Don\'t forget to schedule your final walkthrough at 999 Willow Court',
      isRead: false
    }
  })

  // ========================================
  // 4. CREATE TRANSACTIONS FOR SELLER
  // ========================================
  
  console.log('\n📈 Creating seller transaction...')
  
  const sellerTransaction = await prisma.transaction.create({
    data: {
      title: '777 Cedar Lane, Franklin Township NJ - Seller View',
      description: 'Your home listing',
      propertyAddress: '777 Cedar Lane',
      propertyCity: 'Franklin Township',
      propertyState: 'NJ',
      propertyZip: '08873',
      status: 'ATTORNEY_REVIEW',
      listingPrice: 449000,
      salePrice: 445000,
      commission: 3.0,
      contractDate: new Date('2024-02-05'),
      closingDate: new Date('2024-04-01'),
      attorneyReviewDate: new Date('2024-02-12'),
      agentId: agentDemo.id // Real agent handling the transaction
    }
  })
  console.log('✅ Created seller transaction:', sellerTransaction.title)

  // Add seller as participant
  await prisma.transactionParticipant.create({
    data: {
      transactionId: sellerTransaction.id,
      userId: sellerDemo.id,
      role: 'seller',
    }
  })

  // Create seller-specific deadlines
  await prisma.deadline.create({
    data: {
      transactionId: sellerTransaction.id,
      title: 'Repair Completion',
      description: 'Complete agreed-upon repairs from home inspection',
      dueDate: new Date('2024-03-15'),
      isCompleted: false,
    }
  })

  await prisma.deadline.create({
    data: {
      transactionId: sellerTransaction.id,
      title: 'Move-Out Date',
      description: 'Property must be vacated by this date',
      dueDate: new Date('2024-03-30'),
      isCompleted: false,
    }
  })

  // Create seller notifications
  await prisma.notification.create({
    data: {
      userId: sellerDemo.id,
      type: 'OFFER',
      title: 'Offer Accepted!',
      message: 'Congratulations! Your offer of $445,000 has been accepted.',
      isRead: false
    }
  })

  await prisma.notification.create({
    data: {
      userId: sellerDemo.id,
      type: 'DEADLINE',
      title: 'Repair Deadline Approaching',
      message: 'Repairs must be completed by March 15th',
      isRead: false
    }
  })

  // ========================================
  // 5. CREATE NOTIFICATIONS FOR AGENT
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
  console.log('\n🔍 Buyer: buyer@closetrack.app')
  console.log('   - 1 active purchase')
  console.log('   - Mortgage commitment stage')
  console.log('   - $505K purchase price')
  console.log('\n📈 Seller: seller@closetrack.app')
  console.log('   - 1 active listing')
  console.log('   - Attorney review stage')
  console.log('   - $445K sale price')
  console.log('\n📋 Title Agent: title@closetrack.app')
  console.log('   - Ready for collaboration')
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

