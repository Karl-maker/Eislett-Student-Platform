import { Router } from "express";
import authenticate from "../middlewares/auth.handler.middleware";
import RewardController from "../controllers/reward.controller";

const rewardRouter = Router();

rewardRouter.get('/', authenticate, RewardController.findAll);

export default rewardRouter;