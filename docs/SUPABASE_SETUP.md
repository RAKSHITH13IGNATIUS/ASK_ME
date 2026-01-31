# Supabase Setup Guide for ASK DSU

This guide will help you set up Supabase as the backend and storage solution for the ASK DSU project.

## Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new project in Supabase

## Step 1: Get Supabase Credentials

After creating your Supabase project:

1. Go to **Settings** > **API** in your Supabase dashboard
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (for frontend)
   - **service_role key** (for backend - keep this secret!)

## Step 2: Configure Environment Variables

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Server Configuration
PORT=3000
```

### Frontend Configuration

Update `supabaseClient.js` in the root directory with your credentials:

```javascript
const SUPABASE_URL = 'your_supabase_project_url';
const SUPABASE_ANON_KEY = 'your_anon_public_key';
```

## Step 3: Set Up Database Schema

Go to **SQL Editor** in your Supabase dashboard and run the following SQL commands:

### 1. Create Users Table

```sql
-- Users table (synced with Supabase Auth)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can read their own data
CREATE POLICY "Users can read own data"
    ON users
    FOR SELECT
    USING (auth.uid()::text = user_id::text);

-- Create policy: Service role can do everything
CREATE POLICY "Service role has full access"
    ON users
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');
```

### 2. Create Classrooms Table

```sql
-- Classrooms table
CREATE TABLE classrooms (
    classroom_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number TEXT NOT NULL,
    building TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;

-- Create policy: Authenticated users can read
CREATE POLICY "Authenticated users can read classrooms"
    ON classrooms
    FOR SELECT
    TO authenticated
    USING (true);
```

### 3. Create Schedules Table

```sql
-- Schedules table (for classroom availability)
CREATE TABLE schedules (
    schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID REFERENCES classrooms(classroom_id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL, -- Monday, Tuesday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Create policy: Authenticated users can read
CREATE POLICY "Authenticated users can read schedules"
    ON schedules
    FOR SELECT
    TO authenticated
    USING (true);

-- Create index for faster queries
CREATE INDEX idx_schedules_classroom ON schedules(classroom_id);
CREATE INDEX idx_schedules_day ON schedules(day_of_week);
```

### 4. Create Library Status Table

```sql
-- Library status table
CREATE TABLE library_status (
    status_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_seats INTEGER NOT NULL DEFAULT 100,
    occupied_seats INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE library_status ENABLE ROW LEVEL SECURITY;

-- Create policy: Authenticated users can read
CREATE POLICY "Authenticated users can read library status"
    ON library_status
    FOR SELECT
    TO authenticated
    USING (true);

-- Insert initial library status
INSERT INTO library_status (total_seats, occupied_seats)
VALUES (100, 45);
```

### 5. Create Faculty Table

```sql
-- Faculty table
CREATE TABLE faculty (
    faculty_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    cabin_number TEXT NOT NULL,
    email TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

-- Create policy: Authenticated users can read
CREATE POLICY "Authenticated users can read faculty"
    ON faculty
    FOR SELECT
    TO authenticated
    USING (true);

-- Create index for faster name searches
CREATE INDEX idx_faculty_name ON faculty(name);
```

## Step 4: Set Up Authentication

### Enable Email Authentication

1. Go to **Authentication** > **Providers** in Supabase dashboard
2. Enable **Email** provider
3. Configure email templates if needed
4. For testing, you can disable email confirmation:
   - Go to **Authentication** > **Settings**
   - Under **Email Auth**, disable "Confirm email"

### Configure Email Restrictions (Optional)

To restrict signups to @dsu.edu domain, you can use a database trigger or handle it in your application logic (already implemented in the code).

## Step 5: Seed Sample Data (Optional)

Run this SQL to add sample data for testing:

```sql
-- Sample classrooms
INSERT INTO classrooms (room_number, building, capacity, is_available) VALUES
('101', 'Block A', 40, true),
('102', 'Block A', 35, true),
('201', 'Block B', 50, true),
('202', 'Block B', 45, true),
('301', 'Block C', 30, true);

-- Sample schedules (assuming current time is between 9 AM - 5 PM)
INSERT INTO schedules (classroom_id, day_of_week, start_time, end_time, subject)
SELECT
    classroom_id,
    'Monday',
    '09:00:00',
    '11:00:00',
    'Sample Class'
FROM classrooms
LIMIT 2;

-- Sample faculty
INSERT INTO faculty (name, department, cabin_number, email, is_available) VALUES
('Dr. Sharma', 'Computer Science', 'A-201', 'sharma@dsu.edu', true),
('Dr. Patel', 'Computer Science', 'A-202', 'patel@dsu.edu', true),
('Dr. Kumar', 'Electronics', 'B-101', 'kumar@dsu.edu', false),
('Dr. Singh', 'Mathematics', 'C-305', 'singh@dsu.edu', true);
```

## Step 6: Install Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase client
- `express` - Web framework
- `cors` - CORS middleware
- `dotenv` - Environment variables

## Step 7: Test the Setup

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Or using Node.js http-server
   npx http-server
   ```

3. Try signing up with a test account using @dsu.edu.in email

## Step 8: Configure Storage (Optional)

If you need to store files (like faculty photos, documents, etc.):

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket (e.g., "faculty-photos", "documents")
3. Set up storage policies:

```sql
-- Allow authenticated users to read files
CREATE POLICY "Authenticated users can read files"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'your-bucket-name');

-- Allow service role to manage files
CREATE POLICY "Service role can manage files"
    ON storage.objects
    FOR ALL
    TO service_role
    USING (true);
```

## Troubleshooting

### Connection Issues

- Check that your Supabase URL and keys are correct in `.env` and `supabaseClient.js`
- Ensure your project is not paused (free tier projects pause after 1 week of inactivity)

### Authentication Issues

- Check that email provider is enabled
- For testing, disable email confirmation
- Check browser console for detailed error messages

### Query Issues

- Ensure Row Level Security policies are set up correctly
- Check that users are authenticated before making queries
- Use the Supabase SQL Editor to test queries directly

### CORS Issues

- Ensure your frontend URL is in the allowed origins (Supabase allows all origins by default)
- Check CORS configuration in backend server.js

## Security Best Practices

1. **Never commit your `.env` file** - Add it to `.gitignore`
2. **Never expose service_role key in frontend** - Only use anon key in frontend
3. **Use Row Level Security (RLS)** - Already enabled in the schema above
4. **Validate email domains** - Already implemented in the authentication code
5. **Use environment variables** - For all sensitive configuration

## Next Steps

- Set up database backups in Supabase dashboard
- Configure email templates for better user experience
- Set up monitoring and alerts
- Consider upgrading to paid plan for production use

## Support

For issues with Supabase:
- Documentation: https://supabase.com/docs
- Community: https://github.com/supabase/supabase/discussions

For issues with ASK DSU:
- Check the code comments
- Review error logs in browser console and server terminal
