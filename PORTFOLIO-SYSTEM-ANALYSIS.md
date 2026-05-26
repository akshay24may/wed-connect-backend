# Portfolio System Analysis

## 📊 Current Status: System Readiness Check

### ✅ **WHAT'S IN PLACE**

#### 1. **Database Schema** ✅
All required tables exist with proper structure:

- ✅ **portfolios** - Main portfolio table
- ✅ **portfolio_albums** - Album organization
- ✅ **portfolio_media** - Photos/videos storage
- ✅ **subscription_plans** - Plan definitions with quotas
- ✅ **user_subscriptions** - User's active subscriptions
- ✅ **categories** - Service categories (Photography, Venues, etc.)
- ✅ **cities** - City tier classification

#### 2. **Models** ✅
All Sequelize models are properly defined:

- ✅ `Portfolio.js` - Complete with associations
- ✅ `PortfolioAlbum.js` - Album structure
- ✅ `PortfolioMedia.js` - Media management
- ✅ `SubscriptionPlan.js` - Plan configuration
- ✅ `UserSubscription.js` - User subscription tracking
- ✅ `Category.js` - Category with subtypes
- ✅ `City.js` - City with tier

#### 3. **Relationships** ✅
All associations are properly configured:

```javascript
Portfolio → User (belongsTo)
Portfolio → Category (belongsTo)
Portfolio → City (belongsTo)
Portfolio → UserSubscription (belongsTo)
Portfolio → PortfolioMedia (hasMany)
Portfolio → PortfolioAlbum (hasMany via media)

PortfolioAlbum → Portfolio (belongsTo)
PortfolioAlbum → User (belongsTo)
PortfolioAlbum → PortfolioMedia (hasMany)

PortfolioMedia → Portfolio (belongsTo)
PortfolioMedia → PortfolioAlbum (belongsTo)

UserSubscription → User (belongsTo)
UserSubscription → SubscriptionPlan (belongsTo)
UserSubscription → Portfolio (hasMany)
```

---

## 🎯 **YOUR REQUIREMENTS ANALYSIS**

### 1. **Can a user create multiple portfolios?** ✅ YES

**Database Support:**
- `portfolios.user_id` - BIGINT (allows multiple portfolios per user)
- No unique constraint on `user_id`
- Each portfolio is independent

**Quota Control:**
- Controlled by `subscription_plans.max_published_portfolios`
- Only **published** portfolios count toward quota
- Draft/pending/rejected don't count

**Example from Subscription Plans:**
```javascript
Free Plan: max_published_portfolios = 1
Basic Plan: max_published_portfolios = 15
Standard Plan: max_published_portfolios = 30
Premium Plan: max_published_portfolios = 50
```

**Status:** ✅ **FULLY SUPPORTED**

---

### 2. **Portfolio should have cover photo** ✅ YES

**Database Fields:**
```javascript
portfolios.cover_image - VARCHAR(500) - Relative path
portfolios.cover_image_storage_type - ENUM - Storage type
```

**Model Getter:**
```javascript
coverImage: {
  get() {
    const rawValue = this.getDataValue('coverImage');
    const storageType = this.getDataValue('coverImageStorageType');
    return getFullUrl(rawValue, storageType);
  }
}
```

**Storage Types Supported:**
- local
- cloudinary
- aws_s3
- cloudflare_r2
- gcs
- azure_blob
- digital_ocean
- backblaze_b2
- external
- other

**Status:** ✅ **FULLY SUPPORTED**

---

### 3. **Portfolio will have multiple albums** ✅ YES

**Database Table:** `portfolio_albums`

**Structure:**
```javascript
id - BIGINT (Primary Key)
portfolio_id - BIGINT (FK to portfolios)
user_id - BIGINT (FK to users)
album_name - VARCHAR(200)
album_description - TEXT
album_slug - VARCHAR(250)
cover_photo_one - TEXT (with getter)
cover_photo_two - TEXT (with getter)
cover_photo_three - TEXT (with getter)
cover_photos_storage_type - ENUM
media_count - INTEGER (tracks number of media)
display_order - INTEGER (for sorting)
is_featured - BOOLEAN
is_public - BOOLEAN
```

**Relationships:**
```javascript
PortfolioAlbum → Portfolio (belongsTo)
PortfolioAlbum → PortfolioMedia (hasMany)
```

**Status:** ✅ **FULLY SUPPORTED**

---

### 4. **Each album will have cover photo** ✅ YES (3 cover photos!)

**Database Fields:**
```javascript
portfolio_albums.cover_photo_one - TEXT
portfolio_albums.cover_photo_two - TEXT
portfolio_albums.cover_photo_three - TEXT
portfolio_albums.cover_photos_storage_type - ENUM
```

