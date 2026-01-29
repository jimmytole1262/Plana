const axios = require('axios');

async function quickTest() {
    try {
        console.log('🧪 Quick Test: Creating event with isApproved=true\n');

        const eventData = {
            title: 'Gallery Test Event',
            description: 'Testing if this appears in the gallery automatically',
            date: '2026-02-20',
            location: 'Nairobi',
            category: 'concerts',
            ticket_type: 'VIP',
            price: 2500,
            total_tickets: 200,
            image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
            isApproved: true  // This should make it appear in gallery
        };

        const response = await axios.post('http://localhost:5500/events/createEvent', eventData);

        console.log('✅ Event created!');
        console.log('Event ID:', response.data.event_id || response.data.eventId);
        console.log('\n📍 Next steps:');
        console.log('1. Go to: https://plana-beryl.vercel.app/events');
        console.log('2. Check if "Gallery Test Event" appears');
        console.log('3. If it does, the fix worked! 🎉\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

quickTest();
