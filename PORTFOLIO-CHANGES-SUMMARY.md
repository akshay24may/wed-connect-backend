# Portfolio Table & Model Changes Summary

## Changes Applied

### 1. Boost Features
Added columns to support portfolio boosting (premium visibility):
- `is_boosted` (BOOLEAN) - Whether portfolio is currently boosted
- `boosted_until` (DATE) - Boost expiration timestamp

**Purpose**: Allow vendors to boost portfolios for enhanced visibility based on subscription plan limits.

### 2. Platform Recommendation
Added columns for platform-recommended portfolios:
- `is_recommended` (BOOLEAN) - Whether portfolio is recommended by platform
- `recommended_at` (DATE) - When portfolio was marked as recommended

**Purpose**: Platform can recommend high-quality portfolios (requires eligible subscription).

### 3. Rating Normalization
Added denormalized rating columns for performance:
- `average_rating` (DECIMAL 3,2) - Average rating (0.00 to 5.00)
- `total_reviews` (INTEGER) - Total number of reviews
- `rating_distribution` (JSONB) - Rating distribution: `{"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}`

**Purpose**: Fast rating queries without JOIN to reviews table. Updated via triggers or service layer when reviews are added/updated/deleted.

### 4. Location Simplification
Removed `locality` column - keeping only `address` for flexibility.

### 5. Indexes Added
Performance indexes for new columns:
- `idx_portfolios_is_boosted` - Filter boosted portfolios
- `idx_portfolios_is_recommended` - Filter recommended portfolios
- `idx_portfolios_average_rating` - Sort by rating
- `idx_portfolios_total_reviews` - Sort by review count

### 6. Check Constraints
Data integrity constraints:
- `check_average_rating_range` - Rating between 0 and 5
- `check_total_reviews_non_negative` - Non-negative review count

## Files Modified

### Migration
- `migrations/20250314000001-create-portfolios-table.js`
  - Removed `locality` column (keeping only `address`)
  - Added 7 new columns (boost, recommendation, rating normalization)
  - Added 4 new indexes
  - Added 2 check constraints

### Model
- `src/models/Portfolio.js`
  - Removed `locality` field
  - Added 7 new fields with proper camelCase mapping
  - All fields map to snake_case database columns

### SQL Script
- `APPLY-PORTFOLIO-CHANGES.sql`
  - For existing databases
  - Drops `locality` column
  - Adds all new columns, indexes, and constraints
  - Includes verification query

## Database Schema

### Boost Fields
```sql
is_boosted BOOLEAN NOT NULL DEFAULT false
boosted_until TIMESTAMP
```

### Recommendation Fields
```sql
is_recommended BOOLEAN NOT NULL DEFAULT false
recommended_at TIMESTAMP
```

### Rating Normalization Fields
```sql
average_rating DECIMAL(3, 2) NOT NULL DEFAULT 0.00
total_reviews INTEGER NOT NULL DEFAULT 0
rating_distribution JSONB NOT NULL DEFAULT '{"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}'
```

## Usage Notes

### Boost Logic
- Check `user_subscriptions.max_boosted_portfolios` for quota
- Set `is_boosted = true` and `boosted_until = NOW() + boosted_days`
- Cron job should reset `is_boosted = false` when `boosted_until < NOW()`

### Recommendation Logic
- Only portfolios with eligible subscriptions can be recommended
- Check `user_subscriptions.can_be_recommended = true`
- Platform admin sets `is_recommended = true` and `recommended_at = NOW()`

### Rating Normalization
When a review is created/updated/deleted:
1. Update appropriate rating count in `rating_distribution` JSON
2. Update `total_reviews` count
3. Recalculate `average_rating = SUM(rating * count) / total_reviews`

**Example Service Logic:**
```javascript
async updatePortfolioRating(portfolioId, oldRating, newRating) {
  const portfolio = await Portfolio.findByPk(portfolioId);
  const distribution = portfolio.ratingDistribution || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
  
  if (oldRating) {
    distribution[oldRating.toString()]--;
  }
  
  if (newRating) {
    distribution[newRating.toString()]++;
    if (!oldRating) portfolio.totalReviews++;
  } else if (oldRating) {
    portfolio.totalReviews--;
  }
  
  portfolio.ratingDistribution = distribution;
  
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

## Next Steps

1. ✅ Migration updated
2. ✅ Model updated
3. ✅ SQL script created
4. ⏳ Update portfolio service layer (boost, recommendation, rating logic)
5. ⏳ Create cron job to expire boosted portfolios
6. ⏳ Update search/filter logic to use new fields
7. ⏳ Create admin endpoints for recommendation management

## Related Files

- Subscription Plans: `src/models/SubscriptionPlan.js` (has `max_boosted_portfolios`, `boosted_days`, `can_be_recommended`)
- User Subscriptions: `src/models/UserSubscription.js` (snapshot of plan settings)
- Reviews: Will need service layer to update portfolio rating fields
