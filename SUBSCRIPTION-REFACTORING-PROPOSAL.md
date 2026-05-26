# Subscription Tables Refactoring Proposal

## 🎯 **OBJECTIVE**

Refactor `subscription_plans` and `user_subscriptions` tables to:
1. Remove old project fields (cars/properties specific)
2. Add wedding marketplace specific fields
3. Add missing portfolio/album/media quotas
4. Ensure proper snapshot in user_subscriptions
5. Optimize for wedding service categories

---

## 📊 **CURRENT STATE ANALYSIS**

### ❌ **PROBLEMS IDENTIFIED**

#### 1. **Old Project Fields (To Remove)**
These fields are from the old classified ads project:

**subscription_plans:**
- `max_homepage_portfolios` - Not needed for wedding marketplace
- `portfolios_quota_rolling_days` - Confusing, not needed
- `republish_count` / `republish_cooldown_days` - Not applicable

**Seeder has:**
- `max_total_listings` - Old terminology
- `max_active_listings` - Old terminology
- `listing_quota_limit` - Old terminology
- `listing_quota_rolling_days` - Old terminology
- `listing_duration_days` - Not applicable
- `auto_refresh_enabled` - Not applicable
- `refresh_frequency_days` - Not applicable
- `manual_refresh_per_cycle` - Not applicable
- `max_boosted_listings` - Not applicable
- `max_spotlight_listings` - Not applicable
- `boosted_days` / `spotlight_days` - Not applicable

#### 2. **Missing Wedding-Specific Fields**

**Portfolio/Album/Media Quotas:**
- `max_albums_per_portfolio` - MISSING
- `max_photos_per_album` - MISSING
- `max_videos_per_album` - MISSING
- `max_total_media_items` - MISSING
- `allow_videos` - MISSING
- `max_video_duration_seconds` - MISSING
- `max_video_size_mb` - MISSING
- `max_photo_size_mb` - MISSING

**Category Information:**
- `category_slug` - MISSING (only have category_id and category_name)

#### 3. **Incomplete Snapshot in user_subscriptions**

Currently only snapshots:
- ✅ plan_name, plan_code, plan_version
- ✅ base_price, discount_amount, final_price, currency
- ✅ billing_cycle, duration_days
- ✅ max_published_portfolios, max_featured_portfolios
- ✅ features (JSONB)

**Missing snapshots:**
- ❌ category_id, category_name, category_slug
- ❌ city_tier
- ❌ All quota fields (albums, photos, videos, storage)
- ❌ support_level
- ❌ priority_score, search_boost_multiplier
- ❌ national_visibility
- ❌ is_auto_approve_enabled
- ❌ featured_days


---

## ✅ **REFACTORED STRUCTURE**

### **1. subscription_plans Table**

#### **KEEP (Core Fields)**
```sql
-- Identity
id, plan_code, version, name, slug
description, short_description, tagline

-- Pricing
base_price, discount_amount, final_price, currency
billing_cycle, duration_days

-- Display
show_original_price, show_offer_badge, offer_badge_text, sort_order

-- Category & Location
category_id, category_name, category_slug (NEW)
city_tier

-- Portfolio Quotas
max_published_portfolios
max_storage_mb

-- Featured
max_featured_portfolios
featured_days

-- Visibility
priority_score
search_boost_multiplier
national_visibility

-- Management
is_auto_approve_enabled
support_level

-- Features & Metadata
features (JSONB)
metadata (JSONB)
internal_notes
terms_and_conditions

-- Status
is_active, is_public, is_default

-- Versioning
deprecated_at, replaced_by_plan_id

-- Audit
created_by, updated_by, deleted_by
created_at, updated_at, deleted_at
```


#### **REMOVE (Old Project Fields)**
```sql
-- ❌ Remove these fields
max_homepage_portfolios          -- Not needed
portfolios_quota_rolling_days    -- Not needed
```

