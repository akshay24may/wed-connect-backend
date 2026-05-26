# Pricing & Badges System Design

## 1. Pricing Structure

### Current Portfolio Pricing (Existing)

```sql
-- portfolios table (EXISTING)
starting_price DECIMAL(15,2)
price_range_min DECIMAL(15,2)
price_range_max DECIMAL(15,2)
price_on_request BOOLEAN
```

### Proposed Changes

**Remove**: `starting_price` (redundant)
**Keep**: `price_range_min` (make mandatory), `price_range_max` (optional)
**Add**: `price_breakdown` (JSONB for detailed pricing)

```sql
-- portfolios table (UPDATED)
price_range_min DECIMAL(15,2) NOT NULL  -- Mandatory minimum price
price_range_max DECIMAL(15,2)           -- Optional (NULL = fixed price)
price_on_request BOOLEAN DEFAULT false
price_breakdown JSONB                   -- Detailed pricing items
```

### Frontend Display Logic

```javascript
// Fixed Price
if (price_range_max === null) {
  display: `₹${price_range_min}` or `Starting at ₹${price_range_min}`
}

// Price Range
if (price_range_max !== null) {
  display: `₹${price_range_min} - ₹${price_range_max}`
}

// Price on Request
if (price_on_request === true) {
  display: "Price on Request" (with optional range as reference)
}
```

### Price Breakdown Structure

```json
{
  "items": [
    {
      "name": "Veg Plate",
      "price": 350,
      "unit": "per person",
      "category": "catering"
    },
    {
      "name": "Non-Veg Plate",
      "price": 400,
      "unit": "per person",
      "category": "catering"
    },
    {
      "name": "Pre-Wedding Shoot",
      "price": 45000,
      "unit": "per session",
      "category": "photography"
    },
    {
      "name": "Wedding Day Coverage",
      "price": 80000,
      "unit": "per day",
      "category": "photography"
    },
    {
      "name": "Venue Decoration",
      "price": 150000,
      "unit": "per event",
      "category": "decoration"
    }
  ],
  "notes": "Prices may vary based on requirements and season"
}
```

**Benefits:**
- Flexible structure for any service type
- Easy to display in UI (table/list format)
- Can filter/group by category
- Optional notes for disclaimers

---

## 2. Badges & Achievements System

### Badge Types

1. **Platform Awards** (Admin-assigned)
   - User's Choice Award Winner
   - Editor's Pick
   - Top Rated
   - Trending Vendor

2. **Performance Metrics** (Auto-calculated)
   - Served in X cities
   - X+ weddings completed
   - X years of experience
   - X+ happy clients

3. **Quality Indicators** (Review-based)
   - Professionalism: X votes
   - Quality: X votes
   - Value for Money: X votes
   - Responsiveness: X votes

4. **Verification Badges** (Admin-verified)
   - Verified Business
   - Background Checked
   - Licensed Professional
   - Insurance Covered

5. **Subscription Badges** (Plan-based)
   - Premium Member
   - Featured Vendor
   - Recommended by Platform

---

## 3. Database Schema

### New Table: `vendor_badges`

```sql
CREATE TABLE vendor_badges (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  badge_type ENUM(
    'platform_award',
    'performance_metric',
    'quality_indicator',
    'verification',
    'subscription'
  ) NOT NULL,
  badge_code VARCHAR(50) NOT NULL,  -- 'users_choice', 'served_cities', etc.
  badge_name VARCHAR(100) NOT NULL,  -- Display name
  badge_value VARCHAR(100),  -- "15 votes", "10 cities", etc.
  badge_icon VARCHAR(255),  -- Icon URL or name
  badge_color VARCHAR(20),  -- Hex color for badge
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  awarded_at TIMESTAMP,
  expires_at TIMESTAMP,  -- For time-limited badges
  awarded_by BIGINT,  -- Admin user who awarded (for manual badges)
  metadata JSONB,  -- Additional data
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (awarded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_vendor_badges_user_id (user_id),
  INDEX idx_vendor_badges_badge_type (badge_type),
  INDEX idx_vendor_badges_is_active (is_active),
  UNIQUE KEY unique_user_badge (user_id, badge_code)
);
```

### New Table: `badge_definitions`

Master list of all possible badges:

