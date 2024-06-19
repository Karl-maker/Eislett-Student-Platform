import config from "../../../config";
import Email from "./interface.email.entity";

export type RecoveryEmailContext = {
    name: string;
    code: string[];
}

export default class RecoveryEmail implements Email<RecoveryEmailContext> {
    template: {
        name: string;
        ext: string;
    };
    context: RecoveryEmailContext;
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
        context: RecoveryEmailContext;
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
            name: 'recovery',
            ext: 'handlebars'
        };
        this.context = context;
        this.subject = subject || "Recovery Code";
        this.to = to;
        this.from = from || config.email.nodemailer.auth.user as string;
        this.id = id;
        this.createdAt = createdAt || new Date();
    }
    
}