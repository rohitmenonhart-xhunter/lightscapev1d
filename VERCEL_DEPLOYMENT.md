# Vercel Deployment Guide

This guide helps you deploy your Next.js application to Vercel and troubleshoot common issues.

## Fixing the MongoDB Connection Error

If you're seeing the error `Registration error: Error: Database connection failed`, follow these steps:

### 1. Check Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click on "Settings" > "Environment Variables"
4. Verify that `MONGODB_URI` is correctly set with the exact connection string:
   ```
   MONGODB_URI=mongodb+srv://rohitmanon2:rohit@cluster0.daclztf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
5. Make sure `NEXTAUTH_SECRET` is also set:
   ```
   NEXTAUTH_SECRET=belecure_super_secret_key_for_jwt_tokens
   ```
6. Add `NODE_ENV=production` if it's not already set

### 2. Redeploy Your Application

1. After updating environment variables, go to "Deployments"
2. Click on the "..." menu next to your latest deployment
3. Select "Redeploy" to apply the environment variable changes

### 3. Check MongoDB Atlas Settings

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Make sure your IP whitelist includes `0.0.0.0/0` to allow connections from Vercel
3. Verify your database user credentials are correct
4. Check that your MongoDB cluster is active and running

### 4. Test the Connection

If you're still having issues:

1. Create a simple API endpoint to test the MongoDB connection:
   ```javascript
   // app/api/test-db/route.ts
   import { NextResponse } from 'next/server';
   import connectToDatabase from '@/lib/db/mongodb';

   export async function GET() {
     try {
       await connectToDatabase();
       return NextResponse.json({ status: 'Connected to MongoDB successfully' });
     } catch (error) {
       console.error('MongoDB connection error:', error);
       return NextResponse.json(
         { error: `Failed to connect to MongoDB: ${error.message}` },
         { status: 500 }
       );
     }
   }
   ```

2. Deploy this endpoint and visit `https://your-app.vercel.app/api/test-db` to see the connection status

### 5. Check Vercel Logs

1. In your Vercel dashboard, go to "Deployments" > [latest deployment]
2. Click on "Functions" to see the serverless functions
3. Find the function related to registration and check its logs for specific error details

## Common MongoDB Connection Issues

1. **Network Access**: Make sure MongoDB Atlas allows connections from anywhere (or at least from Vercel's IP ranges)
2. **Credentials**: Double-check username and password in the connection string
3. **Connection String Format**: Ensure the connection string is properly formatted
4. **Database Name**: Verify the database name in the connection string matches your actual database
5. **MongoDB Atlas Plan**: Free tier clusters may sleep after inactivity; consider upgrading for production

## Additional Troubleshooting

If you're still experiencing issues, try these steps:

1. Temporarily disable domain validation to rule out registration issues
2. Check for MongoDB connection timeouts and adjust the timeouts in the connection options
3. Test with a simplified user registration flow to isolate the issue 