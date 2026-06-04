import portfolioReviewService from '#services/portfolioReviewService.js';
import {
  successResponse,
  errorResponse,
  notFoundResponse
} from '#utils/responseFormatter.js';

class PublicReviewController {
  static async getReviews(req, res) {
    try {
      const { portfolioId } = req.params;
      const { page = 1, limit = 20, sort = 'recent' } = req.query;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      const result = await portfolioReviewService.getPublicReviews(portfolioId, {
        page: parseInt(page),
        limit: parseInt(limit),
        sort
      });

      if (!result.success) {
        return errorResponse(res, result.message, 500);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get public reviews error:', error);
      return errorResponse(res, 'Failed to retrieve reviews', 500);
    }
  }

  static async markHelpful(req, res) {
    try {
      const { reviewId } = req.params;
      const { isHelpful = true } = req.body;

      if (!reviewId) {
        return errorResponse(res, 'Review ID is required', 400);
      }

      const result = await portfolioReviewService.markHelpful(reviewId, isHelpful);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Mark helpful error:', error);
      return errorResponse(res, 'Failed to mark review as helpful', 500);
    }
  }
}

export default PublicReviewController;
