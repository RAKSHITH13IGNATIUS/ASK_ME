# ASK DSU - Quick Start Guide

## What I've Fixed For You

✅ **Fixed package.json** - Now correctly references `server.js`
✅ **Created database setup script** - Ready to run in Supabase

## Next Steps to Get Running

### Step 1: Set Up Supabase Database (5 minutes)

1. **Open your Supabase Dashboard**
   - Go to: https://supabase.com
   - Navigate to your project: `femdtxdwjopbixjtwpsn`

2. **Run the SQL Setup Script**
   - Click on **SQL Editor** in the left sidebar
   - Click **New Query**
   - Open the file: `backend/database-setup.sql`
   - **Copy the entire contents** and paste into the SQL Editor
   - Click **Run** (or press Ctrl+Enter)

3. **Verify Tables Were Created**
   - Click on **Table Editor** in the left sidebar
   - You should see these tables:
     - ✅ users
     - ✅ classrooms (with 12 sample rooms)
     - ✅ schedules (with sample class schedules)
     - ✅ library_status (with initial data)
     - ✅ faculty (with 10 sample faculty members)

### Step 2: Enable Email Authentication

1. Go to **Authentication** > **Providers** in Supabase
2. Make sure **Email** is enabled
3. *For testing only*, disable email confirmation:
   - Go to **Authentication** > **Settings**
   - Find "Email Auth" section
   - Turn OFF "Confirm email" (so you don't need to verify emails during testing)

### Step 3: Start the Backend Server

```bash
cd backend
npm start
```

You should see:
```
Server running on http://localhost:3000
Connected to Supabase successfully
```

### Step 4: Serve the Frontend

Open a **new terminal** in the project root and run:

**Option 1: Using Python**
```bash
python -m http.server 8000
```

**Option 2: Using VS Code Live Server**
- Right-click on `index.html`
- Select "Open with Live Server"

**Option 3: Using Node.js http-server**
```bash
npx http-server -p 8000
```

### Step 5: Test the Application

1. **Open your browser**
   - Go to: http://localhost:8000

2. **Sign Up**
   - Click "Get Started"
   - Create an account with email ending in `@dsu.edu.in`
   - Example: `test@dsu.edu.in`

3. **Login**
   - Use the credentials you just created

4. **Test the Chatbot**
   Try these queries:
   - "Show me free classrooms"
   - "What's the library status?"
   - "Where is Dr. Sharma?"
   - "Find Dr. Patel"
   - "Is the library full?"

## Sample Data Included

### Classrooms (12 rooms)
- Block A: 101, 102, 103
- Block B: 201, 202, 203
- Block C: 301, 302
- Block D: 401
- Computer Lab: Lab-1, Lab-2
- Main Building: Auditorium

### Faculty (10 professors)
- Dr. Rajesh Sharma (Computer Science, A-201)
- Dr. Priya Patel (Computer Science, A-202)
- Dr. Amit Kumar (Electronics, B-101) - Currently unavailable
- Dr. Sneha Singh (Mathematics, C-305)
- Prof. Vikram Desai (Computer Science, A-203)
- And 5 more...

### Class Schedules
- Monday to Friday
- Various time slots (9 AM - 4 PM)
- Different subjects

### Library Status
- Total seats: 100
- Currently occupied: 45
- Availability: 55%

## Troubleshooting

### Backend won't start
- Check that `.env` file exists in `backend/` folder
- Verify Supabase credentials are correct
- Make sure port 3000 is not in use

### Can't sign up
- Make sure email ends with `@dsu.edu.in`
- Check that Email auth is enabled in Supabase
- Check browser console for errors

### Chatbot not responding
- Make sure you're logged in
- Check that backend is running
- Open browser DevTools (F12) and check Console for errors
- Verify database tables were created in Supabase

### "No free classrooms" message
- This is normal! The chatbot checks the current time
- If it's outside class hours or on weekends, different classrooms will be free
- Try asking at different times or modify the schedules in Supabase

## What's Next?

Once everything is working, you can:
- Add more classrooms and schedules
- Update library status in real-time
- Add more faculty members
- Customize the Gen-Z responses
- Add features like notifications, favorites, etc.

## Need Help?

Check these files for more info:
- `README.md` - Complete project documentation
- `SUPABASE_SETUP.md` - Detailed Supabase guide
- `PRD.md` - Product requirements

Enjoy your ASK DSU chatbot! 🎓
