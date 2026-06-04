import express from 'express';
import VendorReviewController from '#controllers/vendor/reviewController.js';
import { authenticate, isVendor } from '#middleware/authMiddleware.js';

const router = express.Router();

router.get('/reviews', authenticate, isVendor, VendorReviewController.getReviews);

router.post(
  '/reviews/:reviewId/respond',
  authenticate, isVendor,
  VendorReviewController.addResponse
);

router.put(
  '/reviews/:reviewId/response',
  authenticate, isVendor,
  VendorReviewController.updateResponse
);

export default router;
