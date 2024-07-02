import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import QuestionUseCases from "../../../domain/usecases/question.usecase";
import QuestionPrismaRepository from "../../../application/interfaces/repositories/prisma/question.prisma.repository";
import { CreateQuestionDTO } from "../../../application/interfaces/presenters/dto/question/create.question.dto";
import { UpdateQuestionDTO } from "../../../application/interfaces/presenters/dto/question/update.question.dto";
import MultipleChoiceOptionPrismaRepository from "../../../application/interfaces/repositories/prisma/multiple.choice.option.repository";
import TopicUseCases from "../../../domain/usecases/topic.usecase";
import TopicPrismaRepository from "../../../application/interfaces/repositories/prisma/topic.repository";
import { CreateTopicDTO } from "../../../application/interfaces/presenters/dto/topic/create.topic.dto";
import { UpdateTopicDTO } from "../../../application/interfaces/presenters/dto/topic/update.topic.dto";

const prisma = new PrismaClient();

const topicUseCases = new TopicUseCases({
    topicRepository: new TopicPrismaRepository(prisma)
})

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await topicUseCases.create(req.body as CreateTopicDTO);

        res.status(201).json(results);
    } catch (err) {
        next(err)
    }
}

const findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await topicUseCases.findById(Number(req.params.topic_id));

        res.status(200).json(results);
    } catch (err) {
        next(err)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await topicUseCases.findAll(Number(req.query.page_number), Number(req.query.page_size), {
            courseId: req.query.course_id ? String(req.query.course_id) : undefined
        });

        res.status(200).json(results);
    } catch (err) {
        next(err)
    }
}

const linkTopicToQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await topicUseCases.linkTopicToQuestion(Number(req.params.topic_id), Number(req.params.question_id));

        if(results) res.status(201).end()

        res.status(500).end();
    } catch (err) {
        next(err)
    }
}

const unlinkTopicToQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await topicUseCases.unlinkTopicToQuestion(Number(req.params.topic_id), Number(req.params.question_id));

        if(results) res.status(201).end()

        res.status(500).end();
    } catch (err) {
        next(err)
    }
}

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await topicUseCases.deleteById(Number(req.params.topic_id));
        if(results) res.status(204).end()

        res.status(500).end();
    } catch (err) {
        next(err)
    }
}

const updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await topicUseCases.updateById(Number(req.params.topic_id), req.body as UpdateTopicDTO);

        res.status(201).json(results);
    } catch (err) {
        next(err)
    }
}

const QuestionController = {
    create,
    updateById,
    findById, 
    deleteById,
    unlinkTopicToQuestion,
    linkTopicToQuestion,
    findAll
}

export default QuestionController;