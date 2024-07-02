import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import SubjectUseCases from "../../../domain/usecases/subject.usecase";
import SubjectPrismaRepository from "../../../application/interfaces/repositories/prisma/subject.prisma.repository";
import { CreateSubjectDTO } from "../../../application/interfaces/presenters/dto/subject/create.subject.dto";
import { UpdateSubjectDTO } from "../../../application/interfaces/presenters/dto/subject/update.subject.dto";

const prisma = new PrismaClient();

const subjectUseCases = new SubjectUseCases({
    subjectRepository: new SubjectPrismaRepository(prisma)
})

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await subjectUseCases.create(req.body as CreateSubjectDTO);

        res.status(201).json(results);
    } catch (err) {
        next(err)
    }
}

const findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await subjectUseCases.findById(Number(req.params.subject_id));

        res.status(200).json(results);
    } catch (err) {
        next(err)
    }
}

const linkSubjectToCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await subjectUseCases.linkSubjectToCourse(Number(req.params.course_id), Number(req.params.subject_id));

        if(results) res.status(201).end()

        res.status(500).end();
    } catch (err) {
        next(err)
    }
}

const unlinkSubjectToCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await subjectUseCases.unlinkSubjectToCourse(Number(req.params.course_id), Number(req.params.subject_id));

        if(results) res.status(201).end()

        res.status(500).end();
    } catch (err) {
        next(err)
    }
}

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await subjectUseCases.deleteById(Number(req.params.subject_id));
        if(results) res.status(204).end()

        res.status(500).end();
    } catch (err) {
        next(err)
    }
}

const updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await subjectUseCases.updateById(Number(req.params.subject_id), req.body as UpdateSubjectDTO);

        res.status(201).json(results);
    } catch (err) {
        next(err)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await subjectUseCases.findAll(Number(req.query.page_number), Number(req.query.page_size), {
            primarySubjectId: req.query.primary_subject_id ? String(req.query.primary_subject_id) : undefined
        });

        res.status(200).json(results);
    } catch (err) {
        next(err)
    }
}

const SubjectController = {
    create,
    updateById,
    findById, 
    deleteById,
    linkSubjectToCourse,
    unlinkSubjectToCourse,
    findAll
}

export default SubjectController;