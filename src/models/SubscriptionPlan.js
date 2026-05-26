import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';

class SubscriptionPlan extends Model {
  static associate(models) {
    // Self-referencing for plan replacement
    this.belongsTo(models.SubscriptionPlan, {
      foreignKey: 'replacedByPlanId',
      as: 'replacementPlan'
    });

    // Category association
    this.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });

    // Audit associations
    this.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });

    this.belongsTo(models.User, {
      foreignKey: 'deletedBy',
      as: 'deleter'
    });
  }
}

SubscriptionPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    planCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'plan_code'
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'version'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'name'
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'slug'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    shortDescription: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'short_description'
    },
    // Pricing
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'base_price'
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'discount_amount'
    },
    finalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'final_price'
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'INR',
      field: 'currency'
    },
    billingCycle: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'one_time'),
      allowNull: true,
      field: 'billing_cycle'
    },
    durationDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'duration_days'
    },
    // Display & Marketing
    tagline: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'tagline'
    },
    showOriginalPrice: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'show_original_price'
    },
    showOfferBadge: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'show_offer_badge'
    },
    offerBadgeText: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'offer_badge_text'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order'
    },
    // Category & Location Restrictions
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'category_id'
    },
    categoryName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'category_name'
    },
    categorySlug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'category_slug'
    },
    cityTier: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'city_tier',
      comment: 'City tier: 1, 2, 3, 4, 5'
    },
    // Portfolio Quotas
    maxPublishedPortfolios: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'max_published_portfolios'
    },
    maxStorageMb: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'max_storage_mb'
    },
    // Album & Media Quotas
    maxAlbumsPerPortfolio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'max_albums_per_portfolio'
    },
    maxPhotosPerAlbum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'max_photos_per_album'
    },
    maxVideosPerAlbum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'max_videos_per_album'
    },
    allowVideos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'allow_videos'
    },
    // Featured & Promotional
    isFeaturedAllowed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_featured_allowed'
    },
    featuredDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'featured_days'
    },
    isBoostedAllowed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_boosted_allowed'
    },
    boostedDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'boosted_days'
    },
    canBeRecommended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'can_be_recommended'
    },
    // Visibility & Priority
    priorityScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'priority_score'
    },
    searchBoostMultiplier: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 1.0,
      field: 'search_boost_multiplier'
    },
    nationalVisibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'national_visibility'
    },
    // Portfolio Management
    isAutoApproveEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_auto_approve_enabled'
    },
    // Republish Settings
    maxRepublishCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'max_republish_count'
    },
    republishCooldownDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 7,
      field: 'republish_cooldown_days'
    },
    // Support
    supportLevel: {
      type: DataTypes.ENUM('none', 'standard', 'priority', 'dedicated'),
      allowNull: false,
      defaultValue: 'standard',
      field: 'support_level'
    },
    // Features JSONB
    features: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      field: 'features'
    },
    // Metadata
    metadata: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      field: 'metadata'
    },
    internalNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'internal_notes'
    },
    termsAndConditions: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'terms_and_conditions'
    },
    // Status & Visibility
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_public'
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_default'
    },
    // Versioning
    deprecatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deprecated_at'
    },
    replacedByPlanId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'replaced_by_plan_id'
    },
    // Audit Fields
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'created_by'
    },
    updatedBy: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'updated_by'
    },
    deletedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'deleted_by'
    }
  },
  {
    sequelize,
    tableName: 'subscription_plans',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeUpdate: async (plan, options) => {
        if (options.userId && options.userName) {
          const currentUpdates = plan.updatedBy || [];
          plan.updatedBy = [
            ...currentUpdates,
            {
              userId: options.userId,
              userName: options.userName,
              timestamp: new Date().toISOString()
            }
          ];
        }
      }
    }
  }
);

export default SubscriptionPlan;
