"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expense_controller_1 = require("../controllers/expense.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.route('/')
    .get(auth_middleware_1.protect, expense_controller_1.getExpenses)
    .post(auth_middleware_1.protect, expense_controller_1.addExpense);
router.route('/:id')
    .delete(auth_middleware_1.protect, expense_controller_1.deleteExpense);
exports.default = router;
