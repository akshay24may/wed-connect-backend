import { DataTypes } from 'sequelize';
import sequelize from '#config/database.js';

const PortfolioInquiry = sequelize.define(
  'PortfolioInquiry',
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
      allowNull: false,
      field: 'consumer_id'
    },
    vendorId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'vendor_id'
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'event_date'
    },
    eventType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'event_type'
    },
    guestCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'guest_count'
    },
    budgetRange: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'budget_range'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'message'
    },
    status: {
      type: DataTypes.ENUM('pending', 'responded', 'closed'),
      allowNull: false,
      defaultValue: 'pending',
      field: 'status'
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
    }
  },
  {
    sequelize,
    tableName: 'portfolio_inquiries',
    timestamps: true,
    underscored: true,
    paranoid: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

PortfolioInquiry.associate = (models) => {
  PortfolioInquiry.belongsTo(models.Portfolio, {
    foreignKey: 'portfolio_id',
    as: 'portfolio'
  });

  PortfolioInquiry.belongsTo(models.ChatRoom, {
    foreignKey: 'chat_room_id',
    as: 'chatRoom'
  });

  PortfolioInquiry.belongsTo(models.User, {
    foreignKey: 'consumer_id',
    as: 'consumer'
  });

  PortfolioInquiry.belongsTo(models.User, {
    foreignKey: 'vendor_id',
    as: 'vendor'
  });
};

export default PortfolioInquiry;
