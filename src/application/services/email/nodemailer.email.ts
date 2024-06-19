import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import SendEmail from './interface.email';
import config from '../../../config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Email from '../../../domain/entities/email/interface.email.entity';

export default class Nodemailer implements SendEmail {
    private transporter;

    constructor() {
        const options: SMTPTransport.Options = {
            host: config.email.nodemailer.host,
            port: Number(config.email.nodemailer.port),
            secure: Boolean(config.email.nodemailer.secure),
            auth: {
                user: config.email.nodemailer.auth.user,
                pass: config.email.nodemailer.auth.password,
            },
        };

        this.transporter = nodemailer.createTransport(options);
        "../../../application/interfaces/templates"
        this.registerPartials(path.join(__dirname, '..', '..', '..', 'application', 'interfaces', 'templates', 'partials'));
    }

    private registerPartials(partialsDir: string): void {
        const filenames = fs.readdirSync(partialsDir);

        filenames.forEach((filename) => {
            const matches = /^([^.]+).handlebars$/.exec(filename);
            if (!matches) {
                return;
            }
            const name = matches[1];
            const filepath = path.join(partialsDir, filename);
            const template = fs.readFileSync(filepath, 'utf8');
            handlebars.registerPartial(name, template);
        });
    }

    async send<Content>(email: Email<Content>): Promise<{ success: boolean; }> {
        try {
            // Compile template if provided
            let htmlContent = email.context as unknown as string; // Default content if no template
            if (email.template) {
                const layoutTemplatePath = path.join(__dirname, '..', '..', '..', 'application', 'interfaces', 'templates', 'layouts', 'basic.layout.handlebars');
                const layoutTemplateSource = fs.readFileSync(layoutTemplatePath, 'utf8');
                const layoutCompiledTemplate = handlebars.compile(layoutTemplateSource);

                const emailTemplatePath = path.join(__dirname, '..', '..', '..', 'application', 'interfaces', 'templates', `${email.template.name}.${email.template.ext}`);
                const emailTemplateSource = fs.readFileSync(emailTemplatePath, 'utf8');
                const emailCompiledTemplate = handlebars.compile(emailTemplateSource);

                const currentYear = new Date().getFullYear();
                htmlContent = layoutCompiledTemplate({
                    ...email.context,
                    bodyContent: emailCompiledTemplate(email.context),
                    currentYear
                });
            }

            const mailOptions: any = {
                from: email.from,
                to: email.to,
                subject: email.subject,
                html: htmlContent,
            };

            // Add PDF attachment if present
            // if (email.pdf) {
            //     const pdfPath = path.join(__dirname, '..', '..', '..', '..', 'files', email.pdf + ".pdf");
            //     if (fs.existsSync(pdfPath)) {
            //         mailOptions.attachments = [{
            //             filename: path.basename(pdfPath),
            //             path: pdfPath
            //         }];
            //     } else {
            //         throw new Error(`PDF file not found: ${pdfPath}`);
            //     }
            // }

            await this.transporter.sendMail(mailOptions);
            return {
                success: true
            };
        } catch (err) {
            throw err;
        }
    }
}
