import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { login_details } from '../models/user.interface';

const authServiceInstance = new AuthService();

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
