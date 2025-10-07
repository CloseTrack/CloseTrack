# Demo Account Setup

This guide explains how to set up a demo account with sample data for marketing and demonstration purposes.

## Demo Account Credentials

- **Email**: `demo@closetrack.app`
- **Role**: Real Estate Agent
- **Company**: Prime Realty Group
- **License**: NJ12345678

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
- 1 demo user account
- 4 sample transactions (in various stages)
- Multiple deadlines
- Activity logs
- Notifications

### Option 2: Manual SQL Insert (Neon Dashboard)

If you prefer to run SQL directly in your Neon database dashboard, copy and run the SQL from `demo-data.sql`.

## Demo Data Includes

### Transactions
1. **123 Main Street, Edison NJ** - Under Contract ($560K)
2. **456 Oak Avenue, Somerset NJ** - Closed ($425K)
3. **789 Pine Lane, New Brunswick NJ** - In Inspection ($375K)
4. **321 Maple Drive, Piscataway NJ** - Draft ($495K)

### Features Demonstrated
- ✅ Transaction pipeline management
- ✅ Deadline tracking
- ✅ Activity history
- ✅ Notifications
- ✅ Team management
- ✅ Revenue analytics

## Accessing the Demo Account

Since this app uses Clerk for authentication, you'll need to:

1. **Create a Clerk account** with the email `demo@closetrack.app`
2. **Sign up through the app** at `/sign-up`
3. **The seed script will match this email** and associate it with the demo data

OR

Simply sign up with any email, and the seed script will create a separate demo user that you can view in Team Management.

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

