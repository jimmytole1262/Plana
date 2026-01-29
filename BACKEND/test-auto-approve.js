const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testEventCreation() {
    try {
        console.log('🧪 Testing Event Creation with isApproved=true...\n');

        // Test 1: Create event with isApproved=true (like admin does)
        const testEventId = `test-approved-${Date.now()}`;
        const axios = require('axios');

        const eventData = {
            title: 'Test Auto-Approved Event',
            description: 'This event should appear in the gallery immediately',
            date: '2026-02-15',
            location: 'Test City',
            category: 'corporate',
            ticket_type: 'Regular',
            price: 100,
            total_tickets: 50,
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
            isApproved: true  // Admin sets this to true
        };

        console.log('Creating event with isApproved=true via API...');
        const response = await axios.post('http://localhost:5500/events/createEvent', eventData);
        console.log('✅ Event created successfully!');
        console.log('Event ID:', response.data.event_id);

        // Check in database
        const dbCheck = await pool.query(
            'SELECT event_id, title, "isApproved", category FROM events WHERE event_id = $1',
            [response.data.event_id]
        );

        console.log('\n📊 Database Check:');
        console.log('Event ID:', dbCheck.rows[0].event_id);
        console.log('Title:', dbCheck.rows[0].title);
        console.log('isApproved:', dbCheck.rows[0].isApproved);
        console.log('Category:', dbCheck.rows[0].category);

        if (dbCheck.rows[0].isApproved === true) {
            console.log('\n✅ SUCCESS! isApproved is TRUE in database');
            console.log('✅ Event will appear in Events Gallery immediately!');
        } else {
            console.log('\n❌ FAILED! isApproved is still FALSE in database');
            console.log('❌ Event will NOT appear in Events Gallery');
        }

        // Clean up
        await pool.query('DELETE FROM events WHERE event_id = $1', [response.data.event_id]);
        console.log('\n🧹 Test event cleaned up');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    } finally {
        await pool.end();
    }
}

testEventCreation();
