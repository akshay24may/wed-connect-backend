import portfolioReviewService from '#services/portfolioReviewService.js';
import portfolioMediaService from '#services/portfolioMediaService.js';
import {
  successResponse,
  errorResponse,
  createResponse,
  notFoundResponse
} from '#utils/responseFormatter.js';

class ReviewController {
  static async getReviews(req, res) {
    try {
      const userId = req.user.userId;
      const { page = 1, limit = 20 } = req.query;

      const result = await portfolioReviewService.getConsumerReviews(
        userId,
        parseInt(page),
        parseInt(limit)
      );

      if (!result.success) {
        return errorResponse(res, result.message, 500);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get consumer reviews error:', error);
      return errorResponse(res, 'Failed to retrieve reviews', 500);
    }
  }

  static async createReview(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId } = req.params;
      const reviewData = req.body;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      const result = await portfolioReviewService.createReview(portfolioId, userId, reviewData);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return createResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Create review error:', error);
      return errorResponse(res, 'Failed to create review', 500);
    }
  }

  static async updateReview(req, res) {
    try {
      const userId = req.user.userId;
      const { reviewId } = req.params;
      const reviewData = req.body;

      if (!reviewId) {
        return errorResponse(res, 'Review ID is required', 400);
      }

      const result = await portfolioReviewService.updateReview(reviewId, userId, reviewData);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Update review error:', error);
      return errorResponse(res, 'Failed to update review', 500);
    }
  }

  static async deleteReview(req, res) {
    try {
      const userId = req.user.userId;
      const { reviewId } = req.params;

      if (!reviewId) {
        return errorResponse(res, 'Review ID is required', 400);
      }

      const result = await portfolioReviewService.deleteReview(reviewId, userId);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      console.error('Delete review error:', error);
      return errorResponse(res, 'Failed to delete review', 500);
    }
  }

  static async uploadMedia(req, res) {
    try {
      const userId = req.user.userId;
      const { reviewId } = req.params;
      const { mediaType } = req.body;

      if (!reviewId) {
        return errorResponse(res, 'Review ID is required', 400);
      }

      if (!req.files || req.files.length === 0) {
        return errorResponse(res, 'No files uploaded', 400);
      }

      if (!mediaType) {
        return errorResponse(res, 'Media type is required', 400);
      }

      const result = await portfolioMediaService.uploadMedia(
        null,
        userId,
        req.files,
        mediaType,
        'review',
        parseInt(reviewId)
      );

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Upload review media error:', error);
      return errorResponse(res, 'Failed to upload review media', 500);
    }
  }
}

export default ReviewController;
