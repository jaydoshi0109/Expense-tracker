"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = exports.addExpense = exports.getExpenses = void 0;
const expense_model_1 = __importDefault(require("../models/expense.model"));
// Get Expenses
const getExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const expenses = yield expense_model_1.default.find({ user: req.user.id });
    res.status(200).json(expenses);
});
exports.getExpenses = getExpenses;
// Add Expense
const addExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, description, date } = req.body;
    const expense = new expense_model_1.default({
        user: req.user.id,
        amount,
        description,
        date,
        type: 'expense',
    });
    yield expense.save();
    res.status(201).json(expense);
});
exports.addExpense = addExpense;
// Delete Expense
const deleteExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const expense = yield expense_model_1.default.findById(id);
    if (!expense) {
        res.status(404).json({ message: 'Expense not found' });
        return;
    }
    if (expense.user.toString() !== user._id.toString()) {
        res.status(401).json({ message: 'Not authorized to delete this expense' });
        return;
    }
    yield expense.deleteOne();
    res.status(200).json({ message: 'Expense deleted successfully' });
});
exports.deleteExpense = deleteExpense;
