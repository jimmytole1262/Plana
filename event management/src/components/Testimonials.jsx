import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Testimonials.css';

const Testimonials = () => {
    const marqueeRef = useRef(null);

    useEffect(() => {
        const marquee = marqueeRef.current;
        const marqueeContent = marquee.querySelector('.testimonials-track');

        // Clone for infinite scroll
        const clone = marqueeContent.cloneNode(true);
        marquee.appendChild(clone);

        // Animate
        gsap.to([marqueeContent, clone], {
            x: '-100%',
            duration: 40,
            ease: 'none',
            repeat: -1,
        });
    }, []);

    const testimonials = [
        {
            quote: "Absolutely phenomenal! They transformed our corporate gala into an unforgettable evening. Every detail was perfection.",
            author: "Sarah Mitchell",
            role: "CEO, TechVision Inc.",
            rating: 5
        },
        {
            quote: "Our wedding was beyond our wildest dreams. The team's professionalism and creativity made our day truly magical.",
            author: "Michael & Jennifer Hart",
            role: "Newlyweds",
            rating: 5
        },
        {
            quote: "From concept to execution, flawless. They managed our 5,000-person conference with seamless precision.",
            author: "David Chen",
            role: "Director of Events, Global Summit",
            rating: 5
        },
        {
            quote: "The attention to detail and luxury touches exceeded all expectations. Our clients were absolutely blown away!",
            author: "Amanda Rodriguez",
            role: "Marketing Director, Prestige Brands",
            rating: 5
        },
        {
            quote: "World-class service from start to finish. They understood our vision and brought it to life spectacularly.",
            author: "James Williams",
            role: "VP of Operations, Fortune 500",
            rating: 5
        },
        {
            quote: "The most professional event team we've ever worked with. Our festival was a massive success thanks to them!",
            author: "Lisa Thompson",
            role: "Festival Organizer",
            rating: 5
        }
    ];

    return (
        <section className="testimonials-section section">
            <div className="testimonials-header">
                <h2 className="section-title">Client Testimonials</h2>
                <p className="section-subtitle">Hear from those who experienced the magic</p>
            </div>

            <div className="testimonials-marquee" ref={marqueeRef}>
                <div className="testimonials-track">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className="star">★</span>
                                ))}
                            </div>
                            <p className="testimonial-quote">"{testimonial.quote}"</p>
                            <div className="testimonial-author">
                                <strong>{testimonial.author}</strong>
                                <span>{testimonial.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
