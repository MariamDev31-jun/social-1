import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type { MailProvider } from "./mail.interface.js";

interface NodemailerConfig {
    host: string;
    port: number;
    user: string;
    pass: string;
    fromEmail: string;
    fromName: string;
}

export class NodemailerProvider implements MailProvider {
    private client: Transporter;
    private fromEmail: string;
    private fromName: string;

    constructor(config: NodemailerConfig) {
        this.client = nodemailer.createTransport({
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

    async send(email: string, subject: string, html: string): Promise<void> {
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