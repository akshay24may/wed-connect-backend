import { DataTypes } from 'sequelize';
import sequelize from '#config/database.js';

const PortfolioOffer = sequelize.define(
  'PortfolioOffer',
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
    chatRoomId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'chat_room_id'
    },
    consumerId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'consumer_id'
    },
    vendorId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'vendor_id'
    },
    offeredAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'offered_amount'
    },
    portfolioPriceAtTime: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'portfolio_price_at_time'
    },
    discountPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'discount_percentage'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'notes'
    },
    parentOfferId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'parent_offer_id'
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'withdrawn', 'expired'),
      allowNull: false,
      defaultValue: 'pending',
      field: 'status'
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expires_at'
    },
    viewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'viewed_at'
    },
    respondedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'responded_at'
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'rejection_reason'
    },
    autoRejected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'auto_rejected'
    }
  },
  {
    sequelize,
    tableName: 'portfolio_offers',
    timestamps: true,
    underscored: true,
    paranoid: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (offer, options) => {
        if (offer.offeredAmount && offer.portfolioPriceAtTime) {
          const discount = ((offer.portfolioPriceAtTime - offer.offeredAmount) / offer.portfolioPriceAtTime) * 100;
          offer.discountPercentage = Math.round(discount * 100) / 100;
        }
      }
    }
  }
);

PortfolioOffer.associate = (models) => {
  PortfolioOffer.belongsTo(models.Portfolio, {
    foreignKey: 'portfolio_id',
    as: 'portfolio'
  });

  PortfolioOffer.belongsTo(models.ChatRoom, {
    foreignKey: 'chat_room_id',
    as: 'chatRoom'
  });

  PortfolioOffer.belongsTo(models.User, {
    foreignKey: 'consumer_id',
    as: 'consumer'
  });

  PortfolioOffer.belongsTo(models.User, {
    foreignKey: 'vendor_id',
    as: 'vendor'
  });

  PortfolioOffer.belongsTo(models.PortfolioOffer, {
    foreignKey: 'parent_offer_id',
    as: 'parentOffer'
  });

  PortfolioOffer.hasMany(models.PortfolioOffer, {
    foreignKey: 'parent_offer_id',
    as: 'counterOffers'
  });
};

export default PortfolioOffer;
