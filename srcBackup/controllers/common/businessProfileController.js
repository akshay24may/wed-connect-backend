import businessProfileService from '#services/businessProfileService.js';
import {
  successResponse,
  errorResponse,
  createResponse,
  notFoundResponse
} from '#utils/responseFormatter.js';

class BusinessProfileController {
  static async getBusinessProfiles(req, res) {
    try {
      const userId = req.user.userId;

      const result = await businessProfileService.getBusinessProfiles(userId);

      if (!result.success) {
        return errorResponse(res, result.message, 500);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get business profiles error:', error);
      return errorResponse(res, 'Failed to retrieve business profiles', 500);
    }
  }

  static async getBusinessProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { businessId } = req.params;

      if (!businessId) {
        return errorResponse(res, 'Business ID is required', 400);
      }

      const result = await businessProfileService.getBusinessProfile(businessId, userId);

      if (!result.success) {
        return notFoundResponse(res, result.message);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get business profile error:', error);
      return errorResponse(res, 'Failed to retrieve business profile', 500);
    }
  }

  static async createBusinessProfile(req, res) {
    try {
      const userId = req.user.userId;
      const businessData = req.body;

      const result = await businessProfileService.createBusinessProfile(userId, businessData);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return createResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Create business profile error:', error);
      return errorResponse(res, 'Failed to create business profile', 500);
    }
  }

  static async updateBusinessProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { businessId } = req.params;
      const businessData = req.body;

      if (!businessId) {
        return errorResponse(res, 'Business ID is required', 400);
      }

      const result = await businessProfileService.updateBusinessProfile(businessId, userId, businessData);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Update business profile error:', error);
      return errorResponse(res, 'Failed to update business profile', 500);
    }
  }

  static async deleteBusinessProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { businessId } = req.params;

      if (!businessId) {
        return errorResponse(res, 'Business ID is required', 400);
      }

      const result = await businessProfileService.deleteBusinessProfile(businessId, userId);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      console.error('Delete business profile error:', error);
      return errorResponse(res, 'Failed to delete business profile', 500);
    }
  }

  static async uploadBusinessMedia(req, res) {
    try {
      const userId = req.user.userId;
      const { businessId } = req.params;

      if (!businessId) {
        return errorResponse(res, 'Business ID is required', 400);
      }

      if (!req.files || req.files.length === 0) {
        return errorResponse(res, 'No files uploaded', 400);
      }

      return successResponse(res, { uploaded: [] }, 'Business media upload endpoint - implementation pending');
    } catch (error) {
      console.error('Upload business media error:', error);
      return errorResponse(res, 'Failed to upload business media', 500);
    }
  }
}

export default BusinessProfileController;
