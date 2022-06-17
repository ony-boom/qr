"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const dbOption = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.NODE_ENV === "development" ? 3306 : Number(process.env.DB_PORT)
};
exports.pool = mysql2_1.default.createPool(dbOption);
// promised pool
const promisePool = exports.pool.promise();
exports.default = promisePool;
