# Utils Migration Analysis - From Backup to Current Project

## Overview

Analysis of utility files from `backup_2026-05-03_022141/utils/` to determine what can be reused in the WedConnect project.

---

## ✅ Files to Move AS-IS (No Changes Needed)

### 1. **storageHelper.js** ✅
**Status:** Move as-is
**Location:** `src/utils/storageHelper.js`

**Why:** 
- Already compatible with WedConnect's storage system
- Handles local and Cloudinary storage
- Uses environment variables correctly
- getFullUrl() function needed for model getters

**Usage:**
- Portfolio media URLs
- User profile photos
- Chat media
- Any file uploads

---

### 2. **timestampFormatter.js** ✅
**Status:** Move as-is
**Location:** `src/utils/timestampFormatter.js`

**Why:**
- Simple utility for formatting dates
- No dependencies on project-specific code
- Useful for displaying dates in UI-friendly format

**Usage:**
- Format created_at, updated_at timestamps
- Display dates in notifications
- Format invoice dates

---

### 3. **invoiceNumberGenerator.js** ✅
**Status:** Move as-is
**Location:** `src/utils/invoiceNumberGenerator.js`

**Why:**
- Generates sequential invoice numbers (WC/2026/0001)
- Generates transaction numbers (TXN/2026/0001)
- Uses environment variables (INVOICE_PREFIX, TRANSACTION_PREFIX)
- Already uses Sequelize correctly

**Usage:**
- Generate invoice numbers for subscriptions
- Generate transaction numbers for payments

---

### 4. **formDataParser.js** ✅
**Status:** Move as-is
**Location:** `src/utils/formDataParser.js`

**Why:**
- Essential for handling multipart/form-data
- Converts form strings to proper types
- Handles arrays, JSON, booleans, integers, floats
- No project-specific dependencies

**Usage:**
- Parse portfolio creation data
- Parse profile update data
- Handle any form submissions with file uploads

**Note:** Remove `parseCarListingData` and `parsePropertyListingData` functions (not needed for WedConnect)

---

### 5. **constants/activityTypes.js** ✅
**Status:** Move as-is
**Location:** `src/utils/constants/activityTypes.js`

**Why:**
- Defines activity tracking constants
- Useful for user activity logging
- No modifications needed

**Usage:**
- Track portfolio views
- Track chat initiations
- Analytics and user behavior tracking

---

## 🔧 Files to Move WITH MODIFICATIONS

### 6. **customSlugify.js** 🔧
**Status:** Already created (but can enhance)
**Location:** `src/utils/customSlugify.js`

**Current Status:** We already created a version
**Backup Version:** Uses `slugify` package and has `getIndianTimestamp()`

**Recommendation:** 
- Keep our current version (uses crypto, no external dependency)
- Optionally add `getIndianTimestamp()` if needed for IST timestamps

