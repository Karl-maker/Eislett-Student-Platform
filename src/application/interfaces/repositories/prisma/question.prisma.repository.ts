import { Prisma, PrismaClient } from "@prisma/client";
import UnexpectedError from "../../../services/error/unexpected.error";
import QuestionRepository from "../interface/interface.question.repository";
import TrueOrFalseQuestion, { TrueOrFalseQuestionParamsType } from "../../../../domain/entities/question/true.or.false.question.entity";
import MultipleChoiceQuestion, { MultipleChoiceQuestionParamsType } from "../../../../domain/entities/question/multiple.choice.question.entity";
import Question from "../../../../domain/entities/question/interface.question.entity";
import MultipleChoiceOption from "../../../../domain/entities/multiple-choice-option/interface.multiple.choice.option.entity";
import MultipleChoiceOptionPrismaRepository from "./multiple.choice.option.repository";
import NotFoundError from "../../../services/error/not.found.error";
import logger from "../../../services/log";
import generateRandomOffsets from "../../../../infrastructure/utils/offset";
import TopicPrismaRepository from "./topic.repository";

const QuestionPrismaModel = Prisma.validator<Prisma.QuestionDefaultArgs>()({
    include: {
        multipleChoiceOptions: true,
        topics: {
            include: {
                topic: true
            }
        },
    }
});

export type QuestionPrismaModelType = typeof QuestionPrismaModel;

export default class QuestionPrismaRepository implements QuestionRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findForQuizGeneration(tiers: number[], topics: number[], amount: number): Promise<Question[]> {
        logger.debug(`Enter PrismaQuestionRepository.findForQuizGeneration()`);
        tiers = tiers.filter((t) => t > 0)
        try {
            // Get the total number of questions in the database
            const where: Prisma.QuestionWhereInput = {
                difficultyLevel: {
                    in: tiers,
                },
                topics: {
                    some: {
                        topic: {
                            id: {
                                in: topics,
                            },
                        }
                    },
                },
            }
    
            const totalQuestionsCount = await this.prisma.question.count({
                where
            });

            // Generate random offsets for multiple questions
            const randomOffsets = generateRandomOffsets(totalQuestionsCount, amount);
    
            // Fetch multiple random questions
            const randomQuestions = await Promise.all(
                randomOffsets.map(async (offset) => await this.prisma.question.findFirst({
                        where,
                        skip: offset,
                        include: {
                            multipleChoiceOptions: true,
                            topics: {
                                include: {
                                    topic: true
                                }
                            },
                        },
                    })
                )
            );
    
            return randomQuestions
                .map((q) => q ? this.fitModelToEntity(q) as Question : null)
                .filter((q): q is Question => q !== null);

        } catch (error) {
            logger.error('Error finding random questions:', error);
            throw new Error('Error finding random questions');
        }
    }

    async deleteById(id: string | number): Promise<boolean> {
        try {
            const result = await this.prisma.question.delete({
                where: {
                    id: Number(id)
                }
            });
            if(result) return true;
            return false;
        } catch (err) {
            logger.error(`Issue deleting question: `, err)
            return false; // Return false if an error occurs
        }
    };

    async findById (id: string | number) : Promise<Question> {
        try {
            const found = await this.prisma.question.findFirst({
                where: {
                    id: Number(id)
                },
                include: {
                    multipleChoiceOptions: true,
                    topics: {
                        include: {
                            topic: true
                        }
                    },
                }
            });

            if(!found) throw new NotFoundError('Question not found');

            return this.fitModelToEntity(found);

        } catch(err) {
            throw err;
        }
    };

    async save(entity: Question): Promise<Question> {
        try {
            if (entity.id) { // updating entity

                const saved = await this.prisma.question.update({
                    where: {
                        id: Number(entity.id)
                    },
                    data: this.fitEntityToModel<Prisma.QuestionUpdateInput>(entity),
                    include: {
                        multipleChoiceOptions: true,
                        topics: {
                            include: {
                                topic: true
                            }
                        },
                    }
                });
    
                return this.fitModelToEntity(saved);
            }
    
            const saved = await this.prisma.question.create({
                data: this.fitEntityToModel<Prisma.QuestionCreateInput>(entity),
                include: {
                    multipleChoiceOptions: true,
                    topics: {
                        include: {
                            topic: true
                        }
                    },
                }
            });
    
            return this.fitModelToEntity(saved);
        } catch (err: any) {
            throw new UnexpectedError(err['message'], err);
        }
    }
    

    fitModelToEntity<Model>(model: Model): Question {
        const prismaModel = model as Prisma.QuestionGetPayload<QuestionPrismaModelType>;
        const primsaTopic = new TopicPrismaRepository(this.prisma)
        let question: Question;
        if (prismaModel.type === 'TRUE_FALSE') {
            question = new TrueOrFalseQuestion({
                id: prismaModel.id,
                createdAt: prismaModel.createdAt,
                title: prismaModel.title,
                description: prismaModel.description,
                content: prismaModel.content,
                tags: prismaModel.tags,
                totalPotentialMarks: prismaModel.totalPotentialMarks,
                isTrue: prismaModel.isTrue || false,
                difficultyLevel: Number(prismaModel.difficultyLevel),
                topics: prismaModel.topics.map((topic) => {
                    return primsaTopic.fitModelToEntity(topic.topic);
                })
            } as TrueOrFalseQuestionParamsType);

        } else {
            const prismaMultipleChoiceOption = new MultipleChoiceOptionPrismaRepository(this.prisma);
            const options: MultipleChoiceOption[] = prismaModel.multipleChoiceOptions ? prismaModel.multipleChoiceOptions.map((option) => {
                return prismaMultipleChoiceOption.fitModelToEntity(option);
            }) : [];
            question = new MultipleChoiceQuestion({
                id: prismaModel.id,
                createdAt: prismaModel.createdAt,
                title: prismaModel.title,
                description: prismaModel.description,
                content: prismaModel.content,
                tags: prismaModel.tags,
                difficultyLevel: Number(prismaModel.difficultyLevel),
                totalPotentialMarks: prismaModel.totalPotentialMarks,
                options,
                topics: prismaModel.topics.map((topic) => {
                    return primsaTopic.fitModelToEntity(topic.topic);
                })
            } as MultipleChoiceQuestionParamsType);
        }

        return question;
    }

    fitEntityToModel<Model>(entity: Question): Model {
        let type = "MULTIPLE_CHOICE" as any;
        let attributes: Partial<Prisma.QuestionCreateInput> = {};

        if (entity instanceof TrueOrFalseQuestion) {
            type = "TRUE_FALSE";
            attributes = {
                ...attributes,
                isTrue: entity.isTrue
            };
        }
        if (entity instanceof MultipleChoiceQuestion) {
            type = "MULTIPLE_CHOICE";
            attributes = {
                ...attributes,
            };
        }

        if (entity.id) {
            const updated: Prisma.QuestionUpdateInput = {
                title: entity.title,
                description: entity.description,
                content: entity.content,
                tags: entity.tags,
                difficultyLevel: entity.difficultyLevel,
                totalPotentialMarks: entity.totalPotentialMarks,
                ...attributes
            };

            return updated as Model;
        }

        const updated: Prisma.QuestionCreateInput = {
            title: entity.title,
            description: entity.description,
            content: entity.content,
            tags: entity.tags,
            difficultyLevel: entity.difficultyLevel,
            totalPotentialMarks: entity.totalPotentialMarks,
            type,
            ...attributes
        };

        return updated as Model;
    }
}
