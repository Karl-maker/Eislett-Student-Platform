import Entity from "../base/interface.entity";

export default interface Subscription extends Entity {
    subjectId: string | number;
    studentId: string | number;
    trial: {
        start: Date;
        end: Date;
    };
    expiresAt: Date;
    startedAt: Date;
    canceledAt?: Date;
    status: SubscriptionStatus;
}

export type SubscriptionStatus = 'pending' | 'active' | 'canceled' | 'paused' | 'expired';