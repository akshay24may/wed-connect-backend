import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';
import { getFullUrl } from '#utils/storageHelper.js';

class BusinessProfile extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    this.hasOne(models.Portfolio, {
      foreignKey: 'businessProfileId',
      as: 'portfolio'
    });

    this.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });

    this.belongsTo(models.User, {
      foreignKey: 'deletedBy',
      as: 'deleter'
    });
  }
}

BusinessProfile.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'user_id'
    },
    businessName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'business_name'
    },
    businessTagline: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'business_tagline'
    },
    businessLogo: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'business_logo',
      get() {
        const rawValue = this.getDataValue('businessLogo');
        const storageType = this.getDataValue('businessMediaStorageType');
        return getFullUrl(rawValue, storageType);
      }
    },
    businessBanner: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'business_banner',
      get() {
        const rawValue = this.getDataValue('businessBanner');
        const storageType = this.getDataValue('businessMediaStorageType');
        return getFullUrl(rawValue, storageType);
      }
    },
    businessMediaStorageType: {
      type: DataTypes.ENUM(
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
      allowNull: true,
      field: 'business_media_storage_type'
    },
    businessEmail: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'business_email'
    },
    businessPhone: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'business_phone'
    },
    contactPersonName: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'contact_person_name'
    },
    businessPan: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'business_pan'
    },
    gstin: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'gstin'
    },
    businessRegistrationNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'business_registration_number'
    },
    businessType: {
      type: DataTypes.ENUM('proprietorship', 'partnership', 'pvt_ltd', 'llp', 'other'),
      allowNull: true,
      field: 'business_type'
    },
    establishmentYear: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      field: 'establishment_year'
    },
    nameOnId: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'name_on_id'
    },
    aadharNumber: {
      type: DataTypes.STRING(12),
      allowNull: true,
      field: 'aadhar_number'
    },
    panNumber: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'pan_number'
    },
    alternateMobileOne: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'alternate_mobile_one'
    },
    alternateMobileTwo: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'alternate_mobile_two'
    },
    whatsappMobile: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'whatsapp_mobile'
    },
    teamDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'team_description'
    },
    teamSize: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      field: 'team_size'
    },
    yearsOfExperience: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      field: 'years_of_experience'
    },
    businessHours: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'business_hours'
    },
    certifications: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: 'certifications'
    },
    awards: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: 'awards'
    },
    celebrityWeddingsHandled: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'celebrity_weddings_handled'
    },
    websiteUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'website_url'
    },
    facebookUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'facebook_url'
    },
    instagramUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'instagram_url'
    },
    youtubeUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'youtube_url'
    },
    linkedinUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'linkedin_url'
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'created_by'
    },
    updatedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'updated_by'
    },
    deletedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'deleted_by'
    }
  },
  {
    sequelize,
    tableName: 'business_profiles',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeCreate: async (instance, options) => {
        if (options.userId) {
          instance.createdBy = options.userId;
        }
      },
      beforeUpdate: async (instance, options) => {
        if (options.userId) {
          instance.updatedBy = options.userId;
        }
      },
      beforeDestroy: async (instance, options) => {
        if (options.userId) {
          instance.deletedBy = options.userId;
        }
        await instance.save({ hooks: false });
      }
    }
  }
);

export default BusinessProfile;
