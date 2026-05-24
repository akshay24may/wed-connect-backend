import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';
import { getFullUrl } from '#utils/storageHelper.js';

class PortfolioAlbum extends Model {
  static associate(models) {
    this.belongsTo(models.Portfolio, {
      foreignKey: 'portfolioId',
      as: 'portfolio'
    });

    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'vendor'
    });

    this.hasMany(models.PortfolioMedia, {
      foreignKey: 'albumId',
      as: 'media'
    });
  }
}

PortfolioAlbum.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    portfolioId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'portfolio_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'user_id'
    },
    albumName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'album_name'
    },
    albumDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'album_description'
    },
    albumSlug: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'album_slug'
    },
    coverPhotoOne: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cover_photo_one',
      get() {
        const rawValue = this.getDataValue('coverPhotoOne');
        const storageType = this.getDataValue('coverPhotosStorageType');
        return getFullUrl(rawValue, storageType);
      }
    },
    coverPhotoTwo: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cover_photo_two',
      get() {
        const rawValue = this.getDataValue('coverPhotoTwo');
        const storageType = this.getDataValue('coverPhotosStorageType');
        return getFullUrl(rawValue, storageType);
      }
    },
    coverPhotoThree: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cover_photo_three',
      get() {
        const rawValue = this.getDataValue('coverPhotoThree');
        const storageType = this.getDataValue('coverPhotosStorageType');
        return getFullUrl(rawValue, storageType);
      }
    },
    coverPhotosStorageType: {
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
      field: 'cover_photos_storage_type'
    },
    mediaCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'media_count'
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
      defaultValue: false,
      field: 'is_featured'
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_public'
    }
  },
  {
    sequelize,
    tableName: 'portfolio_albums',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
);

export default PortfolioAlbum;
