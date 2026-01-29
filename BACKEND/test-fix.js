const axios = require('axios');

async function testAutoApproval() {
    console.log('🧪 Testing Auto-Approval Fix\n');
    console.log('====================================\n');

    try {
        // Wait a bit for backend to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));

        const eventData = {
            title: 'Auto-Approval Test Event',
            description: 'Testing if admin-created events are auto-approved',
            date: '2026-03-01',
            location: 'Nairobi',
            category: 'corporate',
            ticket_type: 'Regular',
            price: 1500,
            total_tickets: 100,
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
            isApproved: true  // Admin sets this
        };

        console.log('📤 Creating event with isApproved=true...\n');
        const response = await axios.post('http://localhost:5500/events/createEvent', eventData);

        console.log('✅ Event Created Successfully!');
        console.log('Event ID:', response.data.event_id);
        console.log('');

        // Fetch all events to verify it appears in the list
        console.log('📊 Fetching all events from API...\n');
        const eventsResponse = await axios.get('http://localhost:5500/events/viewAllEvents');
        const events = eventsResponse.data;

        const createdEvent = events.find(e => e.event_id === response.data.event_id);

        if (createdEvent) {
            console.log('Event Found in Database:');
            console.log('  Title:', createdEvent.title);
            console.log('  isApproved:', createdEvent.isApproved);
            console.log('  Category:', createdEvent.category);
            console.log('');

            if (createdEvent.isApproved === true) {
                console.log('✅✅✅ SUCCESS! ✅✅✅');
                console.log('Event is auto-approved and will appear in gallery!');
                console.log('');
                console.log('🎉 The fix is working correctly!');
                console.log('');
                console.log('📋 Next Step:');
                console.log('Deploy to Railway so production site works too.');
            } else {
                console.log('❌ FAILED - isApproved is still false');
                console.log('The fix did not work as expected.');
            }
        } else {
            console.log('⚠️  Event created but not found in events list');
        }

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
        console.log('');
        console.log('⚠️  Backend might not be fully started yet.');
        console.log('Wait 10 seconds and try running this script again.');
    }
}

testAutoApproval();
