"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const nodemailer_1 = __importDefault(require("nodemailer"));
const OAuth2 = googleapis_1.google.auth.OAuth2;
const createTransporter = async () => {
    const myOAuth2Client = new OAuth2(process.env.MAIL_CLIENT_ID, process.env.MAIL_CLIENT_SECRET, "https://developers.google.com/oauthplayground");
    myOAuth2Client.setCredentials({
        refresh_token: process.env.MAIL_REFRESH_TOKEN,
    });
    const accessToken = await new Promise((resolve, reject) => {
        myOAuth2Client.getAccessToken((err, token) => {
            if (err)
                reject(err);
            resolve(token);
        });
    });
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.MAIL_USER,
            accessToken: String(accessToken),
            clientId: process.env.MAIL_CLIENT_ID,
            clientSecret: process.env.MAIL_CLIENT_SECRET,
            refreshToken: process.env.MAIL_REFRESH_TOKEN
        }
    });
    return transporter;
};
exports.default = createTransporter;
