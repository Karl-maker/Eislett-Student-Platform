import { Router } from "express";
import QuestionController from "../controllers/question.controller";

const questionRouter = Router();

questionRouter.post('/', QuestionController.create);
questionRouter.put('/:question_id', QuestionController.updateById);
questionRouter.get('/:question_id', QuestionController.findById);
questionRouter.delete('/:question_id', QuestionController.deleteById);

export default questionRouter;