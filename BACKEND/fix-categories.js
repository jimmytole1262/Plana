const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function fixCategories() {
    try {
        console.log('🔧 Standardizing Event Categories\n');
        console.log('='.repeat(80));

        // Show current state
        console.log('\n📊 BEFORE - Current categories:\n');
        const before = await pool.query(`
            SELECT event_id, title, category
            FROM events
            ORDER BY title
        `);

        before.rows.forEach((event, i) => {
            console.log(`${i + 1}. ${event.title} → Category: "${event.category}"`);
        });

        // Standardize categories to match filter expectations
        console.log('\n\n🔄 Updating categories to standard format...\n');

        const updates = [
            {
                pattern: '%corporate%',
                newCategory: 'corporate',
                description: 'Corporate/Business events'
            },
            {
                pattern: '%wedding%',
                newCategory: 'weddings',
                description: 'Wedding events'
            },
            {
                pattern: '%concert%',
                newCategory: 'concerts',
                description: 'Concert/Music events'
            },
            {
                pattern: '%party%',
                newCategory: 'parties',
                description: 'Party events'
            },
            {
                pattern: '%social%',
                newCategory: 'social',
                description: 'Social gatherings'
            },
            {
                pattern: '%festival%',
                newCategory: 'festivals',
                description: 'Festival events'
            }
        ];

        for (const update of updates) {
            const result = await pool.query(`
                UPDATE events
                SET category = $1
                WHERE category ILIKE $2
            `, [update.newCategory, update.pattern]);

            if (result.rowCount > 0) {
                console.log(`✅ Updated ${result.rowCount} event(s) to "${update.newCategory}"`);
            }
        }

        // Show final state
        console.log('\n\n📊 AFTER - Updated categories:\n');
        const after = await pool.query(`
            SELECT event_id, title, category
            FROM events
            ORDER BY title
        `);

        after.rows.forEach((event, i) => {
            console.log(`${i + 1}. ${event.title} → Category: "${event.category}"`);
        });

        // Summary
        console.log('\n\n✅ Category standardization complete!');
        console.log('\nStandard categories:');
        console.log('  - corporate');
        console.log('  - weddings');
        console.log('  - concerts');
        console.log('  - parties');
        console.log('  - social');
        console.log('  - festivals');
        console.log('  - other (for everything else)\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

fixCategories();
