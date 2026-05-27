# WedConnect API Documentation

Complete API documentation for the WedConnect wedding services marketplace backend.

---

## Overview

WedConnect is a wedding services marketplace platform connecting consumers (couples/families) with wedding service vendors through location-based portfolios, subscription-driven vendor onboarding, and controlled content publishing.

**Base URL:** `http://localhost:5000/api` (development)

---

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

**Token obtained from:**
- POST /api/auth/login
- POST /api/auth/signup
- POST /api/auth/otp/verify

---

## Available Documentation

### 1. Authentication
**File:** `authentication.md`

Endpoints for user authentication, registration, and session management.

**Endpoints:**
- Login (email/password, mobile/OTP)
- Signup (vendor, consumer)
- Password reset
- Token refresh
- Google OAuth

---

### 2. User Profile
**File:** `profile.md`

Endpoints for managing user profile information.

**Endpoints:**
- Get profile
- Update profile
- Upload profile photo
- Change password

---

### 3. Business Profile
**File:** `business-profile.md`

Endpoints for managing vendor business profiles.

**Endpoints (6):**
- List business profiles
- Get single business profile
- Create business profile
- Update business profile
- Delete business profile
- Upload business media (logo/banner)

**Auth Required:** Vendor

---

### 4. Vendor Portfolios
**File:** `vendor-portfolio.md`

Endpoints for vendors to manage their portfolios.

**Endpoints (14):**
- List portfolios (with filters)
- Get single portfolio
- Create portfolio
- Update portfolio
- Delete portfolio
- Update status (submit for approval)
- Toggle featured status
- Republish portfolio
- Upload portfolio media
- Get portfolio media
- Update media metadata
- Delete media
- Set primary media
- Reorder media

**Auth Required:** Vendor

---

### 5. Panel Portfolios
**File:** `panel-portfolio.md`

Endpoints for admin/staff to manage all portfolios.

**Endpoints (5):**
- List all portfolios (admin view)
- Get single portfolio
- Update status (approve/reject/publish)
- Update visibility (featured/boosted/recommended)
- Delete portfolio

**Auth Required:** Admin/Staff

---

### 6. Public Portfolios
**File:** `public-portfolio.md`

Endpoints for public browsing of published portfolios.

**Endpoints (6):**
- Browse portfolios (with filters)
- Get portfolio by slug
- Get portfolio by share code
- Get portfolio media
- Get portfolio albums
- Get album by slug

**Auth Required:** None (public)

---

### 7. Portfolio Albums
**File:** `portfolio-album.md`

Endpoints for managing portfolio albums.

**Endpoints (7):**
- List albums for portfolio
- Get single album
- Create album
- Update album
- Delete album
- Reorder album
- Upload album media

**Auth Required:** Vendor

---

### 8. Portfolio Reviews
**File:** `portfolio-review.md`

Endpoints for consumer reviews and vendor responses.

**Endpoints (15):**
- Consumer: List reviews, create, update, delete, upload media (5)
- Vendor: List reviews, add response, update response (3)
- Panel: List all, approve, reject, toggle featured, delete (5)
- Public: List reviews, mark helpful (2)

**Auth Required:** Mixed (consumer, vendor, admin, public)

---

## API Endpoint Summary

### By Module

| Module | Endpoints | Status | Auth Required |
|--------|-----------|--------|---------------|
| Authentication | 8 | ✅ Complete | Mixed |
| User Profile | 5 | ✅ Complete | User |
| Business Profile | 6 | ✅ Complete | Vendor |
| Vendor Portfolios | 14 | ✅ Complete | Vendor |
| Panel Portfolios | 5 | ✅ Complete | Admin/Staff |
| Public Portfolios | 6 | ✅ Complete | None |
| Portfolio Albums | 7 | ✅ Complete | Vendor |
| Portfolio Reviews | 15 | ✅ Complete | Mixed |

**Total Implemented: 66 endpoints**
**Total Planned: 66 endpoints**
**Completion: 100%** 🎉

---

## By User Role

### Public (No Auth)
- Browse portfolios
- View portfolio details
- Get portfolio by share code

### Consumer
- Manage profile
- Create/manage reviews
- Upload review media
- Mark reviews as helpful

### Vendor
- Manage business profiles
- Manage portfolios
- Manage albums
- Upload media
- View and respond to reviews

### Admin/Staff
- View all portfolios
- Approve/reject portfolios
- Manage visibility flags
- Moderate and manage reviews

