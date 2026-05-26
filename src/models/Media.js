import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';
import { getFullUrl } from '#utils/storageHelper.js';

class Media extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
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

Media.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    entityType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'entity_type'
    },
    entityId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'entity_id'
    },
    subEntityType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'sub_entity_type'
    },
    subEntityId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'sub_entity_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'user_id'
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
    tableName: 'media',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeCreate: async (media, options) => {
        if (options.userId) {
          media.createdBy = options.userId;
        }
      },
      beforeUpdate: async (media, options) => {
        if (options.userId) {
          media.updatedBy = options.userId;
        }
      },
      beforeDestroy: async (media, options) => {
        if (options.userId) {
          media.deletedBy = options.userId;
        }
        await media.save({ hooks: false });
      }
    }
  }
);

export default Media;
