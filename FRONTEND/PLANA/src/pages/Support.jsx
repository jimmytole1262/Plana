import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { issueService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';
import './Support.css';

const Support = () => {
    const { user } = useAuth();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newIssue, setNewIssue] = useState({ title: '', description: '' });

    useEffect(() => {
        if (user) fetchIssues();
        gsap.from(".support-header", { opacity: 0, y: 20, duration: 1 });
    }, [user]);

    const fetchIssues = async () => {
        try {
            const response = await issueService.getAllIssues();
            // Filter issues for current user only
            setIssues(response.data.issues?.filter(i => i.user_id === user.user_id) || []);
        } catch (error) {
            console.error("Error fetching issues:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert("Login required");

        try {
            await issueService.createIssue({
                user_id: user.user_id,
                title: newIssue.title,
                description: newIssue.description
            });
            alert("Issue reported successfully!");
            setNewIssue({ title: '', description: '' });
            fetchIssues();
        } catch (error) {
            alert("Failed to report issue.");
        }
    };

    return (
        <div className="support-wrapper">
            <Navbar />
            <div className="support-content">
                <header className="support-header">
                    <h1>Support Center</h1>
                    <p>We're here to help you create seamless experiences.</p>
                </header>

                <div className="support-grid">
                    <section className="report-section">
                        <h2>Report an Issue</h2>
                        <div className="support-card-form">
                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label>Issue Title</label>
                                    <input
                                        type="text"
                                        placeholder="Brief summary..."
                                        value={newIssue.title}
                                        onChange={e => setNewIssue({ ...newIssue, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Detailed Description</label>
                                    <textarea
                                        placeholder="Tell us what happened..."
                                        rows="5"
                                        value={newIssue.description}
                                        onChange={e => setNewIssue({ ...newIssue, description: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="report-btn">Submit Report</button>
                            </form>
                        </div>
                    </section>

                    <section className="history-section">
                        <h2>Support History</h2>
                        {loading ? (
                            <div className="loading">Processing...</div>
                        ) : issues.length > 0 ? (
                            <div className="issues-list">
                                {issues.map(issue => (
                                    <div key={issue.issue_id} className="issue-item">
                                        <div className="issue-main">
                                            <h3>{issue.title}</h3>
                                            <p>{issue.description}</p>
                                            <span className="issue-date">{new Date(issue.created_at).toLocaleDateString()}</span>
                                        </div>
                                        {issue.responses && issue.responses.length > 0 && (
                                            <div className="admin-response">
                                                <strong>Admin:</strong> {issue.responses[0].response_text}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-history">
                                <p>No issues reported yet.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Support;
