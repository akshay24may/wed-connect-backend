# One Subscription = One Portfolio - Final Schema ✅

## Key Concept

**One subscription = One portfolio**

This means:
- Each subscription allows creating/managing ONE portfolio
- No need for "max portfolios" counters
- Featured/Boosted become boolean flags (allowed or not)
- Simpler quota management

---

## Changes Applied

### 1. ❌ Removed Unnecessary Fields

**From subscription_plans:**
- ❌ `max_total_media_items` - Not needed (have `max_storage_mb`)
- ❌ `max_media_file_size_mb` - Not needed (have `max_storage_mb`)
- ❌ `max_image_width` - Not needed
- ❌ `max_image_height` - Not needed
- ❌ `max_featured_portfolios` - Changed to boolean
- ❌ `platform_notes` - Not needed

**From user_subscriptions:**
- ❌ `max_total_media_items` - Not needed
- ❌ `max_media_file_size_mb` - Not needed
- ❌ `max_featured_portfolios` - Changed to boolean
- ❌ `portfolios_featured_count` - Not needed (one portfolio only)
- ❌ `portfolios_boosted_count` - Not needed (one portfolio only)
- ❌ `featured_days` (duplicate) - Kept only one instance
- ❌ `platform_notes` - Not needed

**From portfolios:**
- ❌ `locality` - Keeping only `address`
- ❌ `platform_notes` - Not needed

---

### 2. ✅ Changed to Boolean Flags

**subscription_plans:**
```sql
-- OLD
max_featured_portfolios INTEGER DEFAULT 0
max_boosted_portfolios INTEGER DEFAULT 0

-- NEW
is_featured_allowed BOOLEAN DEFAULT false
is_boosted_allowed BOOLEAN DEFAULT false
```

**user_subscriptions:**
```sql
-- OLD
max_featured_portfolios INTEGER DEFAULT 0
max_boosted_portfolios INTEGER DEFAULT 0

-- NEW
is_featured_allowed BOOLEAN DEFAULT false
is_boosted_allowed BOOLEAN DEFAULT false
```

---

## Final Schema

### Subscription Plans

```sql
-- Portfolio Quotas
max_published_portfolios INTEGER DEFAULT 0  -- Usually 1 for one subscription = one portfolio
max_storage_mb INTEGER                      -- Total storage for portfolio media

-- Album & Media Quotas
max_albums_per_portfolio INTEGER DEFAULT 0
max_photos_per_album INTEGER DEFAULT 0
max_videos_per_album INTEGER DEFAULT 0
allow_videos BOOLEAN DEFAULT false

-- Featured & Promotional (BOOLEAN FLAGS)
is_featured_allowed BOOLEAN DEFAULT false   -- Can portfolio be featured?
featured_days INTEGER DEFAULT 0             -- Duration if allowed
is_boosted_allowed BOOLEAN DEFAULT false    -- Can portfolio be boosted?
boosted_days INTEGER DEFAULT 0              -- Duration if allowed
can_be_recommended BOOLEAN DEFAULT false    -- Can be platform recommended?

-- Republish
max_republish_count INTEGER DEFAULT 0
republish_cooldown_days INTEGER DEFAULT 7

-- Auto-Approve
is_auto_approve_enabled BOOLEAN DEFAULT false
```

### User Subscriptions (Snapshot)

```sql
-- Portfolio Quotas Snapshot
max_published_portfolios INTEGER DEFAULT 0
max_storage_mb INTEGER

-- Album & Media Quotas Snapshot
max_albums_per_portfolio INTEGER DEFAULT 0
max_photos_per_album INTEGER DEFAULT 0
max_videos_per_album INTEGER DEFAULT 0
allow_videos BOOLEAN DEFAULT false

-- Featured & Promotional Snapshot (BOOLEAN FLAGS)
is_featured_allowed BOOLEAN DEFAULT false
featured_days INTEGER DEFAULT 0
is_boosted_allowed BOOLEAN DEFAULT false
boosted_days INTEGER DEFAULT 0
can_be_recommended BOOLEAN DEFAULT false

-- Republish Snapshot
max_republish_count INTEGER DEFAULT 0
republish_cooldown_days INTEGER DEFAULT 7

-- Auto-Approve Snapshot
is_auto_approve_enabled BOOLEAN DEFAULT false

-- Usage Tracking
storage_used_mb DECIMAL(10,2) DEFAULT 0.00
portfolios_published_count INTEGER DEFAULT 0  -- Should be 0 or 1
```

### Portfolios

```sql
-- Location
state_id, city_id, state_slug, city_slug
address TEXT  -- Complete address (removed locality)

-- Visibility Features
is_featured BOOLEAN DEFAULT false
featured_until TIMESTAMP
is_boosted BOOLEAN DEFAULT false
boosted_until TIMESTAMP
is_recommended BOOLEAN DEFAULT false
recommended_at TIMESTAMP

-- Rating Normalization
average_rating DECIMAL(3,2) DEFAULT 0.00
total_reviews INTEGER DEFAULT 0
rating_distribution JSONB DEFAULT '{"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}'

-- Republish
republish_count INTEGER DEFAULT 0
last_republished_at TIMESTAMP
republish_history JSONB

-- Auto-Approve
is_auto_approved BOOLEAN DEFAULT false
```

---

## Usage Logic

### Feature Portfolio

