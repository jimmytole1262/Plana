import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { login_details } from '../models/user.interface';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.config';
import { v4 } from 'uuid';

const authServiceInstance = new AuthService();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const logins: login_details = { email, password, isActive: true };

        const result = await authServiceInstance.login(logins);

        if (!result.error && result.token) {
            res.status(200).json(result);
        } else {
            res.status(401).json(result);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

interface GooglePayload {
    sub: string;
    email: string;
    name: string;
    picture: string;
    email_verified: boolean;
}

export const googleLogin = async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload() as GooglePayload;

        if (!payload) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const { sub: googleId, email, name, picture, email_verified } = payload;

        // Check if email is verified
        if (!email_verified) {
            return res.status(401).json({ error: 'Email not verified' });
        }

        // Check if user exists in database
        const loginEmail = email.toLowerCase();
        const userCheck = await pool.query('SELECT * FROM Users WHERE email = $1', [loginEmail]);

        let user;
        if (userCheck.rows.length === 0) {
            // Create new user if they don't exist
            const user_id = v4();
            // Since password is NOT NULL in schema, we'll store a placeholder or the googleId (hashed)
            const passwordPlaceholder = 'GOOGLE_AUTH_' + googleId;

            await pool.query(
                'INSERT INTO Users (user_id, username, email, password, "isActive", role) VALUES ($1, $2, $3, $4, true, \'user\')',
                [user_id, name || email.split('@')[0], loginEmail, passwordPlaceholder]
            );

            user = {
                user_id,
                username: name || email.split('@')[0],
                email: loginEmail,
                role: 'user',
                isActive: true
            };
        } else {
            user = userCheck.rows[0];
        }

        if (!user.isActive) {
            return res.status(401).json({ error: 'Account is deactivated' });
        }

        // Create JWT token
        const authToken = jwt.sign(
            { user_id: user.user_id, username: user.username, role: user.role },
            process.env.SECRET_KEY || 'your_secret_key',
            { expiresIn: '2h' }
        );

        res.json({
            message: 'Login successful',
            success: true,
            token: authToken,
            user_id: user.user_id,
            username: user.username,
            role: user.role,
            user: {
                id: user.user_id,
                email: user.email,
                name: user.username,
                picture: picture
            }
        });

    } catch (error) {
        console.error('Google authentication error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};
