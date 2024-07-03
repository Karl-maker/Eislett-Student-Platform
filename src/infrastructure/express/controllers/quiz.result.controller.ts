import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import QuizResultUseCases from "../../../domain/usecases/quiz.result.usecases";
import QuizResultPrismaRepository from "../../../application/interfaces/repositories/prisma/quiz.result.prisma.repository";
import { CreateQuizResultDTO } from "../../../application/interfaces/presenters/dto/quiz-result/create.quiz.result.dto";
import { UpdateQuizResultDTO } from "../../../application/interfaces/presenters/dto/quiz-result/update.quiz.result.dto";

const prisma = new PrismaClient();

const quizResultUseCases = new QuizResultUseCases({
    quizResultRepository: new QuizResultPrismaRepository(prisma)
})

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await quizResultUseCases.create(Number(req['user'].id), req.body as CreateQuizResultDTO);

        res.status(201).json(results);
    } catch (err) {
        next(err)
    }
}

const updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await quizResultUseCases.updateResultsById(Number(req.params.quiz_result_id), Number(req['user'].id), req.body as UpdateQuizResultDTO);

        res.status(201).json(results);
    } catch (err) {
        next(err)
    }
}

const QuizResultController = {
    create,
    updateById
}

export default QuizResultController;