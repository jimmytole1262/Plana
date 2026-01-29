const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function diagnoseIssues() {
    try {
        console.log('🔍 DIAGNOSTIC REPORT - Events Gallery Issues\n');
        console.log('='.repeat(80));

        // 1. Check all approved events
        console.log('\n📊 APPROVED EVENTS IN DATABASE:\n');
        const approvedEvents = await pool.query(`
            SELECT event_id, title, category, "isApproved", 
                   LENGTH(category) as cat_length,
                   ASCII(SUBSTRING(category, 1, 1)) as first_char_ascii
            FROM events 
            WHERE "isApproved" = true
            ORDER BY title
        `);

        if (approvedEvents.rows.length === 0) {
            console.log('❌ NO APPROVED EVENTS FOUND!');
            console.log('This is why the gallery is empty.\n');
        } else {
            approvedEvents.rows.forEach((event, index) => {
                console.log(`Event ${index + 1}:`);
                console.log(`  Title: ${event.title}`);
                console.log(`  Category: "${event.category}"`);
                console.log(`  Category Length: ${event.cat_length} characters`);
                console.log(`  isApproved: ${event.isApproved}`);
                console.log(`  First char ASCII: ${event.first_char_ascii}`);
                console.log('');
            });
        }

        // 2. Check ALL events (approved and not)
        console.log('\n📋 ALL EVENTS (including pending):\n');
        const allEvents = await pool.query(`
            SELECT event_id, title, category, "isApproved"
            FROM events 
            ORDER BY created_at DESC
            LIMIT 10
        `);

        allEvents.rows.forEach((event, index) => {
            const status = event.isApproved ? '✅ APPROVED' : '⏳ PENDING';
            console.log(`${index + 1}. ${event.title} - Category: "${event.category}" - ${status}`);
        });

        // 3. Test filter logic
        console.log('\n\n🧪 TESTING FILTER LOGIC:\n');
        const testCategories = ['corporate', 'Corporate', 'Corporate Events', 'CORPORATE EVENTS'];
        const dbCategory = approvedEvents.rows[0]?.category || 'corporate';

        console.log(`Database category value: "${dbCategory}"`);
        console.log('\nTesting different filter values:\n');

        testCategories.forEach(filterValue => {
            const matches = dbCategory && dbCategory.toLowerCase().includes(filterValue.toLowerCase());
            const symbol = matches ? '✅' : '❌';
            console.log(`${symbol} Filter "${filterValue}" → ${matches ? 'MATCH' : 'NO MATCH'}`);
        });

        // 4. Recommendations
        console.log('\n\n💡 RECOMMENDATIONS:\n');
        if (approvedEvents.rows.length === 0) {
            console.log('1. No approved events found. Go to admin dashboard and approve events.');
            console.log('2. Check that isApproved column exists and is set to true.');
        } else {
            const cat = approvedEvents.rows[0].category;
            console.log(`1. Database stores category as: "${cat}"`);
            console.log(`2. Frontend filter expects: "corporate" (lowercase)`);
            if (cat && !cat.toLowerCase().includes('corporate')) {
                console.log('3. ⚠️  WARNING: Category does not contain "corporate"!');
                console.log(`4. You may need to update the category value in the database.`);
            } else {
                console.log('3. ✅ Category should match with case-insensitive filter');
                console.log('4. If still not working, Vercel may not have deployed yet.');
            }
        }

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error(error);
    } finally {
        await pool.end();
    }
}

diagnoseIssues();
