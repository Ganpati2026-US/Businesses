import { Router } from 'express';
import { MenuController } from '../controllers/MenuController';
import { authMiddleware } from '../middleware/auth';
import { publicReadLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/', authMiddleware, MenuController.getMenu);
router.post('/', authMiddleware, MenuController.create);
router.put('/:id', authMiddleware, MenuController.update);
router.delete('/:id', authMiddleware, MenuController.delete);
router.patch('/:id/toggle', authMiddleware, MenuController.toggleAvailability);
router.get('/public/:restaurantId', publicReadLimiter, MenuController.getPublicMenu);

export default router;
