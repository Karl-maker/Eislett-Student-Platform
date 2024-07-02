import { Prisma, PrismaClient } from "@prisma/client";
import UnexpectedError from "../../../services/error/unexpected.error";
import MultipleChoiceOption from "../../../../domain/entities/multiple-choice-option/interface.multiple.choice.option.entity";
import MultipleChoiceOptionRepository from "../interface/interface.multiple.choice.option";
import BasicMultipleChoiceOption from "../../../../domain/entities/multiple-choice-option/basic.multiple.choice.option.entity";
import PrismaRepository from "./prisma.repository";


const MultipleChoiceOptionPrismaModel = Prisma.validator<Prisma.MultipleChoiceOptionDefaultArgs>()({
});

export type MultipleChoiceOptionPrismaModelType = typeof MultipleChoiceOptionPrismaModel;

export default class MultipleChoiceOptionPrismaRepository extends PrismaRepository<MultipleChoiceOption> implements MultipleChoiceOptionRepository {

    constructor(prisma: PrismaClient) {
        super(prisma, 'multipleChoiceOption')
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