import { Model, DataTypes } from "sequelize";
import sequelize from "#config/database.js";

class City extends Model {}

City.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    stateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "state_id",
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    stateSlug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "state_slug",
    },
    stateCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "state_code",
    },
    districtCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "district_code",
    },
    headquarters: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    population: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    area: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    density: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    cityTier: {
      type: DataTypes.ENUM('tier_1', 'tier_2', 'tier_3'),
      allowNull: false,
      defaultValue: 'tier_3',
      field: "city_tier",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "display_order",
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_popular"
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "created_by",
    },
    updatedBy: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "updated_by",
    },
    deletedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "deleted_by",
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "deleted_at",
    },
  },
  {
    sequelize,
    modelName: "City",
    tableName: "cities",
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
);

City.associate = (models) => {
  City.belongsTo(models.State, {
    foreignKey: "state_id",
    as: "state",
  });
};

export default City;
