import config from "../../../config";
import Email from "./interface.email.entity";

export type SubscriptionCreatedEmailContext = {
    name: string;
    expires: Date;
    subscriptionName: string;
    trialEnds?: Date;
    trialStarts?: Date;
    startsAt: Date;
}

export default class SubscriptionCreatedEmail implements Email<SubscriptionCreatedEmailContext> {
    template: {
        name: string;
        ext: string;
    };
    context: SubscriptionCreatedEmailContext;
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
        context: SubscriptionCreatedEmailContext;
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
            name: 'subscription-created',
            ext: 'handlebars'
        };
        this.context = context;
        this.subject = subject || "Subscription Created";
        this.to = to;
        this.from = from || config.email.nodemailer.auth.user as string;
        this.id = id;
        this.createdAt = createdAt || new Date();
    }
    
}