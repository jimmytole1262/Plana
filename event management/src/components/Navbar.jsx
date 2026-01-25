import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Services', href: '#services' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <div className="navbar-logo">
                    <span className="logo-icon">✦</span>
                    <span className="logo-text">LUXE EVENTS</span>
                </div>

                <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
                    {navLinks.map((link, index) => (
                        <li key={index}>
                            <a href={link.href} onClick={() => setMenuOpen(false)}>
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="navbar-actions">
                    <div
                        className="account-dropdown"
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <button className="navbar-link-btn">Account ▾</button>
                        {dropdownOpen && (
                            <ul className="dropdown-menu">
                                <li><a href="#signin">Sign In</a></li>
                                <li><a href="#signup">Sign Up</a></li>
                            </ul>
                        )}
                    </div>
                    <button className="navbar-cta">Book Consultation</button>
                </div>

                <button
                    className={`menu-toggle ${menuOpen ? 'active' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
