import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await bookingService.getBookingsByUser(user.user_id);
                setBookings(response.data || []);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchBookings();

        // Safe Animations with GSAP Context
        const ctx = gsap.context(() => {
            gsap.from(".dashboard-header", { opacity: 0, y: -20, duration: 1, ease: "power3.out" });

            // Check if stat-cards exist before animating
            if (document.querySelectorAll('.stat-card').length > 0) {
                gsap.from(".stat-card", { opacity: 0, scale: 0.9, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)" });
            }

            // Check if booking-cards exist before animating
            if (document.querySelectorAll('.booking-card').length > 0) {
                gsap.from(".booking-card", { opacity: 0, x: -20, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.5 });
            }
        });

        return () => ctx.revert();
    }, [user, navigate]);

    return (
        <div className="dashboard-wrapper">
            <Navbar />
            <main className="dashboard-content">
                <header className="dashboard-header">
                    <h1>Welcome, {user?.username}</h1>
                    <p>Track your events and upcoming bookings in one place.</p>
                </header>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Bookings</h3>
                        <p className="stat-value">{bookings.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Upcoming Events</h3>
                        <p className="stat-value">
                            {Array.isArray(bookings) ? bookings.filter(b => new Date(b.date) > new Date()).length : 0}
                        </p>
                    </div>
                    <div className="stat-card">
                        <h3>Account Status</h3>
                        <p className="stat-value" style={{ fontSize: '1.5rem', color: '#00ff7f' }}>Active</p>
                    </div>
                </div>

                <section className="bookings-section">
                    <h2>Your Bookings</h2>
                    {loading ? (
                        <div className="loading-spinner">Loading your experience...</div>
                    ) : bookings.length > 0 ? (
                        <div className="bookings-list">
                            {Array.isArray(bookings) && bookings.map((booking) => (
                                <div key={booking.booking_id} className="booking-card">
                                    <div className="booking-info">
                                        <h3>{booking.title || "Unknown Event"}</h3>
                                        <p className="event-date">{booking.date ? new Date(booking.date).toLocaleDateString() : "No date"}</p>
                                        <p className="event-location">{booking.location || "No location"}</p>
                                    </div>
                                    <div className="booking-status">
                                        <span className="status-badge">Confirmed</span>
                                        <button
                                            className="view-ticket-btn"
                                            onClick={() => {
                                                alert(`🎫 Your Ticket\n\nEvent: ${booking.title || "Unknown Event"}\nDate: ${booking.date ? new Date(booking.date).toLocaleDateString() : "No date"}\nLocation: ${booking.location || "No location"}\nBooking ID: ${booking.booking_id}\n\nStatus: Confirmed ✅`);
                                            }}
                                        >
                                            View Ticket
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>You haven't booked any events yet.</p>
                            <button className="explore-btn" onClick={() => navigate('/events')}>
                                Explore Events
                            </button>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
