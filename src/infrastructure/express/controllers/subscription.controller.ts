import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import SubscriptionUseCases from "../../../domain/usecases/subscription.usecase";
import SubscriptionPrismaRepository from "../../../application/interfaces/repositories/prisma/subscription.prisma.repository";
import { CreateSubscriptionDTO } from "../../../application/interfaces/presenters/dto/subscription/create.subscription.dto";
import { UpdateSubscriptionDTO } from "../../../application/interfaces/presenters/dto/subscription/update.subscription.dto";
import { Event } from "../../../application/services/queue/general.queue.service";
import { SubscriptionCreateEvent, SubscriptionCreatePayload } from "../../../application/services/queue/types/payload.types";
import Nodemailer from "../../../application/services/email/nodemailer.email";
import queue from "../../../application/services/queue";
import StudentPrismaRepository from "../../../application/interfaces/repositories/prisma/student.prisma.repository";
import SubjectPrismaRepository from "../../../application/interfaces/repositories/prisma/subject.prisma.repository";

const prisma = new PrismaClient();
const emailService = new Nodemailer()

const subscriptionUseCases = new SubscriptionUseCases({
    subscriptionRepository: new SubscriptionPrismaRepository(prisma),
    studentRepository: new StudentPrismaRepository(prisma),
    subjectRepository: new SubjectPrismaRepository(prisma),
    emailService,
})

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await subscriptionUseCases.create(req.body as CreateSubscriptionDTO);

        const event : Event<SubscriptionCreatePayload> = {
            type: SubscriptionCreateEvent,
            payload: {
                subscription: results
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

const findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await subscriptionUseCases.findById(Number(req.params.subscription_id));

        res.status(200).json(results);
    } catch (err) {
        next(err)
    }
}

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await subscriptionUseCases.deleteById(Number(req.params.subscription_id));
        if(results) res.status(204).end()

        res.status(500).end();
    } catch (err) {
        next(err)
    }
}

const updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await subscriptionUseCases.updateById(Number(req.params.subject_id), req.body as UpdateSubscriptionDTO);

        res.status(201).json(results);
    } catch (err) {
        next(err)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await subscriptionUseCases.findAll(Number(req.query.page_number), Number(req.query.page_size), {
            studentId: req.query.student_id ? String(req.query.student_id) : undefined
        });

        res.status(200).json(results);
    } catch (err) {
        next(err)
    }
}

const sendCreatedSubscriptionEmail = async (event: Event<SubscriptionCreatePayload>) => {
    await subscriptionUseCases.sendSubscritpionCreatedEmail(event.payload.subscription)
}

const SubscriptionController = {
    create,
    updateById,
    findById, 
    deleteById,
    findAll,
    sendCreatedSubscriptionEmail
}

export default SubscriptionController;