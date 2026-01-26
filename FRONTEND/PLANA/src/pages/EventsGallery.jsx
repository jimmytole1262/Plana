import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { eventService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';
import './EventsGallery.css';

const EventsGallery = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await eventService.getAllEvents();
                // Filter only approved events for regular gallery
                setEvents(response.data?.filter(e => e.isApproved) || []);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();

        // Animations
        gsap.from(".gallery-header", { opacity: 0, scale: 0.9, duration: 1 });
        gsap.from(".filter-bar", { opacity: 0, y: 20, delay: 0.5 });
    }, []);

    const filteredEvents = events.filter(event => {
        const matchesFilter = filter === 'All' || event.ticket_type === filter;
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleBook = async (eventId) => {
        if (!user) {
            alert("Please login to book events");
            window.location.href = '/login';
            return;
        }

        try {
            const bookingData = {
                user_id: user.user_id,
                event_id: eventId,
                booking_date: new Date().toISOString()
            };
            const response = await bookingService.createBooking(bookingData);
            if (response.data.message === 'Booking created successfully') {
                alert("Event booked successfully! View it in your dashboard.");
            } else {
                alert(response.data.message || "Booking failed");
            }
        } catch (error) {
            console.error("Booking error:", error);
            alert("Failed to create booking. Please try again.");
        }
    };

    return (
        <div className="gallery-wrapper">
            <Navbar />
            <div className="gallery-content">
                <header className="gallery-header">
                    <h1>Curated Experiences</h1>
                    <p>Discover world-class events tailored for you.</p>
                </header>

                <div className="filter-bar">
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <div className="filter-chips">
                        {['All', 'VIP', 'Regular', 'Premium'].map(cat => (
                            <button
                                key={cat}
                                className={`filter-chip ${filter === cat ? 'active' : ''}`}
                                onClick={() => setFilter(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Refining the gallery...</div>
                ) : filteredEvents.length > 0 ? (
                    <div className="events-grid">
                        {filteredEvents.map((event, index) => (
                            <div key={event.event_id} className="event-card">
                                <div className="event-image-container">
                                    <img src={event.image || 'https://images.unsplash.com/photo-1514525253361-bee24387c974'} alt={event.title} />
                                    <div className="event-price">${event.price}</div>
                                </div>
                                <div className="event-details">
                                    <span className="event-tag">{event.ticket_type}</span>
                                    <h3>{event.title || "Untitled Event"}</h3>
                                    <p className="event-meta">
                                        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                                        <span>📍 {event.location}</span>
                                    </p>
                                    <p className="event-desc">{event.description?.substring(0, 80) || "No description available"}...</p>
                                    <div className="event-footer">
                                        <span className={`availability ${event.available_tickets < 10 ? 'low' : ''}`}>
                                            {event.available_tickets} slots left
                                        </span>
                                        <button
                                            className="book-btn"
                                            onClick={() => handleBook(event.event_id)}
                                            disabled={event.available_tickets === 0}
                                        >
                                            {event.available_tickets === 0 ? 'Sold Out' : 'Book Now'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state-container">
                        <div className="empty-state-card glass-card">
                            <div className="empty-state-icon">✨</div>
                            <h2>The Stage is Being Set</h2>
                            <p>
                                Our next masterpiece of curated experiences is currently in the works.
                                We are orchestrating something extraordinary for our exclusive guests.
                            </p>
                            <div className="empty-state-footer">
                                <span>Stay Tuned • Something Grand is Coming</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default EventsGallery;
