import portfolioPublicService from '#services/portfolioPublicService.js';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  paginatedResponse
} from '#utils/responseFormatter.js';

class PortfolioController {
  static async getPortfolios(req, res) {
    try {
      const { category, city, priceMin, priceMax, page, limit } = req.query;

      const filters = {};
      if (category) filters.category = category;
      if (city) filters.city = city;
      if (priceMin) filters.priceMin = parseInt(priceMin);
      if (priceMax) filters.priceMax = parseInt(priceMax);
      if (page) filters.page = parseInt(page);
      if (limit) filters.limit = parseInt(limit);

      const result = await portfolioPublicService.getPortfolios(filters);

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
      console.error('Get public portfolios error:', error);
      return errorResponse(res, 'Failed to retrieve portfolios', 500);
    }
  }

  static async getPortfolioBySlug(req, res) {
    try {
      const { slug } = req.params;

      if (!slug) {
        return errorResponse(res, 'Portfolio slug is required', 400);
      }

      const result = await portfolioPublicService.getPortfolioBySlug(slug);

      if (!result.success) {
        return notFoundResponse(res, result.message);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get portfolio by slug error:', error);
      return errorResponse(res, 'Failed to retrieve portfolio', 500);
    }
  }

  static async getPortfolioByShareCode(req, res) {
    try {
      const { shareCode } = req.params;

      if (!shareCode) {
        return errorResponse(res, 'Share code is required', 400);
      }

      const result = await portfolioPublicService.getPortfolioByShareCode(shareCode);

      if (!result.success) {
        return notFoundResponse(res, result.message);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get portfolio by share code error:', error);
      return errorResponse(res, 'Failed to retrieve portfolio', 500);
    }
  }

  static async getMedia(req, res) {
    try {
      const { portfolioId } = req.params;
      const { subEntityType, subEntityId, mediaType, page, limit } = req.query;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      const filters = {};
      if (subEntityType) filters.subEntityType = subEntityType;
      if (subEntityId) filters.subEntityId = parseInt(subEntityId);
      if (mediaType) filters.mediaType = mediaType;
      if (page) filters.page = parseInt(page);
      if (limit) filters.limit = parseInt(limit);

      const result = await portfolioPublicService.getMedia(portfolioId, filters);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 500);
      }

      return paginatedResponse(
        res,
        result.data.media,
        result.data.pagination,
        result.message
      );
    } catch (error) {
      console.error('Get public media error:', error);
      return errorResponse(res, 'Failed to retrieve media', 500);
    }
  }

  static async getAlbums(req, res) {
    try {
      const { portfolioId } = req.params;
      const { page, limit } = req.query;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      const filters = {};
      if (page) filters.page = parseInt(page);
      if (limit) filters.limit = parseInt(limit);

      const result = await portfolioPublicService.getAlbums(portfolioId, filters);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 500);
      }

      return paginatedResponse(
        res,
        result.data.albums,
        result.data.pagination,
        result.message
      );
    } catch (error) {
      console.error('Get public albums error:', error);
      return errorResponse(res, 'Failed to retrieve albums', 500);
    }
  }

  static async getAlbumBySlug(req, res) {
    try {
      const { portfolioId, albumSlug } = req.params;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      if (!albumSlug) {
        return errorResponse(res, 'Album slug is required', 400);
      }

      const result = await portfolioPublicService.getAlbumBySlug(portfolioId, albumSlug);

      if (!result.success) {
        return notFoundResponse(res, result.message);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get album by slug error:', error);
      return errorResponse(res, 'Failed to retrieve album', 500);
    }
  }
}

export default PortfolioController;
