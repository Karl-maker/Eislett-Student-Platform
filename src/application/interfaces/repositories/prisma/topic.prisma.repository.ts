import { Prisma, PrismaClient } from "@prisma/client";
import UnexpectedError from "../../../services/error/unexpected.error";
import NotFoundError from "../../../services/error/not.found.error";
import TopicRepository, { TopicFields, TopicFilters } from "../interface/interface.topic.repository";
import Topic from "../../../../domain/entities/topic/interface.topic.entity";
import BasicTopic from "../../../../domain/entities/topic/basic.topic.entity";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";
import PrismaRepository from "./prisma.repository";


const TopicPrismaModel = Prisma.validator<Prisma.TopicDefaultArgs>()({});

export type TopicPrismaModelType = typeof TopicPrismaModel;

export default class TopicPrismaRepository extends PrismaRepository<Topic> implements TopicRepository {

    constructor(prisma: PrismaClient) {
        super(prisma, 'topic')
    }

    async connectToQuestion (id: string | number, questionId: string | number) : Promise<boolean> {
        try {
            const result = await this.prisma.questionTopic.create({
                data: {
                    question: {
                        connect: {
                            id: Number(questionId)
                        }
                    },
                    topic: {
                        connect: {
                            id: Number(id)
                        }
                    }
                }
            });
            if(result) return true;
            return false;
        } catch(err) {
            return false;
        }
    };

    async disconnectToQuestion (id: string | number, questionId: string | number) : Promise<boolean> {
        try {
            const result = await this.prisma.questionTopic.delete({
                where: {
                    questionId_topicId: {
                        questionId: Number(questionId),
                        topicId: Number(id),
                    }
                }
            });
            if(result) return true;
            return false;
        } catch(err) {
            return false;
        }
    };

    async findMany(params: FindManyParams<TopicFields, TopicFilters>): Promise<FindManyResult<Topic>> {
        try {
            const { sort, page, filters } = params;
            
            const where: Prisma.TopicWhereInput = {};
            if (filters.courseId) {
                where.courseTopic = {
                    some: {
                        courseId: Number(filters.courseId)
                    }
                };
            }
    
            const total = await this.prisma.topic.count({ where });
    
            const topics = await this.prisma.topic.findMany({
                where,
                orderBy: {
                    [sort.field]: sort.order,
                },
                skip: (page.number - 1) * page.size,
                take: page.size,
            });
    
            return {
                amount: total,
                data: topics.map((topic) => this.fitModelToEntity(topic)),
            };
        } catch (err) {
            throw err;
        }
    };
    
    fitModelToEntity<Model>(model: Model): Topic {
        const prismaModel = model as Prisma.TopicGetPayload<TopicPrismaModelType>;

        return new BasicTopic({
            id: prismaModel.id,
            createdAt: prismaModel.createdAt,
            description: prismaModel.description,
            name: prismaModel.name
        })
    }
    fitEntityToModel<Model>(entity: Topic): Model {
        if(entity.id) {
            const updated: Prisma.TopicUpdateInput = {
                description: entity.description,
                name: entity.name
            }

            return updated as Model;
        }

        const updated: Prisma.TopicCreateInput = {
            description: entity.description,
            name: entity.name,
            createdAt: entity.createdAt
        }

        return updated as Model;
    }
    
}