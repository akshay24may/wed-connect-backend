export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('portfolio_albums', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    portfolio_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: 'portfolios',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    album_name: {
      type: Sequelize.STRING(200),
      allowNull: false
    },
    album_description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    album_slug: {
      type: Sequelize.STRING(250),
      allowNull: false
    },
    city_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'cities',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    city_slug: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    location_name: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    latitude: {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true
    },
    cover_photo_one: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    cover_photo_two: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    cover_photo_three: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    cover_photos_storage_type: {
      type: Sequelize.ENUM(
        'local',
        'cloudinary',
        'aws_s3',
        'cloudflare_r2',
        'gcs',
        'azure_blob',
        'digital_ocean',
        'backblaze_b2',
        'external',
        'other'
      ),
      allowNull: true
    },
    media_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    display_order: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_featured: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_public: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
      type: Sequelize.BIGINT,
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

  await queryInterface.addIndex('portfolio_albums', ['portfolio_id'], {
    name: 'idx_portfolio_albums_portfolio_id'
  });

  await queryInterface.addIndex('portfolio_albums', ['user_id'], {
    name: 'idx_portfolio_albums_user_id'
  });

  await queryInterface.addIndex('portfolio_albums', ['album_slug'], {
    name: 'idx_portfolio_albums_slug',
    unique: true
  });

  await queryInterface.addIndex('portfolio_albums', ['city_id'], {
    name: 'idx_portfolio_albums_city_id'
  });

  await queryInterface.addIndex('portfolio_albums', ['display_order'], {
    name: 'idx_portfolio_albums_display_order'
  });

  await queryInterface.addIndex('portfolio_albums', ['deleted_at'], {
    name: 'idx_portfolio_albums_deleted_at'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('portfolio_albums');
}