```sql
CREATE TABLE badge_definitions (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  badge_code VARCHAR(50) UNIQUE NOT NULL,
  badge_name VARCHAR(100) NOT NULL,
  badge_type ENUM(
    'platform_award',
    'performance_metric',
    'quality_indicator',
    'verification',
    'subscription'
  ) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  color VARCHAR(20),
  criteria JSONB,  -- Criteria for auto-assignment
  is_auto_assigned BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  INDEX idx_badge_definitions_badge_type (badge_type),
  INDEX idx_badge_definitions_is_active (is_active)
);
```

### Update: `portfolio_reviews` Table

Add quality indicators:

```sql
-- Add to existing portfolio_reviews table
professionalism_rating INTEGER,  -- 1-5
quality_rating INTEGER,  -- 1-5
value_rating INTEGER,  -- 1-5
responsiveness_rating INTEGER,  -- 1-5

CHECK (professionalism_rating BETWEEN 1 AND 5),
CHECK (quality_rating BETWEEN 1 AND 5),
CHECK (value_rating BETWEEN 1 AND 5),
CHECK (responsiveness_rating BETWEEN 1 AND 5)
```

### Update: `portfolios` Table

Add pricing changes:

```sql
-- Remove starting_price
-- Make price_range_min mandatory
-- Add price_breakdown

ALTER TABLE portfolios DROP COLUMN starting_price;
ALTER TABLE portfolios MODIFY price_range_min DECIMAL(15,2) NOT NULL;
ALTER TABLE portfolios ADD COLUMN price_breakdown JSONB;
```

### Update: `vendor_profiles` Table

Add performance metrics:

```sql
-- Add to vendor_profiles
cities_served JSONB,  -- ["Delhi", "Mumbai", "Jaipur"]
weddings_completed INTEGER DEFAULT 0,
years_of_experience INTEGER,
happy_clients_count INTEGER DEFAULT 0,
```

---

## 4. Badge Examples

### Platform Awards (Admin-Assigned)

```json
{
  "badge_code": "users_choice_2024",
  "badge_name": "User's Choice Award 2024",
  "badge_type": "platform_award",
  "badge_icon": "trophy-icon.svg",
  "badge_color": "#FFD700",
  "metadata": {
    "year": 2024,
    "category": "Photography"
  }
}
```

### Performance Metrics (Auto-Calculated)

```json
{
  "badge_code": "served_cities",
  "badge_name": "Served in 10 Cities",
  "badge_type": "performance_metric",
  "badge_value": "10 cities",
  "badge_icon": "location-icon.svg",
  "badge_color": "#4CAF50",
  "metadata": {
    "cities": ["Delhi", "Mumbai", "Jaipur", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Lucknow"]
  }
}
```

### Quality Indicators (Review-Based)

```json
{
  "badge_code": "professionalism_votes",
  "badge_name": "Professionalism",
  "badge_type": "quality_indicator",
  "badge_value": "15 votes",
  "badge_icon": "star-icon.svg",
  "badge_color": "#2196F3",
  "metadata": {
    "vote_count": 15,
    "average_rating": 4.8
  }
}
```

### Verification Badges (Admin-Verified)

```json
{
  "badge_code": "verified_business",
  "badge_name": "Verified Business",
  "badge_type": "verification",
  "badge_icon": "verified-icon.svg",
  "badge_color": "#00BCD4",
  "metadata": {
    "verified_date": "2024-01-15",
    "verified_by": "admin_user_id"
  }
}
```

### Subscription Badges (Plan-Based)

```json
{
  "badge_code": "premium_member",
  "badge_name": "Premium Member",
  "badge_type": "subscription",
  "badge_icon": "crown-icon.svg",
  "badge_color": "#9C27B0",
  "metadata": {
    "plan_name": "Premium",
    "subscription_id": 12345
  }
}
```

---

## 5. Badge Auto-Assignment Logic

### Performance Metrics

```javascript
// Served in X Cities
async function updateServedCitiesBadge(userId) {
  const cities = await Portfolio.findAll({
    where: { userId, status: 'published' },
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('city_slug')), 'city']],
    raw: true
  });
  
  const cityCount = cities.length;
  
  if (cityCount >= 10) {
    await VendorBadge.upsert({
      userId,
      badgeCode: 'served_cities',
      badgeName: `Served in ${cityCount} Cities`,
      badgeType: 'performance_metric',
      badgeValue: `${cityCount} cities`,
      metadata: { cities: cities.map(c => c.city) }
    });
  }
}

// Weddings Completed
async function updateWeddingsCompletedBadge(userId) {
  const profile = await VendorProfile.findOne({ where: { userId } });
  const count = profile.weddingsCompleted;
  
  if (count >= 50) {
    await VendorBadge.upsert({
      userId,
      badgeCode: 'weddings_completed',
      badgeName: `${count}+ Weddings`,
      badgeType: 'performance_metric',
      badgeValue: `${count}+ weddings`,
      metadata: { count }
    });
  }
}
```

