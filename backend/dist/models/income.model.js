"use strict";
// import mongoose from 'mongoose';
// import User from './user.model';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("./user.model"));
const incomeSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: user_model_1.default, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['income'], required: true }, // Ensure type is 'income'
}, { timestamps: true });
const Income = mongoose_1.default.model('Income', incomeSchema);
exports.default = Income;
