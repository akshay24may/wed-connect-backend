import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const UserSubscription = sequelize.define('UserSubscription', {
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
    // Status & Lifecycle
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
    // Auto-Renewal
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
    // Reminders
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
    // Plan Identification Snapshot
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
    // Pricing Snapshot
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
    // Portfolio Quotas Snapshot
    maxPublishedPortfolios: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'max_published_portfolios',
      comment: 'Snapshot: Max published portfolios'
    },
    portfoliosQuotaRollingDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'portfolios_quota_rolling_days',
      comment: 'Snapshot: Rolling window period in days'
    },
    maxStorageMb: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'max_storage_mb',
      comment: 'Snapshot: Maximum storage in MB for all portfolio media (null = unlimited)'
    },
    // Featured & Promotional Snapshot
    maxFeaturedPortfolios: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'max_featured_portfolios',
      comment: 'Snapshot: Max featured portfolios'
    },
    maxHomepagePortfolios: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'max_homepage_portfolios',
      comment: 'Snapshot: Max homepage portfolios'
    },
    featuredDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'featured_days',
      comment: 'Snapshot: Featured duration'
    },
    homepageDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'homepage_days',
      comment: 'Snapshot: Homepage duration'
    },
    // Visibility & Priority Snapshot
    priorityScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'priority_score',
      comment: 'Snapshot: Priority score'
    },
    searchBoostMultiplier: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 1.0,
      field: 'search_boost_multiplier',
      comment: 'Snapshot: Search boost multiplier'
    },
    nationalVisibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'national_visibility',
      comment: 'Snapshot: National visibility flag'
    },
    // Portfolio Management Snapshot
    isAutoApproveEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_auto_approve_enabled',
      comment: 'Snapshot: auto-approve setting from plan'
    },
    // Republish Settings Snapshot
    maxRepublishCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'max_republish_count',
      comment: 'Snapshot: Maximum times a portfolio can be republished (0 = unlimited)'
    },
    republishCooldownDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 7,
      field: 'republish_cooldown_days',
      comment: 'Snapshot: Minimum days required between consecutive republishes'
    },
    // Support Snapshot
    supportLevel: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'standard',
      field: 'support_level'
    },
    // Features Snapshot
    features: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      field: 'features'
    },
    // Payment Reference
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
    // Upgrade/Downgrade Tracking
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
    // Metadata & Notes
    metadata: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      field: 'metadata'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'notes'
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
  }, {
    sequelize,
    tableName: 'user_subscriptions',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeUpdate: async (subscription, options) => {
        if (options.userId && options.userName) {
          const currentUpdates = subscription.updatedBy || [];
          subscription.updatedBy = [
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
  });

  UserSubscription.associate = (models) => {
    UserSubscription.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    UserSubscription.belongsTo(models.SubscriptionPlan, {
      foreignKey: 'planId',
      as: 'plan'
    });

    // Self-reference for subscription chain
    UserSubscription.belongsTo(models.UserSubscription, {
      foreignKey: 'previousSubscriptionId',
      as: 'previousSubscription'
    });

    // Has many Portfolios (for quota tracking)
    UserSubscription.hasMany(models.Portfolio, {
      foreignKey: 'userSubscriptionId',
      as: 'portfolios'
    });

    // Audit associations
    UserSubscription.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });

    UserSubscription.belongsTo(models.User, {
      foreignKey: 'deletedBy',
      as: 'deleter'
    });
  };

  return UserSubscription;
};
