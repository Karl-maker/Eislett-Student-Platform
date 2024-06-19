import Email from "../../../domain/entities/email/interface.email.entity";

export default interface EmailSender {
    send<Content>(email: Email<Content>) : Promise<{
        success: boolean;
    }>;
}