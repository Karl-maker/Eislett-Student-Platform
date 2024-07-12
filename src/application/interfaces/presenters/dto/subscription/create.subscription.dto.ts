import { SubscriptionStatus } from "../../../../../domain/entities/subscription/interface.subscription.entity";

export type CreateSubscriptionDTO = {
    subjectId: string | number;
    studentId: string | number;
    trial: { start: Date; end: Date; };
    expiresAt: Date;
    startedAt: Date;
    autoRenew: boolean;
    canceledAt?: Date;
    status: SubscriptionStatus;
}