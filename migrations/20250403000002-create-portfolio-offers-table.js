export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('portfolio_offers', {
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
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    vendor_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    offered_amount: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false
    },
    portfolio_price_at_time: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true
    },
    discount_percentage: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    parent_offer_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'portfolio_offers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    status: {
      type: Sequelize.ENUM('pending', 'accepted', 'rejected', 'withdrawn', 'expired'),
      allowNull: false,
      defaultValue: 'pending'
    },
    expires_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    viewed_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    responded_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    rejection_reason: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    auto_rejected: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
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

  await queryInterface.addIndex('portfolio_offers', ['portfolio_id', 'status'], {
    name: 'idx_portfolio_offers_portfolio_status'
  });

  await queryInterface.addIndex('portfolio_offers', ['chat_room_id'], {
    name: 'idx_portfolio_offers_chat_room'
  });

  await queryInterface.addIndex('portfolio_offers', ['consumer_id', 'status'], {
    name: 'idx_portfolio_offers_consumer'
  });

  await queryInterface.addIndex('portfolio_offers', ['vendor_id', 'status'], {
    name: 'idx_portfolio_offers_vendor'
  });

  await queryInterface.addIndex('portfolio_offers', ['parent_offer_id'], {
    name: 'idx_portfolio_offers_parent'
  });

  await queryInterface.addIndex('portfolio_offers', ['expires_at'], {
    name: 'idx_portfolio_offers_expires_at'
  });

  await queryInterface.addIndex('portfolio_offers', ['status', 'created_at'], {
    name: 'idx_portfolio_offers_status_created',
    order: [['created_at', 'DESC']]
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('portfolio_offers');
}
