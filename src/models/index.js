import sequelize from '#config/database.js';
import Country from './Country.js';
import State from './State.js';
import City from './City.js';
import Role from './Role.js';
import Permission from './Permission.js';
import RolePermission from './RolePermission.js';
import User from './User.js';
import UserSession from './UserSession.js';
import UserSocialAccount from './UserSocialAccount.js';
import SubscriptionPlan from './SubscriptionPlan.js';
import UserSubscription from './UserSubscription.js';
import DataRequest from './DataRequest.js';
import Category from './Category.js';
import Portfolio from './Portfolio.js';
import PortfolioMedia from './PortfolioMedia.js';
import PortfolioAlbum from './PortfolioAlbum.js';
import PortfolioReview from './PortfolioReview.js';
import PortfolioInquiry from './PortfolioInquiry.js';
import PortfolioOffer from './PortfolioOffer.js';
import ModerationReport from './ModerationReport.js';
import ChatRoom from './ChatRoom.js';
import ChatMessage from './ChatMessage.js';
import ListingOffer from './ListingOffer.js';
import Invoice from './Invoice.js';
import Transaction from './Transaction.js';
import UserFavorite from './UserFavorite.js';
import UserActivityLog from './UserActivityLog.js';
import UserLocationPreference from './UserLocationPreference.js';
import UserNotification from './UserNotification.js';
import UserNotificationPreference from './UserNotificationPreference.js';
import OtherMedia from './OtherMedia.js';
import OtpVerification from './OtpVerification.js';
import UserSearch from './UserSearch.js';
import VendorProfile from './VendorProfile.js';

const models = {
  Country,
  State,
  City,
  Role,
  Permission,
  RolePermission,
  User,
  UserSession,
  UserSocialAccount,
  SubscriptionPlan,
  UserSubscription,
  Invoice,
  Transaction,
  DataRequest,
  Category,
  Portfolio,
  PortfolioMedia,
  PortfolioAlbum,
  PortfolioReview,
  PortfolioInquiry,
  PortfolioOffer,
  ModerationReport,
  ChatRoom,
  ChatMessage,
  ListingOffer,
  UserFavorite,
  UserActivityLog,
  UserLocationPreference,
  UserNotification,
  UserNotificationPreference,
  OtherMedia,
  OtpVerification,
  UserSearch,
  VendorProfile
};

// Set up associations
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  as: 'permissions'
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  as: 'roles'
});

RolePermission.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'role'
});

RolePermission.belongsTo(Permission, {
  foreignKey: 'permission_id',
  as: 'permission'
});

Role.hasMany(RolePermission, {
  foreignKey: 'role_id',
  as: 'rolePermissions'
});

Permission.hasMany(RolePermission, {
  foreignKey: 'permission_id',
  as: 'rolePermissions'
});

// Location associations
Country.associate(models);
State.associate(models);
City.associate(models);

// User associations
User.associate(models);
UserSession.associate(models);
UserSocialAccount.associate(models);

// SubscriptionPlan associations
SubscriptionPlan.associate(models);

// UserSubscription associations
UserSubscription.associate(models);

// Data request associations
DataRequest.associate(models);

// Category associations
Category.associate(models);

// Portfolio associations
Portfolio.associate(models);
PortfolioMedia.associate(models);
PortfolioAlbum.associate(models);
PortfolioReview.associate(models);
PortfolioInquiry.associate(models);
PortfolioOffer.associate(models);

// Chat associations
ChatRoom.associate(models);
ChatMessage.associate(models);
ListingOffer.associate(models);

// UserFavorite associations
UserFavorite.associate(models);

// User activity and notification associations
UserActivityLog.associate(models);
UserLocationPreference.associate(models);
UserNotification.associate(models);
UserNotificationPreference.associate(models);

// Invoice and Transaction associations
Invoice.associate(models);
Transaction.associate(models);

// OtherMedia associations
OtherMedia.associate(models);

// ModerationReport associations
ModerationReport.associate(models);

// UserSearch associations
UserSearch.associate(models);

// VendorProfile associations
VendorProfile.associate(models);

export { sequelize };
export default models;
