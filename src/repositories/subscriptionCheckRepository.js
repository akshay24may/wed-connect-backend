import models from '#models/index.js';
import { Op } from 'sequelize';

const { UserSubscription, Portfolio, PortfolioAlbum, Media, City, SubscriptionPlan } = models;

class SubscriptionCheckRepository {
  async findActiveSubscriptionsByUser(userId) {
    return await UserSubscription.findAll({
      where: {
        userId,
        status: 'active'
      },
      attributes: [
        'id',
        'categoryId',
        'categoryName',
        'categorySlug',
        'cityTier',
        'status',
        'maxPublishedPortfolios',
        'maxAlbumsPerPortfolio',
        'maxPhotosPerAlbum',
        'maxVideosPerAlbum',
        'maxStorageMb',
        'allowVideos',
        'endsAt',
        ['created_at', 'createdAt']
      ],
      order: [['created_at', 'DESC']]
    });
  }

  async findActiveSubscriptionByCategory(userId, categoryId) {
    return await UserSubscription.findAll({
      where: {
        userId,
        categoryId,
        status: 'active'
      },
      attributes: [
        'id',
        'categoryId',
        'categoryName',
        'categorySlug',
        'cityTier',
        'status',
        'maxPublishedPortfolios',
        'endsAt',
        ['created_at', 'createdAt']
      ],
      order: [['created_at', 'DESC']]
    });
  }

  async findActiveSubscriptionByCategoryAndTier(userId, categoryId, cityTier) {
    return await UserSubscription.findOne({
      where: {
        userId,
        categoryId,
        cityTier,
        status: 'active'
      }
    });
  }

  async countPublishedPortfoliosBySubscription(userSubscriptionId) {
    return await Portfolio.count({
      where: {
        userSubscriptionId,
        status: 'published',
        deletedAt: null
      }
    });
  }

  async checkSubscriptionUsage(userSubscriptionId) {
    const portfolio = await Portfolio.findOne({
      where: {
        userSubscriptionId,
        status: {
          [Op.ne]: 'rejected'
        },
        deletedAt: null
      }
    });
    return !!portfolio;
  }

  async countAlbumsByPortfolio(portfolioId) {
    return await PortfolioAlbum.count({
      where: {
        portfolioId,
        deletedAt: null
      }
    });
  }

  async countPhotosByAlbum(portfolioId, albumId) {
    return await Media.count({
      where: {
        entityType: 'portfolio',
        entityId: portfolioId,
        subEntityType: 'album',
        subEntityId: albumId,
        mediaType: 'photo',
        deletedAt: null
      }
    });
  }

  async countVideosByAlbum(portfolioId, albumId) {
    return await Media.count({
      where: {
        entityType: 'portfolio',
        entityId: portfolioId,
        subEntityType: 'album',
        subEntityId: albumId,
        mediaType: 'video',
        deletedAt: null
      }
    });
  }

  async calculateStorageUsage(userSubscriptionId) {
    const portfolios = await Portfolio.findAll({
      where: {
        userSubscriptionId,
        deletedAt: null
      },
      attributes: ['id']
    });

    if (portfolios.length === 0) {
      return 0;
    }

    const portfolioIds = portfolios.map(p => p.id);

    const result = await Media.sum('fileSizeBytes', {
      where: {
        entityType: 'portfolio',
        entityId: { [Op.in]: portfolioIds },
        deletedAt: null
      }
    });

    const totalBytes = result || 0;
    return (totalBytes / (1024 * 1024)).toFixed(2);
  }

  async getCityTier(cityId) {
    const city = await City.findByPk(cityId, {
      attributes: ['id', 'name', 'slug', 'cityTier']
    });

    return city ? city.cityTier : null;
  }

  async getAvailablePlansForUser(userId, categoryId, cityTier) {
    const existingSubscription = await this.findActiveSubscriptionByCategoryAndTier(
      userId,
      categoryId,
      cityTier
    );

    const where = {
      categoryId,
      cityTier,
      isActive: true,
      isPublic: true
    };

    return await SubscriptionPlan.findAll({
      where,
      attributes: [
        'id',
        'name',
        'slug',
        'planCode',
        'description',
        'shortDescription',
        'basePrice',
        'discountAmount',
        'finalPrice',
        'currency',
        'durationDays',
        'tagline',
        'showOriginalPrice',
        'showOfferBadge',
        'offerBadgeText',
        'maxPublishedPortfolios',
        'maxAlbumsPerPortfolio',
        'maxPhotosPerAlbum',
        'maxVideosPerAlbum',
        'maxStorageMb',
        'allowVideos',
        'isFeaturedAllowed',
        'featuredDays',
        'isBoostedAllowed',
        'boostedDays',
        'features'
      ],
      order: [
        ['sortOrder', 'ASC'],
        ['finalPrice', 'ASC']
      ]
    });
  }

  async findSubscriptionWithPortfolioCount(subscriptionId) {
    const subscription = await UserSubscription.findByPk(subscriptionId);
    if (!subscription) return null;

    const portfolioCount = await this.countPublishedPortfoliosBySubscription(subscriptionId);

    return {
      ...subscription.toJSON(),
      currentPortfolioCount: portfolioCount
    };
  }
}

export default new SubscriptionCheckRepository();
