import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';

class ChatRoom extends Model {
  static associate(models) {
    this.belongsTo(models.Portfolio, {
      foreignKey: 'portfolioId',
      as: 'portfolio'
    });

    this.belongsTo(models.User, {
      foreignKey: 'consumerId',
      as: 'consumer'
    });

    this.belongsTo(models.User, {
      foreignKey: 'vendorId',
      as: 'vendor'
    });

    this.hasMany(models.ChatMessage, {
      foreignKey: 'chatRoomId',
      as: 'messages'
    });

    this.hasMany(models.PortfolioOffer, {
      foreignKey: 'chatRoomId',
      as: 'portfolioOffers'
    });

    this.hasMany(models.PortfolioInquiry, {
      foreignKey: 'chatRoomId',
      as: 'inquiries'
    });

    this.hasMany(models.ListingOffer, {
      foreignKey: 'chatRoomId',
      as: 'offers'
    });
  }
}

ChatRoom.init(
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
    consumerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'consumer_id'
    },
    vendorId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'vendor_id'
    },
    consumerSnapshot: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'consumer_snapshot'
    },
    vendorSnapshot: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'vendor_snapshot'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_message_at'
    },
    unreadCountConsumer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'unread_count_consumer'
    },
    unreadCountVendor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'unread_count_vendor'
    },
    isImportantConsumer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_important_consumer'
    },
    isImportantVendor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_important_vendor'
    },
    consumerSubscriptionTier: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'consumer_subscription_tier'
    },
    vendorSubscriptionTier: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'vendor_subscription_tier'
    },
    consumerRequestedContact: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'consumer_requested_contact'
    },
    vendorSharedContact: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'vendor_shared_contact'
    },
    blockedByConsumer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'blocked_by_consumer'
    },
    blockedByVendor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'blocked_by_vendor'
    },
    blockMetadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'block_metadata'
    },
    reportedByConsumer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'reported_by_consumer'
    },
    reportedByVendor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'reported_by_vendor'
    },
    reportMetadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'report_metadata'
    }
  },
  {
    sequelize,
    tableName: 'chat_rooms',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['portfolio_id', 'consumer_id'],
        name: 'unique_portfolio_consumer'
      }
    ]
  }
);

export default ChatRoom;
