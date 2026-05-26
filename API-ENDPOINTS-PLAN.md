# API Endpoints Plan - Business Profile & Portfolio Module

## Business Profile Endpoints

### Common Routes (All Users)

#### GET /api/profile/business
**Purpose:** Get list of current user's business profiles
**Auth:** Required (vendor)
**Response:**
```json
{
  "success": true,
  "message": "Business profiles retrieved successfully",
  "data": {
    "businesses": [
      {
        "id": 1,
        "businessName": "Dream Weddings Photography",
        "businessTagline": "Capturing your special moments",
        "businessLogo": "https://example.com/uploads/business/1/logo.jpg",
        "businessType": "proprietorship",
        "establishmentYear": 2015
      }
    ]
  }
}
```

#### GET /api/profile/business/:businessId
**Purpose:** Get single business profile details
**Auth:** Required (vendor - own business)

#### POST /api/profile/business
**Purpose:** Create business profile
**Auth:** Required (vendor)
**Body:** JSON (no media)
```json
{
  "businessName": "Dream Weddings Photography",
  "businessTagline": "Capturing your special moments",
  "businessEmail": "contact@dreamweddings.com",
  "businessPhone": "9876543210",
  "businessType": "proprietorship",
  "establishmentYear": 2015
}
```

#### PUT /api/profile/business/:businessId
**Purpose:** Update business profile
**Auth:** Required (vendor - own business)
**Body:** JSON (no media)

#### DELETE /api/profile/business/:businessId
**Purpose:** Soft delete business profile
**Auth:** Required (vendor - own business)

#### POST /api/profile/business/:businessId/media/upload
**Purpose:** Upload business logo/banner
**Auth:** Required (vendor - own business)
**Body:** multipart/form-data
- `files` (array) - Multiple files (logo, banner)
- `mediaType` (string) - image only
**Note:** storage_type determined by env config (STORAGE_TYPE)

**Response:**
```json
{
  "success": true,
  "message": "Business media uploaded successfully",
  "data": {
    "uploaded": [
      {
        "id": 1,
        "entityType": "business_profile",
        "entityId": 123,
        "mediaType": "image",
        "mediaUrl": "https://example.com/uploads/business/123/logo.jpg",
        "storageType": "cloudinary",
        "fileSizeBytes": 204800,
        "width": 800,
        "height": 600
      }
    ]
  }
}
```

---

## Portfolio Endpoints

### Vendor Routes (Own Portfolios)

#### GET /api/vendor/portfolios
**Purpose:** Get vendor's own portfolios (all statuses)
**Auth:** Required (vendor)
**Query:** ?status=draft&page=1&limit=20

#### GET /api/vendor/portfolios/:portfolioId
**Purpose:** Get single portfolio details
**Auth:** Required (vendor - own portfolio)

#### POST /api/vendor/portfolios
**Purpose:** Create new portfolio
**Auth:** Required (vendor)
**Body:** JSON (no media)
```json
{
  "businessProfileId": 1,
  "categoryId": 5,
  "title": "Premium Wedding Photography Package",
  "description": "Complete wedding coverage with candid shots",
  "priceRangeMin": 50000,
  "priceRangeMax": 150000,
  "priceOnRequest": false,
  "cityId": 10,
  "stateId": 5
}
```

#### PUT /api/vendor/portfolios/:portfolioId
**Purpose:** Update portfolio
**Auth:** Required (vendor - own portfolio)
**Body:** JSON (no media)

#### DELETE /api/vendor/portfolios/:portfolioId
**Purpose:** Soft delete portfolio
**Auth:** Required (vendor - own portfolio)

#### POST /api/vendor/portfolios/:portfolioId/republish
**Purpose:** Republish portfolio (update lastRepublishedAt only)
**Auth:** Required (vendor - own portfolio)

#### PATCH /api/vendor/portfolios/:portfolioId/status
**Purpose:** Update portfolio status
**Auth:** Required (vendor - own portfolio)
**Body:** `{ "status": "pending" }` (draft → pending only)

#### PATCH /api/vendor/portfolios/:portfolioId/featured
**Purpose:** Toggle featured status (within quota)
**Auth:** Required (vendor - own portfolio)
**Body:** `{ "isFeatured": true }`

