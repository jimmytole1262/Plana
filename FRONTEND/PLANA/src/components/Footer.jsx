import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = ({ simple = false }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                {simple ? (
                    <div className="footer-bottom">
                        <p className="copyright">
                            &copy; {currentYear} PLANA ADMIN. All rights reserved.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="footer-grid">
                            {/* Brand Column */}
                            <div className="footer-column">
                                <div className="footer-logo">
                                    <span className="logo-icon">✦</span>
                                    <span className="logo-text">PLANA</span>
                                </div>
                                <p className="footer-tagline">
                                    Transforming visions into unforgettable experiences since 2009.
                                </p>
                                <div className="social-links">
                                    <a href="#" aria-label="Facebook"><FaFacebook /></a>
                                    <a href="#" aria-label="Instagram"><FaInstagram /></a>
                                    <a href="#" aria-label="Twitter"><FaTwitter /></a>
                                    <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
                                    <a href="#" aria-label="YouTube"><FaYoutube /></a>
                                </div>
                            </div>

                            {/* Services Column */}
                            <div className="footer-column">
                                <h4>Services</h4>
                                <ul className="footer-links">
                                    <li><a href="#services">Corporate Events</a></li>
                                    <li><a href="#services">Wedding Planning</a></li>
                                    <li><a href="#services">Concert Production</a></li>
                                    <li><a href="#services">Private Parties</a></li>
                                    <li><a href="#services">Festival Management</a></li>
                                </ul>
                            </div>

                            {/* Company Column */}
                            <div className="footer-column">
                                <h4>Company</h4>
                                <ul className="footer-links">
                                    <li><a href="#about">About Us</a></li>
                                    <li><a href="#portfolio">Portfolio</a></li>
                                    <li><a href="#testimonials">Testimonials</a></li>
                                    <li><a href="#contact">Contact</a></li>
                                    <li><a href="#careers">Careers</a></li>
                                </ul>
                            </div>

                            {/* Resources Column */}
                            <div className="footer-column">
                                <h4>Resources</h4>
                                <ul className="footer-links">
                                    <li><a href="#blog">Blog</a></li>
                                    <li><a href="#faq">FAQ</a></li>
                                    <li><a href="#privacy">Privacy Policy</a></li>
                                    <li><a href="#terms">Terms of Service</a></li>
                                    <li><a href="#support">Support</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="footer-bottom">
                            <p className="copyright">
                                &copy; {currentYear} PLANA. All rights reserved.
                            </p>
                            <p className="crafted">
                                Crafted with <span className="heart">♥</span> for extraordinary moments
                            </p>
                        </div>
                    </>
                )}
            </div>
        </footer>
    );
};

export default Footer;
