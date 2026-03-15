import { Router } from 'express';
import { register, login, profile, logout, forgotPasswordController, resetPasswordController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Endpoints only 
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, profile); 

// Add these after existing routes
router.post('/logout', authenticate, logout);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password/:token', resetPasswordController);

export default router;