import { DataTypes } from 'sequelize';
import sequelize from '#config/database.js';
import { generateUniqueSlug } from '#utils/customSlugify.js';
import { getFullUrl } from '#utils/storageHelper.js';

const Portfolio = sequelize.define(
  'Portfolio',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'user_id'
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'category_id'
    },
    categorySlug: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'category_slug'
    },
    userSubscriptionId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'user_subscription_id'
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'title'
    },
    slug: {
      type: DataTypes.STRING(250),
      allowNull: true,
      unique: true,
      field: 'slug'
    },
    shareCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: true,
      field: 'share_code'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    startingPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'starting_price'
    },
    priceRangeMin: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'price_range_min'
    },
    priceRangeMax: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'price_range_max'
    },
    priceOnRequest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'price_on_request'
    },
    stateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'state_id'
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'city_id'
    },
    stateSlug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'state_slug'
    },
    citySlug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'city_slug'
    },
    locality: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'locality'
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'address'
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      field: 'latitude'
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      field: 'longitude'
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending', 'published', 'rejected'),
      allowNull: false,
      defaultValue: 'draft',
      field: 'status'
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_featured'
    },
    featuredUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'featured_until'
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'published_at'
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'approved_at'
    },
    approvedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'approved_by'
    },
    rejectedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'rejected_at'
    },
    rejectedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'rejected_by'
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'rejection_reason'
    },
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'view_count'
    },
    contactCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'contact_count'
    },
    totalFavorites: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_favorites'
    },
    coverImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'cover_image',
      get() {
        const rawValue = this.getDataValue('coverImage');
        const storageType = this.getDataValue('coverImageStorageType');
        const mimeType = this.getDataValue('coverImageMimeType');
        return getFullUrl(rawValue, storageType, mimeType);
      }
    },
    coverImageStorageType: {
      type: DataTypes.ENUM(
        'local',
        'cloudinary',
        'aws_s3',
        'cloudflare_r2',
        'gcs',
        'azure_blob',
        'digital_ocean',
        'backblaze_b2',
        'external',
        'other'
      ),
      allowNull: true,
      field: 'cover_image_storage_type'
    },
    coverImageMimeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'cover_image_mime_type'
    },
    isAutoApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_auto_approved'
    },
    keywords: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'keywords'
    },
    republishCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'republish_count'
    },
    lastRepublishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_republished_at'
    },
    republishHistory: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'republish_history'
    },
    serviceDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'service_details'
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'created_by'
    },
    updatedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'updated_by'
    },
    deletedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'deleted_by'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  },
  {
    sequelize,
    tableName: 'portfolios',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeCreate: async (portfolio, options) => {
        if (!portfolio.slug && portfolio.title) {
          portfolio.slug = generateUniqueSlug(portfolio.title);
        }

        if (options.userId) {
          portfolio.createdBy = options.userId;
        }
      },
      beforeUpdate: async (portfolio, options) => {
        if (options.userId) {
          portfolio.updatedBy = options.userId;
        }

        if (options.isRepublish) {
          portfolio.republishCount = (portfolio.republishCount || 0) + 1;
          portfolio.lastRepublishedAt = new Date();
          
          const currentHistory = portfolio.republishHistory || [];
          const newHistoryEntry = {
            timestamp: new Date().toISOString(),
            userId: options.userId || portfolio.userId
          };
          
          portfolio.republishHistory = [...currentHistory, newHistoryEntry];
        }
      }
    }
  }
);

Portfolio.associate = (models) => {
  Portfolio.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  Portfolio.belongsTo(models.Category, {
    foreignKey: 'category_id',
    as: 'category'
  });

  Portfolio.belongsTo(models.State, {
    foreignKey: 'state_id',
    as: 'state'
  });

  Portfolio.belongsTo(models.City, {
    foreignKey: 'city_id',
    as: 'city'
  });

  Portfolio.hasMany(models.PortfolioMedia, {
    foreignKey: 'portfolio_id',
    as: 'media'
  });

  Portfolio.belongsTo(models.User, {
    foreignKey: 'approved_by',
    as: 'approver'
  });

  Portfolio.belongsTo(models.User, {
    foreignKey: 'rejected_by',
    as: 'rejecter'
  });

  Portfolio.belongsTo(models.UserSubscription, {
    foreignKey: 'user_subscription_id',
    as: 'userSubscription'
  });
};

export default Portfolio;
