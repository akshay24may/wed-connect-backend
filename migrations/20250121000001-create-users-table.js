export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('users', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    country_code: {
      type: Sequelize.STRING(5),
      allowNull: false,
      defaultValue: '+91'
    },
    mobile: {
      type: Sequelize.STRING(15),
      allowNull: false,
      unique: true
    },
    full_name: {
      type: Sequelize.STRING(150),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(150),
      allowNull: true,
      unique: true
    },
    password_hash: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    dob: {
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    gender: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    about: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    profile_photo: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    avatar_photo: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    photos_storage_type: {
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
    address: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    city_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'cities',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    city_name: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    state_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'states',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    state_name: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    country_name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'India'
    },
    pincode: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_password_reset: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_phone_verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_email_verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_profile_complete: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    phone_verified_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    email_verified_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    last_login_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    kyc_status: {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    max_devices: {
      type: Sequelize.SMALLINT,
      allowNull: false,
      defaultValue: 1
    },
    total_portfolios: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    unread_chat_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    unread_notification_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    referral_code: {
      type: Sequelize.STRING(20),
      allowNull: true,
      unique: true
    },
    referred_by: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    referral_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
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

  await queryInterface.addIndex('users', ['mobile'], {
    name: 'idx_users_mobile'
  });

  await queryInterface.addIndex('users', ['email'], {
    name: 'idx_users_email'
  });

  await queryInterface.addIndex('users', ['role_id'], {
    name: 'idx_users_role_id'
  });

  await queryInterface.addIndex('users', ['city_id'], {
    name: 'idx_users_city_id'
  });

  await queryInterface.addIndex('users', ['state_id'], {
    name: 'idx_users_state_id'
  });

  await queryInterface.addIndex('users', ['is_active'], {
    name: 'idx_users_is_active'
  });

  await queryInterface.addIndex('users', ['deleted_at'], {
    name: 'idx_users_deleted_at'
  });

  await queryInterface.addIndex('users', ['referral_code'], {
    name: 'idx_users_referral_code'
  });

  await queryInterface.addIndex('users', ['referred_by'], {
    name: 'idx_users_referred_by'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('users');
}
