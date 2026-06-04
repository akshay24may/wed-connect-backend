import subscriptionService from '#services/subscriptionService.js';
import { successResponse, errorResponse } from '#utils/responseFormatter.js';

class SubscriptionController {
  static async getPlans(req, res) {
    try {
      const filters = {
        categoryId: req.query.categoryId,
        categorySlug: req.query.categorySlug,
        cityTier: req.query.cityTier,
        isActive: req.query.isActive,
        isPublic: req.query.isPublic,
        isDefault: req.query.isDefault,
        page: req.query.page || 1,
        limit: req.query.limit || 20
      };

      const result = await subscriptionService.getPlans(filters);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get plans (panel) error:', error);
      return errorResponse(res, 'Failed to fetch subscription plans', 500);
    }
  }

  static async getPlanById(req, res) {
    try {
      const { id } = req.params;

      const result = await subscriptionService.getPlanById(id);

      if (!result.success) {
        return errorResponse(res, result.message, 404);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get plan by ID (panel) error:', error);
      return errorResponse(res, 'Failed to fetch subscription plan', 500);
    }
  }

  static async createPlan(req, res) {
    try {
      const adminUserId = req.user.userId;
      const planData = req.body;

      const result = await subscriptionService.createPlan(planData, adminUserId);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Create plan error:', error);
      return errorResponse(res, 'Failed to create subscription plan', 500);
    }
  }

  static async updatePlan(req, res) {
    try {
      const adminUserId = req.user.userId;
      const { id } = req.params;
      const planData = req.body;

      const result = await subscriptionService.updatePlan(id, planData, adminUserId);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Update plan error:', error);
      return errorResponse(res, 'Failed to update subscription plan', 500);
    }
  }

  static async deletePlan(req, res) {
    try {
      const adminUserId = req.user.userId;
      const { id } = req.params;

      const result = await subscriptionService.deletePlan(id, adminUserId);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      console.error('Delete plan error:', error);
      return errorResponse(res, 'Failed to delete subscription plan', 500);
    }
  }

  static async updatePlanStatus(req, res) {
    try {
      const adminUserId = req.user.userId;
      const { id } = req.params;
      const { isActive } = req.body;

      if (isActive === undefined) {
        return errorResponse(res, 'isActive field is required', 400);
      }

      const result = await subscriptionService.updatePlanStatus(id, isActive, adminUserId);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      console.error('Update plan status error:', error);
      return errorResponse(res, 'Failed to update plan status', 500);
    }
  }

  static async getAllUserSubscriptions(req, res) {
    try {
      const filters = {
        status: req.query.status,
        categoryId: req.query.categoryId,
        userId: req.query.userId,
        page: req.query.page || 1,
        limit: req.query.limit || 20
      };

      const result = await subscriptionService.getAllUserSubscriptions(filters);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get all user subscriptions error:', error);
      return errorResponse(res, 'Failed to fetch user subscriptions', 500);
    }
  }

  static async getUserSubscriptionById(req, res) {
    try {
      const { id } = req.params;

      const result = await subscriptionService.getUserSubscription(null, id);

      if (!result.success) {
        return errorResponse(res, result.message, 404);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get user subscription by ID error:', error);
      return errorResponse(res, 'Failed to fetch user subscription', 500);
    }
  }

  static async updateSubscriptionStatus(req, res) {
    try {
      const adminUserId = req.user.userId;
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return errorResponse(res, 'Status is required', 400);
      }

      const validStatuses = ['pending', 'active', 'expired', 'cancelled', 'suspended'];
      if (!validStatuses.includes(status)) {
        return errorResponse(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }

      const result = await subscriptionService.updateSubscriptionStatus(id, status, adminUserId);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      console.error('Update subscription status error:', error);
      return errorResponse(res, 'Failed to update subscription status', 500);
    }
  }
}

export default SubscriptionController;
