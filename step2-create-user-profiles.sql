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
