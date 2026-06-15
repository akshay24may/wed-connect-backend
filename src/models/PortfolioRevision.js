import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';
import { getFullUrl } from '#utils/storageHelper.js';

class PortfolioRevision extends Model {
  static associate(models) {
    this.belongsTo(models.Portfolio, {
      foreignKey: 'portfolioId',
      as: 'portfolio'
    });

    this.belongsTo(models.User, {
      foreignKey: 'reviewedBy',
      as: 'reviewer'
    });

    this.hasMany(models.Media, {
      foreignKey: 'portfolioRevisionId',
      as: 'pendingMedia'
    });
  }
}

PortfolioRevision.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    portfolioId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      field: 'portfolio_id'
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
      field: 'status'
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'title'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    longDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'long_description'
    },
    servicesDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'services_description'
    },
    workingStyle: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'working_style'
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'address'
    },
    highlights: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'highlights'
    },
    servicesOfferedTags: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'services_offered_tags'
    },
    coverageCities: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'coverage_cities'
    },
    financialTerms: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'financial_terms'
    },
    priceBreakdown: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'price_breakdown'
    },
    serviceDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'service_details'
    },
    cancellationPolicyUser: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cancellation_policy_user'
    },
    cancellationPolicyVendor: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cancellation_policy_vendor'
    },
    coverImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'cover_image',
      get() {
        const rawValue = this.getDataValue('coverImage');
        const storageType = this.getDataValue('coverImageStorageType');
        return getFullUrl(rawValue, storageType);
      }
    },
    coverImageStorageType: {
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
      field: 'cover_image_storage_type'
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
    tableName: 'portfolio_revisions',
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

export default PortfolioRevision;
