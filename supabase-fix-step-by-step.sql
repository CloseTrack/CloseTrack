-- ============================================
-- STEP 1: Create UserRole enum type
-- Copy and run this first
-- ============================================

DROP TYPE IF EXISTS "UserRole" CASCADE;

CREATE TYPE "UserRole" AS ENUM (
    'real_estate_agent',
    'buyer', 
    'seller',
    'title_insurance_agent'
);

-- Verify enum was created
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserRole')
ORDER BY enumsortorder;

