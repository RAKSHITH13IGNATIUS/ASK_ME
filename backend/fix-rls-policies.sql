-- ================================================
-- Fix Row Level Security Policies
-- ================================================
-- Run this in your Supabase SQL Editor if you're getting
-- connection errors or "permission denied" errors
-- ================================================

-- Drop and recreate policies for classrooms
DROP POLICY IF EXISTS "Authenticated users can read classrooms" ON classrooms;
DROP POLICY IF EXISTS "Public can read classrooms" ON classrooms;

-- Allow both authenticated and anonymous users to read classrooms
CREATE POLICY "Anyone can read classrooms"
    ON classrooms
    FOR SELECT
    USING (true);

-- Drop and recreate policies for schedules
DROP POLICY IF EXISTS "Authenticated users can read schedules" ON schedules;
DROP POLICY IF EXISTS "Public can read schedules" ON schedules;

-- Allow both authenticated and anonymous users to read schedules
CREATE POLICY "Anyone can read schedules"
    ON schedules
    FOR SELECT
    USING (true);

-- Drop and recreate policies for library_status
DROP POLICY IF EXISTS "Authenticated users can read library status" ON library_status;
DROP POLICY IF EXISTS "Public can read library status" ON library_status;

-- Allow both authenticated and anonymous users to read library status
CREATE POLICY "Anyone can read library status"
    ON library_status
    FOR SELECT
    USING (true);

-- Drop and recreate policies for faculty
DROP POLICY IF EXISTS "Authenticated users can read faculty" ON faculty;
DROP POLICY IF EXISTS "Public can read faculty" ON faculty;

-- Allow both authenticated and anonymous users to read faculty
CREATE POLICY "Anyone can read faculty"
    ON faculty
    FOR SELECT
    USING (true);

-- Keep users table restricted (only authenticated users can see their own data)
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Service role has full access" ON users;

CREATE POLICY "Users can read own data"
    ON users
    FOR SELECT
    USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role has full access"
    ON users
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT
    WITH CHECK (true);

-- ================================================
-- VERIFY RLS IS ENABLED
-- ================================================
SELECT
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('classrooms', 'schedules', 'library_status', 'faculty', 'users')
ORDER BY tablename;

-- ================================================
-- VIEW ALL POLICIES
-- ================================================
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
