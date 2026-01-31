-- ================================================
-- ASK DSU - Complete Database Setup Script
-- ================================================
-- Run this entire script in your Supabase SQL Editor
-- Go to: https://supabase.com > Your Project > SQL Editor
-- ================================================

-- ================================================
-- 1. USERS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Service role has full access" ON users;

-- Create policies
CREATE POLICY "Users can read own data"
    ON users
    FOR SELECT
    USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role has full access"
    ON users
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ================================================
-- 2. CLASSROOMS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS classrooms (
    classroom_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number TEXT NOT NULL,
    building TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can read classrooms" ON classrooms;

-- Create policy
CREATE POLICY "Authenticated users can read classrooms"
    ON classrooms
    FOR SELECT
    TO authenticated
    USING (true);

-- ================================================
-- 3. SCHEDULES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS schedules (
    schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID REFERENCES classrooms(classroom_id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can read schedules" ON schedules;

-- Create policy
CREATE POLICY "Authenticated users can read schedules"
    ON schedules
    FOR SELECT
    TO authenticated
    USING (true);

-- Create indexes for faster queries
DROP INDEX IF EXISTS idx_schedules_classroom;
DROP INDEX IF EXISTS idx_schedules_day;
CREATE INDEX idx_schedules_classroom ON schedules(classroom_id);
CREATE INDEX idx_schedules_day ON schedules(day_of_week);

-- ================================================
-- 4. LIBRARY STATUS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS library_status (
    status_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_seats INTEGER NOT NULL DEFAULT 100,
    occupied_seats INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE library_status ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can read library status" ON library_status;

-- Create policy
CREATE POLICY "Authenticated users can read library status"
    ON library_status
    FOR SELECT
    TO authenticated
    USING (true);

-- ================================================
-- 5. FACULTY TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS faculty (
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can read faculty" ON faculty;

-- Create policy
CREATE POLICY "Authenticated users can read faculty"
    ON faculty
    FOR SELECT
    TO authenticated
    USING (true);

-- Create index for faster name searches
DROP INDEX IF EXISTS idx_faculty_name;
CREATE INDEX idx_faculty_name ON faculty(name);

-- ================================================
-- 6. INSERT SAMPLE DATA
-- ================================================

-- Sample Classrooms
INSERT INTO classrooms (room_number, building, capacity, is_available)
VALUES
    ('101', 'Block A', 40, true),
    ('102', 'Block A', 35, true),
    ('103', 'Block A', 45, true),
    ('201', 'Block B', 50, true),
    ('202', 'Block B', 45, true),
    ('203', 'Block B', 40, true),
    ('301', 'Block C', 30, true),
    ('302', 'Block C', 35, true),
    ('401', 'Block D', 60, true),
    ('Lab-1', 'Computer Lab', 50, true),
    ('Lab-2', 'Computer Lab', 50, true),
    ('Auditorium', 'Main Building', 200, true)
ON CONFLICT DO NOTHING;

-- Sample Schedules (Monday to Friday, various time slots)
-- Monday schedules
INSERT INTO schedules (classroom_id, day_of_week, start_time, end_time, subject)
SELECT
    classroom_id,
    'Monday',
    '09:00:00',
    '10:30:00',
    'Data Structures'
FROM classrooms
WHERE room_number = '101'
ON CONFLICT DO NOTHING;

INSERT INTO schedules (classroom_id, day_of_week, start_time, end_time, subject)
SELECT
    classroom_id,
    'Monday',
    '11:00:00',
    '12:30:00',
    'Database Management'
FROM classrooms
WHERE room_number = '102'
ON CONFLICT DO NOTHING;

INSERT INTO schedules (classroom_id, day_of_week, start_time, end_time, subject)
SELECT
    classroom_id,
    'Monday',
    '14:00:00',
    '15:30:00',
    'Web Development'
FROM classrooms
WHERE room_number = '201'
ON CONFLICT DO NOTHING;

-- Tuesday schedules
INSERT INTO schedules (classroom_id, day_of_week, start_time, end_time, subject)
SELECT
    classroom_id,
    'Tuesday',
    '09:00:00',
    '10:30:00',
    'Operating Systems'
FROM classrooms
WHERE room_number = '102'
ON CONFLICT DO NOTHING;

INSERT INTO schedules (classroom_id, day_of_week, start_time, end_time, subject)
SELECT
    classroom_id,
    'Tuesday',
    '11:00:00',
    '12:30:00',
    'Computer Networks'
FROM classrooms
WHERE room_number = '201'
ON CONFLICT DO NOTHING;

INSERT INTO schedules (classroom_id, day_of_week, start_time, end_time, subject)
SELECT
    classroom_id,
    'Tuesday',
    '14:00:00',
    '16:00:00',
    'AI Lab'
FROM classrooms
WHERE room_number = 'Lab-1'
ON CONFLICT DO NOTHING;

-- Wednesday schedules
INSERT INTO schedules (classroom_id, day_of_week, start_time, end_time, subject)
SELECT
    classroom_id,
    'Wednesday',
    '09:00:00',
    '10:30:00',
    'Machine Learning'
FROM classrooms
WHERE room_number = '301'
ON CONFLICT DO NOTHING;

INSERT INTO schedules (classroom_id, day_of_week, start_time, end_time, subject)
SELECT
    classroom_id,
    'Wednesday',
    '11:00:00',
    '12:30:00',
    'Software Engineering'
FROM classrooms
WHERE room_number = '202'
ON CONFLICT DO NOTHING;

-- Thursday schedules
INSERT INTO schedules (classroom_id, day_of_week, start_time, end_time, subject)
SELECT
    classroom_id,
    'Thursday',
    '10:00:00',
    '11:30:00',
    'Cloud Computing'
FROM classrooms
WHERE room_number = '203'
ON CONFLICT DO NOTHING;

INSERT INTO schedules (classroom_id, day_of_week, start_time, end_time, subject)
SELECT
    classroom_id,
    'Thursday',
    '14:00:00',
    '16:00:00',
    'Database Lab'
FROM classrooms
WHERE room_number = 'Lab-2'
ON CONFLICT DO NOTHING;

-- Friday schedules
INSERT INTO schedules (classroom_id, day_of_week, start_time, end_time, subject)
SELECT
    classroom_id,
    'Friday',
    '09:00:00',
    '10:30:00',
    'Algorithms'
FROM classrooms
WHERE room_number = '101'
ON CONFLICT DO NOTHING;

INSERT INTO schedules (classroom_id, day_of_week, start_time, end_time, subject)
SELECT
    classroom_id,
    'Friday',
    '11:00:00',
    '12:30:00',
    'Computer Graphics'
FROM classrooms
WHERE room_number = '302'
ON CONFLICT DO NOTHING;

-- Sample Faculty
INSERT INTO faculty (name, department, cabin_number, email, is_available)
VALUES
    ('Dr. Rajesh Sharma', 'Computer Science', 'A-201', 'sharma@dsu.edu.in', true),
    ('Dr. Priya Patel', 'Computer Science', 'A-202', 'patel@dsu.edu.in', true),
    ('Dr. Amit Kumar', 'Electronics', 'B-101', 'kumar@dsu.edu.in', false),
    ('Dr. Sneha Singh', 'Mathematics', 'C-305', 'singh@dsu.edu.in', true),
    ('Prof. Vikram Desai', 'Computer Science', 'A-203', 'desai@dsu.edu.in', true),
    ('Dr. Anjali Verma', 'Physics', 'D-101', 'verma@dsu.edu.in', true),
    ('Prof. Ravi Mehta', 'Computer Science', 'A-204', 'mehta@dsu.edu.in', false),
    ('Dr. Kavita Nair', 'Chemistry', 'D-202', 'nair@dsu.edu.in', true),
    ('Dr. Suresh Reddy', 'Computer Science', 'A-205', 'reddy@dsu.edu.in', true),
    ('Prof. Meena Gupta', 'English', 'C-401', 'gupta@dsu.edu.in', true)
ON CONFLICT DO NOTHING;

-- Initial Library Status (will be inserted only if table is empty)
INSERT INTO library_status (total_seats, occupied_seats, last_updated)
SELECT 100, 45, NOW()
WHERE NOT EXISTS (SELECT 1 FROM library_status LIMIT 1);

-- ================================================
-- SETUP COMPLETE!
-- ================================================
-- You can now:
-- 1. Start your backend server: cd backend && npm start
-- 2. Open your frontend and test the chatbot
-- 3. Try queries like:
--    - "Show me free classrooms"
--    - "What's the library status?"
--    - "Where is Dr. Sharma?"
-- ================================================
