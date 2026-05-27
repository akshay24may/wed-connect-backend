import categoryService from '#services/categoryService.js';
import {
  successResponse,
  errorResponse
} from '#utils/responseFormatter.js';

class VendorCategoryController {
  static async getCategories(req, res) {
    try {
      const result = await categoryService.getActiveCategories();

      if (!result.success) {
        return errorResponse(res, result.message, 500);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get vendor categories error:', error);
      return errorResponse(res, 'Failed to retrieve categories', 500);
    }
  }
}

export default VendorCategoryController;
