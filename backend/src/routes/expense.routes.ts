import { Router } from 'express';
import { addExpense, getExpenses, deleteExpense } from '../controllers/expense.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.route('/')
  .get(protect, getExpenses as any)
  .post(protect, addExpense as any);

router.route('/:id')
  .delete(protect, deleteExpense as any);

export default router;
