import { Router } from "express";
import authenticate from "../middlewares/auth.handler.middleware";
import RewardController from "../controllers/reward.controller";
import queue from "../../../application/services/queue";
import { QuizResultCreateEvent } from "../../../application/services/queue/types/payload.types";

const rewardRouter = Router();

rewardRouter.get('/', authenticate, RewardController.findAll);

queue.registerHandler(QuizResultCreateEvent, RewardController.createRewardFromQuizResult)

export default rewardRouter;