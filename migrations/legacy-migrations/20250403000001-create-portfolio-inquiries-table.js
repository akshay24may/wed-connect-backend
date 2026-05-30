export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('portfolio_inquiries', {
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
    event_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    event_type: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    guest_count: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    budget_range: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('pending', 'responded', 'closed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    viewed_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    responded_at: {
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

  await queryInterface.addIndex('portfolio_inquiries', ['portfolio_id', 'created_at'], {
    name: 'idx_portfolio_inquiries_portfolio',
    order: [['created_at', 'DESC']]
  });

  await queryInterface.addIndex('portfolio_inquiries', ['chat_room_id'], {
    name: 'idx_portfolio_inquiries_room'
  });

  await queryInterface.addIndex('portfolio_inquiries', ['consumer_id', 'status'], {
    name: 'idx_portfolio_inquiries_consumer'
  });

  await queryInterface.addIndex('portfolio_inquiries', ['vendor_id', 'status'], {
    name: 'idx_portfolio_inquiries_vendor'
  });

  await queryInterface.addIndex('portfolio_inquiries', ['status'], {
    name: 'idx_portfolio_inquiries_status'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('portfolio_inquiries');
}
