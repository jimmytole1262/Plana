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

        // Master Timeline for better performance and synchronization
        const tl = gsap.timeline({
            scrollTrigger: {
                id: 'hero-trigger',
                trigger: tunnelRef.current,
                start: 'top top',
                end: '+=100%',
                scrub: 1.5, // Smoother scrub
                pin: true,
                anticipatePin: 1,
            }
        });

        // Initialize cards state
        gsap.set(cards, {
            scale: 0.5,
            opacity: 0,
            z: (i) => -800 - (i * 400),
            rotateY: (i) => (i % 2 === 0 ? 15 : -15), // Slight tilt for depth
            transformPerspective: 1000,
        });

        // Animate each card into view and past the camera
        cards.forEach((card, index) => {
            tl.to(card, {
                scale: 3,
                opacity: 1,
                z: 600,
                rotateY: 0,
                ease: "power2.inOut",
            }, index * 0.4); // Staggered start in the timeline

            // Fade out the last card as we approach the end
            if (index === cards.length - 1) {
                tl.to(card, {
                    opacity: 0,
                    scale: 4,
                    duration: 0.5,
                }, index * 0.4 + 0.5);
            }
        });

        // Parallax and fade for title
        tl.to(titleRef.current, {
            y: 200,
            opacity: 0,
            scale: 0.8,
            filter: 'blur(10px)',
            ease: "none",
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
                        <button className="btn-primary">Plan Your Event</button>
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
