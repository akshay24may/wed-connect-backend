# Public Portfolio API Documentation

Complete API reference for public portfolio browsing endpoints (no authentication required).

---

## Base URL

All endpoints are prefixed with: `/api/public/portfolios`

---

## Authentication

**No authentication required** - All endpoints are publicly accessible.

---

## Endpoints

### 1. Browse Published Portfolios

**GET** `/api/public/portfolios`

Browse all published portfolios with advanced filtering and pagination.

**Query Parameters:**
- `category` (string, optional) - Filter by category slug (e.g., `photography`, `catering`)
- `city` (string, optional) - Filter by city slug (e.g., `delhi`, `mumbai`)
- `priceMin` (number, optional) - Minimum price filter
- `priceMax` (number, optional) - Maximum price filter
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 20, max: 100)

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
        "coverImage": "https://example.com/uploads/portfolio/1/cover.jpg",
        "isFeatured": true,
        "isBoosted": false,
        "isRecommended": true,
        "viewCount": 1250,
        "totalFavorites": 89,
        "averageRating": 4.75,
        "totalReviews": 32,
        "weddingsCompleted": 150,
        "publishedAt": "2024-01-15T10:30:00.000Z",
        "createdAt": "2024-01-10T08:00:00.000Z",
        "businessProfile": {
          "id": 1,
          "businessName": "Dream Weddings Photography",
          "businessTagline": "Capturing your special moments"
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

**Example Requests:**

```http
# Browse all portfolios
GET /api/public/portfolios

# Filter by category
GET /api/public/portfolios?category=photography

# Filter by city
GET /api/public/portfolios?city=delhi

# Filter by price range
GET /api/public/portfolios?priceMin=10000&priceMax=50000

# Combined filters with pagination
GET /api/public/portfolios?category=photography&city=delhi&priceMin=20000&priceMax=100000&page=1&limit=20
```

**Sorting Logic:**
Portfolios are automatically sorted by:
1. Featured portfolios first (`isFeatured: true`)
2. Then boosted portfolios (`isBoosted: true`)
3. Then recommended portfolios (`isRecommended: true`)
4. Finally by published date (most recent first)

---

### 2. Get Portfolio by Slug

**GET** `/api/public/portfolios/:slug`

Get detailed information about a specific portfolio using its SEO-friendly slug.

**URL Parameters:**
- `slug` (string, required) - Portfolio slug (e.g., `premium-wedding-photography-package-abc123`)

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
      "shareCode": "ABC123XYZ",
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
      "isBoosted": false,
      "isRecommended": true,
      "coverImage": "https://example.com/uploads/portfolio/1/cover.jpg",
      "viewCount": 1251,
      "totalFavorites": 89,
      "averageRating": 4.75,
      "totalReviews": 32,
      "publishedAt": "2024-01-15T10:30:00.000Z",
      "user": {
        "id": 123,
        "fullName": "John Doe"
      },
      "businessProfile": {
        "id": 1,
        "businessName": "Dream Weddings Photography",
        "businessTagline": "Capturing your special moments",
        "businessEmail": "contact@dreamweddings.com",
        "businessPhone": "9876543210",
        "businessLogo": "https://example.com/uploads/business/1/logo.jpg",
        "websiteUrl": "https://dreamweddings.com",
        "facebookUrl": "https://facebook.com/dreamweddings",
        "instagramUrl": "https://instagram.com/dreamweddings",
        "youtubeUrl": "https://youtube.com/dreamweddings"
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
      }
    }
  }
}
```

**Example Request:**
```http
GET /api/public/portfolios/premium-wedding-photography-package-abc123
```

**Important Notes:**
- View count is automatically incremented when portfolio is viewed
- Only published portfolios are accessible
- Returns 404 if portfolio not found or not published

---

### 3. Get Portfolio by Share Code

**GET** `/api/public/portfolios/share/:shareCode`

Get portfolio using a private share code (for sharing unpublished or draft portfolios).

**URL Parameters:**
- `shareCode` (string, required) - Unique share code (e.g., `ABC123XYZ`)

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
      "shareCode": "ABC123XYZ",
      "description": "Complete wedding coverage with candid shots",
      "priceRangeMin": 50000,
      "priceRangeMax": 150000,
      "priceOnRequest": false,
      "status": "draft",
      "coverImage": "https://example.com/uploads/portfolio/1/cover.jpg",
      "viewCount": 15,
      "totalFavorites": 0,
      "averageRating": 0,
      "totalReviews": 0,
      "weddingsCompleted": 150,
      "user": {
        "id": 123,
        "fullName": "John Doe"
      },
      "businessProfile": {
        "id": 1,
        "businessName": "Dream Weddings Photography",
        "businessTagline": "Capturing your special moments",
        "businessEmail": "contact@dreamweddings.com",
        "businessPhone": "9876543210",
        "businessLogo": "https://example.com/uploads/business/1/logo.jpg"
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

**Example Request:**
```http
GET /api/public/portfolios/share/ABC123XYZ
```

**Important Notes:**
- Works for portfolios in any status (draft, pending, published, rejected)
- Useful for sharing portfolio preview before publishing
- Share code is unique and randomly generated
- Does NOT increment view count (private sharing)

---

## Error Responses

### 404 Not Found
```json
{
  "success": false,
  "message": "Portfolio not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Portfolio slug is required"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to retrieve portfolios"
}
```

---

## Filtering & Search

### Category Filter
Filter portfolios by category slug:
```http
GET /api/public/portfolios?category=photography
```

**Available Categories:**
- `photography` - Wedding Photography
- `videography` - Wedding Videography
- `venues` - Wedding Venues
- `catering` - Catering Services
- `makeup` - Makeup Artists
- `mehndi` - Mehndi Artists
- `decoration` - Decoration Services
- `dj` - DJ & Music
- `planning` - Wedding Planners
- `transport` - Wedding Cars & Transport
- `gifts` - Gifts & Invitations

### City Filter
Filter portfolios by city slug:
```http
GET /api/public/portfolios?city=delhi
```

### Price Range Filter
Filter portfolios by price range:
```http
# Minimum price only
GET /api/public/portfolios?priceMin=10000

