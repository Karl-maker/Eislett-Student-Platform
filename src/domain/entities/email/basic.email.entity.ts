import config from "../../../config";
import Email from "./interface.email.entity";

export type BasicEmailContext = {
    content: string;
}

export default class BasicEmail implements Email<BasicEmailContext> {
    template: {
        name: string;
        ext: string;
    };
    context: BasicEmailContext;
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
        context: BasicEmailContext;
        subject: string;
        to: string;
        from: string;
        id?: string | number | undefined;
        createdAt: Date;
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
            name: 'basic',
            ext: 'handlebars'
        };
        this.context = context;
        this.subject = subject;
        this.to = to;
        this.from = from || config.email.nodemailer.auth.user as string;
        this.id = id;
        this.createdAt = createdAt || new Date();
    }
    
}