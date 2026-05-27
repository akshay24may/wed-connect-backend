import subscriptionService from '#services/subscriptionService.js';
import { successResponse, errorResponse } from '#utils/responseFormatter.js';

class SubscriptionController {
  static async getPlans(req, res) {
    try {
      const filters = {
        categoryId: req.query.categoryId,
        categorySlug: req.query.categorySlug,
        cityTier: req.query.cityTier,
        isActive: true,
        isPublic: true,
        page: req.query.page || 1,
        limit: req.query.limit || 20
      };

      const result = await subscriptionService.getPlans(filters);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get plans error:', error);
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
      console.error('Get plan by ID error:', error);
      return errorResponse(res, 'Failed to fetch subscription plan', 500);
    }
  }

  static async getPlanBySlug(req, res) {
    try {
      const { slug } = req.params;

      const result = await subscriptionService.getPlanBySlug(slug);

      if (!result.success) {
        return errorResponse(res, result.message, 404);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get plan by slug error:', error);
      return errorResponse(res, 'Failed to fetch subscription plan', 500);
    }
  }

  static async getPlansByCategory(req, res) {
    try {
      const { categorySlug } = req.params;

      const filters = {
        categorySlug,
        isActive: true,
        isPublic: true,
        page: req.query.page || 1,
        limit: req.query.limit || 20
      };

      const result = await subscriptionService.getPlans(filters);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get plans by category error:', error);
      return errorResponse(res, 'Failed to fetch subscription plans', 500);
    }
  }

  static async getPlansByCategoryAndTier(req, res) {
    try {
      const { categorySlug, tier } = req.params;

      const filters = {
        categorySlug,
        cityTier: tier,
        isActive: true,
        isPublic: true,
        page: req.query.page || 1,
        limit: req.query.limit || 20
      };

      const result = await subscriptionService.getPlans(filters);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get plans by category and tier error:', error);
      return errorResponse(res, 'Failed to fetch subscription plans', 500);
    }
  }
}

export default SubscriptionController;
