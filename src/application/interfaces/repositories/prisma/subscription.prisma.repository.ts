import { Prisma, PrismaClient } from "@prisma/client";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";
import PrismaRepository from "./prisma.repository";
import Subscription, { SubscriptionStatus } from "../../../../domain/entities/subscription/interface.subscription.entity";
import SubscriptionRepository, { SubscriptionFields, SubscriptionFilters } from "../interface/interface.subscription.repository";
import BasicSubscription from "../../../../domain/entities/subscription/base.subscription.entity";


const SubscriptionPrismaModel = Prisma.validator<Prisma.SubscriptionDefaultArgs>()({});

export type SubscriptionPrismaModelType = typeof SubscriptionPrismaModel;

export default class SubscriptionPrismaRepository extends PrismaRepository<Subscription> implements SubscriptionRepository {

    constructor(prisma: PrismaClient) {
        super(prisma, 'subscription')
    }

    async findMany(params: FindManyParams<SubscriptionFields, SubscriptionFilters>): Promise<FindManyResult<Subscription>> {
        try {
            const { sort, page, filters } = params;
            
            const where: Prisma.SubscriptionWhereInput = {};
            if (filters.studentId) {
                where.studentId = Number(filters.studentId)
            }
    
            const total = await this.prisma.subscription.count({ where });
    
            const subscriptions = await this.prisma.subscription.findMany({
                where,
                orderBy: {
                    [sort.field]: sort.order,
                },
                skip: (page.number - 1) * page.size,
                take: page.size,
            });
    
            return {
                amount: total,
                data: subscriptions.map((subscription) => this.fitModelToEntity(subscription)),
            };
        } catch (err) {
            throw err;
        }
    };
    
    fitModelToEntity<Model>(model: Model): Subscription {
        const prismaModel = model as Prisma.SubscriptionGetPayload<SubscriptionPrismaModelType>;
        const stringToSubscriptionStatus = (s: string): SubscriptionStatus => {
            switch (s) {
                case 'pending':
                case 'active':
                case 'canceled':
                case 'paused':
                case 'expired':
                    return s;
                default:
                    return 'pending';
            }
        };

        return new BasicSubscription({
            id: prismaModel.id,
            createdAt: prismaModel.createdAt,
            startedAt: prismaModel.startedAt,
            subjectId: prismaModel.subjectId,
            studentId: prismaModel.studentId,
            trial: {
                start: prismaModel.trialStart || undefined,
                end: prismaModel.trialEnd || undefined
            },
            canceledAt: prismaModel.canceledAt || undefined,
            autoRenew: prismaModel.autoRenew,
            status: stringToSubscriptionStatus(prismaModel.status) as SubscriptionStatus,
            expiresAt: prismaModel.expiresAt
        })
    }
    fitEntityToModel<Model>(entity: Subscription): Model {
        if(entity.id) {
            const updated: Prisma.SubscriptionUpdateInput = {
                startedAt: entity.startedAt,
                canceledAt: entity.canceledAt,
                expiresAt: entity.expiresAt,
                status: entity.status,
                student: {
                    connect: {
                        id: Number(entity.studentId)
                    }
                },
                subject: {
                    connect: {
                        id: Number(entity.subjectId)
                    }
                },
                trialStart: entity.trial.start || null,
                trialEnd: entity.trial.end || null,
                autoRenew: entity.autoRenew
            }

            return updated as Model;
        }

        const updated: Prisma.SubscriptionCreateInput = {
            startedAt: entity.startedAt,
            canceledAt: entity.canceledAt,
            expiresAt: entity.expiresAt,
            status: entity.status,
            student: {
                connect: {
                    id: Number(entity.studentId)
                }
            },
            subject: {
                connect: {
                    id: Number(entity.subjectId)
                }
            },
            createdAt: entity.createdAt,
            trialStart: entity.trial.start || null,
            trialEnd: entity.trial.end || null,
            autoRenew: entity.autoRenew
        }

        return updated as Model;
    }
    
}