-- Migration: Fix CloseTrack Schema
-- Run this in Supabase SQL Editor (click RUN, not save)

-- Drop existing objects
DROP TABLE IF EXISTS checklists CASCADE;
DROP TABLE IF EXISTS deadlines CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS transaction_participants CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TYPE IF EXISTS "UserRole" CASCADE;

-- Create UserRole enum
CREATE TYPE "UserRole" AS ENUM ('real_estate_agent', 'buyer', 'seller', 'title_insurance_agent');

-- Create user_profiles table
CREATE TABLE user_profiles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "clerkId" TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    phone TEXT,
    role "UserRole" DEFAULT 'real_estate_agent',
    "companyName" TEXT,
    "licenseNumber" TEXT,
    "profileImageUrl" TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "subscriptionId" TEXT,
    "subscriptionStatus" TEXT,
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    "propertyAddress" TEXT NOT NULL,
    "propertyCity" TEXT NOT NULL,
    "propertyState" TEXT DEFAULT 'NJ',
    "propertyZip" TEXT NOT NULL,
    status TEXT DEFAULT 'DRAFT',
    "listingPrice" DECIMAL(12,2),
    "salePrice" DECIMAL(12,2),
    commission DECIMAL(5,2),
    "contractDate" TIMESTAMP,
    "closingDate" TIMESTAMP,
    "inspectionDate" TIMESTAMP,
    "appraisalDate" TIMESTAMP,
    "mortgageCommitmentDate" TIMESTAMP,
    "attorneyReviewDate" TIMESTAMP,
    "agentId" TEXT NOT NULL REFERENCES user_profiles(id),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create documents table
CREATE TABLE documents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "transactionId" TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    "uploadedById" TEXT NOT NULL REFERENCES user_profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "isRequired" BOOLEAN DEFAULT false,
    "isSigned" BOOLEAN DEFAULT false,
    "signedAt" TIMESTAMP,
    "signedById" TEXT REFERENCES user_profiles(id),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES user_profiles(id),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    "isRead" BOOLEAN DEFAULT false,
    "readAt" TIMESTAMP,
    metadata JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create transaction_participants table
CREATE TABLE transaction_participants (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "transactionId" TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES user_profiles(id),
    role TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE("transactionId", "userId")
);

-- Create activities table
CREATE TABLE activities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "transactionId" TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES user_profiles(id),
    type TEXT NOT NULL,
    description TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create deadlines table
CREATE TABLE deadlines (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "transactionId" TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "dueDate" TIMESTAMP NOT NULL,
    "isCompleted" BOOLEAN DEFAULT false,
    "completedAt" TIMESTAMP,
    "completedById" TEXT REFERENCES user_profiles(id),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create checklists table
CREATE TABLE checklists (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "transactionId" TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "isCompleted" BOOLEAN DEFAULT false,
    "completedAt" TIMESTAMP,
    "completedById" TEXT REFERENCES user_profiles(id),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

