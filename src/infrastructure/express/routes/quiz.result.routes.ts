import { Router } from "express";
import quizResultController from "../controllers/quiz.result.controller";

const quizResultRouter = Router();

quizResultRouter.post('/', quizResultController.create);
quizResultRouter.put('/:quiz_result_id', quizResultController.updateById);

export default quizResultRouter;