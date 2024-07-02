import Reward from "../../../../domain/entities/reward/interface.Reward.entity";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";
import Repository from "./interface.repository";

export type RewardFilters = {
    studentId?: string | number;
}

export type RewardFields = {
    createdAt: Date;
    id: number | string;
}

export default interface RewardRepository extends Repository<Reward> {
    findMany: (params: FindManyParams<RewardFields, RewardFilters>)=> Promise<FindManyResult<Reward>>;
}