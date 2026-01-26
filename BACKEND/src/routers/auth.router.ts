import { Router } from 'express';
import { googleLogin } from '../controllers/auth.controller';

const auth_router = Router();

auth_router.post('/google', googleLogin);

export default auth_router;
