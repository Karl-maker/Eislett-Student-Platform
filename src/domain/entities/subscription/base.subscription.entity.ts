import Subscription, { SubscriptionStatus } from "./interface.subscription.entity";

export type BasicSubscriptionParamsType = {
    subjectId: string | number;
    studentId: string | number;
    trial: { start: Date; end: Date; };
    expiresAt: Date;
    startedAt: Date;
    canceledAt?: Date;
    status: SubscriptionStatus;
    id?: string | number;
    createdAt: Date;
}

export default class BasicSubscription implements Subscription {
    id?: string | number;
    createdAt: Date;
    subjectId: string | number;
    studentId: string | number;
    trial: { start: Date; end: Date; };
    expiresAt: Date;
    startedAt: Date;
    canceledAt?: Date;
    status: SubscriptionStatus;
    
    constructor({
        id,
        createdAt,
        subjectId,
        studentId,
        trial,
        expiresAt,
        canceledAt,
        status,
        startedAt
    }: BasicSubscriptionParamsType){
        this.id = id;
        this.createdAt = createdAt;
        this.startedAt = startedAt;
        this.canceledAt = canceledAt;
        this.expiresAt = expiresAt;
        this.status = status;
        this.studentId = studentId;
        this.subjectId = subjectId;
        this.trial = trial
    }

}