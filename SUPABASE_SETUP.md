# Supabase Setup Guide

Follow these steps to set up your Supabase backend for the photo-sharing application:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up or log in to your account
4. Click "New Project"
5. Select your organization
6. Enter a project name (e.g., "photo-community")
7. Set a strong database password
8. Choose a region close to your users
9. Click "Create new project"

## 2. Get Project Credentials

1. Wait for your project to be ready (2-3 minutes)
2. Go to Project Settings → API
3. Copy the **Project URL** and **anon public** key
4. Update your `.env.local` file:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Set Up Authentication

1. Go to Authentication → Settings
2. Under "Site URL", enter: `http://localhost:5173`
3. Under "Redirect URLs", add: `http://localhost:5173`
4. Ensure "Enable email confirmations" is ON
5. Under "User signup", ensure "Allow new users to sign up" is ON

## 4. Run the Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the entire contents of `supabase/schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create:
- `profiles` table for user information
- `photos` table for photo metadata
- `photos` storage bucket for image files
- Row Level Security (RLS) policies
- Indexes for better performance
- Trigger to create user profiles automatically

## 5. Verify Setup

1. Check that the tables were created: Table Editor → Tables
2. You should see `profiles` and `photos` tables
3. Check that storage bucket was created: Storage → Buckets
4. You should see a `photos` bucket

## 6. Test the Application

1. Run `npm run dev` in your project
2. Open `http://localhost:5173`
3. Try signing up for a new account
4. Upload a photo to verify everything works

## Troubleshooting

**"Missing Supabase environment variables" error:**
- Make sure your `.env.local` file has the correct URL and anon key
- Restart your development server after updating environment variables

**"Permission denied" errors:**
- Make sure you ran the SQL schema in Supabase
- Check that RLS policies are enabled on tables

**Storage upload issues:**
- Verify the `photos` bucket exists in Storage
- Check that storage policies were created correctly

For more help, check the [Supabase Documentation](https://supabase.com/docs).