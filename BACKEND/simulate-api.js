const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkApiSimulation() {
    try {
        // This simulates what viewAllEvents() does
        const query = 'SELECT event_id, title, description, date, location, ticket_type, price, image, total_tickets, available_tickets, "isApproved" as "isApproved" FROM Events';
        const result = await pool.query(query);
        const rows = result.rows;

        const mappedEvents = rows.map((event) => ({
            ...event,
            id: event.event_id,
            eventId: event.event_id,
            start_date: event.date,
            tickets_available: event.available_tickets,
            tickets_total: event.total_tickets,
            capacity: event.total_tickets,
            ticket_price: event.price
        }));

        console.log(JSON.stringify(mappedEvents, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await pool.end();
    }
}

checkApiSimulation();
