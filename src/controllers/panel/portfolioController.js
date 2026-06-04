import portfolioPanelService from '#services/portfolioPanelService.js';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  paginatedResponse
} from '#utils/responseFormatter.js';

class PortfolioController {
  static async getPortfolios(req, res) {
    try {
      const { status, category, page, limit } = req.query;

      const options = {};
      if (status) options.status = status;
      if (category) options.category = category;
      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);

      const result = await portfolioPanelService.getPortfolios(options);

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
      console.error('Get portfolios (panel) error:', error);
      return errorResponse(res, 'Failed to retrieve portfolios', 500);
    }
  }

  static async getPortfolio(req, res) {
    try {
      const { portfolioId } = req.params;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      const result = await portfolioPanelService.getPortfolio(portfolioId);

      if (!result.success) {
        return notFoundResponse(res, result.message);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Get portfolio (panel) error:', error);
      return errorResponse(res, 'Failed to retrieve portfolio', 500);
    }
  }

  static async updateStatus(req, res) {
    try {
      const adminUserId = req.user.userId;
      const { portfolioId } = req.params;
      const statusData = req.body;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      const result = await portfolioPanelService.updateStatus(
        portfolioId,
        adminUserId,
        statusData
      );

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Update portfolio status (panel) error:', error);
      return errorResponse(res, 'Failed to update portfolio status', 500);
    }
  }

  static async updateVisibility(req, res) {
    try {
      const adminUserId = req.user.userId;
      const { portfolioId } = req.params;
      const visibilityData = req.body;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      const result = await portfolioPanelService.updateVisibility(
        portfolioId,
        adminUserId,
        visibilityData
      );

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Update portfolio visibility error:', error);
      return errorResponse(res, 'Failed to update portfolio visibility', 500);
    }
  }

  static async deletePortfolio(req, res) {
    try {
      const adminUserId = req.user.userId;
      const { portfolioId } = req.params;

      if (!portfolioId) {
        return errorResponse(res, 'Portfolio ID is required', 400);
      }

      const result = await portfolioPanelService.deletePortfolio(portfolioId, adminUserId);

      if (!result.success) {
        if (result.message.includes('not found')) {
          return notFoundResponse(res, result.message);
        }
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      console.error('Delete portfolio (panel) error:', error);
      return errorResponse(res, 'Failed to delete portfolio', 500);
    }
  }
}

export default PortfolioController;
