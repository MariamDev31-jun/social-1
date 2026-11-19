"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
console.log(env_1.env.db.url);
mongoose_1.default.connect(env_1.env.db.url)
    .then(() => {
    console.log("MongoDB connected successfully");
})
    .catch((err) => {
    console.log("MongoDB connection error:", err.message);
});
