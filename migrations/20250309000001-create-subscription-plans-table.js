export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('subscription_plans', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    plan_code: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    },
    version: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    slug: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    short_description: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    // Pricing
    base_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    discount_amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
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
      type: Sequelize.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'one_time'),
      allowNull: true
    },
    duration_days: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    // Display & Marketing
    tagline: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    show_original_price: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    show_offer_badge: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    offer_badge_text: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    sort_order: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // Category & Location Restrictions
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    category_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    city_tier: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: 'City tier: 1, 2, 3, 4, 5'
    },
    // Portfolio Quotas
    max_published_portfolios: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Max published portfolios (only published count toward quota)'
    },
    portfolios_quota_rolling_days: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Rolling window period in days for portfolio quota'
    },
    max_storage_mb: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Maximum storage in MB for all portfolio media (null = unlimited)'
    },
    // Featured & Promotional
    max_featured_portfolios: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Max portfolios that can be marked as featured'
    },
    max_homepage_portfolios: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Max portfolios shown on homepage'
    },
    featured_days: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Duration for featured status (0 = unlimited)'
    },
    homepage_days: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Duration for homepage visibility (0 = unlimited)'
    },
    // Visibility & Priority
    priority_score: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Priority score for ranking'
    },
    search_boost_multiplier: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 1.0,
      comment: 'Search ranking boost multiplier'
    },
    national_visibility: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Show portfolios nationally (not just in selected city)'
    },
    // Portfolio Management
    is_auto_approve_enabled: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'If true, portfolios under this plan are auto-approved'
    },
    // Republish Settings
    max_republish_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Maximum times a portfolio can be republished (0 = unlimited)'
    },
    republish_cooldown_days: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 7,
      comment: 'Minimum days required between consecutive republishes'
    },
    // Support
    support_level: {
      type: Sequelize.ENUM('none', 'standard', 'priority', 'dedicated'),
      allowNull: false,
      defaultValue: 'standard'
    },
    // Features JSONB
    features: {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {}
    },
    // Metadata
    metadata: {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {}
    },
    internal_notes: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    terms_and_conditions: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    // Status & Visibility
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_public: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_default: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    // Versioning
    deprecated_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    replaced_by_plan_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'subscription_plans',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
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
  await queryInterface.addIndex('subscription_plans', ['plan_code'], {
    name: 'idx_subscription_plans_plan_code',
    unique: true
  });

  await queryInterface.addIndex('subscription_plans', ['slug'], {
    name: 'idx_subscription_plans_slug',
    unique: true
  });

  await queryInterface.addIndex('subscription_plans', ['is_active'], {
    name: 'idx_subscription_plans_is_active'
  });

  await queryInterface.addIndex('subscription_plans', ['is_public'], {
    name: 'idx_subscription_plans_is_public'
  });

  await queryInterface.addIndex('subscription_plans', ['is_default'], {
    name: 'idx_subscription_plans_is_default'
  });

  await queryInterface.addIndex('subscription_plans', ['deleted_at'], {
    name: 'idx_subscription_plans_deleted_at'
  });

  await queryInterface.addIndex('subscription_plans', ['category_id'], {
    name: 'idx_subscription_plans_category_id'
  });

  await queryInterface.addIndex('subscription_plans', ['city_tier'], {
    name: 'idx_subscription_plans_city_tier'
  });

  await queryInterface.addIndex('subscription_plans', ['category_id', 'city_tier'], {
    name: 'idx_subscription_plans_category_tier',
    unique: true,
    where: {
      deleted_at: null
    }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('subscription_plans');
}
