const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkCategories() {
    try {
        console.log('📊 Checking event categories in database...\n');

        const result = await pool.query(`
            SELECT event_id, title, category, "isApproved" 
            FROM events 
            WHERE "isApproved" = true
            ORDER BY title
        `);

        console.log('Approved Events in Database:');
        console.log('='.repeat(80));

        result.rows.forEach(event => {
            console.log(`Title: ${event.title}`);
            console.log(`Category: "${event.category}" (type: ${typeof event.category})`);
            console.log(`isApproved: ${event.isApproved}`);
            console.log('-'.repeat(80));
        });

        console.log('\n📋 Summary:');
        console.log(`Total approved events: ${result.rows.length}`);

        const categories = result.rows.map(e => e.category);
        const uniqueCategories = [...new Set(categories)];
        console.log(`\nUnique categories found: ${uniqueCategories.join(', ')}`);

        console.log('\n💡 Filter expects: corporate, weddings, concerts, parties, social, festivals');
        console.log('   (all lowercase)');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkCategories();
