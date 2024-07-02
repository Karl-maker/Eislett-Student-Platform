import { Router } from "express";
import primarySubjectController from "../controllers/primary.subject.controller";

const primarySubjectRouter = Router();

primarySubjectRouter.post('/', primarySubjectController.create);
primarySubjectRouter.delete('/:primary_subject_id', primarySubjectController.deleteById);
primarySubjectRouter.put('/:primary_subject_id', primarySubjectController.updateById);
primarySubjectRouter.get('/', primarySubjectController.findAll);
primarySubjectRouter.get('/:primary_subject_id', primarySubjectController.findById);
primarySubjectRouter.post('/:primary_subject_id/subject/:subject_id', primarySubjectController.linkSubjectToPrimarySubject);
primarySubjectRouter.delete('/:primary_subject_id/subject/:subject_id', primarySubjectController.unlinkSubjectToPrimarySubject);

export default primarySubjectRouter;