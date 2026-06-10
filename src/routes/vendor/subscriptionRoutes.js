import express from 'express';
import SubscriptionController from '#controllers/vendor/subscriptionController.js';
import { authenticate, isVendor } from '#middleware/authMiddleware.js';

const router = express.Router();

// Secure all vendor subscription routes
router.use(authenticate, isVendor);

router.get('/', SubscriptionController.getUserSubscriptions);

router.get('/eligibility', SubscriptionController.checkEligibility);

router.get('/available-plans', SubscriptionController.getAvailablePlans);

router.get('/active', SubscriptionController.getActiveSubscriptions);

router.get('/:id', SubscriptionController.getUserSubscription);

router.post('/purchase', SubscriptionController.purchaseSubscription);

router.post('/validate-portfolio-creation', SubscriptionController.validatePortfolioCreation);

router.post('/cancel/:id', SubscriptionController.cancelSubscription);

export default router;
