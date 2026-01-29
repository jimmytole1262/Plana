const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function verifyAndTest() {
    try {
        console.log('📊 Checking category column configuration...\n');

        const columnInfo = await pool.query(`
            SELECT column_name, data_type, character_maximum_length, column_default
            FROM information_schema.columns 
            WHERE table_name='events' AND column_name='category'
        `);

        if (columnInfo.rows.length === 0) {
            console.log('❌ Category column does NOT exist!');
            return;
        }

        console.log('✅ Category column exists:');
        console.log(columnInfo.rows[0]);
        console.log('');

        // Test event creation
        console.log('🧪 Testing event creation with category...\n');

        const testEventId = `test-${Date.now()}`;
        const insertResult = await pool.query(`
            INSERT INTO events 
            (event_id, title, description, date, location, ticket_type, price, image, total_tickets, available_tickets, category, "isApproved")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `, [
            testEventId,
            'Test Event - Migration Verification',
            'Testing if category column works correctly',
            new Date(2026, 2, 1),
            'Test Location',
            'Regular',
            50,
            'test.jpg',
            100,
            100,
            'corporate',
            false
        ]);

        console.log('✅ Event created successfully!');
        console.log('Event ID:', insertResult.rows[0].event_id);
        console.log('Category:', insertResult.rows[0].category);
        console.log('');

        // Clean up test event
        await pool.query('DELETE FROM events WHERE event_id = $1', [testEventId]);
        console.log('✅ Test event cleaned up\n');

        console.log('🎉 SUCCESS! Event creation with category is working correctly!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await pool.end();
    }
}

verifyAndTest();
