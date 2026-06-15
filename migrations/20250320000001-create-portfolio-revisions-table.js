export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('portfolio_revisions', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    portfolio_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      unique: true,
      references: {
        model: 'portfolios',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    status: {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    title: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    long_description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    services_description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    working_style: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    highlights: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    services_offered_tags: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    coverage_cities: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    financial_terms: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    price_breakdown: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    service_details: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    cancellation_policy_user: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    cancellation_policy_vendor: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    cover_image: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    cover_image_storage_type: {
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
    rejection_reason: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    reviewed_by: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    reviewed_at: {
      type: Sequelize.DATE,
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

  await queryInterface.addIndex('portfolio_revisions', ['portfolio_id'], {
    name: 'idx_portfolio_revisions_portfolio_id',
    unique: true
  });

  await queryInterface.addIndex('portfolio_revisions', ['status'], {
    name: 'idx_portfolio_revisions_status'
  });

  await queryInterface.addIndex('portfolio_revisions', ['reviewed_by'], {
    name: 'idx_portfolio_revisions_reviewed_by'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('portfolio_revisions');
}
