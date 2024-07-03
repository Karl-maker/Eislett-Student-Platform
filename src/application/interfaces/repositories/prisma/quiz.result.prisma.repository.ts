import { Prisma, PrismaClient } from "@prisma/client";
import generateRandomOffsets from "../../../../infrastructure/utils/offset";
import TopicPrismaRepository from "./topic.prisma.repository";
import PrismaRepository from "./prisma.repository";
import QuestionResult from "../../../../domain/entities/question-result/interface.question.result.entity";
import QuestionResultRepository from "../interface/interface.quiz.result.repository";
import QuizResult from "../../../../domain/entities/quiz-result/interface.quiz.result.entity";
import QuizResultRepository from "../interface/interface.quiz.result.repository";
import BasicQuizResult from "../../../../domain/entities/quiz-result/basic.quiz.result.entity";
import BasicQuestionResult from "../../../../domain/entities/question-result/basic.question.result.entity";

const QuizResultPrismaModel = Prisma.validator<Prisma.QuizResultDefaultArgs>()({});

export type QuizResultPrismaModelType = typeof QuizResultPrismaModel;

export default class QuizResultPrismaRepository extends PrismaRepository<QuizResult> implements QuizResultRepository {

    constructor(prisma: PrismaClient) {
        super(prisma, 'questionResult')
    }

    fitModelToEntity<Model>(model: Model): QuizResult {
        const prismaModel = model as Prisma.QuizResultGetPayload<QuizResultPrismaModelType>;
    
        let quizResult : QuizResult;
        let questionResults : QuestionResult[] = [];

        prismaModel.questions.forEach((question, i) => {
            questionResults.push(new BasicQuestionResult({
                id: i,
                createdAt: prismaModel.createdAt,
                marksRecieved: prismaModel.marks[i],
                questionId: prismaModel.questions[i],
                quizResultId: prismaModel.id
            }))
        })

        quizResult = new BasicQuizResult({
            id: prismaModel.id,
            createdAt: prismaModel.createdAt,
            studentId: prismaModel.studentId,
            questionResults
        })

        return quizResult;
    }

    fitEntityToModel<Model>(entity: QuizResult): Model {
        let marks : number[] = [];
        let questions : number[] = [];

        entity.questionResults.forEach((result) => {
            marks.push(result.marksRecieved)
            questions.push(Number(result.questionId))
        })

        if (entity.id) {
            const updated: Prisma.QuizResultUpdateInput = {
                marks,
                questions
            };

            return updated as Model;
        }

        const updated: Prisma.QuizResultCreateInput = {
            student: {
                connect: {
                    id: entity.studentId
                }
            },
            marks,
            questions,
        };

        return updated as Model;
    }
}
