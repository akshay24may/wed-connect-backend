import express from 'express';
import SubscriptionController from '#controllers/vendor/subscriptionController.js';

const router = express.Router();

router.get('/', SubscriptionController.getUserSubscriptions);

router.get('/eligibility', SubscriptionController.checkEligibility);

router.get('/available-plans', SubscriptionController.getAvailablePlans);

router.get('/:id', SubscriptionController.getUserSubscription);

router.post('/purchase', SubscriptionController.purchaseSubscription);

router.post('/validate-portfolio-creation', SubscriptionController.validatePortfolioCreation);

router.post('/cancel/:id', SubscriptionController.cancelSubscription);

export default router;
