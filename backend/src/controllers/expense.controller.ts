import { Request, Response } from 'express';
import Expense from '../models/expense.model';
import { UserDocument } from '../middleware/auth.middleware'; // import your UserDocument type

type CustomRequest = Request & {
  user: {
    id: string;
  };
};
// Get Expenses
export const getExpenses = async (req: CustomRequest, res: Response): Promise<void> => {
  const expenses = await Expense.find({ user: req.user.id });
  res.status(200).json(expenses);
};

// Add Expense
export const addExpense = async (req: CustomRequest, res: Response): Promise<void> => {
  const { amount, description, date } = req.body;

  const expense = new Expense({
    user: req.user.id,
    amount,
    description,
    date,
    type: 'expense',
  });

  await expense.save();
  res.status(201).json(expense);
};

// Delete Expense
export const deleteExpense = async (req: CustomRequest, res: Response): Promise<void> => {
  const user = req.user as UserDocument;
  const { id } = req.params;

  const expense = await Expense.findById(id);
  if (!expense) {
    res.status(404).json({ message: 'Expense not found' });
    return;
  }

  if (expense.user.toString() !== user._id.toString()) {
    res.status(401).json({ message: 'Not authorized to delete this expense' });
    return;
  }

  await expense.deleteOne();
  res.status(200).json({ message: 'Expense deleted successfully' });
};
