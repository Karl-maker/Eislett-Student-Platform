import { Router } from "express";
import studentRouter from "./student.routes";
import questionRouter from "./question.routes";
import topictRouter from "./topic.routes";
import quizRouter from "./quiz.routes";
import courseRouter from "./course.routes";
import subjectRouter from "./subject.routes";
import primarySubjectRouter from "./primary.subject.routes";
import rewardRouter from "./reward.routes";

const router = Router();

router.use('/students', studentRouter)
router.use('/questions', questionRouter)
router.use('/topics', topictRouter)
router.use('/quizzes', quizRouter)
router.use('/courses', courseRouter)
router.use('/subjects', subjectRouter)
router.use('/primary-subjects', primarySubjectRouter)
router.use('/rewards', rewardRouter)

export default router