#### **ADD (Wedding-Specific Fields)**
```sql
-- ✅ Add these fields

-- Category
category_slug VARCHAR(100) NOT NULL  -- For quick lookups

-- Album Quotas
max_albums_per_portfolio INTEGER NOT NULL DEFAULT 0
  COMMENT 'Maximum albums per portfolio'

-- Media Quotas
max_photos_per_album INTEGER NOT NULL DEFAULT 0
  COMMENT 'Maximum photos per album'

max_videos_per_album INTEGER NOT NULL DEFAULT 0
  COMMENT 'Maximum videos per album'

max_total_media_items INTEGER NULL
  COMMENT 'Total media items across all portfolios (NULL = unlimited)'

-- Video Permissions
allow_videos BOOLEAN NOT NULL DEFAULT false
  COMMENT 'Whether videos are allowed'

-- Media File Size (Single column for all media types)
max_media_file_size_mb INTEGER NULL
  COMMENT 'Maximum file size in MB for photos/videos (NULL = no limit)'

-- Image Dimensions
max_image_width INTEGER NULL
  COMMENT 'Maximum image width in pixels (NULL = no limit)'

max_image_height INTEGER NULL
  COMMENT 'Maximum image height in pixels (NULL = no limit)'

-- Boost Features
max_boosted_portfolios INTEGER NOT NULL DEFAULT 0
  COMMENT 'Maximum portfolios that can be boosted'

boosted_days INTEGER NOT NULL DEFAULT 0
  COMMENT 'Duration for boosted status (0 = not available)'

-- Platform Recommendation
can_be_recommended BOOLEAN NOT NULL DEFAULT false
  COMMENT 'Whether portfolios can be platform recommended'
```


### **2. user_subscriptions Table**

#### **KEEP (Core Fields)**
```sql
-- Identity
id, user_id, plan_id

-- Lifecycle
ends_at, activated_at
status, is_trial, trial_ends_at

-- Auto-Renewal
auto_renew, cancelled_at, cancellation_reason

-- Reminders
renewal_reminder_sent, expiry_reminder_sent

-- Plan Snapshot (Basic)
plan_name, plan_code, plan_version

-- Pricing Snapshot
base_price, discount_amount, final_price, currency
billing_cycle, duration_days

-- Portfolio Quotas Snapshot
max_published_portfolios
max_featured_portfolios

-- Features Snapshot
features (JSONB)

-- Payment
invoice_id, payment_method, transaction_id, amount_paid

-- Upgrade/Downgrade
previous_subscription_id, is_upgrade, is_downgrade, proration_credit

-- Metadata
metadata (JSONB)
notes

-- Audit
created_by, updated_by, deleted_by
created_at, updated_at, deleted_at
```


