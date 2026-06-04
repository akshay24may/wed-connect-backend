export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('media', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    entity_type: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    entity_id: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    sub_entity_type: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    sub_entity_id: {
      type: Sequelize.BIGINT,
      allowNull: true
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

  await queryInterface.addIndex('media', ['entity_type', 'entity_id'], {
    name: 'idx_media_entity'
  });

  await queryInterface.addIndex('media', ['entity_type', 'entity_id', 'sub_entity_type', 'sub_entity_id'], {
    name: 'idx_media_entity_sub_entity'
  });

  await queryInterface.addIndex('media', ['user_id'], {
    name: 'idx_media_user_id'
  });

  await queryInterface.addIndex('media', ['media_type'], {
    name: 'idx_media_media_type'
  });

  await queryInterface.addIndex('media', ['entity_type', 'entity_id', 'is_primary'], {
    name: 'idx_media_is_primary'
  });

  await queryInterface.addIndex('media', ['entity_type', 'entity_id', 'display_order'], {
    name: 'idx_media_display_order'
  });

  await queryInterface.addIndex('media', ['deleted_at'], {
    name: 'idx_media_deleted_at'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('media');
}
