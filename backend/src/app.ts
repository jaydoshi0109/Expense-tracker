// app.ts
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import authRoutes from './routes/auth.routes';
import incomeRoutes from './routes/income.routes';
import expenseRoutes from './routes/expense.routes';
import { errorHandler } from './middleware/error.middleware';
import { protect } from './middleware/auth.middleware';

const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incomes', protect, incomeRoutes);
app.use('/api/expenses', protect, expenseRoutes);

// Error handler
app.use(errorHandler);

export default app;
