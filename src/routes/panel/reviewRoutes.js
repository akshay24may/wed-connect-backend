import express from 'express';
import PanelReviewController from '#controllers/panel/reviewController.js';
import { authenticate, isPanelUser } from '#middleware/authMiddleware.js';

const router = express.Router();

router.get('/reviews', authenticate, isPanelUser, PanelReviewController.getReviews);

router.post(
  '/reviews/:reviewId/approve',
  authenticate, isPanelUser,
  PanelReviewController.approveReview
);

router.post(
  '/reviews/:reviewId/reject',
  authenticate, isPanelUser,
  PanelReviewController.rejectReview
);

router.patch(
  '/reviews/:reviewId/featured',
  authenticate, isPanelUser,
  PanelReviewController.toggleFeatured
);

router.delete('/reviews/:reviewId', authenticate, isPanelUser, PanelReviewController.deleteReview);

export default router;
