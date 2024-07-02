import { Router } from "express";
import subjectController from "../controllers/subject.controller";

const subjectRouter = Router();

subjectRouter.post('/', subjectController.create);
subjectRouter.delete('/:subject_id', subjectController.deleteById);
subjectRouter.put('/:subject_id', subjectController.updateById);
subjectRouter.get('/', subjectController.findAll);
subjectRouter.get('/:subject_id', subjectController.findById);
subjectRouter.post('/:subject_id/course/:course_id', subjectController.linkSubjectToCourse);
subjectRouter.delete('/:subject_id/course/:course_id', subjectController.unlinkSubjectToCourse);

export default subjectRouter;