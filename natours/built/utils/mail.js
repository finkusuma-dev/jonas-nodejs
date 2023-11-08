"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.default = (message) => {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.mailgun.net",
        port: 587,
        secure: true,
        auth: {
            user: process.env.mailUser,
            pass: process.env.mailPass
        }
    });
};
