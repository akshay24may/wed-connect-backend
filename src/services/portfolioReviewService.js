import portfolioReviewRepository from '#repositories/portfolioReviewRepository.js';
import portfolioRepository from '#repositories/portfolioRepository.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';

class PortfolioReviewService {
  async getConsumerReviews(userId, page = 1, limit = 20) {
    try {
      const result = await portfolioReviewRepository.findByConsumerId(userId, { page, limit });

      return {
        success: true,
        message: SUCCESS_MESSAGES.REVIEWS_RETRIEVED,
        data: result
      };
    } catch (error) {
      console.error('Get consumer reviews error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.REVIEWS_FETCH_FAILED
      };
    }
  }

  async getVendorReviews(vendorId, options = {}) {
    try {
      const { page = 1, limit = 20, portfolioId, status } = options;

      const result = await portfolioReviewRepository.findByVendorId(vendorId, {
        page,
        limit,
        portfolioId,
        status
      });

      return {
        success: true,
        message: SUCCESS_MESSAGES.REVIEWS_RETRIEVED,
        data: result
      };
    } catch (error) {
      console.error('Get vendor reviews error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.REVIEWS_FETCH_FAILED
      };
    }
  }

  async getPanelReviews(options = {}) {
    try {
      const { page = 1, limit = 20, status, portfolioId } = options;

      const result = await portfolioReviewRepository.findAllForPanel({
        page,
        limit,
        status,
        portfolioId
      });

      return {
        success: true,
        message: SUCCESS_MESSAGES.REVIEWS_RETRIEVED,
        data: result
      };
    } catch (error) {
      console.error('Get panel reviews error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.REVIEWS_FETCH_FAILED
      };
    }
  }

  async getPublicReviews(portfolioId, options = {}) {
    try {
      const { page = 1, limit = 20, sort = 'recent' } = options;

      const result = await portfolioReviewRepository.findByPortfolioId(portfolioId, {
        page,
        limit,
        sort
      });

      return {
        success: true,
        message: SUCCESS_MESSAGES.REVIEWS_RETRIEVED,
        data: result
      };
    } catch (error) {
      console.error('Get public reviews error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.REVIEWS_FETCH_FAILED
      };
    }
  }

