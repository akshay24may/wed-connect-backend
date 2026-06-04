import portfolioRepository from '#repositories/portfolioRepository.js';
import models from '#models/index.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';

const { Portfolio, User, BusinessProfile, Category, State, City } = models;

class PortfolioPanelService {
  async getPortfolios(options = {}) {
    try {
      const { status, category, page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;

      const where = {};
      if (status) {
        where.status = status;
      }
      if (category) {
        where.categorySlug = category;
      }

      const result = await Portfolio.findAndCountAll({
        where,
        attributes: [
          'id',
          'userId',
          'title',
          'slug',
          'shareCode',
          'description',
          'priceRangeMin',
          'priceRangeMax',
          'priceOnRequest',
          'cityTier',
          'isFreePlanPortfolio',
          'status',
          'isFeatured',
          'isBoosted',
          'isRecommended',
          'coverImage',
          'coverImageStorageType',
          'viewCount',
          'contactCount',
          'totalFavorites',
          'averageRating',
          'totalReviews',
          'publishedAt',
          'approvedAt',
          'rejectedAt',
          'rejectionReason',
          ['created_at', 'createdAt'],
          ['updated_at', 'updatedAt']
        ],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'fullName', 'email', 'mobile']
          },
          {
            model: BusinessProfile,
            as: 'businessProfile',
            attributes: ['id', 'businessName', 'businessEmail', 'businessPhone']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug']
          },
          {
            model: City,
            as: 'city',
            attributes: ['id', 'name', 'slug', 'cityTier']
          }
        ],
        order: [['created_at', 'DESC']],
        limit,
        offset
      });

      const totalPages = Math.ceil(result.count / limit);

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIOS_RETRIEVED,
        data: {
          portfolios: result.rows,
          pagination: {
            total: result.count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages
          }
        }
      };
    } catch (error) {
      console.error('Get portfolios (panel) error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIOS_FETCH_FAILED
      };
    }
  }

  async getPortfolio(portfolioId) {
    try {
      const portfolio = await portfolioRepository.findById(portfolioId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_RETRIEVED,
        data: { portfolio }
      };
    } catch (error) {
      console.error('Get portfolio (panel) error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_FETCH_FAILED
      };
    }
  }

  async updateStatus(portfolioId, adminUserId, statusData) {
    try {
      const portfolio = await Portfolio.findByPk(portfolioId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      const { status, rejectionReason, notes } = statusData;

      if (!status) {
        return {
          success: false,
          message: 'Status is required'
        };
      }

      const validStatuses = ['pending', 'published', 'rejected'];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        };
      }

      if (status === 'rejected' && !rejectionReason) {
        return {
          success: false,
          message: 'Rejection reason is required when rejecting portfolio'
        };
      }

      const updateData = { status };

      if (status === 'published') {
        updateData.publishedAt = new Date();
        updateData.approvedAt = new Date();
        updateData.approvedBy = adminUserId;
        updateData.rejectedAt = null;
        updateData.rejectedBy = null;
        updateData.rejectionReason = null;
      } else if (status === 'rejected') {
        updateData.rejectedAt = new Date();
        updateData.rejectedBy = adminUserId;
        updateData.rejectionReason = rejectionReason;
        updateData.publishedAt = null;
        updateData.approvedAt = null;
        updateData.approvedBy = null;
      } else if (status === 'pending') {
        updateData.publishedAt = null;
        updateData.approvedAt = null;
        updateData.approvedBy = null;
        updateData.rejectedAt = null;
        updateData.rejectedBy = null;
        updateData.rejectionReason = null;
      }

      if (notes) {
        updateData.internalNotes = notes;
      }

      await portfolio.update(updateData, { userId: adminUserId });

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_STATUS_UPDATED,
        data: { portfolio }
      };
    } catch (error) {
      console.error('Update portfolio status (panel) error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_STATUS_UPDATE_FAILED
      };
    }
  }

  async updateVisibility(portfolioId, adminUserId, visibilityData) {
    try {
      const portfolio = await Portfolio.findByPk(portfolioId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      const updateData = {};

      if (visibilityData.isFeatured !== undefined) {
        updateData.isFeatured = visibilityData.isFeatured;
      }

      if (visibilityData.featuredUntil !== undefined) {
        updateData.featuredUntil = visibilityData.featuredUntil ? new Date(visibilityData.featuredUntil) : null;
      }

      if (visibilityData.isBoosted !== undefined) {
        updateData.isBoosted = visibilityData.isBoosted;
      }

      if (visibilityData.boostedUntil !== undefined) {
        updateData.boostedUntil = visibilityData.boostedUntil ? new Date(visibilityData.boostedUntil) : null;
      }

      if (visibilityData.isRecommended !== undefined) {
        updateData.isRecommended = visibilityData.isRecommended;
        if (visibilityData.isRecommended) {
          updateData.recommendedAt = new Date();
        } else {
          updateData.recommendedAt = null;
        }
      }

      if (Object.keys(updateData).length === 0) {
        return {
          success: false,
          message: 'No visibility fields provided to update'
        };
      }

      await portfolio.update(updateData, { userId: adminUserId });

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_VISIBILITY_UPDATED,
        data: { portfolio }
      };
    } catch (error) {
      console.error('Update portfolio visibility error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_VISIBILITY_UPDATE_FAILED
      };
    }
  }

  async deletePortfolio(portfolioId, adminUserId) {
    try {
      const portfolio = await Portfolio.findByPk(portfolioId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      await portfolio.destroy({ userId: adminUserId });

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_DELETED
      };
    } catch (error) {
      console.error('Delete portfolio (panel) error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_DELETE_FAILED
      };
    }
  }
}

export default new PortfolioPanelService();
