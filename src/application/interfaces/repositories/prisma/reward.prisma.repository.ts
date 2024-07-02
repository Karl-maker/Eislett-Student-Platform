import { Prisma, PrismaClient } from "@prisma/client";
import UnexpectedError from "../../../services/error/unexpected.error";
import NotFoundError from "../../../services/error/not.found.error";
import Topic from "../../../../domain/entities/topic/interface.topic.entity";
import CourseRepository, { CourseFields, CourseFilters } from "../interface/interface.course.repository";
import Course from "../../../../domain/entities/course/interface.course.entity";
import BasicCourse from "../../../../domain/entities/course/basic.course.entity";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";
import RewardRepository, { RewardFields, RewardFilters } from "../interface/interface.reward.repository";
import Reward from "../../../../domain/entities/reward/interface.reward.entity";
import BasicReward from "../../../../domain/entities/reward/basic.reward.entity";


const RewardPrismaModel = Prisma.validator<Prisma.RewardDefaultArgs>()({});

export type RewardPrismaModelType = typeof RewardPrismaModel;

export default class RewardPrismaRepository implements RewardRepository {
    private prisma: PrismaClient;
    
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
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

    async findById (id: string | number) : Promise<Reward> {
        try {
            const found = await this.prisma.reward.findFirst({
                where: {
                    id: Number(id)
                }
            });

            if(!found) throw new NotFoundError('Reward not found');

            return this.fitModelToEntity(found);

        } catch(err) {
            throw err;
        }
    };

    async save(entity: Reward): Promise<Reward> {
        try {
            if(entity.id) { // updating entity
                const saved = await this.prisma.reward.update({
                    where: {
                        id: Number(entity.id)
                    },
                    data: this.fitEntityToModel<Prisma.RewardUpdateInput>(entity)
                })
    
                return this.fitModelToEntity(saved);
            }
    
            const saved = await this.prisma.reward.create({
                data: this.fitEntityToModel<Prisma.RewardCreateInput>(entity)
            });
    
            return this.fitModelToEntity(saved);
        } catch(err: any) {
            throw new UnexpectedError(err['message'], err);
        }
    }
    
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