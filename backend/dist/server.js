"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
// DB Connection + App Listen
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => {
    console.log('MongoDB Connected');
    app_1.default.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch(err => console.log(err));
