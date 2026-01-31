# ASK DSU - Troubleshooting Connection Errors

## Common Issues and Solutions

### Issue 1: "Connection Error" or "Can't reach the database"

**Possible Causes:**
1. Row Level Security (RLS) policies are blocking frontend queries
2. Supabase project is paused (free tier pauses after inactivity)
3. Incorrect Supabase credentials
4. Browser blocking requests (CORS)

**Solutions:**

#### Step 1: Verify Supabase Project is Active
1. Go to https://supabase.com/dashboard
2. Check if your project shows "Paused" status
3. If paused, click "Restore project"

#### Step 2: Fix RLS Policies
The most common issue is Row Level Security blocking reads from the frontend.

1. Open Supabase SQL Editor
2. Run the script: `backend/fix-rls-policies.sql`
3. This will update policies to allow authenticated users to read data

#### Step 3: Check Browser Console
1. Open your browser's Developer Tools (Press F12)
2. Go to the Console tab
3. Look for errors like:
   - "Failed to fetch"
   - "permission denied for table"
   - "CORS error"
   - "row-level security policy"

#### Step 4: Test Supabase Connection
1. Open browser console (F12)
2. On login/signup/chatbot page, type:
```javascript
// Test if Supabase client is loaded
console.log(supabase);

// Test query
const { data, error } = await supabase.from('classrooms').select('*');
console.log('Data:', data);
console.log('Error:', error);
```

### Issue 2: "Permission Denied" Errors

**Cause:** Row Level Security is too restrictive

**Solution:**
1. Run `backend/fix-rls-policies.sql` in Supabase SQL Editor
2. This updates policies to allow reading data

### Issue 3: Login/Signup Not Working

**Possible Causes:**
1. Email confirmation required
2. Email domain validation
3. Password too weak

**Solutions:**

#### Disable Email Confirmation (for testing)
1. Go to Supabase Dashboard
2. Click **Authentication** > **Settings**
3. Find "Email Auth" section
4. Turn OFF "Confirm email"

#### Use Correct Email Format
- Must end with `@dsu.edu.in`
- Example: `student@dsu.edu.in`

#### Password Requirements
- Minimum 6 characters
- Supabase may require uppercase, lowercase, numbers

### Issue 4: "No free classrooms" Even Though Database Has Data

**Cause:** Time zone mismatch or schedule filtering issue

**Solution:** The chatbot has been updated to fix time comparison logic. Refresh your browser.

### Issue 5: Frontend Can't Load Supabase Library

**Symptoms:** Console shows "supabase is not defined"

**Solution:**
1. Check internet connection (CDN must be accessible)
2. Make sure `https://cdn.jsdelivr.net` is not blocked
3. Try loading the page with cache cleared (Ctrl+Shift+R)

### Issue 6: CORS Errors

**Symptoms:** Console shows "CORS policy blocked"

**Solution:**
1. Make sure you're accessing via `http://localhost:8000` not `file://`
2. Backend CORS is already configured for localhost
3. Check that backend is running on port 3000

## Quick Diagnostic Steps

### 1. Check Backend Status
```bash
# Is backend running?
# You should see: "Server running on http://localhost:3000"
```

### 2. Check Frontend Server
```bash
# Is frontend being served?
# Should be accessible at http://localhost:8000
```

### 3. Check Supabase Dashboard
- Project active (not paused)?
- Email provider enabled?
- Tables exist with data?

### 4. Check Browser Console (F12)
- Any red errors?
- What's the exact error message?

## Testing Queries Directly in Supabase

1. Go to Supabase Dashboard > SQL Editor
2. Run these test queries:

```sql
-- Test classrooms
SELECT * FROM classrooms LIMIT 5;

-- Test schedules
SELECT * FROM schedules LIMIT 5;

-- Test faculty
SELECT * FROM faculty LIMIT 5;

-- Test library status
SELECT * FROM library_status LIMIT 1;

-- Check RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

## Files to Run When Having Issues

1. **Backend connection test:**
   ```bash
   cd backend
   node test-connection.js
   ```

2. **Fix RLS policies:**
   - Open Supabase SQL Editor
   - Run `backend/fix-rls-policies.sql`

3. **Recreate database:**
   - Open Supabase SQL Editor
   - Run `backend/database-setup.sql`

## Still Having Issues?

### Check These:

1. **.env file exists** in `backend/` folder with correct credentials
2. **Frontend supabaseClient.js** has correct URL and anon key
3. **Both servers running** (backend on 3000, frontend on 8000)
4. **Supabase project not paused**
5. **Email provider enabled** in Supabase
6. **RLS policies updated** using fix-rls-policies.sql

### Get Detailed Error Info

Open browser console and run:
```javascript
// Check Supabase connection
const testConnection = async () => {
    console.log('Supabase URL:', supabase.supabaseUrl);

    const { data: classrooms, error: e1 } = await supabase.from('classrooms').select('*');
    console.log('Classrooms:', classrooms, 'Error:', e1);

    const { data: faculty, error: e2 } = await supabase.from('faculty').select('*');
    console.log('Faculty:', faculty, 'Error:', e2);

    const { data: library, error: e3 } = await supabase.from('library_status').select('*');
    console.log('Library:', library, 'Error:', e3);
};

testConnection();
```

This will show exactly which queries are failing and why.
