import categoryRepository from '#repositories/categoryRepository.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';
import { generateUniqueSlug } from '#utils/customSlugify.js';

class CategoryService {
  async getCategories(options = {}) {
    try {
      const { page = 1, limit = 50, isActive, groupSlug } = options;

      const result = await categoryRepository.findAll({ page, limit, isActive, groupSlug });

      return {
        success: true,
        message: SUCCESS_MESSAGES.CATEGORIES_RETRIEVED,
        data: result
      };
    } catch (error) {
      console.error('Get categories error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.CATEGORIES_FETCH_FAILED
      };
    }
  }

  async getActiveCategories() {
    try {
      const categories = await categoryRepository.findActive();

      return {
        success: true,
        message: SUCCESS_MESSAGES.CATEGORIES_RETRIEVED,
        data: { categories }
      };
    } catch (error) {
      console.error('Get active categories error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.CATEGORIES_FETCH_FAILED
      };
    }
  }

  async getCategory(categoryId) {
    try {
      const category = await categoryRepository.findById(categoryId);

      if (!category) {
        return {
          success: false,
          message: ERROR_MESSAGES.CATEGORY_NOT_FOUND
        };
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.CATEGORY_RETRIEVED,
        data: { category }
      };
    } catch (error) {
      console.error('Get category error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.CATEGORY_FETCH_FAILED
      };
    }
  }

  async createCategory(userId, categoryData) {
    try {
      if (!categoryData.name) {
        return {
          success: false,
          message: ERROR_MESSAGES.CATEGORY_NAME_REQUIRED
        };
      }

      if (categoryData.name.length < 2) {
        return {
          success: false,
          message: ERROR_MESSAGES.CATEGORY_NAME_TOO_SHORT
        };
      }

      const nameExists = await categoryRepository.checkNameExists(categoryData.name);
      if (nameExists) {
        return {
          success: false,
          message: ERROR_MESSAGES.CATEGORY_NAME_EXISTS
        };
      }

      const slug = categoryData.slug || generateUniqueSlug(categoryData.name);

      const slugExists = await categoryRepository.checkSlugExists(slug);
      if (slugExists) {
        return {
          success: false,
          message: ERROR_MESSAGES.CATEGORY_SLUG_EXISTS
        };
      }

      const data = {
        name: categoryData.name,
        slug,
        groupSlug: categoryData.groupSlug,
        description: categoryData.description,
        colorCode: categoryData.colorCode,
        subtypes: categoryData.subtypes || [],
        displayOrder: categoryData.displayOrder || 0,
        isFeatured: categoryData.isFeatured !== undefined ? categoryData.isFeatured : true,
        isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
        metaTitle: categoryData.metaTitle,
        metaDescription: categoryData.metaDescription,
        metaKeywords: categoryData.metaKeywords
      };

      const category = await categoryRepository.create(data, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.CATEGORY_CREATED,
        data: { category }
      };
    } catch (error) {
      console.error('Create category error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.CATEGORY_CREATE_FAILED
      };
    }
  }

