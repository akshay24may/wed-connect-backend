---
inclusion: manual
---

# WedConnect Refactoring Log

Tracks completed refactoring work from EClassify to WedConnect. Entries added only after completion. Max 3 lines per file.

---

## Configuration Files

1. **package.json** (2025-04-13) - Updated name to `wedconnect-backend`, description to "Backend API for WedConnect - Wedding Services Marketplace", keywords to wedding/marketplace/vendors.

2. **.env.example** (2025-04-13) - Changed database name to `wedconnect_database`, invoice prefix to `WC`, SMS sender to `WEDCON`. Removed duplicate `CORS_ORIGIN` variable.

3. **src/app.js** (2025-04-13) - Removed EClassify-specific CORS origins (eclassify-frontend.vercel.app, sealsale.online). Kept only localhost and FRONTEND_URL env var. Removed verbose comments.

4. **src/server.js** (2025-04-13) - Added port logic: 5000 for development, 5005 for production (unless PORT env set). Updated console output to "WedConnect Server Started". Removed verbose comments.

---

## Database Migrations

5. **migrations/20250106000001-create-roles-table.js** (2025-04-13) - Removed "Create indexes" comment. Removed unused Sequelize parameter from down function. Structure already aligned with WedConnect.

6. **migrations/20250111000001-create-permissions-table.js** (2025-04-13) - Removed "Create indexes" comment. Removed unused Sequelize parameter from down function. Structure already aligned with WedConnect.

7. **migrations/20250116000001-create-role-permissions-table.js** (2025-04-13) - Removed "Create unique constraint" and "Create indexes" comments. Removed unused Sequelize parameter from down function.

8. **migrations/20250121000001-create-users-table.js** (2025-04-13) - Renamed `total_listings` → `total_portfolios`. Removed all unnecessary comments. Removed unused Sequelize parameter from down function.

9. **migrations/20250126000001-create-user-profiles-table.js** (2025-04-13) - Updated `profile_photo_storage_type` ENUM to include 9 providers (aws_s3, cloudflare_r2, azure_blob, backblaze_b2, external, other). Added 'external' for social login profile pictures.

10. **migrations/20250131000001-create-user-sessions-table.js** (2025-04-13) - Removed unnecessary "Create indexes" comment. Removed unused Sequelize parameter from down function.

11. **migrations/20250205000001-create-user-social-accounts-table.js** (2025-04-13) - Removed profile picture fields (profile_picture_url, profile_picture_storage_type, profile_picture_mime_type). Social login profile pictures now stored in user_profiles with storage_type='external'.

---

## Models

12. **src/models/Role.js** (2025-04-13) - No changes needed. Already using class-based pattern with proper hooks and indexes. Aligned with WedConnect requirements.

13. **src/models/Permission.js** (2025-04-13) - No changes needed. Already using class-based pattern with auto-slug generation and update tracking. Aligned with WedConnect requirements.

14. **src/models/RolePermission.js** (2025-04-13) - No changes needed. Junction table already clean and properly structured. Aligned with WedConnect requirements.

15. **src/models/User.js** (2025-04-13) - Renamed `totalListings` → `totalPortfolios` field mapping. Simplified profilePhoto virtual field to only check UserProfile (no longer checks socialAccounts). Removed verbose comments.

16. **src/models/UserProfile.js** (2025-04-13) - Updated `profilePhotoStorageType` ENUM to include 'external' for social login profile pictures. Aligned with storage type standard (9 providers + other).

17. **src/models/UserSession.js** (2025-04-13) - No changes needed. Model already clean and aligned with WedConnect requirements.

18. **src/models/UserSocialAccount.js** (2025-04-13) - Removed profile picture fields (profilePictureUrl, profilePictureStorageType, profilePictureMimeType). OAuth tokens only. Profile pictures handled in UserProfile.

---

## Seeders

19. **seeders/20250106000001-seed-roles.js** (2025-04-13) - Replaced 'user' role with 'vendor' and 'consumer' roles. Added 'moderator' and 'support' roles. Set is_system_role=true for vendor/consumer/super_admin only. Total 9 roles with proper priorities.

