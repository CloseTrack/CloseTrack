-- Fix user_profiles table to match Prisma schema
-- Run this in Supabase SQL Editor

-- First, check if clerkId column exists
DO $$
BEGIN
    -- Add clerkId column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'clerkId'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN "clerkId" TEXT;
        CREATE UNIQUE INDEX IF NOT EXISTS "user_profiles_clerkId_key" ON "user_profiles"("clerkId");
    END IF;
END $$;

-- Add any missing columns
DO $$
BEGIN
    -- Add phone column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'phone'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN "phone" TEXT;
    END IF;

    -- Add companyName column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'companyName'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN "companyName" TEXT;
    END IF;

    -- Add licenseNumber column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'licenseNumber'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN "licenseNumber" TEXT;
    END IF;

    -- Add profileImageUrl column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'profileImageUrl'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN "profileImageUrl" TEXT;
    END IF;

    -- Add isActive column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'isActive'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN "isActive" BOOLEAN DEFAULT true;
    END IF;

    -- Add subscriptionId column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'subscriptionId'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN "subscriptionId" TEXT;
    END IF;

    -- Add subscriptionStatus column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'subscriptionStatus'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN "subscriptionStatus" TEXT;
    END IF;

    -- Add stripeCustomerId column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'stripeCustomerId'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN "stripeCustomerId" TEXT;
    END IF;

    -- Add createdAt column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'createdAt'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Add updatedAt column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'updatedAt'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Check the final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;
