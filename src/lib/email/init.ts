import { MailJetProvider } from "../../pkg/email/mailjet";
import { NodemailerProvider } from "../../pkg/email/nodemailer";
import { env } from "../config/env";

export const mailjetProvider = new MailJetProvider({
    apiKey: env.mailjet.apiKey,
    apiSecret: env.mailjet.apiSecret,
    fromEmail: env.mailjet.fromEmail,
    fromName: env.mailjet.fromName,
});

export const nodemailerProvider = new NodemailerProvider({
    host: "smtp.gmail.com",
    port: 587,
    user: env.nodemailer.email,
    pass: env.nodemailer.password,
    fromEmail: env.nodemailer.email,
    fromName: "Socail-App",
});