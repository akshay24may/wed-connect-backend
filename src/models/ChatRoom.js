import { DataTypes } from 'sequelize';
import sequelize from '#config/database.js';

const ChatRoom = sequelize.define(
  'ChatRoom',
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

ChatRoom.associate = (models) => {
  ChatRoom.belongsTo(models.Portfolio, {
    foreignKey: 'portfolio_id',
    as: 'portfolio'
  });

  ChatRoom.belongsTo(models.User, {
    foreignKey: 'consumer_id',
    as: 'consumer'
  });

  ChatRoom.belongsTo(models.User, {
    foreignKey: 'vendor_id',
    as: 'vendor'
  });

  ChatRoom.hasMany(models.ChatMessage, {
    foreignKey: 'chat_room_id',
    as: 'messages'
  });

  ChatRoom.hasMany(models.PortfolioOffer, {
    foreignKey: 'chat_room_id',
    as: 'portfolioOffers'
  });

  ChatRoom.hasMany(models.PortfolioInquiry, {
    foreignKey: 'chat_room_id',
    as: 'inquiries'
  });

  ChatRoom.hasMany(models.ListingOffer, {
    foreignKey: 'chat_room_id',
    as: 'offers'
  });
};

export default ChatRoom;
