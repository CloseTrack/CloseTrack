-- Update the existing user_profiles table to match our app's needs
-- Run this in Supabase SQL Editor

-- First, let's see what columns we need to add/rename
-- Add missing columns to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS "clerkId" TEXT,
ADD COLUMN IF NOT EXISTS "firstName" TEXT,
ADD COLUMN IF NOT EXISTS "lastName" TEXT,
ADD COLUMN IF NOT EXISTS "phone" TEXT,
ADD COLUMN IF NOT EXISTS "companyName" TEXT,
ADD COLUMN IF NOT EXISTS "licenseNumber" TEXT,
ADD COLUMN IF NOT EXISTS "profileImageUrl" TEXT,
ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "subscriptionId" TEXT,
ADD COLUMN IF NOT EXISTS "subscriptionStatus" TEXT,
ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT,
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Update the role enum to match our app
-- First, let's see what roles exist
-- We need to map the existing roles to our app's roles
UPDATE user_profiles 
SET 
  "firstName" = SPLIT_PART(full_name, ' ', 1),
  "lastName" = SPLIT_PART(full_name, ' ', 2),
  "clerkId" = id::text, -- Use the UUID as clerkId for now
  "isActive" = true,
  "createdAt" = CURRENT_TIMESTAMP,
  "updatedAt" = CURRENT_TIMESTAMP;

-- Map existing roles to our app roles
UPDATE user_profiles 
SET role = CASE 
  WHEN role = 'real_estate_agent' THEN 'AGENT'
  WHEN role = 'buyer' THEN 'CLIENT'
  WHEN role = 'seller' THEN 'CLIENT'
  WHEN role = 'title_insurance_agent' THEN 'TITLE_COMPANY'
  ELSE 'AGENT'
END;

-- Create the other tables we need
CREATE TABLE IF NOT EXISTS "transactions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "propertyAddress" TEXT NOT NULL,
    "propertyCity" TEXT NOT NULL,
    "propertyState" TEXT NOT NULL DEFAULT 'NJ',
    "propertyZip" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
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

-- Add foreign key constraint
ALTER TABLE "transactions" 
ADD CONSTRAINT "transactions_agentId_fkey" 
FOREIGN KEY ("agentId") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create other essential tables
CREATE TABLE IF NOT EXISTS "transaction_participants" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transaction_participants_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "documents" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isSigned" BOOLEAN NOT NULL DEFAULT false,
    "signedAt" TIMESTAMP(3),
    "signedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "activities" (
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

CREATE TABLE IF NOT EXISTS "deadlines" (
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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "deadlines_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "checklists" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "completedById" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "checklists_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- Add indexes
CREATE UNIQUE INDEX IF NOT EXISTS "user_profiles_clerkId_key" ON "user_profiles"("clerkId");
CREATE UNIQUE INDEX IF NOT EXISTS "user_profiles_email_key" ON "user_profiles"("email");
