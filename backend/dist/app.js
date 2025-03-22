"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const income_routes_1 = __importDefault(require("./routes/income.routes"));
const expense_routes_1 = __importDefault(require("./routes/expense.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const auth_middleware_1 = require("./middleware/auth.middleware");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({ origin: 'http://localhost:5173' }));
app.use((0, body_parser_1.json)());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/incomes', auth_middleware_1.protect, income_routes_1.default);
app.use('/api/expenses', auth_middleware_1.protect, expense_routes_1.default);
// Error handler
app.use(error_middleware_1.errorHandler);
exports.default = app;
