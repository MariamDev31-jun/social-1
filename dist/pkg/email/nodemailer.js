"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodemailerProvider = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class NodemailerProvider {
    client;
    fromEmail;
    fromName;
    constructor(config) {
        this.client = nodemailer_1.default.createTransport({
            host: config.host,
            port: config.port,
            secure: false,
            auth: {
                user: config.user,
                pass: config.pass,
            },
        });
        this.fromEmail = config.fromEmail;
        this.fromName = config.fromName;
    }
    async send(email, subject, html) {
        await this.client.sendMail({
            from: {
                name: this.fromName,
                address: this.fromEmail,
            },
            to: email,
            subject,
            html,
        });
    }
}
exports.NodemailerProvider = NodemailerProvider;
