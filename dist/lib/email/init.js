"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodemailerProvider = exports.mailjetProvider = void 0;
const mailjet_1 = require("../../pkg/email/mailjet");
const nodemailer_1 = require("../../pkg/email/nodemailer");
const env_1 = require("../config/env");
exports.mailjetProvider = new mailjet_1.MailJetProvider({
    apiKey: env_1.env.mailjet.apiKey,
    apiSecret: env_1.env.mailjet.apiSecret,
    fromEmail: env_1.env.mailjet.fromEmail,
    fromName: env_1.env.mailjet.fromName,
});
exports.nodemailerProvider = new nodemailer_1.NodemailerProvider({
    host: "smtp.gmail.com",
    port: 587,
    user: env_1.env.nodemailer.email,
    pass: env_1.env.nodemailer.password,
    fromEmail: env_1.env.nodemailer.email,
    fromName: "Socail-App",
});
