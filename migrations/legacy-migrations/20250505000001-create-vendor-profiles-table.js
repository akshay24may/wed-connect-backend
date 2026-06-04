export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('vendor_profiles', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      unique: true,
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
      allowNull: true,
      unique: true
    },
    alternate_mobile_two: {
      type: Sequelize.STRING(15),
      allowNull: true,
      unique: true
    },
    whatsapp_mobile: {
      type: Sequelize.STRING(15),
      allowNull: true,
      unique: true
    },
    business_logo: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    business_banner: {
      type: Sequelize.TEXT,
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
    years_of_experience: {
      type: Sequelize.SMALLINT,
      allowNull: true
    },
    team_size: {
      type: Sequelize.SMALLINT,
      allowNull: true
    },
    portfolio_tagline: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    specializations: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: []
    },
    service_areas: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: []
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
    business_email: {
      type: Sequelize.STRING(150),
      allowNull: true
    },
    business_phone: {
      type: Sequelize.STRING(15),
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
    business_hours: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    accepts_advance_booking: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    min_advance_booking_days: {
      type: Sequelize.SMALLINT,
      allowNull: false,
      defaultValue: 7
    },
    cancellation_policy: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    is_verified_vendor: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    verified_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    verification_badge_type: {
      type: Sequelize.ENUM('basic', 'premium', 'elite'),
      allowNull: true
    },
    trust_score: {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.00
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

  await queryInterface.addIndex('vendor_profiles', ['user_id'], {
    name: 'idx_vendor_profiles_user_id',
    unique: true
  });

  await queryInterface.addIndex('vendor_profiles', ['alternate_mobile_one'], {
    name: 'idx_vendor_profiles_alternate_mobile_one'
  });

  await queryInterface.addIndex('vendor_profiles', ['alternate_mobile_two'], {
    name: 'idx_vendor_profiles_alternate_mobile_two'
  });

  await queryInterface.addIndex('vendor_profiles', ['whatsapp_mobile'], {
    name: 'idx_vendor_profiles_whatsapp_mobile'
  });

  await queryInterface.addIndex('vendor_profiles', ['is_verified_vendor'], {
    name: 'idx_vendor_profiles_is_verified_vendor'
  });

  await queryInterface.addIndex('vendor_profiles', ['business_name'], {
    name: 'idx_vendor_profiles_business_name'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('vendor_profiles');
}
