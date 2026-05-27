# Subscription Module - Base Schema Corrections

## Overview
This document tracks all schema corrections made to align the subscription module with business requirements.

---

## Changes Made

### 1. Fixed City Tier Datatype Mismatch

**Problem**: Inconsistent datatype between tables
- `subscription_plans.city_tier` was INTEGER (1, 2, 3, 4, 5)
- `user_subscriptions.city_tier` was INTEGER (1, 2, 3, 4, 5)
- `cities.city_tier` is STRING ('tier_1', 'tier_2', 'tier_3')

**Solution**: Changed to STRING(20) in all subscription-related tables

**Files Modified**:
- ✅ `migrations/20250309000001-create-subscription-plans-table.js`
- ✅ `migrations/20250311000001-create-user-subscriptions-table.js`
- ✅ `src/models/SubscriptionPlan.js`
- ✅ `src/models/UserSubscription.js`

**Migration SQL**:
```sql
ALTER TABLE subscription_plans ALTER COLUMN city_tier TYPE VARCHAR(20);
ALTER TABLE user_subscriptions ALTER COLUMN city_tier TYPE VARCHAR(20);
```

---

### 2. Added city_tier to Portfolios Table

**Purpose**: 
- Track which city tier the portfolio belongs to
- Enable filtering portfolios by tier
- Support subscription eligibility validation
- Denormalized for query performance

**Files Modified**:
- ✅ `migrations/20250314000001-create-portfolios-table.js`
- ✅ `src/models/Portfolio.js`

**Schema Addition**:
```javascript
city_tier: {
  type: Sequelize.STRING(20),
  allowNull: false,
  comment: 'City tier from cities table (tier_1, tier_2, tier_3, tier_4, tier_5)'
}
```

**Migration SQL**:
```sql
ALTER TABLE portfolios ADD COLUMN city_tier VARCHAR(20);

-- Populate from cities table
UPDATE portfolios p
SET city_tier = c.city_tier
FROM cities c
WHERE p.city_id = c.id;

-- Make NOT NULL after populating
ALTER TABLE portfolios ALTER COLUMN city_tier SET NOT NULL;

-- Add index
CREATE INDEX idx_portfolios_city_tier ON portfolios(city_tier);
```

---

### 3. Added is_free_plan_portfolio to Portfolios Table

**Purpose**:
- Quick identification of free vs paid portfolios
- Analytics and reporting
- Business logic differentiation
- Performance optimization for filtering

**Files Modified**:
- ✅ `migrations/20250314000001-create-portfolios-table.js`
- ✅ `src/models/Portfolio.js`

**Schema Addition**:
```javascript
is_free_plan_portfolio: {
  type: Sequelize.BOOLEAN,
  allowNull: false,
  defaultValue: false,
  comment: 'Whether this portfolio was created using a free plan'
}
```

**Migration SQL**:
```sql
ALTER TABLE portfolios 
  ADD COLUMN is_free_plan_portfolio BOOLEAN NOT NULL DEFAULT false;

-- Populate from user_subscriptions
UPDATE portfolios p
SET is_free_plan_portfolio = CASE 
  WHEN us.final_price = 0 THEN true 
  ELSE false 
END
FROM user_subscriptions us
WHERE p.user_subscription_id = us.id;

-- Add index
CREATE INDEX idx_portfolios_is_free_plan ON portfolios(is_free_plan_portfolio);
```

---

### 4. Added Composite Indexes

**Purpose**: Optimize common query patterns

**Indexes Added**:
```sql
-- Category + City Tier + Status queries
CREATE INDEX idx_portfolios_category_tier_status 
  ON portfolios(category_id, city_tier, status);
```

---

### 5. Added Database Trigger for Auto-Population

**Purpose**: Automatically populate city_tier from cities table on insert/update

**Trigger SQL**:
```sql
CREATE OR REPLACE FUNCTION set_portfolio_city_tier()
RETURNS TRIGGER AS $$
BEGIN
  SELECT city_tier INTO NEW.city_tier
  FROM cities
  WHERE id = NEW.city_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_portfolio_city_tier
  BEFORE INSERT OR UPDATE OF city_id ON portfolios
  FOR EACH ROW
  EXECUTE FUNCTION set_portfolio_city_tier();
```

