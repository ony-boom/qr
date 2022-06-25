"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMember = exports.getMember = exports.updateMemberPoints = exports.checkQuery = exports.checkBody = exports.validate = exports.createMember = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../config/db"));
const mailAPI_1 = __importDefault(require("../helpers/mailAPI"));
const isValidCredentials_1 = __importDefault(require("../helpers/isValidCredentials"));
const sendMail = async (to, content, member) => {
    let sent = false;
    const [memberLastName] = member.split(" ");
    const transporter = await (0, mailAPI_1.default)();
    const info = await transporter.sendMail({
        from: `Ony <${process.env.MAIL_USER}>`,
        to,
        subject: "QR member code",
        text: "Howdy " + memberLastName + " !" + "\n This is you're QR Code",
        attachments: [
            {
                path: content,
            },
        ],
    });
    if (info.messageId) {
        sent = true;
    }
    return sent;
};
const createMember = async (req, res, next) => {
    const { firstName, lastName, email, phone } = req.body;
    const id = (0, uuid_1.v4)();
    try {
        const qrCode = await qrcode_1.default.toDataURL(id, { rendererOpts: { quality: 1 } });
        const [newMember] = await db_1.default.query("INSERT INTO members(id, first_name, last_name, email, phone, qr_code, points) VALUES (?)", [[id, firstName, lastName, email, phone, qrCode, 0]]);
        if (newMember.affectedRows) {
            const emailSent = await sendMail(email, qrCode, lastName);
            const response = {
                status: "Success",
                message: emailSent
                    ? "An email with the qr code was sent to: " + email
                    : "",
                data: { qrCode },
            };
            res.status(201).json(response);
        }
    }
    catch (error) {
        const response = {
            status: "error",
            message: "Server Error",
            data: null,
        };
        res.status(500).json(response);
    }
    next();
};
exports.createMember = createMember;
const validate = async (req, res, next) => {
    let cred = "id";
    let value = "";
    let valid = false;
    switch (req.method.toLowerCase()) {
        case "put":
            cred = "id";
            value = req.body.id;
            break;
        case "get":
            cred = "email";
            value = req.params.email;
            break;
    }
    valid = await (0, isValidCredentials_1.default)(cred, value);
    if (!valid) {
        const response = {
            status: "Failed",
            message: "Member not found, Please Provide a valid " + cred,
            data: null,
        };
        return res.status(404).json(response);
    }
    next();
};
exports.validate = validate;
const checkBody = async (req, res, next) => {
    let check = "";
    switch (req.method.toLowerCase()) {
        case "post":
            check = req.body.email;
            break;
        case "put":
            check = req.body.id;
            break;
    }
    if (!check) {
        const response = {
            status: "Failed",
            message: "Please Provide a valid credentials",
            data: null,
        };
        return res.status(400).json(response);
    }
    next();
};
exports.checkBody = checkBody;
const checkQuery = (req, res, next) => {
    const { email } = req.params;
    if (!email) {
        const response = {
            status: "Failed",
            message: "Please Provide a valid mail",
            data: null,
        };
        return res.status(400).json(response);
    }
    next();
};
exports.checkQuery = checkQuery;
const updateMemberPoints = async (req, res, next) => {
    const { id } = req.body;
    try {
        const rows = await db_1.default.query("SELECT id, points FROM members WHERE id = ?", [id]);
        const member = rows[0];
        if (member.length > 0) {
            member[0].points = Number(member[0].points) + 1;
            const newPoints = member[0].points;
            const [info] = await db_1.default.query("UPDATE members SET points = ? WHERE id = ?", [newPoints, id]);
            if (info.affectedRows) {
                const response = {
                    status: "Success",
                    message: "Member Points Updated",
                    data: member[0],
                };
                res.status(200).json(response);
            }
        }
    }
    catch (e) {
        const response = {
            status: "error",
            message: "Server Error",
            data: null,
        };
        res.status(500).json(response);
    }
    next();
};
exports.updateMemberPoints = updateMemberPoints;
const getMember = async (req, res, next) => {
    const { email } = req.params;
    try {
        const rows = await db_1.default.query("SELECT first_name, last_name, email, points, phone FROM members WHERE email = ?", [email]);
        const memberInfo = rows[0];
        const response = {
            status: "Success",
            message: "Member found",
            data: memberInfo[0],
        };
        res.status(200).json(response);
    }
    catch (e) {
        const response = {
            status: "error",
            message: "Server Error",
            data: null,
        };
        res.status(500).json(response);
    }
    next();
};
exports.getMember = getMember;
const getAllMember = async (_, res, next) => {
    const [rows] = await db_1.default.query("SELECT first_name, last_name, points, email FROM members");
    const response = {
        status: "Success",
        message: "Members",
        data: rows,
    };
    res.status(200).json(response);
    next();
};
exports.getAllMember = getAllMember;