# Maximum price only
GET /api/public/portfolios?priceMax=50000

# Both min and max
GET /api/public/portfolios?priceMin=10000&priceMax=50000
```

**Price Filter Logic:**
- Filters based on `priceRangeMin` field
- `priceMin` parameter: Returns portfolios where `priceRangeMin >= priceMin`
- `priceMax` parameter: Returns portfolios where `priceRangeMin <= priceMax`

### Combined Filters
Combine multiple filters:
```http
GET /api/public/portfolios?category=photography&city=delhi&priceMin=20000&priceMax=100000&page=1&limit=20
```

---

## Pagination

All list endpoints support pagination:

**Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20, max: 100)

**Response includes pagination metadata:**
```json
{
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

**Example:**
```http
# First page (20 items)
GET /api/public/portfolios?page=1&limit=20

# Second page (20 items)
GET /api/public/portfolios?page=2&limit=20

# Custom page size (50 items)
GET /api/public/portfolios?page=1&limit=50
```

---

## Sorting

Portfolios are automatically sorted by priority:

1. **Featured** (`isFeatured: true`) - Highest priority
2. **Boosted** (`isBoosted: true`) - Second priority
3. **Recommended** (`isRecommended: true`) - Third priority
4. **Published Date** (`publishedAt`) - Most recent first

This ensures premium portfolios appear at the top of search results.

---

## View Tracking

**Automatic View Count Increment:**
- View count is incremented when portfolio is accessed via slug
- View count is NOT incremented when accessed via share code
- Each view increments the counter by 1
- No duplicate view prevention (each request counts)

**Use Cases:**
- Track portfolio popularity
- Analytics for vendors
- Ranking algorithm input

---

## Use Cases

### 1. Homepage Portfolio Listing
```http
GET /api/public/portfolios?limit=12
```
Display 12 featured portfolios on homepage.

### 2. Category Page
```http
GET /api/public/portfolios?category=photography&page=1&limit=20
```
Show all photography portfolios with pagination.

### 3. City-Specific Search
```http
GET /api/public/portfolios?city=delhi&category=venues&page=1&limit=20
```
Find wedding venues in Delhi.

### 4. Budget-Based Search
```http
GET /api/public/portfolios?category=photography&priceMin=20000&priceMax=50000
```
Find photographers within budget.

### 5. Portfolio Detail Page
```http
GET /api/public/portfolios/premium-wedding-photography-package-abc123
```
Display full portfolio details.

### 6. Private Portfolio Preview
```http
GET /api/public/portfolios/share/ABC123XYZ
```
Share draft portfolio with client for feedback.

---

## SEO Considerations

### Slug Structure
- Slugs are SEO-friendly (lowercase, hyphenated)
- Include portfolio title + unique suffix
- Example: `premium-wedding-photography-package-abc123`

### URL Structure
```
https://wedconnect.com/portfolios/premium-wedding-photography-package-abc123
```

### Meta Tags (Recommended)
Use portfolio data for meta tags:
- **Title**: `{portfolio.title} - {businessProfile.businessName}`
- **Description**: `{portfolio.description}`
- **Image**: `{portfolio.coverImage}`
- **Keywords**: `{category.name}, {city.name}, wedding services`

---

## Rate Limiting

**Recommended rate limits:**
- Browse endpoint: 100 requests per minute per IP
- Detail endpoint: 200 requests per minute per IP
- Share code endpoint: 50 requests per minute per IP

---

## Caching

**Recommended caching strategy:**
- Browse results: Cache for 5 minutes
- Portfolio details: Cache for 10 minutes
- Share code access: No caching (private)

**Cache invalidation:**
- Invalidate when portfolio is updated
- Invalidate when portfolio status changes
- Invalidate when visibility flags change

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- File URLs are full URLs (not relative paths)
- Only published portfolios visible in browse/slug endpoints
- Share code works for any status (including draft)
- View count tracking for analytics
- No authentication required for any endpoint

---

### 4. Get Portfolio Media

**GET** `/api/public/portfolios/:portfolioId/media`

Get all public media (photos/videos) for a published portfolio.

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID

**Query Parameters:**
- `subEntityType` (string, optional) - Filter by sub-entity type (e.g., `album`)
- `subEntityId` (number, optional) - Filter by sub-entity ID (e.g., album ID)
- `mediaType` (string, optional) - Filter by media type (`image` or `video`)
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 50, max: 100)