### Quality Indicators

```javascript
// Professionalism Votes
async function updateProfessionalismBadge(userId) {
  const reviews = await PortfolioReview.findAll({
    include: [{
      model: Portfolio,
      where: { userId },
      attributes: []
    }],
    where: { professionalismRating: { [Op.gte]: 4 } }
  });
  
  const voteCount = reviews.length;
  const avgRating = reviews.reduce((sum, r) => sum + r.professionalismRating, 0) / voteCount;
  
  if (voteCount >= 10) {
    await VendorBadge.upsert({
      userId,
      badgeCode: 'professionalism_votes',
      badgeName: 'Professionalism',
      badgeType: 'quality_indicator',
      badgeValue: `${voteCount} votes`,
      metadata: { voteCount, averageRating: avgRating.toFixed(1) }
    });
  }
}
```

### Subscription Badges

```javascript
// Premium Member Badge
async function updateSubscriptionBadge(userId) {
  const subscription = await UserSubscription.findOne({
    where: { userId, status: 'active' },
    include: [{ model: SubscriptionPlan, as: 'plan' }]
  });
  
  if (!subscription) {
    // Remove badge if no active subscription
    await VendorBadge.destroy({ where: { userId, badgeCode: 'premium_member' } });
    return;
  }
  
  const planName = subscription.plan.name;
  
  if (planName === 'Premium' || planName === 'Enterprise') {
    await VendorBadge.upsert({
      userId,
      badgeCode: 'premium_member',
      badgeName: `${planName} Member`,
      badgeType: 'subscription',
      metadata: { planName, subscriptionId: subscription.id }
    });
  }
}
```

---

## 6. Frontend Display

### Portfolio Card Badges

```javascript
// Display top 3-4 badges on portfolio cards
const badges = await VendorBadge.findAll({
  where: { userId, isActive: true },
  order: [['displayOrder', 'ASC']],
  limit: 4
});

// Render as chips
badges.forEach(badge => {
  <Chip 
    label={badge.badgeValue || badge.badgeName}
    icon={badge.badgeIcon}
    color={badge.badgeColor}
  />
});
```

### Portfolio Page - All Badges

```javascript
// Group badges by type
const badgesByType = {
  platform_award: [],
  performance_metric: [],
  quality_indicator: [],
  verification: [],
  subscription: []
};

badges.forEach(badge => {
  badgesByType[badge.badgeType].push(badge);
});

// Display in sections
<BadgeSection title="Awards & Recognition">
  {badgesByType.platform_award.map(badge => <Badge {...badge} />)}
</BadgeSection>

<BadgeSection title="Performance">
  {badgesByType.performance_metric.map(badge => <Badge {...badge} />)}
</BadgeSection>

<BadgeSection title="Quality Ratings">
  {badgesByType.quality_indicator.map(badge => <Badge {...badge} />)}
</BadgeSection>
```

---

## 7. Admin Panel Features

### Badge Management

1. **Create Badge Definition**
   - Badge code, name, type
   - Icon, color
   - Auto-assignment criteria
   - Active/inactive status

2. **Award Manual Badges**
   - Select vendor
   - Select badge from definitions
   - Set expiry date (optional)
   - Add notes

3. **View Badge Analytics**
   - Most awarded badges
   - Badge distribution by type
   - Vendors with most badges

4. **Bulk Badge Operations**
   - Award badge to multiple vendors
   - Remove expired badges
   - Recalculate auto-assigned badges

---

## 8. Migration Plan

### Step 1: Update Portfolios Table

```sql
-- Remove starting_price
ALTER TABLE portfolios DROP COLUMN starting_price;

-- Make price_range_min mandatory (after setting default values)
UPDATE portfolios SET price_range_min = 0 WHERE price_range_min IS NULL;
ALTER TABLE portfolios MODIFY price_range_min DECIMAL(15,2) NOT NULL;

-- Add price_breakdown
ALTER TABLE portfolios ADD COLUMN price_breakdown JSONB;

-- Add index
CREATE INDEX idx_portfolios_price_range ON portfolios(price_range_min, price_range_max);
```

