# Subscription Module - Code Updates Summary

## Overview
This document tracks all code changes made to portfolio controller, service, and repository to support city_tier and is_free_plan_portfolio fields.

---

## Files Modified

### 1. Portfolio Service (`src/services/portfolioService.js`)

#### Changes in `createPortfolio()`:
- ✅ Added city tier lookup from cities table via repository
- ✅ Added subscription lookup to determine if it's a free plan
- ✅ Auto-populate `cityTier` field from cities table
- ✅ Auto-populate `isFreePlanPortfolio` based on subscription final_price
- ✅ Added validation for city existence

**Logic Flow**:
```javascript
1. Validate portfolio data (existing validations)
2. Get city_tier from cities table using cityId
3. If city not found, return error
4. If userSubscriptionId provided:
   - Get subscription details
   - Check if finalPrice === 0 (free plan)
   - Set isFreePlanPortfolio accordingly
5. Create portfolio with cityTier and isFreePlanPortfolio
```

#### Changes in `updatePortfolio()`:
- ✅ Added city tier update when cityId changes
- ✅ Validates new city exists before updating
- ✅ Auto-updates cityTier when cityId is changed

**Logic Flow**:
```javascript
1. Validate portfolio exists and is editable
2. Build update data object
3. If cityId is being updated:
   - Get new city_tier from cities table
   - Validate city exists
   - Include cityTier in update data
4. Update portfolio
```

---

### 2. Portfolio Repository (`src/repositories/portfolioRepository.js`)

#### New Methods Added:

**`getCityTier(cityId)`**
- Fetches city_tier from cities table
- Returns city_tier string or null if city not found
- Used by service layer to populate portfolio.city_tier

```javascript
async getCityTier(cityId) {
  const city = await City.findByPk(cityId, {
    attributes: ['cityTier']
  });
  return city ? city.cityTier : null;
}
```

**`getSubscriptionById(subscriptionId)`**
- Fetches subscription details
- Returns id, finalPrice, planName, status
- Used to determine if portfolio is from free plan

```javascript
async getSubscriptionById(subscriptionId) {
  return await UserSubscription.findByPk(subscriptionId, {
    attributes: ['id', 'finalPrice', 'planName', 'status']
  });
}
```

**`findByCategoryAndTier(categoryId, cityTier, options)`**
- Query portfolios by category and city tier
- Supports pagination
- Returns portfolios with city_tier and is_free_plan_portfolio
- Ordered by featured status first, then creation date

```javascript
async findByCategoryAndTier(categoryId, cityTier, options = {}) {
  // Returns portfolios filtered by category + city tier
  // Includes pagination support
  // Orders by is_featured DESC, created_at DESC
}
```

**`countByUserAndCategory(userId, categoryId, status)`**
- Count portfolios by user and category
- Optional status filter
- Used for quota checking

```javascript
async countByUserAndCategory(userId, categoryId, status = null) {
  const where = { userId, categoryId };
  if (status) where.status = status;
  return await Portfolio.count({ where });
}
```

#### Updated Methods:

**`findByUserId()`**
- ✅ Added `cityTier` to attributes
- ✅ Added `isFreePlanPortfolio` to attributes
- ✅ Added `cityTier` to City include

**`findById()`**
- ✅ Added `cityTier` to City include
- ✅ Added `finalPrice` and `cityTier` to UserSubscription include

**`findByIdAndUserId()`**
- ✅ Added `cityTier` to City include
- ✅ Added UserSubscription include with finalPrice and cityTier

---

### 3. Portfolio Controller (`src/controllers/vendor/portfolioController.js`)

**No changes required** - Controller passes data through to service layer. All business logic handled in service and repository.

---

### 4. Constants (`src/utils/constants/messages.js`)

#### Added Error Message:
```javascript
CITY_NOT_FOUND: 'City not found'
```

Used when city_tier lookup fails during portfolio creation/update.

---

## Data Flow

### Portfolio Creation Flow:

```
1. Controller receives request
   ↓
2. Service validates input data
   ↓
3. Service calls repository.getCityTier(cityId)
   ↓
4. Repository queries cities table for city_tier
   ↓
5. Service calls repository.getSubscriptionById(subscriptionId)
   ↓
6. Repository queries user_subscriptions for finalPrice
   ↓
7. Service determines isFreePlanPortfolio (finalPrice === 0)
   ↓
8. Service calls repository.create() with:
   - cityTier (from cities table)
   - isFreePlanPortfolio (calculated)
   ↓
9. Repository creates portfolio record
   ↓
10. Response returned to client
```

### Portfolio Update Flow (City Change):

```
1. Controller receives update request
   ↓
2. Service validates portfolio exists and is editable
   ↓
3. If cityId is being updated:
   - Service calls repository.getCityTier(newCityId)
   - Repository queries cities table
   - Service includes cityTier in update data
   ↓
4. Service calls repository.update()
   ↓
5. Repository updates portfolio record
   ↓
6. Response returned to client
```

---

## Query Examples

### Get Portfolios by Category and Tier:
```javascript
const portfolios = await portfolioRepository.findByCategoryAndTier(
  5,           // categoryId (Photography)
  'tier_1',    // cityTier
  { page: 1, limit: 20, status: 'published' }
);
```