20. **migrations/20250308000001-create-categories-table.js** (2025-04-14) - Renamed `image_url` → `banner_image`, increased path lengths to 500. Added `color_code`, `subtypes` (JSONB), SEO fields (meta_title, meta_description, meta_keywords). Updated storage_type ENUM to standard 10 values.

21. **src/models/Category.js** (2025-04-14) - Updated field mappings for `bannerImage`, `colorCode`, `subtypes`, SEO fields. Added getters for icon and bannerImage with storage helper. Updated storage_type ENUM to match migration.

---

## Location Module

22. **migrations/20250100000001-create-countries-table.js** (2025-04-14) - Created countries table with name, slug, iso_code, iso_code_3, phone_code. Small lookup table (INTEGER id). Supports multi-country expansion.

23. **migrations/20250101000001-create-states-table.js** (2025-04-14) - Added country_id FK (nullable), country_slug, state_code. Updated audit fields to BIGINT. Removed is_deleted (using paranoid mode). Added country_id index.

24. **migrations/20250102000001-create-districts-table.js** (2025-04-14) - DELETED. Districts are now treated as cities in cities table.

25. **migrations/20250103000001-create-cities-table.js** (2025-04-14) - Removed district_id FK. Changed state_name → state_slug. Added district_code, headquarters, population, area, density from districts.json. Kept lat/long for future map features. Updated audit fields to BIGINT.

26. **src/models/Country.js** (2025-04-14) - Created Country model with iso codes, phone code. Paranoid mode enabled. Association: hasMany States.

27. **src/models/State.js** (2025-04-14) - Added countryId, countrySlug, stateCode fields. Updated audit fields to BIGINT. Removed isDeleted. Enabled paranoid mode. Updated associations: belongsTo Country, hasMany Cities (removed District).

28. **src/models/City.js** (2025-04-14) - Removed districtId, stateName, district, pincode. Added stateSlug, stateCode, districtCode, headquarters, population, area, density, cityTier. Updated lat/long precision. Enabled paranoid mode. Updated associations: belongsTo State only.

29. **src/models/District.js** (2025-04-14) - DELETED. Districts merged into cities table.

30. **src/models/index.js** (2025-04-14) - Added Country model import and registration. Removed District model references. Updated location associations to include Country.

---

## Seeders

31. **seeders/20250100000001-seed-countries.js** (2025-04-14) - Created countries seeder from all-countries.json. Generates slugs from country names. Seeds 195+ countries with ISO codes and phone codes.

32. **seeders/20250101000001-seed-states.js** (2025-04-14) - Updated to fetch India country_id/slug dynamically. Added state_code mapping for all 36 states/UTs. Removed is_deleted field. Refactored to use array mapping for cleaner code.

33. **seeders/20250104000001-seed-cities.js** (2025-04-14) - Created cities seeder from districts.json. Maps districts to cities with state lookup. Includes population, area, density, headquarters. Generates unique slugs with state prefix.

---

## Subscription Module

34. **migrations/20250309000001-create-subscription-plans-table.js** (2025-04-14) - Removed max_total_portfolios (confusing, redundant). Kept max_published_portfolios for quota. Added max_storage_mb (nullable) for media storage limits. Removed unused Sequelize parameter.

35. **migrations/20250311000001-create-user-subscriptions-table.js** (2025-04-14) - Removed max_total_portfolios snapshot. Added max_storage_mb snapshot. Changed updated_by to JSON. Removed unused Sequelize parameter.

36. **src/models/SubscriptionPlan.js** (2025-04-14) - Removed maxTotalPortfolios field. Added maxStorageMb field. Simplified quota logic to single source of truth (published portfolios only).

37. **src/models/UserSubscription.js** (2025-04-14) - Removed maxTotalPortfolios field. Added maxStorageMb field. Updated updated_by to JSON. Added beforeUpdate hook for update history.

---

## Portfolios Module

38. **migrations/20250315000001-create-car-listings-table.js** (2025-04-14) - DELETED. Car listings not needed in wedding marketplace.

