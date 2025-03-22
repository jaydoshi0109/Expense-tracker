"use strict";
// import mongoose from 'mongoose';
// import User from './user.model';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("./user.model"));
const expenseSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: user_model_1.default, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['expense'], required: true }, // Ensure type is 'expense'
}, { timestamps: true });
const Expense = mongoose_1.default.model('Expense', expenseSchema);
exports.default = Expense;
