/**
 * Migration: Create chat_messages table
 * High-volume table for storing all chat messages
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('chat_messages', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    chat_room_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: 'chat_rooms',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    sender_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    message_text: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    message_type: {
      type: Sequelize.ENUM('text', 'image', 'video', 'location', 'system'),
      allowNull: false,
      defaultValue: 'text'
    },
    message_metadata: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    media_url: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    thumbnail_url: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    mime_type: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    thumbnail_mime_type: {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: 'image/jpeg'
    },
    file_size_bytes: {
      type: Sequelize.BIGINT,
      allowNull: true
    },
    width: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    height: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    storage_type: {
      type: Sequelize.ENUM(
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
      allowNull: true
    },
    reply_to_message_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'chat_messages',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    system_event_type: {
      type: Sequelize.ENUM(
        'offer_made',
        'offer_accepted',
        'offer_rejected',
        'inquiry_sent',
        'contact_requested',
        'contact_shared',
        'user_blocked',
        'room_created'
      ),
      allowNull: true
    },
    is_read: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    delivered_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    read_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    edit_history: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  // Add indexes
  await queryInterface.addIndex('chat_messages', ['chat_room_id', 'created_at'], {
    name: 'idx_chat_messages_room',
    order: [['created_at', 'DESC']]
  });

  await queryInterface.addIndex('chat_messages', ['sender_id'], {
    name: 'idx_chat_messages_sender'
  });

  await queryInterface.addIndex('chat_messages', ['reply_to_message_id'], {
    name: 'idx_chat_messages_reply'
  });

  await queryInterface.addIndex('chat_messages', ['chat_room_id', 'is_read'], {
    name: 'idx_chat_messages_unread'
  });

  await queryInterface.addIndex('chat_messages', ['deleted_at'], {
    name: 'idx_chat_messages_deleted'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('chat_messages');
}