### Count User's Portfolios in Category:
```javascript
const count = await portfolioRepository.countByUserAndCategory(
  userId,
  categoryId,
  'published'  // optional status filter
);
```

### Get City Tier:
```javascript
const cityTier = await portfolioRepository.getCityTier(cityId);
// Returns: 'tier_1', 'tier_2', 'tier_3', etc.
```

### Check if Subscription is Free:
```javascript
const subscription = await portfolioRepository.getSubscriptionById(subscriptionId);
const isFree = subscription.finalPrice === 0 || subscription.finalPrice === '0.00';
```

---

## Database Trigger Integration

The database trigger `trigger_set_portfolio_city_tier` will also auto-populate city_tier on INSERT/UPDATE:

```sql
CREATE TRIGGER trigger_set_portfolio_city_tier
  BEFORE INSERT OR UPDATE OF city_id ON portfolios
  FOR EACH ROW
  EXECUTE FUNCTION set_portfolio_city_tier();
```

This provides **double protection**:
1. Application layer populates city_tier (service layer)
2. Database trigger ensures city_tier is always in sync with city_id

---

## Validation Rules

### Portfolio Creation:
- ✅ City must exist in cities table
- ✅ City tier is automatically fetched and populated
- ✅ Free plan status is automatically determined from subscription
- ✅ All existing validations remain (title, category, price, etc.)

### Portfolio Update:
- ✅ If cityId changes, city_tier is automatically updated
- ✅ City must exist in cities table
- ✅ Cannot edit published portfolios (existing rule)
- ✅ is_free_plan_portfolio is NOT updated (historical record)

---

## Response Format

### Portfolio List Response:
```json
{
  "success": true,
  "message": "Portfolios retrieved successfully",
  "data": {
    "portfolios": [
      {
        "id": 1,
        "title": "Wedding Photography Package",
        "cityTier": "tier_1",
        "isFreePlanPortfolio": false,
        "status": "published",
        "isFeatured": true,
        "city": {
          "id": 123,
          "name": "Mumbai",
          "slug": "mumbai",
          "cityTier": "tier_1"
        }
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

### Portfolio Detail Response:
```json
{
  "success": true,
  "message": "Portfolio retrieved successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "title": "Wedding Photography Package",
      "cityTier": "tier_1",
      "isFreePlanPortfolio": false,
      "city": {
        "id": 123,
        "name": "Mumbai",
        "cityTier": "tier_1"
      },
      "userSubscription": {
        "id": 456,
        "planName": "Photography - Tier 1 Premium",
        "status": "active",
        "finalPrice": "2999.00",
        "cityTier": "tier_1"
      }
    }
  }
}
```

---

## Testing Checklist

### Unit Tests Needed:
- [ ] portfolioService.createPortfolio() - city tier population
- [ ] portfolioService.createPortfolio() - free plan detection
- [ ] portfolioService.updatePortfolio() - city tier update on city change
- [ ] portfolioRepository.getCityTier() - valid city
- [ ] portfolioRepository.getCityTier() - invalid city (returns null)
- [ ] portfolioRepository.getSubscriptionById() - free plan
- [ ] portfolioRepository.getSubscriptionById() - paid plan
- [ ] portfolioRepository.findByCategoryAndTier() - filtering

### Integration Tests Needed:
- [ ] Create portfolio with valid city - city_tier populated
- [ ] Create portfolio with invalid city - error returned
- [ ] Create portfolio with free subscription - isFreePlanPortfolio = true
- [ ] Create portfolio with paid subscription - isFreePlanPortfolio = false
- [ ] Update portfolio city - city_tier updated
- [ ] Query portfolios by category + tier - correct results

---

## Next Steps

### Phase 2: Subscription Eligibility Service
Create `src/services/subscriptionEligibilityService.js` with:
- `hasActiveSubscription(userId)`
- `hasActiveSubscriptionForCategory(userId, categoryId)`
- `hasActiveSubscriptionForCategoryAndTier(userId, categoryId, cityTier)`
- `getSubscriptionEligibility(userId, categoryId, cityTier)`
- `canUpgradeSubscription(currentSubscriptionId, newPlanId)`

### Phase 3: Portfolio Creation Validation
Update `portfolioService.createPortfolio()` to add:
- Check active subscription exists for category
- Validate city tier matches subscription tier
- Check portfolio quota not exceeded
- Prevent duplicate portfolio for same subscription

### Phase 4: API Endpoints
- `GET /api/vendor/subscriptions/eligibility` - Check eligibility
- `POST /api/vendor/portfolios/validate-creation` - Validate before creation
- `GET /api/vendor/subscription-plans` - Get plans by category + tier

---

## Status

**Phase 1: Base Code Updates** ✅ COMPLETE

- ✅ Portfolio service updated
- ✅ Portfolio repository updated
- ✅ City tier auto-population implemented
- ✅ Free plan detection implemented
- ✅ New repository methods added
- ✅ Error messages added

**Ready for**: Database SQL updates, then Phase 2 (Subscription Eligibility Service)
