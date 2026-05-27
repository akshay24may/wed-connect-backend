import portfolioRepository from '#repositories/portfolioRepository.js';
import models from '#models/index.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';

const { UserSubscription } = models;

class PortfolioManagementService {
  async updateStatus(portfolioId, userId, newStatus) {
    try {
      const portfolio = await portfolioRepository.findByIdAndUserId(portfolioId, userId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      if (portfolio.status === 'published') {
        return {
          success: false,
          message: 'Cannot change status of published portfolio'
        };
      }

      if (newStatus !== 'pending') {
        return {
          success: false,
          message: 'Vendors can only submit portfolios for approval (status: pending)'
        };
      }

      if (portfolio.status === 'pending') {
        return {
          success: false,
          message: 'Portfolio is already pending approval'
        };
      }

      const updatedPortfolio = await portfolioRepository.updateStatus(portfolioId, newStatus, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_STATUS_UPDATED,
        data: { portfolio: updatedPortfolio }
      };
    } catch (error) {
      console.error('Update portfolio status error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_STATUS_UPDATE_FAILED
      };
    }
  }

  async updateFeaturedStatus(portfolioId, userId, isFeatured) {
    try {
      const portfolio = await portfolioRepository.findByIdAndUserId(portfolioId, userId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      if (portfolio.status !== 'published') {
        return {
          success: false,
          message: 'Only published portfolios can be featured'
        };
      }

      if (isFeatured) {
        const quotaCheck = await this._checkFeaturedQuota(userId, portfolio.userSubscriptionId);
        if (!quotaCheck.allowed) {
          return {
            success: false,
            message: quotaCheck.message
          };
        }
      }

      const updatedPortfolio = await portfolioRepository.updateFeaturedStatus(portfolioId, isFeatured, userId);

      return {
        success: true,
        message: isFeatured ? SUCCESS_MESSAGES.PORTFOLIO_FEATURED : SUCCESS_MESSAGES.PORTFOLIO_UNFEATURED,
        data: { portfolio: updatedPortfolio }
      };
    } catch (error) {
      console.error('Update featured status error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_FEATURED_UPDATE_FAILED
      };
    }
  }

  async republishPortfolio(portfolioId, userId) {
    try {
      const portfolio = await portfolioRepository.findByIdAndUserId(portfolioId, userId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      if (portfolio.status !== 'published') {
        return {
          success: false,
          message: 'Only published portfolios can be republished'
        };
      }

      const updatedPortfolio = await portfolioRepository.republish(portfolioId, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_REPUBLISHED,
        data: { portfolio: updatedPortfolio }
      };
    } catch (error) {
      console.error('Republish portfolio error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_REPUBLISH_FAILED
      };
    }
  }

  async _checkFeaturedQuota(userId, userSubscriptionId) {
    try {
      if (!userSubscriptionId) {
        return {
          allowed: false,
          message: 'No active subscription found. Please purchase a subscription plan to feature portfolios.'
        };
      }

      const subscription = await UserSubscription.findByPk(userSubscriptionId);

      if (!subscription || subscription.status !== 'active') {
        return {
          allowed: false,
          message: 'No active subscription found. Please purchase a subscription plan to feature portfolios.'
        };
      }

      const maxFeatured = subscription.maxFeaturedPortfolios || 0;

      if (maxFeatured === 0) {
        return {
          allowed: false,
          message: 'Your current plan does not allow featured portfolios. Please upgrade your plan.'
        };
      }

      const currentFeaturedCount = await portfolioRepository.countFeaturedByUserId(userId);

      if (currentFeaturedCount >= maxFeatured) {
        return {
          allowed: false,
          message: `Featured portfolio limit reached (${currentFeaturedCount}/${maxFeatured}). Please upgrade your plan or unfeature an existing portfolio.`
        };
      }

      return {
        allowed: true,
        remaining: maxFeatured - currentFeaturedCount
      };
    } catch (error) {
      console.error('Check featured quota error:', error);
      return {
        allowed: false,
        message: 'Failed to check featured portfolio quota'
      };
    }
  }
}

export default new PortfolioManagementService();
