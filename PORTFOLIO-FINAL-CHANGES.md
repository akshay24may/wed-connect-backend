# Portfolio Table - Final Changes Applied ✅

## Changes Summary

### 1. ✅ Removed `locality` - Keeping Only `address`
**Reason**: More flexible - `address` can contain full address details including locality.

**Before:**
```sql
locality VARCHAR(200)
address TEXT
```

**After:**
```sql
address TEXT  -- Single field for complete address
```

### 2. ✅ Rating Distribution as JSONB
**Reason**: Cleaner schema - single JSON column instead of 5 separate integer columns.

**Before:**
```sql
rating_1_count INTEGER
rating_2_count INTEGER
rating_3_count INTEGER
rating_4_count INTEGER
rating_5_count INTEGER
```

**After:**
```sql
rating_distribution JSONB DEFAULT '{"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}'
```

**Benefits:**
- Cleaner schema (1 column vs 5)
- Easy to query: `rating_distribution->>'5'` for 5-star count
- Flexible for future extensions
- Still indexed and performant

### 3. ✅ Both `is_featured` AND `is_recommended` Kept
**Reason**: They serve DIFFERENT purposes.

| Feature | Controller | Purpose | Quota | Expiration |
|---------|-----------|---------|-------|------------|
| **Featured** | Vendor | Vendor highlights their own portfolios | `max_featured_portfolios` | Yes (`featured_until`) |
| **Recommended** | Platform Admin | Platform endorses quality portfolios | Requires `can_be_recommended = true` | No (manual removal) |
| **Boosted** | Vendor | Paid visibility boost | `max_boosted_portfolios` | Yes (`boosted_until`) |

**Search Priority:**
1. **Recommended** (highest) - Platform's seal of approval
2. **Boosted** (high) - Paid premium visibility
3. **Featured** (medium) - Vendor's choice highlights
4. **Regular** (base) - Sorted by rating/freshness

## Final Schema

### Location Fields
```sql
state_id INTEGER FK → states
city_id INTEGER FK → cities
state_slug VARCHAR(255)
city_slug VARCHAR(255)
address TEXT  -- Complete address (removed locality)
```

### Visibility Features
```sql
-- Vendor-controlled (subscription-based)
is_featured BOOLEAN DEFAULT false
featured_until TIMESTAMP

-- Vendor-controlled (paid boost)
is_boosted BOOLEAN DEFAULT false
boosted_until TIMESTAMP

-- Platform-controlled (editorial)
is_recommended BOOLEAN DEFAULT false
recommended_at TIMESTAMP
```

### Rating Normalization
```sql
average_rating DECIMAL(3,2) DEFAULT 0.00
total_reviews INTEGER DEFAULT 0
rating_distribution JSONB DEFAULT '{"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}'
```

## Model Fields

### Location
```javascript
stateId: { type: DataTypes.INTEGER, field: 'state_id' }
cityId: { type: DataTypes.INTEGER, field: 'city_id' }
stateSlug: { type: DataTypes.STRING(255), field: 'state_slug' }
citySlug: { type: DataTypes.STRING(255), field: 'city_slug' }
address: { type: DataTypes.TEXT, field: 'address' }
```

### Visibility
```javascript
isFeatured: { type: DataTypes.BOOLEAN, field: 'is_featured' }
featuredUntil: { type: DataTypes.DATE, field: 'featured_until' }
isBoosted: { type: DataTypes.BOOLEAN, field: 'is_boosted' }
boostedUntil: { type: DataTypes.DATE, field: 'boosted_until' }
isRecommended: { type: DataTypes.BOOLEAN, field: 'is_recommended' }
recommendedAt: { type: DataTypes.DATE, field: 'recommended_at' }
```

### Rating
```javascript
averageRating: { type: DataTypes.DECIMAL(3, 2), field: 'average_rating' }
totalReviews: { type: DataTypes.INTEGER, field: 'total_reviews' }
ratingDistribution: { 
  type: DataTypes.JSONB, 
  defaultValue: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
  field: 'rating_distribution' 
}
```

## Usage Examples

