import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';

class UserFavorite extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    this.belongsTo(models.Portfolio, {
      foreignKey: 'portfolio_id',
      as: 'portfolio'
    });
  }
}

UserFavorite.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'user_id'
    },
    portfolioId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'portfolio_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  },
  {
    sequelize,
    tableName: 'user_favorites',
    underscored: true,
    timestamps: false,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: false,
    hooks: {
      afterCreate: async (favorite, options) => {
        const { Portfolio } = await import('#models/index.js').then(m => m.default);
        await Portfolio.increment('totalFavorites', {
          by: 1,
          where: { id: favorite.portfolioId },
          transaction: options.transaction
        });
      },
      afterDestroy: async (favorite, options) => {
        try {
          const { Portfolio } = await import('#models/index.js').then(m => m.default);
          await Portfolio.decrement('totalFavorites', {
            by: 1,
            where: { id: favorite.portfolioId },
            transaction: options.transaction
          });
        } catch (error) {
          if (error.name === 'SequelizeDatabaseError' && error.parent?.constraint === 'check_total_favorites_non_negative') {
            // Silently ignore constraint violation (already at 0)
          } else {
            throw error;
          }
        }
      },
      afterRestore: async (favorite, options) => {
        const { Portfolio } = await import('#models/index.js').then(m => m.default);
        await Portfolio.increment('totalFavorites', {
          by: 1,
          where: { id: favorite.portfolioId },
          transaction: options.transaction
        });
      }
    }
  }
);

export default UserFavorite;