import { Router } from 'express';
import { getAllUsers, applySellerController, approveSellerController } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';

const router = Router();

router.get('/', authenticate, authorize('admin'), getAllUsers);
router.post('/apply-seller', authenticate, applySellerController);
router.put('/admin/sellers/:id/approve', authenticate, authorize('admin'), approveSellerController);

export default router;