### Update Rating Distribution
```javascript
async updatePortfolioRating(portfolioId, oldRating, newRating) {
  const portfolio = await Portfolio.findByPk(portfolioId);
  const distribution = portfolio.ratingDistribution || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
  
  // Update counts
  if (oldRating) distribution[oldRating.toString()]--;
  if (newRating) {
    distribution[newRating.toString()]++;
    if (!oldRating) portfolio.totalReviews++;
  } else if (oldRating) {
    portfolio.totalReviews--;
  }
  
  portfolio.ratingDistribution = distribution;
  
  // Recalculate average
  const totalRating = 
    (distribution["1"] * 1) +
    (distribution["2"] * 2) +
    (distribution["3"] * 3) +
    (distribution["4"] * 4) +
    (distribution["5"] * 5);
  
  portfolio.averageRating = portfolio.totalReviews > 0 
    ? (totalRating / portfolio.totalReviews).toFixed(2)
    : 0.00;
  
  await portfolio.save();
}
```

### Query Rating Distribution
```javascript
// Get 5-star count
const fiveStarCount = portfolio.ratingDistribution["5"];

// Get all ratings
const { "1": oneStar, "2": twoStar, "3": threeStar, "4": fourStar, "5": fiveStar } = portfolio.ratingDistribution;

// SQL query for portfolios with high 5-star ratings
SELECT * FROM portfolios 
WHERE (rating_distribution->>'5')::int > 10
ORDER BY average_rating DESC;
```

### Feature vs Recommend vs Boost
```javascript
// Vendor features their portfolio (subscription quota check)
async featurePortfolio(portfolioId, userId) {
  const subscription = await UserSubscription.findOne({ where: { userId, isActive: true } });
  const featuredCount = await Portfolio.count({ where: { userId, isFeatured: true } });
  
  if (featuredCount >= subscription.maxFeaturedPortfolios) {
    throw new Error('Featured portfolio quota exceeded');
  }
  
  await Portfolio.update(
    { 
      isFeatured: true, 
      featuredUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    },
    { where: { id: portfolioId } }
  );
}

// Vendor boosts their portfolio (subscription quota check)
async boostPortfolio(portfolioId, userId) {
  const subscription = await UserSubscription.findOne({ where: { userId, isActive: true } });
  const boostedCount = await Portfolio.count({ where: { userId, isBoosted: true } });
  
  if (boostedCount >= subscription.maxBoostedPortfolios) {
    throw new Error('Boosted portfolio quota exceeded');
  }
  
  await Portfolio.update(
    { 
      isBoosted: true, 
      boostedUntil: new Date(Date.now() + subscription.boostedDays * 24 * 60 * 60 * 1000)
    },
    { where: { id: portfolioId } }
  );
}

// Admin recommends portfolio (platform editorial)
async recommendPortfolio(portfolioId, adminUserId) {
  const portfolio = await Portfolio.findByPk(portfolioId, {
    include: [{ model: UserSubscription, as: 'userSubscription' }]
  });
  
  if (!portfolio.userSubscription.canBeRecommended) {
    throw new Error('Portfolio subscription does not allow recommendation');
  }
  
  await portfolio.update({ 
    isRecommended: true, 
    recommendedAt: new Date() 
  });
}
```

### Search with Priority
```javascript
// Search portfolios with visibility priority
const portfolios = await Portfolio.findAll({
  where: { status: 'published', categoryId },
  order: [
    ['is_recommended', 'DESC'],  // Recommended first
    ['is_boosted', 'DESC'],      // Then boosted
    ['is_featured', 'DESC'],     // Then featured
    ['average_rating', 'DESC'],  // Then by rating
    ['created_at', 'DESC']       // Finally by freshness
  ]
});
```

## Files Modified

1. ✅ `migrations/20250314000001-create-portfolios-table.js`
   - Removed `locality` column
   - Changed 5 rating count columns to 1 JSONB column
   - Kept both `is_featured` and `is_recommended`

2. ✅ `src/models/Portfolio.js`
   - Removed `locality` field
   - Changed rating count fields to `ratingDistribution` JSONB
   - Kept both `isFeatured` and `isRecommended`

3. ✅ `APPLY-PORTFOLIO-CHANGES.sql`
   - Drops `locality` column
   - Adds `rating_distribution` JSONB column
   - Updated verification query

## Next Steps

1. ⏳ Implement portfolio service layer
2. ⏳ Create cron jobs to expire featured/boosted portfolios
3. ⏳ Implement rating update service (when reviews are added/updated/deleted)
4. ⏳ Create admin endpoints for recommendation management
5. ⏳ Update search/filter logic with visibility priority

## Status: READY ✅

Portfolio table and model are finalized and ready for service layer implementation.
