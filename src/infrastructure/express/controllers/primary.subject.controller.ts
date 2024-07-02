import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import PrimarySubjectUseCases from "../../../domain/usecases/primary.subject.usecase";
import PrimarySubjectPrismaRepository from "../../../application/interfaces/repositories/prisma/primary.subject.prisma.repository";
import { CreatePrimarySubjectDTO } from "../../../application/interfaces/presenters/dto/primary-subject/create.primary.subject.dto";
import { UpdatePrimarySubjectDTO } from "../../../application/interfaces/presenters/dto/primary-subject/update.primary.subject.dto";

const prisma = new PrismaClient();

const primarySubjectUseCases = new PrimarySubjectUseCases({
    primarySubjectRepository: new PrimarySubjectPrismaRepository(prisma)
})

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await primarySubjectUseCases.create(req.body as CreatePrimarySubjectDTO);

        res.status(201).json(results);
    } catch (err) {
        next(err)
    }
}

const findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await primarySubjectUseCases.findById(Number(req.params.primary_subject_id));

        res.status(200).json(results);
    } catch (err) {
        next(err)
    }
}

const linkSubjectToPrimarySubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await primarySubjectUseCases.linkSubjectToPrimarySubject(Number(req.params.primary_subject_id), Number(req.params.subject_id));

        if(results) res.status(201).end()

        res.status(500).end();
    } catch (err) {
        next(err)
    }
}

const unlinkSubjectToPrimarySubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await primarySubjectUseCases.unlinkSubjectToPrimarySubject(Number(req.params.primary_subject_id), Number(req.params.subject_id));

        if(results) res.status(201).end()

        res.status(500).end();
    } catch (err) {
        next(err)
    }
}

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await primarySubjectUseCases.deleteById(Number(req.params.primary_subject_id));
        if(results) res.status(204).end()

        res.status(500).end();
    } catch (err) {
        next(err)
    }
}

const updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await primarySubjectUseCases.updateById(Number(req.params.primary_subject_id), req.body as UpdatePrimarySubjectDTO);

        res.status(201).json(results);
    } catch (err) {
        next(err)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await primarySubjectUseCases.findAll(Number(req.query.page_number), Number(req.query.page_size), {

        });

        res.status(200).json(results);
    } catch (err) {
        next(err)
    }
}

const PrimarySubjectController = {
    create,
    updateById,
    findById, 
    deleteById,
    linkSubjectToPrimarySubject,
    unlinkSubjectToPrimarySubject,
    findAll
}

export default PrimarySubjectController;