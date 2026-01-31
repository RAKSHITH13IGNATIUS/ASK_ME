// Supabase Client Configuration
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables!');
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
    process.exit(1);
}

// Create Supabase client with service role key (for backend operations)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

module.exports = supabase;
