import express from 'express';
import ReviewController from '#controllers/consumer/reviewController.js';
import authMiddleware from '#middleware/authMiddleware.js';
import uploadMiddleware from '#uploads/uploadMiddleware.js';

const router = express.Router();

router.get('/reviews', authMiddleware, ReviewController.getReviews);

router.post(
  '/portfolios/:portfolioId/reviews',
  authMiddleware,
  ReviewController.createReview
);

router.put('/reviews/:reviewId', authMiddleware, ReviewController.updateReview);

router.delete('/reviews/:reviewId', authMiddleware, ReviewController.deleteReview);

router.post(
  '/reviews/:reviewId/media/upload',
  authMiddleware,
  uploadMiddleware.reviewMedia,
  ReviewController.uploadMedia
);

export default router;
