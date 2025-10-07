-- Complete database fix for CloseTrack
-- This script will create all missing types and fix the schema
-- Run this in Supabase SQL Editor

-- Step 1: Create the UserRole enum type
DO $$ 
BEGIN
    -- Drop the enum if it exists
    DROP TYPE IF EXISTS "UserRole" CASCADE;
    
    -- Create the UserRole enum
    CREATE TYPE "UserRole" AS ENUM (
        'real_estate_agent',
        'buyer', 
        'seller',
        'title_insurance_agent'
    );
EXCEPTION
    WHEN duplicate_object THEN
        -- Enum already exists, continue
        NULL;
END $$;

-- Step 2: Drop and recreate user_profiles table with correct schema
DROP TABLE IF EXISTS user_profiles CASCADE;

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

-- Step 3: Create transactions table
DROP TABLE IF EXISTS transactions CASCADE;

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

-- Step 4: Create documents table
DROP TABLE IF EXISTS documents CASCADE;

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

-- Step 5: Create notifications table
DROP TABLE IF EXISTS notifications CASCADE;

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

-- Step 6: Create transaction_participants table
DROP TABLE IF EXISTS transaction_participants CASCADE;

CREATE TABLE transaction_participants (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "transactionId" TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES user_profiles(id),
    role TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE("transactionId", "userId")
);

-- Step 7: Create activities table
DROP TABLE IF EXISTS activities CASCADE;

CREATE TABLE activities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "transactionId" TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES user_profiles(id),
    type TEXT NOT NULL,
    description TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Step 8: Create deadlines table
DROP TABLE IF EXISTS deadlines CASCADE;

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

-- Step 9: Create checklists table
DROP TABLE IF EXISTS checklists CASCADE;

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

-- Step 10: Verify the schema
SELECT 'Schema verification complete' as status;

-- Show all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Show UserRole enum
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserRole')
ORDER BY enumsortorder;