#### **ADD (Complete Snapshot)**
```sql
-- ✅ Add these snapshot fields

-- Category Snapshot
category_id INTEGER NOT NULL
  COMMENT 'Snapshot: Category ID'

category_name VARCHAR(255) NOT NULL
  COMMENT 'Snapshot: Category name'

category_slug VARCHAR(100) NOT NULL
  COMMENT 'Snapshot: Category slug'

-- Location Snapshot
city_tier INTEGER NOT NULL
  COMMENT 'Snapshot: City tier (1, 2, 3, 4, 5)'

-- Album Quotas Snapshot
max_albums_per_portfolio INTEGER NOT NULL DEFAULT 0
  COMMENT 'Snapshot: Max albums per portfolio'

-- Media Quotas Snapshot
max_photos_per_album INTEGER NOT NULL DEFAULT 0
  COMMENT 'Snapshot: Max photos per album'

max_videos_per_album INTEGER NOT NULL DEFAULT 0
  COMMENT 'Snapshot: Max videos per album'

max_total_media_items INTEGER NULL
  COMMENT 'Snapshot: Total media items (NULL = unlimited)'

max_storage_mb INTEGER NULL
  COMMENT 'Snapshot: Max storage in MB (NULL = unlimited)'

-- Video Permissions Snapshot
allow_videos BOOLEAN NOT NULL DEFAULT false
  COMMENT 'Snapshot: Videos allowed'

-- Media File Size Snapshot (Single column)
max_media_file_size_mb INTEGER NULL
  COMMENT 'Snapshot: Max file size in MB for photos/videos'

-- Boost Features Snapshot
max_boosted_portfolios INTEGER NOT NULL DEFAULT 0
  COMMENT 'Snapshot: Max boosted portfolios'

boosted_days INTEGER NOT NULL DEFAULT 0
  COMMENT 'Snapshot: Boosted duration days'

-- Platform Recommendation Snapshot
can_be_recommended BOOLEAN NOT NULL DEFAULT false
  COMMENT 'Snapshot: Can be platform recommended'

-- Visibility Snapshot
priority_score INTEGER NOT NULL DEFAULT 0
  COMMENT 'Snapshot: Priority score'

search_boost_multiplier DECIMAL(5,2) NOT NULL DEFAULT 1.0
  COMMENT 'Snapshot: Search boost multiplier'

national_visibility BOOLEAN NOT NULL DEFAULT false
  COMMENT 'Snapshot: National visibility'

featured_days INTEGER NOT NULL DEFAULT 0
  COMMENT 'Snapshot: Featured duration days'

-- Republish Snapshot
max_republish_count INTEGER NOT NULL DEFAULT 0
  COMMENT 'Snapshot: Max republish count (0 = unlimited)'

republish_cooldown_days INTEGER NOT NULL DEFAULT 7
  COMMENT 'Snapshot: Republish cooldown days'

-- Management Snapshot
is_auto_approve_enabled BOOLEAN NOT NULL DEFAULT false
  COMMENT 'Snapshot: Auto-approve enabled'

support_level VARCHAR(20) NOT NULL DEFAULT 'standard'
  COMMENT 'Snapshot: Support level'

-- Usage Tracking (NEW)
storage_used_mb DECIMAL(10,2) NOT NULL DEFAULT 0.00
  COMMENT 'Current storage usage in MB'

portfolios_published_count INTEGER NOT NULL DEFAULT 0
  COMMENT 'Current published portfolios count'

portfolios_featured_count INTEGER NOT NULL DEFAULT 0
  COMMENT 'Current featured portfolios count'

portfolios_boosted_count INTEGER NOT NULL DEFAULT 0
  COMMENT 'Current boosted portfolios count'
```


---

## 📋 **RECOMMENDED QUOTA VALUES**

### **Wedding Service Plans**

| Field | Free | Basic | Standard | Premium |
|-------|------|-------|----------|---------|
| **Portfolios** |
| max_published_portfolios | 1 | 3 | 5 | 10 |
| max_featured_portfolios | 0 | 1 | 3 | 5 |
| featured_days | 0 | 7 | 15 | 30 |
| max_boosted_portfolios | 0 | 1 | 2 | 5 |
| boosted_days | 0 | 3 | 7 | 15 |
| can_be_recommended | false | false | true | true |
| **Albums** |
| max_albums_per_portfolio | 1 | 3 | 5 | 10 |
| **Photos** |
| max_photos_per_album | 10 | 20 | 30 | 50 |
| **Videos** |
| allow_videos | false | true | true | true |
| max_videos_per_album | 0 | 2 | 5 | 10 |
| **Media File Size** |
| max_media_file_size_mb | 5 | 10 | 20 | 50 |
| **Total** |
| max_total_media_items | 10 | 50 | 150 | NULL |
| max_storage_mb | 50 | 200 | 500 | 2048 |
| **Republish** |
| max_republish_count | 0 | 3 | 10 | 0 (unlimited) |
| republish_cooldown_days | 30 | 14 | 7 | 3 |
| **Visibility** |
| priority_score | 0 | 10 | 25 | 50 |
| search_boost_multiplier | 1.0 | 1.2 | 1.5 | 2.0 |
| national_visibility | false | false | true | true |
| **Management** |
| is_auto_approve_enabled | false | false | false | true |
| support_level | none | standard | priority | dedicated |

### **City Tier Pricing Multipliers**

| City Tier | Multiplier | Example Cities |
|-----------|------------|----------------|
| Tier 1 | 1.5x | Mumbai, Delhi, Bangalore |
| Tier 2 | 1.2x | Pune, Jaipur, Chandigarh |
| Tier 3 | 1.0x | Smaller cities |


