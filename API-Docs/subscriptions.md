# Subscription API Documentation

## Overview

The Subscription API manages subscription plans and user subscriptions for the WedConnect platform. Each subscription plan is specific to a category (e.g., Photography, Catering) and city tier (tier_1, tier_2, tier_3, tier_4, tier_5).

**Key Concepts:**
- One subscription = One portfolio
- Subscription plans are category + city tier specific
- Users can have multiple active subscriptions (different category or tier)
- Subscriptions enforce quotas (albums, photos, videos, storage)

---

## Public Endpoints

### 1. Get All Plans

Get all active and public subscription plans.

**Endpoint:** `GET /api/public/subscriptions/plans`

**Query Parameters:**
- `categoryId` (optional) - Filter by category ID
- `categorySlug` (optional) - Filter by category slug
- `cityTier` (optional) - Filter by city tier (tier_1, tier_2, tier_3, tier_4, tier_5)
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Items per page

**Response:**
```json
{
  "success": true,
  "message": "Subscription plans retrieved successfully",
  "data": {
    "plans": [
      {
        "id": 1,
        "planCode": "PHOTO-T1-BASIC",
        "name": "Basic Photography - Tier 1",
        "slug": "basic-photography-tier-1",
        "description": "Perfect for starting photographers",
        "shortDescription": "1 portfolio, 5 albums, 50 photos per album",
        "basePrice": "5000.00",
        "discountAmount": "500.00",
        "finalPrice": "4500.00",
        "currency": "INR",
        "durationDays": 365,
        "categoryId": 5,
        "categoryName": "Photography",
        "categorySlug": "photography",
        "cityTier": "tier_1",
        "maxPublishedPortfolios": 1,
        "maxAlbumsPerPortfolio": 5,
        "maxPhotosPerAlbum": 50,
        "maxVideosPerAlbum": 0,
        "maxStorageMb": 500,
        "allowVideos": false,
        "isFeaturedAllowed": false,
        "featuredDays": 0,
        "isBoostedAllowed": false,
        "boostedDays": 0,
        "features": {},
        "isActive": true,
        "isPublic": true,
        "category": {
          "id": 5,
          "name": "Photography",
          "slug": "photography",
          "icon": "uploads/categories/photography.png",
          "iconStorageType": "local"
        }
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

---

### 2. Get Plan by ID

Get a specific subscription plan by ID.

**Endpoint:** `GET /api/public/subscriptions/plans/:id`

**Response:** Same as single plan object above

---

### 3. Get Plan by Slug

Get a specific subscription plan by slug.

**Endpoint:** `GET /api/public/subscriptions/plans/slug/:slug`

**Response:** Same as single plan object above

---

### 4. Get Plans by Category

Get all plans for a specific category.

**Endpoint:** `GET /api/public/subscriptions/plans/category/:categorySlug`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response:** Same as Get All Plans

---

### 5. Get Plans by Category and Tier

Get all plans for a specific category and city tier.

**Endpoint:** `GET /api/public/subscriptions/plans/category/:categorySlug/tier/:tier`

**Example:** `GET /api/public/subscriptions/plans/category/photography/tier/tier_1`

**Response:** Same as Get All Plans

---

## Vendor Endpoints

**Authentication Required:** All vendor endpoints require JWT token in Authorization header.

### 1. Get My Subscriptions

Get all subscriptions for the authenticated user.

**Endpoint:** `GET /api/vendor/subscriptions`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `status` (optional) - Filter by status (pending, active, expired, cancelled, suspended)
- `categoryId` (optional) - Filter by category ID
- `cityTier` (optional) - Filter by city tier
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response:**
```json
{
  "success": true,
  "message": "User subscriptions retrieved successfully",
  "data": {
    "subscriptions": [
      {
        "id": 123,
        "userId": 456,
        "planId": 1,
        "status": "active",
        "planName": "Basic Photography - Tier 1",
        "planCode": "PHOTO-T1-BASIC",
        "categoryId": 5,
        "categoryName": "Photography",
        "categorySlug": "photography",
        "cityTier": "tier_1",
        "finalPrice": "4500.00",
        "currency": "INR",
        "durationDays": 365,
        "maxPublishedPortfolios": 1,
        "maxAlbumsPerPortfolio": 5,
        "maxPhotosPerAlbum": 50,
        "maxVideosPerAlbum": 0,
        "maxStorageMb": 500,
        "allowVideos": false,
        "activatedAt": "2026-05-27T10:00:00Z",
        "endsAt": "2027-05-27T10:00:00Z",
        "plan": {
          "id": 1,
          "name": "Basic Photography - Tier 1",
          "slug": "basic-photography-tier-1",
          "planCode": "PHOTO-T1-BASIC"
        },
        "portfolios": [
          {
            "id": 789,
            "title": "My Wedding Photography Portfolio",
            "slug": "my-wedding-photography-portfolio",
            "status": "published",
            "createdAt": "2026-05-27T11:00:00Z"
          }
        ]
      }
    ],
    "pagination": {
      "total": 3,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

---

### 2. Get My Active Subscriptions

Get active subscriptions for the authenticated vendor (useful for portfolio creation dropdown).

**Endpoint:** `GET /api/vendor/subscriptions/active`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `useStatus` (optional, default: `all`) - Filter by usage status (`all`, `used`, `unused`).
- `categoryId` (optional) - Filter by category ID.

**Response:**
```json
{
  "success": true,
  "message": "User subscriptions retrieved successfully",
  "data": [
    {
      "id": 2,
      "planName": "Tier 1 Photographers Annual",
      "planCode": "PHOTOGRAPHERS_T1_ANNUAL",
      "categoryId": 1,
      "categoryName": "Photographers",
      "categorySlug": "photographers",
      "cityTier": "tier_1",
      "endsAt": "2027-06-04T14:00:02.909Z",
      "useStatus": "unused"
    }
  ]
}
```

---

### 3. Get My Subscription by ID

Get a specific subscription by ID.

**Endpoint:** `GET /api/vendor/subscriptions/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** Same as single subscription object above

---

### 3. Purchase Subscription

Purchase a new subscription plan.

**Endpoint:** `POST /api/vendor/subscriptions/purchase`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "planId": 1,
  "paymentGateway": "razorpay"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription purchased successfully",
  "data": {
    "subscription": {
      "id": 123,
      "userId": 456,
      "planId": 1,
      "status": "active",
      "planName": "Basic Photography - Tier 1",
      "categoryId": 5,
      "categoryName": "Photography",
      "cityTier": "tier_1",
      "finalPrice": "4500.00",
      "activatedAt": "2026-05-27T10:00:00Z",
      "endsAt": "2027-05-27T10:00:00Z"
    }
  }
}
```

**Error Responses:**
- `400` - Plan not found, plan inactive, or duplicate subscription exists

---

### 4. Cancel Subscription

Cancel an active subscription.

**Endpoint:** `POST /api/vendor/subscriptions/cancel/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "No longer need the service"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription cancelled successfully"
}
```

---

### 5. Check Eligibility

Check subscription eligibility for the authenticated user.

**Endpoint:** `GET /api/vendor/subscriptions/eligibility`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `categoryId` (optional) - Check eligibility for specific category
- `cityId` (optional) - Check eligibility for specific city

**Response:**
```json
{
  "success": true,
  "message": "Subscription eligibility checked successfully",
  "data": {
    "hasActiveSubscription": true,
    "activeSubscriptions": [
      {
        "id": 123,
        "categoryId": 5,
        "categoryName": "Photography",
        "categorySlug": "photography",
        "cityTier": "tier_1",
        "status": "active",
        "currentPortfolioCount": 1,
        "maxPortfolios": 1,
        "isUsed": true,
        "canCreatePortfolio": false,
        "endsAt": "2027-05-27T10:00:00Z"
      }
    ],
    "categoryCheck": {
      "categoryId": 5,
      "hasActiveSubscription": true,
      "subscriptionsByTier": {
        "tier_1": {
          "hasSubscription": true,
          "subscriptionId": 123,
          "isUsed": true,
          "canCreatePortfolio": false,
          "canPurchase": false
        },
        "tier_2": {
          "hasSubscription": false,
          "canPurchase": true,
          "availablePlans": [
            {
              "id": 2,
              "name": "Basic Photography - Tier 2",
              "finalPrice": "3500.00"
            }
          ]
        }
      }
    },
    "cityCheck": {
      "cityId": 10,
      "cityTier": "tier_1",
      "hasActiveSubscription": true,
      "subscriptionId": 123,
      "isUsed": true,
      "canCreatePortfolio": false
    }
  }
}
```

---

### 6. Validate Portfolio Creation

Validate if a portfolio can be created with a specific subscription.

**Endpoint:** `POST /api/vendor/subscriptions/validate-portfolio-creation`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userSubscriptionId": 123,
  "categoryId": 5,
  "cityId": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio creation validated successfully",
  "data": {
    "canCreate": true,
    "subscription": {
      "id": 123,
      "categoryId": 5,
      "categoryName": "Photography",
      "cityTier": "tier_1",
      "currentPortfolioCount": 0,
      "maxPortfolios": 1
    },
    "cityTier": "tier_1",
    "tierMatch": true,
    "categoryMatch": true
  }
}
```

**Error Responses:**
- `400` - Subscription not found, not active, already used, category mismatch, or tier mismatch

---

### 7. Get Available Plans

Get available plans for purchase for a specific category and tier.

**Endpoint:** `GET /api/vendor/subscriptions/available-plans`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `categoryId` (required) - Category ID
- `cityTier` (required) - City tier (tier_1, tier_2, tier_3, tier_4, tier_5)

**Response:**
```json
{
  "success": true,
  "message": "Available plans retrieved successfully",
  "data": {
    "categoryId": 5,
    "cityTier": "tier_1",
    "hasActiveSubscription": false,
    "existingSubscriptionId": null,
    "plans": [
      {
        "id": 1,
        "name": "Basic Photography - Tier 1",
        "slug": "basic-photography-tier-1",
        "finalPrice": "4500.00",
        "maxAlbumsPerPortfolio": 5,
        "maxPhotosPerAlbum": 50
      }
    ]
  }
}
```

---

## Panel (Admin) Endpoints

**Authentication Required:** All panel endpoints require JWT token with admin/staff role.

### 1. Get All Plans (Admin)

Get all subscription plans (including inactive and non-public).

**Endpoint:** `GET /api/panel/subscriptions/plans`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `categoryId` (optional)
- `categorySlug` (optional)
- `cityTier` (optional)
- `isActive` (optional) - true/false
- `isPublic` (optional) - true/false
- `isDefault` (optional) - true/false
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response:** Same as public Get All Plans

---

### 2. Get Plan by ID (Admin)

**Endpoint:** `GET /api/panel/subscriptions/plans/:id`

**Response:** Same as public Get Plan by ID

---

### 3. Create Plan

Create a new subscription plan.

**Endpoint:** `POST /api/panel/subscriptions/plans`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Premium Photography - Tier 1",
  "description": "Premium plan for professional photographers",
  "shortDescription": "1 portfolio, 10 albums, 100 photos per album",
  "categoryId": 5,
  "categoryName": "Photography",
  "categorySlug": "photography",
  "cityTier": "tier_1",
  "basePrice": "10000.00",
  "discountAmount": "1000.00",
  "finalPrice": "9000.00",
  "currency": "INR",
  "durationDays": 365,
  "maxAlbumsPerPortfolio": 10,
  "maxPhotosPerAlbum": 100,
  "maxVideosPerAlbum": 5,
  "maxStorageMb": 2000,
  "allowVideos": true,
  "isFeaturedAllowed": true,
  "featuredDays": 30,
  "isBoostedAllowed": true,
  "boostedDays": 15,
  "isActive": true,
  "isPublic": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription plan created successfully",
  "data": {
    "plan": {
      "id": 10,
      "name": "Premium Photography - Tier 1",
      "slug": "premium-photography-tier-1",
      "planCode": "PHOTO-T1-PREM-001"
    }
  }
}
```

---

### 4. Update Plan

Update an existing subscription plan.

**Endpoint:** `PUT /api/panel/subscriptions/plans/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:** Same as Create Plan (partial updates allowed)

**Response:**
```json
{
  "success": true,
  "message": "Subscription plan updated successfully",
  "data": {
    "plan": { /* updated plan object */ }
  }
}
```

---

### 5. Delete Plan

Soft delete a subscription plan.

**Endpoint:** `DELETE /api/panel/subscriptions/plans/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription plan deleted successfully"
}
```

---

### 6. Update Plan Status

Update plan active status.

**Endpoint:** `PATCH /api/panel/subscriptions/plans/status/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "isActive": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription plan status updated successfully"
}
```

---

### 7. Get All User Subscriptions

Get all user subscriptions across the platform.

**Endpoint:** `GET /api/panel/subscriptions/user-subscriptions`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `status` (optional) - Filter by status
- `categoryId` (optional) - Filter by category
- `userId` (optional) - Filter by user
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response:**
```json
{
  "success": true,
  "message": "User subscriptions retrieved successfully",
  "data": {
    "subscriptions": [
      {
        "id": 123,
        "userId": 456,
        "planId": 1,
        "status": "active",
        "categoryName": "Photography",
        "cityTier": "tier_1",
        "finalPrice": "4500.00",
        "endsAt": "2027-05-27T10:00:00Z",
        "user": {
          "id": 456,
          "fullName": "John Doe",
          "email": "john@example.com",
          "mobile": "9876543210"
        },
        "plan": {
          "id": 1,
          "name": "Basic Photography - Tier 1",
          "slug": "basic-photography-tier-1"
        }
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
}
```

---

### 8. Get User Subscription by ID

Get a specific user subscription by ID.

**Endpoint:** `GET /api/panel/subscriptions/user-subscriptions/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** Same as single subscription object above

---

### 9. Update Subscription Status

Update user subscription status.

**Endpoint:** `PATCH /api/panel/subscriptions/user-subscriptions/status/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "suspended"
}
```

**Valid Statuses:** `pending`, `active`, `expired`, `cancelled`, `suspended`

**Response:**
```json
{
  "success": true,
  "message": "Subscription status updated successfully"
}
```

---

## Error Responses

All endpoints follow standard error response format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common Error Codes:**
- `400` - Bad Request (validation errors, business logic errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Business Rules

### 1. One Subscription = One Portfolio
- Each subscription can only be used to create one portfolio
- Once a portfolio is created with a subscription, that subscription cannot be used again
- User must purchase a new subscription to create another portfolio

### 2. Category Match
- Portfolio category must match subscription category
- Cannot create a Photography portfolio with a Catering subscription

### 3. City Tier Match
- Portfolio city must match subscription city tier
- Cannot create a portfolio in a Tier 2 city with a Tier 1 subscription

### 4. Multiple Subscriptions
- Users can have multiple active subscriptions
- Each subscription must be for a different category OR different tier
- Cannot have two active subscriptions for same category + tier combination

### 5. Quota Enforcement
- **Albums:** Limited by `maxAlbumsPerPortfolio`
- **Photos:** Limited by `maxPhotosPerAlbum` per album
- **Videos:** Limited by `maxVideosPerAlbum` per album (if `allowVideos` is true)
- **Storage:** Limited by `maxStorageMb` across all portfolios in subscription

---

## Integration Notes

### Portfolio Creation Flow
1. User selects category and city
2. Frontend calls `/api/vendor/subscriptions/eligibility?categoryId=X&cityId=Y`
3. Check if user has active subscription for that category + tier
4. If no subscription, show available plans
5. User purchases subscription
6. User creates portfolio with `userSubscriptionId`
7. Backend validates subscription before creating portfolio

### Quota Check Flow
1. Before creating album: Check `maxAlbumsPerPortfolio`
2. Before uploading photo: Check `maxPhotosPerAlbum` and `maxStorageMb`
3. Before uploading video: Check `allowVideos`, `maxVideosPerAlbum`, and `maxStorageMb`
4. Return error if quota exceeded

---

## Testing Scenarios

### Scenario 1: Purchase and Create Portfolio
1. GET `/api/public/subscriptions/plans/category/photography/tier/tier_1`
2. POST `/api/vendor/subscriptions/purchase` with planId
3. POST `/api/vendor/subscriptions/validate-portfolio-creation`
4. POST `/api/vendor/portfolios` with userSubscriptionId

### Scenario 2: Check Eligibility
1. GET `/api/vendor/subscriptions/eligibility?categoryId=5`
2. Verify response shows subscriptions by tier
3. Verify available plans for tiers without subscription

### Scenario 3: Quota Enforcement
1. Create portfolio with subscription
2. Create albums until quota reached
3. Attempt to create one more album → Should fail
4. Upload photos until quota reached
5. Attempt to upload one more photo → Should fail

---

**Last Updated:** May 27, 2026
