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
    starting_price: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    },
    price_range_min: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
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
    locality: {
      type: Sequelize.STRING(200),
      allowNull: true,
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
}

export async function down(queryInterface) {
  await queryInterface.dropTable("portfolios");
}
