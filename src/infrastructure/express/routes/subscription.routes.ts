import { Router } from "express";
import subscriptionController from "../controllers/subscription.controller";

const subscriptionRouter = Router();

subscriptionRouter.post('/', subscriptionController.create);
subscriptionRouter.delete('/:subscription_id', subscriptionController.deleteById);
subscriptionRouter.put('/:subscription_id', subscriptionController.updateById);
subscriptionRouter.get('/', subscriptionController.findAll);
subscriptionRouter.get('/:subscription_id', subscriptionController.findById);

export default subscriptionRouter;