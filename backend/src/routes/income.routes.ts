import { Router } from 'express';
import { addIncome, getIncomes, deleteIncome } from '../controllers/income.controller';
import { protect } from '../middleware/auth.middleware';
import { RequestHandler } from 'express';
const router = Router();

// income.routes.ts
router.route('/')
  .get(protect, getIncomes as RequestHandler)
  .post(protect, addIncome as RequestHandler);

router.route('/:id')
  .delete(protect, deleteIncome as RequestHandler);


export default router;
