import { Router } from "express";
import studentRouter from "./student.routes";
import questionRouter from "./question.routes";

const router = Router();

router.use('/students', studentRouter)
router.use('/questions', questionRouter)

export default router