const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkFullEventData() {
    try {
        const result = await pool.query(`
            SELECT * 
            FROM events 
            WHERE "isApproved" = true 
            ORDER BY created_at DESC
            LIMIT 3
        `);

        console.log('\n📊 FULL EVENT DATA FROM PRODUCTION:\n');
        console.log('='.repeat(80));

        result.rows.forEach((event, i) => {
            console.log(`\nEVENT ${i + 1}:`);
            console.log(`  event_id: ${event.event_id}`);
            console.log(`  title: "${event.title}"`);
            console.log(`  description: "${event.description?.substring(0, 100)}..."`);
            console.log(`  date: ${event.date}`);
            console.log(`  location: ${event.location}`);
            console.log(`  category: "${event.category}"`);
            console.log(`  ticket_type: ${event.ticket_type}`);
            console.log(`  price: ${event.price}`);
            console.log(`  image: ${event.image}`);
            console.log(`  total_tickets: ${event.total_tickets}`);
            console.log(`  available_tickets: ${event.available_tickets}`);
            console.log(`  isApproved: ${event.isApproved}`);
        });

        console.log('\n' + '='.repeat(80));

        // Check for NULL fields
        console.log('\n⚠️  CHECKING FOR MISSING DATA:');
        result.rows.forEach((event, i) => {
            const missing = [];
            if (!event.title) missing.push('title');
            if (!event.description) missing.push('description');
            if (!event.location) missing.push('location');
            if (!event.image) missing.push('image');
            if (!event.ticket_type) missing.push('ticket_type');

            if (missing.length > 0) {
                console.log(`  Event ${i + 1} (${event.event_id}) missing: ${missing.join(', ')}`);
            } else {
                console.log(`  Event ${i + 1} (${event.event_id}): ✅ All fields present`);
            }
        });

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkFullEventData();