39. **migrations/20250320000001-create-property-listings-table.js** (2025-04-14) - DELETED. Property listings not needed in wedding marketplace.

40. **src/models/CarListing.js** (2025-04-14) - DELETED. Removed from models/index.js.

41. **src/models/PropertyListing.js** (2025-04-14) - DELETED. Removed from models/index.js.

42. **migrations/20250314000001-create-portfolios-table.js** (2025-04-14) - Renamed from listings. Removed EClassify fields (is_paid_listing, expires_at, sold status, posted_by_type). Added wedding fields (starting_price, price_range, price_on_request, state_slug, city_slug, service_details JSONB). Updated storage_type ENUM to 10 values.

43. **migrations/20250325000001-create-portfolio-media-table.js** (2025-04-14) - Renamed from listing_media. Changed file_size_bytes to BIGINT. Added deleted_at for soft delete. Updated storage_type ENUM to 10 values.

44. **migrations/20250403000001-create-portfolio-inquiries-table.js** (2025-04-14) - Replaced listing_offers with portfolio_inquiries. Wedding-specific fields (event_date, event_type, guest_count, budget_range). Simplified status (pending, responded, closed).

45. **migrations/20250501000001-create-portfolio-reports-table.js** (2025-04-14) - Renamed from listing_reports. Changed report_type and action_taken to ENUM. Added wedding-specific report types (inappropriate_content, fake_portfolio). Changed listing_removed → portfolio_removed.

---

**Last Updated:** 2025-04-14

46. **src/models/Portfolio.js** (2025-04-14) - Created from Listing. Removed EClassify fields (price, priceNegotiable, stateName, cityName, pincode, expiresAt, postedByType, isPaidListing, essentialData). Added wedding fields (startingPrice, priceRangeMin/Max, priceOnRequest, stateSlug, citySlug, serviceDetails). Updated status ENUM (draft, pending, published, rejected). Updated storage_type ENUM to 10 values.

47. **src/models/PortfolioMedia.js** (2025-04-14) - Created from ListingMedia. Changed fileSizeBytes to BIGINT. Added paranoid mode with deletedAt. Updated storage_type ENUM to 10 values. Getters for mediaUrl and thumbnailUrl with storage helper.

48. **src/models/PortfolioInquiry.js** (2025-04-14) - New model for wedding inquiries. Replaced ListingOffer concept. Fields: eventDate, eventType, guestCount, budgetRange, message. Status ENUM (pending, responded, closed). Associations to Portfolio, ChatRoom, Consumer, Vendor.

49. **src/models/PortfolioReport.js** (2025-04-14) - Created from ListingReport. Changed reportType and actionTaken to ENUM. Added wedding-specific report types (inappropriate_content, fake_portfolio). Status ENUM (pending, under_review, resolved, dismissed).

50. **src/models/index.js** (2025-04-14) - Registered Portfolio, PortfolioMedia, PortfolioInquiry, PortfolioReport. Removed Listing, ListingMedia, ListingReport. Updated associations section.

51. **src/models/Listing.js** (2025-04-14) - DELETED. Replaced by Portfolio model.

52. **src/models/ListingMedia.js** (2025-04-14) - DELETED. Replaced by PortfolioMedia model.

53. **src/models/ListingReport.js** (2025-04-14) - DELETED. Replaced by PortfolioReport model.

54. **migrations/20250403000002-create-portfolio-offers-table.js** (2025-04-14) - Created portfolio_offers table. Renamed listing_id → portfolio_id, buyer_id → consumer_id, seller_id → vendor_id. Changed listing_price_at_time → portfolio_price_at_time. Status ENUM (pending, accepted, rejected, withdrawn, expired). Supports counter-offers via parent_offer_id.

55. **src/models/PortfolioOffer.js** (2025-04-14) - Created for price negotiations. Renamed fields: listingId → portfolioId, buyerId → consumerId, sellerId → vendorId, listingPriceAtTime → portfolioPriceAtTime. Status ENUM matches migration. Self-referencing for counter-offers. Hook calculates discount percentage.

56. **src/models/index.js** (2025-04-14) - Registered PortfolioOffer model. Kept ListingOffer for backward compatibility (deprecated, no migration).

