import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';

class Country extends Model {}

Country.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    isoCode: {
      type: DataTypes.STRING(2),
      allowNull: false,
      unique: true,
      field: 'iso_code'
    },
    isoCode3: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true,
      field: 'iso_code_3'
    },
    phoneCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'phone_code'
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
    modelName: 'Country',
    tableName: 'countries',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
);

Country.associate = (models) => {
  Country.hasMany(models.State, {
    foreignKey: 'country_id',
    as: 'states'
  });
};

export default Country;
