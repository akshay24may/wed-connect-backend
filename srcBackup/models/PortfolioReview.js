import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';
import { getFullUrl } from '#utils/storageHelper.js';

class PortfolioReview extends Model {
  static associate(models) {
    this.belongsTo(models.Portfolio, {
      foreignKey: 'portfolioId',
      as: 'portfolio'
    });

    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    this.belongsTo(models.User, {
      foreignKey: 'vendorId',
      as: 'vendor'
    });

    this.belongsTo(models.User, {
      foreignKey: 'rejectedBy',
      as: 'rejecter'
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

PortfolioReview.init(
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
      field: 'portfolio_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'user_id'
    },
    vendorId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'vendor_id'
    },
    rating: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      field: 'rating'
    },
    reviewText: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'review_text'
    },
    reviewTitle: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'review_title'
    },
    reviewMedia: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: 'review_media',
      get() {
        const rawMedia = this.getDataValue('reviewMedia');
        const storageType = this.getDataValue('reviewMediaStorageType');
        
        if (!rawMedia || !Array.isArray(rawMedia)) return [];
        
        return rawMedia.map(item => ({
          ...item,
          url: getFullUrl(item.url, storageType)
        }));
      }
    },
    reviewMediaStorageType: {
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
      field: 'review_media_storage_type'
    },
    recommendedFor: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: 'recommended_for'
    },
    vendorResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'vendor_response'
    },
    vendorRespondedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'vendor_responded_at'
    },
    helpfulCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'helpful_count'
    },
    notHelpfulCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'not_helpful_count'
    },
    isVerifiedPurchase: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_verified_purchase'
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_approved'
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_featured'
    },
    rejectedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'rejected_by'
    },
    rejectedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'rejected_at'
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'rejection_reason'
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
    tableName: 'portfolio_reviews',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeCreate: async (review, options) => {
        if (options.userId) {
          review.createdBy = options.userId;
        }
      },
      beforeUpdate: async (review, options) => {
        if (options.userId) {
          review.updatedBy = options.userId;
        }
      },
      beforeDestroy: async (review, options) => {
        if (options.userId) {
          review.deletedBy = options.userId;
        }
        await review.save({ hooks: false });
      }
    }
  }
);

export default PortfolioReview;
