import express from 'express';
import SubscriptionController from '#controllers/public/subscriptionController.js';

const router = express.Router();

router.get('/plans', SubscriptionController.getPlans);

router.get('/plans/:id', SubscriptionController.getPlanById);

router.get('/plans/slug/:slug', SubscriptionController.getPlanBySlug);

router.get('/plans/category/:categorySlug', SubscriptionController.getPlansByCategory);

router.get('/plans/category/:categorySlug/tier/:tier', SubscriptionController.getPlansByCategoryAndTier);

export default router;
