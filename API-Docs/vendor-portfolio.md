# Vendor Portfolio API Documentation

Complete API reference for vendor portfolio management endpoints.

---

## Base URL

All endpoints are prefixed with: `/api/vendor/portfolios`

---

## Authentication

All endpoints require authentication. Include JWT token in Authorization header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Get Portfolios (List)

**GET** `/api/vendor/portfolios`

Get vendor's own portfolios with optional filtering and pagination.

**Query Parameters:**
- `status` (string, optional) - Filter by status: `draft`, `pending`, `published`, `rejected`
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Portfolios retrieved successfully",
  "data": {
    "portfolios": [
      {
        "id": 1,
        "title": "Premium Wedding Photography Package",
        "slug": "premium-wedding-photography-package-abc123",
        "shareCode": "ABC123XYZ",
        "description": "Complete wedding coverage with candid shots",
        "priceRangeMin": 50000,
        "priceRangeMax": 150000,
        "priceOnRequest": false,
        "cityTier": "tier_1",
        "isFreePlanPortfolio": false,
        "status": "published",
        "isFeatured": true,
        "coverImage": "https://example.com/uploads/portfolio/1/cover.jpg",
        "viewCount": 1250,
        "contactCount": 45,
        "totalFavorites": 89,
        "averageRating": 4.75,
        "totalReviews": 32,
        "publishedAt": "2024-01-15T10:30:00.000Z",
        "createdAt": "2024-01-10T08:00:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "category": {
          "id": 5,
          "name": "Photography",
          "slug": "photography"
        },
        "city": {
          "id": 10,
          "name": "Delhi",
          "slug": "delhi",
          "cityTier": "tier_1"
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

### 2. Get Single Portfolio

**GET** `/api/vendor/portfolios/:portfolioId`

Get detailed information about a specific portfolio.

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID

**Response:**
```json
{
  "success": true,
  "message": "Portfolio retrieved successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "title": "Premium Wedding Photography Package",
      "slug": "premium-wedding-photography-package-abc123",
      "description": "Complete wedding coverage with candid shots",
      "priceRangeMin": 50000,
      "priceRangeMax": 150000,
      "priceOnRequest": false,
      "priceBreakdown": {
        "items": [
          { "name": "Full Day Coverage", "price": 50000, "unit": "per day" },
          { "name": "Pre-Wedding Shoot", "price": 30000, "unit": "per session" }
        ],
        "pricingModel": ["fixed_fee", "per_day"]
      },
      "advancePercentage": 30,
      "financialTerms": {
        "paymentTerms": "30% advance, 70% on delivery",
        "travelCostTerms": "Free within 50km, ₹10/km beyond",
        "deliveryTimeline": "4-6 weeks",
        "cancellationTerms": "No refund within 30 days"
      },
      "servicesOfferedTags": ["wedding_day", "pre_wedding", "candid", "traditional", "drone"],
      "servicesDescription": "Complete photography services for your special day",
      "coverageCities": ["Delhi", "Noida", "Gurgaon", "Faridabad"],
      "acceptsDestinationWedding": true,
      "destinationWeddingFeeDifferent": true,
      "cancellationPolicyUser": "flexible",
      "cancellationPolicyVendor": "moderate",
      "workingStyle": "Candid and traditional mix",
      "longDescription": "Detailed description of services...",
      "decorPolicy": "client_provides",
      "acceptsAdvanceBooking": true,
      "minAdvanceBookingDays": 30,
      "weddingsCompleted": 150,
      "happyClientsCount": 145,
      "cityTier": "tier_1",
      "isFreePlanPortfolio": false,
      "status": "published",
      "isFeatured": true,
      "coverImage": "https://example.com/uploads/portfolio/1/cover.jpg",
      "viewCount": 1250,
      "contactCount": 45,
      "totalFavorites": 89,
      "averageRating": 4.75,
      "totalReviews": 32,
      "publishedAt": "2024-01-15T10:30:00.000Z",
      "businessProfile": {
        "id": 1,
        "businessName": "Dream Weddings Photography"
      },
      "category": {
        "id": 5,
        "name": "Photography",
        "slug": "photography"
      },
      "city": {
        "id": 10,
        "name": "Delhi",
        "slug": "delhi",
        "cityTier": "tier_1"
      }
    }
  }
}
```

---

### 3. Create Portfolio

**POST** `/api/vendor/portfolios`

Create a new portfolio (status: draft by default).

**Request Body:**
```json
{
  "businessProfileId": 1,
  "categoryId": 5,
  "categorySlug": "photography",
  "userSubscriptionId": 10,
  "title": "Premium Wedding Photography Package",
  "description": "Complete wedding coverage with candid shots",
  "priceRangeMin": 50000,
  "priceRangeMax": 150000,
  "priceOnRequest": false,
  "priceBreakdown": {
    "items": [
      { "name": "Full Day Coverage", "price": 50000, "unit": "per day" }
    ],
    "pricingModel": ["fixed_fee"]
  },
  "advancePercentage": 30,
  "financialTerms": {
    "paymentTerms": "30% advance, 70% on delivery",
    "travelCostTerms": "Free within 50km",
    "deliveryTimeline": "4-6 weeks",
    "cancellationTerms": "No refund within 30 days"
  },
  "servicesOfferedTags": ["wedding_day", "pre_wedding", "candid"],
  "servicesDescription": "Complete photography services",
  "coverageCities": ["Delhi", "Noida", "Gurgaon"],
  "acceptsDestinationWedding": true,
  "destinationWeddingFeeDifferent": true,
  "cancellationPolicyUser": "flexible",
  "cancellationPolicyVendor": "moderate",
  "workingStyle": "Candid and traditional mix",
  "longDescription": "Detailed description...",
  "decorPolicy": "client_provides",
  "acceptsAdvanceBooking": true,
  "minAdvanceBookingDays": 30,
  "weddingsCompleted": 150,
  "happyClientsCount": 145,
  "stateId": 5,
  "cityId": 10,
  "stateSlug": "delhi",
  "citySlug": "delhi",
  "address": "Connaught Place, New Delhi",
  "serviceDetails": {
    "customField1": "value1"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio created successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "title": "Premium Wedding Photography Package",
      "slug": "premium-wedding-photography-package-abc123",
      "cityTier": "tier_1",
      "isFreePlanPortfolio": false,
      "status": "draft",
      "createdAt": "2024-01-10T08:00:00.000Z"
    }
  }
}
```

**Important Notes:**
- `cityTier` is automatically populated from the cities table based on `cityId`
- `isFreePlanPortfolio` is automatically determined from the subscription plan (true if `finalPrice === 0`)
- These fields are read-only and cannot be manually set

**Subscription Validation:**
The system validates the following before creating a portfolio:
1. **Active Subscription Required**: `userSubscriptionId` must reference an active subscription
2. **Category Match**: Portfolio category must match subscription plan category
3. **City Tier Match**: Portfolio city tier must match subscription plan city tier
4. **Portfolio Quota**: Subscription must not have reached its published portfolio limit (typically 1 portfolio per subscription)

**Validation Error Responses:**

No Active Subscription:
```json
{
  "success": false,
  "message": "No active subscription found for this category and city tier"
}
```

Category Mismatch:
```json
{
  "success": false,
  "message": "Portfolio category does not match subscription plan category"
}
```

City Tier Mismatch:
```json
{
  "success": false,
  "message": "Portfolio city tier does not match subscription plan city tier"
}
```

Portfolio Quota Exceeded:
```json
{
  "success": false,
  "message": "Subscription portfolio limit reached. This subscription already has 1 published portfolio."
}
```

---

### 4. Update Portfolio

**PUT** `/api/vendor/portfolios/:portfolioId`

Update portfolio details (only draft/rejected portfolios can be edited).

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "priceRangeMin": 60000,
  "priceRangeMax": 180000,
  "servicesOfferedTags": ["wedding_day", "pre_wedding", "candid", "drone"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio updated successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "title": "Updated Title",
      "updatedAt": "2024-01-12T10:00:00.000Z"
    }
  }
}
```

**Error Response (Published Portfolio):**
```json
{
  "success": false,
  "message": "Cannot edit published portfolio. Please create a new version or contact admin."
}
```

**Subscription Validation (When Changing Key Fields):**

When updating `userSubscriptionId`, `categoryId`, or `cityId`, the system validates:

1. **Changing Subscription ID**: New subscription must not have reached its portfolio limit (excluding current portfolio)
2. **Changing Category**: Current subscription must support the new category
3. **Changing City**: Current subscription must support the new city tier

**Important**: During update validation, the current portfolio is excluded from the published portfolio count. This allows you to update the same portfolio without hitting quota limits.

**Validation Error Responses:**

Subscription Change - Quota Exceeded:
```json
{
  "success": false,
  "message": "New subscription portfolio limit reached. This subscription already has 1 published portfolio."
}
```

Category Change - Mismatch:
```json
{
  "success": false,
  "message": "Portfolio category does not match subscription plan category"
}
```

City Tier Change - Mismatch:
```json
{
  "success": false,
  "message": "Portfolio city tier does not match subscription plan city tier"
}
```

---

### 5. Delete Portfolio

**DELETE** `/api/vendor/portfolios/:portfolioId`

Soft delete a portfolio.

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID

**Response:**
```json
{
  "success": true,
  "message": "Portfolio deleted successfully"
}
```

---

### 6. Update Portfolio Status

**PATCH** `/api/vendor/portfolios/:portfolioId/status`

Submit portfolio for approval (draft → pending only).

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID

**Request Body:**
```json
{
  "status": "pending"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio status updated successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "status": "pending",
      "updatedAt": "2024-01-12T10:00:00.000Z"
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Vendors can only submit portfolios for approval (status: pending)"
}
```

---

### 7. Update Featured Status

**PATCH** `/api/vendor/portfolios/:portfolioId/featured`

Toggle featured status (requires active subscription with featured quota).

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID

**Request Body:**
```json
{
  "isFeatured": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio marked as featured successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "isFeatured": true,
      "updatedAt": "2024-01-12T10:00:00.000Z"
    }
  }
}
```

**Error Response (Quota Exceeded):**
```json
{
  "success": false,
  "message": "Featured portfolio limit reached (3/3). Please upgrade your plan or unfeature an existing portfolio."
}
```

**Error Response (Not Published):**
```json
{
  "success": false,
  "message": "Only published portfolios can be featured"
}
```

---

### 8. Republish Portfolio

**POST** `/api/vendor/portfolios/:portfolioId/republish`

Republish portfolio to update lastRepublishedAt timestamp (boosts visibility).

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID

**Response:**
```json
{
  "success": true,
  "message": "Portfolio republished successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "republishCount": 5,
      "lastRepublishedAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Only published portfolios can be republished"
}
```

---

### 9. Upload Portfolio Media

**POST** `/api/vendor/portfolios/:portfolioId/media/upload`

Upload photos/videos for portfolio.

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID

**Request:** `multipart/form-data`
- `files` (array, required) - Multiple files (max 15)
- `mediaType` (string, required) - `image` or `video`
- `subEntityType` (string, optional) - `album` (if uploading to album)
- `subEntityId` (number, optional) - Album ID (if uploading to album)

**Response:**
```json
{
  "success": true,
  "message": "Portfolio media uploaded successfully",
  "data": {
    "uploaded": [
      {
        "id": 1,
        "entityType": "portfolio",
        "entityId": 123,
        "subEntityType": null,
        "subEntityId": null,
        "mediaType": "image",
        "mediaUrl": "https://example.com/uploads/portfolio/123/photo.jpg",
        "thumbnailUrl": "https://example.com/uploads/portfolio/123/thumb_photo.jpg",
        "storageType": "cloudinary",
        "fileName": "photo_1234567890.jpg",
        "fileSizeBytes": 2048000,
        "width": 1920,
        "height": 1080,
        "displayOrder": 0,
        "isPrimary": false,
        "createdAt": "2024-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 10. Get Portfolio Media

**GET** `/api/vendor/portfolios/:portfolioId/media`

Get media list for portfolio with optional filtering.

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID

**Query Parameters:**
- `subEntityType` (string, optional) - Filter by sub-entity type: `album`
- `subEntityId` (number, optional) - Filter by sub-entity ID
- `mediaType` (string, optional) - Filter by media type: `image`, `video`

**Response:**
```json
{
  "success": true,
  "message": "Portfolio media retrieved successfully",
  "data": {
    "media": [
      {
        "id": 1,
        "mediaType": "image",
        "mediaUrl": "https://example.com/uploads/portfolio/123/photo.jpg",
        "thumbnailUrl": "https://example.com/uploads/portfolio/123/thumb_photo.jpg",
        "displayOrder": 0,
        "isPrimary": true,
        "width": 1920,
        "height": 1080,
        "fileSizeBytes": 2048000
      }
    ]
  }
}
```

---

### 11. Update Media Metadata

**PUT** `/api/vendor/portfolios/:portfolioId/media/:mediaId`

Update media metadata (display order, album assignment).

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID
- `mediaId` (number, required) - Media ID

**Request Body:**
```json
{
  "displayOrder": 5,
  "subEntityType": "album",
  "subEntityId": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio media updated successfully",
  "data": {
    "media": {
      "id": 1,
      "displayOrder": 5,
      "subEntityType": "album",
      "subEntityId": 10
    }
  }
}
```

---

### 12. Delete Media

**DELETE** `/api/vendor/portfolios/:portfolioId/media/:mediaId`

Delete a single media file.

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID
- `mediaId` (number, required) - Media ID

**Response:**
```json
{
  "success": true,
  "message": "Portfolio media deleted successfully"
}
```

---

### 13. Set Primary Media

**PATCH** `/api/vendor/portfolios/:portfolioId/media/:mediaId/primary`

Set a media file as primary (cover image).

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID
- `mediaId` (number, required) - Media ID

**Response:**
```json
{
  "success": true,
  "message": "Primary media set successfully",
  "data": {
    "media": {
      "id": 1,
      "isPrimary": true
    }
  }
}
```

---

### 14. Reorder Media (Bulk)

**POST** `/api/vendor/portfolios/:portfolioId/media/reorder`

Bulk reorder media files.

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID

**Request Body:**
```json
{
  "mediaIds": [5, 2, 8, 1, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio media reordered successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Portfolio title is required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Portfolio not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to create portfolio"
}
```

---

## Business Rules

### Subscription Validation Rules

**Portfolio Creation:**
- Must have an active subscription (`status: 'active'`)
- Portfolio category must match subscription plan category
- Portfolio city tier must match subscription plan city tier
- Subscription must not have reached its published portfolio limit
- Validation checks if subscription has ANY published portfolios

**Portfolio Update:**
- When changing `userSubscriptionId`: New subscription is validated (current portfolio excluded from count)
- When changing `categoryId`: Current subscription must support new category
- When changing `cityId`: Current subscription must support new city tier
- **Key Difference**: During updates, the current portfolio is excluded from published portfolio count
- This allows updating the same portfolio without hitting quota limits

**Example Scenarios:**
```
Subscription X allows 1 portfolio
Portfolio A uses Subscription X (published)

✓ Update Portfolio A with Subscription X → SUCCESS (current portfolio excluded)
✗ Update Portfolio A with Subscription Y (already used) → FAIL
✗ Update Portfolio A category (mismatch) → FAIL
✗ Update Portfolio A city tier (mismatch) → FAIL
```

### Portfolio Status Workflow
- **draft** → **pending** (vendor submits for approval)
- **pending** → **published** (admin approves)
- **pending** → **rejected** (admin rejects)
- **rejected** → **pending** (vendor resubmits after fixes)

Vendors can only transition from `draft` to `pending`.

### Featured Portfolio Quota
- Requires active subscription with `maxFeaturedPortfolios > 0`
- Only published portfolios can be featured
- Quota check performed before marking as featured
- Vendor must unfeature existing portfolio or upgrade plan if quota exceeded

### Republish Rules
- Only published portfolios can be republished
- Updates `lastRepublishedAt` timestamp
- Increments `republishCount`
- Adds entry to `republishHistory` JSONB array

### Media Upload Rules
- Max 15 files per upload
- Max file size: 10MB per file
- Supported types: images (jpg, png, webp) and videos (mp4, mov)
- Storage type determined by `STORAGE_TYPE` env variable
- Automatic thumbnail generation for images

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- File paths stored as relative paths in database
- Full URLs returned via model getters
- Soft delete used for portfolios and media
- Audit fields (createdBy, updatedBy, deletedBy) automatically populated via hooks
