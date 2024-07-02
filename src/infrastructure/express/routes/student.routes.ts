import { Router } from "express";
import StudentController from "../controllers/student.controller";
import queue from "../../../application/services/queue";
import { StudentCreateEvent } from "../../../application/services/queue/types/payload.types";
import authenticate from "../middlewares/auth.handler.middleware";
import multer from 'multer';

const studentRouter = Router();
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

studentRouter.post('/', StudentController.create);
studentRouter.post('/redeem-reward/:reward_id', authenticate, StudentController.redeemReward);
studentRouter.get('/', authenticate, StudentController.current);
studentRouter.patch('/:student_id', StudentController.updateById);
studentRouter.delete('/:student_id', StudentController.deleteById);
studentRouter.get('/:student_id', StudentController.findById);
studentRouter.get('/email/:email', StudentController.findByEmail);
studentRouter.post('/confirmation-code', StudentController.sendConfirmationByEmail);
studentRouter.post('/login', StudentController.login);
studentRouter.post('/confirm', authenticate, StudentController.confirm);
studentRouter.post('/recovery-email', StudentController.sendRecoveryByEmail);
studentRouter.post('/recover-password', StudentController.retrieveRecoveryToken);
studentRouter.post('/:student_id/profile-image', upload.single('file'), StudentController.uploadProfileImage);

queue.registerHandler(StudentCreateEvent, StudentController.sendConfirmationEmail)

export default studentRouter;