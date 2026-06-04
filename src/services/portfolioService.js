import portfolioRepository from '#repositories/portfolioRepository.js';
import subscriptionCheckService from '#services/subscriptionCheckService.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';

class PortfolioService {
  async getPortfolios(userId, options = {}) {
    try {
      const result = await portfolioRepository.findByUserId(userId, options);

      const { page = 1, limit = 20 } = options;
      const totalPages = Math.ceil(result.count / limit);

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIOS_RETRIEVED,
        data: {
          portfolios: result.rows,
          pagination: {
            total: result.count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages
          }
        }
      };
    } catch (error) {
      console.error('Get portfolios error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIOS_FETCH_FAILED
      };
    }
  }

  async getPortfolio(portfolioId, userId) {
    try {
      const portfolio = await portfolioRepository.findByIdAndUserId(portfolioId, userId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_RETRIEVED,
        data: { portfolio }
      };
    } catch (error) {
      console.error('Get portfolio error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_FETCH_FAILED
      };
    }
  }

  async createPortfolio(userId, portfolioData) {
    try {
      if (!portfolioData.title) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_TITLE_REQUIRED
        };
      }

      if (portfolioData.title.length < 10) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_TITLE_TOO_SHORT
        };
      }

      if (!portfolioData.categoryId) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_CATEGORY_REQUIRED
        };
      }

      if (!portfolioData.cityId) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_CITY_REQUIRED
        };
      }

      if (!portfolioData.priceRangeMin && !portfolioData.priceOnRequest) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_PRICE_REQUIRED
        };
      }

      if (!portfolioData.userSubscriptionId) { 
        return {
          success: false,
          message: ERROR_MESSAGES.NO_ACTIVE_SUBSCRIPTION
        };
      }

      const validationResult = await subscriptionCheckService.validatePortfolioCreation(
        userId,
        portfolioData.userSubscriptionId,
        portfolioData.categoryId,
        portfolioData.cityId
      );

      if (!validationResult.success) {
        return validationResult;
      }

      const cityTier = validationResult.data.cityTier;

      let isFreePlan = false;
      if (portfolioData.userSubscriptionId) {
        const subscription = await portfolioRepository.getSubscriptionById(portfolioData.userSubscriptionId);
        if (subscription) {
          isFreePlan = subscription.finalPrice === 0 || subscription.finalPrice === '0.00';
        }
      }

      const data = {
        userId,
        businessProfileId: portfolioData.businessProfileId || null,
        categoryId: portfolioData.categoryId,
        categorySlug: portfolioData.categorySlug,
        userSubscriptionId: portfolioData.userSubscriptionId,
        cityTier,
        isFreePlanPortfolio: isFreePlan,
        title: portfolioData.title,
        description: portfolioData.description,
        priceRangeMin: portfolioData.priceRangeMin,
        priceRangeMax: portfolioData.priceRangeMax,
        priceOnRequest: portfolioData.priceOnRequest || false,
        priceUnit: portfolioData.priceUnit || null,
        priceBreakdown: portfolioData.priceBreakdown,
        advancePercentage: portfolioData.advancePercentage,
        financialTerms: portfolioData.financialTerms,
        highlights: portfolioData.highlights,
        servicesOfferedTags: portfolioData.servicesOfferedTags,
        servicesDescription: portfolioData.servicesDescription,
        coverageCities: portfolioData.coverageCities,
        acceptsDestinationWedding: portfolioData.acceptsDestinationWedding || false,
        destinationWeddingFeeDifferent: portfolioData.destinationWeddingFeeDifferent || false,
        cancellationPolicyUser: portfolioData.cancellationPolicyUser,
        cancellationPolicyVendor: portfolioData.cancellationPolicyVendor,
        workingStyle: portfolioData.workingStyle,
        longDescription: portfolioData.longDescription,
        decorPolicy: portfolioData.decorPolicy,
        acceptsAdvanceBooking: portfolioData.acceptsAdvanceBooking !== undefined ? portfolioData.acceptsAdvanceBooking : true,
        minAdvanceBookingDays: portfolioData.minAdvanceBookingDays || 7,
        weddingsCompleted: portfolioData.weddingsCompleted || 0,
        happyClientsCount: portfolioData.happyClientsCount || 0,
        stateId: portfolioData.stateId,
        cityId: portfolioData.cityId,
        stateSlug: portfolioData.stateSlug,
        citySlug: portfolioData.citySlug,
        address: portfolioData.address,
        serviceDetails: portfolioData.serviceDetails,
        status: 'draft'
      };

      const portfolio = await portfolioRepository.create(data, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_CREATED,
        data: { portfolio }
      };
    } catch (error) {
      console.error('Create portfolio error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_CREATE_FAILED
      };
    }
  }

  async updatePortfolio(portfolioId, userId, portfolioData) {
    try {
      const existingPortfolio = await portfolioRepository.findByIdAndUserId(portfolioId, userId);

      if (!existingPortfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      if (existingPortfolio.status === 'published') {
        return {
          success: false,
          message: 'Cannot edit published portfolio. Please create a new version or contact admin.'
        };
      }

      if (portfolioData.title && portfolioData.title.length < 10) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_TITLE_TOO_SHORT
        };
      }

      if (portfolioData.userSubscriptionId && portfolioData.userSubscriptionId !== existingPortfolio.userSubscriptionId) {
        const categoryId = portfolioData.categoryId || existingPortfolio.categoryId;
        const cityId = portfolioData.cityId || existingPortfolio.cityId;

        const validationResult = await subscriptionCheckService.validatePortfolioUpdate(
          userId,
          portfolioId,
          portfolioData.userSubscriptionId,
          categoryId,
          cityId
        );

        if (!validationResult.success) {
          return validationResult;
        }
      }

      if (portfolioData.categoryId && portfolioData.categoryId !== existingPortfolio.categoryId) {
        if (existingPortfolio.userSubscriptionId) {
          const cityId = portfolioData.cityId || existingPortfolio.cityId;

          const validationResult = await subscriptionCheckService.validatePortfolioUpdate(
            userId,
            portfolioId,
            existingPortfolio.userSubscriptionId,
            portfolioData.categoryId,
            cityId
          );

          if (!validationResult.success) {
            return validationResult;
          }
        }
      }

      if (portfolioData.cityId && portfolioData.cityId !== existingPortfolio.cityId) {
        if (existingPortfolio.userSubscriptionId) {
          const categoryId = portfolioData.categoryId || existingPortfolio.categoryId;

          const validationResult = await subscriptionCheckService.validatePortfolioUpdate(
            userId,
            portfolioId,
            existingPortfolio.userSubscriptionId,
            categoryId,
            portfolioData.cityId
          );

          if (!validationResult.success) {
            return validationResult;
          }
        }
      }

      const updateData = {};
      if (portfolioData.title !== undefined) updateData.title = portfolioData.title;
      if (portfolioData.description !== undefined) updateData.description = portfolioData.description;
      if (portfolioData.businessProfileId !== undefined) updateData.businessProfileId = portfolioData.businessProfileId;
      if (portfolioData.categoryId !== undefined) updateData.categoryId = portfolioData.categoryId;
      if (portfolioData.categorySlug !== undefined) updateData.categorySlug = portfolioData.categorySlug;
      if (portfolioData.userSubscriptionId !== undefined) updateData.userSubscriptionId = portfolioData.userSubscriptionId;
      if (portfolioData.priceRangeMin !== undefined) updateData.priceRangeMin = portfolioData.priceRangeMin;
      if (portfolioData.priceRangeMax !== undefined) updateData.priceRangeMax = portfolioData.priceRangeMax;
      if (portfolioData.priceOnRequest !== undefined) updateData.priceOnRequest = portfolioData.priceOnRequest;
      if (portfolioData.priceUnit !== undefined) updateData.priceUnit = portfolioData.priceUnit;
      if (portfolioData.priceBreakdown !== undefined) updateData.priceBreakdown = portfolioData.priceBreakdown;
      if (portfolioData.advancePercentage !== undefined) updateData.advancePercentage = portfolioData.advancePercentage;
      if (portfolioData.financialTerms !== undefined) updateData.financialTerms = portfolioData.financialTerms;
      if (portfolioData.highlights !== undefined) updateData.highlights = portfolioData.highlights;
      if (portfolioData.servicesOfferedTags !== undefined) updateData.servicesOfferedTags = portfolioData.servicesOfferedTags;
      if (portfolioData.servicesDescription !== undefined) updateData.servicesDescription = portfolioData.servicesDescription;
      if (portfolioData.coverageCities !== undefined) updateData.coverageCities = portfolioData.coverageCities;
      if (portfolioData.acceptsDestinationWedding !== undefined) updateData.acceptsDestinationWedding = portfolioData.acceptsDestinationWedding;
      if (portfolioData.destinationWeddingFeeDifferent !== undefined) updateData.destinationWeddingFeeDifferent = portfolioData.destinationWeddingFeeDifferent;
      if (portfolioData.cancellationPolicyUser !== undefined) updateData.cancellationPolicyUser = portfolioData.cancellationPolicyUser;
      if (portfolioData.cancellationPolicyVendor !== undefined) updateData.cancellationPolicyVendor = portfolioData.cancellationPolicyVendor;
      if (portfolioData.workingStyle !== undefined) updateData.workingStyle = portfolioData.workingStyle;
      if (portfolioData.longDescription !== undefined) updateData.longDescription = portfolioData.longDescription;
      if (portfolioData.decorPolicy !== undefined) updateData.decorPolicy = portfolioData.decorPolicy;
      if (portfolioData.acceptsAdvanceBooking !== undefined) updateData.acceptsAdvanceBooking = portfolioData.acceptsAdvanceBooking;
      if (portfolioData.minAdvanceBookingDays !== undefined) updateData.minAdvanceBookingDays = portfolioData.minAdvanceBookingDays;
      if (portfolioData.weddingsCompleted !== undefined) updateData.weddingsCompleted = portfolioData.weddingsCompleted;
      if (portfolioData.happyClientsCount !== undefined) updateData.happyClientsCount = portfolioData.happyClientsCount;
      if (portfolioData.stateId !== undefined) updateData.stateId = portfolioData.stateId;
      if (portfolioData.cityId !== undefined) {
        updateData.cityId = portfolioData.cityId;
        const cityTier = await portfolioRepository.getCityTier(portfolioData.cityId);
        if (!cityTier) {
          return {
            success: false,
            message: ERROR_MESSAGES.CITY_NOT_FOUND
          };
        }
        updateData.cityTier = cityTier;
      }
      if (portfolioData.stateSlug !== undefined) updateData.stateSlug = portfolioData.stateSlug;
      if (portfolioData.citySlug !== undefined) updateData.citySlug = portfolioData.citySlug;
      if (portfolioData.address !== undefined) updateData.address = portfolioData.address;
      if (portfolioData.serviceDetails !== undefined) updateData.serviceDetails = portfolioData.serviceDetails;

      const portfolio = await portfolioRepository.update(portfolioId, updateData, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_UPDATED,
        data: { portfolio }
      };
    } catch (error) {
      console.error('Update portfolio error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_UPDATE_FAILED
      };
    }
  }

  async deletePortfolio(portfolioId, userId) {
    try {
      const portfolio = await portfolioRepository.findByIdAndUserId(portfolioId, userId);

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      await portfolioRepository.delete(portfolioId, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_DELETED
      };
    } catch (error) {
      console.error('Delete portfolio error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_DELETE_FAILED
      };
    }
  }
}

export default new PortfolioService();
