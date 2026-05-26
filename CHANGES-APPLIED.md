# Subscription Refactoring - Changes Applied

## ✅ **COMPLETED**

### 1. **storageHelper.js Utility** ✅
- **Created:** `src/utils/storageHelper.js`
- **Functions:** getFullUrl(), getRelativePath(), getFullUrls()
- **Status:** Ready to use

### 2. **subscription_plans Migration Updated** ✅
- **File:** `migrations/20250309000001-create-subscription-plans-table.js`
- **Added Fields:**
  - category_slug
  - max_albums_per_portfolio
  - max_photos_per_album
  - max_videos_per_album
  - max_total_media_items
  - allow_videos
  - max_media_file_size_mb
  - max_image_width
  - max_image_height
  - max_boosted_portfolios
  - boosted_days
  - can_be_recommended
- **Removed Fields:**
  - max_homepage_portfolios
  - portfolios_quota_rolling_days
- **Added Index:** idx_subscription_plans_category_slug

### 3. **user_subscriptions Migration Updated** ✅
- **File:** `migrations/20250311000001-create-user-subscriptions-table.js`
- **Added Complete Snapshot Fields:**
  - Category: category_id, category_name, category_slug, city_tier
  - Album/Media Quotas: max_albums_per_portfolio, max_photos_per_album, max_videos_per_album, max_total_media_items, max_storage_mb
  - Permissions: allow_videos, max_media_file_size_mb
  - Boost: max_boosted_portfolios, boosted_days, can_be_recommended
  - Visibility: priority_score, search_boost_multiplier, national_visibility, featured_days
  - Republish: max_republish_count, republish_cooldown_days
  - Management: is_auto_approve_enabled, support_level
  - Usage Tracking: storage_used_mb, portfolios_published_count, portfolios_featured_count, portfolios_boosted_count
- **Updated Indexes:**
  - Added: idx_user_subscriptions_category_id
  - Added: idx_user_subscriptions_user_category_status
  - Updated unique constraint to use category_id instead of plan_id

### 4. **SQL Script Created** ✅
- **File:** `APPLY-SUBSCRIPTION-CHANGES.sql`
- **Purpose:** Direct SQL commands to apply changes to existing database
- **Usage:** Run this if you already have the tables created

---

## 🎯 **NEXT STEPS**

### Option A: Fresh Database (Recommended)
If starting fresh or can reset database:
```bash
# Drop and recreate database
npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### Option B: Existing Database
If you have existing data:
```bash
# Run the SQL script directly on your database
psql -U your_username -d your_database -f APPLY-SUBSCRIPTION-CHANGES.sql

# OR use a database GUI tool and paste the SQL commands
```

### After Database Changes:
1. Update SubscriptionPlan model
2. Update UserSubscription model
3. Create SubscriptionService with upgrade logic
4. Test quota validation

---

## 📋 **FILES MODIFIED**

1. ✅ `src/utils/storageHelper.js` - Created
2. ✅ `migrations/20250309000001-create-subscription-plans-table.js` - Modified
3. ✅ `migrations/20250311000001-create-user-subscriptions-table.js` - Modified
4. ✅ `APPLY-SUBSCRIPTION-CHANGES.sql` - Created (for existing databases)

---

## 🔄 **WHAT'S NEXT**

Would you like me to:
1. Update the SubscriptionPlan model?
2. Update the UserSubscription model?
3. Create the SubscriptionService with upgrade logic?
4. Run the migrations (if you want to reset database)?

Let me know what you'd like to tackle next!