---

## Database Update Instructions

### For Development Environment

Run the SQL commands in this order:

```bash
# Connect to your database
psql -U your_username -d wed_connect_db

# Or if using connection string
psql postgresql://username:password@localhost:5432/wed_connect_db
```

Then execute the SQL file:
```sql
\i migrations/MANUAL-SQL-UPDATES.sql
```

### Verification Queries

```sql
-- 1. Verify city_tier datatype changes
SELECT 
  table_name, 
  column_name, 
  data_type, 
  character_maximum_length
FROM information_schema.columns
WHERE table_name IN ('subscription_plans', 'user_subscriptions', 'portfolios')
  AND column_name = 'city_tier';

-- Expected output:
-- subscription_plans | city_tier | character varying | 20
-- user_subscriptions | city_tier | character varying | 20
-- portfolios         | city_tier | character varying | 20


-- 2. Verify new portfolio columns
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_name = 'portfolios'
  AND column_name IN ('city_tier', 'is_free_plan_portfolio');

-- Expected output:
-- city_tier              | character varying | NO  | NULL
-- is_free_plan_portfolio | boolean          | NO  | false


-- 3. Verify indexes
SELECT 
  indexname, 
  tablename, 
  indexdef
FROM pg_indexes
WHERE tablename = 'portfolios'
  AND (indexname LIKE '%city_tier%' OR indexname LIKE '%free_plan%');

-- Expected output:
-- idx_portfolios_city_tier
-- idx_portfolios_is_free_plan
-- idx_portfolios_category_tier_status


-- 4. Verify trigger
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'trigger_set_portfolio_city_tier';

-- Expected output:
-- trigger_set_portfolio_city_tier | INSERT | portfolios
-- trigger_set_portfolio_city_tier | UPDATE | portfolios
```

---

## Next Steps

### Phase 2: Service Layer Implementation

1. **Create Subscription Eligibility Service**
   - `src/services/subscriptionEligibilityService.js`
   - Methods:
     - `hasActiveSubscription(userId)`
     - `hasActiveSubscriptionForCategory(userId, categoryId)`
     - `hasActiveSubscriptionForCategoryAndTier(userId, categoryId, cityTier)`
     - `getSubscriptionEligibility(userId, categoryId, cityTier)`
     - `canUpgradeSubscription(currentSubscriptionId, newPlanId)`

2. **Update Portfolio Service**
   - `src/services/portfolioService.js`
   - Add validation logic:
     - Check active subscription before portfolio creation
     - Validate city tier matches subscription tier
     - Auto-populate `city_tier` and `is_free_plan_portfolio`
     - Check portfolio quota

3. **Create Subscription Repository**
   - `src/repositories/subscriptionRepository.js`
   - Database operations for subscription queries

4. **Update Portfolio Repository**
   - `src/repositories/portfolioRepository.js`
   - Add methods for tier-based queries

### Phase 3: API Endpoints

1. **Subscription Eligibility Endpoint**
   - `GET /api/vendor/subscriptions/eligibility`
   - Query params: `categoryId`, `cityTier`

2. **Portfolio Creation Validation Endpoint**
   - `POST /api/vendor/portfolios/validate-creation`
   - Body: `{ categoryId, cityId }`

3. **Subscription Plans by Category & Tier**
   - `GET /api/vendor/subscription-plans`
   - Query params: `categoryId`, `cityTier`

---

## Business Rules Enforced

✅ Subscription plans are category + city tier specific  
✅ User can purchase multiple subscriptions (different categories or tiers)  
✅ Portfolio city must match subscription city tier  
✅ Only published portfolios count toward quota  
✅ Free plan portfolios are tracked separately  
✅ City tier is denormalized for performance  

---

## Files Created

- ✅ `migrations/MANUAL-SQL-UPDATES.sql` - SQL commands for database updates
- ✅ `SUBSCRIPTION-MODULE-CORRECTIONS.md` - This documentation file

---

## Status

**Phase 1: Base Schema Corrections** ✅ COMPLETE

**Next**: Run SQL updates on database, then proceed to Phase 2 (Service Layer)
