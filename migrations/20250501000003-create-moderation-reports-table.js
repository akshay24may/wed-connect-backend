export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('moderation_reports', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    reportable_type: {
      type: Sequelize.ENUM('portfolio', 'user', 'chat_message', 'review'),
      allowNull: false
    },
    reportable_id: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    reported_by: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    report_type: {
      type: Sequelize.ENUM(
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
      allowNull: false
    },
    reason: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    context: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    related_portfolio_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'portfolios',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    related_chat_room_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'chat_rooms',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    status: {
      type: Sequelize.ENUM('pending', 'under_review', 'resolved', 'dismissed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    priority: {
      type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium'
    },
    reviewed_by: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    reviewed_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    admin_notes: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    action_taken: {
      type: Sequelize.ENUM(
        'none',
        'content_removed',
        'content_edited',
        'user_warned',
        'user_suspended',
        'user_banned',
        'false_report'
      ),
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

  await queryInterface.addConstraint('moderation_reports', {
    fields: ['reportable_type', 'reportable_id', 'reported_by'],
    type: 'unique',
    name: 'unique_report_per_user'
  });

  await queryInterface.addIndex('moderation_reports', ['reportable_type', 'reportable_id'], {
    name: 'idx_moderation_reports_reportable'
  });

  await queryInterface.addIndex('moderation_reports', ['reported_by'], {
    name: 'idx_moderation_reports_reporter'
  });

  await queryInterface.addIndex('moderation_reports', ['status', 'priority'], {
    name: 'idx_moderation_reports_status_priority'
  });

  await queryInterface.addIndex('moderation_reports', ['report_type'], {
    name: 'idx_moderation_reports_type'
  });

  await queryInterface.addIndex('moderation_reports', ['reviewed_by'], {
    name: 'idx_moderation_reports_reviewer'
  });

  await queryInterface.addIndex('moderation_reports', ['created_at'], {
    name: 'idx_moderation_reports_created',
    order: [['created_at', 'DESC']]
  });

  await queryInterface.addIndex('moderation_reports', ['related_portfolio_id'], {
    name: 'idx_moderation_reports_portfolio'
  });

  await queryInterface.addIndex('moderation_reports', ['related_chat_room_id'], {
    name: 'idx_moderation_reports_chat_room'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('moderation_reports');
}
