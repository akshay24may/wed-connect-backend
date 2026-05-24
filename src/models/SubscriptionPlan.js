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
    cityTier: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'city_tier',
      comment: 'City tier: 1, 2, or 3'
    },
    // Portfolio Quotas
    maxPublishedPortfolios: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'max_published_portfolios',
      comment: 'Max published portfolios (only published count toward quota)'
    },
    portfoliosQuotaRollingDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'portfolios_quota_rolling_days',
      comment: 'Rolling window period in days for portfolio quota'
    },
    maxStorageMb: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'max_storage_mb',
      comment: 'Maximum storage in MB for all portfolio media (null = unlimited)'
    },
    // Featured & Promotional
    maxFeaturedPortfolios: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'max_featured_portfolios',
      comment: 'Max portfolios that can be marked as featured'
    },
    maxHomepagePortfolios: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'max_homepage_portfolios',
      comment: 'Max portfolios shown on homepage'
    },
    featuredDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'featured_days',
      comment: 'Duration for featured status (0 = unlimited)'
    },
    homepageDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'homepage_days',
      comment: 'Duration for homepage visibility (0 = unlimited)'
    },
    // Visibility & Priority
    priorityScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'priority_score',
      comment: 'Priority score for ranking'
    },
    searchBoostMultiplier: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 1.0,
      field: 'search_boost_multiplier',
      comment: 'Search ranking boost multiplier'
    },
    nationalVisibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'national_visibility',
      comment: 'Show portfolios nationally (not just in selected city)'
    },
    // Portfolio Management
    isAutoApproveEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_auto_approve_enabled',
      comment: 'If true, portfolios under this plan are auto-approved'
    },
    // Republish Settings
    maxRepublishCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'max_republish_count',
      comment: 'Maximum times a portfolio can be republished (0 = unlimited)'
    },
    republishCooldownDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 7,
      field: 'republish_cooldown_days',
      comment: 'Minimum days required between consecutive republishes'
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
