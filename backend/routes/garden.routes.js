import { Router } from 'express';
import { start, location, photo, generate, repromptController, getSessionController, deleteSessionController } from '../controllers/garden.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/start', authenticate, start);
router.post('/location', authenticate, location);
router.post('/upload-photo', authenticate, photo);
router.post('/generate', authenticate, generate);
router.post('/reprompt', authenticate, repromptController);
router.get('/session/:id', authenticate, getSessionController);
router.delete('/session/:id', authenticate, deleteSessionController);

export default router;