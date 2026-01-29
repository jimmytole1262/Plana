const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkDB() {
    try {
        const result = await pool.query(`
            SELECT title, category, "isApproved" 
            FROM events 
            WHERE "isApproved" = true 
            ORDER BY created_at DESC
        `);

        console.log('\n✅ APPROVED EVENTS ON PRODUCTION:\n');
        console.log('='.repeat(60));

        result.rows.forEach((event, i) => {
            console.log(`\n${i + 1}. ${event.title}`);
            console.log(`   Category: "${event.category}"`);
            console.log(`   Approved: ${event.isApproved}`);
        });

        console.log('\n' + '='.repeat(60));
        console.log(`\nTotal approved events: ${result.rows.length}\n`);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkDB();
