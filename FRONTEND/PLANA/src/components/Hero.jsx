import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

// Import event images
import corporateImg from '../assets/images/corporate.png';
import weddingImg from '../assets/images/wedding.png';
import concertImg from '../assets/images/concert.png';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const tunnelRef = useRef(null);
    const titleRef = useRef(null);

    useEffect(() => {
        const cards = gsap.utils.toArray('.event-card');

        // Master Timeline with extended scroll distance for perfect zoom effect
        const tl = gsap.timeline({
            scrollTrigger: {
                id: 'hero-trigger',
                trigger: tunnelRef.current,
                start: 'top top',
                end: '+=200%', // Extended scroll distance for better zoom effect
                scrub: 1, // Smoother, more responsive scrubbing
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });

        // Initialize cards with better depth positioning
        gsap.set(cards, {
            scale: 0.3,
            opacity: 0,
            z: (i) => -1200 - (i * 600), // Deeper initial position
            rotateY: (i) => (i % 2 === 0 ? 20 : -20), // More dramatic tilt
            rotateX: 5,
            transformPerspective: 1200,
        });

        // Animate each card with perfect zoom in/out effect
        cards.forEach((card, index) => {
            const startTime = index * 0.35;

            // Zoom in phase - card comes from distance
            tl.to(card, {
                scale: 1.2,
                opacity: 1,
                z: 100,
                rotateY: 0,
                rotateX: 0,
                ease: "power1.inOut",
                duration: 0.5,
            }, startTime);

            // Hold at center briefly
            tl.to(card, {
                scale: 1.3,
                z: 150,
                ease: "none",
                duration: 0.2,
            }, startTime + 0.5);

            // Zoom out phase - card flies past camera
            tl.to(card, {
                scale: 4,
                opacity: 0,
                z: 800,
                rotateY: (index % 2 === 0 ? -15 : 15),
                ease: "power2.in",
                duration: 0.6,
            }, startTime + 0.7);
        });

        // Enhanced parallax for title with smoother fade
        tl.to(titleRef.current, {
            y: 300,
            opacity: 0,
            scale: 0.7,
            filter: 'blur(15px)',
            ease: "power1.in",
        }, 0);

        // Cleanup
        return () => {
            if (ScrollTrigger.getById('hero-trigger')) {
                ScrollTrigger.getById('hero-trigger').kill();
            }
            tl.kill();
        };
    }, []);

    const events = [
        { img: corporateImg, title: 'Corporate Excellence', delay: 0 },
        { img: weddingImg, title: 'Dream Weddings', delay: 0.2 },
        { img: concertImg, title: 'Epic Concerts', delay: 0.4 },
    ];

    return (
        <section className="hero-section" ref={tunnelRef}>
            <div className="tunnel-container">
                {events.map((event, index) => (
                    <div
                        key={index}
                        className="event-card"
                        style={{
                            zIndex: events.length - index,
                            '--delay': `${event.delay}s`
                        }}
                    >
                        <img src={event.img} alt={event.title} />
                        <div className="card-overlay">
                            <h3>{event.title}</h3>
                        </div>
                    </div>
                ))}

                <div className="hero-content" ref={titleRef}>
                    <h1 className="hero-title">
                        UNFORGETTABLE
                        <span className="title-accent"> MOMENTS</span>
                    </h1>
                    <p className="hero-subtitle">We Transform Visions Into Extraordinary Experiences</p>

                    <div className="hero-cta">
                        <button className="btn-primary" onClick={() => window.location.href = '/signup'}>Plan Your Event</button>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="tunnel-glow tunnel-glow-1"></div>
                <div className="tunnel-glow tunnel-glow-2"></div>
            </div>

            {/* Scroll indicator */}
            <div className="scroll-indicator">
                <div className="scroll-line"></div>
                <span>Scroll to Explore</span>
            </div>
        </section>
    );
};

export default Hero;
