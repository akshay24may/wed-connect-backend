# Subscription Validation Update

## Changes Made

### **1. Added `validatePortfolioUpdate()` Method**

**File:** `src/services/subscriptionCheckService.js`

**Purpose:** Validate subscription when updating portfolio, excluding the current portfolio from the count.

**Logic:**
```javascript
// When updating portfolio:
// 1. Check if subscription is active
// 2. Count published portfolios using this subscription
// 3. If current portfolio uses this subscription, exclude it from count
// 4. Validate category match
// 5. Validate city tier match
```

**Key Difference from `validatePortfolioCreation()`:**
- **Create:** Checks if subscription has ANY published portfolios
- **Update:** Checks if subscription has published portfolios EXCEPT the current one

**Example:**
```javascript
// Subscription allows 1 portfolio
// Portfolio A (published) uses Subscription X

// Scenario 1: Update Portfolio A with Subscription X
// - Count portfolios using Subscription X = 1
// - Portfolio A uses Subscription X? YES
// - Exclude Portfolio A from count = 0
// - Can update? YES ✓

// Scenario 2: Update Portfolio A with Subscription Y
// - Count portfolios using Subscription Y = 1 (Portfolio B)
// - Portfolio A uses Subscription Y? NO
// - Don't exclude from count = 1
// - Can update? NO ✗ (Subscription Y is already used)
```

---

### **2. Updated `updatePortfolio()` Method**

**File:** `src/services/portfolioService.js`

**Added 3 Validation Scenarios:**

#### **Scenario 1: Changing Subscription**
```javascript
if (portfolioData.userSubscriptionId && 
    portfolioData.userSubscriptionId !== existingPortfolio.userSubscriptionId) {
  
  // Validate new subscription with current category and city
  const validationResult = await subscriptionCheckService.validatePortfolioUpdate(
    userId,
    portfolioId,
    portfolioData.userSubscriptionId,  // NEW subscription
    categoryId,
    cityId
  );
}
```

**Example:**
- Portfolio uses Subscription A (Photography, Tier 1)
- User changes to Subscription B (Photography, Tier 1)
- Validates: Is Subscription B active? Is it already used by another published portfolio?

#### **Scenario 2: Changing Category**
```javascript
if (portfolioData.categoryId && 
    portfolioData.categoryId !== existingPortfolio.categoryId) {
  
  // Validate current subscription with new category
  const validationResult = await subscriptionCheckService.validatePortfolioUpdate(
    userId,
    portfolioId,
    existingPortfolio.userSubscriptionId,  // CURRENT subscription
    portfolioData.categoryId,              // NEW category
    cityId
  );
}
```

**Example:**
- Portfolio uses Subscription A (Photography, Tier 1)
- User changes category to Catering
- Validates: Does Subscription A support Catering? NO → Error

#### **Scenario 3: Changing City**
```javascript
if (portfolioData.cityId && 
    portfolioData.cityId !== existingPortfolio.cityId) {
  
  // Validate current subscription with new city
  const validationResult = await subscriptionCheckService.validatePortfolioUpdate(
    userId,
    portfolioId,
    existingPortfolio.userSubscriptionId,  // CURRENT subscription
    categoryId,
    portfolioData.cityId                   // NEW city
  );
}
```

**Example:**
- Portfolio uses Subscription A (Photography, Tier 1)
- User changes city from Delhi (Tier 1) to Jaipur (Tier 2)
- Validates: Does Subscription A support Tier 2? NO → Error

---

### **3. Added Helper Method**

**File:** `src/services/subscriptionCheckService.js`

**Method:** `_checkIfPortfolioUsesSubscription()`

**Purpose:** Check if a specific portfolio is using a specific subscription.

**Logic:**
```javascript
// Query: Does Portfolio X use Subscription Y?
const portfolio = await Portfolio.findOne({
  where: {
    id: portfolioId,
    userSubscriptionId: subscriptionId,
    status: 'published',
    deletedAt: null
  }
});

return !!portfolio; // true if found, false otherwise
```

**Used By:** `validatePortfolioUpdate()` to determine if current portfolio should be excluded from count.

---

## Validation Flow Diagrams

### **Create Portfolio Flow**
```
User creates portfolio
    ↓
Check: userSubscriptionId provided?
    ↓ YES
Validate subscription:
    - Is subscription active? ✓
    - Count published portfolios using this subscription
    - Is count < maxPublishedPortfolios? ✓
    - Does category match? ✓
    - Does city tier match? ✓
    ↓
Create portfolio ✓
```

### **Update Portfolio Flow**

#### **Case 1: Changing Subscription**
```
User updates portfolio (changes subscription)
    ↓
Check: userSubscriptionId changed?
    ↓ YES
Validate NEW subscription:
    - Is subscription active? ✓
    - Count published portfolios using NEW subscription
    - Exclude current portfolio? NO (doesn't use new subscription yet)
    - Is count < maxPublishedPortfolios? ✓
    - Does category match? ✓
    - Does city tier match? ✓
    ↓
Update portfolio ✓
```

