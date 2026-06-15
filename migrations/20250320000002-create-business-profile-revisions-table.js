export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('business_profile_revisions', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    business_profile_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      unique: true,
      references: {
        model: 'business_profiles',
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
    business_name: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    business_tagline: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    about: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    team_description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    celebrity_weddings_handled: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    certifications: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    awards: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    business_hours: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    website_url: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    facebook_url: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    instagram_url: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    youtube_url: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    linkedin_url: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    contact_person_name: {
      type: Sequelize.STRING(150),
      allowNull: true
    },
    name_on_id: {
      type: Sequelize.STRING(150),
      allowNull: true
    },
    business_logo: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    business_banner: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    business_media_storage_type: {
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

  await queryInterface.addIndex('business_profile_revisions', ['business_profile_id'], {
    name: 'idx_bpr_business_profile_id',
    unique: true
  });

  await queryInterface.addIndex('business_profile_revisions', ['status'], {
    name: 'idx_bpr_status'
  });

  await queryInterface.addIndex('business_profile_revisions', ['reviewed_by'], {
    name: 'idx_bpr_reviewed_by'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('business_profile_revisions');
}
