import { Router } from "express";
import TopicController from "../controllers/topic.controller";

const topictRouter = Router();

topictRouter.post('/', TopicController.create);
topictRouter.delete('/:topic_id', TopicController.deleteById);
topictRouter.put('/:topic_id', TopicController.updateById);
topictRouter.get('/:topic_id', TopicController.findById);
topictRouter.post('/:topic_id/question/:question_id', TopicController.linkTopicToQuestion);
topictRouter.delete('/:topic_id/question/:question_id', TopicController.unlinkTopicToQuestion);

export default topictRouter;