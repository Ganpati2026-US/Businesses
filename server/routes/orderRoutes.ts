import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authMiddleware } from '../middleware/auth';
import { orderRateLimiter, publicReadLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/', authMiddleware, OrderController.getOrders);
router.post('/', orderRateLimiter, OrderController.create);
router.get('/by-session', publicReadLimiter, OrderController.getOrdersBySession);
router.post('/:orderId/checkout', orderRateLimiter, OrderController.prepareCheckout);
router.patch('/:orderId/status', authMiddleware, OrderController.updateStatus);
router.patch('/:orderId/payment', authMiddleware, OrderController.updatePaymentStatus);

export default router;