**Response:**
```json
{
  "success": true,
  "message": "Portfolio media retrieved successfully",
  "data": {
    "media": [
      {
        "id": 1,
        "entityType": "portfolio",
        "entityId": 123,
        "subEntityType": "album",
        "subEntityId": 456,
        "mediaType": "image",
        "mediaUrl": "https://example.com/uploads/portfolio/123/photo.jpg",
        "thumbnailUrl": "https://example.com/uploads/portfolio/123/thumb_photo.jpg",
        "storageType": "cloudinary",
        "fileSizeBytes": 2048000,
        "width": 1920,
        "height": 1080,
        "displayOrder": 0,
        "isPrimary": false,
        "createdAt": "2024-03-15T08:00:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 50,
      "totalPages": 1
    }
  }
}
```

**Example Requests:**
```http
# Get all media for portfolio
GET /api/public/portfolios/123/media

# Get only images
GET /api/public/portfolios/123/media?mediaType=image

# Get media for specific album
GET /api/public/portfolios/123/media?subEntityType=album&subEntityId=456

# With pagination
GET /api/public/portfolios/123/media?page=1&limit=20
```

**Sorting Logic:**
Media is automatically sorted by:
1. Primary media first (`isPrimary: true`)
2. Then by display order (`displayOrder` ASC)
3. Finally by creation date (`createdAt` ASC)

---

### 5. Get Portfolio Albums

