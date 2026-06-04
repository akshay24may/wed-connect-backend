import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';

class State extends Model {}

State.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'country_id'
    },
    countrySlug: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'country_slug'
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    stateCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'state_code'
    },
    regionSlug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'region_slug'
    },
    regionName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'region_name'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'display_order'
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_popular'
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'created_by'
    },
    updatedBy: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'updated_by'
    },
    deletedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'deleted_by'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  },
  {
    sequelize,
    modelName: 'State',
    tableName: 'states',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
);

State.associate = (models) => {
  State.belongsTo(models.Country, {
    foreignKey: 'country_id',
    as: 'country'
  });

  State.hasMany(models.City, {
    foreignKey: 'state_id',
    as: 'cities'
  });
};

export default State;
