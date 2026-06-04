import express from 'express';
import SubscriptionController from '#controllers/panel/subscriptionController.js';

const router = express.Router();

router.get('/plans', SubscriptionController.getPlans);

router.get('/plans/:id', SubscriptionController.getPlanById);

router.post('/plans', SubscriptionController.createPlan);

router.put('/plans/:id', SubscriptionController.updatePlan);

router.delete('/plans/:id', SubscriptionController.deletePlan);

router.patch('/plans/status/:id', SubscriptionController.updatePlanStatus);

router.get('/user-subscriptions', SubscriptionController.getAllUserSubscriptions);

router.get('/user-subscriptions/:id', SubscriptionController.getUserSubscriptionById);

router.patch('/user-subscriptions/status/:id', SubscriptionController.updateSubscriptionStatus);

export default router;
