import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';

class UserSubscription extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    this.belongsTo(models.SubscriptionPlan, {
      foreignKey: 'plan_id',
      as: 'plan'
    });

    this.hasMany(models.Portfolio, {
      foreignKey: 'user_subscription_id',
      as: 'portfolios'
    });

    this.belongsTo(models.UserSubscription, {
      foreignKey: 'previous_subscription_id',
      as: 'previousSubscription'
    });

    this.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });

    this.belongsTo(models.User, {
      foreignKey: 'deleted_by',
      as: 'deleter'
    });
  }
}

UserSubscription.init(
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
    planId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'plan_id'
    },
    endsAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'ends_at'
    },
    activatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'activated_at'
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'expired', 'cancelled', 'suspended'),
      allowNull: false,
      defaultValue: 'pending',
      field: 'status'
    },
    isTrial: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_trial'
    },
    trialEndsAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'trial_ends_at'
    },
    autoRenew: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'auto_renew'
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'cancelled_at'
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cancellation_reason'
    },
    renewalReminderSent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'renewal_reminder_sent'
    },
    expiryReminderSent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'expiry_reminder_sent'
    },
    planName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'plan_name'
    },
    planCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'plan_code'
    },
    planVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'plan_version'
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'base_price'
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
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
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'billing_cycle'
    },
    durationDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'duration_days'
    },
    maxPublishedPortfolios: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'max_published_portfolios'
    },
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
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'city_tier'
    },
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
    maxStorageMb: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'max_storage_mb'
    },
    allowVideos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'allow_videos'
    },
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
    isAutoApproveEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_auto_approve_enabled'
    },
    supportLevel: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'standard',
      field: 'support_level'
    },
    storageUsedMb: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'storage_used_mb'
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      field: 'features'
    },
    invoiceId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'invoice_id'
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'payment_method'
    },
    transactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'transaction_id'
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'amount_paid'
    },
    previousSubscriptionId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'previous_subscription_id'
    },
    isUpgrade: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_upgrade'
    },
    isDowngrade: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_downgrade'
    },
    prorationCredit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'proration_credit'
    },
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
    tableName: 'user_subscriptions',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeCreate: async (instance, options) => {
        if (options.userId) {
          instance.createdBy = options.userId;
        }
      },
      beforeUpdate: async (instance, options) => {
        if (options.userId) {
          const currentUpdates = instance.updatedBy || [];
          instance.updatedBy = [
            ...currentUpdates,
            {
              userId: options.userId,
              timestamp: new Date().toISOString()
            }
          ];
        }
      },
      beforeDestroy: async (instance, options) => {
        if (options.userId) {
          instance.deletedBy = options.userId;
          await instance.save({ hooks: false });
        }
      }
    }
  }
);

export default UserSubscription;
