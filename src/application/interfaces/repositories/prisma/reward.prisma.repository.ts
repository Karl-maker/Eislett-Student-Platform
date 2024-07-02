import { Prisma, PrismaClient } from "@prisma/client";
import UnexpectedError from "../../../services/error/unexpected.error";
import NotFoundError from "../../../services/error/not.found.error";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";
import RewardRepository, { RewardFields, RewardFilters } from "../interface/interface.reward.repository";
import Reward from "../../../../domain/entities/reward/interface.reward.entity";
import BasicReward from "../../../../domain/entities/reward/basic.reward.entity";
import PrismaRepository from "./prisma.repository";


const RewardPrismaModel = Prisma.validator<Prisma.RewardDefaultArgs>()({});

export type RewardPrismaModelType = typeof RewardPrismaModel;

export default class RewardPrismaRepository extends PrismaRepository<Reward> implements RewardRepository {

    constructor(prisma: PrismaClient) {
        super(prisma, 'reward')
    }

    async findMany(params: FindManyParams<RewardFields, RewardFilters>): Promise<FindManyResult<Reward>> {
        try {
            const { sort, page, filters } = params;
            
            const where: Prisma.RewardWhereInput = {};
            if (filters.studentId) {
                where.studentId = Number(filters.studentId)
            }
    
            const total = await this.prisma.reward.count({ where });
    
            const rewards = await this.prisma.reward.findMany({
                where,
                orderBy: {
                    [sort.field]: sort.order,
                },
                skip: (page.number - 1) * page.size,
                take: page.size,
            });
    
            return {
                amount: total,
                data: rewards.map((reward) => this.fitModelToEntity(reward)),
            };
        } catch (err) {
            throw err;
        }
    };
    
    fitModelToEntity<Model>(model: Model): Reward {
        const prismaModel = model as Prisma.RewardGetPayload<RewardPrismaModelType>;

        return new BasicReward({
            id: prismaModel.id,
            createdAt: prismaModel.createdAt,
            message: prismaModel.message,
            title: prismaModel.title,
            isCollected: prismaModel.isCollected,
            coinsRewareded: prismaModel.coinsRewareded,
            studentId: prismaModel.studentId
        })
    }

    fitEntityToModel<Model>(entity: Reward): Model {
        if(entity.id) {
            const updated: Prisma.RewardUpdateInput = {
                message: entity.message,
                title: entity.title,
                isCollected: entity.isCollected,
            }

            return updated as Model;
        }

        const updated: Prisma.RewardCreateInput = {
            message: entity.message,
            title: entity.title,
            isCollected: entity.isCollected,
            coinsRewareded: entity.coinsRewareded,
            createdAt: entity.createdAt,
            student: {
                connect: {
                    id: Number(entity.studentId)
                }
            }
        }

        return updated as Model;
    }
    
}