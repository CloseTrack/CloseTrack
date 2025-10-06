-- CloseTrack Database Schema Setup
-- Run this entire script in Supabase SQL Editor

-- Create UserRole enum
CREATE TYPE user_role AS ENUM (
  'real_estate_agent',
  'buyer', 
  'seller',
  'title_insurance_agent'
);

-- Create TransactionStatus enum
CREATE TYPE transaction_status AS ENUM (
  'DRAFT',
  'ACTIVE',
  'PENDING',
  'CLOSED',
  'CANCELLED'
);

-- Create DocumentType enum
CREATE TYPE document_type AS ENUM (
  'CONTRACT',
  'INSPECTION_REPORT',
  'APPRAISAL',
  'TITLE_REPORT',
  'INSURANCE',
  'MORTGAGE_DOCUMENT',
  'CLOSING_DOCUMENT',
  'OTHER'
);

-- Create NotificationType enum
CREATE TYPE notification_type AS ENUM (
  'DEADLINE_REMINDER',
  'DOCUMENT_UPLOADED',
  'DOCUMENT_SIGNED',
  'STATUS_UPDATE',
  'SYSTEM_ALERT'
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  clerk_id TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'real_estate_agent',
  company_name TEXT,
  license_number TEXT,
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  subscription_id TEXT,
  subscription_status TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  property_address TEXT NOT NULL,
  property_city TEXT NOT NULL,
  property_state TEXT NOT NULL DEFAULT 'NJ',
  property_zip TEXT NOT NULL,
  status TEXT DEFAULT 'DRAFT',
  listing_price DECIMAL(12,2),
  sale_price DECIMAL(12,2),
  commission DECIMAL(5,2),
  contract_date TIMESTAMP WITH TIME ZONE,
  closing_date TIMESTAMP WITH TIME ZONE,
  inspection_date TIMESTAMP WITH TIME ZONE,
  appraisal_date TIMESTAMP WITH TIME ZONE,
  mortgage_commitment_date TIMESTAMP WITH TIME ZONE,
  attorney_review_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  agent_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- Create transaction_participants table
CREATE TABLE IF NOT EXISTS transaction_participants (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(transaction_id, user_id)
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  uploaded_by_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  is_required BOOLEAN DEFAULT false,
  is_signed BOOLEAN DEFAULT false,
  signed_at TIMESTAMP WITH TIME ZONE,
  signed_by_id TEXT REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deadlines table
CREATE TABLE IF NOT EXISTS deadlines (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_critical BOOLEAN DEFAULT false,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by_id TEXT REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create checklists table
CREATE TABLE IF NOT EXISTS checklists (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by_id TEXT REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_clerk_id ON user_profiles(clerk_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_transactions_agent_id ON transactions(agent_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transaction_participants_transaction_id ON transaction_participants(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_participants_user_id ON transaction_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_transaction_id ON documents(transaction_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by_id ON documents(uploaded_by_id);
CREATE INDEX IF NOT EXISTS idx_activities_transaction_id ON activities(transaction_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_transaction_id ON deadlines(transaction_id);
CREATE INDEX IF NOT EXISTS idx_checklists_transaction_id ON checklists(transaction_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deadlines_updated_at BEFORE UPDATE ON deadlines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_checklists_updated_at BEFORE UPDATE ON checklists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO user_profiles (id, clerk_id, email, first_name, last_name, role) 
VALUES 
  ('test-agent-1', 'test-clerk-1', 'agent@example.com', 'John', 'Doe', 'real_estate_agent'),
  ('test-buyer-1', 'test-clerk-2', 'buyer@example.com', 'Jane', 'Smith', 'buyer')
ON CONFLICT (email) DO NOTHING;

-- Insert sample transaction
INSERT INTO transactions (id, title, property_address, property_city, property_state, property_zip, agent_id, status, sale_price)
VALUES 
  ('test-transaction-1', '123 Main St Sale', '123 Main St', 'Anytown', 'NJ', '12345', 'test-agent-1', 'ACTIVE', 450000.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample transaction participant
INSERT INTO transaction_participants (transaction_id, user_id, role)
VALUES 
  ('test-transaction-1', 'test-buyer-1', 'buyer')
ON CONFLICT (transaction_id, user_id) DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Success message
SELECT 'Database schema created successfully!' as message;

