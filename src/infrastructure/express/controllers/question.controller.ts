import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import QuestionUseCases from "../../../domain/usecases/question.usecase";
import QuestionPrismaRepository from "../../../application/interfaces/repositories/prisma/question.prisma.repository";
import { CreateQuestionDTO } from "../../../application/interfaces/presenters/dto/question/create.question.dto";
import { UpdateQuestionDTO } from "../../../application/interfaces/presenters/dto/question/update.question.dto";
import MultipleChoiceOptionPrismaRepository from "../../../application/interfaces/repositories/prisma/multiple.choice.option.repository";

const prisma = new PrismaClient();

const questionUseCases = new QuestionUseCases({
    questionRepository: new QuestionPrismaRepository(prisma),
    multipleChoiceOptionRepository: new MultipleChoiceOptionPrismaRepository(prisma)
})

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await questionUseCases.create(req.body as CreateQuestionDTO);

        res.status(201).json(results);
    } catch (err) {
        next(err)
    }
}

const updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await questionUseCases.updateById(Number(req.params.question_id), req.body as UpdateQuestionDTO);

        res.status(201).json(results);
    } catch (err) {
        next(err)
    }
}

const QuestionController = {
    create,
    updateById
}

export default QuestionController;