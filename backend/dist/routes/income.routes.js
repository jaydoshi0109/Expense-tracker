"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const income_controller_1 = require("../controllers/income.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// income.routes.ts
router.route('/')
    .get(auth_middleware_1.protect, income_controller_1.getIncomes)
    .post(auth_middleware_1.protect, income_controller_1.addIncome);
router.route('/:id')
    .delete(auth_middleware_1.protect, income_controller_1.deleteIncome);
exports.default = router;
