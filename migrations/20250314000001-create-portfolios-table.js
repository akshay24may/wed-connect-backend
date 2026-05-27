export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("portfolios", {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    business_profile_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: "business_profiles",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    category_slug: {
      type: Sequelize.STRING(100),
      allowNull: false,
      references: {
        model: "categories",
        key: "slug",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    user_subscription_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: "user_subscriptions",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    city_tier: {
      type: Sequelize.STRING(20),
      allowNull: false,
      comment: 'City tier from cities table (tier_1, tier_2, tier_3, tier_4, tier_5)'
    },
    is_free_plan_portfolio: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this portfolio was created using a free plan'
    },
    title: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING(250),
      allowNull: true,
      unique: true,
    },
    share_code: {
      type: Sequelize.STRING(10),
      allowNull: true,
      unique: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    price_range_min: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
    },
    price_range_max: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    },
    price_on_request: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    price_breakdown: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    advance_percentage: {
      type: Sequelize.SMALLINT,
      allowNull: true,
    },
    financial_terms: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    services_offered_tags: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    services_description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    coverage_cities: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    accepts_destination_wedding: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    destination_wedding_fee_different: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    cancellation_policy_user: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },
    cancellation_policy_vendor: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },
    working_style: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    long_description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    decor_policy: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    accepts_advance_booking: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    min_advance_booking_days: {
      type: Sequelize.SMALLINT,
      allowNull: false,
      defaultValue: 7,
    },
    weddings_completed: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    happy_clients_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    state_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "states",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    city_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "cities",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    state_slug: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    city_slug: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    status: {
      type: Sequelize.ENUM(
        "draft",
        "pending",
        "published",
        "rejected"
      ),
      allowNull: false,
      defaultValue: "draft",
    },
    is_featured: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    featured_until: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    is_boosted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    boosted_until: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    is_recommended: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    recommended_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    published_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    approved_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    approved_by: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    rejected_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    rejected_by: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    rejection_reason: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    view_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    contact_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    total_favorites: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    average_rating: {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Average rating (0.00 to 5.00)'
    },
    total_reviews: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Total number of reviews'
    },
    rating_distribution: {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
      comment: 'Rating distribution by star count'
    },
    cover_image: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    cover_image_storage_type: {
      type: Sequelize.ENUM(
        "local",
        "cloudinary",
        "aws_s3",
        "cloudflare_r2",
        "gcs",
        "azure_blob",
        "digital_ocean",
        "backblaze_b2",
        "external",
        "other"
      ),
      allowNull: true,
    },
    is_auto_approved: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    keywords: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    republish_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    last_republished_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    republish_history: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    service_details: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    internal_notes: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Internal admin/staff notes about this portfolio'
    },
    created_by: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    updated_by: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    deleted_by: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  await queryInterface.addIndex("portfolios", ["user_id"], {
    name: "idx_portfolios_user_id",
  });

  await queryInterface.addIndex("portfolios", ["business_profile_id"], {
    name: "idx_portfolios_business_profile_id",
  });

  await queryInterface.addIndex("portfolios", ["category_id"], {
    name: "idx_portfolios_category_id",
  });

  await queryInterface.addIndex("portfolios", ["category_slug"], {
    name: "idx_portfolios_category_slug",
  });

  await queryInterface.addIndex("portfolios", ["state_id", "city_id"], {
    name: "idx_portfolios_state_city",
  });

  await queryInterface.addIndex(
    "portfolios",
    ["user_id", "category_id", "status", "created_at"],
    {
      name: "idx_portfolios_quota_check",
    }
  );

  await queryInterface.addIndex("portfolios", ["user_subscription_id"], {
    name: "idx_portfolios_subscription_id",
  });

  await queryInterface.addIndex("portfolios", ["city_tier"], {
    name: "idx_portfolios_city_tier",
  });

  await queryInterface.addIndex("portfolios", ["is_free_plan_portfolio"], {
    name: "idx_portfolios_is_free_plan",
  });

  await queryInterface.addIndex("portfolios", ["category_id", "city_tier", "status"], {
    name: "idx_portfolios_category_tier_status",
  });

  await queryInterface.addIndex("portfolios", ["last_republished_at"], {
    name: "idx_portfolios_last_republished_at",
  });

  await queryInterface.addIndex("portfolios", ["share_code"], {
    name: "idx_portfolios_share_code",
  });

  await queryInterface.addIndex("portfolios", ["service_details"], {
    name: "idx_portfolios_service_details",
    using: "GIN",
  });

  await queryInterface.addIndex("portfolios", ["status"], {
    name: "idx_portfolios_status",
  });

  await queryInterface.addIndex("portfolios", ["is_featured"], {
    name: "idx_portfolios_is_featured",
  });

  await queryInterface.addIndex("portfolios", ["is_boosted"], {
    name: "idx_portfolios_is_boosted",
  });

  await queryInterface.addIndex("portfolios", ["is_recommended"], {
    name: "idx_portfolios_is_recommended",
  });

  await queryInterface.addIndex("portfolios", ["average_rating"], {
    name: "idx_portfolios_average_rating",
  });

  await queryInterface.addIndex("portfolios", ["total_reviews"], {
    name: "idx_portfolios_total_reviews",
  });

  await queryInterface.addConstraint("portfolios", {
    fields: ["total_favorites"],
    type: "check",
    name: "check_total_favorites_non_negative",
    where: {
      total_favorites: {
        [Sequelize.Op.gte]: 0,
      },
    },
  });

  await queryInterface.addConstraint("portfolios", {
    fields: ["average_rating"],
    type: "check",
    name: "check_average_rating_range",
    where: {
      average_rating: {
        [Sequelize.Op.between]: [0, 5],
      },
    },
  });

  await queryInterface.addConstraint("portfolios", {
    fields: ["total_reviews"],
    type: "check",
    name: "check_total_reviews_non_negative",
    where: {
      total_reviews: {
        [Sequelize.Op.gte]: 0,
      },
    },
  });

}

export async function down(queryInterface) {
  await queryInterface.dropTable("portfolios");
}
