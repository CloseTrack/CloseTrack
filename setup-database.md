# Database Setup Instructions

## 1. Set up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (it looks like: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`)

## 2. Add Environment Variables to Vercel

In your Vercel project settings → Environment Variables, add:

```
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
```

## 3. Run Database Migrations

After setting up the database URL, you need to run the Prisma migrations. You can do this by:

1. Going to your Vercel project dashboard
2. Go to the "Functions" tab
3. Create a new serverless function to run the migration

Or run locally:
```bash
npx prisma migrate deploy
```

## 4. Set up Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Get your API keys from the dashboard
4. In Vercel, add these environment variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## 5. Optional: Set up Stripe (for payments)

1. Go to [stripe.com](https://stripe.com) and create a free account
2. Get your API keys from the dashboard
3. In Vercel, add these environment variables:

```
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 6. Redeploy

After adding all the environment variables, redeploy your Vercel project.
