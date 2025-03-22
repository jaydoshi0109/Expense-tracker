import { Request, Response } from 'express';
import Income from '../models/income.model';

type CustomRequest = Request & {
    user: {
      id: string;
    };
  };

// Create Income
export const addIncome = async (req: CustomRequest, res: Response) => {
  const { amount, description, date } = req.body;
  console.log(req.body);
try {
  const income = await Income.create({
    user: req.user.id,
    amount,
    description,
    date,
    type: 'income',
  });
  
  res.status(201).json(income);
} catch (error) {
  console.error('Error adding income:', error);
  res.status(500).json({ message: 'Error adding income' });
}
 
};

// Get Incomes
export const getIncomes = async (req: CustomRequest, res: Response) => {
  const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
  res.json(incomes);
};

// Delete Income
export const deleteIncome = async (req: CustomRequest, res: Response) => {
  const income = await Income.findById(req.params.id);
  if (income && income.user.toString() === req.user.id) {
    await income.deleteOne();
    res.json({ message: 'Income removed' });
  } else {
    res.status(404).json({ message: 'Income not found' });
  }
};
