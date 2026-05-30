export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('categories', {
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
    group_slug: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    icon: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    banner_image: {
      type: Sequelize.STRING(500),
      allowNull: true
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
      allowNull: true
    },
    color_code: {
      type: Sequelize.STRING(7),
      allowNull: true
    },
    subtypes: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: []
    },
    display_order: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_featured: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    meta_title: {
      type: Sequelize.STRING(150),
      allowNull: true
    },
    meta_description: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    meta_keywords: {
      type: Sequelize.TEXT,
      allowNull: true
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

  await queryInterface.addIndex('categories', ['slug'], {
    name: 'idx_categories_slug'
  });

  await queryInterface.addIndex('categories', ['is_active'], {
    name: 'idx_categories_is_active'
  });

  await queryInterface.addIndex('categories', ['is_featured'], {
    name: 'idx_categories_is_featured'
  });

  await queryInterface.addIndex('categories', ['display_order'], {
    name: 'idx_categories_display_order'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('categories');
}
