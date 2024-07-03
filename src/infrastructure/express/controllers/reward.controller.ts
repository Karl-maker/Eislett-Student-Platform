import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import RewardUseCases from "../../../domain/usecases/reward.usecase";
import RewardPrismaRepository from "../../../application/interfaces/repositories/prisma/reward.prisma.repository";
import { Event } from "../../../application/services/queue/general.queue.service";
import { QuizResultCreatePayload } from "../../../application/services/queue/types/payload.types";
import QuestionUseCases from "../../../domain/usecases/question.usecase";
import QuestionPrismaRepository from "../../../application/interfaces/repositories/prisma/question.prisma.repository";
import MultipleChoiceQuestion from "../../../domain/entities/question/multiple.choice.question.entity";
import MultipleChoiceOptionPrismaRepository from "../../../application/interfaces/repositories/prisma/multiple.choice.option.prisma.repository";

const prisma = new PrismaClient();

const rewardUseCases = new RewardUseCases({
    rewardRepository: new RewardPrismaRepository(prisma),
    questionUseCases: new QuestionUseCases({
        questionRepository: new QuestionPrismaRepository(prisma),
        multipleChoiceOptionRepository: new MultipleChoiceOptionPrismaRepository(prisma)
    })
})

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await rewardUseCases.findAll(Number(req.query.page_number), Number(req.query.page_size), {
            studentId: req.query.student_id ? String(req.query.student_id) : undefined
        });

        res.status(200).json(results);
    } catch (err) {
        next(err)
    }
}

const createRewardFromQuizResult = async (event: Event<QuizResultCreatePayload>) => {
    await rewardUseCases.createFromQuizResult(event.payload.quizResult)
}

const RewardController = {
    findAll,
    createRewardFromQuizResult
}

export default RewardController;