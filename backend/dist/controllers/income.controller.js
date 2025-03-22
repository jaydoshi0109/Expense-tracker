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
exports.deleteIncome = exports.getIncomes = exports.addIncome = void 0;
const income_model_1 = __importDefault(require("../models/income.model"));
// Create Income
const addIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, description, date } = req.body;
    console.log(req.body);
    try {
        const income = yield income_model_1.default.create({
            user: req.user.id,
            amount,
            description,
            date,
            type: 'income',
        });
        res.status(201).json(income);
    }
    catch (error) {
        console.error('Error adding income:', error);
        res.status(500).json({ message: 'Error adding income' });
    }
});
exports.addIncome = addIncome;
// Get Incomes
const getIncomes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const incomes = yield income_model_1.default.find({ user: req.user.id }).sort({ date: -1 });
    res.json(incomes);
});
exports.getIncomes = getIncomes;
// Delete Income
const deleteIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const income = yield income_model_1.default.findById(req.params.id);
    if (income && income.user.toString() === req.user.id) {
        yield income.deleteOne();
        res.json({ message: 'Income removed' });
    }
    else {
        res.status(404).json({ message: 'Income not found' });
    }
});
exports.deleteIncome = deleteIncome;
