export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("cities", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    },
    state_slug: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    state_code: {
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    district_code: {
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    headquarters: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    population: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    area: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    density: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    latitude: {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
    },
    city_tier: {
      type: Sequelize.ENUM('tier_1', 'tier_2', 'tier_3', 'tier_4', 'tier_5'),
      allowNull: false,
      defaultValue: 'tier_3'
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    display_order: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_popular: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
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
      allowNull: true,
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
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
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
  });

  await queryInterface.addIndex("cities", ["slug"], {
    name: "idx_cities_slug",
  });

  await queryInterface.addIndex("cities", ["state_id"], {
    name: "idx_cities_state_id",
  });

  await queryInterface.addIndex("cities", ["state_id", "is_active"], {
    name: "idx_cities_state_active",
  });

  await queryInterface.addIndex("cities", ["is_popular", "is_active"], {
    name: "idx_cities_popular_active"
  });

  await queryInterface.addIndex("cities", ["state_id", "is_popular", "is_active"], {
    name: "idx_cities_state_popular_active"
  });

  await queryInterface.addIndex("cities", ["city_tier"], {
    name: "idx_cities_tier"
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("cities");
}
