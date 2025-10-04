-- CloseTrack Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create enums
CREATE TYPE "UserRole" AS ENUM ('AGENT', 'BROKER', 'TITLE_COMPANY', 'CLIENT');
CREATE TYPE "TransactionStatus" AS ENUM ('DRAFT', 'OFFER_SUBMITTED', 'UNDER_CONTRACT', 'INSPECTION', 'APPRAISAL', 'MORTGAGE_COMMITMENT', 'ATTORNEY_REVIEW', 'CLOSING_SCHEDULED', 'CLOSED', 'CANCELLED');
CREATE TYPE "DocumentType" AS ENUM ('CONTRACT', 'INSPECTION_REPORT', 'APPRAISAL', 'MORTGAGE_DOCUMENT', 'TITLE_DOCUMENT', 'CLOSING_DOCUMENT', 'OTHER');
CREATE TYPE "NotificationType" AS ENUM ('EMAIL', 'SMS', 'PUSH');

-- Create users table
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL,
    "companyName" TEXT,
    "licenseNumber" TEXT,
    "profileImageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionId" TEXT,
    "subscriptionStatus" TEXT,
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create transactions table
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "propertyAddress" TEXT NOT NULL,
    "propertyCity" TEXT NOT NULL,
    "propertyState" TEXT NOT NULL DEFAULT 'NJ',
    "propertyZip" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'DRAFT',
    "listingPrice" DECIMAL(12,2),
    "salePrice" DECIMAL(12,2),
    "commission" DECIMAL(5,2),
    "contractDate" TIMESTAMP(3),
    "closingDate" TIMESTAMP(3),
    "inspectionDate" TIMESTAMP(3),
    "appraisalDate" TIMESTAMP(3),
    "mortgageCommitmentDate" TIMESTAMP(3),
    "attorneyReviewDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "agentId" TEXT NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- Create transaction_participants table
CREATE TABLE "transaction_participants" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_participants_pkey" PRIMARY KEY ("id")
);

-- Create documents table
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "DocumentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isSigned" BOOLEAN NOT NULL DEFAULT false,
    "signedAt" TIMESTAMP(3),
    "signedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- Create activities table
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- Create deadlines table
CREATE TABLE "deadlines" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "completedById" TEXT,
    "isCritical" BOOLEAN NOT NULL DEFAULT false,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deadlines_pkey" PRIMARY KEY ("id")
);

-- Create checklists table
CREATE TABLE "checklists" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "completedById" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklists_pkey" PRIMARY KEY ("id")
);

-- Create notifications table
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- Create subscriptions table
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "transaction_participants_transactionId_userId_key" ON "transaction_participants"("transactionId", "userId");
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");
CREATE UNIQUE INDEX "subscriptions_stripeCustomerId_key" ON "subscriptions"("stripeCustomerId");
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");

-- Add foreign key constraints
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "transaction_participants" ADD CONSTRAINT "transaction_participants_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "transaction_participants" ADD CONSTRAINT "transaction_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "documents" ADD CONSTRAINT "documents_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "documents" ADD CONSTRAINT "documents_signedById_fkey" FOREIGN KEY ("signedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "activities" ADD CONSTRAINT "activities_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "activities" ADD CONSTRAINT "activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "deadlines" ADD CONSTRAINT "deadlines_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "deadlines" ADD CONSTRAINT "deadlines_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
