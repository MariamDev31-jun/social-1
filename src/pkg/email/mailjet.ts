import Mailjet from "node-mailjet";
import type { MailProvider } from "./mail.interface.js";

interface MailJetConfig {
    apiKey: string;
    apiSecret: string;
    fromName: string;
    fromEmail: string;
}

export class MailJetProvider implements MailProvider {
    private client: Mailjet;
    private fromEmail: string;
    private fromName: string;

    constructor(config: MailJetConfig) {
        this.client = new Mailjet({
            apiKey: config.apiKey,
            apiSecret: config.apiSecret,
        });

        this.fromEmail = config.fromEmail;
        this.fromName = config.fromName;
    }

    async send(email: string, subject: string, html: string): Promise<void> {
        await this.client.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: {
                        Email: this.fromEmail,
                        Name: this.fromName,
                    },
                    To: [
                        {
                            Email: email,
                        },
                    ],
                    Subject: subject,
                    HTMLPart: html,
                },
            ],
        });
    }
}