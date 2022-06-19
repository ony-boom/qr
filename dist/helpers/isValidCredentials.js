"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
const isValidCredentials = async (credential, value) => {
    let isValid = false;
    const [rows] = await db_1.default.query(`SELECT ${credential} FROM members WHERE ${credential} = ?`, [value]);
    const result = rows;
    if (result.length > 0) {
        isValid = true;
    }
    return isValid;
};
exports.default = isValidCredentials;
