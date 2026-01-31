# ASK DSU - Campus Assistant Chatbot

A Gen-Z style campus assistant chatbot that helps students find free classrooms, check library occupancy, and locate faculty in real-time.

**Now powered by Supabase!**

## Features

- **Free Classroom Finder** - Find available rooms in real-time
- **Library Occupancy** - Check live seat availability
- **Faculty Locator** - Find teachers and their availability status
- **Gen-Z Personality** - Casual, witty responses with professional data accuracy
- **Clean UI** - Minimal, enterprise-grade design

## Tech Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Supabase JS Client

**Backend:**
- Node.js + Express (Optional - can use Supabase directly from frontend)
- Supabase (PostgreSQL database + Authentication)

**Database & Auth:**
- Supabase (PostgreSQL)
- Supabase Auth (JWT-based)
- Row Level Security (RLS)

## Project Structure

```
ASK DSU/
├── index.html              # Home page
├── how-it-works.html       # How it works page
├── login.html              # Login page
├── signup.html             # Signup page
├── chatbot.html            # Chatbot interface
├── styles.css              # Main stylesheet
├── chatbot.css             # Chatbot-specific styles
├── auth.js                 # Frontend authentication with Supabase
├── chatbot.js              # Chatbot logic with Supabase queries
├── supabaseClient.js       # Frontend Supabase configuration
├── backend/
│   ├── server.js           # Express server with Supabase (optional)
│   ├── supabaseClient.js   # Backend Supabase configuration
│   ├── package.json        # Node.js dependencies
│   └── .env.example        # Environment variables template
├── SUPABASE_SETUP.md       # Complete Supabase setup guide
├── MIGRATION_SUMMARY.md    # Migration details from MySQL
└── README.md               # This file
```

## Quick Start

### 1. Set Up Supabase

**Follow the complete guide in `SUPABASE_SETUP.md`**

Quick version:
1. Create account at https://supabase.com
2. Create a new project
3. Run the SQL schema from `SUPABASE_SETUP.md`
4. Get your API credentials (URL + keys)

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3000
```

**Frontend** (`supabaseClient.js`):
```javascript
const SUPABASE_URL = 'your_supabase_project_url';
const SUPABASE_ANON_KEY = 'your_anon_public_key';
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Run the Application

**Start Backend (Optional):**
```bash
cd backend
npm start
```

**Serve Frontend:**
```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx http-server

# Or using VS Code Live Server
# Right-click index.html > Open with Live Server
```

**Access the app:**
- Open http://localhost:8000 in your browser

### 5. Test Login

Sign up with any @dsu.edu.in email address and create an account.

## Usage

1. **Open Frontend**: Navigate to your local server URL
2. **Sign Up**: Create account with `@dsu.edu.in` email
3. **Login**: Use your credentials
4. **Chat**: Ask questions like:
   - "Any free classrooms?"
   - "Is the library full?"
   - "Where is Dr. Sharma?"

## API Endpoints (Backend - Optional)

If using the backend server:

### Authentication
- `POST /api/auth/login` - Login with Supabase
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Check session

### Chatbot (Requires Auth)
- `GET /api/chatbot/classrooms/free` - Get free classrooms
- `GET /api/chatbot/library/status` - Get library status
- `GET /api/chatbot/faculty/search?name=<name>` - Search faculty

## Database Schema

Tables created in Supabase:
- `users` - User profiles
- `classrooms` - Room information
- `schedules` - Class schedules
- `library_status` - Library occupancy
- `faculty` - Faculty directory

See `SUPABASE_SETUP.md` for complete schema SQL.

## Security

- **Supabase Auth** - JWT-based authentication
- **Row Level Security (RLS)** - Database-level access control
- **Service Role Key** - Only used in backend (never exposed)
- **Anon Key** - Safe for frontend use with RLS
- **Email Domain Validation** - Only @dsu.edu emails allowed
- **Secure by Default** - Supabase handles security best practices

## Migrating from MySQL

If you're upgrading from the old MySQL version:
1. Read `MIGRATION_SUMMARY.md` for breaking changes
2. Export existing data from MySQL
3. Transform and import to Supabase
4. Users will need to create new accounts (passwords don't transfer)

## Deployment

### Frontend
Deploy to static hosting:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop folder or connect GitHub
- **GitHub Pages**: Push to gh-pages branch

Don't forget to update `supabaseClient.js` with production credentials.

### Backend (Optional)
Deploy to:
- **Railway**: Connect GitHub repo
- **Render**: Connect GitHub repo
- **Heroku**: `git push heroku main`

Set environment variables in your hosting platform.

## Environment Variables

```env
# Backend (.env)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3000

# Frontend (supabaseClient.js)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_public_key
```

## Troubleshooting

**"supabase is not defined"**
- Check script loading order in HTML files
- Ensure Supabase CDN loads before your scripts

**Authentication fails**
- Verify credentials in `.env` and `supabaseClient.js`
- Check email domain is @dsu.edu.in
- Enable email provider in Supabase dashboard

**Queries fail**
- Check Row Level Security policies in Supabase
- Verify user is authenticated
- Check Supabase SQL Editor for errors

**CORS errors**
- Supabase allows all origins by default
- Check browser console for specific error

For more troubleshooting: See `SUPABASE_SETUP.md`

## Development

### Adding New Features

1. **Add Database Table**: Use Supabase SQL Editor
2. **Add RLS Policy**: Protect with Row Level Security
3. **Update Frontend**: Add query in `chatbot.js` or `auth.js`
4. **Update Backend** (optional): Add route in `server.js`

### Testing

```bash
# Start backend
cd backend
npm start

# Serve frontend
python -m http.server 8000

# Open browser
# http://localhost:8000
```

## Future Enhancements

- Real-time updates via Supabase Realtime subscriptions
- File storage for faculty photos using Supabase Storage
- Social authentication (Google, Microsoft)
- Role-based access (Admin, Faculty, Student)
- Mobile app
- Push notifications
- Analytics dashboard

## Resources

- **Supabase Documentation**: https://supabase.com/docs
- **Supabase Auth Guide**: https://supabase.com/docs/guides/auth
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security

## License

MIT

## Support

- **Setup Issues**: Check `SUPABASE_SETUP.md`
- **Migration Questions**: Check `MIGRATION_SUMMARY.md`
- **Supabase Help**: https://supabase.com/docs
- **Project Issues**: Check browser console and server logs
