# Portfolio Features - Subscription Support Verification ✅

## Feature Support Matrix

| Portfolio Feature | Subscription Plans | User Subscriptions | Portfolio Table | Status |
|------------------|-------------------|-------------------|-----------------|--------|
| **Featured** | ✅ `max_featured_portfolios`, `featured_days` | ✅ Snapshot + usage tracking | ✅ `is_featured`, `featured_until` | **FULLY SUPPORTED** |
| **Boosted** | ✅ `max_boosted_portfolios`, `boosted_days` | ✅ Snapshot + usage tracking | ✅ `is_boosted`, `boosted_until` | **FULLY SUPPORTED** |
| **Recommended** | ✅ `can_be_recommended` | ✅ Snapshot field | ✅ `is_recommended`, `recommended_at` | **FULLY SUPPORTED** |
| **Auto-Approve** | ✅ `is_auto_approve_enabled` | ✅ Snapshot field | ✅ `is_auto_approved` | **FULLY SUPPORTED** |
| **Republish** | ✅ `max_republish_count`, `republish_cooldown_days` | ✅ Snapshot fields | ✅ `republish_count`, `last_republished_at`, `republish_history` | **FULLY SUPPORTED** |
| **Platform Notes** | ✅ `platform_notes` | ✅ `platform_notes` | ✅ `platform_notes` | **NEWLY ADDED** |

## All Features Are Fully Supported! ✅

### 1. Featured Portfolios ✅

**Subscription Plans:**
```sql
max_featured_portfolios INTEGER DEFAULT 0  -- How many portfolios can be featured
featured_days INTEGER DEFAULT 0            -- Duration of featured status (0 = unlimited)
```

**User Subscriptions (Snapshot):**
```sql
max_featured_portfolios INTEGER DEFAULT 0  -- Snapshot from plan
featured_days INTEGER DEFAULT 0            -- Snapshot from plan
portfolios_featured_count INTEGER DEFAULT 0 -- Current usage tracking
```

**Portfolio:**
```sql
is_featured BOOLEAN DEFAULT false
featured_until TIMESTAMP
```

**Logic:**
- Vendor marks portfolio as featured (up to `max_featured_portfolios` quota)
- Set `featured_until = NOW() + featured_days`
- Cron job expires featured status when `featured_until < NOW()`
- Track usage in `user_subscriptions.portfolios_featured_count`

---

### 2. Boosted Portfolios ✅

**Subscription Plans:**
```sql
max_boosted_portfolios INTEGER DEFAULT 0   -- How many portfolios can be boosted
boosted_days INTEGER DEFAULT 0             -- Duration of boost (0 = not available)
```

**User Subscriptions (Snapshot):**
```sql
max_boosted_portfolios INTEGER DEFAULT 0   -- Snapshot from plan
boosted_days INTEGER DEFAULT 0             -- Snapshot from plan
portfolios_boosted_count INTEGER DEFAULT 0 -- Current usage tracking
```

**Portfolio:**
```sql
is_boosted BOOLEAN DEFAULT false
boosted_until TIMESTAMP
```

**Logic:**
- Vendor boosts portfolio (up to `max_boosted_portfolios` quota)
- Set `boosted_until = NOW() + boosted_days`
- Cron job expires boost when `boosted_until < NOW()`
- Track usage in `user_subscriptions.portfolios_boosted_count`

---

### 3. Platform Recommended ✅

**Subscription Plans:**
```sql
can_be_recommended BOOLEAN DEFAULT false   -- Whether plan allows recommendation
```

**User Subscriptions (Snapshot):**
```sql
can_be_recommended BOOLEAN DEFAULT false   -- Snapshot from plan
```

**Portfolio:**
```sql
is_recommended BOOLEAN DEFAULT false
recommended_at TIMESTAMP
```

**Logic:**
- Admin checks if `user_subscriptions.can_be_recommended = true`
- If eligible, admin sets `is_recommended = true` and `recommended_at = NOW()`
- No expiration (manual removal only)
- Platform's editorial endorsement

---

### 4. Auto-Approve ✅

**Subscription Plans:**
```sql
is_auto_approve_enabled BOOLEAN DEFAULT false  -- If true, portfolios auto-approved
```

**User Subscriptions (Snapshot):**
```sql
is_auto_approve_enabled BOOLEAN DEFAULT false  -- Snapshot from plan
```

**Portfolio:**
```sql
is_auto_approved BOOLEAN DEFAULT false
status ENUM('draft', 'pending', 'published', 'rejected')
```

**Logic:**
- When portfolio is created/submitted, check `user_subscriptions.is_auto_approve_enabled`
- If true, set `status = 'published'` and `is_auto_approved = true`
- If false, set `status = 'pending'` (requires admin approval)

---

### 5. Republish ✅

**Subscription Plans:**
```sql
max_republish_count INTEGER DEFAULT 0      -- Max republishes (0 = unlimited)
republish_cooldown_days INTEGER DEFAULT 7  -- Days between republishes
```

**User Subscriptions (Snapshot):**
```sql
max_republish_count INTEGER DEFAULT 0      -- Snapshot from plan
republish_cooldown_days INTEGER DEFAULT 7  -- Snapshot from plan
```

**Portfolio:**
```sql
republish_count INTEGER DEFAULT 0
last_republished_at TIMESTAMP
republish_history JSONB
```

**Logic:**
- Check `portfolio.republish_count < user_subscriptions.max_republish_count`
- Check `last_republished_at + republish_cooldown_days < NOW()`
- Call `portfolio.save({ isRepublish: true, userId })`
- Hook automatically increments count and updates timestamp

---

