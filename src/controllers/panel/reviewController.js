import portfolioReviewService from '#services/portfolioReviewService.js';
import {
  successResponse,
  errorResponse,
  notFoundResponse
} from '#utils/responseFormatter.js';

class PanelReviewController {
  static async getReviews(req, res) {
    try {
      const { page = 1, limit = 20, status, portfolioId } = req.query;

      const result = await portfolioReviewService.getPanelReviews({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        portfolioId: portfolioId ? parseInt(portfolioId) : undefined
      });

      if (!result.success) {
        return errorResponse(res, result.message, 500);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get panel reviews error:', error);
      return errorResponse(res, 'Failed to retrieve reviews', 500);
    }
  }

  static async approveReview(req, res) {
    try {
      const adminId = req.user.userId;
      const { reviewId } = req.params;

      if (!reviewId) {
        return errorResponse(res, 'Review ID is required', 400);
      }

      const result = await portfolioReviewService.approveReview(reviewId, adminId);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Approve review error:', error);
      return errorResponse(res, 'Failed to approve review', 500);
    }
  }

  static async rejectReview(req, res) {
    try {
      const adminId = req.user.userId;
      const { reviewId } = req.params;
      const { rejectionReason } = req.body;

      if (!reviewId) {
        return errorResponse(res, 'Review ID is required', 400);
      }

      if (!rejectionReason) {
        return errorResponse(res, 'Rejection reason is required', 400);
      }

      const result = await portfolioReviewService.rejectReview(reviewId, rejectionReason, adminId);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Reject review error:', error);
      return errorResponse(res, 'Failed to reject review', 500);
    }
  }

  static async toggleFeatured(req, res) {
    try {
      const adminId = req.user.userId;
      const { reviewId } = req.params;
      const { isFeatured } = req.body;

      if (!reviewId) {
        return errorResponse(res, 'Review ID is required', 400);
      }

      if (isFeatured === undefined) {
        return errorResponse(res, 'Featured status is required', 400);
      }

      const result = await portfolioReviewService.toggleFeatured(reviewId, isFeatured, adminId);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Toggle featured review error:', error);
      return errorResponse(res, 'Failed to toggle featured status', 500);
    }
  }

  static async deleteReview(req, res) {
    try {
      const adminId = req.user.userId;
      const { reviewId } = req.params;

      if (!reviewId) {
        return errorResponse(res, 'Review ID is required', 400);
      }

      const result = await portfolioReviewService.adminDeleteReview(reviewId, adminId);

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
}

export default PanelReviewController;