---

## 🔄 **MIGRATION STRATEGY**

### **Step 1: Backup Current Data**
```sql
-- Backup existing plans
CREATE TABLE subscription_plans_backup AS SELECT * FROM subscription_plans;

-- Backup existing subscriptions
CREATE TABLE user_subscriptions_backup AS SELECT * FROM user_subscriptions;
```

### **Step 2: Add New Fields to subscription_plans**
```sql
-- Add category slug
ALTER TABLE subscription_plans 
ADD COLUMN category_slug VARCHAR(100);

-- Add album quotas
ALTER TABLE subscription_plans 
ADD COLUMN max_albums_per_portfolio INTEGER NOT NULL DEFAULT 0;

-- Add media quotas
ALTER TABLE subscription_plans 
ADD COLUMN max_photos_per_album INTEGER NOT NULL DEFAULT 0,
ADD COLUMN max_videos_per_album INTEGER NOT NULL DEFAULT 0,
ADD COLUMN max_total_media_items INTEGER NULL;

-- Add video permissions
ALTER TABLE subscription_plans 
ADD COLUMN allow_videos BOOLEAN NOT NULL DEFAULT false;

-- Add media file size (single column for all media)
ALTER TABLE subscription_plans 
ADD COLUMN max_media_file_size_mb INTEGER NULL;

-- Add image dimensions
ALTER TABLE subscription_plans 
ADD COLUMN max_image_width INTEGER NULL,
ADD COLUMN max_image_height INTEGER NULL;

-- Add boost features
ALTER TABLE subscription_plans 
ADD COLUMN max_boosted_portfolios INTEGER NOT NULL DEFAULT 0,
ADD COLUMN boosted_days INTEGER NOT NULL DEFAULT 0;

-- Add platform recommendation
ALTER TABLE subscription_plans 
ADD COLUMN can_be_recommended BOOLEAN NOT NULL DEFAULT false;
```

### **Step 3: Remove Old Fields from subscription_plans**
```sql
ALTER TABLE subscription_plans 
DROP COLUMN IF EXISTS max_homepage_portfolios,
DROP COLUMN IF EXISTS portfolios_quota_rolling_days;
```


### **Step 4: Add Snapshot Fields to user_subscriptions**
```sql
-- Add category snapshot
ALTER TABLE user_subscriptions 
ADD COLUMN category_id INTEGER NOT NULL DEFAULT 0,
ADD COLUMN category_name VARCHAR(255) NOT NULL DEFAULT '',
ADD COLUMN category_slug VARCHAR(100) NOT NULL DEFAULT '';

-- Add location snapshot
ALTER TABLE user_subscriptions 
ADD COLUMN city_tier INTEGER NOT NULL DEFAULT 3;

-- Add album quotas snapshot
ALTER TABLE user_subscriptions 
ADD COLUMN max_albums_per_portfolio INTEGER NOT NULL DEFAULT 0;

-- Add media quotas snapshot
ALTER TABLE user_subscriptions 
ADD COLUMN max_photos_per_album INTEGER NOT NULL DEFAULT 0,
ADD COLUMN max_videos_per_album INTEGER NOT NULL DEFAULT 0,
ADD COLUMN max_total_media_items INTEGER NULL,
ADD COLUMN max_storage_mb INTEGER NULL;

-- Add video permissions snapshot
ALTER TABLE user_subscriptions 
ADD COLUMN allow_videos BOOLEAN NOT NULL DEFAULT false;

-- Add media file size snapshot (single column)
ALTER TABLE user_subscriptions 
ADD COLUMN max_media_file_size_mb INTEGER NULL;

-- Add boost features snapshot
ALTER TABLE user_subscriptions 
ADD COLUMN max_boosted_portfolios INTEGER NOT NULL DEFAULT 0,
ADD COLUMN boosted_days INTEGER NOT NULL DEFAULT 0;

-- Add platform recommendation snapshot
ALTER TABLE user_subscriptions 
ADD COLUMN can_be_recommended BOOLEAN NOT NULL DEFAULT false;

-- Add visibility snapshot
ALTER TABLE user_subscriptions 
ADD COLUMN priority_score INTEGER NOT NULL DEFAULT 0,
ADD COLUMN search_boost_multiplier DECIMAL(5,2) NOT NULL DEFAULT 1.0,
ADD COLUMN national_visibility BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN featured_days INTEGER NOT NULL DEFAULT 0;

-- Add republish snapshot
ALTER TABLE user_subscriptions 
ADD COLUMN max_republish_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN republish_cooldown_days INTEGER NOT NULL DEFAULT 7;

-- Add management snapshot
ALTER TABLE user_subscriptions 
ADD COLUMN is_auto_approve_enabled BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN support_level VARCHAR(20) NOT NULL DEFAULT 'standard';

-- Add usage tracking
ALTER TABLE user_subscriptions 
ADD COLUMN storage_used_mb DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN portfolios_published_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN portfolios_featured_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN portfolios_boosted_count INTEGER NOT NULL DEFAULT 0;
```