  async updateCategory(categoryId, userId, categoryData) {
    try {
      const category = await categoryRepository.findById(categoryId);

      if (!category) {
        return {
          success: false,
          message: ERROR_MESSAGES.CATEGORY_NOT_FOUND
        };
      }

      if (categoryData.name) {
        if (categoryData.name.length < 2) {
          return {
            success: false,
            message: ERROR_MESSAGES.CATEGORY_NAME_TOO_SHORT
          };
        }

        const nameExists = await categoryRepository.checkNameExists(categoryData.name, categoryId);
        if (nameExists) {
          return {
            success: false,
            message: ERROR_MESSAGES.CATEGORY_NAME_EXISTS
          };
        }
      }

      if (categoryData.slug) {
        const slugExists = await categoryRepository.checkSlugExists(categoryData.slug, categoryId);
        if (slugExists) {
          return {
            success: false,
            message: ERROR_MESSAGES.CATEGORY_SLUG_EXISTS
          };
        }
      }

      const updateData = {};
      if (categoryData.name !== undefined) updateData.name = categoryData.name;
      if (categoryData.slug !== undefined) updateData.slug = categoryData.slug;
      if (categoryData.groupSlug !== undefined) updateData.groupSlug = categoryData.groupSlug;
      if (categoryData.description !== undefined) updateData.description = categoryData.description;
      if (categoryData.colorCode !== undefined) updateData.colorCode = categoryData.colorCode;
      if (categoryData.subtypes !== undefined) updateData.subtypes = categoryData.subtypes;
      if (categoryData.displayOrder !== undefined) updateData.displayOrder = categoryData.displayOrder;
      if (categoryData.isFeatured !== undefined) updateData.isFeatured = categoryData.isFeatured;
      if (categoryData.isActive !== undefined) updateData.isActive = categoryData.isActive;
      if (categoryData.metaTitle !== undefined) updateData.metaTitle = categoryData.metaTitle;
      if (categoryData.metaDescription !== undefined) updateData.metaDescription = categoryData.metaDescription;
      if (categoryData.metaKeywords !== undefined) updateData.metaKeywords = categoryData.metaKeywords;

      const updatedCategory = await categoryRepository.update(categoryId, updateData, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.CATEGORY_UPDATED,
        data: { category: updatedCategory }
      };
    } catch (error) {
      console.error('Update category error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.CATEGORY_UPDATE_FAILED
      };
    }
  }

  async deleteCategory(categoryId, userId) {
    try {
      const category = await categoryRepository.findById(categoryId);

      if (!category) {
        return {
          success: false,
          message: ERROR_MESSAGES.CATEGORY_NOT_FOUND
        };
      }

      await categoryRepository.delete(categoryId, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.CATEGORY_DELETED
      };
    } catch (error) {
      console.error('Delete category error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.CATEGORY_DELETE_FAILED
      };
    }
  }

  async toggleStatus(categoryId, isActive, userId) {
    try {
      const category = await categoryRepository.findById(categoryId);

      if (!category) {
        return {
          success: false,
          message: ERROR_MESSAGES.CATEGORY_NOT_FOUND
        };
      }

      const updatedCategory = await categoryRepository.toggleStatus(categoryId, isActive, userId);

      return {
        success: true,
        message: isActive ? SUCCESS_MESSAGES.CATEGORY_ACTIVATED : SUCCESS_MESSAGES.CATEGORY_DEACTIVATED,
        data: { category: updatedCategory }
      };
    } catch (error) {
      console.error('Toggle category status error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.CATEGORY_STATUS_UPDATE_FAILED
      };
    }
  }

  async toggleFeatured(categoryId, isFeatured, userId) {
    try {
      const category = await categoryRepository.findById(categoryId);

      if (!category) {
        return {
          success: false,
          message: ERROR_MESSAGES.CATEGORY_NOT_FOUND
        };
      }

      const updatedCategory = await categoryRepository.toggleFeatured(categoryId, isFeatured, userId);

      return {
        success: true,
        message: isFeatured ? SUCCESS_MESSAGES.CATEGORY_FEATURED : SUCCESS_MESSAGES.CATEGORY_UNFEATURED,
        data: { category: updatedCategory }
      };
    } catch (error) {
      console.error('Toggle category featured error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.CATEGORY_FEATURED_UPDATE_FAILED
      };
    }
  }

  async reorderCategory(categoryId, displayOrder, userId) {
    try {
      const category = await categoryRepository.findById(categoryId);

      if (!category) {
        return {
          success: false,
          message: ERROR_MESSAGES.CATEGORY_NOT_FOUND
        };
      }

      const updatedCategory = await categoryRepository.updateDisplayOrder(categoryId, displayOrder, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.CATEGORY_REORDERED,
        data: { category: updatedCategory }
      };
    } catch (error) {
      console.error('Reorder category error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.CATEGORY_REORDER_FAILED
      };
    }
  }
}

export default new CategoryService();
