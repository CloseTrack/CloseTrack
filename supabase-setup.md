# Supabase Database Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)
4. Click "New Project"
5. Choose your organization
6. Fill in project details:
   - **Name**: `closetrack`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
7. Click "Create new project"

## Step 2: Get Database Connection String

1. In your Supabase dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Copy the **URI** connection string
4. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres`

## Step 3: Add Environment Variable to Vercel

1. Go to your Vercel project dashboard
2. Click on your `close-track` project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Name**: `DATABASE_URL`
   - **Value**: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres`
   - **Environment**: Production, Preview, Development
6. Click **Save**

## Step 4: Run Database Migrations

After adding the DATABASE_URL, you need to create the database tables. You have two options:

### Option A: Use the API endpoint (Recommended)
1. Visit: `https://close-track.vercel.app/api/database`
2. This will test your database connection
3. If successful, you'll see connection details

### Option B: Run migrations locally
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

## Step 5: Test Database Connection

1. Visit: `https://close-track.vercel.app/api/database`
2. You should see:
   ```json
   {
     "success": true,
     "message": "Database connection successful",
     "data": {
       "userCount": 0,
       "transactionCount": 0,
       "databaseUrl": "Set"
     }
   }
   ```

## Step 6: Redeploy

1. After adding the DATABASE_URL environment variable
2. Go to your Vercel project dashboard
3. Click **Deployments**
4. Click **Redeploy** on the latest deployment

## Common Issues & Solutions

### Issue: "Database connection failed"
**Solution**: Check your DATABASE_URL format and password

### Issue: "Database tables not found"
**Solution**: Run `npx prisma db push` or visit the API endpoint

### Issue: "Invalid connection string"
**Solution**: Make sure the password doesn't contain special characters that need URL encoding

### Issue: "Connection timeout"
**Solution**: Check if your Supabase project is paused (free tier limitation)

## Next Steps

After the database is working:
1. Set up Clerk authentication
2. Test the dashboard functionality
3. Add sample data if needed

## Support

If you're still having issues:
1. Check the Vercel function logs
2. Visit `/api/database` to see detailed error messages
3. Verify your Supabase project is active
