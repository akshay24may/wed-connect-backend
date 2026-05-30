import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';
import { getFullUrl } from '#utils/storageHelper.js';

class Category extends Model {
  static associate(models) {
    // Phase 1: Portfolio associations
    this.hasMany(models.Portfolio, {
      foreignKey: 'categoryId',
      as: 'portfolios'
    });
    
    this.hasMany(models.SubscriptionPlan, {
      foreignKey: 'categoryId',
      as: 'subscriptionPlans'
    });
  }
}

Category.init(
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
      unique: true,
      field: 'name'
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'slug'
    },
    groupSlug: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'group_slug'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    icon: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'icon',
      get() {
        const rawValue = this.getDataValue('icon');
        const storageType = this.getDataValue('storageType');
        return getFullUrl(rawValue, storageType);
      }
    },
    bannerImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'banner_image',
      get() {
        const rawValue = this.getDataValue('bannerImage');
        const storageType = this.getDataValue('storageType');
        return getFullUrl(rawValue, storageType);
      }
    },
    storageType: {
      type: DataTypes.ENUM(
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
      allowNull: true,
      field: 'storage_type'
    },
    colorCode: {
      type: DataTypes.STRING(7),
      allowNull: true,
      field: 'color_code'
    },
    subtypes: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: 'subtypes'
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'display_order'
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_featured'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    metaTitle: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'meta_title'
    },
    metaDescription: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: 'meta_description'
    },
    metaKeywords: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'meta_keywords'
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
    tableName: 'categories',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
);

export default Category;
