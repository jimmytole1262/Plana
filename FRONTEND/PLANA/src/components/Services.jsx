import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaBriefcase, FaHeart, FaGlassCheers, FaUsers, FaCamera, FaMusic } from 'react-icons/fa';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

// Map service titles to event categories
const categoryMap = {
    'Corporate Events': 'corporate',
    'Dream Weddings': 'weddings',
    'Live Concerts': 'concerts',
    'Private Parties': 'parties',
    'Social Gatherings': 'social',
    'Festival Production': 'festivals'
};

const Services = () => {
    const servicesRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const cards = gsap.utils.toArray('.service-card');

        cards.forEach((card, index) => {
            gsap.fromTo(card,
                {
                    opacity: 0,
                    y: 100,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    delay: index * 0.2,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }, []);

    const handleLearnMore = (serviceTitle) => {
        const category = categoryMap[serviceTitle];
        navigate(`/events?category=${category}`);
    };

    const services = [
        {
            icon: <FaBriefcase />,
            title: 'Corporate Events',
            description: 'From conferences to galas, we orchestrate professional gatherings that leave lasting impressions.',
            features: ['Product Launches', 'Team Building', 'Corporate Galas', 'Conferences']
        },
        {
            icon: <FaHeart />,
            title: 'Dream Weddings',
            description: 'Transform your special day into a fairytale with our bespoke wedding planning and design services.',
            features: ['Venue Selection', 'Décor Design', 'Catering', 'Full Coordination']
        },
        {
            icon: <FaMusic />,
            title: 'Live Concerts',
            description: 'Stage unforgettable performances with our comprehensive concert production and management.',
            features: ['Stage Design', 'Sound & Lighting', 'Artist Management', 'Crowd Control']
        },
        {
            icon: <FaGlassCheers />,
            title: 'Private Parties',
            description: 'Celebrate life\'s moments with intimate gatherings tailored to your unique vision.',
            features: ['Birthday Parties', 'Anniversaries', 'Intimate Dinners', 'Themed Events']
        },
        {
            icon: <FaUsers />,
            title: 'Social Gatherings',
            description: 'Create memorable experiences for fundraisers, charity events, and community celebrations.',
            features: ['Charity Events', 'Community Fairs', 'Networking Events', 'Award Ceremonies']
        },
        {
            icon: <FaCamera />,
            title: 'Festival Production',
            description: 'Large-scale festival management with seamless logistics and spectacular entertainment.',
            features: ['Multi-Day Events', 'Vendor Coordination', 'Entertainment Booking', 'Full Production']
        }
    ];

    return (
        <section className="services-section section" id="services" ref={servicesRef}>
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Our Expertise</h2>
                    <p className="section-subtitle">
                        World-Class Event Management Across Every Occasion
                    </p>
                </div>

                <div className="services-grid">
                    {services.map((service, index) => (
                        <div key={index} className="service-card glass-card">
                            <div className="service-icon">
                                {service.icon}
                            </div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                            <ul className="service-features">
                                {service.features.map((feature, idx) => (
                                    <li key={idx}>
                                        <span className="feature-dot">✦</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button className="service-btn" onClick={() => handleLearnMore(service.title)}>Learn More</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
