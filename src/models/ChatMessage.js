/**
 * ChatMessage Model
 * Messages in chat rooms (text, image, location, system)
 */

import { DataTypes } from 'sequelize';
import sequelize from '#config/database.js';
import { getFullUrl } from '#utils/storageHelper.js';

const ChatMessage = sequelize.define(
  'ChatMessage',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    chatRoomId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'chat_room_id'
    },
    senderId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'sender_id'
    },
    messageText: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'message_text'
    },
    messageType: {
      type: DataTypes.ENUM('text', 'image', 'video', 'location', 'system'),
      allowNull: false,
      defaultValue: 'text',
      field: 'message_type'
    },
    messageMetadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'message_metadata'
    },
    mediaUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'media_url',
      get() {
        const rawValue = this.getDataValue('mediaUrl');
        if (!rawValue) return null;
        const storageType = this.getDataValue('storageType');
        const mimeType = this.getDataValue('mimeType');
        return getFullUrl(rawValue, storageType, mimeType);
      }
    },
    thumbnailUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'thumbnail_url',
      get() {
        const rawValue = this.getDataValue('thumbnailUrl');
        if (!rawValue) return null;
        const storageType = this.getDataValue('storageType');
        const thumbnailMimeType = this.getDataValue('thumbnailMimeType');
        return getFullUrl(rawValue, storageType, thumbnailMimeType);
      }
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'mime_type'
    },
    thumbnailMimeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'thumbnail_mime_type',
      defaultValue: 'image/jpeg'
    },
    fileSizeBytes: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'file_size_bytes'
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'width'
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'height'
    },
    storageType: {
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
      field: 'storage_type'
    },
    replyToMessageId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'reply_to_message_id'
    },
    systemEventType: {
      type: DataTypes.ENUM(
        'offer_made',
        'offer_accepted',
        'offer_rejected',
        'inquiry_sent',
        'contact_requested',
        'contact_shared',
        'user_blocked',
        'room_created'
      ),
      allowNull: true,
      field: 'system_event_type'
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_read'
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'delivered_at'
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'read_at'
    },
    editHistory: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'edit_history'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  },
  {
    sequelize,
    tableName: 'chat_messages',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeUpdate: async (message, options) => {
        if (message.changed('messageText') && !options.skipEditHistory) {
          const currentHistory = message.editHistory || [];
          const newEdit = {
            previousText: message._previousDataValues.messageText,
            editedAt: new Date().toISOString(),
            editedBy: options.userId || message.senderId
          };
          message.editHistory = [...currentHistory, newEdit];
        }
      }
    }
  }
);

// Define associations
ChatMessage.associate = (models) => {
  // Belongs to ChatRoom
  ChatMessage.belongsTo(models.ChatRoom, {
    foreignKey: 'chat_room_id',
    as: 'chatRoom'
  });

  // Belongs to User (Sender)
  ChatMessage.belongsTo(models.User, {
    foreignKey: 'sender_id',
    as: 'sender'
  });

  // Self-referencing for replies
  ChatMessage.belongsTo(models.ChatMessage, {
    foreignKey: 'reply_to_message_id',
    as: 'replyToMessage'
  });

  ChatMessage.hasMany(models.ChatMessage, {
    foreignKey: 'reply_to_message_id',
    as: 'replies'
  });
};

export default ChatMessage;
