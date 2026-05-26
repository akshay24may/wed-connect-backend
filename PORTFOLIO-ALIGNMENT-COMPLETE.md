# Portfolio Table & Model Alignment - COMPLETE ✅

## Summary

Successfully aligned the `portfolios` table migration and `Portfolio` model with all required features:
- ✅ Boost functionality
- ✅ Platform recommendation
- ✅ Rating normalization (denormalized for performance)
- ✅ Republish tracking (already existed)

## Changes Applied

### 1. Migration Updated
**File**: `migrations/20250314000001-create-portfolios-table.js`

**New Columns Added:**
```sql
-- Boost features
is_boosted BOOLEAN NOT NULL DEFAULT false
boosted_until TIMESTAMP

-- Platform recommendation
is_recommended BOOLEAN NOT NULL DEFAULT false
recommended_at TIMESTAMP

-- Rating normalization (denormalized)
average_rating DECIMAL(3, 2) NOT NULL DEFAULT 0.00
total_reviews INTEGER NOT NULL DEFAULT 0
rating_1_count INTEGER NOT NULL DEFAULT 0
rating_2_count INTEGER NOT NULL DEFAULT 0
rating_3_count INTEGER NOT NULL DEFAULT 0
rating_4_count INTEGER NOT NULL DEFAULT 0
rating_5_count INTEGER NOT NULL DEFAULT 0
```

**New Indexes Added:**
- `idx_portfolios_is_boosted` - Filter boosted portfolios
- `idx_portfolios_is_recommended` - Filter recommended portfolios
- `idx_portfolios_average_rating` - Sort by rating
- `idx_portfolios_total_reviews` - Sort by review count

**Check Constraints Added:**
- `check_average_rating_range` - Rating between 0 and 5
- `check_total_reviews_non_negative` - Non-negative review count
- `check_rating_1_count_non_negative` through `check_rating_5_count_non_negative` - Non-negative counts

### 2. Model Updated
**File**: `src/models/Portfolio.js`

**New Fields Added:**
```javascript
isBoosted: { type: DataTypes.BOOLEAN, field: 'is_boosted' }
boostedUntil: { type: DataTypes.DATE, field: 'boosted_until' }
isRecommended: { type: DataTypes.BOOLEAN, field: 'is_recommended' }
recommendedAt: { type: DataTypes.DATE, field: 'recommended_at' }
averageRating: { type: DataTypes.DECIMAL(3, 2), field: 'average_rating' }
totalReviews: { type: DataTypes.INTEGER, field: 'total_reviews' }
rating1Count: { type: DataTypes.INTEGER, field: 'rating_1_count' }
rating2Count: { type: DataTypes.INTEGER, field: 'rating_2_count' }
rating3Count: { type: DataTypes.INTEGER, field: 'rating_3_count' }
rating4Count: { type: DataTypes.INTEGER, field: 'rating_4_count' }
rating5Count: { type: DataTypes.INTEGER, field: 'rating_5_count' }
```

All fields properly mapped with `field: 'snake_case'` for database column names.

### 3. SQL Script Created
**File**: `APPLY-PORTFOLIO-CHANGES.sql`

For existing databases - adds all new columns, indexes, and constraints with verification query.

## Existing Features Confirmed

### Republish Tracking ✅
Already exists in both migration and model:
- `republish_count` (INTEGER) - Number of times republished
- `last_republished_at` (DATE) - Last republish timestamp
- `republish_history` (JSONB) - Full republish history with timestamps and user IDs

**Model Hook**: `beforeUpdate` hook automatically increments count and updates timestamp when `options.isRepublish = true`

### Cover Photo ✅
Already exists with storage type support:
- `cover_image` (STRING 500) - Relative path with extension
- `cover_image_storage_type` (ENUM) - Storage provider
- Model getter uses `getFullUrl()` to return full URL

## Feature Integration

### 1. Boost Feature
**Subscription Plan Fields** (already exist):
- `max_boosted_portfolios` - How many portfolios can be boosted
- `boosted_days` - Duration of boost in days

**Portfolio Fields** (newly added):
- `is_boosted` - Current boost status
- `boosted_until` - Boost expiration

**Logic Flow:**
1. Check `user_subscriptions.max_boosted_portfolios` quota
2. Check current boosted count: `Portfolio.count({ where: { userId, isBoosted: true } })`
3. Set `is_boosted = true` and `boosted_until = NOW() + boosted_days`
4. Cron job resets `is_boosted = false` when `boosted_until < NOW()`

### 2. Platform Recommendation
**Subscription Plan Field** (already exists):
- `can_be_recommended` - Whether subscription allows recommendation

**Portfolio Fields** (newly added):
- `is_recommended` - Recommendation status
- `recommended_at` - When recommended

**Logic Flow:**
1. Admin checks `user_subscriptions.can_be_recommended = true`
2. If eligible, admin sets `is_recommended = true` and `recommended_at = NOW()`
3. Recommended portfolios get priority in search results

### 3. Rating Normalization
**Portfolio Fields** (newly added):
- `average_rating` - Calculated average (0.00 to 5.00)
- `total_reviews` - Total review count
- `rating_1_count` through `rating_5_count` - Distribution

**Logic Flow** (when review created/updated/deleted):
```javascript
// Decrement old rating count (if updating/deleting)
if (oldRating) portfolio[`rating${oldRating}Count`]--;

// Increment new rating count (if creating/updating)
if (newRating) {
  portfolio[`rating${newRating}Count`]++;
  if (!oldRating) portfolio.totalReviews++;
}

// Decrement total if deleting
if (!newRating && oldRating) portfolio.totalReviews--;

// Recalculate average
const totalRating = 
  (portfolio.rating1Count * 1) +
  (portfolio.rating2Count * 2) +
  (portfolio.rating3Count * 3) +
  (portfolio.rating4Count * 4) +
  (portfolio.rating5Count * 5);

portfolio.averageRating = portfolio.totalReviews > 0 
  ? (totalRating / portfolio.totalReviews).toFixed(2)
  : 0.00;

await portfolio.save();
```

