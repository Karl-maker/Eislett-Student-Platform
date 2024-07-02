import { Prisma, PrismaClient } from "@prisma/client";
import UnexpectedError from "../../../services/error/unexpected.error";
import NotFoundError from "../../../services/error/not.found.error";
import TopicRepository, { TopicFields, TopicFilters } from "../interface/interface.topic.repository";
import Topic from "../../../../domain/entities/topic/interface.topic.entity";
import BasicTopic from "../../../../domain/entities/topic/basic.topic.entity";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";


const TopicPrismaModel = Prisma.validator<Prisma.TopicDefaultArgs>()({});

export type TopicPrismaModelType = typeof TopicPrismaModel;

export default class TopicPrismaRepository implements TopicRepository {
    private prisma: PrismaClient;
    
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async deleteById(id: string | number): Promise<boolean> {
        try {
            const result = await this.prisma.topic.delete({
                where: {
                    id: Number(id)
                }
            });
            if(result) return true;
            return false;
        } catch (err) {
            return false; // Return false if an error occurs
        }
    };

    async findById (id: string | number) : Promise<Topic> {
        try {
            const found = await this.prisma.topic.findFirst({
                where: {
                    id: Number(id)
                }
            });

            if(!found) throw new NotFoundError('Topic not found');

            return this.fitModelToEntity(found);

        } catch(err) {
            throw err;
        }
    };

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

    async save(entity: Topic): Promise<Topic> {
        try {
            if(entity.id) { // updating entity
                const saved = await this.prisma.topic.update({
                    where: {
                        id: Number(entity.id)
                    },
                    data: this.fitEntityToModel<Prisma.TopicUpdateInput>(entity)
                })
    
                return this.fitModelToEntity(saved);
            }
    
            const saved = await this.prisma.topic.create({
                data: this.fitEntityToModel<Prisma.TopicCreateInput>(entity)
            });
    
            return this.fitModelToEntity(saved);
        } catch(err: any) {
            throw new UnexpectedError(err['message'], err);
        }
    }
    
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