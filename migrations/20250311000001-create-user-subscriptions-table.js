export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('user_subscriptions', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    plan_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'subscription_plans',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },

    ends_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    activated_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    // Status & Lifecycle
    status: {
      type: Sequelize.ENUM('pending', 'active', 'expired', 'cancelled', 'suspended'),
      allowNull: false,
      defaultValue: 'pending'
    },
    is_trial: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    trial_ends_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    // Auto-Renewal
    auto_renew: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    cancelled_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    cancellation_reason: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    // Reminders
    renewal_reminder_sent: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    expiry_reminder_sent: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    // Plan Identification Snapshot
    plan_name: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    plan_code: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    plan_version: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    // Pricing Snapshot
    base_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    discount_amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    final_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: Sequelize.STRING(3),
      allowNull: false,
      defaultValue: 'INR'
    },
    billing_cycle: {
      type: Sequelize.STRING(20),
      allowNull: true
    },
    duration_days: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    // Portfolio Quotas Snapshot
    max_published_portfolios: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Snapshot: Max published portfolios'
    },
    // Category Snapshot
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: 'Snapshot: Category ID'
    },
    category_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: 'Snapshot: Category name'
    },
    category_slug: {
      type: Sequelize.STRING(100),
      allowNull: false,
      comment: 'Snapshot: Category slug'
    },
    city_tier: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: 'Snapshot: City tier (1, 2, 3, 4, 5)'
    },
    // Album & Media Quotas Snapshot
    max_albums_per_portfolio: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Snapshot: Max albums per portfolio'
    },
    max_photos_per_album: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Snapshot: Max photos per album'
    },
    max_videos_per_album: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Snapshot: Max videos per album'
    },
    max_storage_mb: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Snapshot: Max storage in MB (NULL = unlimited)'
    },
    allow_videos: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Snapshot: Videos allowed'
    },
    // Boost Features Snapshot
    is_featured_allowed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Snapshot: Featured allowed'
    },
    featured_days: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Snapshot: Featured duration days'
    },
    is_boosted_allowed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Snapshot: Boosted allowed'
    },
    boosted_days: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Snapshot: Boosted duration days'
    },
    can_be_recommended: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Snapshot: Can be platform recommended'
    },
    // Visibility Snapshot
    priority_score: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Snapshot: Priority score'
    },
    search_boost_multiplier: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 1.0,
      comment: 'Snapshot: Search boost multiplier'
    },
    national_visibility: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Snapshot: National visibility'
    },
    // Republish Snapshot
    max_republish_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Snapshot: Max republish count (0 = unlimited)'
    },
    republish_cooldown_days: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 7,
      comment: 'Snapshot: Republish cooldown days'
    },
    // Management Snapshot
    is_auto_approve_enabled: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Snapshot: Auto-approve enabled'
    },
    support_level: {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'standard',
      comment: 'Snapshot: Support level'
    },
    // Usage Tracking
    storage_used_mb: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Current storage usage in MB'
    },
    // Features Snapshot (includes all other plan settings)
    features: {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {}
    },
    // Payment Reference
    invoice_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'invoices',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    payment_method: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    transaction_id: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    amount_paid: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    // Upgrade/Downgrade Tracking
    previous_subscription_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'user_subscriptions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    is_upgrade: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_downgrade: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    proration_credit: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    // Metadata & Notes
    metadata: {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {}
    },
    internal_notes: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Internal admin/staff notes about this subscription'
    },
    // Audit Fields
    created_by: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    updated_by: {
      type: Sequelize.JSON,
      allowNull: true
    },
    deleted_by: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true
    }
  });

  // Create indexes
  await queryInterface.addIndex('user_subscriptions', ['user_id'], {
    name: 'idx_user_subscriptions_user_id'
  });

  await queryInterface.addIndex('user_subscriptions', ['plan_id'], {
    name: 'idx_user_subscriptions_plan_id'
  });

  await queryInterface.addIndex('user_subscriptions', ['status'], {
    name: 'idx_user_subscriptions_status'
  });

  await queryInterface.addIndex('user_subscriptions', ['ends_at'], {
    name: 'idx_user_subscriptions_ends_at'
  });

  await queryInterface.addIndex('user_subscriptions', ['deleted_at'], {
    name: 'idx_user_subscriptions_deleted_at'
  });

  // Composite index for common query (get user's active subscription)
  await queryInterface.addIndex('user_subscriptions', ['user_id', 'status'], {
    name: 'idx_user_subscriptions_user_status'
  });

  // Index for category-based queries
  await queryInterface.addIndex('user_subscriptions', ['category_id'], {
    name: 'idx_user_subscriptions_category_id'
  });

  // Composite index for user + category + status queries
  await queryInterface.addIndex('user_subscriptions', ['user_id', 'category_id', 'status'], {
    name: 'idx_user_subscriptions_user_category_status'
  });

  // Unique constraint: Only one active subscription per user per category
  await queryInterface.addIndex('user_subscriptions', ['user_id', 'category_id'], {
    name: 'unique_user_category_active_subscription',
    unique: true,
    where: {
      status: 'active',
      deleted_at: null
    }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('user_subscriptions');
}
