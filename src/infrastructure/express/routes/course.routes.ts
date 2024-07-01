import { Router } from "express";
import courseController from "../controllers/course.controller";

const courseRouter = Router();

courseRouter.post('/', courseController.create);
courseRouter.delete('/:course_id', courseController.deleteById);
courseRouter.put('/:course_id', courseController.updateById);
courseRouter.get('/', courseController.findAll);
courseRouter.get('/:course_id', courseController.findById);
courseRouter.post('/:course_id/topic/:topic_id', courseController.linkTopicToCourse);
courseRouter.delete('/:course_id/topic/:topic_id', courseController.unlinkTopicToCourse);

export default courseRouter;