import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import QuizResultUseCases from "../../../domain/usecases/quiz.result.usecases";
import QuizResultPrismaRepository from "../../../application/interfaces/repositories/prisma/quiz.result.prisma.repository";
import { CreateQuizResultDTO } from "../../../application/interfaces/presenters/dto/quiz-result/create.quiz.result.dto";
import { UpdateQuizResultDTO } from "../../../application/interfaces/presenters/dto/quiz-result/update.quiz.result.dto";
import queue from "../../../application/services/queue";
import { Event } from "../../../application/services/queue/general.queue.service";
import { QuizResultCreateEvent, QuizResultCreatePayload, QuizResultUpdateEvent, QuizResultUpdatePayload } from "../../../application/services/queue/types/payload.types";

const prisma = new PrismaClient();

const quizResultUseCases = new QuizResultUseCases({
    quizResultRepository: new QuizResultPrismaRepository(prisma)
})

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await quizResultUseCases.findAll(Number(req.query.page_number), Number(req.query.page_size), {
            studentId: req.query.student_id ? String(req.query.student_id) : undefined
        })

        res.status(200).json(result);
    } catch(err) {
        next(err);
    }
}

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await quizResultUseCases.create(Number(req['user'].id), req.body as CreateQuizResultDTO);

        const event : Event<QuizResultCreatePayload> = {
            type: QuizResultCreateEvent,
            payload: {
                quizResult: results
            }
        }

        queue.enqueue(event).then(async () => {
            const dequeuedEvent = await queue.dequeue();
            if (dequeuedEvent) {
                queue.process(dequeuedEvent);
            }
        });

        res.status(201).json(results);
    } catch (err) {
        next(err)
    }
}

const updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await quizResultUseCases.updateResultsById(Number(req.params.quiz_result_id), Number(req['user'].id), req.body as UpdateQuizResultDTO);
        const event : Event<QuizResultUpdatePayload> = {
            type: QuizResultUpdateEvent,
            payload: {
                quizResult: results
            }
        }

        queue.enqueue(event).then(async () => {
            const dequeuedEvent = await queue.dequeue();
            if (dequeuedEvent) {
                queue.process(dequeuedEvent);
            }
        });

        res.status(201).json(results);
    } catch (err) {
        next(err)
    }
}

const QuizResultController = {
    create,
    updateById,
    findAll
}

export default QuizResultController;