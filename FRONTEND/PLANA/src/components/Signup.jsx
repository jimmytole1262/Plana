import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { authService } from "../services/api";

import GoogleAuthModal from "./GoogleAuthModal";

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showGoogleModal, setShowGoogleModal] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectAccount = (account) => {
        setFormData({
            ...formData,
            fullName: account.name,
            email: account.email
        });
        // Create a slight pulse effect on the inputs to show they changed
        gsap.to("input[name='fullName'], input[name='email']", {
            backgroundColor: "rgba(212, 175, 55, 0.2)",
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await authService.register({
                username: formData.fullName,
                email: formData.email,
                password: formData.password
            });

            if (response.data.message === 'User registered successfully') {
                alert("Account created successfully! Redirecting to login...");
                navigate('/login');
            } else {
                setError(response.data.message || "Something went wrong");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Internal server error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".login-left img", {
                x: -100,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });

            gsap.from(".login-right-container > *", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.2
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleGoogleAuth = (e) => {
        e.preventDefault();
        setShowGoogleModal(true);
    };

    return (
        <div className="login-main" ref={containerRef}>
            <div className="login-right">
                <div className="login-right-container">
                    <div className="login-logo">
                        <img src={Logo} alt="Plana Luxury Events" />
                    </div>
                    <div className="login-center">
                        <h2>Create Account</h2>
                        <p>Join the elite event management circle</p>
                        {error && <p className="error-msg" style={{ color: '#ff4d4d', fontSize: '14px', marginBottom: '15px', fontWeight: '500' }}>{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <div className="pass-input-div">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                {showPassword ? (
                                    <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                                ) : (
                                    <FaEye onClick={() => setShowPassword(!showPassword)} />
                                )}
                            </div>

                            <div className="login-center-buttons">
                                <button type="submit" className="submit-auth-btn" disabled={loading}>
                                    {loading ? "Creating..." : "Sign Up"}
                                </button>
                                <div style={{ margin: '10px 0', color: 'rgba(255,255,255,0.4)', fontSize: '13px', textAlign: 'center' }}>
                                    <span>OR</span>
                                </div>
                                <button type="button" className="google-auth-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '12px', borderRadius: '12px', cursor: 'pointer' }} onClick={handleGoogleAuth}>
                                    <img src={GoogleSvg} alt="" style={{ width: '20px' }} />
                                    Sign Up with Google
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="auth-footer-redirect">
                        <span>Already have an account?</span>
                        <Link to="/login">Log In</Link>
                    </div>
                </div>
            </div>
            <GoogleAuthModal
                isOpen={showGoogleModal}
                onClose={() => setShowGoogleModal(false)}
                onSelect={handleSelectAccount}
            />
        </div>
    );
};

export default Signup;
