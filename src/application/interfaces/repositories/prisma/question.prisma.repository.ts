import { Prisma, PrismaClient } from "@prisma/client";
import UnexpectedError from "../../../services/error/unexpected.error";
import QuestionRepository from "../interface/interface.question.repository";
import TrueOrFalseQuestion, { TrueOrFalseQuestionParamsType } from "../../../../domain/entities/question/true.or.false.question.entity";
import MultipleChoiceQuestion, { MultipleChoiceQuestionParamsType } from "../../../../domain/entities/question/multiple.choice.question.entity";
import Question from "../../../../domain/entities/question/interface.question.entity";
import MultipleChoiceOption from "../../../../domain/entities/multiple-choice-option/interface.multiple.choice.option.entity";
import BasicMultipleChoiceOption from "../../../../domain/entities/multiple-choice-option/basic.multiple.choice.option.entity";
import MultipleChoiceOptionPrismaRepository from "./multiple.choice.option.repository";


const QuestionPrismaModel = Prisma.validator<Prisma.QuestionDefaultArgs>()({
    include: {
        multipleChoiceOptions: true
    }
});

export type QuestionPrismaModelType = typeof QuestionPrismaModel;

export default class QuestionPrismaRepository implements QuestionRepository {
    private prisma: PrismaClient;
    
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async save(entity: Question): Promise<Question> {
        try {
            if(entity.id) { // updating entity
                const saved = await this.prisma.question.update({
                    where: {
                        id: Number(entity.id)
                    },
                    data: this.fitEntityToModel<Prisma.QuestionUpdateInput>(entity),
                    include: {
                        multipleChoiceOptions: true
                    }
                })
    
                return this.fitModelToEntity(saved);
            }
    
            const saved = await this.prisma.question.create({
                data: this.fitEntityToModel<Prisma.QuestionCreateInput>(entity)
            });
    
            return this.fitModelToEntity(saved);
        } catch(err: any) {
            throw new UnexpectedError(err['message'], err);
        }
    }
    
    fitModelToEntity<Model>(model: Model): Question {
        const prismaModel = model as Prisma.QuestionGetPayload<QuestionPrismaModelType>;
        let question : Question;
        if(prismaModel.type === 'TRUE_FALSE') {
            question = new TrueOrFalseQuestion({
                id: prismaModel.id,
                createdAt: prismaModel.createdAt,
                title: prismaModel.title,
                description: prismaModel.description,
                content: prismaModel.content,
                tags: prismaModel.tags,
                totalPotentialMarks: prismaModel.totalPotentialMarks,
                isTrue: prismaModel.isTrue || false
            } as TrueOrFalseQuestionParamsType)

        } else {
            const prismaMultipleChoiceOption = new MultipleChoiceOptionPrismaRepository(this.prisma)
            const options : MultipleChoiceOption[] = prismaModel.multipleChoiceOptions.map((option) => {
                const basicMultipleChoice = new BasicMultipleChoiceOption({
                    content: option.content,
                    id: option.id,
                    isCorrect: option.isCorrect,
                    questionId: option.questionId
                })

                return prismaMultipleChoiceOption.fitModelToEntity(basicMultipleChoice)
            })
            question = new MultipleChoiceQuestion({
                id: prismaModel.id,
                createdAt: prismaModel.createdAt,
                title: prismaModel.title,
                description: prismaModel.description,
                content: prismaModel.content,
                tags: prismaModel.tags,
                totalPotentialMarks: prismaModel.totalPotentialMarks,
                options
            } as MultipleChoiceQuestionParamsType) 
        }

        return question;
    }

    fitEntityToModel<Model>(entity: Question): Model {

        let type = "MULTIPLE_CHOICE" as any;

        if(entity instanceof TrueOrFalseQuestion) type = "TRUE_FALSE";
        if(entity instanceof MultipleChoiceQuestion) type = "MULTIPLE_CHOICE";

        if(entity.id) {
            const updated: Prisma.QuestionUpdateInput = {
                title: entity.title,
                description: entity.description,
                content: entity.content,
                tags: entity.tags,
                totalPotentialMarks: entity.totalPotentialMarks,
            }

            return updated as Model;
        }

        const updated: Prisma.QuestionCreateInput = {
            title: entity.title,
            description: entity.description,
            content: entity.content,
            tags: entity.tags,
            totalPotentialMarks: entity.totalPotentialMarks,
            type
        }

        return updated as Model;
    }
    
}