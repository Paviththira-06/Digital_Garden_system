import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

// Endpoints only — no logic here
router.post('/register', register);
router.post('/login', login);

export default router;