import categoryService from '#services/categoryService.js';
import {
  successResponse,
  errorResponse,
  createResponse,
  notFoundResponse,
  paginatedResponse
} from '#utils/responseFormatter.js';

class CategoryController {
  static async getCategories(req, res) {
    try {
      const { page = 1, limit = 50, isActive } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit)
      };

      if (isActive !== undefined) {
        options.isActive = isActive === 'true';
      }

      const result = await categoryService.getCategories(options);

      if (!result.success) {
        return errorResponse(res, result.message, 500);
      }

      return paginatedResponse(
        res,
        result.data.categories,
        result.data.pagination,
        result.message
      );
    } catch (error) {
      console.error('Get categories error:', error);
      return errorResponse(res, 'Failed to retrieve categories', 500);
    }
  }

  static async getCategory(req, res) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) {
        return errorResponse(res, 'Category ID is required', 400);
      }

      const result = await categoryService.getCategory(categoryId);

      if (!result.success) {
        return notFoundResponse(res, result.message);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get category error:', error);
      return errorResponse(res, 'Failed to retrieve category', 500);
    }
  }

  static async createCategory(req, res) {
    try {
      const userId = req.user.userId;
      const categoryData = req.body;

      const result = await categoryService.createCategory(userId, categoryData);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return createResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Create category error:', error);
      return errorResponse(res, 'Failed to create category', 500);
    }
  }

  static async updateCategory(req, res) {
    try {
      const userId = req.user.userId;
      const { categoryId } = req.params;
      const categoryData = req.body;

      if (!categoryId) {
        return errorResponse(res, 'Category ID is required', 400);
      }

      const result = await categoryService.updateCategory(categoryId, userId, categoryData);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Update category error:', error);
      return errorResponse(res, 'Failed to update category', 500);
    }
  }

  static async deleteCategory(req, res) {
    try {
      const userId = req.user.userId;
      const { categoryId } = req.params;

      if (!categoryId) {
        return errorResponse(res, 'Category ID is required', 400);
      }

      const result = await categoryService.deleteCategory(categoryId, userId);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      console.error('Delete category error:', error);
      return errorResponse(res, 'Failed to delete category', 500);
    }
  }

  static async toggleStatus(req, res) {
    try {
      const userId = req.user.userId;
      const { categoryId } = req.params;
      const { isActive } = req.body;

      if (!categoryId) {
        return errorResponse(res, 'Category ID is required', 400);
      }

      if (isActive === undefined) {
        return errorResponse(res, 'Active status is required', 400);
      }

      const result = await categoryService.toggleStatus(categoryId, isActive, userId);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Toggle category status error:', error);
      return errorResponse(res, 'Failed to update category status', 500);
    }
  }

  static async toggleFeatured(req, res) {
    try {
      const userId = req.user.userId;
      const { categoryId } = req.params;
      const { isFeatured } = req.body;

      if (!categoryId) {
        return errorResponse(res, 'Category ID is required', 400);
      }

      if (isFeatured === undefined) {
        return errorResponse(res, 'Featured status is required', 400);
      }

      const result = await categoryService.toggleFeatured(categoryId, isFeatured, userId);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Toggle category featured error:', error);
      return errorResponse(res, 'Failed to update featured status', 500);
    }
  }

  static async reorderCategory(req, res) {
    try {
      const userId = req.user.userId;
      const { categoryId } = req.params;
      const { displayOrder } = req.body;

      if (!categoryId) {
        return errorResponse(res, 'Category ID is required', 400);
      }

      if (displayOrder === undefined) {
        return errorResponse(res, 'Display order is required', 400);
      }

      const result = await categoryService.reorderCategory(categoryId, displayOrder, userId);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Reorder category error:', error);
      return errorResponse(res, 'Failed to reorder category', 500);
    }
  }
}

export default CategoryController;
