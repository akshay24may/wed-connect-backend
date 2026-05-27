import models from '#models/index.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';
import { Op } from 'sequelize';

const { Portfolio, User, BusinessProfile, Category, State, City, PortfolioAlbum, Media } = models;

class PortfolioPublicService {
  async getPortfolios(filters = {}) {
    try {
      const {
        category,
        city,
        priceMin,
        priceMax,
        page = 1,
        limit = 20
      } = filters;

      const offset = (page - 1) * limit;
      const where = { status: 'published' };

      if (category) {
        where.categorySlug = category;
      }

      if (city) {
        where.citySlug = city;
      }

      if (priceMin || priceMax) {
        where.priceRangeMin = {};
        if (priceMin) {
          where.priceRangeMin[Op.gte] = priceMin;
        }
        if (priceMax) {
          where.priceRangeMin[Op.lte] = priceMax;
        }
      }

      const result = await Portfolio.findAndCountAll({
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
          'coverImage',
          'coverImageStorageType',
          'isFeatured',
          'isBoosted',
          'isRecommended',
          'viewCount',
          'totalFavorites',
          'averageRating',
          'totalReviews',
          'weddingsCompleted',
          'publishedAt',
          ['created_at', 'createdAt']
        ],
        include: [
          {
            model: BusinessProfile,
            as: 'businessProfile',
            attributes: ['id', 'businessName', 'businessTagline']
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
          }
        ],
        order: [
          ['isFeatured', 'DESC'],
          ['isBoosted', 'DESC'],
          ['isRecommended', 'DESC'],
          ['publishedAt', 'DESC']
        ],
        limit,
        offset
      });

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
      console.error('Get public portfolios error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIOS_FETCH_FAILED
      };
    }
  }

  async getPortfolioBySlug(slug) {
    try {
      const portfolio = await Portfolio.findOne({
        where: { slug, status: 'published' },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'fullName']
          },
          {
            model: BusinessProfile,
            as: 'businessProfile',
            attributes: [
              'id',
              'businessName',
              'businessTagline',
              'businessEmail',
              'businessPhone',
              'businessLogo',
              'businessLogoStorageType',
              'websiteUrl',
              'facebookUrl',
              'instagramUrl',
              'youtubeUrl'
            ]
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
          }
        ]
      });

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      await portfolio.increment('viewCount');

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_RETRIEVED,
        data: { portfolio }
      };
    } catch (error) {
      console.error('Get portfolio by slug error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_FETCH_FAILED
      };
    }
  }

  async getPortfolioByShareCode(shareCode) {
    try {
      const portfolio = await Portfolio.findOne({
        where: { shareCode },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'fullName']
          },
          {
            model: BusinessProfile,
            as: 'businessProfile',
            attributes: [
              'id',
              'businessName',
              'businessTagline',
              'businessEmail',
              'businessPhone',
              'businessLogo',
              'businessLogoStorageType'
            ]
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
          }
        ]
      });

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
      console.error('Get portfolio by share code error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_FETCH_FAILED
      };
    }
  }

  async getMedia(portfolioId, filters = {}) {
    try {
      const {
        subEntityType,
        subEntityId,
        mediaType,
        page = 1,
        limit = 50
      } = filters;

      const portfolio = await Portfolio.findOne({
        where: { id: portfolioId, status: 'published' }
      });

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      const offset = (page - 1) * limit;
      const where = {
        entityType: 'portfolio',
        entityId: portfolioId
      };

      if (subEntityType) where.subEntityType = subEntityType;
      if (subEntityId) where.subEntityId = subEntityId;
      if (mediaType) where.mediaType = mediaType;

      const result = await Media.findAndCountAll({
        where,
        attributes: [
          'id',
          'entityType',
          'entityId',
          'subEntityType',
          'subEntityId',
          'mediaType',
          'mediaUrl',
          'thumbnailUrl',
          'storageType',
          'mimeType',
          'thumbnailMimeType',
          'fileSizeBytes',
          'width',
          'height',
          'displayOrder',
          'isPrimary',
          ['created_at', 'createdAt']
        ],
        order: [
          ['isPrimary', 'DESC'],
          ['displayOrder', 'ASC'],
          ['created_at', 'ASC']
        ],
        limit,
        offset
      });

      const totalPages = Math.ceil(result.count / limit);

      return {
        success: true,
        message: SUCCESS_MESSAGES.PORTFOLIO_MEDIA_RETRIEVED,
        data: {
          media: result.rows,
          pagination: {
            total: result.count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages
          }
        }
      };
    } catch (error) {
      console.error('Get public media error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.PORTFOLIO_MEDIA_FETCH_FAILED
      };
    }
  }

  async getAlbums(portfolioId, filters = {}) {
    try {
      const { page = 1, limit = 20 } = filters;

      const portfolio = await Portfolio.findOne({
        where: { id: portfolioId, status: 'published' }
      });

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      const offset = (page - 1) * limit;

      const result = await PortfolioAlbum.findAndCountAll({
        where: {
          portfolioId,
          isPublic: true
        },
        attributes: [
          'id',
          'portfolioId',
          'albumName',
          'albumSlug',
          'albumDescription',
          'coverPhotoOne',
          'coverPhotoTwo',
          'coverPhotoThree',
          'coverPhotoStorageType',
          'cityId',
          'citySlug',
          'locationName',
          'latitude',
          'longitude',
          'displayOrder',
          'isFeatured',
          'mediaCount',
          ['created_at', 'createdAt']
        ],
        include: [
          {
            model: City,
            as: 'city',
            attributes: ['id', 'name', 'slug', 'cityTier']
          }
        ],
        order: [
          ['isFeatured', 'DESC'],
          ['displayOrder', 'ASC'],
          ['created_at', 'DESC']
        ],
        limit,
        offset
      });

      const totalPages = Math.ceil(result.count / limit);

      return {
        success: true,
        message: SUCCESS_MESSAGES.ALBUMS_RETRIEVED,
        data: {
          albums: result.rows,
          pagination: {
            total: result.count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages
          }
        }
      };
    } catch (error) {
      console.error('Get public albums error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.ALBUMS_FETCH_FAILED
      };
    }
  }

  async getAlbumBySlug(portfolioId, albumSlug) {
    try {
      const portfolio = await Portfolio.findOne({
        where: { id: portfolioId, status: 'published' }
      });

      if (!portfolio) {
        return {
          success: false,
          message: ERROR_MESSAGES.PORTFOLIO_NOT_FOUND
        };
      }

      const album = await PortfolioAlbum.findOne({
        where: {
          portfolioId,
          albumSlug,
          isPublic: true
        },
        include: [
          {
            model: Portfolio,
            as: 'portfolio',
            attributes: ['id', 'title', 'slug']
          },
          {
            model: City,
            as: 'city',
            attributes: ['id', 'name', 'slug', 'cityTier']
          }
        ]
      });

      if (!album) {
        return {
          success: false,
          message: ERROR_MESSAGES.ALBUM_NOT_FOUND
        };
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.ALBUM_RETRIEVED,
        data: { album }
      };
    } catch (error) {
      console.error('Get album by slug error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.ALBUM_FETCH_FAILED
      };
    }
  }
}

export default new PortfolioPublicService();
