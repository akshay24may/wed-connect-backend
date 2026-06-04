import portfolioReviewService from '#services/portfolioReviewService.js';
import {
  successResponse,
  errorResponse,
  notFoundResponse
} from '#utils/responseFormatter.js';

class VendorReviewController {
  static async getReviews(req, res) {
    try {
      const vendorId = req.user.userId;
      const { page = 1, limit = 20, portfolioId, status } = req.query;

      const result = await portfolioReviewService.getVendorReviews(vendorId, {
        page: parseInt(page),
        limit: parseInt(limit),
        portfolioId: portfolioId ? parseInt(portfolioId) : undefined,
        status
      });

      if (!result.success) {
        return errorResponse(res, result.message, 500);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get vendor reviews error:', error);
      return errorResponse(res, 'Failed to retrieve reviews', 500);
    }
  }

  static async addResponse(req, res) {
    try {
      const vendorId = req.user.userId;
      const { reviewId } = req.params;
      const { vendorResponse } = req.body;

      if (!reviewId) {
        return errorResponse(res, 'Review ID is required', 400);
      }

      if (!vendorResponse) {
        return errorResponse(res, 'Vendor response is required', 400);
      }

      const result = await portfolioReviewService.addVendorResponse(
        reviewId,
        vendorId,
        vendorResponse
      );

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Add vendor response error:', error);
      return errorResponse(res, 'Failed to add vendor response', 500);
    }
  }

  static async updateResponse(req, res) {
    try {
      const vendorId = req.user.userId;
      const { reviewId } = req.params;
      const { vendorResponse } = req.body;

      if (!reviewId) {
        return errorResponse(res, 'Review ID is required', 400);
      }

      if (!vendorResponse) {
        return errorResponse(res, 'Vendor response is required', 400);
      }

      const result = await portfolioReviewService.updateVendorResponse(
        reviewId,
        vendorId,
        vendorResponse
      );

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Update vendor response error:', error);
      return errorResponse(res, 'Failed to update vendor response', 500);
    }
  }
}

export default VendorReviewController;
