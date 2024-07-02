import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import RewardUseCases from "../../../domain/usecases/reward.usecase";
import RewardPrismaRepository from "../../../application/interfaces/repositories/prisma/reward.prisma.repository";

const prisma = new PrismaClient();

const rewardUseCases = new RewardUseCases({
    rewardRepository: new RewardPrismaRepository(prisma)
})

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await rewardUseCases.findAll(Number(req.query.page_number), Number(req.query.page_size), {
            studentId: req.query.student_id ? String(req.query.student_id) : undefined
        });

        res.status(200).json(results);
    } catch (err) {
        next(err)
    }
}

const RewardController = {
    findAll
}

export default RewardController;