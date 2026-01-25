import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        date: '',
        eventType: '',
        guests: '',
        message: ''
    });

    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Thank you! We will contact you within 24 hours.');

        // Reset form
        setTimeout(() => {
            setFormData({
                name: '',
                email: '',
                date: '',
                eventType: '',
                guests: '',
                message: ''
            });
            setStatus('');
        }, 3000);
    };

    return (
        <section className="contact-section section" id="contact">
            <div className="container">
                <div className="contact-grid">
                    {/* Left Side - Contact Info */}
                    <div className="contact-info">
                        <h2 className="section-title">Let's Create Magic Together</h2>
                        <p className="contact-intro">
                            Ready to transform your vision into an unforgettable experience?
                            Share your dream event with us, and we'll make it a reality.
                        </p>

                        <div className="contact-details">
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <FaPhone />
                                </div>
                                <div>
                                    <h4>Phone</h4>
                                    <p>+1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <h4>Email</h4>
                                    <p>events@luxeevents.com</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <h4>Location</h4>
                                    <p>123 Luxury Lane, Event City, EC 12345</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="contact-form-container">
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name *"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email Address *"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <select
                                        name="eventType"
                                        value={formData.eventType}
                                        onChange={handleChange}
                                        className="form-input"
                                    >
                                        <option value="">Event Type</option>
                                        <option value="corporate">Corporate Event</option>
                                        <option value="wedding">Wedding</option>
                                        <option value="concert">Concert</option>
                                        <option value="private">Private Party</option>
                                        <option value="festival">Festival</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <input
                                    type="number"
                                    name="guests"
                                    value={formData.guests}
                                    onChange={handleChange}
                                    placeholder="Expected Number of Guests"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us about your vision... *"
                                    required
                                    rows="5"
                                    className="form-input form-textarea"
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-primary form-submit">
                                Send Inquiry
                            </button>

                            {status && <p className="form-status">{status}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
