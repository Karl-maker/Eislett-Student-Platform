import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import StudentUseCases from "../../../domain/usecases/student.usecase";
import StudentPrismaRepository from "../../../application/interfaces/repositories/prisma/student.prisma.repository";
import { CreateStudentDTO } from "../../../application/interfaces/presenters/dto/student/create.student.dto";
import { UpdateStudentDTO } from "../../../application/interfaces/presenters/dto/student/update.student.dto";
import { StudentCreateEvent, StudentCreatePayload } from "../../../application/services/queue/types/payload.types";
import logger from "../../../application/services/log";
import { Event } from "../../../application/services/queue/general.queue.service";
import queue from "../../../application/services/queue";
import Nodemailer from "../../../application/services/email/nodemailer.email";
import BadRequestError from "../../../application/services/error/bad.request.error";
import S3 from "../../../application/services/storage/aws.s3.storage.service";
import config from "../../../config";
import RewardUseCases from "../../../domain/usecases/reward.usecase";
import RewardPrismaRepository from "../../../application/interfaces/repositories/prisma/reward.prisma.repository";
import QuestionUseCases from "../../../domain/usecases/question.usecase";
import QuestionPrismaRepository from "../../../application/interfaces/repositories/prisma/question.prisma.repository";
import MultipleChoiceOptionPrismaRepository from "../../../application/interfaces/repositories/prisma/multiple.choice.option.prisma.repository";

const prisma = new PrismaClient();
const emailService = new Nodemailer()
const storage = new S3(config.aws.s3.bucket, config.aws.s3.region)

const studentUseCases = new StudentUseCases({
    studentRepository: new StudentPrismaRepository(prisma),
    rewardUseCases: new RewardUseCases({
        rewardRepository: new RewardPrismaRepository(prisma),
        questionUseCases: new QuestionUseCases({
            questionRepository: new QuestionPrismaRepository(prisma),
            multipleChoiceOptionRepository: new MultipleChoiceOptionPrismaRepository(prisma)
        })
    }),
    emailService,
    storage
})

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await studentUseCases.create(req.body as CreateStudentDTO);
        const event : Event<StudentCreatePayload> = {
            type: StudentCreateEvent,
            payload: {
                student: results
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
        const results = await studentUseCases.findById(req.params.student_id);
        res.json(results);
    } catch (err) {
        next(err)
    }
}

const current = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await studentUseCases.findById(req['user'].id);
        res.json(results);
    } catch (err) {
        next(err)
    }
}

const findByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await studentUseCases.findByEmail(req.params.email);
        res.json(results);
    } catch (err) {
        next(err)
    }
}

const updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await studentUseCases.updateById(req.params.student_id, req.body as UpdateStudentDTO);
        res.json(results);
    } catch (err) {
        next(err)
    }
}

const sendConfirmationByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await studentUseCases.findByEmail(req.body.email);
        await studentUseCases.updateConfirmationCode(results)
        res.status(200).end();;
    } catch (err) {
        next(err)
    }
}

const sendRecoveryByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const student = await studentUseCases.updateRecoveryCode(req.body.email)
        res.status(200).end();;
    } catch (err) {
        next(err)
    }
}

const redeemReward = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await studentUseCases.redeemCoins(req['user'].id, req.params.reward_id)
        if(!result) throw new BadRequestError('Cannot Redeem');
        res.status(200).end();
    } catch (err) {
        next(err)
    }
}

const uploadProfileImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw new BadRequestError('No file uploaded');
        }
        const buffer = req.file.buffer;
        const extension = req.file.mimetype.split('/')[1];
        const student = await studentUseCases.uploadProfileImage(Number(req.params.student_id), buffer, extension)
        res.json(student);
    } catch (err) {
        next(err)
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await studentUseCases.login(req.body.email, req.body.password);
        res.json({
            accessToken: results
        });
    } catch (err) {
        next(err)
    }
}

const confirm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as any
        await studentUseCases.confirm(req.body.code, request.user.id);
        res.status(200).end();;
    } catch (err) {
        next(err)
    }
}

const retrieveRecoveryToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await studentUseCases.retrieveRecoveryToken(req.body.code, req.body.email);
        res.json({
            tempToken: results
        });
    } catch (err) {
        next(err)
    }
}

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await studentUseCases.delete(req.params.student_id);
        if(results) res.status(204).end()
        
        res.status(500).end();
    } catch (err) {
        next(err)
    }
}

const sendConfirmationEmail = async (event: Event<StudentCreatePayload>) => {
    await studentUseCases.updateConfirmationCode(event.payload.student)
}

const StudentController = {
    create,
    findByEmail,
    findById,
    updateById,
    confirm,
    sendConfirmationEmail,
    sendConfirmationByEmail,
    sendRecoveryByEmail,
    retrieveRecoveryToken,
    login,
    current,
    deleteById,
    uploadProfileImage,
    redeemReward
}

export default StudentController;