**Model Getters:**
All three cover photos have getters that transform to full URLs:
```javascript
coverPhotoOne: {
  get() {
    const rawValue = this.getDataValue('coverPhotoOne');
    const storageType = this.getDataValue('coverPhotosStorageType');
    return getFullUrl(rawValue, storageType);
  }
}
// Same for coverPhotoTwo and coverPhotoThree
```

**Status:** ✅ **FULLY SUPPORTED** (even better - 3 cover photos per album!)

---

### 5. **Quotas depend on subscription tier** ⚠️ PARTIALLY SUPPORTED

#### ✅ **What's Supported:**

**A. Portfolio Count Quota** ✅
```javascript
subscription_plans.max_published_portfolios - INTEGER
```
- Controls how many portfolios can be published
- Tracked per subscription

**B. Featured Portfolio Quota** ✅
```javascript
subscription_plans.max_featured_portfolios - INTEGER
subscription_plans.featured_days - INTEGER
```
- Controls featured portfolio limits
- Duration tracking

**C. Storage Quota** ✅
```javascript
subscription_plans.max_storage_mb - INTEGER (nullable)
```
- Total storage limit in MB
- NULL = unlimited

**D. Category-Based Plans** ✅
```javascript
subscription_plans.category_id - INTEGER (FK to categories)
subscription_plans.category_name - VARCHAR(255)
```
- Each plan is tied to a specific category
- Photography plan separate from Venue plan

**E. City Tier-Based Plans** ✅
```javascript
subscription_plans.city_tier - INTEGER (1, 2, or 3)
cities.city_tier - VARCHAR(20) (tier_1, tier_2, tier_3, tier_4, tier_5)
```
- Plans vary by city tier
- Tier 1 cities = higher pricing
- Tier 3 cities = lower pricing

---

#### ❌ **What's MISSING:**

**A. Album Count Quota** ❌
```
MISSING: subscription_plans.max_albums_per_portfolio
```
- No field to limit number of albums per portfolio
- Currently unlimited albums

**B. Photos Per Album Quota** ❌
```
MISSING: subscription_plans.max_photos_per_album
```
- No field to limit photos in each album
- Currently unlimited photos per album

**C. Videos Per Album Quota** ❌
```
MISSING: subscription_plans.max_videos_per_album
```
- No field to limit videos in each album
- Currently unlimited videos per album

**D. Total Media Count Quota** ❌
```
MISSING: subscription_plans.max_total_media_items
```
- No field to limit total photos + videos across all portfolios
- Only storage size limit exists

**E. Media Type Restrictions** ❌
```
MISSING: subscription_plans.allow_videos
MISSING: subscription_plans.max_video_duration_seconds
MISSING: subscription_plans.max_video_size_mb
```
- No field to control video permissions
- No video-specific limits

---

## 🔧 **WHAT NEEDS TO BE ADDED**

### Database Schema Changes Required:

#### 1. Add to `subscription_plans` table:

```sql
-- Album quotas
ALTER TABLE subscription_plans ADD COLUMN max_albums_per_portfolio INTEGER NOT NULL DEFAULT 0;

-- Media quotas
ALTER TABLE subscription_plans ADD COLUMN max_photos_per_album INTEGER NOT NULL DEFAULT 0;
ALTER TABLE subscription_plans ADD COLUMN max_videos_per_album INTEGER NOT NULL DEFAULT 0;
ALTER TABLE subscription_plans ADD COLUMN max_total_media_items INTEGER NULL; -- NULL = unlimited

-- Video restrictions
ALTER TABLE subscription_plans ADD COLUMN allow_videos BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE subscription_plans ADD COLUMN max_video_duration_seconds INTEGER NULL;
ALTER TABLE subscription_plans ADD COLUMN max_video_size_mb INTEGER NULL;
ALTER TABLE subscription_plans ADD COLUMN max_photo_size_mb INTEGER NULL;

-- Media dimensions
ALTER TABLE subscription_plans ADD COLUMN max_image_width INTEGER NULL;
ALTER TABLE subscription_plans ADD COLUMN max_image_height INTEGER NULL;
```

#### 2. Update `SubscriptionPlan` model:

Add these fields to the model definition with proper field mappings.

#### 3. Update seeders:

Add quota values for each plan tier:

```javascript
Free Plan:
  max_albums_per_portfolio: 1
  max_photos_per_album: 10
  max_videos_per_album: 0
  allow_videos: false
  max_total_media_items: 10

Basic Plan:
  max_albums_per_portfolio: 3
  max_photos_per_album: 20
  max_videos_per_album: 2
  allow_videos: true
  max_total_media_items: 50

Standard Plan:
  max_albums_per_portfolio: 5
  max_photos_per_album: 30
  max_videos_per_album: 5
  allow_videos: true
  max_total_media_items: 150

Premium Plan:
  max_albums_per_portfolio: 10
  max_photos_per_album: 50
  max_videos_per_album: 10
  allow_videos: true
  max_total_media_items: null (unlimited)
```

