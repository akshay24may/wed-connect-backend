import subscriptionService from '#services/subscriptionService.js';
import subscriptionCheckService from '#services/subscriptionCheckService.js';
import { successResponse, errorResponse } from '#utils/responseFormatter.js';

class SubscriptionController {
  static async getUserSubscriptions(req, res) {
    try {
      const userId = req.user.userId;

      const filters = {
        status: req.query.status,
        categoryId: req.query.categoryId,
        cityTier: req.query.cityTier,
        page: req.query.page || 1,
        limit: req.query.limit || 20
      };

      const result = await subscriptionService.getUserSubscriptions(userId, filters);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get user subscriptions error:', error);
      return errorResponse(res, 'Failed to fetch user subscriptions', 500);
    }
  }

  static async getActiveSubscriptions(req, res) {
    try {
      const userId = req.user.userId;
      const { useStatus = 'all', categoryId } = req.query;

      if (!['all', 'used', 'unused'].includes(useStatus)) {
        return errorResponse(res, 'Invalid useStatus filter. Allowed values: all, used, unused.', 400);
      }

      const filters = {
        useStatus,
        categoryId: categoryId ? parseInt(categoryId) : null
      };

      const result = await subscriptionService.getActiveSubscriptions(userId, filters);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get active subscriptions error:', error);
      return errorResponse(res, 'Failed to fetch active subscriptions', 500);
    }
  }

  static async getUserSubscription(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      const result = await subscriptionService.getUserSubscription(userId, id);

      if (!result.success) {
        return errorResponse(res, result.message, 404);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get user subscription error:', error);
      return errorResponse(res, 'Failed to fetch user subscription', 500);
    }
  }

  static async purchaseSubscription(req, res) {
    try {
      const userId = req.user.userId;
      const { planId, paymentGateway } = req.body;

      if (!planId) {
        return errorResponse(res, 'Plan ID is required', 400);
      }

      if (!paymentGateway) {
        return errorResponse(res, 'Payment gateway is required', 400);
      }

      const result = await subscriptionService.purchaseSubscription(userId, planId, paymentGateway);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Purchase subscription error:', error);
      return errorResponse(res, 'Failed to purchase subscription', 500);
    }
  }

  static async cancelSubscription(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return errorResponse(res, 'Cancellation reason is required', 400);
      }

      const result = await subscriptionService.cancelSubscription(userId, id, reason);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      console.error('Cancel subscription error:', error);
      return errorResponse(res, 'Failed to cancel subscription', 500);
    }
  }

  static async checkEligibility(req, res) {
    try {
      const userId = req.user.userId;
      const { categoryId, cityId } = req.query;

      const result = await subscriptionCheckService.checkEligibility(
        userId,
        categoryId ? parseInt(categoryId) : null,
        cityId ? parseInt(cityId) : null
      );

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Check eligibility error:', error);
      return errorResponse(res, 'Failed to check eligibility', 500);
    }
  }

  static async validatePortfolioCreation(req, res) {
    try {
      const userId = req.user.userId;
      const { userSubscriptionId, categoryId, cityId } = req.body;

      if (!userSubscriptionId || !categoryId || !cityId) {
        return errorResponse(res, 'User subscription ID, category ID, and city ID are required', 400);
      }

      const result = await subscriptionCheckService.validatePortfolioCreation(
        userId,
        userSubscriptionId,
        categoryId,
        cityId
      );

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Validate portfolio creation error:', error);
      return errorResponse(res, 'Failed to validate portfolio creation', 500);
    }
  }

  static async getAvailablePlans(req, res) {
    try {
      const userId = req.user.userId;
      const { categoryId, cityTier } = req.query;

      if (!categoryId || !cityTier) {
        return errorResponse(res, 'Category ID and city tier are required', 400);
      }

      const result = await subscriptionCheckService.getAvailablePlans(
        userId,
        parseInt(categoryId),
        cityTier
      );

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get available plans error:', error);
      return errorResponse(res, 'Failed to fetch available plans', 500);
    }
  }
}

export default SubscriptionController;
