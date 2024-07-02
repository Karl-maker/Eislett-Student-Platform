import { Prisma, PrismaClient } from "@prisma/client";
import UnexpectedError from "../../../services/error/unexpected.error";
import MultipleChoiceOption from "../../../../domain/entities/multiple-choice-option/interface.multiple.choice.option.entity";
import MultipleChoiceOptionRepository from "../interface/interface.multiple.choice.option";
import BasicMultipleChoiceOption from "../../../../domain/entities/multiple-choice-option/basic.multiple.choice.option.entity";


const MultipleChoiceOptionPrismaModel = Prisma.validator<Prisma.MultipleChoiceOptionDefaultArgs>()({
});

export type MultipleChoiceOptionPrismaModelType = typeof MultipleChoiceOptionPrismaModel;

export default class MultipleChoiceOptionPrismaRepository implements MultipleChoiceOptionRepository {
    private prisma: PrismaClient;
    
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }
    async findAllByQuestionId (questionId: number) : Promise<MultipleChoiceOption[]> {
        try {
            const results = await this.prisma.multipleChoiceOption.findMany({
                where: {
                    questionId
                }
            })

            return results.map((result) => this.fitModelToEntity(result))
        } catch(err) {
            throw new UnexpectedError(err['message'], err);
        }
    };

    async deleteById (id: number) : Promise<boolean> {
        try {
            const results = await this.prisma.multipleChoiceOption.delete({
                where: {
                    id
                }
            })

            if(!results) return false;

            return true;
        } catch(err) {
            return false;
        }
    };

    async save(entity: MultipleChoiceOption): Promise<MultipleChoiceOption> {
        try {
            if(entity.id) { // updating entity
                const saved = await this.prisma.multipleChoiceOption.update({
                    where: {
                        id: Number(entity.id)
                    },
                    data: this.fitEntityToModel<Prisma.MultipleChoiceOptionUpdateInput>(entity),
                })
    
                return this.fitModelToEntity(saved);
            }
    
            const saved = await this.prisma.multipleChoiceOption.create({
                data: this.fitEntityToModel<Prisma.MultipleChoiceOptionCreateInput>(entity)
            });
    
            return this.fitModelToEntity(saved);
        } catch(err: any) {
            throw new UnexpectedError(err['message'], err);
        }
    }
    
    fitModelToEntity<Model>(model: Model): MultipleChoiceOption {
        const prismaModel = model as Prisma.MultipleChoiceOptionGetPayload<MultipleChoiceOptionPrismaModelType>;

        return new BasicMultipleChoiceOption({
            content: prismaModel.content,
            id: prismaModel.id,
            isCorrect: prismaModel.isCorrect,
            questionId: prismaModel.questionId
        });
    }

    fitEntityToModel<Model>(entity: MultipleChoiceOption): Model {
        if(entity.id) {
            const updated: Prisma.MultipleChoiceOptionUpdateInput = {
                content: entity.content,
                isCorrect: entity.isCorrect,
                question: {
                    connect: {
                        id: entity.questionId
                    }
                }
            }

            return updated as Model;
        }

        const updated: Prisma.MultipleChoiceOptionCreateInput = {
            content: entity.content,
            isCorrect: entity.isCorrect,
            question: {
                connect: {
                    id: entity.questionId
                }
            }
        }

        return updated as Model;
    }
    
}