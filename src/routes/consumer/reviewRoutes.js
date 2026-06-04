import express from 'express';
import ReviewController from '#controllers/consumer/reviewController.js';
import { authenticate, isConsumer } from '#middleware/authMiddleware.js';
import uploadMiddleware from '#middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/reviews', authenticate, isConsumer, ReviewController.getReviews);

router.post(
  '/portfolios/:portfolioId/reviews',
  authenticate, isConsumer,
  ReviewController.createReview
);

router.put('/reviews/:reviewId', authenticate, isConsumer, ReviewController.updateReview);

router.delete('/reviews/:reviewId', authenticate, isConsumer, ReviewController.deleteReview);

router.post(
  '/reviews/:reviewId/media/upload',
  authenticate, isConsumer,
  uploadMiddleware.reviewMedia,
  ReviewController.uploadMedia
);

export default router;