### **Step 5: Update Existing Data**
```sql
-- Update category_slug in subscription_plans
UPDATE subscription_plans sp
SET category_slug = c.slug
FROM categories c
WHERE sp.category_id = c.id;

-- Make category_slug NOT NULL after data migration
ALTER TABLE subscription_plans 
ALTER COLUMN category_slug SET NOT NULL;

-- Update existing user_subscriptions with snapshot data
UPDATE user_subscriptions us
SET 
  category_id = sp.category_id,
  category_name = sp.category_name,
  category_slug = sp.category_slug,
  city_tier = sp.city_tier,
  max_albums_per_portfolio = sp.max_albums_per_portfolio,
  max_photos_per_album = sp.max_photos_per_album,
  max_videos_per_album = sp.max_videos_per_album,
  max_total_media_items = sp.max_total_media_items,
  max_storage_mb = sp.max_storage_mb,
  allow_videos = sp.allow_videos,
  max_media_file_size_mb = sp.max_media_file_size_mb,
  max_boosted_portfolios = sp.max_boosted_portfolios,
  boosted_days = sp.boosted_days,
  can_be_recommended = sp.can_be_recommended,
  priority_score = sp.priority_score,
  search_boost_multiplier = sp.search_boost_multiplier,
  national_visibility = sp.national_visibility,
  featured_days = sp.featured_days,
  max_republish_count = sp.max_republish_count,
  republish_cooldown_days = sp.republish_cooldown_days,
  is_auto_approve_enabled = sp.is_auto_approve_enabled,
  support_level = sp.support_level
FROM subscription_plans sp
WHERE us.plan_id = sp.id;
```

### **Step 6: Add Indexes**
```sql
-- Add index on category_slug
CREATE INDEX idx_subscription_plans_category_slug 
ON subscription_plans(category_slug);

-- Add composite index for category + tier lookup
CREATE UNIQUE INDEX idx_subscription_plans_category_slug_tier 
ON subscription_plans(category_slug, city_tier) 
WHERE deleted_at IS NULL;

-- Add index on user_subscriptions category
CREATE INDEX idx_user_subscriptions_category_id 
ON user_subscriptions(category_id);

-- Add index for quota queries
CREATE INDEX idx_user_subscriptions_user_category_status 
ON user_subscriptions(user_id, category_id, status);
```


---

## 💡 **WHY SNAPSHOT EVERYTHING?**

### **Benefits of Complete Snapshot:**

1. **Historical Accuracy** ✅
   - User's subscription terms never change
   - Even if plan is updated/deleted, user keeps original terms
   - Audit trail for disputes

2. **Performance** ✅
   - No JOIN needed to check quotas
   - Single table query for all limits
   - Faster quota validation

3. **Plan Evolution** ✅
   - Plans can be updated without affecting existing users
   - Old plans can be deprecated safely
   - Version tracking works correctly

4. **Simplified Logic** ✅
   - All quota checks in one place
   - No "which plan version?" confusion
   - Clear contract between user and platform

