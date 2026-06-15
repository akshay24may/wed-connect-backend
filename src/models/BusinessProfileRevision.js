import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';
import { getFullUrl } from '#utils/storageHelper.js';

class BusinessProfileRevision extends Model {
  static associate(models) {
    this.belongsTo(models.BusinessProfile, {
      foreignKey: 'businessProfileId',
      as: 'businessProfile'
    });

    this.belongsTo(models.User, {
      foreignKey: 'reviewedBy',
      as: 'reviewer'
    });
  }
}

BusinessProfileRevision.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    businessProfileId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      field: 'business_profile_id'
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
      field: 'status'
    },
    businessName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'business_name'
    },
    businessTagline: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'business_tagline'
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'about'
    },
    teamDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'team_description'
    },
    celebrityWeddingsHandled: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'celebrity_weddings_handled'
    },
    certifications: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'certifications'
    },
    awards: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'awards'
    },
    businessHours: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'business_hours'
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
    contactPersonName: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'contact_person_name'
    },
    nameOnId: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'name_on_id'
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
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'rejection_reason'
    },
    reviewedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'reviewed_by'
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reviewed_at'
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
    tableName: 'business_profile_revisions',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeCreate: async (revision, options) => {
        if (options.userId) {
          revision.createdBy = options.userId;
        }
      },
      beforeUpdate: async (revision, options) => {
        if (options.userId) {
          revision.updatedBy = options.userId;
        }
      },
      beforeDestroy: async (revision, options) => {
        if (options.userId) {
          revision.deletedBy = options.userId;
        }
        await revision.save({ hooks: false });
      }
    }
  }
);

export default BusinessProfileRevision;
