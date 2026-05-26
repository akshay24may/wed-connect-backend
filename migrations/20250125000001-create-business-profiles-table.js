export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('business_profiles', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
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
    business_name: {
      type: Sequelize.STRING(200),
      allowNull: false
    },
    business_tagline: {
      type: Sequelize.STRING(500),
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
    business_email: {
      type: Sequelize.STRING(150),
      allowNull: true
    },
    business_phone: {
      type: Sequelize.STRING(15),
      allowNull: true
    },
    contact_person_name: {
      type: Sequelize.STRING(150),
      allowNull: true
    },
    business_pan: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    gstin: {
      type: Sequelize.STRING(15),
      allowNull: true
    },
    business_registration_number: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    business_type: {
      type: Sequelize.ENUM('proprietorship', 'partnership', 'pvt_ltd', 'llp', 'other'),
      allowNull: true
    },
    establishment_year: {
      type: Sequelize.SMALLINT,
      allowNull: true
    },
    name_on_id: {
      type: Sequelize.STRING(150),
      allowNull: true
    },
    aadhar_number: {
      type: Sequelize.STRING(12),
      allowNull: true
    },
    pan_number: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    alternate_mobile_one: {
      type: Sequelize.STRING(15),
      allowNull: true
    },
    alternate_mobile_two: {
      type: Sequelize.STRING(15),
      allowNull: true
    },
    whatsapp_mobile: {
      type: Sequelize.STRING(15),
      allowNull: true
    },
    team_description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    team_size: {
      type: Sequelize.SMALLINT,
      allowNull: true
    },
    years_of_experience: {
      type: Sequelize.SMALLINT,
      allowNull: true
    },
    business_hours: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    certifications: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: []
    },
    awards: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: []
    },
    celebrity_weddings_handled: {
      type: Sequelize.TEXT,
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

  await queryInterface.addIndex('business_profiles', ['user_id'], {
    name: 'idx_business_profiles_user_id'
  });

  await queryInterface.addIndex('business_profiles', ['business_name'], {
    name: 'idx_business_profiles_business_name'
  });

  await queryInterface.addIndex('business_profiles', ['business_pan'], {
    name: 'idx_business_profiles_business_pan'
  });

  await queryInterface.addIndex('business_profiles', ['gstin'], {
    name: 'idx_business_profiles_gstin'
  });

  await queryInterface.addIndex('business_profiles', ['business_phone'], {
    name: 'idx_business_profiles_business_phone'
  });

  await queryInterface.addIndex('business_profiles', ['whatsapp_mobile'], {
    name: 'idx_business_profiles_whatsapp_mobile'
  });

  await queryInterface.addIndex('business_profiles', ['deleted_at'], {
    name: 'idx_business_profiles_deleted_at'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('business_profiles');
}
