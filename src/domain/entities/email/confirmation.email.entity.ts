import config from "../../../config";
import Email from "./interface.email.entity";

export type ConfirmationEmailContext = {
    name: string;
    code: string[];
}

export default class ConfirmationEmail implements Email<ConfirmationEmailContext> {
    template: {
        name: string;
        ext: string;
    };
    context: ConfirmationEmailContext;
    subject: string;
    to: string;
    from: string;
    id?: string | number | undefined;
    createdAt: Date;

    constructor(params: {
        template?: {
            name: string;
            ext: string;
        };
        context: ConfirmationEmailContext;
        subject?: string;
        to: string;
        from?: string;
        id?: string | number | undefined;
        createdAt?: Date;
    }) {
        const {
            template,
            context,
            subject,
            to,
            from,
            id,
            createdAt,
        } = params;

        this.template = template || {
            name: 'confirmation',
            ext: 'handlebars'
        };
        this.context = context;
        this.subject = subject || "Confirmation";
        this.to = to;
        this.from = from || config.email.nodemailer.auth.user as string;
        this.id = id;
        this.createdAt = createdAt || new Date();
    }
    
}