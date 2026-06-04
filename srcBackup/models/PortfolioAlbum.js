import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';
import { generateUniqueSlug } from '#utils/customSlugify.js';
import { getFullUrl } from '#utils/storageHelper.js';

class PortfolioAlbum extends Model {
  static associate(models) {
    this.belongsTo(models.Portfolio, {
      foreignKey: 'portfolioId',
      as: 'portfolio'
    });

    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    this.belongsTo(models.City, {
      foreignKey: 'cityId',
      as: 'city'
    });

    this.hasMany(models.PortfolioMedia, {
      foreignKey: 'albumId',
      as: 'media'
    });

    this.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });

    this.belongsTo(models.User, {
      foreignKey: 'deletedBy',
      as: 'deleter'
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
      unique: true,
      field: 'album_slug'
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'city_id'
    },
    citySlug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'city_slug'
    },
    locationName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'location_name'
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      field: 'latitude'
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      field: 'longitude'
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
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'created_by'
    },
    updatedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'updated_by'
    },
    deletedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'deleted_by'
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
    deletedAt: 'deleted_at',
    hooks: {
      beforeCreate: async (album, options) => {
        if (!album.albumSlug && album.albumName) {
          album.albumSlug = generateUniqueSlug(album.albumName);
        }

        if (options.userId) {
          album.createdBy = options.userId;
        }
      },
      beforeUpdate: async (album, options) => {
        if (options.userId) {
          album.updatedBy = options.userId;
        }
      },
      beforeDestroy: async (album, options) => {
        if (options.userId) {
          album.deletedBy = options.userId;
        }
        await album.save({ hooks: false });
      }
    }
  }
);

export default PortfolioAlbum;
