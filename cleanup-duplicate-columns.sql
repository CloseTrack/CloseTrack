-- Clean up duplicate columns in user_profiles table
-- Keep only camelCase versions (what Prisma expects)
-- Run this in Supabase SQL Editor

-- Step 1: Drop duplicate snake_case columns (keep camelCase versions)
ALTER TABLE user_profiles DROP COLUMN IF EXISTS "clerk_id";
ALTER TABLE user_profiles DROP COLUMN IF EXISTS "first_name";
ALTER TABLE user_profiles DROP COLUMN IF EXISTS "last_name";
ALTER TABLE user_profiles DROP COLUMN IF EXISTS "company_name";
ALTER TABLE user_profiles DROP COLUMN IF EXISTS "license_number";
ALTER TABLE user_profiles DROP COLUMN IF EXISTS "profile_image_url";
ALTER TABLE user_profiles DROP COLUMN IF EXISTS "is_active";
ALTER TABLE user_profiles DROP COLUMN IF EXISTS "subscription_id";
ALTER TABLE user_profiles DROP COLUMN IF EXISTS "subscription_status";
ALTER TABLE user_profiles DROP COLUMN IF EXISTS "stripe_customer_id";
ALTER TABLE user_profiles DROP COLUMN IF EXISTS "created_at";
ALTER TABLE user_profiles DROP COLUMN IF EXISTS "updated_at";

-- Step 2: Verify the final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;
