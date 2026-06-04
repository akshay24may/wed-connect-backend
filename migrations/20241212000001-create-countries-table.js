export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('countries', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    slug: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    iso_code: {
      type: Sequelize.STRING(2),
      allowNull: false,
      unique: true
    },
    iso_code_3: {
      type: Sequelize.STRING(3),
      allowNull: false,
      unique: true
    },
    phone_code: {
      type: Sequelize.STRING(10),
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

  await queryInterface.addIndex('countries', ['slug'], {
    name: 'idx_countries_slug'
  });

  await queryInterface.addIndex('countries', ['iso_code'], {
    name: 'idx_countries_iso_code'
  });

  await queryInterface.addIndex('countries', ['is_active'], {
    name: 'idx_countries_is_active'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('countries');
}
