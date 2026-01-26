import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const GoogleSignIn = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            // Send token to your backend
            const response = await axios.post('http://localhost:5500/api/auth/google', {
                token: credentialResponse.credential
            });

            console.log('Login successful:', response.data);

            // Store the token/user data in context
            login({
                user_id: response.data.user_id,
                username: response.data.username,
                role: response.data.role,
                token: response.data.token
            });

            // Redirect to dashboard or home
            navigate('/');

        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please try again.');
        }
    };

    const handleError = () => {
        console.error('Google Sign-In failed');
        alert('Google Sign-In failed');
    };

    return (
        <div className="google-signin-container" style={{ margin: '10px 0', display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
            />
        </div>
    );
};

// Wrap with Provider
const GoogleSignInWrapper = () => {
    console.log('Google Client ID found:', GOOGLE_CLIENT_ID ? 'YES' : 'NO');

    if (!GOOGLE_CLIENT_ID) {
        return (
            <div style={{ color: '#ff4d4d', padding: '10px', fontSize: '12px', textAlign: 'center' }}>
                Google Configuration Error: Client ID missing. <br />
                Please ensure VITE_GOOGLE_CLIENT_ID is set in your .env file and restart the server.
            </div>
        );
    }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleSignIn />
        </GoogleOAuthProvider>
    );
};

export default GoogleSignInWrapper;
