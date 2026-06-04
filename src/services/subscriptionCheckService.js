import subscriptionCheckRepository from '#repositories/subscriptionCheckRepository.js';
import subscriptionRepository from '#repositories/subscriptionRepository.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';

class SubscriptionCheckService {
  async checkEligibility(userId, categoryId = null, cityId = null) {
    try {
      const activeSubscriptions = await subscriptionCheckRepository.findActiveSubscriptionsByUser(userId);

      const response = {
        hasActiveSubscription: activeSubscriptions.length > 0,
        activeSubscriptions: []
      };

      for (const sub of activeSubscriptions) {
        const portfolioCount = await subscriptionCheckRepository.countPublishedPortfoliosBySubscription(sub.id);
        const isUsed = portfolioCount >= sub.maxPublishedPortfolios;

        response.activeSubscriptions.push({
          id: sub.id,
          categoryId: sub.categoryId,
          categoryName: sub.categoryName,
          categorySlug: sub.categorySlug,
          cityTier: sub.cityTier,
          status: sub.status,
          currentPortfolioCount: portfolioCount,
          maxPortfolios: sub.maxPublishedPortfolios,
          isUsed,
          canCreatePortfolio: !isUsed,
          endsAt: sub.endsAt
        });
      }

      if (categoryId) {
        response.categoryCheck = await this._checkCategoryEligibility(userId, categoryId, activeSubscriptions);
      }

      if (cityId) {
        const cityTier = await subscriptionCheckRepository.getCityTier(cityId);
        if (cityTier) {
          response.cityCheck = await this._checkCityEligibility(userId, cityId, cityTier, activeSubscriptions);
        }
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_ELIGIBILITY_CHECKED,
        data: response
      };
    } catch (error) {
      console.error('Check eligibility error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SUBSCRIPTION_ELIGIBILITY_CHECK_FAILED
      };
    }
  }

  async _checkCategoryEligibility(userId, categoryId, activeSubscriptions) {
    const categorySubscriptions = activeSubscriptions.filter(sub => sub.categoryId === categoryId);

    const subscriptionsByTier = {
      tier_1: { hasSubscription: false, canPurchase: true },
      tier_2: { hasSubscription: false, canPurchase: true },
      tier_3: { hasSubscription: false, canPurchase: true },
      tier_4: { hasSubscription: false, canPurchase: true },
      tier_5: { hasSubscription: false, canPurchase: true }
    };

    for (const sub of categorySubscriptions) {
      const portfolioCount = await subscriptionCheckRepository.countPublishedPortfoliosBySubscription(sub.id);
      const isUsed = portfolioCount >= sub.maxPublishedPortfolios;

      subscriptionsByTier[sub.cityTier] = {
        hasSubscription: true,
        subscriptionId: sub.id,
        isUsed,
        canCreatePortfolio: !isUsed,
        canPurchase: false
      };
    }

    for (const tier of Object.keys(subscriptionsByTier)) {
      if (!subscriptionsByTier[tier].hasSubscription) {
        const availablePlans = await subscriptionCheckRepository.getAvailablePlansForUser(userId, categoryId, tier);
        subscriptionsByTier[tier].availablePlans = availablePlans;
      }
    }

    return {
      categoryId,
      hasActiveSubscription: categorySubscriptions.length > 0,
      subscriptionsByTier
    };
  }

  async _checkCityEligibility(userId, cityId, cityTier, activeSubscriptions) {
    const citySubscriptions = activeSubscriptions.filter(sub => sub.cityTier === cityTier);

    return {
      cityId,
      cityTier,
      hasActiveSubscription: citySubscriptions.length > 0,
      subscriptions: citySubscriptions.map(sub => ({
        id: sub.id,
        categoryId: sub.categoryId,
        categoryName: sub.categoryName,
        isUsed: sub.isUsed,
        canCreatePortfolio: sub.canCreatePortfolio
      }))
    };
  }

  async validatePortfolioCreation(userId, userSubscriptionId, categoryId, cityId) {
    try {
      const subscription = await subscriptionRepository.findUserSubscriptionById(userSubscriptionId, userId);

      if (!subscription) {
        return {
          success: false,
          message: ERROR_MESSAGES.USER_SUBSCRIPTION_NOT_FOUND
        };
      }

      if (subscription.status !== 'active') {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_NOT_ACTIVE
        };
      }

      const portfolioCount = await subscriptionCheckRepository.countPublishedPortfoliosBySubscription(userSubscriptionId);

      if (portfolioCount >= subscription.maxPublishedPortfolios) {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_ALREADY_USED
        };
      }

      if (subscription.categoryId !== categoryId) {
        return {
          success: false,
          message: `${ERROR_MESSAGES.SUBSCRIPTION_CATEGORY_MISMATCH}. This subscription is for ${subscription.categoryName}.`
        };
      }

      const cityTier = await subscriptionCheckRepository.getCityTier(cityId);

      if (!cityTier) {
        return {
          success: false,
          message: ERROR_MESSAGES.CITY_NOT_FOUND
        };
      }

