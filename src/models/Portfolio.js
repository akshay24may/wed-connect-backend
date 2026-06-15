import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';
import { generateUniqueSlug } from '#utils/customSlugify.js';
import { getFullUrl } from '#utils/storageHelper.js';

class Portfolio extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    this.belongsTo(models.BusinessProfile, {
      foreignKey: 'business_profile_id',
      as: 'businessProfile'
    });

    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });

    this.belongsTo(models.State, {
      foreignKey: 'state_id',
      as: 'state'
    });

    this.belongsTo(models.City, {
      foreignKey: 'city_id',
      as: 'city'
    });

    // Media association (renamed from PortfolioMedia)
    this.hasMany(models.Media, {
      foreignKey: 'entityId',
      as: 'media',
      scope: {
        entityType: 'portfolio'
      }
    });

    this.hasMany(models.PortfolioAlbum, {
      foreignKey: 'portfolioId',
      as: 'albums'
    });

    this.hasMany(models.PortfolioReview, {
      foreignKey: 'portfolioId',
      as: 'reviews'
    });

    this.belongsTo(models.User, {
      foreignKey: 'approved_by',
      as: 'approver'
    });

    this.belongsTo(models.User, {
      foreignKey: 'rejected_by',
      as: 'rejecter'
    });

    this.belongsTo(models.UserSubscription, {
      foreignKey: 'user_subscription_id',
      as: 'userSubscription'
    });

    this.hasOne(models.PortfolioRevision, {
      foreignKey: 'portfolioId',
      as: 'pendingRevision'
    });
  }
}

Portfolio.init(
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
    businessProfileId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'business_profile_id'
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'category_id'
    },
    categorySlug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'category_slug'
    },
    userSubscriptionId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'user_subscription_id'
    },
    cityTier: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'city_tier'
    },
    isFreePlanPortfolio: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_free_plan_portfolio'
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
    priceRangeMin: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
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
    priceUnit: {
      type: DataTypes.ENUM('per_day', 'per_event', 'per_hour', 'per_guest', 'per_plate', 'per_item', 'fixed', 'na'),
      allowNull: true,
      field: 'price_unit'
    },
    priceBreakdown: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'price_breakdown'
    },
    advancePercentage: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      field: 'advance_percentage'
    },
    financialTerms: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'financial_terms'
    },
    highlights: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'highlights'
    },
    servicesOfferedTags: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'services_offered_tags'
    },
    servicesDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'services_description'
    },
    coverageCities: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'coverage_cities'
    },
    acceptsDestinationWedding: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'accepts_destination_wedding'
    },
    destinationWeddingFeeDifferent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'destination_wedding_fee_different'
    },
    cancellationPolicyUser: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cancellation_policy_user'
    },
    cancellationPolicyVendor: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cancellation_policy_vendor'
    },
    workingStyle: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'working_style'
    },
    longDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'long_description'
    },
    decorPolicy: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'decor_policy'
    },
    acceptsAdvanceBooking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'accepts_advance_booking'
    },
    minAdvanceBookingDays: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 7,
      field: 'min_advance_booking_days'
    },
    weddingsCompleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'weddings_completed'
    },
    happyClientsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'happy_clients_count'
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
      allowNull: false,
      field: 'state_slug'
    },
    citySlug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'city_slug'
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'address'
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
    isBoosted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_boosted'
    },
    boostedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'boosted_until'
    },
    isRecommended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_recommended'
    },
    recommendedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'recommended_at'
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
    averageRating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'average_rating'
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_reviews'
    },
    ratingDistribution: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
      field: 'rating_distribution'
    },
    coverImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'cover_image',
      get() {
        const rawValue = this.getDataValue('coverImage');
        const storageType = this.getDataValue('coverImageStorageType');
        return getFullUrl(rawValue, storageType);
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
    internalNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'internal_notes'
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

export default Portfolio;
