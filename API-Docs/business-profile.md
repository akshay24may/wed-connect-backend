# Business Profile API Documentation

## Overview

Business Profile endpoints allow vendors to manage their business information. Each user can have multiple business profiles.

**Base URL**: `/api/profile/business`

**Authentication**: All endpoints require authentication (JWT token)

---

## Endpoints

### 1. Get All Business Profiles

Get all business profiles for the authenticated user.

**Endpoint**: `GET /api/profile/business`

**Authentication**: Required

**Request Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Business profiles retrieved successfully",
  "data": {
    "businesses": [
      {
        "id": 1,
        "businessName": "Dream Wedding Photography",
        "businessTagline": "Capturing your special moments",
        "businessLogo": "http://localhost:5000/uploads/business/user-123/logo.jpg",
        "businessBanner": "http://localhost:5000/uploads/business/user-123/banner.jpg",
        "businessMediaStorageType": "local",
        "businessEmail": "contact@dreamwedding.com",
        "businessPhone": "9876543210",
        "contactPersonName": "John Doe",
        "businessType": "proprietorship",
        "establishmentYear": 2015,
        "teamSize": 5,
        "yearsOfExperience": 8,
        "websiteUrl": "https://dreamwedding.com",
        "facebookUrl": "https://facebook.com/dreamwedding",
        "instagramUrl": "https://instagram.com/dreamwedding",
        "youtubeUrl": null,
        "linkedinUrl": null,
        "createdAt": "2026-05-26T10:30:00.000Z",
        "updatedAt": "2026-05-26T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 2. Get Single Business Profile

Get a specific business profile by ID.

**Endpoint**: `GET /api/profile/business/:businessId`

**Authentication**: Required

**URL Parameters**:
- `businessId` (required) - Business profile ID

**Request Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Business profile retrieved successfully",
  "data": {
    "business": {
      "id": 1,
      "userId": 123,
      "businessName": "Dream Wedding Photography",
      "businessTagline": "Capturing your special moments",
      "businessLogo": "http://localhost:5000/uploads/business/user-123/logo.jpg",
      "businessBanner": "http://localhost:5000/uploads/business/user-123/banner.jpg",
      "businessMediaStorageType": "local",
      "businessEmail": "contact@dreamwedding.com",
      "businessPhone": "9876543210",
      "contactPersonName": "John Doe",
      "businessPan": "ABCDE1234F",
      "gstin": "27ABCDE1234F1Z5",
      "businessRegistrationNumber": "REG123456",
      "businessType": "proprietorship",
      "establishmentYear": 2015,
      "nameOnId": "John Doe",
      "aadharNumber": null,
      "panNumber": "ABCDE1234F",
      "alternateMobileOne": "9876543211",
      "alternateMobileTwo": null,
      "whatsappMobile": "9876543210",
      "teamDescription": "Professional team of 5 photographers",
      "teamSize": 5,
      "yearsOfExperience": 8,
      "businessHours": {
        "monday": { "open": "09:00", "close": "18:00" },
        "tuesday": { "open": "09:00", "close": "18:00" },
        "wednesday": { "open": "09:00", "close": "18:00" },
        "thursday": { "open": "09:00", "close": "18:00" },
        "friday": { "open": "09:00", "close": "18:00" },
        "saturday": { "open": "10:00", "close": "16:00" },
        "sunday": { "closed": true }
      },
      "certifications": [
        {
          "name": "Professional Photography Certification",
          "issuer": "Photography Institute",
          "year": 2016
        }
      ],
      "awards": [
        {
          "name": "Best Wedding Photographer 2023",
          "issuer": "Wedding Awards India",
          "year": 2023
        }
      ],
      "celebrityWeddingsHandled": "Handled 3 celebrity weddings",
      "websiteUrl": "https://dreamwedding.com",
      "facebookUrl": "https://facebook.com/dreamwedding",
      "instagramUrl": "https://instagram.com/dreamwedding",
      "youtubeUrl": null,
      "linkedinUrl": null,
      "createdAt": "2026-05-26T10:30:00.000Z",
      "updatedAt": "2026-05-26T10:30:00.000Z"
    }
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "message": "Business profile not found"
}
```

---

### 3. Create Business Profile

Create a new business profile.

**Endpoint**: `POST /api/profile/business`

**Authentication**: Required

**Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "businessName": "Dream Wedding Photography",
  "businessTagline": "Capturing your special moments",
  "businessEmail": "contact@dreamwedding.com",
  "businessPhone": "9876543210",
  "contactPersonName": "John Doe",
  "businessPan": "ABCDE1234F",
  "gstin": "27ABCDE1234F1Z5",
  "businessRegistrationNumber": "REG123456",
  "businessType": "proprietorship",
  "establishmentYear": 2015,
  "nameOnId": "John Doe",
  "panNumber": "ABCDE1234F",
  "alternateMobileOne": "9876543211",
  "whatsappMobile": "9876543210",
  "teamDescription": "Professional team of 5 photographers",
  "teamSize": 5,
  "yearsOfExperience": 8,
  "businessHours": {
    "monday": { "open": "09:00", "close": "18:00" },
    "tuesday": { "open": "09:00", "close": "18:00" },
    "wednesday": { "open": "09:00", "close": "18:00" },
    "thursday": { "open": "09:00", "close": "18:00" },
    "friday": { "open": "09:00", "close": "18:00" },
    "saturday": { "open": "10:00", "close": "16:00" },
    "sunday": { "closed": true }
  },
  "certifications": [
    {
      "name": "Professional Photography Certification",
      "issuer": "Photography Institute",
      "year": 2016
    }
  ],
  "awards": [
    {
      "name": "Best Wedding Photographer 2023",
      "issuer": "Wedding Awards India",
      "year": 2023
    }
  ],
  "celebrityWeddingsHandled": "Handled 3 celebrity weddings",
  "websiteUrl": "https://dreamwedding.com",
  "facebookUrl": "https://facebook.com/dreamwedding",
  "instagramUrl": "https://instagram.com/dreamwedding"
}
```

**Required Fields**:
- `businessName` (min 3 characters)

**Optional Fields**:
- All other fields are optional

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Business profile created successfully",
  "data": {
    "business": {
      "id": 1,
      "userId": 123,
      "businessName": "Dream Wedding Photography",
      "businessTagline": "Capturing your special moments",
      "businessEmail": "contact@dreamwedding.com",
      "businessPhone": "9876543210",
      "contactPersonName": "John Doe",
      "businessType": "proprietorship",
      "establishmentYear": 2015,
      "teamSize": 5,
      "yearsOfExperience": 8,
      "websiteUrl": "https://dreamwedding.com",
      "createdAt": "2026-05-26T10:30:00.000Z",
      "updatedAt": "2026-05-26T10:30:00.000Z"
    }
  }
}
```

**Error Responses**:

400 Bad Request - Missing business name:
```json
{
  "success": false,
  "message": "Business name is required"
}
```

400 Bad Request - Business name too short:
```json
{
  "success": false,
  "message": "Business name must be at least 3 characters"
}
```

---

### 4. Update Business Profile

Update an existing business profile.

**Endpoint**: `PUT /api/profile/business/:businessId`

**Authentication**: Required

**URL Parameters**:
- `businessId` (required) - Business profile ID

**Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "businessName": "Dream Wedding Photography Studio",
  "businessTagline": "Creating timeless memories",
  "businessEmail": "info@dreamwedding.com",
  "businessPhone": "9876543210",
  "teamSize": 8,
  "yearsOfExperience": 10
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Business profile updated successfully",
  "data": {
    "business": {
      "id": 1,
      "userId": 123,
      "businessName": "Dream Wedding Photography Studio",
      "businessTagline": "Creating timeless memories",
      "businessEmail": "info@dreamwedding.com",
      "businessPhone": "9876543210",
      "teamSize": 8,
      "yearsOfExperience": 10,
      "updatedAt": "2026-05-26T11:00:00.000Z"
    }
  }
}
```

**Error Responses**:

404 Not Found:
```json
{
  "success": false,
  "message": "Business profile not found"
}
```

400 Bad Request - Business name too short:
```json
{
  "success": false,
  "message": "Business name must be at least 3 characters"
}
```

---

### 5. Delete Business Profile

Soft delete a business profile (paranoid delete).

**Endpoint**: `DELETE /api/profile/business/:businessId`

**Authentication**: Required

**URL Parameters**:
- `businessId` (required) - Business profile ID

**Request Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Business profile deleted successfully",
  "data": null
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "message": "Business profile not found"
}
```

---

### 6. Upload Business Media

Upload logo and/or banner for a business profile.

**Endpoint**: `POST /api/profile/business/:businessId/media`

**Authentication**: Required

**URL Parameters**:
- `businessId` (required) - Business profile ID

**Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body** (multipart/form-data):
- `logo` (file, optional) - Business logo image (max 5MB, images only)
- `banner` (file, optional) - Business banner image (max 5MB, images only)

**Supported Formats**: JPG, JPEG, PNG, WebP

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Business media uploaded successfully",
  "data": {
    "uploadedFiles": [
      {
        "type": "logo",
        "url": "uploads/business/user-123/logo-1234567890.jpg"
      },
      {
        "type": "banner",
        "url": "uploads/business/user-123/banner-1234567890.jpg"
      }
    ]
  }
}
```

**Error Responses**:

400 Bad Request - No files:
```json
{
  "success": false,
  "message": "No files uploaded"
}
```

404 Not Found:
```json
{
  "success": false,
  "message": "Business profile not found"
}
```

---

## Business Type Enum

Valid values for `businessType`:
- `proprietorship`
- `partnership`
- `pvt_ltd`
- `llp`
- `other`

---

## Notes

1. **Ownership**: Users can only access their own business profiles
2. **Multiple Profiles**: A user can have multiple business profiles
3. **Soft Delete**: Deleted profiles are soft-deleted (paranoid) and can be restored
4. **Media Storage**: Files are stored based on `STORAGE_TYPE` env variable (local/cloudinary)
5. **URL Transformation**: File paths are automatically converted to full URLs via model getters
6. **Audit Fields**: All operations track `created_by`, `updated_by`, `deleted_by`

---

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Internal Server Error
