import portfolioService from '#services/portfolioService.js';
import portfolioManagementService from '#services/portfolioManagementService.js';
import portfolioMediaService from '#services/portfolioMediaService.js';
import {
  successResponse,
  errorResponse,
  createResponse,
  notFoundResponse,
  paginatedResponse
} from '#utils/responseFormatter.js';

class PortfolioController {
  static async getPortfolios(req, res) {
    try {
      const userId = req.user.userId;
      const { status, page, limit } = req.query;

      const options = {};
      if (status) options.status = status;
      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);

      const result = await portfolioService.getPortfolios(userId, options);

      if (!result.success) {
        return errorResponse(res, result.message, 500);
      }

      return paginatedResponse(
        res,
        result.data.portfolios,
        result.data.pagination,
        result.message
      );
    } catch (error) {
      console.error('Get portfolios error:', error);
      return errorResponse(res, 'Failed to retrieve portfolios', 500);
    }
  }

  static async getPortfolio(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId } = req.params;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      const result = await portfolioService.getPortfolio(portfolioId, userId);

      if (!result.success) {
        return notFoundResponse(res, result.message);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get portfolio error:', error);
      return errorResponse(res, 'Failed to retrieve portfolio', 500);
    }
  }

  static async createPortfolio(req, res) {
    try {
      const userId = req.user.userId;
      const portfolioData = req.body;

      const result = await portfolioService.createPortfolio(userId, portfolioData);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return createResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Create portfolio error:', error);
      return errorResponse(res, 'Failed to create portfolio', 500);
    }
  }

  static async updatePortfolio(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId } = req.params;
      const portfolioData = req.body;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      const result = await portfolioService.updatePortfolio(portfolioId, userId, portfolioData);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Update portfolio error:', error);
      return errorResponse(res, 'Failed to update portfolio', 500);
    }
  }

  static async deletePortfolio(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId } = req.params;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      const result = await portfolioService.deletePortfolio(portfolioId, userId);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      console.error('Delete portfolio error:', error);
      return errorResponse(res, 'Failed to delete portfolio', 500);
    }
  }

  static async updateStatus(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId } = req.params;
      const { status } = req.body;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      if (!status) {
        return errorResponse(res, 'Status is required', 400);
      }

      const result = await portfolioManagementService.updateStatus(portfolioId, userId, status);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Update portfolio status error:', error);
      return errorResponse(res, 'Failed to update portfolio status', 500);
    }
  }

  static async updateFeaturedStatus(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId } = req.params;
      const { isFeatured } = req.body;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      if (isFeatured === undefined) {
        return errorResponse(res, 'isFeatured is required', 400);
      }

      const result = await portfolioManagementService.updateFeaturedStatus(
        portfolioId,
        userId,
        isFeatured
      );

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Update featured status error:', error);
      return errorResponse(res, 'Failed to update featured status', 500);
    }
  }

  static async republishPortfolio(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId } = req.params;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      const result = await portfolioManagementService.republishPortfolio(portfolioId, userId);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Republish portfolio error:', error);
      return errorResponse(res, 'Failed to republish portfolio', 500);
    }
  }

  static async uploadMedia(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId } = req.params;
      const { mediaType, subEntityType, subEntityId } = req.body;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      if (!req.files || req.files.length === 0) {
        return errorResponse(res, 'No files uploaded', 400);
      }

      if (!mediaType) {
        return errorResponse(res, 'Media type is required', 400);
      }

      const result = await portfolioMediaService.uploadMedia(
        portfolioId,
        userId,
        req.files,
        mediaType,
        subEntityType || null,
        subEntityId || null
      );

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Upload portfolio media error:', error);
      return errorResponse(res, 'Failed to upload portfolio media', 500);
    }
  }

  static async getMedia(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId } = req.params;
      const { subEntityType, subEntityId, mediaType } = req.query;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      const filters = {};
      if (subEntityType) filters.subEntityType = subEntityType;
      if (subEntityId) filters.subEntityId = parseInt(subEntityId);
      if (mediaType) filters.mediaType = mediaType;

      const result = await portfolioMediaService.getMedia(portfolioId, userId, filters);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 500);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get portfolio media error:', error);
      return errorResponse(res, 'Failed to retrieve portfolio media', 500);
    }
  }

  static async updateMedia(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId, mediaId } = req.params;
      const metadata = req.body;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      if (!mediaId) {
        return errorResponse(res, 'Media ID is required', 400);
      }

      const result = await portfolioMediaService.updateMedia(portfolioId, mediaId, userId, metadata);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Update portfolio media error:', error);
      return errorResponse(res, 'Failed to update portfolio media', 500);
    }
  }

  static async deleteMedia(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId, mediaId } = req.params;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      if (!mediaId) {
        return errorResponse(res, 'Media ID is required', 400);
      }

      const result = await portfolioMediaService.deleteMedia(portfolioId, mediaId, userId);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      console.error('Delete portfolio media error:', error);
      return errorResponse(res, 'Failed to delete portfolio media', 500);
    }
  }

  static async setPrimaryMedia(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId, mediaId } = req.params;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      if (!mediaId) {
        return errorResponse(res, 'Media ID is required', 400);
      }

      const result = await portfolioMediaService.setPrimaryMedia(portfolioId, mediaId, userId);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Set primary media error:', error);
      return errorResponse(res, 'Failed to set primary media', 500);
    }
  }

  static async reorderMedia(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId } = req.params;
      const { mediaIds } = req.body;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      if (!mediaIds) {
        return errorResponse(res, 'Media IDs array is required', 400);
      }

      const result = await portfolioMediaService.reorderMedia(portfolioId, userId, mediaIds);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      console.error('Reorder media error:', error);
      return errorResponse(res, 'Failed to reorder media', 500);
    }
  }
}

export default PortfolioController;
