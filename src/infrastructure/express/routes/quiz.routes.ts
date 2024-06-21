import { Router } from "express";
import QuizController from "../controllers/quiz.controller";

const quizRouter = Router();

quizRouter.post('/', QuizController.generate);

export default quizRouter;