      if (subscription.cityTier !== cityTier) {
        return {
          success: false,
          message: `${ERROR_MESSAGES.SUBSCRIPTION_TIER_MISMATCH}. This subscription is for ${subscription.cityTier} cities, but selected city is ${cityTier}.`
        };
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_CREATION_VALIDATED,
        data: {
          canCreate: true,
          subscription: {
            id: subscription.id,
            categoryId: subscription.categoryId,
            categoryName: subscription.categoryName,
            cityTier: subscription.cityTier,
            currentPortfolioCount: portfolioCount,
            maxPortfolios: subscription.maxPublishedPortfolios
          },
          cityTier,
          tierMatch: true,
          categoryMatch: true
        }
      };
    } catch (error) {
      console.error('Validate portfolio creation error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_CREATION_VALIDATION_FAILED
      };
    }
  }

  async validatePortfolioUpdate(userId, currentPortfolioId, userSubscriptionId, categoryId, cityId) {
    try {
      const subscription = await subscriptionRepository.findUserSubscriptionById(userSubscriptionId, userId);

      if (!subscription) {
        return {
          success: false,
          message: ERROR_MESSAGES.USER_SUBSCRIPTION_NOT_FOUND
        };
      }

      if (subscription.status !== 'active') {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_NOT_ACTIVE
        };
      }

      const portfolioCount = await subscriptionCheckRepository.countPublishedPortfoliosBySubscription(userSubscriptionId);
      const currentPortfolioUsesThisSubscription = await this._checkIfPortfolioUsesSubscription(
        currentPortfolioId,
        userSubscriptionId
      );

      if (!currentPortfolioUsesThisSubscription && portfolioCount >= subscription.maxPublishedPortfolios) {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_ALREADY_USED
        };
      }

      if (subscription.categoryId !== categoryId) {
        return {
          success: false,
          message: `${ERROR_MESSAGES.SUBSCRIPTION_CATEGORY_MISMATCH}. This subscription is for ${subscription.categoryName}.`
        };
      }

      const cityTier = await subscriptionCheckRepository.getCityTier(cityId);

      if (!cityTier) {
        return {
          success: false,
          message: ERROR_MESSAGES.CITY_NOT_FOUND
        };
      }

      if (subscription.cityTier !== cityTier) {
        return {
          success: false,
          message: `${ERROR_MESSAGES.SUBSCRIPTION_TIER_MISMATCH}. This subscription is for ${subscription.cityTier} cities, but selected city is ${cityTier}.`
        };
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_CREATION_VALIDATED,
        data: {
          canUpdate: true,
          subscription: {
            id: subscription.id,
            categoryId: subscription.categoryId,
            categoryName: subscription.categoryName,
            cityTier: subscription.cityTier,
            currentPortfolioCount: portfolioCount,
            maxPortfolios: subscription.maxPublishedPortfolios
          },
          cityTier,
          tierMatch: true,
          categoryMatch: true
        }
      };
    } catch (error) {
      console.error('Validate portfolio update error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_CREATION_VALIDATION_FAILED
      };
    }
  }

  async _checkIfPortfolioUsesSubscription(portfolioId, userSubscriptionId) {
    try {
      const models = (await import('#models/index.js')).default;
      const { Portfolio } = models;

      const portfolio = await Portfolio.findOne({
        where: {
          id: portfolioId,
          userSubscriptionId,
          status: 'published',
          deletedAt: null
        }
      });

      return !!portfolio;
    } catch (error) {
      console.error('Check if portfolio uses subscription error:', error);
      return false;
    }
  }

  async canCreatePortfolio(userId, userSubscriptionId) {
    try {
      const subscription = await subscriptionRepository.findUserSubscriptionById(userSubscriptionId, userId);

      if (!subscription || subscription.status !== 'active') {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_NOT_ACTIVE
        };
      }

      const portfolioCount = await subscriptionCheckRepository.countPublishedPortfoliosBySubscription(userSubscriptionId);

      const canCreate = portfolioCount < subscription.maxPublishedPortfolios;

      return {
        success: true,
        data: {
          canCreate,
          currentCount: portfolioCount,
          maxAllowed: subscription.maxPublishedPortfolios,
          remaining: subscription.maxPublishedPortfolios - portfolioCount
        }
      };
    } catch (error) {
      console.error('Can create portfolio error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SUBSCRIPTION_ELIGIBILITY_CHECK_FAILED
      };
    }
  }

  async getAvailablePlans(userId, categoryId, cityTier) {
    try {
      const existingSubscription = await subscriptionCheckRepository.findActiveSubscriptionByCategoryAndTier(
        userId,
        categoryId,
        cityTier
      );

      const plans = await subscriptionCheckRepository.getAvailablePlansForUser(userId, categoryId, cityTier);

      return {
        success: true,
        message: SUCCESS_MESSAGES.AVAILABLE_PLANS_RETRIEVED,
        data: {
          categoryId,
          cityTier,
          hasActiveSubscription: !!existingSubscription,
          existingSubscriptionId: existingSubscription?.id,
          plans
        }
      };
    } catch (error) {
      console.error('Get available plans error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.AVAILABLE_PLANS_FETCH_FAILED
      };
    }
  }

  async checkAlbumQuota(userSubscriptionId, currentCount) {
    try {
      const subscription = await subscriptionRepository.findUserSubscriptionById(userSubscriptionId, null);

      if (!subscription) {
        return {
          success: false,
          message: ERROR_MESSAGES.USER_SUBSCRIPTION_NOT_FOUND
        };
      }

      const maxAllowed = subscription.maxAlbumsPerPortfolio;

      if (maxAllowed === 0) {
        return {
          success: false,
          message: ERROR_MESSAGES.ALBUM_QUOTA_EXCEEDED
        };
      }

      if (currentCount >= maxAllowed) {
        return {
          success: false,
          message: `${ERROR_MESSAGES.ALBUM_QUOTA_EXCEEDED}. Maximum ${maxAllowed} albums allowed.`
        };
      }

      return {
        success: true,
        data: {
          canCreate: true,
          currentCount,
          maxAllowed,
          remaining: maxAllowed - currentCount
        }
      };
    } catch (error) {
      console.error('Check album quota error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SUBSCRIPTION_ELIGIBILITY_CHECK_FAILED
      };
    }
  }

  async checkPhotoQuota(userSubscriptionId, portfolioId, albumId, currentCount) {
    try {
      const subscription = await subscriptionRepository.findUserSubscriptionById(userSubscriptionId, null);

      if (!subscription) {
        return {
          success: false,
          message: ERROR_MESSAGES.USER_SUBSCRIPTION_NOT_FOUND
        };
      }

      const maxAllowed = subscription.maxPhotosPerAlbum;

      if (maxAllowed === 0) {
        return {
          success: false,
          message: ERROR_MESSAGES.PHOTO_QUOTA_EXCEEDED
        };
      }

      if (currentCount >= maxAllowed) {
        return {
          success: false,
          message: `${ERROR_MESSAGES.PHOTO_QUOTA_EXCEEDED}. Maximum ${maxAllowed} photos allowed per album.`
        };
      }

      return {
        success: true,
        data: {
          canUpload: true,
          currentCount,
          maxAllowed,
          remaining: maxAllowed - currentCount
        }
      };
    } catch (error) {
      console.error('Check photo quota error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SUBSCRIPTION_ELIGIBILITY_CHECK_FAILED
      };
    }
  }

  async checkVideoQuota(userSubscriptionId, portfolioId, albumId, currentCount) {
    try {
      const subscription = await subscriptionRepository.findUserSubscriptionById(userSubscriptionId, null);

      if (!subscription) {
        return {
          success: false,
          message: ERROR_MESSAGES.USER_SUBSCRIPTION_NOT_FOUND
        };
      }

      if (!subscription.allowVideos) {
        return {
          success: false,
          message: ERROR_MESSAGES.VIDEOS_NOT_ALLOWED
        };
      }

      const maxAllowed = subscription.maxVideosPerAlbum;

      if (maxAllowed === 0) {
        return {
          success: false,
          message: ERROR_MESSAGES.VIDEO_QUOTA_EXCEEDED
        };
      }

      if (currentCount >= maxAllowed) {
        return {
          success: false,
          message: `${ERROR_MESSAGES.VIDEO_QUOTA_EXCEEDED}. Maximum ${maxAllowed} videos allowed per album.`
        };
      }

      return {
        success: true,
        data: {
          canUpload: true,
          currentCount,
          maxAllowed,
          remaining: maxAllowed - currentCount
        }
      };
    } catch (error) {
      console.error('Check video quota error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SUBSCRIPTION_ELIGIBILITY_CHECK_FAILED
      };
    }
  }

  async checkStorageQuota(userSubscriptionId, newFileSizeMB) {
    try {
      const subscription = await subscriptionRepository.findUserSubscriptionById(userSubscriptionId, null);

      if (!subscription) {
        return {
          success: false,
          message: ERROR_MESSAGES.USER_SUBSCRIPTION_NOT_FOUND
        };
      }

      const maxStorageMb = subscription.maxStorageMb;

      if (maxStorageMb === null) {
        return {
          success: true,
          data: {
            canUpload: true,
            unlimited: true
          }
        };
      }

      const currentUsageMB = parseFloat(await subscriptionCheckRepository.calculateStorageUsage(userSubscriptionId));
      const projectedUsageMB = currentUsageMB + newFileSizeMB;

      if (projectedUsageMB > maxStorageMb) {
        return {
          success: false,
          message: `${ERROR_MESSAGES.STORAGE_QUOTA_EXCEEDED}. Maximum ${maxStorageMb} MB allowed. Current usage: ${currentUsageMB.toFixed(2)} MB.`
        };
      }

      return {
        success: true,
        data: {
          canUpload: true,
          currentUsageMB: currentUsageMB.toFixed(2),
          maxStorageMb,
          remainingMB: (maxStorageMb - projectedUsageMB).toFixed(2)
        }
      };
    } catch (error) {
      console.error('Check storage quota error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SUBSCRIPTION_ELIGIBILITY_CHECK_FAILED
      };
    }
  }
}

export default new SubscriptionCheckService();