**Benefits:**
- Fast queries without JOIN to reviews table
- Efficient sorting by rating
- Rating distribution visible without aggregation

### 4. Republish Feature
**Subscription Plan Fields** (already exist):
- `max_republish_count` - How many times can republish
- `republish_cooldown_days` - Days between republishes

**Portfolio Fields** (already exist):
- `republish_count` - Current republish count
- `last_republished_at` - Last republish timestamp
- `republish_history` - Full history (JSONB)

**Logic Flow:**
1. Check `portfolio.republish_count < user_subscriptions.max_republish_count`
2. Check `last_republished_at + republish_cooldown_days < NOW()`
3. Call `portfolio.save({ isRepublish: true, userId })`
4. Hook automatically increments count and updates timestamp

## Database Schema Status

### Complete Portfolio Schema
```sql
-- Identity
id BIGINT PRIMARY KEY
user_id BIGINT FK → users
category_id INTEGER FK → categories
category_slug VARCHAR(100) FK → categories
user_subscription_id BIGINT FK → user_subscriptions

-- Content
title VARCHAR(200)
slug VARCHAR(250) UNIQUE
share_code VARCHAR(10) UNIQUE
description TEXT
keywords TEXT
service_details JSONB

-- Pricing
starting_price DECIMAL(15,2)
price_range_min DECIMAL(15,2)
price_range_max DECIMAL(15,2)
price_on_request BOOLEAN

-- Location
state_id INTEGER FK → states
city_id INTEGER FK → cities
state_slug VARCHAR(255)
city_slug VARCHAR(255)
locality VARCHAR(200)
address TEXT

-- Status & Workflow
status ENUM('draft', 'pending', 'published', 'rejected')
published_at TIMESTAMP
approved_at TIMESTAMP
approved_by BIGINT FK → users
rejected_at TIMESTAMP
rejected_by BIGINT FK → users
rejection_reason TEXT
is_auto_approved BOOLEAN

-- Visibility Features
is_featured BOOLEAN
featured_until TIMESTAMP
is_boosted BOOLEAN ✨ NEW
boosted_until TIMESTAMP ✨ NEW
is_recommended BOOLEAN ✨ NEW
recommended_at TIMESTAMP ✨ NEW

-- Engagement Metrics
view_count INTEGER
contact_count INTEGER
total_favorites INTEGER

-- Rating Normalization ✨ NEW
average_rating DECIMAL(3,2)
total_reviews INTEGER
rating_1_count INTEGER
rating_2_count INTEGER
rating_3_count INTEGER
rating_4_count INTEGER
rating_5_count INTEGER

-- Media
cover_image VARCHAR(500)
cover_image_storage_type ENUM(...)

-- Republish Tracking
republish_count INTEGER
last_republished_at TIMESTAMP
republish_history JSONB

-- Audit Fields
created_by BIGINT FK → users
updated_by BIGINT
deleted_by BIGINT FK → users
deleted_at TIMESTAMP
created_at TIMESTAMP
updated_at TIMESTAMP
```

## Next Steps

### Service Layer Implementation
1. **PortfolioService** - Core CRUD operations
2. **PortfolioBoostService** - Boost management
3. **PortfolioRecommendationService** - Recommendation management
4. **PortfolioRatingService** - Rating normalization updates
5. **PortfolioRepublishService** - Republish logic with quota checks

### Cron Jobs
1. **Expire Boosted Portfolios** - Reset `is_boosted` when `boosted_until < NOW()`
2. **Expire Featured Portfolios** - Reset `is_featured` when `featured_until < NOW()`

### API Endpoints
1. **Vendor Endpoints** - Boost own portfolios, republish
2. **Admin Endpoints** - Recommend portfolios, approve/reject
3. **Public Endpoints** - Search/filter with boost/recommendation priority

### Search & Filtering
Update search logic to prioritize:
1. Recommended portfolios (highest priority)
2. Boosted portfolios (high priority)
3. Featured portfolios (medium priority)
4. Regular portfolios sorted by rating/freshness

## Files Modified

1. ✅ `migrations/20250314000001-create-portfolios-table.js` - Added 11 columns, 4 indexes, 8 constraints
2. ✅ `src/models/Portfolio.js` - Added 11 fields with proper mapping
3. ✅ `APPLY-PORTFOLIO-CHANGES.sql` - SQL script for existing databases
4. ✅ `PORTFOLIO-CHANGES-SUMMARY.md` - Detailed change documentation
5. ✅ `PORTFOLIO-ALIGNMENT-COMPLETE.md` - This file

## Verification

### Model Registration
✅ Portfolio model is registered in `src/models/index.js`
✅ Associations are set up correctly

### Field Mapping
✅ All camelCase model fields map to snake_case database columns
✅ All fields have proper `field: 'snake_case'` mapping

### Indexes
✅ Performance indexes added for all new boolean and rating fields
✅ Existing indexes preserved (user_id, category_id, status, etc.)

### Constraints
✅ Check constraints ensure data integrity
✅ Foreign key constraints properly defined

## Status: READY FOR SERVICE LAYER IMPLEMENTATION ✅

The portfolios table and model are now fully aligned and ready for service layer implementation. All required columns exist, indexes are in place, and the model is properly configured.