---

## 📋 **IMPLEMENTATION CHECKLIST**

### Phase 1: Fix Missing Utility ✅
- [ ] Copy `storageHelper.js` from backup to `src/utils/`
- [ ] Test all models that use `getFullUrl()`

### Phase 2: Add Missing Quota Fields ⚠️
- [ ] Create migration to add quota fields to `subscription_plans`
- [ ] Update `SubscriptionPlan` model
- [ ] Update subscription plan seeders with quota values
- [ ] Run migration and seeders

### Phase 3: Implement Portfolio CRUD 🚧
- [ ] Create `portfolioService.js`
- [ ] Create `portfolioRepository.js`
- [ ] Create `portfolioController.js` (vendor)
- [ ] Create `portfolioRoutes.js` (vendor)
- [ ] Implement quota checking logic

### Phase 4: Implement Album Management 🚧
- [ ] Create `portfolioAlbumService.js`
- [ ] Create `portfolioAlbumRepository.js`
- [ ] Create album endpoints in portfolio controller
- [ ] Implement album quota checking

### Phase 5: Implement Media Upload 🚧
- [ ] Create `portfolioMediaService.js`
- [ ] Create `portfolioMediaRepository.js`
- [ ] Create media upload endpoints
- [ ] Implement media quota checking
- [ ] Implement storage size tracking

### Phase 6: Documentation 📝
- [ ] Create `API-Docs/portfolios.md`
- [ ] Create `API-Docs/portfolio-albums.md`
- [ ] Create `API-Docs/portfolio-media.md`

---

## 🎯 **SUMMARY**

### ✅ **Ready (80%)**
1. Database schema for portfolios, albums, media
2. Subscription plans with category + city tier
3. Basic quota fields (portfolio count, storage size)
4. All models and associations
5. Multiple portfolios per user
6. Portfolio cover photo
7. Multiple albums per portfolio
8. Album cover photos (3 per album!)

### ⚠️ **Needs Work (20%)**
1. Missing quota fields for albums/photos/videos
2. No portfolio service/repository/controller
3. No album management endpoints
4. No media upload endpoints
5. No quota validation logic
6. Missing `storageHelper.js` utility

### 🚀 **Next Steps**
1. **Immediate:** Copy `storageHelper.js` utility
2. **High Priority:** Add missing quota fields to database
3. **High Priority:** Implement portfolio CRUD with quota checks
4. **Medium Priority:** Implement album management
5. **Medium Priority:** Implement media upload with quota validation

---

## 💡 **RECOMMENDATIONS**

### 1. **Quota Strategy**
Implement a centralized quota service:
```javascript
// src/services/quotaService.js
class QuotaService {
  async checkPortfolioQuota(userId, subscriptionId)
  async checkAlbumQuota(portfolioId, subscriptionId)
  async checkPhotoQuota(albumId, subscriptionId)
  async checkVideoQuota(albumId, subscriptionId)
  async checkStorageQuota(userId, subscriptionId, fileSize)
}
```

### 2. **Subscription Validation**
Always validate active subscription before portfolio operations:
```javascript
// Check if user has active subscription for category
const subscription = await UserSubscription.findOne({
  where: {
    userId,
    status: 'active',
    endsAt: { [Op.gt]: new Date() }
  },
  include: [{ model: SubscriptionPlan, as: 'plan' }]
});
```

### 3. **City Tier Matching**
Ensure portfolio city matches subscription plan's city tier:
```javascript
// Portfolio city tier must match subscription plan tier
const city = await City.findByPk(cityId);
if (city.cityTier !== subscription.plan.cityTier) {
  throw new Error('City tier mismatch with subscription plan');
}
```

### 4. **Storage Tracking**
Track storage usage in real-time:
```javascript
// Update user's total storage on media upload
await UserSubscription.increment('storageUsedMb', {
  by: fileSizeMb,
  where: { id: subscriptionId }
});
```

---

## 🔍 **CURRENT SEEDER DATA**

The current seeders create plans for **cars** and **properties** categories only.

**You need to:**
1. Update category seeder to include wedding categories
2. Update subscription plan seeder to create plans for wedding categories
3. Add appropriate quotas for photography/venue/catering plans

**Wedding Categories Needed:**
- Photography
- Videography
- Venues
- Catering
- Makeup Artists
- Decorators
- Mehndi Artists
- DJ/Music
- Wedding Planners
- Wedding Cars
- Gifts & Invites

Each category needs 4 plans (Free, Basic, Standard, Premium) × 3 city tiers = 12 plans per category.

---

**Status:** System is 80% ready. Main work needed is adding quota fields and implementing portfolio CRUD logic.
