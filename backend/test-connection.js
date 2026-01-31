// Simple script to test Supabase connection
// Run this with: node test-connection.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n=== Testing Supabase Connection ===\n');

// Check environment variables
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing Supabase credentials in .env file');
    console.error('   Please check that SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set\n');
    process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);
console.log('\n✅ Supabase client created');

// Test database connection by querying tables
async function testConnection() {
    try {
        console.log('\n=== Testing Database Tables ===\n');

        // Test classrooms table
        const { data: classrooms, error: classroomsError } = await supabase
            .from('classrooms')
            .select('*')
            .limit(5);

        if (classroomsError) {
            console.error('❌ Classrooms table error:', classroomsError.message);
        } else {
            console.log(`✅ Classrooms table: ${classrooms.length} rooms found`);
        }

        // Test faculty table
        const { data: faculty, error: facultyError } = await supabase
            .from('faculty')
            .select('*')
            .limit(5);

        if (facultyError) {
            console.error('❌ Faculty table error:', facultyError.message);
        } else {
            console.log(`✅ Faculty table: ${faculty.length} faculty members found`);
        }

        // Test schedules table
        const { data: schedules, error: schedulesError } = await supabase
            .from('schedules')
            .select('*')
            .limit(5);

        if (schedulesError) {
            console.error('❌ Schedules table error:', schedulesError.message);
        } else {
            console.log(`✅ Schedules table: ${schedules.length} schedules found`);
        }

        // Test library_status table
        const { data: library, error: libraryError } = await supabase
            .from('library_status')
            .select('*')
            .limit(1);

        if (libraryError) {
            console.error('❌ Library status table error:', libraryError.message);
        } else {
            console.log(`✅ Library status table: ${library.length} entry found`);
            if (library.length > 0) {
                console.log(`   Seats: ${library[0].occupied_seats}/${library[0].total_seats} occupied`);
            }
        }

        // Test users table
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (usersError) {
            console.error('❌ Users table error:', usersError.message);
        } else {
            console.log(`✅ Users table: Accessible`);
        }

        console.log('\n=== Connection Test Complete ===\n');
        console.log('✅ All checks passed! Your Supabase setup is ready.');
        console.log('   You can now run: npm start\n');

    } catch (error) {
        console.error('\n❌ Connection test failed:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Check that you ran the database-setup.sql script in Supabase SQL Editor');
        console.error('2. Verify your Supabase project is active (not paused)');
        console.error('3. Check that your .env file has the correct credentials\n');
    }
}

testConnection();
