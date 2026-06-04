import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';
import { getFullUrl } from '#utils/storageHelper.js';

class ChatMessage extends Model {
  static associate(models) {
    // Belongs to ChatRoom
    this.belongsTo(models.ChatRoom, {
      foreignKey: 'chatRoomId',
      as: 'chatRoom'
    });

    // Belongs to User (Sender)
    this.belongsTo(models.User, {
      foreignKey: 'senderId',
      as: 'sender'
    });

    // Self-referencing for replies
    this.belongsTo(models.ChatMessage, {
      foreignKey: 'replyToMessageId',
      as: 'replyToMessage'
    });

    this.hasMany(models.ChatMessage, {
      foreignKey: 'replyToMessageId',
      as: 'replies'
    });
  }
}

ChatMessage.init(
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
        return getFullUrl(rawValue, storageType);
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
        return getFullUrl(rawValue, storageType);
      }
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

export default ChatMessage;