### **Example Query (With Snapshot):**
```javascript
// Fast - Single table query
const subscription = await UserSubscription.findOne({
  where: { userId, status: 'active' }
});

// All quotas available immediately
const canUpload = subscription.max_photos_per_album > currentCount;
const hasStorage = subscription.storage_used_mb < subscription.max_storage_mb;
```

### **Example Query (Without Snapshot):**
```javascript
// Slow - Requires JOIN
const subscription = await UserSubscription.findOne({
  where: { userId, status: 'active' },
  include: [{ model: SubscriptionPlan, as: 'plan' }]
});

// What if plan was updated? Which values to use?
const canUpload = subscription.plan.max_photos_per_album > currentCount;
```


---

## 🎯 **IMPLEMENTATION CHECKLIST**

### **Phase 1: Database Schema** 🔧
- [ ] Create backup tables
- [ ] Create migration file for subscription_plans changes
- [ ] Create migration file for user_subscriptions changes
- [ ] Test migration on development database
- [ ] Update SubscriptionPlan model
- [ ] Update UserSubscription model

### **Phase 2: Seeders** 📝
- [ ] Remove old category seeders (cars, properties)
- [ ] Create wedding categories seeder
- [ ] Update subscription plans seeder with new quotas
- [ ] Add all 4 tiers × wedding categories
- [ ] Test seeder execution

### **Phase 3: Service Layer** 💼
- [ ] Create SubscriptionService with snapshot logic
- [ ] Implement createSubscription() - copies all plan fields
- [ ] Implement checkPortfolioQuota()
- [ ] Implement checkAlbumQuota()
- [ ] Implement checkPhotoQuota()
- [ ] Implement checkVideoQuota()
- [ ] Implement checkStorageQuota()
- [ ] Implement updateUsageTracking()

### **Phase 4: Testing** ✅
- [ ] Test plan creation with all quotas
- [ ] Test subscription creation with snapshot
- [ ] Test quota validation logic
- [ ] Test usage tracking updates
- [ ] Test plan updates don't affect existing subscriptions

---

## 📊 **FINAL STRUCTURE SUMMARY**

### **subscription_plans (Master Template)**
```
Core: id, plan_code, version, name, slug, description
Pricing: base_price, discount_amount, final_price, currency, duration_days
Category: category_id, category_name, category_slug, city_tier
Quotas: 
  - max_published_portfolios
  - max_albums_per_portfolio
  - max_photos_per_album
  - max_videos_per_album
  - max_total_media_items
  - max_storage_mb
  - max_featured_portfolios
  - featured_days
  - max_boosted_portfolios
  - boosted_days
Permissions: allow_videos, max_media_file_size_mb
Restrictions: max_image_width, max_image_height
Visibility: priority_score, search_boost_multiplier, national_visibility
Recommendation: can_be_recommended
Republish: max_republish_count, republish_cooldown_days
Management: is_auto_approve_enabled, support_level
Features: features (JSONB), metadata (JSONB)
Status: is_active, is_public, is_default
```


### **user_subscriptions (User's Contract Snapshot)**
```
Core: id, user_id, plan_id, status, ends_at, activated_at
Plan Snapshot: plan_name, plan_code, plan_version
Pricing Snapshot: base_price, discount_amount, final_price, currency, duration_days
Category Snapshot: category_id, category_name, category_slug, city_tier
Quotas Snapshot: 
  - max_published_portfolios
  - max_albums_per_portfolio
  - max_photos_per_album
  - max_videos_per_album
  - max_total_media_items
  - max_storage_mb
  - max_featured_portfolios
  - featured_days
  - max_boosted_portfolios
  - boosted_days
Permissions Snapshot: allow_videos, max_media_file_size_mb
Visibility Snapshot: priority_score, search_boost_multiplier, national_visibility
Recommendation Snapshot: can_be_recommended
Republish Snapshot: max_republish_count, republish_cooldown_days
Management Snapshot: is_auto_approve_enabled, support_level
Usage Tracking: 
  - storage_used_mb
  - portfolios_published_count
  - portfolios_featured_count
  - portfolios_boosted_count
Features Snapshot: features (JSONB)
Payment: invoice_id, payment_method, transaction_id, amount_paid
Lifecycle: is_trial, auto_renew, cancelled_at, cancellation_reason
Upgrade: previous_subscription_id, is_upgrade, is_downgrade, proration_credit
```

