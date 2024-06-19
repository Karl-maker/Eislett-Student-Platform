import { Router } from "express";
import studentRouter from "./student.routes";

const router = Router();

router.use('/students', studentRouter)

export default router