**Modifications Needed:**
```javascript
// Add this function if IST timestamps are needed
export const getIndianTimestamp = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(utc + istOffset);

  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  const hour = String(istDate.getHours()).padStart(2, '0');
  const minute = String(istDate.getMinutes()).padStart(2, '0');
  const second = String(istDate.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hour}${minute}${second}`;
};
```

---

### 7. **jwtHelper.js** 🔧
**Status:** Already created (keep ours)
**Location:** `src/utils/jwtHelper.js`

**Current Status:** We already created a better version
**Backup Version:** Similar but uses different config approach

**Recommendation:** Keep our current version
**Why:** Our version uses `config.jwt.*` which is cleaner

---

### 8. **responseFormatter.js** 🔧
**Status:** Already created (but can enhance)
**Location:** `src/utils/responseFormatter.js`

**Current Status:** We already created a version with `code` field
**Backup Version:** Doesn't have `code` field

**Recommendation:** Keep our current version
**Why:** Our version includes `code` field which matches PHASE-1 API spec

**Optional Addition:** Add `paymentRequiredResponse()` from backup:
```javascript
export const paymentRequiredResponse = (res, message = 'Payment required', data = null) => {
  return res.status(402).json({
    success: false,
    code: 'PAYMENT_REQUIRED',
    message,
    data
  });
};
```

---

### 9. **locationHelper.js** 🔧
**Status:** Adapt for WedConnect
**Location:** `src/utils/locationHelper.js`

**Modifications Needed:**
- Remove listing-specific references
- Adapt for portfolio-based system
- Keep distance calculation functions
- Keep IP geolocation helpers
- Update `parseUserLocation()` to work with User model (not UserProfile)

**Functions to Keep:**
- `calculateDistance()` - Distance between coordinates
- `toRadians()` - Helper for distance calculation
- `getClientIP()` - Extract client IP
- `isValidIP()` - Validate IP address
- `isPrivateIP()` - Check if IP is private
- `extractGeoHeaders()` - Get location from CDN headers

**Functions to Adapt:**
- `parseUserLocation()` - Update for User model with city/state fields
- `getLocationMatch()` - Adapt for portfolio location matching

**Functions to Remove:**
- `getLocationFromIP()` - Implement later when needed
- `reverseGeocode()` - Implement later when needed

---

### 10. **scoringHelper.js** 🔧
**Status:** Adapt for WedConnect portfolios
**Location:** `src/utils/scoringHelper.js`

**Modifications Needed:**
- Rename from "listing" to "portfolio"
- Adapt scoring for wedding services
- Keep location scoring logic
- Keep featured/paid scoring
- Keep freshness scoring

**Functions to Keep (with renaming):**
- `calculateLocationScore()` - For portfolio location relevance
- `calculateDistance()` - Distance calculation
- `calculateFeaturedScore()` - Featured portfolio scoring
- `calculateFreshnessScore()` - Recent portfolio bonus
- `calculateTotalScore()` - Overall portfolio score

**Functions to Adapt:**
- `calculatePaidListingScore()` → `calculateSubscriptionScore()`
- `sortListings()` → `sortPortfolios()`
- `sortListingsWithPrimary()` → `sortPortfoliosWithPrimary()`

**Functions to Remove:**
- `calculateSimilarityScore()` - Not needed for Phase 1

---

### 11. **searchHelper.js** 🔧
**Status:** Adapt for WedConnect portfolios
**Location:** `src/utils/searchHelper.js`

**Modifications Needed:**
- Rename from "listing" to "portfolio"
- Update keywords generation for wedding services
- Adapt search filters for portfolios
- Keep PostgreSQL full-text search logic

**Functions to Keep (with modifications):**
- `generateKeywords()` - Generate search keywords for portfolios
- `buildSearchWhere()` - Build WHERE clause for portfolio search
- `buildSearchOrder()` - Build ORDER BY for search results

**Functions to Remove:**
- `getSearchSuggestions()` - Implement later when needed

**Modifications:**
```javascript
// Update generateKeywords for portfolios
static generateKeywords(portfolioData, categoryData = null) {
  const keywords = [];
  
  if (portfolioData.title) keywords.push(portfolioData.title.toLowerCase());
  if (portfolioData.description) keywords.push(portfolioData.description.toLowerCase());
  if (portfolioData.cityName) keywords.push(portfolioData.cityName.toLowerCase());
  if (portfolioData.stateName) keywords.push(portfolioData.stateName.toLowerCase());
  
  // Category-specific keywords
  if (categoryData && categoryData.name) {
    keywords.push(categoryData.name.toLowerCase());
  }
  
  // Price range keywords
  if (portfolioData.startingPrice) {
    const price = parseFloat(portfolioData.startingPrice);
    if (price < 10000) keywords.push('budget');
    else if (price < 50000) keywords.push('affordable');
    else if (price < 100000) keywords.push('premium');
    else keywords.push('luxury');
  }
  
  return [...new Set(keywords.filter(Boolean))].join(' ');
}
```

---

### 12. **socketHelper.js** 🔧
**Status:** Adapt for WedConnect
**Location:** `src/utils/socketHelper.js`

**Modifications Needed:**
- Update repository imports
- Keep unread count emission logic
- Adapt for portfolio-based chat

**Functions to Keep:**
- `getUnreadCountHandler()` - Get socket handler from app
- `emitChatCountUpdate()` - Emit chat unread count
- `emitNotificationCountUpdate()` - Emit notification count
- `emitBothCountsUpdate()` - Emit both counts

**Note:** Will need to update repository references when chat module is implemented

---

### 13. **subscriptionQuotaHelper.js** 🔧
**Status:** Adapt for WedConnect portfolios
**Location:** `src/utils/subscriptionQuotaHelper.js`

**Modifications Needed:**
- Rename "Listing" to "Portfolio"
- Update model imports
- Keep quota checking logic
- Adapt for portfolio creation limits

**Functions to Keep (with renaming):**
- `getUserActiveSubscription()` - Get user's active subscription
- `countUserPortfolios()` - Count portfolios (was countUserListings)
- `canUserCreatePortfolio()` - Check if user can create portfolio
- `getUserQuotaUsage()` - Get quota usage summary

**Important:** This is critical for subscription-based portfolio limits

---

## ❌ Files NOT Needed for WedConnect

### 14. **essentialDataBuilder.js** ❌
**Status:** Don't migrate
**Why:** 
- Specific to car/property listings
- WedConnect uses portfolios, not classified listings
- Not applicable to wedding services

---

### 15. **notificationIntegration.js** ❌
**Status:** Don't migrate (it's just examples)
**Why:**
- This is just integration examples, not actual code
- We'll implement notification integration when building each module
- Keep as reference in backup folder

---

## 📋 Migration Priority

### Phase 1 (Immediate - Needed for Auth & Profile)
1. ✅ **storageHelper.js** - Already needed for profile photos
2. ✅ **formDataParser.js** - Needed for profile updates
3. ✅ **timestampFormatter.js** - Useful for date display
4. ✅ **invoiceNumberGenerator.js** - Needed for subscriptions

### Phase 2 (Subscription Module)
5. 🔧 **subscriptionQuotaHelper.js** - Critical for portfolio limits

### Phase 3 (Portfolio Module)
6. 🔧 **locationHelper.js** - For location-based portfolio search
7. 🔧 **scoringHelper.js** - For portfolio relevance scoring
8. 🔧 **searchHelper.js** - For portfolio search functionality
9. ✅ **constants/activityTypes.js** - For activity tracking

### Phase 4 (Chat Module)
10. 🔧 **socketHelper.js** - For real-time chat features

---

## 🎯 Action Plan

### Step 1: Move AS-IS Files
```bash
# Copy these files directly
cp backup_2026-05-03_022141/utils/storageHelper.js src/utils/
cp backup_2026-05-03_022141/utils/timestampFormatter.js src/utils/
cp backup_2026-05-03_022141/utils/invoiceNumberGenerator.js src/utils/
cp backup_2026-05-03_022141/utils/formDataParser.js src/utils/
cp backup_2026-05-03_022141/utils/constants/activityTypes.js src/utils/constants/
```

### Step 2: Enhance Existing Files
- Add `paymentRequiredResponse()` to `responseFormatter.js`
- Optionally add `getIndianTimestamp()` to `customSlugify.js`

### Step 3: Adapt Files for Later Phases
- Create adapted versions when implementing each module
- Keep backup versions as reference

---

## 📝 Summary

| File | Status | Action | Priority |
|------|--------|--------|----------|
| storageHelper.js | ✅ Move AS-IS | Copy directly | High |
| timestampFormatter.js | ✅ Move AS-IS | Copy directly | High |
| invoiceNumberGenerator.js | ✅ Move AS-IS | Copy directly | High |
| formDataParser.js | ✅ Move AS-IS | Copy directly (remove car/property functions) | High |
| activityTypes.js | ✅ Move AS-IS | Copy directly | Medium |
| customSlugify.js | 🔧 Already created | Optionally enhance | Low |
| jwtHelper.js | 🔧 Already created | Keep current version | N/A |
| responseFormatter.js | 🔧 Already created | Optionally add paymentRequiredResponse | Low |
| locationHelper.js | 🔧 Adapt | Modify for portfolios | Medium |
| scoringHelper.js | 🔧 Adapt | Modify for portfolios | Medium |
| searchHelper.js | 🔧 Adapt | Modify for portfolios | Medium |
| socketHelper.js | 🔧 Adapt | Modify for portfolios | Low |
| subscriptionQuotaHelper.js | 🔧 Adapt | Modify for portfolios | High |
| essentialDataBuilder.js | ❌ Don't migrate | Not applicable | N/A |
| notificationIntegration.js | ❌ Don't migrate | Just examples | N/A |

---

## 🚀 Next Steps

1. **Immediate:** Copy the 5 AS-IS files
2. **Profile Module:** Use formDataParser and storageHelper
3. **Subscription Module:** Adapt subscriptionQuotaHelper
4. **Portfolio Module:** Adapt location, scoring, and search helpers
5. **Chat Module:** Adapt socketHelper

---

**Total Files to Migrate:** 13 out of 15
**Ready to Use:** 5 files
**Need Adaptation:** 8 files
**Not Needed:** 2 files