---

## Common Patterns

### Response Format

All API responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

**Paginated Response:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

---

### Pagination

List endpoints support pagination:

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)

**Example:**
```http
GET /api/vendor/portfolios?page=1&limit=20
```

---

### Filtering

Many endpoints support filtering:

**Common Filters:**
- `status` - Filter by status (draft, pending, published, rejected)
- `category` - Filter by category slug
- `city` - Filter by city slug
- `priceMin` / `priceMax` - Price range filter

**Example:**
```http
GET /api/public/portfolios?category=photography&city=delhi&priceMin=10000&priceMax=50000
```

---

### File Upload

File upload endpoints use `multipart/form-data`:

**Common Fields:**
- `files` (array) - Multiple files
- `mediaType` (string) - `image` or `video`

**Upload Limits:**
- Max files per upload: 15
- Max file size: 10MB per file
- Supported image types: jpg, jpeg, png, webp
- Supported video types: mp4, mov

**Example:**
```http
POST /api/vendor/portfolios/:portfolioId/media/upload
Content-Type: multipart/form-data

files: [file1.jpg, file2.jpg]
mediaType: image
```

---

### Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Environment Variables

### Required
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/wedconnect
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d
```

### Storage
```env
STORAGE_TYPE=local
UPLOAD_URL=http://localhost:5000
```

### Optional (Cloudinary)
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Rate Limiting

**Recommended rate limits:**
- Authentication endpoints: 5 requests per minute
- Public endpoints: 100 requests per minute
- Authenticated endpoints: 200 requests per minute
- File upload endpoints: 20 requests per minute

---

## Versioning

**Current Version:** v1

All endpoints are prefixed with `/api` (no version number yet).

**Future versioning:**
- v2 endpoints will be prefixed with `/api/v2`
- v1 endpoints will remain at `/api` for backward compatibility

---

## Testing

### Postman Collection

Import the Postman collection for easy API testing:
- Collection file: `WedConnect.postman_collection.json`
- Environment file: `WedConnect.postman_environment.json`

### Test Credentials

**Vendor Account:**
```
Email: vendor@example.com
Password: Test@123
```

**Consumer Account:**
```
Email: consumer@example.com
Password: Test@123
```

**Admin Account:**
```
Email: admin@example.com
Password: Admin@123
```

---

## Support

For API support or questions:
- Email: api-support@wedconnect.com
- Documentation: https://docs.wedconnect.com
- GitHub Issues: https://github.com/wedconnect/backend/issues

---

## Changelog

### Version 1.0.0 (Current)
- ✅ Authentication system
- ✅ User profile management
- ✅ Business profile management
- ✅ Portfolio CRUD (vendor)
- ✅ Portfolio approval workflow (admin)
- ✅ Public portfolio browsing
- ✅ Portfolio albums
- ✅ Media upload system
- ✅ Portfolio reviews and ratings
- ✅ Vendor review responses
- ✅ Review moderation (admin)
- ✅ Public review display

### Upcoming (Version 1.1.0)
- 🚧 Chat system
- 🚧 Enquiry management
- 🚧 Offers and promotions
- 🚧 Notifications
- 🚧 Favorites

---

## Quick Start

### 1. Get Authentication Token
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "vendor@example.com",
  "password": "Test@123"
}
```

### 2. Create Business Profile
```http
POST /api/profile/business
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessName": "Dream Weddings Photography",
  "businessEmail": "contact@dreamweddings.com",
  "businessPhone": "9876543210"
}
```

### 3. Create Portfolio
```http
POST /api/vendor/portfolios
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessProfileId": 1,
  "categoryId": 5,
  "title": "Premium Wedding Photography",
  "description": "Complete wedding coverage",
  "priceRangeMin": 50000,
  "cityId": 10
}
```

### 4. Upload Portfolio Media
```http
POST /api/vendor/portfolios/1/media/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: [photo1.jpg, photo2.jpg]
mediaType: image
```

### 5. Submit for Approval
```http
PATCH /api/vendor/portfolios/1/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "pending"
}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All IDs are auto-incrementing integers (BIGINT or INT)
- File paths stored as relative, full URLs returned via getters
- Soft delete used throughout (paranoid: true)
- Audit fields (createdBy, updatedBy, deletedBy) automatically populated

---

## License

Copyright © 2024 WedConnect. All rights reserved.
