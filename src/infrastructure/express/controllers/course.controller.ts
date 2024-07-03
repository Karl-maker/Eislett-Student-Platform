import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { UpdateTopicDTO } from "../../../application/interfaces/presenters/dto/topic/update.topic.dto";
import CourseUseCases from "../../../domain/usecases/course.usecase";
import CoursePrismaRepository from "../../../application/interfaces/repositories/prisma/course.prisma.repository";
import { CreateCourseDTO } from "../../../application/interfaces/presenters/dto/course/create.course.dto";

const prisma = new PrismaClient();

const courseUseCases = new CourseUseCases({
    courseRepository: new CoursePrismaRepository(prisma)
})

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await courseUseCases.create(req.body as CreateCourseDTO);

        res.status(201).json(results);
    } catch (err) {
        next(err)
    }
}

const findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await courseUseCases.findById(Number(req.params.course_id));

        res.status(200).json(results);
    } catch (err) {
        next(err)
    }
}

const linkTopicToCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await courseUseCases.linkTopicToCourse(Number(req.params.course_id), Number(req.params.topic_id));

        if(results) res.status(201).end()

        res.status(500).end();
    } catch (err) {
        next(err)
    }
}

const unlinkTopicToCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await courseUseCases.unlinkTopicToCourse(Number(req.params.course_id), Number(req.params.topic_id));

        if(results) res.status(201).end()

        res.status(500).end();
    } catch (err) {
        next(err)
    }
}

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await courseUseCases.deleteById(Number(req.params.course_id));
        if(results) res.status(204).end()

        res.status(500).end();
    } catch (err) {
        next(err)
    }
}

const updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await courseUseCases.updateById(Number(req.params.topic_id), req.body as UpdateTopicDTO);

        res.status(201).json(results);
    } catch (err) {
        next(err)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await courseUseCases.findAll(Number(req.query.page_number), Number(req.query.page_size), {
            subjectId: req.query.subject_id ? String(req.query.subject_id) : undefined
        });

        res.status(200).json(results);
    } catch (err) {
        next(err)
    }
}

const QuestionController = {
    create,
    updateById,
    findById, 
    deleteById,
    linkTopicToCourse,
    unlinkTopicToCourse,
    findAll
}

export default QuestionController;