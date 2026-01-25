import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { authService } from "../services/api";

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
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

    return (
        <div className="login-main" ref={containerRef}>
            <div className="login-left">
                <img src={Image} alt="" />
            </div>
            <div className="login-right">
                <div className="login-right-container">
                    <div className="login-logo">
                        <img src={Logo} alt="" />
                    </div>
                    <div className="login-center">
                        <h2>Create an account</h2>
                        <p>Join Plana today</p>
                        {error && <p className="error-msg" style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}
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
                                placeholder="Email"
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
                                <button type="submit" disabled={loading}>
                                    {loading ? "Creating..." : "Sign Up"}
                                </button>
                                <button type="button">
                                    <img src={GoogleSvg} alt="" />
                                    Sign Up with Google
                                </button>
                            </div>
                        </form>
                    </div>

                    <p className="login-bottom-p">
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