  async createReview(portfolioId, userId, reviewData) {
    try {
      const portfolio = await portfolioRepository.findById(portfolioId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      if (portfolio.status !== 'published') {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_PUBLISHED
        };
      }

      const existingReview = await portfolioReviewRepository.checkExistingReview(portfolioId, userId);

      if (existingReview) {
        return {
          success: false,
          message: ERROR_MESSAGES.REVIEW_ALREADY_EXISTS
        };
      }

      if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        return {
          success: false,
          message: ERROR_MESSAGES.INVALID_RATING
        };
      }

      const data = {
        portfolioId: parseInt(portfolioId),
        userId,
        vendorId: portfolio.userId,
        rating: reviewData.rating,
        reviewTitle: reviewData.reviewTitle,
        reviewText: reviewData.reviewText,
        recommendedFor: reviewData.recommendedFor || [],
        isVerifiedPurchase: reviewData.isVerifiedPurchase || false,
        isApproved: true
      };

      const review = await portfolioReviewRepository.create(data, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.REVIEW_CREATED,
        data: { review }
      };
    } catch (error) {
      console.error('Create review error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.REVIEW_CREATE_FAILED
      };
    }
  }

  async updateReview(reviewId, userId, reviewData) {
    try {
      const review = await portfolioReviewRepository.findByIdAndUserId(reviewId, userId);

      if (!review) {
        return {
          success: false,
          message: ERROR_MESSAGES.REVIEW_NOT_FOUND
        };
      }

      if (reviewData.rating && (reviewData.rating < 1 || reviewData.rating > 5)) {
        return {
          success: false,
          message: ERROR_MESSAGES.INVALID_RATING
        };
      }

      const updateData = {};
      if (reviewData.rating !== undefined) updateData.rating = reviewData.rating;
      if (reviewData.reviewTitle !== undefined) updateData.reviewTitle = reviewData.reviewTitle;
      if (reviewData.reviewText !== undefined) updateData.reviewText = reviewData.reviewText;
      if (reviewData.recommendedFor !== undefined) updateData.recommendedFor = reviewData.recommendedFor;

      const updatedReview = await portfolioReviewRepository.update(reviewId, updateData, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.REVIEW_UPDATED,
        data: { review: updatedReview }
      };
    } catch (error) {
      console.error('Update review error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.REVIEW_UPDATE_FAILED
      };
    }
  }

  async deleteReview(reviewId, userId) {
    try {
      const review = await portfolioReviewRepository.findByIdAndUserId(reviewId, userId);

      if (!review) {
        return {
          success: false,
          message: ERROR_MESSAGES.REVIEW_NOT_FOUND
        };
      }

      await portfolioReviewRepository.delete(reviewId, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.REVIEW_DELETED
      };
    } catch (error) {
      console.error('Delete review error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.REVIEW_DELETE_FAILED
      };
    }
  }

  async addVendorResponse(reviewId, vendorId, vendorResponse) {
    try {
      const review = await portfolioReviewRepository.findByIdAndVendorId(reviewId, vendorId);

      if (!review) {
        return {
          success: false,
          message: ERROR_MESSAGES.REVIEW_NOT_FOUND
        };
      }

      if (!vendorResponse || vendorResponse.trim().length === 0) {
        return {
          success: false,
          message: ERROR_MESSAGES.VENDOR_RESPONSE_REQUIRED
        };
      }

      if (review.vendorResponse) {
        return {
          success: false,
          message: ERROR_MESSAGES.VENDOR_RESPONSE_EXISTS
        };
      }

      const updatedReview = await portfolioReviewRepository.updateVendorResponse(
        reviewId,
        vendorResponse,
        vendorId
      );

      return {
        success: true,
        message: SUCCESS_MESSAGES.VENDOR_RESPONSE_ADDED,
        data: { review: updatedReview }
      };
    } catch (error) {
      console.error('Add vendor response error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.VENDOR_RESPONSE_FAILED
      };
    }
  }

  async updateVendorResponse(reviewId, vendorId, vendorResponse) {
    try {
      const review = await portfolioReviewRepository.findByIdAndVendorId(reviewId, vendorId);

      if (!review) {
        return {
          success: false,
          message: ERROR_MESSAGES.REVIEW_NOT_FOUND
        };
      }

      if (!vendorResponse || vendorResponse.trim().length === 0) {
        return {
          success: false,
          message: ERROR_MESSAGES.VENDOR_RESPONSE_REQUIRED
        };
      }

      if (!review.vendorResponse) {
        return {
          success: false,
          message: ERROR_MESSAGES.VENDOR_RESPONSE_NOT_FOUND
        };
      }

      const updatedReview = await portfolioReviewRepository.updateVendorResponse(
        reviewId,
        vendorResponse,
        vendorId
      );

      return {
        success: true,
        message: SUCCESS_MESSAGES.VENDOR_RESPONSE_UPDATED,
        data: { review: updatedReview }
      };
    } catch (error) {
      console.error('Update vendor response error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.VENDOR_RESPONSE_UPDATE_FAILED
      };
    }
  }

  async approveReview(reviewId, adminId) {
    try {
      const review = await portfolioReviewRepository.findById(reviewId);

      if (!review) {
        return {
          success: false,
          message: ERROR_MESSAGES.REVIEW_NOT_FOUND
        };
      }

      if (review.isApproved) {
        return {
          success: false,
          message: ERROR_MESSAGES.REVIEW_ALREADY_APPROVED
        };
      }

      const updatedReview = await portfolioReviewRepository.approve(reviewId, adminId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.REVIEW_APPROVED,
        data: { review: updatedReview }
      };
    } catch (error) {
      console.error('Approve review error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.REVIEW_APPROVE_FAILED
      };
    }
  }

  async rejectReview(reviewId, rejectionReason, adminId) {
    try {
      const review = await portfolioReviewRepository.findById(reviewId);

      if (!review) {
        return {
          success: false,
          message: ERROR_MESSAGES.REVIEW_NOT_FOUND
        };
      }

      if (!review.isApproved) {
        return {
          success: false,
          message: ERROR_MESSAGES.REVIEW_ALREADY_REJECTED
        };
      }

      if (!rejectionReason || rejectionReason.trim().length === 0) {
        return {
          success: false,
          message: ERROR_MESSAGES.REJECTION_REASON_REQUIRED
        };
      }

      const updatedReview = await portfolioReviewRepository.reject(reviewId, rejectionReason, adminId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.REVIEW_REJECTED,
        data: { review: updatedReview }
      };
    } catch (error) {
      console.error('Reject review error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.REVIEW_REJECT_FAILED
      };
    }
  }

  async toggleFeatured(reviewId, isFeatured, adminId) {
    try {
      const review = await portfolioReviewRepository.findById(reviewId);

      if (!review) {
        return {
          success: false,
          message: ERROR_MESSAGES.REVIEW_NOT_FOUND
        };
      }

      const updatedReview = await portfolioReviewRepository.toggleFeatured(reviewId, isFeatured, adminId);

      return {
        success: true,
        message: isFeatured ? SUCCESS_MESSAGES.REVIEW_FEATURED : SUCCESS_MESSAGES.REVIEW_UNFEATURED,
        data: { review: updatedReview }
      };
    } catch (error) {
      console.error('Toggle featured review error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.REVIEW_FEATURED_FAILED
      };
    }
  }

  async adminDeleteReview(reviewId, adminId) {
    try {
      const review = await portfolioReviewRepository.findById(reviewId);

      if (!review) {
        return {
          success: false,
          message: ERROR_MESSAGES.REVIEW_NOT_FOUND
        };
      }

      await portfolioReviewRepository.delete(reviewId, adminId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.REVIEW_DELETED
      };
    } catch (error) {
      console.error('Admin delete review error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.REVIEW_DELETE_FAILED
      };
    }
  }

  async markHelpful(reviewId, isHelpful = true) {
    try {
      const review = await portfolioReviewRepository.findById(reviewId);

      if (!review) {
        return {
          success: false,
          message: ERROR_MESSAGES.REVIEW_NOT_FOUND
        };
      }

      const updatedReview = isHelpful
        ? await portfolioReviewRepository.incrementHelpful(reviewId)
        : await portfolioReviewRepository.incrementNotHelpful(reviewId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.REVIEW_HELPFUL_MARKED,
        data: { review: updatedReview }
      };
    } catch (error) {
      console.error('Mark helpful error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.REVIEW_HELPFUL_FAILED
      };
    }
  }
}

export default new PortfolioReviewService();
