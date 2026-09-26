import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/signup', authRateLimiter, AuthController.signup);
router.post('/verify', authRateLimiter, AuthController.verify);

export default router;
