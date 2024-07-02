import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import QuestionUseCases from "../../../domain/usecases/question.usecase";
import QuestionPrismaRepository from "../../../application/interfaces/repositories/prisma/question.prisma.repository";
import { CreateQuestionDTO } from "../../../application/interfaces/presenters/dto/question/create.question.dto";
import { UpdateQuestionDTO } from "../../../application/interfaces/presenters/dto/question/update.question.dto";
import MultipleChoiceOptionPrismaRepository from "../../../application/interfaces/repositories/prisma/multiple.choice.option.prisma.repository";
import { FindByDifficultyAndTopicsDTO } from "../../../application/interfaces/presenters/dto/question/find.by.difficulty.and.topics.dto";

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

const findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await questionUseCases.findById(Number(req.params.question_id));

        res.status(200).json(results);
    } catch (err) {
        next(err)
    }
}


const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await questionUseCases.deleteById(Number(req.params.question_id));
        if(results) res.status(204).end()

        res.status(500).end();
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

const findByDifficultyAndTopics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            topics,
            difficultyLevels,
            amountOfQuestions
        } = req.body as FindByDifficultyAndTopicsDTO
        const results = await questionUseCases.findByDifficultyAndTopics(topics, difficultyLevels, amountOfQuestions);

        res.json(results);
    } catch (err) {
        next(err)
    }
}

const QuestionController = {
    create,
    updateById,
    findById, 
    deleteById,
    findByDifficultyAndTopics
}

export default QuestionController;