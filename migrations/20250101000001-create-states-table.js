export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('states', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    country_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'countries',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    country_slug: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    slug: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    state_code: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    region_slug: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    region_name: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    display_order: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_popular: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_by: {
      type: Sequelize.BIGINT,
      allowNull: true
    },
    updated_by: {
      type: Sequelize.JSON,
      allowNull: true
    },
    deleted_by: {
      type: Sequelize.BIGINT,
      allowNull: true
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true
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
    }
  });

  await queryInterface.addIndex('states', ['slug'], {
    name: 'idx_states_slug'
  });

  await queryInterface.addIndex('states', ['country_id'], {
    name: 'idx_states_country_id'
  });

  await queryInterface.addIndex('states', ['is_popular', 'is_active'], {
    name: 'idx_states_popular_active'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('states');
}
