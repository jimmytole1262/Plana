import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ simple = false }) => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setDropdownOpen(false);
        }, 300);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = simple ? [
        { name: 'Back to Website', path: '/' }
    ] : [
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/events' },
        { name: 'Support', path: '/support' },
    ];

    if (!simple && user) {
        navLinks.push({ name: 'My Bookings', path: '/dashboard' });
        if (isAdmin) {
            navLinks.push({ name: 'Admin', path: '/admin' });
        }
    }

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">✦</span>
                    <span className="logo-text">{simple ? 'PLANA ADMIN' : 'PLANA'}</span>
                </Link>

                <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
                    {navLinks.map((link, index) => (
                        <li key={index}>
                            <Link to={link.path} onClick={() => setMenuOpen(false)}>
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="navbar-actions">
                    <div
                        className="account-dropdown"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button className="navbar-link-btn">
                            {user ? `Hi, ${user.username}` : 'Account'} ▾
                        </button>
                        {dropdownOpen && (
                            <ul className="dropdown-menu">
                                {!user ? (
                                    <>
                                        <li><Link to="/login" onClick={() => setDropdownOpen(false)}>Sign In</Link></li>
                                        <li><Link to="/signup" onClick={() => setDropdownOpen(false)}>Sign Up</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link to="/dashboard" onClick={() => setDropdownOpen(false)}>Profile</Link></li>
                                        <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
                                    </>
                                )}
                            </ul>
                        )}
                    </div>
                    {!user && (
                        <button className="navbar-cta" onClick={() => navigate('/signup')}>Get Started</button>
                    )}
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
            </div >
        </nav >
    );
};

export default Navbar;