**GET** `/api/public/portfolios/:portfolioId/albums`

Get all public albums for a published portfolio.

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "message": "Albums retrieved successfully",
  "data": {
    "albums": [
      {
        "id": 1,
        "portfolioId": 123,
        "albumName": "Pre-Wedding Shoot",
        "albumSlug": "pre-wedding-shoot-abc123",
        "albumDescription": "Beautiful pre-wedding moments",
        "coverPhotoOne": "https://example.com/uploads/portfolio/123/album/1/cover1.jpg",
        "coverPhotoTwo": "https://example.com/uploads/portfolio/123/album/1/cover2.jpg",
        "coverPhotoThree": "https://example.com/uploads/portfolio/123/album/1/cover3.jpg",
        "cityId": 10,
        "citySlug": "delhi",
        "locationName": "India Gate, New Delhi",
        "latitude": 28.6129,
        "longitude": 77.2295,
        "displayOrder": 1,
        "isFeatured": true,
        "mediaCount": 15,
        "createdAt": "2024-03-15T08:00:00Z",
        "city": {
          "id": 10,
          "name": "Delhi",
          "slug": "delhi",
          "cityTier": "tier_1"
        }
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

**Example Requests:**
```http
# Get all albums for portfolio
GET /api/public/portfolios/123/albums

# With pagination
GET /api/public/portfolios/123/albums?page=1&limit=10
```

**Sorting Logic:**
Albums are automatically sorted by:
1. Featured albums first (`isFeatured: true`)
2. Then by display order (`displayOrder` ASC)
3. Finally by creation date (`createdAt` DESC)

**Important Notes:**
- Only public albums are returned (`isPublic: true`)
- Portfolio must be published
- Returns empty array if no public albums exist

---

### 6. Get Album by Slug

**GET** `/api/public/portfolios/:portfolioId/albums/:albumSlug`

Get detailed information about a specific album using its slug.

**URL Parameters:**
- `portfolioId` (number, required) - Portfolio ID
- `albumSlug` (string, required) - Album slug (e.g., `pre-wedding-shoot-abc123`)

**Response:**
```json
{
  "success": true,
  "message": "Album retrieved successfully",
  "data": {
    "album": {
      "id": 1,
      "portfolioId": 123,
      "albumName": "Pre-Wedding Shoot",
      "albumSlug": "pre-wedding-shoot-abc123",
      "albumDescription": "Beautiful pre-wedding moments captured at iconic Delhi locations",
      "coverPhotoOne": "https://example.com/uploads/portfolio/123/album/1/cover1.jpg",
      "coverPhotoTwo": "https://example.com/uploads/portfolio/123/album/1/cover2.jpg",
      "coverPhotoThree": "https://example.com/uploads/portfolio/123/album/1/cover3.jpg",
      "cityId": 10,
      "citySlug": "delhi",
      "locationName": "India Gate, New Delhi",
      "latitude": 28.6129,
      "longitude": 77.2295,
      "displayOrder": 1,
      "isFeatured": true,
      "mediaCount": 15,
      "portfolio": {
        "id": 123,
        "title": "Premium Wedding Photography",
        "slug": "premium-wedding-photography-abc123"
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

**Example Request:**
```http
GET /api/public/portfolios/123/albums/pre-wedding-shoot-abc123
```

**Important Notes:**
- Album must be public (`isPublic: true`)
- Portfolio must be published
- Returns 404 if album not found or not public
- Use this endpoint to display album detail page

---

## Summary

**Total Endpoints: 6**

1. GET /api/public/portfolios - Browse with filters
2. GET /api/public/portfolios/:slug - Get by slug
3. GET /api/public/portfolios/share/:shareCode - Get by share code
4. GET /api/public/portfolios/:portfolioId/media - Get portfolio media
5. GET /api/public/portfolios/:portfolioId/albums - Get portfolio albums
6. GET /api/public/portfolios/:portfolioId/albums/:albumSlug - Get album by slug

All endpoints are publicly accessible and optimized for SEO and performance.
