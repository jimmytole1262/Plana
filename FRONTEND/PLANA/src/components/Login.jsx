import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { authService } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
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
      const response = await authService.login(formData);

      if (response.data.message === 'Login successful') {
        login({
          user_id: response.data.user_id,
          username: response.data.username,
          role: response.data.role,
          token: response.data.token
        });
        navigate('/');
      } else {
        setError(response.data.message || "Invalid credentials");
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
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="Plana Luxury Events" />
          </div>
          <div className="login-center">
            <h2>Welcome Back</h2>
            <p>Access your luxury event dashboard</p>
            {error && <p className="error-msg" style={{ color: '#ff4d4d', fontSize: '14px', marginBottom: '15px', fontWeight: '500' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
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

              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">
                    Stay logged in
                  </label>
                </div>
                <a href="#" className="forgot-pass-link">
                  Forgot?
                </a>
              </div>

              <div className="login-center-buttons">
                <button type="submit" className="submit-auth-btn" disabled={loading}>
                  {loading ? "Authenticating..." : "Log In"}
                </button>
                <div style={{ margin: '10px 0', color: 'rgba(255,255,255,0.4)', fontSize: '13px', textAlign: 'center' }}>
                  <span>OR</span>
                </div>
                <GoogleSignInWrapper />
              </div>
            </form>
          </div>

          <div className="auth-footer-redirect">
            <span>New to Plana?</span>
            <Link to="/signup">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
