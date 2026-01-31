# Quick Start Guide

Get ASK DSU running in 5 minutes.

## Prerequisites

- MySQL installed and running
- Node.js installed (v14 or higher)

## Step-by-Step Setup

### 1. Database (2 minutes)

```bash
# Login to MySQL
mysql -u root -p

# Run these commands:
CREATE DATABASE ask_dsu;
USE ask_dsu;
SOURCE database/schema.sql;
SOURCE database/sample_data.sql;
EXIT;
```

### 2. Backend (1 minute)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env    # Windows
# OR
cp .env.example .env      # Mac/Linux

# Edit .env file - Update DB_PASSWORD to match your MySQL password

# Start server
npm start
```

You should see:
```
✓ Database connected successfully
✓ Server running on http://localhost:3000
```

### 3. Frontend (1 minute)

**Using VS Code:**
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"
3. Opens at `http://localhost:5500`

**OR using command line:**
```bash
# Python
python -m http.server 5500

# OR Node.js
npx http-server -p 5500
```

### 4. Test It (1 minute)

1. Open browser: `http://localhost:5500`
2. Click "Login"
3. Use credentials:
   - Email: `test@dsu.edu`
   - Password: `password123`
4. Try asking:
   - "Any free classrooms?"
   - "Library status?"
   - "Where is Dr. Sharma?"

## Done!

Your campus assistant is now running.

## Common Issues

**"Database connection failed"**
→ MySQL not running or wrong password in `.env`

**"Cannot reach server"**
→ Backend not started. Run `npm start` in backend folder

**"Invalid credentials"**
→ Use `test@dsu.edu` / `password123` or check sample_data.sql was imported

## File Locations

- Frontend: `http://localhost:5500`
- Backend: `http://localhost:3000`
- API Health: `http://localhost:3000/api/health`

## Next Steps

- Add more sample data in database
- Customize chatbot responses
- Update library occupancy in real-time
- Add more faculty members