57. **migrations/20250401000001-create-chat-rooms-table.js** (2025-04-14) - Renamed listing_id → portfolio_id, buyer_id → consumer_id, seller_id → vendor_id. Added consumer_snapshot and vendor_snapshot (VARCHAR 150, nullable) for preserving names when users deleted. Renamed all buyer/seller fields to consumer/vendor. Updated unique constraint and indexes.

58. **src/models/ChatRoom.js** (2025-04-14) - Renamed all fields: listingId → portfolioId, buyerId → consumerId, sellerId → vendorId, unreadCountBuyer → unreadCountConsumer, etc. Added consumerSnapshot and vendorSnapshot fields. Updated associations to Portfolio, Consumer, Vendor. Added PortfolioInquiry association.

59. **ALTER-chat-rooms.sql** (2025-04-14) - Created SQL script for updating existing database. Adds snapshot columns, renames all buyer/seller → consumer/vendor columns, updates foreign keys and indexes.

60. **src/utils/customSlugify.js** (2025-04-14) - Added generateUniqueSlug() function that uses customSlugify() for base slug + random suffix. Reuses existing slug logic instead of duplicating.

61. **src/models/Portfolio.js** (2025-04-14) - Updated beforeCreate hook to use generateUniqueSlug() from utils instead of inline slug generation. Removed crypto import.

62. **.kiro/steering/structure.md** (2025-04-14) - Added guideline to always use generateUniqueSlug() from customSlugify.js for slug generation in model hooks. Listed all available functions.

63. **migrations/20250501000003-create-moderation-reports-table.js** (2025-04-14) - Created combined moderation_reports table. Polymorphic design: reportable_type ENUM (portfolio, user, chat_message, review) + reportable_id. Unified report_type, status, action_taken ENUMs. Added priority field. Replaces portfolio_reports and user_reports.

64. **src/models/ModerationReport.js** (2025-04-14) - Created polymorphic ModerationReport model. Added getReportable() instance method to fetch reported entity. Associations to reporter, reviewer, relatedPortfolio, relatedChatRoom. Handles all reportable types in single table.

65. **src/models/index.js** (2025-04-14) - Registered ModerationReport model. Removed UserReport and PortfolioReport models (replaced by ModerationReport).

66. **migrations/20250501000001-create-portfolio-reports-table.js** (2025-04-14) - DELETED. Replaced by moderation_reports.

67. **migrations/20250501000002-create-user-reports-table.js** (2025-04-14) - DELETED. Replaced by moderation_reports.

68. **src/models/PortfolioReport.js** (2025-04-14) - DELETED. Replaced by ModerationReport.

69. **src/models/UserReport.js** (2025-04-14) - DELETED. Replaced by ModerationReport.

70. **migrations/20250402000001-create-chat-messages-table.js** (2025-04-14) - Changed message_type to ENUM (text, image, video, location, system). Changed file_size_bytes to BIGINT. Added delivered_at for delivery tracking. Replaced edited_at with edit_history JSONB for full edit audit trail. Updated storage_type ENUM to 10 values. Changed system_event_type to ENUM (added inquiry_sent, room_created). Removed verbose comments.

71. **src/models/ChatMessage.js** (2025-04-14) - Updated messageType to ENUM. Changed fileSizeBytes to BIGINT. Added deliveredAt field. Replaced editedAt with editHistory JSONB. Added beforeUpdate hook to automatically track message edits. Updated storageType ENUM to 10 values. Changed systemEventType to ENUM. Getters for mediaUrl and thumbnailUrl with storage helper.

72. **ALTER-chat-messages.sql** (2025-04-14) - Created SQL script for updating existing database. Adds delivered_at column, replaces edited_at with edit_history JSONB, changes file_size_bytes to BIGINT, converts message_type and system_event_type to ENUMs, updates storage_type ENUM to 10 values.

73. **IMPLEMENTATION-NOTES-message-status.md** (2025-04-14) - Updated with edit history implementation guide. Includes automatic tracking via hook, edit restrictions, UI display examples, retention policy, and storage considerations.