#### POST /api/vendor/portfolios/:portfolioId/media/upload
**Purpose:** Upload portfolio media (photos/videos)
**Auth:** Required (vendor - own portfolio)
**Body:** multipart/form-data
- `files` (array) - Multiple files
- `mediaType` (string) - image | video
- `subEntityType` (string) - album (optional)
- `subEntityId` (number) - Album ID (optional)
**Note:** storage_type determined by env config (STORAGE_TYPE)

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
        "fileSizeBytes": 2048000,
        "width": 1920,
        "height": 1080,
        "displayOrder": 0,
        "isPrimary": false
      }
    ]
  }
}
```

---

### Panel Routes (Admin/Staff)

#### GET /api/panel/portfolios
**Purpose:** Get all portfolios (admin view)
**Auth:** Required (admin/staff)
**Query:** ?status=pending&category=photography&page=1&limit=20

#### GET /api/panel/portfolios/:portfolioId
**Purpose:** Get portfolio details (admin view)
**Auth:** Required (admin/staff)

#### PATCH /api/panel/portfolios/:portfolioId/status
**Purpose:** Update portfolio status (approve/reject/publish)
**Auth:** Required (admin)
**Body:** 
```json
{
  "status": "published",
  "rejectionReason": "Optional reason if rejected",
  "notes": "Optional admin notes"
}
```

#### PATCH /api/panel/portfolios/:portfolioId/visibility
**Purpose:** Update visibility flags (featured/boosted/recommended)
**Auth:** Required (admin/marketing)
**Body:**
```json
{
  "isFeatured": true,
  "featuredUntil": "2024-12-31",
  "isBoosted": false,
  "isRecommended": true
}
```

#### DELETE /api/panel/portfolios/:portfolioId
**Purpose:** Admin soft delete portfolio
**Auth:** Required (admin)

---

### Public Routes (No Auth)

#### GET /api/public/portfolios
**Purpose:** Browse published portfolios
**Query:** ?category=photography&city=delhi&priceMin=10000&priceMax=50000&page=1&limit=20

#### GET /api/public/portfolios/:slug
**Purpose:** Get portfolio by slug (public view)

#### GET /api/public/portfolios/share/:shareCode
**Purpose:** Get portfolio by share code

---

## Portfolio Album Endpoints

### Vendor Routes

#### GET /api/vendor/portfolios/:portfolioId/albums
**Purpose:** Get albums for portfolio
**Auth:** Required (vendor - own portfolio)

#### GET /api/vendor/portfolios/:portfolioId/albums/:albumId
**Purpose:** Get single album
**Auth:** Required (vendor - own portfolio)

#### POST /api/vendor/portfolios/:portfolioId/albums
**Purpose:** Create album
**Auth:** Required (vendor - own portfolio)
**Body:** JSON (no media)
```json
{
  "albumName": "Pre-Wedding Shoot",
  "albumDescription": "Beautiful pre-wedding moments",
  "cityId": 10,
  "locationName": "India Gate, New Delhi",
  "latitude": 28.6129,
  "longitude": 77.2295,
  "displayOrder": 1
}
```

#### PUT /api/vendor/portfolios/:portfolioId/albums/:albumId
**Purpose:** Update album
**Auth:** Required (vendor - own portfolio)
**Body:** JSON (no media)

#### DELETE /api/vendor/portfolios/:portfolioId/albums/:albumId
**Purpose:** Delete album
**Auth:** Required (vendor - own portfolio)

#### PATCH /api/vendor/portfolios/:portfolioId/albums/:albumId/reorder
**Purpose:** Update display order
**Auth:** Required (vendor - own portfolio)
**Body:** `{ "displayOrder": 2 }`

#### POST /api/vendor/albums/:albumId/media/upload
**Purpose:** Upload album media (photos/videos)
**Auth:** Required (vendor - own album)
**Body:** multipart/form-data
- `files` (array) - Multiple files
- `mediaType` (string) - image | video
**Note:** storage_type determined by env config (STORAGE_TYPE)

**Response:**
```json
{
  "success": true,
  "message": "Album media uploaded successfully",
  "data": {
    "uploaded": [
      {
        "id": 1,
        "entityType": "portfolio",
        "entityId": 123,
        "subEntityType": "album",
        "subEntityId": 456,
        "mediaType": "image",
        "mediaUrl": "https://example.com/uploads/portfolio/123/album/456/photo.jpg",
        "thumbnailUrl": "https://example.com/uploads/portfolio/123/album/456/thumb_photo.jpg",
        "storageType": "cloudinary",
        "fileSizeBytes": 1536000,
        "width": 1920,
        "height": 1080
      }
    ]
  }
}
```

---

### Public Routes

#### GET /api/public/portfolios/:portfolioId/albums
**Purpose:** Get public albums for portfolio

#### GET /api/public/portfolios/:portfolioId/albums/:albumSlug
**Purpose:** Get album by slug

---

## Portfolio Media Endpoints

### Vendor Routes

#### GET /api/vendor/portfolios/:portfolioId/media
**Purpose:** Get media for portfolio
**Auth:** Required (vendor - own portfolio)
**Query:** ?subEntityType=album&subEntityId=123&mediaType=image

#### GET /api/vendor/portfolios/:portfolioId/media/:mediaId
**Purpose:** Get single media
**Auth:** Required (vendor - own portfolio)

#### PUT /api/vendor/portfolios/:portfolioId/media/:mediaId
**Purpose:** Update media metadata
**Auth:** Required (vendor - own portfolio)
**Body:** 
```json
{
  "displayOrder": 1,
  "subEntityType": "album",
  "subEntityId": 123
}
```

#### DELETE /api/vendor/portfolios/:portfolioId/media/:mediaId
**Purpose:** Delete single media
**Auth:** Required (vendor - own portfolio)

#### PATCH /api/vendor/portfolios/:portfolioId/media/:mediaId/primary
**Purpose:** Set as primary media
**Auth:** Required (vendor - own portfolio)

#### POST /api/vendor/portfolios/:portfolioId/media/reorder
**Purpose:** Bulk reorder media
**Auth:** Required (vendor - own portfolio)
**Body:** `{ "mediaIds": [1, 2, 3] }`

---

### Public Routes

#### GET /api/public/portfolios/:portfolioId/media
**Purpose:** Get public media for portfolio
**Query:** ?subEntityType=album&subEntityId=123&mediaType=image

---

## Portfolio Review Endpoints

### Consumer Routes

#### GET /api/consumer/reviews
**Purpose:** Get consumer's own reviews
**Auth:** Required (consumer)

#### POST /api/consumer/portfolios/:portfolioId/reviews
**Purpose:** Create review
**Auth:** Required (consumer)
**Body:** JSON (no media - use media upload endpoint)
```json
{
  "rating": 5,
  "reviewTitle": "Excellent Service!",
  "reviewText": "Amazing photography, highly recommended",
  "recommendedFor": ["presentation", "professionalism", "value_for_money"],
  "isVerifiedPurchase": false
}
```

#### PUT /api/consumer/reviews/:reviewId
**Purpose:** Update own review
**Auth:** Required (consumer - own review)

#### DELETE /api/consumer/reviews/:reviewId
**Purpose:** Delete own review
**Auth:** Required (consumer - own review)

#### POST /api/consumer/reviews/:reviewId/media/upload
**Purpose:** Upload review media (photos/videos)
**Auth:** Required (consumer - own review)
**Body:** multipart/form-data
- `files` (array) - Multiple files
- `mediaType` (string) - image | video
**Note:** storage_type determined by env config (STORAGE_TYPE)

**Response:**
```json
{
  "success": true,
  "message": "Review media uploaded successfully",
  "data": {
    "uploaded": [
      {
        "id": 1,
        "entityType": "review",
        "entityId": 789,
        "mediaType": "image",
        "mediaUrl": "https://example.com/uploads/review/789/photo.jpg",
        "thumbnailUrl": "https://example.com/uploads/review/789/thumb_photo.jpg",
        "storageType": "cloudinary",
        "fileSizeBytes": 512000
      }
    ]
  }
}
```

---

### Vendor Routes

#### GET /api/vendor/reviews
**Purpose:** Get reviews for vendor's portfolios
**Auth:** Required (vendor)
**Query:** ?portfolioId=123&status=approved

#### POST /api/vendor/reviews/:reviewId/respond
**Purpose:** Add vendor response
**Auth:** Required (vendor)
**Body:** `{ "vendorResponse": "Thank you for your feedback!" }`

#### PUT /api/vendor/reviews/:reviewId/response
**Purpose:** Update vendor response
**Auth:** Required (vendor)
**Body:** `{ "vendorResponse": "Updated response" }`

---

### Panel Routes

#### GET /api/panel/reviews
**Purpose:** Get all reviews (admin view)
**Auth:** Required (admin/staff)
**Query:** ?status=pending&portfolioId=123

#### POST /api/panel/reviews/:reviewId/approve
**Purpose:** Approve review
**Auth:** Required (admin)

#### POST /api/panel/reviews/:reviewId/reject
**Purpose:** Reject review
**Auth:** Required (admin)
**Body:** `{ "rejectionReason": "Inappropriate content" }`

#### PATCH /api/panel/reviews/:reviewId/featured
**Purpose:** Toggle featured status
**Auth:** Required (admin/marketing)
**Body:** `{ "isFeatured": true }`

#### DELETE /api/panel/reviews/:reviewId
**Purpose:** Admin delete review
**Auth:** Required (admin)

---

### Public Routes

#### GET /api/public/portfolios/:portfolioId/reviews
**Purpose:** Get approved reviews for portfolio
**Query:** ?page=1&limit=20&sort=recent

#### POST /api/public/reviews/:reviewId/helpful
**Purpose:** Mark review as helpful
**Auth:** Optional (track by IP if not logged in)

---

## Summary

**Total Endpoints: 59**

### By Category:
- **Business Profile:** 6 (list, get, create, update, delete, media upload)
- **Vendor Portfolios:** 9 (list, get, create, update, delete, republish, status, featured, media upload)
- **Panel Portfolios:** 5 (list, get, status, visibility, delete)
- **Public Portfolios:** 3 (list, get by slug, get by share code)
- **Vendor Albums:** 7 (list, get, create, update, delete, reorder, media upload)
- **Public Albums:** 2 (list, get by slug)
- **Vendor Media:** 6 (list, get, update, delete, set primary, bulk reorder)
- **Public Media:** 1 (list)
- **Consumer Reviews:** 5 (list, create, update, delete, media upload)
- **Vendor Reviews:** 3 (list, respond, update response)
- **Panel Reviews:** 6 (list, approve, reject, featured, delete, helpful)
- **Public Reviews:** 2 (list, mark helpful)

### Media Upload Endpoints (4 Entity-Based):
1. `POST /api/profile/business/:businessId/media/upload` - Business logo/banner
2. `POST /api/vendor/portfolios/:portfolioId/media/upload` - Portfolio media
3. `POST /api/vendor/albums/:albumId/media/upload` - Album media
4. `POST /api/consumer/reviews/:reviewId/media/upload` - Review media

---

## Key Design Decisions

### ✅ Implemented Changes:

1. **Entity-based media upload** - Most RESTful approach with 4 separate endpoints
2. **storage_type from env** - Not sent from frontend, determined by STORAGE_TYPE env variable
3. **List business profiles** - GET /api/profile/business returns array of businesses
4. **Single media delete** - DELETE /api/vendor/portfolios/:portfolioId/media/:mediaId
5. **camelCase everywhere** - All fields, parameters, and query params use camelCase
6. **Explicit parameter names** - :portfolioId, :albumId, :mediaId, :reviewId, :businessId (no generic :id)

### ✅ RESTful Design:

1. **Resource hierarchy** - Clear parent-child relationships in URLs
2. **Entity ownership validation** - Implicit in route structure (e.g., /vendor/portfolios/:portfolioId)
3. **Role-based routes** - Separate routes by user role (vendor, panel, consumer, public)
4. **HTTP verbs** - Proper use of GET, POST, PUT, PATCH, DELETE
5. **Consistent patterns** - Similar endpoints follow same structure across entities

### ✅ Security & Authorization:

1. **Entity ownership** - Route structure enforces ownership checks
2. **Role-based access** - Different routes for different roles
3. **Explicit IDs** - All parameters clearly identify the resource
4. **No generic endpoints** - Each endpoint has specific purpose and validation

### ✅ Media Upload Strategy:

1. **Entity-specific endpoints** - Each entity type has its own upload endpoint
2. **Automatic entity linking** - Entity ID in URL automatically links media
3. **Storage abstraction** - Backend determines storage based on env config
4. **Consistent response format** - All upload endpoints return same structure
5. **Metadata included** - Width, height, file size, URLs returned immediately

### ✅ Additional Features:

1. **Soft delete** - All delete endpoints use soft delete (paranoid)
2. **Pagination** - List endpoints support page/limit query params
3. **Filtering** - Query params for status, category, price range, etc.
4. **Sorting** - Sort by recent, rating, etc.
5. **Slug-based access** - Public endpoints use slugs for SEO
6. **Share codes** - Private sharing via unique codes
7. **Republish tracking** - Updates lastRepublishedAt timestamp
8. **Bulk operations** - Reorder multiple media items at once
9. **Primary media** - Set primary/cover image for portfolios
10. **Featured content** - Admin can feature portfolios and reviews
