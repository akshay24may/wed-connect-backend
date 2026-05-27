# Portfolio Review API Documentation

Complete API reference for portfolio review management across consumer, vendor, panel, and public endpoints.

---

## Table of Contents

1. [Consumer Review Endpoints](#consumer-review-endpoints)
2. [Vendor Review Endpoints](#vendor-review-endpoints)
3. [Panel Review Endpoints](#panel-review-endpoints)
4. [Public Review Endpoints](#public-review-endpoints)
5. [Error Codes](#error-codes)

---

## Consumer Review Endpoints

### 1. Get Consumer's Own Reviews

**Endpoint:** `GET /api/consumer/reviews`

**Auth:** Required (consumer)

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "id": 1,
        "portfolioId": 123,
        "userId": 456,
        "vendorId": 789,
        "rating": 5,
        "reviewTitle": "Excellent Service!",
        "reviewText": "Amazing photography, highly recommended",
        "reviewMedia": [
          {
            "url": "https://example.com/uploads/review/1/photo.jpg",
            "type": "image"
          }
        ],
        "recommendedFor": ["presentation", "professionalism", "value_for_money"],
        "vendorResponse": "Thank you for your feedback!",
        "vendorRespondedAt": "2024-03-20T10:30:00Z",
        "helpfulCount": 15,
        "notHelpfulCount": 2,
        "isVerifiedPurchase": false,
        "isApproved": true,
        "isFeatured": false,
        "createdAt": "2024-03-15T08:00:00Z",
        "portfolio": {
          "id": 123,
          "title": "Premium Wedding Photography",
          "slug": "premium-wedding-photography-abc123",
          "coverImage": "https://example.com/uploads/portfolio/123/cover.jpg"
        },
        "vendor": {
          "id": 789,
          "fullName": "John Doe",
          "email": "john@example.com",
          "profile": {
            "profilePhoto": "https://example.com/uploads/users/789/photo.jpg"
          }
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

---

### 2. Create Review

**Endpoint:** `POST /api/consumer/portfolios/:portfolioId/reviews`

**Auth:** Required (consumer)

**Body:**
```json
{
  "rating": 5,
  "reviewTitle": "Excellent Service!",
  "reviewText": "Amazing photography, highly recommended",
  "recommendedFor": ["presentation", "professionalism", "value_for_money"],
  "isVerifiedPurchase": false
}
```

**Validation:**
- `rating` (required) - Integer between 1 and 5
- `reviewTitle` (optional) - String, max 200 characters
- `reviewText` (optional) - Text
- `recommendedFor` (optional) - Array of strings
- `isVerifiedPurchase` (optional) - Boolean (default: false)

**Business Rules:**
- User can only review a portfolio once
- Portfolio must be published
- Review is auto-approved by default

**Response:**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "review": {
      "id": 1,
      "portfolioId": 123,
      "userId": 456,
      "vendorId": 789,
      "rating": 5,
      "reviewTitle": "Excellent Service!",
      "reviewText": "Amazing photography, highly recommended",
      "recommendedFor": ["presentation", "professionalism", "value_for_money"],
      "isVerifiedPurchase": false,
      "isApproved": true,
      "createdAt": "2024-03-15T08:00:00Z"
    }
  }
}
```

---

### 3. Update Review

**Endpoint:** `PUT /api/consumer/reviews/:reviewId`

**Auth:** Required (consumer - own review)

**Body:**
```json
{
  "rating": 4,
  "reviewTitle": "Updated Title",
  "reviewText": "Updated review text",
  "recommendedFor": ["presentation", "professionalism"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "review": { /* updated review object */ }
  }
}
```

---

### 4. Delete Review

**Endpoint:** `DELETE /api/consumer/reviews/:reviewId`

**Auth:** Required (consumer - own review)

**Response:**
```json
{
  "success": true,
  "message": "Review deleted successfully",
  "data": null
}
```

---

### 5. Upload Review Media

**Endpoint:** `POST /api/consumer/reviews/:reviewId/media/upload`

**Auth:** Required (consumer - own review)

**Content-Type:** `multipart/form-data`

**Body:**
- `files` (array) - Multiple files (max 5)
- `mediaType` (string) - "image" or "video"

**File Limits:**
- Max file size: 5MB per file
- Max files: 5
- Allowed types: JPEG, PNG, WebP, MP4, MOV, AVI

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
        "fileSizeBytes": 512000,
        "width": 1920,
        "height": 1080
      }
    ]
  }
}
```

---

## Vendor Review Endpoints

### 1. Get Vendor's Reviews

**Endpoint:** `GET /api/vendor/reviews`

**Auth:** Required (vendor)

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 20)
- `portfolioId` (number, optional) - Filter by portfolio
- `status` (string, optional) - Filter by status: "approved", "rejected"

**Response:**
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "id": 1,
        "portfolioId": 123,
        "userId": 456,
        "vendorId": 789,
        "rating": 5,
        "reviewTitle": "Excellent Service!",
        "reviewText": "Amazing photography",
        "vendorResponse": null,
        "vendorRespondedAt": null,
        "isApproved": true,
        "createdAt": "2024-03-15T08:00:00Z",
        "portfolio": {
          "id": 123,
          "title": "Premium Wedding Photography",
          "slug": "premium-wedding-photography-abc123"
        },
        "user": {
          "id": 456,
          "fullName": "Jane Smith",
          "email": "jane@example.com",
          "profile": {
            "profilePhoto": "https://example.com/uploads/users/456/photo.jpg"
          }
        }
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 20,
      "totalPages": 2
    }
  }
}
```

---

### 2. Add Vendor Response

**Endpoint:** `POST /api/vendor/reviews/:reviewId/respond`

**Auth:** Required (vendor)

**Body:**
```json
{
  "vendorResponse": "Thank you for your feedback! We're glad you enjoyed our service."
}
```

**Validation:**
- `vendorResponse` (required) - Non-empty string
- Vendor can only respond to reviews on their portfolios
- Cannot add response if one already exists

**Response:**
```json
{
  "success": true,
  "message": "Vendor response added successfully",
  "data": {
    "review": {
      "id": 1,
      "vendorResponse": "Thank you for your feedback!",
      "vendorRespondedAt": "2024-03-20T10:30:00Z"
    }
  }
}
```

---

### 3. Update Vendor Response

**Endpoint:** `PUT /api/vendor/reviews/:reviewId/response`

**Auth:** Required (vendor)

**Body:**
```json
{
  "vendorResponse": "Updated response text"
}
```

**Validation:**
- `vendorResponse` (required) - Non-empty string
- Response must already exist

**Response:**
```json
{
  "success": true,
  "message": "Vendor response updated successfully",
  "data": {
    "review": { /* updated review object */ }
  }
}
```

---

## Panel Review Endpoints

### 1. Get All Reviews (Admin View)

**Endpoint:** `GET /api/panel/reviews`

**Auth:** Required (admin/staff)

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 20)
- `status` (string, optional) - Filter by status: "approved", "rejected", "pending"
- `portfolioId` (number, optional) - Filter by portfolio

**Response:**
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "id": 1,
        "portfolioId": 123,
        "userId": 456,
        "vendorId": 789,
        "rating": 5,
        "reviewText": "Amazing service",
        "isApproved": true,
        "isFeatured": false,
        "rejectedBy": null,
        "rejectedAt": null,
        "rejectionReason": null,
        "createdAt": "2024-03-15T08:00:00Z",
        "portfolio": {
          "id": 123,
          "title": "Premium Wedding Photography",
          "slug": "premium-wedding-photography-abc123"
        },
        "user": {
          "id": 456,
          "fullName": "Jane Smith",
          "email": "jane@example.com"
        },
        "vendor": {
          "id": 789,
          "fullName": "John Doe",
          "email": "john@example.com"
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

### 2. Approve Review

**Endpoint:** `POST /api/panel/reviews/:reviewId/approve`

**Auth:** Required (admin)

**Response:**
```json
{
  "success": true,
  "message": "Review approved successfully",
  "data": {
    "review": {
      "id": 1,
      "isApproved": true,
      "rejectedBy": null,
      "rejectedAt": null,
      "rejectionReason": null
    }
  }
}
```

---

### 3. Reject Review

**Endpoint:** `POST /api/panel/reviews/:reviewId/reject`

**Auth:** Required (admin)

**Body:**
```json
{
  "rejectionReason": "Inappropriate content"
}
```

**Validation:**
- `rejectionReason` (required) - Non-empty string

**Response:**
```json
{
  "success": true,
  "message": "Review rejected successfully",
  "data": {
    "review": {
      "id": 1,
      "isApproved": false,
      "rejectedBy": 999,
      "rejectedAt": "2024-03-20T10:30:00Z",
      "rejectionReason": "Inappropriate content"
    }
  }
}
```

---

### 4. Toggle Featured Status

**Endpoint:** `PATCH /api/panel/reviews/:reviewId/featured`

**Auth:** Required (admin/marketing)

**Body:**
```json
{
  "isFeatured": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review marked as featured successfully",
  "data": {
    "review": {
      "id": 1,
      "isFeatured": true
    }
  }
}
```

---

### 5. Delete Review (Admin)

**Endpoint:** `DELETE /api/panel/reviews/:reviewId`

**Auth:** Required (admin)

**Response:**
```json
{
  "success": true,
  "message": "Review deleted successfully",
  "data": null
}
```

---

## Public Review Endpoints

### 1. Get Portfolio Reviews

**Endpoint:** `GET /api/public/portfolios/:portfolioId/reviews`

**Auth:** Not required

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 20)
- `sort` (string, optional) - Sort by: "recent", "rating_high", "rating_low", "helpful" (default: "recent")

**Response:**
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "id": 1,
        "portfolioId": 123,
        "rating": 5,
        "reviewTitle": "Excellent Service!",
        "reviewText": "Amazing photography, highly recommended",
        "reviewMedia": [
          {
            "url": "https://example.com/uploads/review/1/photo.jpg",
            "type": "image"
          }
        ],
        "recommendedFor": ["presentation", "professionalism", "value_for_money"],
        "vendorResponse": "Thank you for your feedback!",
        "vendorRespondedAt": "2024-03-20T10:30:00Z",
        "helpfulCount": 15,
        "notHelpfulCount": 2,
        "isVerifiedPurchase": false,
        "createdAt": "2024-03-15T08:00:00Z",
        "user": {
          "id": 456,
          "fullName": "Jane Smith",
          "profile": {
            "profilePhoto": "https://example.com/uploads/users/456/photo.jpg"
          }
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

---

### 2. Mark Review as Helpful

**Endpoint:** `POST /api/public/reviews/:reviewId/helpful`

**Auth:** Optional (track by IP if not logged in)

**Body:**
```json
{
  "isHelpful": true
}
```

**Validation:**
- `isHelpful` (optional) - Boolean (default: true)
  - `true` - Increment helpful count
  - `false` - Increment not helpful count

**Response:**
```json
{
  "success": true,
  "message": "Review marked as helpful successfully",
  "data": {
    "review": {
      "id": 1,
      "helpfulCount": 16,
      "notHelpfulCount": 2
    }
  }
}
```

---

## Error Codes

### Common Errors

**400 Bad Request**
```json
{
  "success": false,
  "message": "Rating must be between 1 and 5"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Review not found"
}
```

**409 Conflict**
```json
{
  "success": false,
  "message": "You have already reviewed this portfolio"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Failed to create review"
}
```

### Specific Error Messages

- `Review not found`
- `Portfolio not found`
- `Portfolio is not published`
- `You have already reviewed this portfolio`
- `Rating must be between 1 and 5`
- `Vendor response is required`
- `Vendor response already exists`
- `Vendor response not found`
- `Rejection reason is required`
- `Review is already approved`
- `Review is already rejected`
- `No files uploaded`
- `Invalid file type`

---

## Notes

### Review Workflow

1. **Consumer creates review** → Auto-approved by default
2. **Admin can reject** → Review hidden from public
3. **Admin can approve** → Review visible again
4. **Vendor can respond** → Response visible to all
5. **Admin can feature** → Review highlighted

### Business Rules

- One review per user per portfolio
- Portfolio must be published to receive reviews
- Reviews are auto-approved (can be rejected later)
- Vendor can only respond once (can update response)
- Featured reviews appear at top
- Helpful count helps sort reviews

### Media Upload

- Review media stored separately from portfolio media
- Max 5 files per review
- Max 5MB per file
- Supports images and videos
- Automatic thumbnail generation for images

### Permissions

- **Consumer**: Create, update, delete own reviews
- **Vendor**: View reviews, add/update responses
- **Admin**: View all, approve, reject, feature, delete
- **Public**: View approved reviews, mark helpful

---

## Summary

**Total Endpoints: 15**

- **Consumer**: 5 (list, create, update, delete, upload media)
- **Vendor**: 3 (list, add response, update response)
- **Panel**: 5 (list, approve, reject, toggle featured, delete)
- **Public**: 2 (list, mark helpful)

All review endpoints are fully implemented and production-ready.
