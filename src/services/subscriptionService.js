import subscriptionRepository from '#repositories/subscriptionRepository.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';

class SubscriptionService {
  async getPlans(filters = {}) {
    try {
      const result = await subscriptionRepository.findPlans(filters);

      const { page = 1, limit = 20 } = filters;
      const totalPages = Math.ceil(result.count / limit);

      return {
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PLANS_RETRIEVED,
        data: {
          plans: result.rows,
          pagination: {
            total: result.count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages
          }
        }
      };
    } catch (error) {
      console.error('Get subscription plans error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SUBSCRIPTION_PLANS_FETCH_FAILED
      };
    }
  }

  async getPlanById(planId) {
    try {
      const plan = await subscriptionRepository.findPlanById(planId);

      if (!plan) {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND
        };
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PLAN_RETRIEVED,
        data: { plan }
      };
    } catch (error) {
      console.error('Get subscription plan error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_FETCH_FAILED
      };
    }
  }

  async getPlanBySlug(slug) {
    try {
      const plan = await subscriptionRepository.findPlanBySlug(slug);

      if (!plan) {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND
        };
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PLAN_RETRIEVED,
        data: { plan }
      };
    } catch (error) {
      console.error('Get subscription plan by slug error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_FETCH_FAILED
      };
    }
  }

  async getUserSubscriptions(userId, filters = {}) {
    try {
      const result = await subscriptionRepository.findUserSubscriptions(userId, filters);

      const { page = 1, limit = 20 } = filters;
      const totalPages = Math.ceil(result.count / limit);

      return {
        success: true,
        message: SUCCESS_MESSAGES.USER_SUBSCRIPTIONS_RETRIEVED,
        data: {
          subscriptions: result.rows,
          pagination: {
            total: result.count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages
          }
        }
      };
    } catch (error) {
      console.error('Get user subscriptions error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.USER_SUBSCRIPTIONS_FETCH_FAILED
      };
    }
  }

  async getUserSubscription(userId, subscriptionId) {
    try {
      const subscription = await subscriptionRepository.findUserSubscriptionById(subscriptionId, userId);

      if (!subscription) {
        return {
          success: false,
          message: ERROR_MESSAGES.USER_SUBSCRIPTION_NOT_FOUND
        };
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.USER_SUBSCRIPTION_RETRIEVED,
        data: { subscription }
      };
    } catch (error) {
      console.error('Get user subscription error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.USER_SUBSCRIPTION_FETCH_FAILED
      };
    }
  }

  async purchaseSubscription(userId, planId, paymentData) {
    try {
      const plan = await subscriptionRepository.findPlanById(planId);

      if (!plan) {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND
        };
      }

      if (!plan.isActive) {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_INACTIVE
        };
      }

      if (!plan.isPublic) {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_NOT_PUBLIC
        };
      }

      const existingSubscription = await subscriptionRepository.findActiveSubscription(
        userId,
        plan.categoryId,
        plan.cityTier
      );

      if (existingSubscription) {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_ALREADY_ACTIVE
        };
      }

      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + plan.durationDays);

      const subscriptionData = {
        userId,
        planId: plan.id,
        endsAt,
        activatedAt: new Date(),
        status: 'active',
        planName: plan.name,
        planCode: plan.planCode,
        planVersion: plan.version,
        basePrice: plan.basePrice,
        discountAmount: plan.discountAmount,
        finalPrice: plan.finalPrice,
        currency: plan.currency,
        billingCycle: plan.billingCycle,
        durationDays: plan.durationDays,
        maxPublishedPortfolios: plan.maxPublishedPortfolios,
        categoryId: plan.categoryId,
        categoryName: plan.categoryName,
        categorySlug: plan.categorySlug,
        cityTier: plan.cityTier,
        maxAlbumsPerPortfolio: plan.maxAlbumsPerPortfolio,
        maxPhotosPerAlbum: plan.maxPhotosPerAlbum,
        maxVideosPerAlbum: plan.maxVideosPerAlbum,
        maxStorageMb: plan.maxStorageMb,
        allowVideos: plan.allowVideos,
        isFeaturedAllowed: plan.isFeaturedAllowed,
        featuredDays: plan.featuredDays,
        isBoostedAllowed: plan.isBoostedAllowed,
        boostedDays: plan.boostedDays,
        canBeRecommended: plan.canBeRecommended,
        priorityScore: plan.priorityScore,
        searchBoostMultiplier: plan.searchBoostMultiplier,
        nationalVisibility: plan.nationalVisibility,
        maxRepublishCount: plan.maxRepublishCount,
        republishCooldownDays: plan.republishCooldownDays,
        isAutoApproveEnabled: plan.isAutoApproveEnabled,
        supportLevel: plan.supportLevel,
        features: plan.features,
        paymentMethod: paymentData?.paymentMethod,
        transactionId: paymentData?.transactionId,
        amountPaid: paymentData?.amountPaid || plan.finalPrice
      };

      const subscription = await subscriptionRepository.createUserSubscription(subscriptionData, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PURCHASED,
        data: { subscription }
      };
    } catch (error) {
      console.error('Purchase subscription error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SUBSCRIPTION_PURCHASE_FAILED
      };
    }
  }

  async cancelSubscription(userId, subscriptionId, reason) {
    try {
      const subscription = await subscriptionRepository.findUserSubscriptionById(subscriptionId, userId);

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

      const updateData = {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancellationReason: reason
      };

      await subscriptionRepository.updateUserSubscription(subscriptionId, updateData, userId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_CANCELLED
      };
    } catch (error) {
      console.error('Cancel subscription error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SUBSCRIPTION_CANCEL_FAILED
      };
    }
  }

  async createPlan(planData, adminUserId) {
    try {
      if (!planData.name) {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_NAME_REQUIRED
        };
      }

      if (!planData.categoryId) {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_CATEGORY_REQUIRED
        };
      }

      if (!planData.cityTier) {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_TIER_REQUIRED
        };
      }

      if (planData.basePrice === undefined || planData.basePrice === null) {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_PRICE_REQUIRED
        };
      }

      if (!planData.durationDays) {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_DURATION_REQUIRED
        };
      }

      planData.maxPublishedPortfolios = 1;

      const plan = await subscriptionRepository.createPlan(planData, adminUserId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PLAN_CREATED,
        data: { plan }
      };
    } catch (error) {
      console.error('Create subscription plan error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_CREATE_FAILED
      };
    }
  }

  async updatePlan(planId, planData, adminUserId) {
    try {
      const existingPlan = await subscriptionRepository.findPlanById(planId);

      if (!existingPlan) {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND
        };
      }

      if (planData.maxPublishedPortfolios !== undefined) {
        planData.maxPublishedPortfolios = 1;
      }

      const plan = await subscriptionRepository.updatePlan(planId, planData, adminUserId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PLAN_UPDATED,
        data: { plan }
      };
    } catch (error) {
      console.error('Update subscription plan error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_UPDATE_FAILED
      };
    }
  }

  async deletePlan(planId, adminUserId) {
    try {
      const plan = await subscriptionRepository.findPlanById(planId);

      if (!plan) {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND
        };
      }

      await subscriptionRepository.deletePlan(planId, adminUserId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PLAN_DELETED
      };
    } catch (error) {
      console.error('Delete subscription plan error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_DELETE_FAILED
      };
    }
  }

  async updatePlanStatus(planId, isActive, adminUserId) {
    try {
      const plan = await subscriptionRepository.findPlanById(planId);

      if (!plan) {
        return {
          success: false,
          message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND
        };
      }

      await subscriptionRepository.updatePlan(planId, { isActive }, adminUserId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PLAN_STATUS_UPDATED
      };
    } catch (error) {
      console.error('Update subscription plan status error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SUBSCRIPTION_PLAN_STATUS_UPDATE_FAILED
      };
    }
  }

  async getAllUserSubscriptions(filters = {}) {
    try {
      const result = await subscriptionRepository.getAllUserSubscriptions(filters);

      const { page = 1, limit = 20 } = filters;
      const totalPages = Math.ceil(result.count / limit);

      return {
        success: true,
        message: SUCCESS_MESSAGES.USER_SUBSCRIPTIONS_RETRIEVED,
        data: {
          subscriptions: result.rows,
          pagination: {
            total: result.count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages
          }
        }
      };
    } catch (error) {
      console.error('Get all user subscriptions error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.USER_SUBSCRIPTIONS_FETCH_FAILED
      };
    }
  }

  async updateSubscriptionStatus(subscriptionId, status, adminUserId) {
    try {
      const subscription = await subscriptionRepository.findUserSubscriptionById(subscriptionId, null);

      if (!subscription) {
        return {
          success: false,
          message: ERROR_MESSAGES.USER_SUBSCRIPTION_NOT_FOUND
        };
      }

      await subscriptionRepository.updateUserSubscription(subscriptionId, { status }, adminUserId);

      return {
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_STATUS_UPDATED
      };
    } catch (error) {
      console.error('Update subscription status error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SUBSCRIPTION_STATUS_UPDATE_FAILED
      };
    }
  }
}

export default new SubscriptionService();
