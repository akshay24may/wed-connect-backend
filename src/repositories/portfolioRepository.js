import models from '#models/index.js';

const { Portfolio, User, BusinessProfile, Category, State, City, UserSubscription, Media, PortfolioAlbum } = models;

class PortfolioRepository {
  async findByUserId(userId, options = {}) {
    const { status, page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    const where = { userId };
    if (status) {
      where.status = status;
    }

    return await Portfolio.findAndCountAll({
      where,
      attributes: [
        'id',
        'title',
        'slug',
        'shareCode',
        'description',
        'priceRangeMin',
        'priceRangeMax',
        'priceOnRequest',
        'cityTier',
        'isFreePlanPortfolio',
        'status',
        'isFeatured',
        'coverImage',
        'coverImageStorageType',
        'viewCount',
        'contactCount',
        'totalFavorites',
        'averageRating',
        'totalReviews',
        'publishedAt',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt']
      ],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'slug', 'cityTier']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
  }

  async findById(id) {
    return await Portfolio.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'mobile']
        },
        {
          model: BusinessProfile,
          as: 'businessProfile',
          attributes: ['id', 'businessName', 'businessEmail', 'businessPhone']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: State,
          as: 'state',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'slug', 'cityTier']
        },
        {
          model: UserSubscription,
          as: 'userSubscription',
          attributes: ['id', 'planName', 'status', 'endsAt', 'finalPrice', 'cityTier']
        }
      ]
    });
  }

  async findByIdAndUserId(id, userId) {
    return await Portfolio.findOne({
      where: { id, userId },
      include: [
        {
          model: BusinessProfile,
          as: 'businessProfile',
          attributes: ['id', 'businessName']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'slug', 'cityTier']
        },
        {
          model: UserSubscription,
          as: 'userSubscription',
          attributes: ['id', 'planName', 'status', 'finalPrice', 'cityTier']
        }
      ]
    });
  }

  async create(portfolioData, userId) {
    return await Portfolio.create(portfolioData, { userId });
  }

  async update(id, portfolioData, userId) {
    const portfolio = await Portfolio.findByPk(id);
    if (!portfolio) return null;

    await portfolio.update(portfolioData, { userId });
    return portfolio;
  }

  async delete(id, userId) {
    const portfolio = await Portfolio.findByPk(id);
    if (!portfolio) return null;

    await portfolio.destroy({ userId });
    return portfolio;
  }

  async updateStatus(id, status, userId) {
    const portfolio = await Portfolio.findByPk(id);
    if (!portfolio) return null;

    const updateData = { status };
    
    if (status === 'pending') {
      updateData.publishedAt = null;
    } else if (status === 'published') {
      updateData.publishedAt = new Date();
    }

    await portfolio.update(updateData, { userId });
    return portfolio;
  }

  async updateFeaturedStatus(id, isFeatured, userId) {
    const portfolio = await Portfolio.findByPk(id);
    if (!portfolio) return null;

    await portfolio.update({ isFeatured }, { userId });
    return portfolio;
  }

  async republish(id, userId) {
    const portfolio = await Portfolio.findByPk(id);
    if (!portfolio) return null;

    await portfolio.update({}, { userId, isRepublish: true });
    return portfolio;
  }

  async countByUserId(userId, status = null) {
    const where = { userId };
    if (status) {
      where.status = status;
    }

    return await Portfolio.count({ where });
  }

  async countFeaturedByUserId(userId) {
    return await Portfolio.count({
      where: {
        userId,
        isFeatured: true,
        status: 'published'
      }
    });
  }

  async getCityTier(cityId) {
    const city = await City.findByPk(cityId, {
      attributes: ['cityTier']
    });
    return city ? city.cityTier : null;
  }

  async getSubscriptionById(subscriptionId) {
    return await UserSubscription.findByPk(subscriptionId, {
      attributes: ['id', 'finalPrice', 'planName', 'status']
    });
  }

  async findByCategoryAndTier(categoryId, cityTier, options = {}) {
    const { status = 'published', page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    return await Portfolio.findAndCountAll({
      where: {
        categoryId,
        cityTier,
        status
      },
      attributes: [
        'id',
        'title',
        'slug',
        'description',
        'priceRangeMin',
        'priceRangeMax',
        'priceOnRequest',
        'cityTier',
        'isFreePlanPortfolio',
        'isFeatured',
        'coverImage',
        'coverImageStorageType',
        'averageRating',
        'totalReviews',
        ['created_at', 'createdAt']
      ],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'slug', 'cityTier']
        }
      ],
      order: [
        ['is_featured', 'DESC'],
        ['created_at', 'DESC']
      ],
      limit,
      offset
    });
  }

  async countByUserAndCategory(userId, categoryId, status = null) {
    const where = { userId, categoryId };
    if (status) {
      where.status = status;
    }
    return await Portfolio.count({ where });
  }
}

export default new PortfolioRepository();
