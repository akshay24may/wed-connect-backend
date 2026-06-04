import portfolioAlbumService from '#services/portfolioAlbumService.js';
import portfolioMediaService from '#services/portfolioMediaService.js';
import {
  successResponse,
  errorResponse,
  createResponse,
  notFoundResponse
} from '#utils/responseFormatter.js';

class PortfolioAlbumController {
  static async getAlbums(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId } = req.params;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      const result = await portfolioAlbumService.getAlbums(portfolioId, userId);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 500);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get albums error:', error);
      return errorResponse(res, 'Failed to retrieve albums', 500);
    }
  }

  static async getAlbum(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId, albumId } = req.params;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      if (!albumId) {
        return errorResponse(res, 'Album ID is required', 400);
      }

      const result = await portfolioAlbumService.getAlbum(portfolioId, albumId, userId);

      if (!result.success) {
        return notFoundResponse(res, result.message);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get album error:', error);
      return errorResponse(res, 'Failed to retrieve album', 500);
    }
  }

  static async createAlbum(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId } = req.params;
      const albumData = req.body;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      const result = await portfolioAlbumService.createAlbum(portfolioId, userId, albumData);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return createResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Create album error:', error);
      return errorResponse(res, 'Failed to create album', 500);
    }
  }

  static async updateAlbum(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId, albumId } = req.params;
      const albumData = req.body;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      if (!albumId) {
        return errorResponse(res, 'Album ID is required', 400);
      }

      const result = await portfolioAlbumService.updateAlbum(portfolioId, albumId, userId, albumData);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Update album error:', error);
      return errorResponse(res, 'Failed to update album', 500);
    }
  }

  static async deleteAlbum(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId, albumId } = req.params;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      if (!albumId) {
        return errorResponse(res, 'Album ID is required', 400);
      }

      const result = await portfolioAlbumService.deleteAlbum(portfolioId, albumId, userId);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      console.error('Delete album error:', error);
      return errorResponse(res, 'Failed to delete album', 500);
    }
  }

  static async reorderAlbum(req, res) {
    try {
      const userId = req.user.userId;
      const { portfolioId, albumId } = req.params;
      const { displayOrder } = req.body;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      if (!albumId) {
        return errorResponse(res, 'Album ID is required', 400);
      }

      if (displayOrder === undefined) {
        return errorResponse(res, 'Display order is required', 400);
      }

      const result = await portfolioAlbumService.reorderAlbum(portfolioId, albumId, userId, displayOrder);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Reorder album error:', error);
      return errorResponse(res, 'Failed to reorder album', 500);
    }
  }

  static async uploadMedia(req, res) {
    try {
      const userId = req.user.userId;
      const { albumId } = req.params;
      const { mediaType } = req.body;

      if (!albumId) {
        return errorResponse(res, 'Album ID is required', 400);
      }

      if (!req.files || req.files.length === 0) {
        return errorResponse(res, 'No files uploaded', 400);
      }

      if (!mediaType) {
        return errorResponse(res, 'Media type is required', 400);
      }

      const album = await portfolioAlbumService.getAlbum(null, albumId, userId);
      
      if (!album.success) {
        return notFoundResponse(res, album.message);
      }

      const portfolioId = album.data.album.portfolio.id;

      const result = await portfolioMediaService.uploadMedia(
        portfolioId,
        userId,
        req.files,
        mediaType,
        'album',
        parseInt(albumId)
      );

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Upload album media error:', error);
      return errorResponse(res, 'Failed to upload album media', 500);
    }
  }
}

export default PortfolioAlbumController;
