import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/metrics', authMiddleware, AnalyticsController.getMetrics);
router.get('/associations', authMiddleware, AnalyticsController.getAssociations);

export default router;
