import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { eventService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';
import './EventsGallery.css';

const EventsGallery = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(searchParams.get('category') || 'all');
    const [searchTerm, setSearchTerm] = useState('');
    const scrollContainerRef = React.useRef(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await eventService.getAllEvents();
                console.log('API Response:', response.data);
                // Filter only approved events for regular gallery
                setEvents(response.data?.filter(e => e.isApproved) || []);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesFilter = filter === 'all' ||
            (event.category && event.category.toLowerCase().includes(filter.toLowerCase()));
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
                        {['all', 'corporate', 'weddings', 'concerts', 'parties', 'social', 'festivals'].map(cat => (
                            <button
                                key={cat}
                                className={`filter-chip ${filter === cat ? 'active' : ''}`}
                                onClick={() => {
                                    setFilter(cat);
                                    if (cat === 'all') {
                                        setSearchParams({});
                                    } else {
                                        setSearchParams({ category: cat });
                                    }
                                }}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Refining the gallery...</div>
                ) : filteredEvents.length > 0 ? (
                    <div className="carousel-wrapper">
                        <button className="nav-btn prev" onClick={() => scroll('left')} aria-label="Previous">‹</button>
                        <div className="events-grid carousel-container" ref={scrollContainerRef}>
                            {filteredEvents.map((event) => (
                                <div key={event.event_id} className="event-card">
                                    <div className="event-image-container">
                                        <img src={event.image || 'https://images.unsplash.com/photo-1514525253361-bee24387c974'} alt={event.title} />
                                        <div className="event-price">${event.price}</div>
                                    </div>
                                    <div className="event-details">
                                        <div className="event-header-info">
                                            <span className="event-tag">{event.ticket_type}</span>
                                            <h3>{event.title || "Untitled Event"}</h3>
                                        </div>
                                        <p className="event-meta">
                                            <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                                            <span>📍 {event.location}</span>
                                        </p>
                                        <p className="event-desc">{event.description?.substring(0, 100) || "Explore this curated experience..."}...</p>
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
                        <button className="nav-btn next" onClick={() => scroll('right')} aria-label="Next">›</button>
                    </div>
                ) : (
                    <div className="loading">No events found in this category.</div>
                )}
            </div>
        </div>
    );
};

export default EventsGallery;
