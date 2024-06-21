import { Router } from "express";
import studentRouter from "./student.routes";
import questionRouter from "./question.routes";
import topictRouter from "./topic.routes";
import quizRouter from "./quiz.routes";

const router = Router();

router.use('/students', studentRouter)
router.use('/questions', questionRouter)
router.use('/topics', topictRouter)
router.use('/quizzes', quizRouter)

export default router