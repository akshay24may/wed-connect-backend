export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('portfolio_media', {
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
    media_type: {
      type: Sequelize.ENUM('image', 'video'),
      allowNull: false,
      defaultValue: 'image'
    },
    media_url: {
      type: Sequelize.STRING(500),
      allowNull: false
    },
    thumbnail_url: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    mime_type: {
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: 'image/jpeg'
    },
    thumbnail_mime_type: {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: 'image/jpeg'
    },
    file_size_bytes: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    width: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    height: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    duration_seconds: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    display_order: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_primary: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    storage_type: {
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
      allowNull: false,
      defaultValue: 'local'
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

  await queryInterface.addIndex('portfolio_media', ['portfolio_id'], {
    name: 'idx_portfolio_media_portfolio_id'
  });

  await queryInterface.addIndex('portfolio_media', ['media_type'], {
    name: 'idx_portfolio_media_media_type'
  });

  await queryInterface.addIndex('portfolio_media', ['portfolio_id', 'is_primary'], {
    name: 'idx_portfolio_media_is_primary'
  });

  await queryInterface.addIndex('portfolio_media', ['portfolio_id', 'display_order'], {
    name: 'idx_portfolio_media_display_order'
  });

  await queryInterface.addIndex('portfolio_media', ['deleted_at'], {
    name: 'idx_portfolio_media_deleted_at'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('portfolio_media');
}
