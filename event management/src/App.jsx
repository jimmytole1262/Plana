import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import StatsBar from './components/StatsBar';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

function App() {
    useEffect(() => {
        // Initialize Lenis smooth scroll
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Cleanup
        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div className="app">
            <Navbar />

            <main>
                <Hero />
                <Services />
                <StatsBar />
                <Testimonials />
                <Contact />
            </main>

            <Footer />
        </div>
    );
}

export default App;
