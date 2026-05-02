/**
 * Migration: Create chat_rooms table
 * High-volume table for chat conversations between buyers and sellers
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('chat_rooms', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    portfolio_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: 'portfolios',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    consumer_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    vendor_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    consumer_snapshot: {
      type: Sequelize.STRING(150),
      allowNull: true
    },
    vendor_snapshot: {
      type: Sequelize.STRING(150),
      allowNull: true
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    last_message_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    unread_count_consumer: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    unread_count_vendor: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_important_consumer: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_important_vendor: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    consumer_subscription_tier: {
      type: Sequelize.STRING(20),
      allowNull: true
    },
    vendor_subscription_tier: {
      type: Sequelize.STRING(20),
      allowNull: true
    },
    consumer_requested_contact: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    vendor_shared_contact: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    blocked_by_consumer: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    blocked_by_vendor: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    block_metadata: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    reported_by_consumer: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    reported_by_vendor: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    report_metadata: {
      type: Sequelize.JSONB,
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

  await queryInterface.addConstraint('chat_rooms', {
    fields: ['portfolio_id', 'consumer_id'],
    type: 'unique',
    name: 'unique_portfolio_consumer'
  });

  await queryInterface.addIndex('chat_rooms', ['consumer_id', 'is_active'], {
    name: 'idx_chat_rooms_consumer'
  });

  await queryInterface.addIndex('chat_rooms', ['vendor_id', 'is_active'], {
    name: 'idx_chat_rooms_vendor'
  });

  await queryInterface.addIndex('chat_rooms', ['portfolio_id'], {
    name: 'idx_chat_rooms_portfolio'
  });

  await queryInterface.addIndex('chat_rooms', ['blocked_by_consumer', 'blocked_by_vendor'], {
    name: 'idx_chat_rooms_blocked'
  });

  await queryInterface.addIndex('chat_rooms', ['reported_by_consumer', 'reported_by_vendor'], {
    name: 'idx_chat_rooms_reported'
  });

  await queryInterface.addIndex('chat_rooms', ['last_message_at'], {
    name: 'idx_chat_rooms_last_message'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('chat_rooms');
}
