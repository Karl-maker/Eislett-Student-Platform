import { Router } from "express";
import QuestionController from "../controllers/question.controller";

const questionRouter = Router();

questionRouter.post('/', QuestionController.create);
questionRouter.put('/:question_id', QuestionController.updateById);

export default questionRouter;