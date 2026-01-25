import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './StatsBar.css';

gsap.registerPlugin(ScrollTrigger);

const StatsBar = () => {
    const statsRef = useRef(null);
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: statsRef.current,
                start: 'top 80%',
                onEnter: () => {
                    if (!animated) {
                        setAnimated(true);
                        animateCounters();
                    }
                }
            });
        });

        return () => ctx.revert();
    }, [animated]);

    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };

            updateCounter();
        });
    };

    const stats = [
        { number: 500, label: 'Events Delivered' },
        { number: 50000, label: 'Happy Guests' },
        { number: 15, label: 'Years Experience' },
        { number: 200, label: 'Corporate Clients' }
    ];

    return (
        <section className="stats-section" ref={statsRef}>
            <div className="container">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-item">
                            <div className="stat-number" data-target={stat.number}>
                                0+
                            </div>
                            <div className="stat-label">{stat.label}</div>
                            <div className="stat-bar"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsBar;
