CREATE TABLE transaction_participants (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "transactionId" TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("transactionId", "userId")
);

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

CREATE TABLE activities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "transactionId" TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    description TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
