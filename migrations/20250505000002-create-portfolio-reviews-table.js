export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('portfolio_reviews', {
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
    user_id: {
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
    rating: {
      type: Sequelize.SMALLINT,
      allowNull: false
    },
    review_text: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    review_title: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    review_media: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: []
    },
    vendor_response: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    vendor_responded_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    helpful_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    not_helpful_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_verified_purchase: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_approved: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_featured: {
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
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true
    }
  });

  await queryInterface.addIndex('portfolio_reviews', ['portfolio_id'], {
    name: 'idx_portfolio_reviews_portfolio_id'
  });

  await queryInterface.addIndex('portfolio_reviews', ['user_id'], {
    name: 'idx_portfolio_reviews_user_id'
  });

  await queryInterface.addIndex('portfolio_reviews', ['vendor_id'], {
    name: 'idx_portfolio_reviews_vendor_id'
  });

  await queryInterface.addIndex('portfolio_reviews', ['rating'], {
    name: 'idx_portfolio_reviews_rating'
  });

  await queryInterface.addIndex('portfolio_reviews', ['is_approved'], {
    name: 'idx_portfolio_reviews_is_approved'
  });

  await queryInterface.addIndex('portfolio_reviews', ['portfolio_id', 'user_id'], {
    name: 'idx_portfolio_reviews_portfolio_user',
    unique: true
  });

  await queryInterface.addConstraint('portfolio_reviews', {
    fields: ['rating'],
    type: 'check',
    name: 'check_rating_range',
    where: {
      rating: {
        [Sequelize.Op.between]: [1, 5]
      }
    }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('portfolio_reviews');
}
