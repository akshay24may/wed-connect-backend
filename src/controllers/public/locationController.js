import locationService from '#services/locationService.js';
import { successResponse, errorResponse } from '#utils/responseFormatter.js';

class LocationController {
  static async getStates(req, res) {
    try {
      const result = await locationService.getStates(req.query);
      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get states error:', error);
      return errorResponse(res, 'Failed to fetch states', 500);
    }
  }

  static async getCities(req, res) {
    try {
      const result = await locationService.getCities(req.query);
      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get cities error:', error);
      return errorResponse(res, 'Failed to fetch cities', 500);
    }
  }

  static async getCitiesByTier(req, res) {
    try {
      const { cityTier } = req.params;
      const result = await locationService.getCities({ cityTier });
      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get cities by tier error:', error);
      return errorResponse(res, 'Failed to fetch cities by tier', 500);
    }
  }
}

export default LocationController;
