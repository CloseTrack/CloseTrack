-- CRITICAL: Fix user_profiles table - Add missing columns
-- Run this EXACTLY as written in Supabase SQL Editor

-- Step 1: Add clerkId column
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "clerkId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "user_profiles_clerkId_key" ON "user_profiles"("clerkId");

-- Step 2: Add firstName column  
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "firstName" TEXT;

-- Step 3: Add lastName column
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "lastName" TEXT;

-- Step 4: Add phone column
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "phone" TEXT;

-- Step 5: Add companyName column
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "companyName" TEXT;

-- Step 6: Add licenseNumber column
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "licenseNumber" TEXT;

-- Step 7: Add profileImageUrl column
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "profileImageUrl" TEXT;

-- Step 8: Add isActive column
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true;

-- Step 9: Add subscriptionId column
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "subscriptionId" TEXT;

-- Step 10: Add subscriptionStatus column
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "subscriptionStatus" TEXT;

-- Step 11: Add stripeCustomerId column
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;

-- Step 12: Add createdAt column
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Step 13: Add updatedAt column
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Step 14: Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;