### 6. Platform Notes ✅ (NEWLY ADDED)

**Subscription Plans:**
```sql
internal_notes TEXT                        -- General plan notes
platform_notes TEXT                        -- Platform-specific notes
```

**User Subscriptions:**
```sql
notes TEXT                                 -- User-facing or admin notes
platform_notes TEXT                        -- Internal platform notes (not visible to user)
```

**Portfolio:**
```sql
platform_notes TEXT                        -- Internal admin/staff notes (not visible to vendor)
```

**Purpose:**
- Admin/staff internal communication
- Track decisions, approvals, rejections
- Platform-specific context
- NOT visible to vendors/users

**Use Cases:**
- Portfolio: "Rejected due to inappropriate content - warned user"
- Subscription: "Manual discount applied for loyal customer"
- Plan: "Created for special partnership with XYZ company"

---

## Visibility Priority in Search

When searching/filtering portfolios, use this priority order:

```javascript
const portfolios = await Portfolio.findAll({
  where: { status: 'published', categoryId },
  order: [
    ['is_recommended', 'DESC'],      // 1. Platform recommended (highest)
    ['is_boosted', 'DESC'],          // 2. Boosted (high)
    ['is_featured', 'DESC'],         // 3. Featured (medium)
    ['average_rating', 'DESC'],      // 4. Rating
    ['created_at', 'DESC']           // 5. Freshness
  ]
});
```

---

## Usage Tracking in User Subscriptions

The `user_subscriptions` table tracks current usage:

```sql
storage_used_mb DECIMAL(10,2) DEFAULT 0.00
portfolios_published_count INTEGER DEFAULT 0
portfolios_featured_count INTEGER DEFAULT 0
portfolios_boosted_count INTEGER DEFAULT 0
```

**Update these counters when:**
- Portfolio published/unpublished → `portfolios_published_count`
- Portfolio featured/unfeatured → `portfolios_featured_count`
- Portfolio boosted/unboosted → `portfolios_boosted_count`
- Media uploaded/deleted → `storage_used_mb`

---

## Quota Check Examples

### Check Featured Quota
```javascript
async canFeaturePortfolio(userId, categoryId) {
  const subscription = await UserSubscription.findOne({
    where: { userId, categoryId, status: 'active' }
  });
  
  if (!subscription) throw new Error('No active subscription');
  
  const currentFeatured = await Portfolio.count({
    where: { userId, categoryId, isFeatured: true, status: 'published' }
  });
  
  return currentFeatured < subscription.maxFeaturedPortfolios;
}
```

### Check Boost Quota
```javascript
async canBoostPortfolio(userId, categoryId) {
  const subscription = await UserSubscription.findOne({
    where: { userId, categoryId, status: 'active' }
  });
  
  if (!subscription) throw new Error('No active subscription');
  if (subscription.boostedDays === 0) throw new Error('Boost not available in plan');
  
  const currentBoosted = await Portfolio.count({
    where: { userId, categoryId, isBoosted: true, status: 'published' }
  });
  
  return currentBoosted < subscription.maxBoostedPortfolios;
}
```

### Check Republish Eligibility
```javascript
async canRepublishPortfolio(portfolioId, userId) {
  const portfolio = await Portfolio.findByPk(portfolioId, {
    include: [{ model: UserSubscription, as: 'userSubscription' }]
  });
  
  const subscription = portfolio.userSubscription;
  
  // Check count quota (0 = unlimited)
  if (subscription.maxRepublishCount > 0 && 
      portfolio.republishCount >= subscription.maxRepublishCount) {
    return { allowed: false, reason: 'Republish quota exceeded' };
  }
  
  // Check cooldown
  if (portfolio.lastRepublishedAt) {
    const cooldownEnd = new Date(portfolio.lastRepublishedAt);
    cooldownEnd.setDate(cooldownEnd.getDate() + subscription.republishCooldownDays);
    
    if (new Date() < cooldownEnd) {
      return { allowed: false, reason: 'Cooldown period not over', cooldownEnd };
    }
  }
  
  return { allowed: true };
}
```

---

## Files Modified

### Migrations
1. ✅ `migrations/20250309000001-create-subscription-plans-table.js` - Added `platform_notes`
2. ✅ `migrations/20250311000001-create-user-subscriptions-table.js` - Added `platform_notes`
3. ✅ `migrations/20250314000001-create-portfolios-table.js` - Added `platform_notes`

### Models
1. ✅ `src/models/SubscriptionPlan.js` - Added `platformNotes` field
2. ✅ `src/models/UserSubscription.js` - Added `platformNotes` field
3. ✅ `src/models/Portfolio.js` - Added `platformNotes` field

### SQL Scripts
1. ✅ `APPLY-SUBSCRIPTION-CHANGES.sql` - Added platform_notes to both subscription tables
2. ✅ `APPLY-PORTFOLIO-CHANGES.sql` - Added platform_notes to portfolios table

---

## Summary

### ✅ All Portfolio Features Are Fully Supported

Every portfolio feature has corresponding fields in:
1. **Subscription Plans** - Define quotas and limits
2. **User Subscriptions** - Snapshot of plan settings + usage tracking
3. **Portfolio Table** - Current state and timestamps

### ✅ Platform Notes Added

Internal notes field added to all three tables for admin/staff communication.

### ✅ Ready for Service Layer Implementation

All database schema is complete and ready for:
- Portfolio service layer
- Quota checking logic
- Feature management endpoints
- Cron jobs for expiration
- Admin panel integration

---

## Status: COMPLETE ✅

All portfolio features are fully supported by the subscription system. Database schema is finalized and ready for implementation.
