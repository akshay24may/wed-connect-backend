import { DataTypes } from 'sequelize';
import sequelize from '#config/database.js';

const ModerationReport = sequelize.define(
  'ModerationReport',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    reportableType: {
      type: DataTypes.ENUM('portfolio', 'user', 'chat_message', 'review'),
      allowNull: false,
      field: 'reportable_type'
    },
    reportableId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'reportable_id'
    },
    reportedBy: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'reported_by'
    },
    reportType: {
      type: DataTypes.ENUM(
        'spam',
        'fraud',
        'scam',
        'offensive',
        'harassment',
        'duplicate',
        'wrong_category',
        'misleading',
        'inappropriate_content',
        'fake_portfolio',
        'fake_profile',
        'non_responsive',
        'other'
      ),
      allowNull: false,
      field: 'report_type'
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'reason'
    },
    context: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'context'
    },
    relatedPortfolioId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'related_portfolio_id'
    },
    relatedChatRoomId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'related_chat_room_id'
    },
    status: {
      type: DataTypes.ENUM('pending', 'under_review', 'resolved', 'dismissed'),
      allowNull: false,
      defaultValue: 'pending',
      field: 'status'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium',
      field: 'priority'
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
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'admin_notes'
    },
    actionTaken: {
      type: DataTypes.ENUM(
        'none',
        'content_removed',
        'content_edited',
        'user_warned',
        'user_suspended',
        'user_banned',
        'false_report'
      ),
      allowNull: true,
      field: 'action_taken'
    }
  },
  {
    sequelize,
    tableName: 'moderation_reports',
    timestamps: true,
    underscored: true,
    paranoid: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

ModerationReport.associate = (models) => {
  ModerationReport.belongsTo(models.User, {
    foreignKey: 'reported_by',
    as: 'reporter'
  });

  ModerationReport.belongsTo(models.User, {
    foreignKey: 'reviewed_by',
    as: 'reviewer'
  });

  ModerationReport.belongsTo(models.Portfolio, {
    foreignKey: 'related_portfolio_id',
    as: 'relatedPortfolio'
  });

  ModerationReport.belongsTo(models.ChatRoom, {
    foreignKey: 'related_chat_room_id',
    as: 'relatedChatRoom'
  });
};

ModerationReport.prototype.getReportable = async function() {
  const models = sequelize.models;
  
  switch (this.reportableType) {
    case 'portfolio':
      return await models.Portfolio.findByPk(this.reportableId);
    case 'user':
      return await models.User.findByPk(this.reportableId);
    case 'chat_message':
      return await models.ChatMessage.findByPk(this.reportableId);
    case 'review':
      return await models.Review?.findByPk(this.reportableId);
    default:
      return null;
  }
};

export default ModerationReport;
