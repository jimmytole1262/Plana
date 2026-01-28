import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authService = {
    register: (userData) => api.post('/users/register', userData),
    login: (credentials) => api.post('/users/login', credentials),
    getUserCount: () => api.get('/users/user/countUsers'),
    getUserRolesCount: () => api.get('/users/user/countUserRole'),
};

export const eventService = {
    getAllEvents: () => api.get('/events/viewAllEvents'),
    getEventById: (id) => api.get(`/events/${id}`),
    createEvent: (eventData) => api.post('/events/createEvent', eventData),
    updateEvent: (id, eventData) => api.put(`/events/update-event/${id}`, eventData),
    deleteEvent: (id) => api.delete(`/events/${id}`),
    approveEvent: (id) => api.put(`/events/approve-event/${id}`),
    getEventCount: () => api.get('/events/event/numberOfEvents'),
};

export const bookingService = {
    createBooking: (bookingData) => api.post('/bookings/createBooking', bookingData),
    getBookingsByUser: (userId) => api.get(`/bookings/users/${userId}`),
    getAllBookings: () => api.get('/bookings/getAllBookings'),
    cancelBooking: (bookingId) => api.delete(`/bookings/cancelBooking/${bookingId}`),
    getTotalRevenue: () => api.get('/bookings/book/revenue'),
};

export const issueService = {
    createIssue: (issueData) => api.post('/issues/createIssue', issueData),
    getAllIssues: () => api.get('/issues/getAllIssues'),
    createResponse: (responseData) => api.post('/issues/createResponse', responseData),
};

export default api;
