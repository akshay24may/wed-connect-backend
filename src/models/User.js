import { Model, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "#config/database.js";
import { getFullUrl } from "#utils/storageHelper.js";

class User extends Model {
  static associate(models) {
    this.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role",
    });

    this.belongsTo(models.State, {
      foreignKey: "stateId",
      as: "state",
    });

    this.belongsTo(models.City, {
      foreignKey: "cityId",
      as: "city",
    });

    this.hasMany(models.UserSession, {
      foreignKey: "user_id",
      as: "sessions",
    });

    // Phase 1: Disabled associations
    // this.hasMany(models.UserSocialAccount, {
    //   foreignKey: "user_id",
    //   as: "socialAccounts",
    // });

    // this.hasMany(models.UserNotification, {
    //   foreignKey: "user_id",
    //   as: "notifications",
    // });

    // this.hasOne(models.UserNotificationPreference, {
    //   foreignKey: "user_id",
    //   as: "notificationPreferences",
    // });

    this.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "creator",
    });

    this.belongsTo(models.User, {
      foreignKey: "deletedBy",
      as: "deleter",
    });

    this.belongsTo(models.User, {
      foreignKey: "referredBy",
      as: "referrer",
    });

    this.hasMany(models.User, {
      foreignKey: "referredBy",
      as: "referrals",
    });

    this.hasMany(models.BusinessProfile, {
      foreignKey: "userId",
      as: "businessProfiles",
    });
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
  }
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "full_name",
    },
    countryCode: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "+91",
      field: "country_code",
    },
    mobile: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      field: "mobile",
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      unique: true,
      field: "email",
    },
    passwordHash: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "password_hash",
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "role_id",
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "dob",
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "gender",
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "about",
    },
    profilePhoto: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "profile_photo",
      get() {
        const rawValue = this.getDataValue("profilePhoto");
        const storageType = this.getDataValue("photosStorageType");
        return getFullUrl(rawValue, storageType);
      },
    },
    avatarPhoto: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "avatar_photo",
      get() {
        const rawValue = this.getDataValue("avatarPhoto");
        const storageType = this.getDataValue("photosStorageType");
        return getFullUrl(rawValue, storageType);
      },
    },
    photosStorageType: {
      type: DataTypes.ENUM(
        "local",
        "cloudinary",
        "aws_s3",
        "cloudflare_r2",
        "gcs",
        "azure_blob",
        "digital_ocean",
        "backblaze_b2",
        "external",
        "other"
      ),
      allowNull: true,
      field: "photos_storage_type",
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "address",
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "city_id",
    },
    cityName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "city_name",
    },
    stateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "state_id",
    },
    stateName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "state_name",
    },
    countryName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "India",
      field: "country_name",
    },
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "pincode",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
    isPasswordReset: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_password_reset",
    },
    isPhoneVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_phone_verified",
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_email_verified",
    },
    isProfileComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_profile_complete",
    },
    phoneVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "phone_verified_at",
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "email_verified_at",
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_login_at",
    },
    kycStatus: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
      field: "kyc_status",
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_verified",
    },
    maxDevices: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1,
      field: "max_devices",
    },
    totalPortfolios: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "total_portfolios",
    },
    unreadChatCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "unread_chat_count",
    },
    unreadNotificationCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "unread_notification_count",
    },
    referralCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      field: "referral_code",
    },
    referredBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "referred_by",
    },
    referralCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "referral_count",
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_verified",
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "verified_at",
    },
    verificationBadgeType: {
      type: DataTypes.ENUM('basic', 'premium', 'elite'),
      allowNull: true,
      field: "verification_badge_type",
    },
    trustScore: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: "trust_score",
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "created_by",
    },
    deletedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "deleted_by",
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeDestroy: async (user, options) => {
        user.isActive = false;
        if (options.userId) {
          user.deletedBy = options.userId;
        }
        await user.save({ hooks: false });
      },
    },
  }
);

export default User;