### Step 2: Create Badge Tables

```sql
-- Create badge_definitions table
CREATE TABLE badge_definitions (...);

-- Create vendor_badges table
CREATE TABLE vendor_badges (...);

-- Seed initial badge definitions
INSERT INTO badge_definitions (badge_code, badge_name, badge_type, ...) VALUES
  ('users_choice', 'User\'s Choice Award', 'platform_award', ...),
  ('served_cities', 'Served in Multiple Cities', 'performance_metric', ...),
  ('professionalism_votes', 'Professionalism', 'quality_indicator', ...),
  ('verified_business', 'Verified Business', 'verification', ...),
  ('premium_member', 'Premium Member', 'subscription', ...);
```

### Step 3: Update Portfolio Reviews

```sql
-- Add quality rating columns
ALTER TABLE portfolio_reviews ADD COLUMN professionalism_rating INTEGER;
ALTER TABLE portfolio_reviews ADD COLUMN quality_rating INTEGER;
ALTER TABLE portfolio_reviews ADD COLUMN value_rating INTEGER;
ALTER TABLE portfolio_reviews ADD COLUMN responsiveness_rating INTEGER;

-- Add constraints
ALTER TABLE portfolio_reviews ADD CONSTRAINT check_professionalism_rating 
  CHECK (professionalism_rating BETWEEN 1 AND 5);
ALTER TABLE portfolio_reviews ADD CONSTRAINT check_quality_rating 
  CHECK (quality_rating BETWEEN 1 AND 5);
ALTER TABLE portfolio_reviews ADD CONSTRAINT check_value_rating 
  CHECK (value_rating BETWEEN 1 AND 5);
ALTER TABLE portfolio_reviews ADD CONSTRAINT check_responsiveness_rating 
  CHECK (responsiveness_rating BETWEEN 1 AND 5);
```

### Step 4: Update Vendor Profiles

```sql
-- Add performance metrics
ALTER TABLE vendor_profiles ADD COLUMN cities_served JSONB;
ALTER TABLE vendor_profiles ADD COLUMN weddings_completed INTEGER DEFAULT 0;
ALTER TABLE vendor_profiles ADD COLUMN years_of_experience INTEGER;
ALTER TABLE vendor_profiles ADD COLUMN happy_clients_count INTEGER DEFAULT 0;
```

---

## 9. API Endpoints

### Pricing

```javascript
// Get portfolio with pricing
GET /api/portfolios/:id
Response: {
  price_range_min: 50000,
  price_range_max: 150000,  // null for fixed price
  price_on_request: false,
  price_breakdown: {
    items: [...]
  }
}

// Update portfolio pricing
PATCH /api/vendor/portfolios/:id/pricing
Body: {
  price_range_min: 50000,
  price_range_max: 150000,
  price_breakdown: { items: [...] }
}
```

### Badges

```javascript
// Get vendor badges
GET /api/vendors/:userId/badges
Response: {
  badges: [
    { badge_code: 'users_choice', badge_name: '...', ... },
    { badge_code: 'served_cities', badge_value: '10 cities', ... }
  ]
}

// Award badge (admin only)
POST /api/admin/badges/award
Body: {
  user_id: 123,
  badge_code: 'users_choice_2024',
  expires_at: '2025-12-31'
}

// Remove badge (admin only)
DELETE /api/admin/badges/:badgeId
```

---

## Summary

### Pricing Changes ✅
- ❌ Remove `starting_price`
- ✅ Make `price_range_min` mandatory
- ✅ Keep `price_range_max` optional (null = fixed price)
- ✅ Add `price_breakdown` JSONB for detailed pricing

### Badges System ✅
- ✅ 5 badge types: Platform Awards, Performance, Quality, Verification, Subscription
- ✅ Auto-assignment for performance & quality badges
- ✅ Manual assignment for awards & verification
- ✅ Display on portfolio cards (top 3-4) and full page (all badges)
- ✅ Admin panel for badge management

### New Tables ✅
1. `badge_definitions` - Master badge list
2. `vendor_badges` - User-specific badges

### Updated Tables ✅
1. `portfolios` - Pricing changes
2. `portfolio_reviews` - Quality ratings
3. `vendor_profiles` - Performance metrics

Ready to create migrations?
