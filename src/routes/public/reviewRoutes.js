import express from 'express';
import PublicReviewController from '#controllers/public/reviewController.js';

const router = express.Router();

router.get('/portfolios/:portfolioId/reviews', PublicReviewController.getReviews);

router.post('/reviews/:reviewId/helpful', PublicReviewController.markHelpful);

export default router;