#### **Case 2: Changing Category**
```
User updates portfolio (changes category)
    ↓
Check: categoryId changed?
    ↓ YES
Validate CURRENT subscription with NEW category:
    - Is subscription active? ✓
    - Count published portfolios using CURRENT subscription
    - Exclude current portfolio? YES (uses current subscription)
    - Is count < maxPublishedPortfolios? ✓
    - Does NEW category match subscription? ✓
    - Does city tier match? ✓
    ↓
Update portfolio ✓
```

#### **Case 3: Changing City**
```
User updates portfolio (changes city)
    ↓
Check: cityId changed?
    ↓ YES
Validate CURRENT subscription with NEW city:
    - Is subscription active? ✓
    - Count published portfolios using CURRENT subscription
    - Exclude current portfolio? YES (uses current subscription)
    - Is count < maxPublishedPortfolios? ✓
    - Does category match? ✓
    - Does NEW city tier match subscription? ✓
    ↓
Update portfolio ✓
```

---

## Test Scenarios

### **Scenario 1: Update with Same Subscription**
```javascript
// Setup:
// - Subscription A: Photography, Tier 1, allows 1 portfolio
// - Portfolio X: Published, uses Subscription A

// Action: Update Portfolio X (keep Subscription A)
// Expected: SUCCESS ✓
// Reason: Current portfolio is excluded from count
```

### **Scenario 2: Update with Different Subscription**
```javascript
// Setup:
// - Subscription A: Photography, Tier 1, allows 1 portfolio
// - Subscription B: Photography, Tier 1, allows 1 portfolio
// - Portfolio X: Published, uses Subscription A
// - Portfolio Y: Published, uses Subscription B

// Action: Update Portfolio X to use Subscription B
// Expected: FAIL ✗
// Reason: Subscription B is already used by Portfolio Y
```

### **Scenario 3: Update Category (Mismatch)**
```javascript
// Setup:
// - Subscription A: Photography, Tier 1
// - Portfolio X: Published, Photography, uses Subscription A

// Action: Update Portfolio X category to Catering
// Expected: FAIL ✗
// Reason: Subscription A is for Photography, not Catering
```

### **Scenario 4: Update City (Tier Mismatch)**
```javascript
// Setup:
// - Subscription A: Photography, Tier 1
// - Portfolio X: Published, Delhi (Tier 1), uses Subscription A

// Action: Update Portfolio X city to Jaipur (Tier 2)
// Expected: FAIL ✗
// Reason: Subscription A is for Tier 1, not Tier 2
```

### **Scenario 5: Update with Available Subscription**
```javascript
// Setup:
// - Subscription A: Photography, Tier 1, allows 1 portfolio
// - Subscription B: Photography, Tier 1, allows 1 portfolio
// - Portfolio X: Published, uses Subscription A
// - Subscription B: Not used

// Action: Update Portfolio X to use Subscription B
// Expected: SUCCESS ✓
// Reason: Subscription B is available (not used)
```

---

## Business Rules Enforced

| Rule | Create | Update |
|------|--------|--------|
| Subscription must be active | ✓ | ✓ |
| Subscription must not be fully used | ✓ | ✓ (except current) |
| Category must match | ✓ | ✓ |
| City tier must match | ✓ | ✓ |
| Only draft/pending portfolios can be edited | N/A | ✓ |
| Published portfolios cannot be edited | N/A | ✓ |

---

## Error Messages

### **Create Portfolio Errors**
- `NO_ACTIVE_SUBSCRIPTION` - No subscription provided
- `USER_SUBSCRIPTION_NOT_FOUND` - Subscription doesn't exist
- `SUBSCRIPTION_NOT_ACTIVE` - Subscription is not active
- `SUBSCRIPTION_ALREADY_USED` - Subscription quota exceeded
- `SUBSCRIPTION_CATEGORY_MISMATCH` - Category doesn't match
- `SUBSCRIPTION_TIER_MISMATCH` - City tier doesn't match

### **Update Portfolio Errors**
- Same as create, plus:
- `PORTFOLIO_NOT_FOUND` - Portfolio doesn't exist
- `Cannot edit published portfolio` - Portfolio is already published

---

## Summary

**What Changed:**
1. ✅ Added `validatePortfolioUpdate()` method
2. ✅ Added `_checkIfPortfolioUsesSubscription()` helper
3. ✅ Updated `updatePortfolio()` to validate subscription changes
4. ✅ Validates subscription when changing subscription ID
5. ✅ Validates subscription when changing category
6. ✅ Validates subscription when changing city

**Key Improvement:**
- **Create:** Checks if subscription has capacity for NEW portfolio
- **Update:** Checks if subscription has capacity, EXCLUDING current portfolio

**Result:**
- Users can update their portfolio with the same subscription ✓
- Users cannot switch to a subscription that's already fully used ✗
- Users cannot change category/city to mismatch subscription ✗

---

**Date:** May 27, 2026
**Status:** ✅ Complete
