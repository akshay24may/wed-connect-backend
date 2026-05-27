import express from 'express';
import PanelReviewController from '#controllers/panel/reviewController.js';
import authMiddleware from '#middleware/authMiddleware.js';

const router = express.Router();

router.get('/reviews', authMiddleware, PanelReviewController.getReviews);

router.post(
  '/reviews/:reviewId/approve',
  authMiddleware,
  PanelReviewController.approveReview
);

router.post(
  '/reviews/:reviewId/reject',
  authMiddleware,
  PanelReviewController.rejectReview
);

router.patch(
  '/reviews/:reviewId/featured',
  authMiddleware,
  PanelReviewController.toggleFeatured
);

router.delete('/reviews/:reviewId', authMiddleware, PanelReviewController.deleteReview);

export default router;
