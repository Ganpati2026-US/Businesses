import { Router } from 'express';
import { UploadController } from '../controllers/UploadController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Protect image uploads
router.post('/', authMiddleware, UploadController.upload);

export default router;
