import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';
import { getFullUrl } from '#utils/storageHelper.js';

class VendorProfile extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  }
}

VendorProfile.init(
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
      unique: true,
      field: 'user_id'
    },
    businessName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'business_name'
    },
    businessPan: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'business_pan'
    },
    gstin: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'gstin'
    },
    businessRegistrationNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'business_registration_number'
    },
    businessType: {
      type: DataTypes.ENUM('proprietorship', 'partnership', 'pvt_ltd', 'llp', 'other'),
      allowNull: true,
      field: 'business_type'
    },
    establishmentYear: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      field: 'establishment_year'
    },
    nameOnId: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'name_on_id'
    },
    aadharNumber: {
      type: DataTypes.STRING(12),
      allowNull: true,
      field: 'aadhar_number'
    },
    panNumber: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'pan_number'
    },
    alternateMobileOne: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: true,
      field: 'alternate_mobile_one'
    },
    alternateMobileTwo: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: true,
      field: 'alternate_mobile_two'
    },
    whatsappMobile: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: true,
      field: 'whatsapp_mobile'
    },
    businessLogo: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'business_logo',
      get() {
        const rawValue = this.getDataValue('businessLogo');
        const storageType = this.getDataValue('businessMediaStorageType');
        return getFullUrl(rawValue, storageType);
      }
    },
    businessBanner: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'business_banner',
      get() {
        const rawValue = this.getDataValue('businessBanner');
        const storageType = this.getDataValue('businessMediaStorageType');
        return getFullUrl(rawValue, storageType);
      }
    },
    businessMediaStorageType: {
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
      field: 'business_media_storage_type'
    },
    yearsOfExperience: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      field: 'years_of_experience'
    },
    teamSize: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      field: 'team_size'
    },
    portfolioTagline: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'portfolio_tagline'
    },
    specializations: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: 'specializations'
    },
    serviceAreas: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: 'service_areas'
    },
    certifications: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: 'certifications'
    },
    awards: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: 'awards'
    },
    businessEmail: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'business_email'
    },
    businessPhone: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'business_phone'
    },
    websiteUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'website_url'
    },
    facebookUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'facebook_url'
    },
    instagramUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'instagram_url'
    },
    youtubeUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'youtube_url'
    },
    linkedinUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'linkedin_url'
    },
    businessHours: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'business_hours'
    },
    acceptsAdvanceBooking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'accepts_advance_booking'
    },
    minAdvanceBookingDays: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 7,
      field: 'min_advance_booking_days'
    },
    cancellationPolicy: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cancellation_policy'
    },
    isVerifiedVendor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_verified_vendor'
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'verified_at'
    },
    verificationBadgeType: {
      type: DataTypes.ENUM('basic', 'premium', 'elite'),
      allowNull: true,
      field: 'verification_badge_type'
    },
    trustScore: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'trust_score'
    }
  },
  {
    sequelize,
    tableName: 'vendor_profiles',
    timestamps: true,
    underscored: true,
    paranoid: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default VendorProfile;
