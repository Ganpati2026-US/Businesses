import { Router } from 'express';
import { RestaurantController } from '../controllers/RestaurantController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/profile', authMiddleware, RestaurantController.getProfile);
router.put('/profile', authMiddleware, RestaurantController.updateProfile);
router.get('/public/:id', RestaurantController.getPublicInfo);

export default router;
