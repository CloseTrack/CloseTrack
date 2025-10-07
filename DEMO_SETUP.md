# Demo Account Setup

This guide explains how to set up demo accounts with sample data for marketing and demonstration purposes.

## Demo Account Credentials

### 🏠 Real Estate Agent
- **Email**: `agent@closetrack.app`
- **Password**: (set during Clerk signup)
- **Name**: Sarah Johnson
- **Company**: Prime Realty Group
- **License**: NJ12345678

### 🔍 Buyer
- **Email**: `buyer@closetrack.app`
- **Password**: (set during Clerk signup)
- **Name**: Michael Chen

### 📈 Seller
- **Email**: `seller@closetrack.app`
- **Password**: (set during Clerk signup)
- **Name**: Jennifer Martinez

### 📋 Title Insurance Agent
- **Email**: `title@closetrack.app`
- **Password**: (set during Clerk signup)
- **Name**: Robert Williams
- **Company**: Secure Title Insurance Co.
- **License**: TI-NJ-98765

## Setup Instructions

### Option 1: Run Seed Script Locally

1. Install dependencies (if not already installed):
```bash
npm install
npm install -D tsx
```

2. Make sure your `DATABASE_URL` is set in `.env`:
```bash
DATABASE_URL="your_neon_database_url"
```

3. Run the seed script:
```bash
npm run db:seed
```

This will create:
- **4 demo user accounts** (one for each role)
- **7 sample transactions** (in various stages)
- **Multiple deadlines and activities**
- **Role-specific notifications**
- **Transaction participants**

## Demo Data Breakdown

### 🏠 Real Estate Agent Account
**5 Active Transactions:**
1. 123 Main Street, Edison NJ - Under Contract ($560K)
2. 456 Oak Avenue, Somerset NJ - Closed ($425K)
3. 789 Pine Lane, New Brunswick NJ - In Inspection ($375K)
4. 321 Maple Drive, Piscataway NJ - Draft ($495K)
5. 555 Elm Street, Princeton NJ - Offer Submitted ($770K)

**Features:**
- Full transaction pipeline
- Multiple deadlines per transaction
- Activity logs
- Performance analytics
- Team management view

### 🔍 Buyer Account
**1 Active Purchase:**
- 999 Willow Court, Highland Park NJ - Mortgage Commitment ($505K)

**Features:**
- Buyer-specific view
- Mortgage milestone tracking
- Deadline reminders
- Transaction participant role

### 📈 Seller Account
**1 Active Listing:**
- 777 Cedar Lane, Franklin Township NJ - Attorney Review ($445K)

**Features:**
- Seller-specific view
- Repair deadline tracking
- Move-out reminders
- Transaction participant role

### 📋 Title Agent Account
- Ready for collaboration on transactions
- Can be added to any transaction as participant

## Accessing the Demo Accounts

Since this app uses Clerk for authentication:

### Step 1: Run the Seed Script
```bash
npm run db:seed
```

### Step 2: Sign Up with Demo Emails

For each role you want to demo:

1. Go to `/sign-up` in your app
2. Sign up with one of the demo emails:
   - `agent@closetrack.app` (Real Estate Agent)
   - `buyer@closetrack.app` (Buyer)
   - `seller@closetrack.app` (Seller)
   - `title@closetrack.app` (Title Agent)
3. Complete Clerk's email verification
4. The app will automatically match your Clerk account to the seeded demo data
5. **Skip role selection** - role is already set in database

### Step 3: View Demo Data

Each account will show role-specific data:
- **Agent**: Full dashboard with 5 transactions and analytics
- **Buyer**: Buyer portal showing your purchase progress
- **Seller**: Seller view with listing status
- **Title**: Collaboration tools (can be added to transactions)

## Resetting Demo Data

To reset the demo data:

```bash
# Delete existing demo data
npx prisma studio
# Manually delete transactions and user with email demo@closetrack.app

# Re-run seed
npm run db:seed
```

## Production Note

For production demos:
- Create a dedicated demo environment/database
- Don't use the demo account on your main production database
- Consider adding a "Demo Mode" banner to the UI

