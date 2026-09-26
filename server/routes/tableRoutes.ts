import { Router } from 'express';
import { TableController } from '../controllers/TableController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, TableController.getTables);
router.post('/', authMiddleware, TableController.create);
router.post('/batch', authMiddleware, TableController.createBatch);
router.delete('/:id', authMiddleware, TableController.delete);
router.patch('/:id/toggle', authMiddleware, TableController.toggleStatus);
router.get('/public/:id', TableController.getPublicTable);

export default router;