```javascript
async featurePortfolio(portfolioId, userId) {
  const portfolio = await Portfolio.findByPk(portfolioId, {
    include: [{ model: UserSubscription, as: 'userSubscription' }]
  });
  
  const subscription = portfolio.userSubscription;
  
  // Check if featured is allowed
  if (!subscription.isFeaturedAllowed) {
    throw new Error('Featured not available in your plan');
  }
  
  // Check if already featured
  if (portfolio.isFeatured) {
    throw new Error('Portfolio is already featured');
  }
  
  // Set featured
  const featuredUntil = subscription.featuredDays > 0
    ? new Date(Date.now() + subscription.featuredDays * 24 * 60 * 60 * 1000)
    : null; // null = unlimited
  
  await portfolio.update({
    isFeatured: true,
    featuredUntil
  });
}
```

### Boost Portfolio

```javascript
async boostPortfolio(portfolioId, userId) {
  const portfolio = await Portfolio.findByPk(portfolioId, {
    include: [{ model: UserSubscription, as: 'userSubscription' }]
  });
  
  const subscription = portfolio.userSubscription;
  
  // Check if boost is allowed
  if (!subscription.isBoostedAllowed) {
    throw new Error('Boost not available in your plan');
  }
  
  // Check if boost days configured
  if (subscription.boostedDays === 0) {
    throw new Error('Boost duration not configured');
  }
  
  // Check if already boosted
  if (portfolio.isBoosted) {
    throw new Error('Portfolio is already boosted');
  }
  
  // Set boosted
  const boostedUntil = new Date(Date.now() + subscription.boostedDays * 24 * 60 * 60 * 1000);
  
  await portfolio.update({
    isBoosted: true,
    boostedUntil
  });
}
```

### Recommend Portfolio (Admin)

```javascript
async recommendPortfolio(portfolioId, adminUserId) {
  const portfolio = await Portfolio.findByPk(portfolioId, {
    include: [{ model: UserSubscription, as: 'userSubscription' }]
  });
  
  const subscription = portfolio.userSubscription;
  
  // Check if recommendation is allowed
  if (!subscription.canBeRecommended) {
    throw new Error('Portfolio subscription does not allow recommendation');
  }
  
  // Set recommended
  await portfolio.update({
    isRecommended: true,
    recommendedAt: new Date()
  });
}
```

---

## Subscription Plan Examples

### Free Plan
```javascript
{
  name: "Free",
  max_published_portfolios: 1,
  max_storage_mb: 100,
  max_albums_per_portfolio: 3,
  max_photos_per_album: 10,
  max_videos_per_album: 0,
  allow_videos: false,
  is_featured_allowed: false,
  is_boosted_allowed: false,
  can_be_recommended: false,
  max_republish_count: 1,
  republish_cooldown_days: 30,
  is_auto_approve_enabled: false
}
```

### Basic Plan
```javascript
{
  name: "Basic",
  max_published_portfolios: 1,
  max_storage_mb: 500,
  max_albums_per_portfolio: 5,
  max_photos_per_album: 20,
  max_videos_per_album: 5,
  allow_videos: true,
  is_featured_allowed: true,
  featured_days: 30,
  is_boosted_allowed: false,
  can_be_recommended: false,
  max_republish_count: 3,
  republish_cooldown_days: 15,
  is_auto_approve_enabled: false
}
```

### Premium Plan
```javascript
{
  name: "Premium",
  max_published_portfolios: 1,
  max_storage_mb: 2000,
  max_albums_per_portfolio: 10,
  max_photos_per_album: 50,
  max_videos_per_album: 20,
  allow_videos: true,
  is_featured_allowed: true,
  featured_days: 0, // unlimited
  is_boosted_allowed: true,
  boosted_days: 15,
  can_be_recommended: true,
  max_republish_count: 0, // unlimited
  republish_cooldown_days: 7,
  is_auto_approve_enabled: true
}
```

---

## Files Modified

### Migrations
1. ✅ `migrations/20250309000001-create-subscription-plans-table.js`
   - Removed 5 unnecessary fields
   - Changed `max_featured_portfolios` → `is_featured_allowed`
   - Changed `max_boosted_portfolios` → `is_boosted_allowed`
   - Removed `platform_notes`

2. ✅ `migrations/20250311000001-create-user-subscriptions-table.js`
   - Removed 6 unnecessary fields
   - Changed to boolean flags for featured/boosted
   - Removed duplicate `featured_days`
   - Removed usage tracking counters (not needed for one portfolio)
   - Removed `platform_notes`

3. ✅ `migrations/20250314000001-create-portfolios-table.js`
   - Removed `locality` (keeping only `address`)
   - Removed `platform_notes`

### Models
1. ✅ `src/models/SubscriptionPlan.js` - Updated fields
2. ✅ `src/models/UserSubscription.js` - Updated fields
3. ✅ `src/models/Portfolio.js` - Removed `platformNotes`

### SQL Scripts
1. ✅ `APPLY-SUBSCRIPTION-CHANGES.sql` - Complete refactoring script
2. ✅ `APPLY-PORTFOLIO-CHANGES.sql` - Updated to remove platform_notes

---

## Benefits of One Subscription = One Portfolio

1. **Simpler Logic**: No need to count portfolios, just check if one exists
2. **Boolean Flags**: Featured/Boosted become simple yes/no checks
3. **Cleaner Schema**: Removed unnecessary counter fields
4. **Easier Quota Management**: One portfolio = one set of quotas
5. **Better UX**: Users focus on perfecting ONE portfolio per subscription

---

## Status: COMPLETE ✅

All changes applied for "One Subscription = One Portfolio" model. Database schema is finalized and ready for service layer implementation.
