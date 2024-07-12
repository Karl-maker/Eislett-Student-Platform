import Subscription from "../../../../domain/entities/subscription/interface.subscription.entity";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";
import Repository from "./interface.repository";

export type SubscriptionFilters = {
    studentId?: string | number;
}

export type SubscriptionFields = {
    createdAt: Date;
    expiresAt: Date;
    id: number | string;
}

export default interface SubscriptionRepository extends Repository<Subscription> {
    findMany: (params: FindManyParams<SubscriptionFields, SubscriptionFilters>)=> Promise<FindManyResult<Subscription>>;
}