---

## � **PORTFOLIO UPGRADE LOGIC**

### **Free to Paid Upgrade (Same Category)**

When a user upgrades from free to paid plan:

1. **Category Restriction** ✅
   - User can ONLY upgrade within the same category
   - Photography free → Photography paid ✅
   - Photography free → Venue paid ❌

2. **Portfolio Migration**
   - Existing portfolios stay linked to old subscription
   - New portfolios use new subscription
   - OR: Update `user_subscription_id` on portfolios to new subscription

3. **Quota Validation**
   ```javascript
   // Check if existing portfolios fit in new plan
   const existingPublished = await Portfolio.count({
     where: { 
       userId, 
       categoryId: newPlan.categoryId,
       status: 'published' 
     }
   });
   
   if (existingPublished > newPlan.max_published_portfolios) {
     throw new Error('Too many existing portfolios for new plan');
   }
   ```

4. **Subscription Chain**
   ```javascript
   // Link subscriptions
   newSubscription.previous_subscription_id = oldSubscription.id;
   newSubscription.is_upgrade = true;
   
   // Deactivate old subscription
   oldSubscription.status = 'cancelled';
   oldSubscription.cancelled_at = new Date();
   ```

### **Implementation Example**

```javascript
async upgradeSubscription(userId, newPlanId) {
  // 1. Get current active subscription
  const currentSub = await UserSubscription.findOne({
    where: { userId, status: 'active' },
    include: [{ model: SubscriptionPlan, as: 'plan' }]
  });
  
  // 2. Get new plan
  const newPlan = await SubscriptionPlan.findByPk(newPlanId);
  
  // 3. Validate same category
  if (currentSub.category_id !== newPlan.category_id) {
    throw new Error('Can only upgrade within same category');
  }
  
  // 4. Check portfolio count
  const publishedCount = await Portfolio.count({
    where: { 
      userId, 
      categoryId: newPlan.category_id,
      status: 'published' 
    }
  });
  
  if (publishedCount > newPlan.max_published_portfolios) {
    throw new Error(`You have ${publishedCount} portfolios but new plan allows ${newPlan.max_published_portfolios}`);
  }
  
  // 5. Create new subscription with snapshot
  const newSub = await UserSubscription.create({
    userId,
    planId: newPlanId,
    previous_subscription_id: currentSub.id,
    is_upgrade: true,
    status: 'active',
    // ... copy all plan fields as snapshot
  });
  
  // 6. Cancel old subscription
  await currentSub.update({
    status: 'cancelled',
    cancelled_at: new Date()
  });
  
  return newSub;
}
```

---

## �🚀 **NEXT STEPS**

**Immediate Actions:**
1. Review and approve this updated proposal
2. Create migration files (add/remove fields)
3. Update models (SubscriptionPlan, UserSubscription)
4. Create SubscriptionService with upgrade logic
5. Test on development database

**Key Changes from Original:**
1. ✅ Added boost features (max_boosted_portfolios, boosted_days)
2. ✅ Added platform recommendation (can_be_recommended)
3. ✅ Unified media file size (max_media_file_size_mb) - single column
4. ✅ Kept republish fields (max_republish_count, republish_cooldown_days)
5. ✅ Added upgrade logic (same category only)
6. ✅ Removed seeders from scope (will handle separately)

**Questions Resolved:**
1. ✅ Boost available - Added max_boosted_portfolios + boosted_days
2. ✅ Platform recommended - Added can_be_recommended flag
3. ✅ Single storage column - max_media_file_size_mb for all media
4. ✅ Republish logic - Kept fields, will use last_republished_at from portfolios table
5. ✅ Upgrade logic - Same category only, with validation

---

**Status:** Updated and ready for implementation.
