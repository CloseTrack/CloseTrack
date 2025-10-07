-- ============================================
-- CloseTrack Fresh Database Setup
-- Copy this ENTIRE file and paste into Supabase SQL Editor
-- Then click RUN
-- ============================================

-- Step 1: Create UserRole enum type
CREATE TYPE "UserRole" AS ENUM (
    'real_estate_agent',
    'buyer',
    'seller',
    'title_insurance_agent'
);

-- Step 2: Create user_profiles table
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
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create transactions table
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
    "contractDate" TIMESTAMP WITH TIME ZONE,
    "closingDate" TIMESTAMP WITH TIME ZONE,
    "inspectionDate" TIMESTAMP WITH TIME ZONE,
    "appraisalDate" TIMESTAMP WITH TIME ZONE,
    "mortgageCommitmentDate" TIMESTAMP WITH TIME ZONE,
    "attorneyReviewDate" TIMESTAMP WITH TIME ZONE,
    "agentId" TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create transaction_participants table
CREATE TABLE transaction_participants (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "transactionId" TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("transactionId", "userId")
);

-- Step 5: Create documents table
CREATE TABLE documents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "transactionId" TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    "uploadedById" TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "isRequired" BOOLEAN DEFAULT false,
    "isSigned" BOOLEAN DEFAULT false,
    "signedAt" TIMESTAMP WITH TIME ZONE,
    "signedById" TEXT REFERENCES user_profiles(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Create deadlines table
CREATE TABLE deadlines (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "transactionId" TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "dueDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "isCompleted" BOOLEAN DEFAULT false,
    "completedAt" TIMESTAMP WITH TIME ZONE,
    "completedById" TEXT REFERENCES user_profiles(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: Create checklists table
CREATE TABLE checklists (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "transactionId" TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "isCompleted" BOOLEAN DEFAULT false,
    "completedAt" TIMESTAMP WITH TIME ZONE,
    "completedById" TEXT REFERENCES user_profiles(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 8: Create notifications table
CREATE TABLE notifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    "isRead" BOOLEAN DEFAULT false,
    "readAt" TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 9: Create activities table
CREATE TABLE activities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "transactionId" TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    description TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 10: Create indexes for better performance
CREATE INDEX idx_user_profiles_clerk_id ON user_profiles("clerkId");
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_transactions_agent_id ON transactions("agentId");
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_documents_transaction_id ON documents("transactionId");
CREATE INDEX idx_notifications_user_id ON notifications("userId");
CREATE INDEX idx_notifications_is_read ON notifications("isRead");
CREATE INDEX idx_activities_transaction_id ON activities("transactionId");
CREATE INDEX idx_deadlines_transaction_id ON deadlines("transactionId");
CREATE INDEX idx_deadlines_due_date ON deadlines("dueDate");

-- Done! Your database is ready.
