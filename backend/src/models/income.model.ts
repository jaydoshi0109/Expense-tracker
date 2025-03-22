// import mongoose from 'mongoose';
// import User from './user.model';

// const incomeSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
//     amount: { type: Number, required: true },
//     description: { type: String, required: true },
//     date: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// const Income = mongoose.model('Income', incomeSchema);
// export default Income;


import mongoose from 'mongoose';
import User from './user.model';

const incomeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: User , required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['income'] , required: true },  // Ensure type is 'income'
  },
  { timestamps: true }
);

const Income = mongoose.model('Income', incomeSchema);
export default Income;
