import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';

class PortfolioReview extends Model {
  static associate(models) {
    this.belongsTo(models.Portfolio, {
      foreignKey: 'portfolioId',
      as: 'portfolio'
    });

    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'reviewer'
    });

    this.belongsTo(models.User, {
      foreignKey: 'vendorId',
      as: 'vendor'
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
      field: 'rating',
      validate: {
        min: 1,
        max: 5
      }
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
      field: 'review_media'
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
    deletedAt: 'deleted_at'
  }
);

export default PortfolioReview;
