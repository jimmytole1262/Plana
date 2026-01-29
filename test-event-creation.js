const axios = require('axios');

const testLocal = async () => {
    console.log('Testing local backend...');
    try {
        const response = await axios.post('http://localhost:5500/events/createEvent', {
            title: 'Test Event',
            description: 'Test Description',
            date: '2026-01-30',
            location: 'Test Location',
            category: 'corporate',
            ticket_type: 'Regular',
            price: 100,
            total_tickets: 100,
            image: 'test.jpg'
        });
        console.log('✅ Local backend SUCCESS:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log('❌ Local backend FAILED:', error.response?.status);
        console.log('Error:', error.response?.data || error.message);
    }
};

const testProduction = async () => {
    console.log('\nTesting production backend...');
    try {
        const response = await axios.post('https://plana-production.up.railway.app/events/createEvent', {
            title: 'Test Event Production',
            description: 'Test Description',
            date: '2026-01-30',
            location: 'Test Location',
            category: 'corporate',
            ticket_type: 'Regular',
            price: 100,
            total_tickets: 100,
            image: 'test.jpg'
        });
        console.log('✅ Production backend SUCCESS:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log('❌ Production backend FAILED:', error.response?.status);
        console.log('Error:', error.response?.data || error.message);
        console.log('Full error:', error.message);
    }
};

(async () => {
    await testLocal();
    await testProduction();
})();
