import models from '#models/index.js';
import { Op } from 'sequelize';

const { SubscriptionPlan, UserSubscription, Category, User, Portfolio } = models;

class SubscriptionRepository {
  async findPlans(filters = {}) {
    const where = {};

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.categorySlug) {
      where.categorySlug = filters.categorySlug;
    }

    if (filters.cityTier) {
      where.cityTier = filters.cityTier;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.isPublic !== undefined) {
      where.isPublic = filters.isPublic;
    }

    if (filters.isDefault !== undefined) {
      where.isDefault = filters.isDefault;
    }

    const { page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    return await SubscriptionPlan.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'icon', 'iconStorageType']
        }
      ],
      order: [
        ['sortOrder', 'ASC'],
        ['finalPrice', 'ASC'],
        ['created_at', 'DESC']
      ],
      limit,
      offset
    });
  }

  async findPlanById(planId) {
    return await SubscriptionPlan.findByPk(planId, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'icon', 'iconStorageType']
        }
      ]
    });
  }

  async findPlanBySlug(slug) {
    return await SubscriptionPlan.findOne({
      where: { slug },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'icon', 'iconStorageType']
        }
      ]
    });
  }

  async createPlan(planData, userId) {
    return await SubscriptionPlan.create(planData, { userId });
  }

  async updatePlan(planId, planData, userId) {
    const plan = await SubscriptionPlan.findByPk(planId);
    if (!plan) return null;

    await plan.update(planData, { userId });
    return plan;
  }

  async deletePlan(planId, userId) {
    const plan = await SubscriptionPlan.findByPk(planId);
    if (!plan) return null;

    await plan.destroy({ userId });
    return plan;
  }

  async findUserSubscriptions(userId, filters = {}) {
    const where = { userId };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.cityTier) {
      where.cityTier = filters.cityTier;
    }

    const { page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    return await UserSubscription.findAndCountAll({
      where,
      include: [
        {
          model: SubscriptionPlan,
          as: 'plan',
          attributes: ['id', 'name', 'slug', 'planCode']
        },
        {
          model: Portfolio,
          as: 'portfolios',
          attributes: ['id', 'title', 'slug', 'status', ['created_at', 'createdAt']],
          where: { deletedAt: null },
          required: false
        }
      ],
      order: [
        ['status', 'ASC'],
        ['ends_at', 'DESC'],
        ['created_at', 'DESC']
      ],
      limit,
      offset
    });
  }

  async findUserSubscriptionById(subscriptionId, userId) {
    return await UserSubscription.findOne({
      where: { id: subscriptionId, userId },
      include: [
        {
          model: SubscriptionPlan,
          as: 'plan',
          attributes: ['id', 'name', 'slug', 'planCode']
        },
        {
          model: Portfolio,
          as: 'portfolios',
          attributes: ['id', 'title', 'slug', 'status', ['created_at', 'createdAt']],
          where: { deletedAt: null },
          required: false
        }
      ]
    });
  }

  async findActiveSubscription(userId, categoryId, cityTier) {
    return await UserSubscription.findOne({
      where: {
        userId,
        categoryId,
        cityTier,
        status: 'active'
      }
    });
  }

  async createUserSubscription(subscriptionData, userId) {
    return await UserSubscription.create(subscriptionData, { userId });
  }

  async updateUserSubscription(subscriptionId, subscriptionData, userId) {
    const subscription = await UserSubscription.findByPk(subscriptionId);
    if (!subscription) return null;

    await subscription.update(subscriptionData, { userId });
    return subscription;
  }

  async countPublishedPortfolios(userSubscriptionId) {
    return await Portfolio.count({
      where: {
        userSubscriptionId,
        status: 'published',
        deletedAt: null
      }
    });
  }

  async getAllUserSubscriptions(filters = {}) {
    const where = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    const { page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    return await UserSubscription.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'mobile']
        },
        {
          model: SubscriptionPlan,
          as: 'plan',
          attributes: ['id', 'name', 'slug', 'planCode']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
  }
}

export default new SubscriptionRepository();
