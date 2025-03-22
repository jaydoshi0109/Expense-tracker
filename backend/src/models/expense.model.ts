// import mongoose from 'mongoose';
// import User from './user.model';

// const expenseSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
//     amount: { type: Number, required: true },
//     description: { type: String, required: true },
//     date: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// const Expense = mongoose.model('Expense', expenseSchema);
// export default Expense;


import mongoose from 'mongoose';
import User from './user.model';

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['expense'], required: true },  // Ensure type is 'expense'
  },
  { timestamps: true }
);

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;