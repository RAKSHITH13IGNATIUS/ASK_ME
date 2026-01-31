# Fixing Browser Tracking Prevention Issues

## The Problem

Microsoft Edge (and some other browsers) have **Tracking Prevention** features that block external CDN scripts, including the Supabase library. This causes errors like:

- "Tracking Prevention blocked access to storage"
- "Cannot read properties of undefined (reading 'signInWithPassword')"
- "Identifier 'supabase' has already been declared"

## What I've Fixed

✅ Changed CDN from jsdelivr to unpkg (less likely to be blocked)
✅ Added error handling in supabaseClient.js
✅ Better error messages to help diagnose issues

## Solution Options

### Option 1: Try Different Browser (Recommended)

**Use Chrome or Firefox** instead of Edge for development:

1. Download Chrome: https://www.google.com/chrome/
2. Download Firefox: https://www.firefox.com/
3. Open http://localhost:8000 in the new browser
4. Test login and chatbot

### Option 2: Disable Tracking Prevention in Edge

If you want to keep using Edge:

1. Open Microsoft Edge
2. Click the three dots (...) in the top right corner
3. Go to **Settings**
4. Click **Privacy, search, and services** in the left sidebar
5. Under **Tracking prevention**, select **Basic** (instead of Balanced or Strict)
6. Scroll down to **Privacy** section
7. Turn OFF "Block potential unwanted apps"
8. Restart Edge browser
9. Go to http://localhost:8000 and try again

**OR** Allow localhost specifically:

1. In Edge, go to http://localhost:8000
2. Click the lock icon (🔒) in the address bar
3. Click "Cookies and site permissions"
4. Allow "JavaScript" and "Cookies"
5. Refresh the page (Ctrl+R)

### Option 3: Use Incognito/Private Mode

Sometimes tracking prevention is less strict in private mode:

1. Open Edge
2. Press **Ctrl+Shift+N** (opens private window)
3. Go to http://localhost:8000
4. Test the application

## How to Verify It's Fixed

After trying one of the solutions above:

1. Go to http://localhost:8000
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. You should see:
   - ✅ "Supabase client initialized successfully"
   - ✅ No red errors about "supabase" being undefined

5. Try to login or sign up
6. It should work without errors!

## Still Getting Errors?

### Check Console for Specific Errors

Press **F12** and check the Console tab. Look for:

1. **Red errors** - these are critical
2. **Orange warnings** about tracking - these can usually be ignored if there are no red errors
3. Errors mentioning "supabase", "undefined", or "CORS"

### Test Supabase Connection Manually

In browser console (F12), type:

```javascript
// Check if Supabase loaded
console.log(typeof window.supabase);
// Should show: "object"

// Check if client created
console.log(supabase);
// Should show: SupabaseClient object
```

If these show "undefined", the CDN is still blocked.

## Alternative: Run Without Tracking Prevention Blocking

If none of the above work, you can use a simple local server that bundles the library:

1. Install http-server globally:
```bash
npm install -g http-server
```

2. Serve the frontend:
```bash
cd "D:\Project\ASK DSU"
http-server -p 8000
```

3. Open http://localhost:8000

## Notes

- **Tracking prevention is good for security**, but it can block legitimate development tools
- For production, you'd bundle all JavaScript using tools like Webpack or Vite
- For development, using Chrome/Firefox is usually easier than fighting with Edge's settings

## What Changed in Your Code

I updated these files:
- ✅ `login.html` - Changed CDN to unpkg
- ✅ `signup.html` - Changed CDN to unpkg
- ✅ `chatbot.html` - Changed CDN to unpkg
- ✅ `supabaseClient.js` - Added error checking and better messages

The new CDN URL is less likely to be blocked by tracking prevention.
