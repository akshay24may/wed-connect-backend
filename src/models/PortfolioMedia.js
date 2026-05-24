import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';
import { getFullUrl } from '#utils/storageHelper.js';

class PortfolioMedia extends Model {
  static associate(models) {
    this.belongsTo(models.Portfolio, {
      foreignKey: 'portfolio_id',
      as: 'portfolio'
    });

    this.belongsTo(models.PortfolioAlbum, {
      foreignKey: 'albumId',
      as: 'album'
    });
  }
}

PortfolioMedia.init(
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
    albumId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'album_id'
    },
    mediaType: {
      type: DataTypes.ENUM('image', 'video'),
      allowNull: false,
      defaultValue: 'image',
      field: 'media_type'
    },
    mediaUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'media_url',
      get() {
        const rawValue = this.getDataValue('mediaUrl');
        const storageType = this.getDataValue('storageType');
        return getFullUrl(rawValue, storageType);
      }
    },
    thumbnailUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'thumbnail_url',
      get() {
        const rawValue = this.getDataValue('thumbnailUrl');
        const storageType = this.getDataValue('storageType');
        return getFullUrl(rawValue, storageType);
      }
    },
    fileSizeBytes: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'file_size_bytes'
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'width'
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'height'
    },
    durationSeconds: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'duration_seconds'
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'display_order'
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_primary'
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
      allowNull: false,
      defaultValue: 'local',
      field: 'storage_type'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  },
  {
    sequelize,
    tableName: 'portfolio_media',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
);

export default PortfolioMedia;
