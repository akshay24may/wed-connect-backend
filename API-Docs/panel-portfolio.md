# Panel Portfolio API Documentation

Complete API reference for admin/staff portfolio management endpoints.

---

## Base URL

All endpoints are prefixed with: `/api/panel/portfolios`

---

## Authentication

All endpoints require authentication with admin/staff role. Include JWT token in Authorization header:

```
Authorization: Bearer <token>
```

**Required Roles:**
- `super_admin` - Full access to all operations
- `admin` - Approve/reject portfolios, manage visibility
- `marketing` - Update visibility flags (featured, boosted, recommended)
- `seo` - View portfolios, update SEO-related fields

---

## Endpoints

### 1. Get All Portfolios (Admin View)

**GET** `/api/panel/portfolios`

Get all portfolios across all vendors with filtering and pagination.

**Query Parameters:**
- `status` (string, optional) - Filter by status: `draft`, `pending`, `published`, `rejected`
- `category` (string, optional) - Filter by category slug (e.g., `photography`)
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
        "userId": 123,
        "title": "Premium Wedding Photography Package",
        "slug": "premium-wedding-photography-package-abc123",
        "shareCode": "ABC123XYZ",
        "description": "Complete wedding coverage with candid shots",
        "priceRangeMin": 50000,
        "priceRangeMax": 150000,
        "priceOnRequest": false,
        "cityTier": "tier_1",
        "isFreePlanPortfolio": false,
        "status": "pending",
        "isFeatured": false,
        "isBoosted": false,
        "isRecommended": false,
        "coverImage": "https://example.com/uploads/portfolio/1/cover.jpg",
        "viewCount": 1250,
        "contactCount": 45,
        "totalFavorites": 89,
        "averageRating": 4.75,
        "totalReviews": 32,
        "publishedAt": null,
        "approvedAt": null,
        "rejectedAt": null,
        "rejectionReason": null,
        "createdAt": "2024-01-10T08:00:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "user": {
          "id": 123,
          "fullName": "John Doe",
          "email": "john@example.com",
          "mobile": "9876543210"
        },
        "businessProfile": {
          "id": 1,
          "businessName": "Dream Weddings Photography",
          "businessEmail": "contact@dreamweddings.com",
          "businessPhone": "9876543210"
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

### 2. Get Single Portfolio (Admin View)

**GET** `/api/panel/portfolios/:portfolioId`

Get detailed information about a specific portfolio (any vendor).

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
      "userId": 123,
      "title": "Premium Wedding Photography Package",
      "slug": "premium-wedding-photography-package-abc123",
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
      "cityTier": "tier_1",
      "isFreePlanPortfolio": false,
      "status": "pending",
      "isFeatured": false,
      "featuredUntil": null,
      "isBoosted": false,
      "boostedUntil": null,
      "isRecommended": false,
      "recommendedAt": null,
      "coverImage": "https://example.com/uploads/portfolio/1/cover.jpg",
      "viewCount": 1250,
      "contactCount": 45,
      "totalFavorites": 89,
      "averageRating": 4.75,
      "totalReviews": 32,
      "publishedAt": null,
      "approvedAt": null,
      "approvedBy": null,
      "rejectedAt": null,
      "rejectedBy": null,
      "rejectionReason": null,
      "republishCount": 0,
      "lastRepublishedAt": null,
      "internalNotes": null,
      "user": {
        "id": 123,
        "fullName": "John Doe",
        "email": "john@example.com",
        "mobile": "9876543210"
      },
      "businessProfile": {
        "id": 1,
        "businessName": "Dream Weddings Photography",
        "businessEmail": "contact@dreamweddings.com",
        "businessPhone": "9876543210"
      },
      "category": {
        "id": 5,
        "name": "Photography",
        "slug": "photography"
      },
      "state": {
        "id": 5,
        "name": "Delhi",
        "slug": "delhi"
      },
      "city": {
        "id": 10,
        "name": "Delhi",
        "slug": "delhi",
        "cityTier": "tier_1"
      },
      "userSubscription": {
        "id": 10,
        "planName": "Premium Plan",
        "status": "active",
        "endsAt": "2025-01-10T00:00:00.000Z",
        "finalPrice": "2999.00",
        "cityTier": "tier_1"
      }
    }
  }
}
```

---

### 3. Update Portfolio Status

**PATCH** `/api/panel/portfolios/:portfolioId/status`

Approve, reject, or change portfolio status (admin only).

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID

**Request Body:**
```json
{
  "status": "published",
  "rejectionReason": "Optional reason if rejected",
  "notes": "Optional admin notes"
}
```

**Valid Status Values:**
- `pending` - Reset to pending (remove approval/rejection)
- `published` - Approve and publish portfolio
- `rejected` - Reject portfolio with reason

**Response (Approved):**
```json
{
  "success": true,
  "message": "Portfolio status updated successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "status": "published",
      "publishedAt": "2024-01-15T10:30:00.000Z",
      "approvedAt": "2024-01-15T10:30:00.000Z",
      "approvedBy": 456,
      "rejectedAt": null,
      "rejectedBy": null,
      "rejectionReason": null,
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Response (Rejected):**
```json
{
  "success": true,
  "message": "Portfolio status updated successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "status": "rejected",
      "rejectedAt": "2024-01-15T10:30:00.000Z",
      "rejectedBy": 456,
      "rejectionReason": "Images quality is not up to standard. Please upload high-resolution photos.",
      "publishedAt": null,
      "approvedAt": null,
      "approvedBy": null,
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (Missing Rejection Reason):**
```json
{
  "success": false,
  "message": "Rejection reason is required when rejecting portfolio"
}
```

---

### 4. Update Portfolio Visibility

**PATCH** `/api/panel/portfolios/:portfolioId/visibility`

Update visibility flags (featured, boosted, recommended) - admin/marketing role.

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID

**Request Body:** (all fields optional)
```json
{
  "isFeatured": true,
  "featuredUntil": "2024-12-31T23:59:59.000Z",
  "isBoosted": false,
  "boostedUntil": null,
  "isRecommended": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio visibility updated successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "isFeatured": true,
      "featuredUntil": "2024-12-31T23:59:59.000Z",
      "isBoosted": false,
      "boostedUntil": null,
      "isRecommended": true,
      "recommendedAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Notes:**
- `isFeatured` - Mark portfolio as featured (appears at top in search)
- `featuredUntil` - Optional expiry date for featured status
- `isBoosted` - Mark portfolio as boosted (higher visibility)
- `boostedUntil` - Optional expiry date for boosted status
- `isRecommended` - Mark portfolio as recommended by admin
- `recommendedAt` - Automatically set when `isRecommended` is true

---

### 5. Delete Portfolio (Admin)

**DELETE** `/api/panel/portfolios/:portfolioId`

Soft delete a portfolio (admin only).

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID

**Response:**
```json
{
  "success": true,
  "message": "Portfolio deleted successfully"
}
```

**Notes:**
- This is a soft delete (paranoid: true)
- Portfolio is marked as deleted but not removed from database
- Can be restored by admin if needed

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Status is required"
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
  "message": "Failed to update portfolio status"
}
```

---

## Business Rules

### Status Workflow (Admin)

**Admin can transition between any statuses:**
- `pending` → `published` (approve)
- `pending` → `rejected` (reject with reason)
- `rejected` → `pending` (reset for resubmission)
- `published` → `pending` (unpublish)

**Status Effects:**
- **published**: Sets `publishedAt`, `approvedAt`, `approvedBy`, clears rejection fields
- **rejected**: Sets `rejectedAt`, `rejectedBy`, `rejectionReason`, clears approval fields
- **pending**: Clears all approval and rejection fields

### Visibility Flags

**Featured:**
- Admin can override vendor's featured quota
- Can set expiry date with `featuredUntil`
- Featured portfolios appear at top in search results

**Boosted:**
- Admin-controlled visibility boost
- Can set expiry date with `boostedUntil`
- Boosted portfolios get higher ranking in search

**Recommended:**
- Admin recommendation badge
- Sets `recommendedAt` timestamp automatically
- Recommended portfolios shown in special sections

### Internal Notes

- Admin can add internal notes when updating status
- Notes stored in `internalNotes` field
- Not visible to vendors or public
- Used for internal communication between admin/staff

---

## Filtering & Search

### Status Filter
```
GET /api/panel/portfolios?status=pending
```
Returns only portfolios with specified status.

### Category Filter
```
GET /api/panel/portfolios?category=photography
```
Returns only portfolios in specified category (by slug).

### Combined Filters
```
GET /api/panel/portfolios?status=pending&category=photography&page=1&limit=20
```
Returns pending photography portfolios with pagination.

---

## Audit Trail

All admin operations are tracked:
- `approvedBy` - Admin user ID who approved
- `approvedAt` - Approval timestamp
- `rejectedBy` - Admin user ID who rejected
- `rejectedAt` - Rejection timestamp
- `updatedBy` - Last admin user ID who updated (via hooks)

---

## Role-Based Access

### super_admin
- Full access to all operations
- Can approve, reject, delete portfolios
- Can update visibility flags
- Can view all portfolios

### admin
- Can approve, reject portfolios
- Can update visibility flags
- Can view all portfolios
- Cannot delete portfolios (super_admin only)

### marketing
- Can update visibility flags only
- Can view all portfolios
- Cannot approve/reject portfolios

### seo
- Can view all portfolios
- Read-only access
- Cannot modify portfolios

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Soft delete used (portfolios can be restored)
- Audit fields automatically populated via hooks
- Admin operations bypass vendor ownership checks
- Rejection reason required when rejecting
- Internal notes not visible to vendors

---

## Common Use Cases

### 1. Approve Pending Portfolio
```http
PATCH /api/panel/portfolios/123/status
Content-Type: application/json

{
  "status": "published",
  "notes": "Approved - good quality content"
}
```

### 2. Reject Portfolio with Reason
```http
PATCH /api/panel/portfolios/123/status
Content-Type: application/json

{
  "status": "rejected",
  "rejectionReason": "Images quality is not up to standard. Please upload high-resolution photos.",
  "notes": "Vendor contacted via email"
}
```

### 3. Feature Portfolio for 30 Days
```http
PATCH /api/panel/portfolios/123/visibility
Content-Type: application/json

{
  "isFeatured": true,
  "featuredUntil": "2024-02-15T23:59:59.000Z"
}
```

### 4. Mark as Recommended
```http
PATCH /api/panel/portfolios/123/visibility
Content-Type: application/json

{
  "isRecommended": true
}
```

### 5. Get All Pending Portfolios
```http
GET /api/panel/portfolios?status=pending&page=1&limit=20
```

---

## Summary

**Total Endpoints: 5**

1. GET /api/panel/portfolios - List all portfolios (admin view)
2. GET /api/panel/portfolios/:portfolioId - Get single portfolio
3. PATCH /api/panel/portfolios/:portfolioId/status - Approve/reject
4. PATCH /api/panel/portfolios/:portfolioId/visibility - Update visibility
5. DELETE /api/panel/portfolios/:portfolioId - Admin delete

All endpoints require authentication with appropriate admin/staff role.
