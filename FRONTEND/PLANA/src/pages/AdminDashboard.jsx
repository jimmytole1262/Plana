import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { eventService, authService, bookingService, issueService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [issues, setIssues] = useState([]);
    const [stats, setStats] = useState({ users: 0, events: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('events');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [responseForm, setResponseForm] = useState({ issue_id: '', text: '' });
    const [newEvent, setNewEvent] = useState({
        title: '', description: '', date: '', location: '',
        ticket_type: 'Regular', price: 0, image: '', total_tickets: 100
    });

    useEffect(() => {
        fetchAdminData();
        gsap.from(".admin-header", { opacity: 0, x: -30, duration: 1 });
    }, []);

    const fetchAdminData = async () => {
        setLoading(true);
        console.log("Fetching admin data...");
        try {
            // Fetch individually for better error handling and debugging
            try {
                const eventsRes = await eventService.getAllEvents();
                console.log("Events fetched:", eventsRes.data);
                setEvents(eventsRes.data || []);
            } catch (err) { console.error("Error fetching events:", err); }

            try {
                const issuesRes = await issueService.getAllIssues();
                console.log("Issues fetched:", issuesRes.data);
                setIssues(issuesRes.data.issues || []);
            } catch (err) { console.error("Error fetching issues:", err); }

            let usersCount = 0;
            let eventsCount = 0;
            let totalRevenue = 0;

            try {
                const usersCountRes = await authService.getUserCount();
                console.log("User count raw:", usersCountRes.data);
                usersCount = parseInt(usersCountRes.data?.userCount || 0);
            } catch (err) { console.error("Error fetching user count:", err); }

            try {
                const eventsCountRes = await eventService.getEventCount();
                console.log("Event count raw:", eventsCountRes.data);
                eventsCount = parseInt(eventsCountRes.data?.eventCount || 0);
            } catch (err) { console.error("Error fetching event count:", err); }

            try {
                const revenueRes = await bookingService.getTotalRevenue();
                console.log("Revenue raw:", revenueRes.data);
                totalRevenue = parseFloat(revenueRes.data?.totalRevenue ?? (typeof revenueRes.data === 'number' ? revenueRes.data : 0));
            } catch (err) { console.error("Error fetching revenue:", err); }

            console.log("Final stats to set:", { users: usersCount, events: eventsCount, revenue: totalRevenue });
            setStats({
                users: usersCount,
                events: eventsCount,
                revenue: totalRevenue
            });

        } catch (error) {
            console.error("Critical error in fetchAdminData:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateResponse = async (e) => {
        e.preventDefault();
        try {
            await issueService.createResponse({
                issue_id: responseForm.issue_id,
                admin_id: user.user_id,
                response_text: responseForm.text
            });
            alert("Response sent!");
            setResponseForm({ issue_id: '', text: '' });
            fetchAdminData();
        } catch (error) {
            alert("Failed to send response.");
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const eventData = {
                ...newEvent,
                event_id: Math.random().toString(36).substr(2, 9),
                available_tickets: newEvent.total_tickets,
                isApproved: true
            };
            await eventService.createEvent(eventData);
            alert("Event created successfully!");
            setShowCreateForm(false);
            fetchAdminData();
        } catch (error) {
            console.error("Create error:", error);
            alert("Failed to create event.");
        }
    };

    const handleApprove = async (id) => {
        try {
            await eventService.approveEvent(id);
            alert("Event approved!");
            fetchAdminData();
        } catch (error) {
            alert("Approval failed.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await eventService.deleteEvent(id);
                fetchAdminData();
            } catch (error) {
                alert("Deletion failed.");
            }
        }
    };

    return (
        <div className="admin-wrapper">
            <Navbar simple={true} />
            <div className="admin-content">
                <header className="admin-header">
                    <div className="header-top">
                        <h1>ADMIN COMMAND CENTER (V2)</h1>
                        <button className="create-btn" onClick={() => setShowCreateForm(true)}>+ Create Event</button>
                    </div>
                    <p>Global oversight and event management.</p>
                </header>

                <div className="admin-stats">
                    <div className="admin-stat-card">
                        <span>Total Users</span>
                        <h2>{stats.users}</h2>
                    </div>
                    <div className="admin-stat-card">
                        <span>Active Events</span>
                        <h2>{stats.events}</h2>
                    </div>
                    <div className="admin-stat-card">
                        <span>Revenue</span>
                        <h2>${stats.revenue.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="admin-tabs">
                    <button className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}>Manage Events</button>
                    <button className={activeTab === 'issues' ? 'active' : ''} onClick={() => setActiveTab('issues')}>User Issues ({issues.length})</button>
                </div>

                {showCreateForm && (
                    <div className="modal-overlay">
                        <div className="create-modal">
                            <h2>Create New Event</h2>
                            <form onSubmit={handleCreateEvent}>
                                <input type="text" placeholder="Title" required onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                                <textarea placeholder="Description" required onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
                                <div className="form-group">
                                    <input type="date" required onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                                    <input type="text" placeholder="Location" required onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <select onChange={e => setNewEvent({ ...newEvent, ticket_type: e.target.value })}>
                                        <option value="Regular">Regular</option>
                                        <option value="VIP">VIP</option>
                                        <option value="Premium">Premium</option>
                                    </select>
                                    <input type="number" placeholder="Price" required onChange={e => setNewEvent({ ...newEvent, price: Number(e.target.value) })} />
                                </div>
                                <input type="text" placeholder="Image URL" onChange={e => setNewEvent({ ...newEvent, image: e.target.value })} />
                                <input type="number" placeholder="Total Tickets" required onChange={e => setNewEvent({ ...newEvent, total_tickets: Number(e.target.value) })} />
                                <div className="modal-actions">
                                    <button type="button" onClick={() => setShowCreateForm(false)}>Cancel</button>
                                    <button type="submit" className="submit-btn">Publish Event</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {activeTab === 'events' ? (
                    <section className="event-management">
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Tickets</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map(event => (
                                        <tr key={event.event_id}>
                                            <td>{event.title}</td>
                                            <td>{new Date(event.date).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`status-pill ${event.isApproved ? 'approved' : 'pending'}`}>
                                                    {event.isApproved ? 'Approved' : 'Pending'}
                                                </span>
                                            </td>
                                            <td>{event.available_tickets}/{event.total_tickets}</td>
                                            <td className="actions-cell">
                                                {!event.isApproved && (
                                                    <button onClick={() => handleApprove(event.event_id)} className="approve-icon-btn">✓</button>
                                                )}
                                                <button onClick={() => handleDelete(event.event_id)} className="delete-icon-btn">🗑</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                ) : (
                    <section className="issue-management">
                        <div className="admin-issues-list">
                            {issues.map(issue => (
                                <div key={issue.issue_id} className="admin-issue-card">
                                    <div className="issue-header">
                                        <h3>{issue.title}</h3>
                                        <span className="issue-user">By: {issue.user_id}</span>
                                    </div>
                                    <p>{issue.description}</p>
                                    <div className="issue-responses">
                                        {issue.responses?.map((res, idx) => (
                                            <div key={idx} className="existing-response">
                                                <strong>Response:</strong> {res.response_text}
                                            </div>
                                        ))}
                                        <form onSubmit={handleCreateResponse} className="response-form">
                                            <input
                                                type="text"
                                                placeholder="Write a response..."
                                                required
                                                value={responseForm.issue_id === issue.issue_id ? responseForm.text : ''}
                                                onChange={e => setResponseForm({ issue_id: issue.issue_id, text: e.target.value })}
                                            />
                                            <button type="submit">Reply</button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
            <Footer simple={true} />
        </div>
    );
};

export default AdminDashboard;
