import express from 'express';
import VendorReviewController from '#controllers/vendor/reviewController.js';
import authMiddleware from '#middleware/authMiddleware.js';

const router = express.Router();

router.get('/reviews', authMiddleware, VendorReviewController.getReviews);

router.post(
  '/reviews/:reviewId/respond',
  authMiddleware,
  VendorReviewController.addResponse
);

router.put(
  '/reviews/:reviewId/response',
  authMiddleware,
  VendorReviewController.updateResponse
);

export default router;
