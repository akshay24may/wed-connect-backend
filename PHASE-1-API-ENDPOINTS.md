# Phase 1 API Endpoints

**Version**: 1.0  
**Base URL**: `/api`  
**Modules**: AUTH, User Subscriptions, Portfolios, Chat

---

## 1. Authentication Module ✅

**Status:** IMPLEMENTED  
**Date:** 2026-05-03

### Public Routes (`/api/auth`)

#### Register
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "mobile": "9175113022",
  "fullName": "John Doe",
  "password": "SecurePass123",
  "roleSlug": "vendor"
}
```

**Response:**
```json
{
  "success": true,
  "code": "CREATED",
  "message": "User registered successfully",
  "data": {
    "user": { "id": 1, "fullName": "John Doe", "mobile": "9175113022" },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "mobile": "9175113022",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Login successful",
  "data": {
    "user": { "id": 1, "fullName": "John Doe", "mobile": "9175113022" },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Google OAuth
**Endpoint:** `GET /api/auth/google`

**Response:** Redirect to Google OAuth consent screen

**Callback Endpoint:** `GET /api/auth/google/callback`

**Response:** Redirect to frontend with tokens in query parameters

#### Refresh Token
**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Logout
**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Logged out successfully"
}
```

#### Request OTP
**Endpoint:** `POST /api/auth/otp/request`

**Request Body:**
```json
{
  "mobile": "9175113022",
  "type": "login",
  "channel": "sms"
}
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "OTP sent successfully",
  "data": {
    "expiresAt": "2026-05-03T10:30:00Z"
  }
}
```

#### Verify OTP
**Endpoint:** `POST /api/auth/otp/verify`

**Request Body:**
```json
{
  "mobile": "9175113022",
  "otp": "123456",
  "type": "login"
}
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "OTP verified successfully",
  "data": {
    "user": { "id": 1, "fullName": "John Doe", "mobile": "9175113022" },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Password Reset
**Endpoint:** `POST /api/auth/password/reset`

**Request Body:**
```json
{
  "mobile": "9175113022",
  "otp": "123456",
  "newPassword": "NewSecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Password reset successfully"
}
```

**Note:** Use `/api/auth/otp/request` with `type: "password_reset"` to get OTP for password reset.

---

## 2. User Profile Module

### Common Routes (`/api/profile`)

#### Get Own Profile
**Endpoint:** `GET /api/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "mobile": "9175113022",
      "email": "john@example.com",
      "profilePhoto": "http://localhost:5000/uploads/profiles/photo.jpg"
    }
  }
}
```

#### Update Profile
**Endpoint:** `PUT /api/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "John Doe Updated",
  "email": "john.updated@example.com",
  "dob": "1990-01-15",
  "gender": "male",
  "about": "Wedding photographer with 10 years experience",
  "address": "123 Main Street",
  "cityId": 10,
  "pincode": "400001"
}
```

**Response:**
```json
{
  "success": true,
  "code": "UPDATED",
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Doe Updated",
      "email": "john.updated@example.com"
    }
  }
}
```

#### Upload Profile Photo
**Endpoint:** `POST /api/profile/photo`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:** FormData with `photo` field (File)

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Profile photo uploaded successfully",
  "data": {
    "profilePhoto": "http://localhost:5000/uploads/profiles/photo-123.jpg"
  }
}
```

#### Upload Avatar Photo
**Endpoint:** `POST /api/profile/avatar`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:** FormData with `avatar` field (File)

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Avatar photo uploaded successfully",
  "data": {
    "avatarPhoto": "http://localhost:5000/uploads/profiles/avatar-123.jpg"
  }
}
```

#### Delete Profile Photo
**Endpoint:** `DELETE /api/profile/photo`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "DELETED",
  "message": "Profile photo deleted successfully"
}
```

#### Change Password
**Endpoint:** `POST /api/profile/password/change`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "code": "UPDATED",
  "message": "Password changed successfully"
}
```

---

## 3. Subscription Plans Module

### Public Routes (`/api/public/subscription-plans`)

#### Get All Active Plans
**Endpoint:** `GET /api/public/subscription-plans`

**Query Parameters:**
```
?categoryId=1&cityTier=tier_1
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Subscription plans retrieved successfully",
  "data": {
    "plans": [
      {
        "id": 1,
        "name": "Basic Plan",
        "categoryId": 1,
        "cityTier": "tier_1",
        "basePrice": 999,
        "maxPublishedPortfolios": 5
      }
    ]
  }
}
```

#### Get Plan Details
**Endpoint:** `GET /api/public/subscription-plans/:id`

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Plan details retrieved successfully",
  "data": {
    "plan": {
      "id": 1,
      "name": "Basic Plan",
      "categoryId": 1,
      "cityTier": "tier_1",
      "basePrice": 999,
      "maxPublishedPortfolios": 5,
      "maxFeaturedPortfolios": 1
    }
  }
}
```

### Vendor Routes (`/api/vendor/subscriptions`)

#### Get My Active Subscription
**Endpoint:** `GET /api/vendor/subscriptions/active`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Active subscription retrieved successfully",
  "data": {
    "subscription": {
      "id": 1,
      "planId": 1,
      "status": "active",
      "startDate": "2026-05-01",
      "endDate": "2027-05-01",
      "quotaUsed": 3,
      "quotaLimit": 5
    }
  }
}
```

#### Get My Subscription History
**Endpoint:** `GET /api/vendor/subscriptions/history`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Subscription history retrieved successfully",
  "data": {
    "subscriptions": [
      {
        "id": 1,
        "planId": 1,
        "status": "active",
        "startDate": "2026-05-01",
        "endDate": "2027-05-01"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 1,
      "totalItems": 1
    }
  }
}
```

#### Purchase Subscription
**Endpoint:** `POST /api/vendor/subscriptions/purchase`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "planId": 1,
  "paymentMethod": "online"
}
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Subscription purchase initiated",
  "data": {
    "subscription": {
      "id": 1,
      "status": "pending_payment"
    },
    "invoice": {
      "id": 1,
      "amount": 999
    },
    "paymentUrl": "https://payment-gateway.com/pay/xyz123"
  }
}
```

#### Verify Manual Payment
**Endpoint:** `POST /api/vendor/subscriptions/:subscriptionId/verify-payment`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:** FormData
```json
{
  "transactionId": "TXN123456",
  "payerName": "John Doe",
  "upiId": "john@upi",
  "paymentProof": "<File>"
}
```

**Response:**
```json
{
  "success": true,
  "code": "CREATED",
  "message": "Payment verification submitted successfully",
  "data": {
    "subscription": {
      "id": 1,
      "status": "pending_verification"
    }
  }
}
```

#### Cancel Subscription
**Endpoint:** `POST /api/vendor/subscriptions/:subscriptionId/cancel`

**Headers:**
```
Authorization: Bearer <token>
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
  "code": "SUCCESS",
  "message": "Subscription cancelled successfully"
}
```

### Panel Routes (`/api/panel/subscription-plans`)

#### Get All Plans (Admin)
**Endpoint:** `GET /api/panel/subscription-plans`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?page=1&limit=10&isActive=true&categoryId=1
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Plans retrieved successfully",
  "data": {
    "plans": [
      {
        "id": 1,
        "name": "Basic Plan",
        "categoryId": 1,
        "cityTier": "tier_1",
        "basePrice": 999,
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 1,
      "totalItems": 1
    }
  }
}
```

#### Create Plan
**Endpoint:** `POST /api/panel/subscription-plans`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Premium Plan",
  "categoryId": 1,
  "cityTier": "tier_1",
  "basePrice": 2999,
  "durationDays": 365,
  "maxPublishedPortfolios": 20,
  "maxFeaturedPortfolios": 5,
  "maxImages": 100,
  "maxVideos": 10
}
```

**Response:**
```json
{
  "success": true,
  "code": "CREATED",
  "message": "Plan created successfully",
  "data": {
    "plan": {
      "id": 2,
      "name": "Premium Plan",
      "categoryId": 1,
      "basePrice": 2999
    }
  }
}
```

#### Update Plan
**Endpoint:** `PUT /api/panel/subscription-plans/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Premium Plan Updated",
  "basePrice": 3499
}
```

**Response:**
```json
{
  "success": true,
  "code": "UPDATED",
  "message": "Plan updated successfully",
  "data": {
    "plan": {
      "id": 2,
      "name": "Premium Plan Updated",
      "basePrice": 3499
    }
  }
}
```

#### Toggle Plan Status
**Endpoint:** `PATCH /api/panel/subscription-plans/status/:id`

**Headers:**
```
Authorization: Bearer <token>
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
  "code": "UPDATED",
  "message": "Plan status updated successfully",
  "data": {
    "plan": {
      "id": 2,
      "isActive": false
    }
  }
}
```

#### Toggle Plan Visibility
**Endpoint:** `PATCH /api/panel/subscription-plans/visibility/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "isPublic": true
}
```

**Response:**
```json
{
  "success": true,
  "code": "UPDATED",
  "message": "Plan visibility updated successfully",
  "data": {
    "plan": {
      "id": 2,
      "isPublic": true
    }
  }
}
```

---

## 4. Portfolios Module

### Public Routes (`/api/public/portfolios`)

#### Browse Portfolios
**Endpoint:** `GET /api/public/portfolios`

**Query Parameters:**
```
?categoryId=1&cityId=10&page=1&limit=20&sortBy=latest
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Portfolios retrieved successfully",
  "data": {
    "portfolios": [
      {
        "id": 1,
        "title": "Wedding Photography Services",
        "slug": "wedding-photography-services-abc123",
        "categoryId": 1,
        "cityId": 10,
        "startingPrice": 25000,
        "isFeatured": true,
        "coverImage": "http://localhost:5000/uploads/portfolios/cover.jpg"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalPages": 5,
      "totalItems": 100
    }
  }
}
```

#### Search Portfolios
**Endpoint:** `GET /api/public/portfolios/search`

**Query Parameters:**
```
?q=photographer&categoryId=1&cityId=10&priceMin=10000&priceMax=50000
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Search results retrieved successfully",
  "data": {
    "portfolios": [
      {
        "id": 1,
        "title": "Wedding Photography Services",
        "slug": "wedding-photography-services-abc123",
        "startingPrice": 25000
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalPages": 2,
      "totalItems": 35
    }
  }
}
```

#### Get Portfolio Details
**Endpoint:** `GET /api/public/portfolios/:slug`

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Portfolio details retrieved successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "title": "Wedding Photography Services",
      "slug": "wedding-photography-services-abc123",
      "description": "Professional wedding photography with 10 years experience",
      "categoryId": 1,
      "cityId": 10,
      "startingPrice": 25000,
      "media": [
        {
          "id": 1,
          "mediaUrl": "http://localhost:5000/uploads/portfolios/photo1.jpg",
          "mediaType": "image"
        }
      ],
      "vendor": {
        "id": 5,
        "fullName": "John Doe",
        "profilePhoto": "http://localhost:5000/uploads/profiles/photo.jpg"
      }
    }
  }
}
```

#### Get Portfolio by Share Code
**Endpoint:** `GET /api/public/portfolios/share/:shareCode`

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Portfolio retrieved successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "title": "Wedding Photography Services",
      "shareCode": "ABC123XYZ"
    }
  }
}
```

### Vendor Routes (`/api/vendor/portfolios`)

#### Get My Portfolios
**Endpoint:** `GET /api/vendor/portfolios`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?status=published&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Portfolios retrieved successfully",
  "data": {
    "portfolios": [
      {
        "id": 1,
        "title": "Wedding Photography Services",
        "status": "published",
        "isFeatured": true,
        "views": 150
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 1,
      "totalItems": 3
    },
    "quotaInfo": {
      "used": 3,
      "limit": 5,
      "remaining": 2
    }
  }
}
```

#### Create Portfolio
**Endpoint:** `POST /api/vendor/portfolios`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Wedding Photography Services",
  "categoryId": 1,
  "description": "Professional wedding photography with 10 years experience",
  "cityId": 10,
  "stateId": 2,
  "startingPrice": 25000,
  "contactEmail": "john@example.com",
  "contactPhone": "9175113022"
}
```

**Response:**
```json
{
  "success": true,
  "code": "CREATED",
  "message": "Portfolio created successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "title": "Wedding Photography Services",
      "slug": "wedding-photography-services-abc123",
      "status": "draft"
    }
  }
}
```

#### Update Portfolio
**Endpoint:** `PUT /api/vendor/portfolios/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Wedding Photography Services Updated",
  "description": "Updated description",
  "startingPrice": 30000
}
```

**Response:**
```json
{
  "success": true,
  "code": "UPDATED",
  "message": "Portfolio updated successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "title": "Wedding Photography Services Updated",
      "status": "draft"
    }
  }
}
```

#### Delete Portfolio
**Endpoint:** `DELETE /api/vendor/portfolios/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "DELETED",
  "message": "Portfolio deleted successfully"
}
```

#### Submit for Approval
**Endpoint:** `POST /api/vendor/portfolios/:id/submit`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "CREATED",
  "message": "Portfolio submitted for approval",
  "data": {
    "portfolio": {
      "id": 1,
      "status": "pending"
    }
  }
}
```

#### Upload Portfolio Media
**Endpoint:** `POST /api/vendor/portfolios/:id/media`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:** FormData with `media` field (File array) and optional `albumId`

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Media uploaded successfully",
  "data": {
    "media": [
      {
        "id": 1,
        "mediaUrl": "http://localhost:5000/uploads/portfolios/photo1.jpg",
        "mediaType": "image",
        "displayOrder": 1
      }
    ]
  }
}
```

#### Delete Portfolio Media
**Endpoint:** `DELETE /api/vendor/portfolios/:portfolioId/media/:mediaId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "DELETED",
  "message": "Media deleted successfully"
}
```

#### Reorder Portfolio Media
**Endpoint:** `PATCH /api/vendor/portfolios/:id/media/reorder`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "mediaOrder": [
    { "id": 1, "displayOrder": 2 },
    { "id": 2, "displayOrder": 1 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Media reordered successfully"
}
```

#### Toggle Featured Status
**Endpoint:** `PATCH /api/vendor/portfolios/:id/featured`

**Headers:**
```
Authorization: Bearer <token>
```

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
  "code": "UPDATED",
  "message": "Featured status updated successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "isFeatured": true
    }
  }
}
```

#### Republish Portfolio
**Endpoint:** `POST /api/vendor/portfolios/:id/republish`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Portfolio republished successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "status": "published"
    }
  }
}
```

#### Get Portfolio Analytics
**Endpoint:** `GET /api/vendor/portfolios/:id/analytics`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Analytics retrieved successfully",
  "data": {
    "views": 150,
    "contacts": 25,
    "favorites": 10,
    "chartData": {
      "viewsByDate": [
        { "date": "2026-05-01", "count": 15 },
        { "date": "2026-05-02", "count": 20 }
      ]
    }
  }
}
```

### Consumer Routes (`/api/consumer/portfolios`)

#### Get Favorite Portfolios
**Endpoint:** `GET /api/consumer/portfolios/favorites`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Favorite portfolios retrieved successfully",
  "data": {
    "portfolios": [
      {
        "id": 1,
        "title": "Wedding Photography Services",
        "slug": "wedding-photography-services-abc123",
        "startingPrice": 25000,
        "coverImage": "http://localhost:5000/uploads/portfolios/cover.jpg"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalPages": 1,
      "totalItems": 5
    }
  }
}
```

#### Add to Favorites
**Endpoint:** `POST /api/consumer/portfolios/:id/favorite`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Portfolio added to favorites"
}
```

#### Remove from Favorites
**Endpoint:** `DELETE /api/consumer/portfolios/:id/favorite`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "DELETED",
  "message": "Portfolio removed from favorites"
}
```

#### Submit Review
**Endpoint:** `POST /api/consumer/portfolios/:id/reviews`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "reviewTitle": "Excellent Service",
  "reviewText": "Amazing photography work, highly recommended!",
  "media": ["http://localhost:5000/uploads/reviews/photo1.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "code": "CREATED",
  "message": "Review submitted successfully",
  "data": {
    "review": {
      "id": 1,
      "rating": 5,
      "reviewTitle": "Excellent Service",
      "reviewText": "Amazing photography work, highly recommended!"
    }
  }
}
```

#### Update Review
**Endpoint:** `PUT /api/consumer/portfolios/:portfolioId/reviews/:reviewId`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 4,
  "reviewTitle": "Great Service",
  "reviewText": "Very good photography work"
}
```

**Response:**
```json
{
  "success": true,
  "code": "UPDATED",
  "message": "Review updated successfully",
  "data": {
    "review": {
      "id": 1,
      "rating": 4,
      "reviewTitle": "Great Service"
    }
  }
}
```

#### Delete Review
**Endpoint:** `DELETE /api/consumer/portfolios/:portfolioId/reviews/:reviewId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "DELETED",
  "message": "Review deleted successfully"
}
```

### Panel Routes (`/api/panel/portfolios`)

#### Get Pending Portfolios
**Endpoint:** `GET /api/panel/portfolios/pending`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Pending portfolios retrieved successfully",
  "data": {
    "portfolios": [
      {
        "id": 1,
        "title": "Wedding Photography Services",
        "status": "pending",
        "submittedAt": "2026-05-03T10:00:00Z",
        "vendor": {
          "id": 5,
          "fullName": "John Doe"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalPages": 1,
      "totalItems": 3
    }
  }
}
```

#### Get All Portfolios
**Endpoint:** `GET /api/panel/portfolios`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?status=published&categoryId=1&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Portfolios retrieved successfully",
  "data": {
    "portfolios": [
      {
        "id": 1,
        "title": "Wedding Photography Services",
        "status": "published",
        "categoryId": 1,
        "vendor": {
          "id": 5,
          "fullName": "John Doe"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalPages": 5,
      "totalItems": 100
    }
  }
}
```

#### Approve Portfolio
**Endpoint:** `POST /api/panel/portfolios/:id/approve`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Portfolio approved successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "status": "published",
      "approvedAt": "2026-05-03T11:00:00Z"
    }
  }
}
```

#### Reject Portfolio
**Endpoint:** `POST /api/panel/portfolios/:id/reject`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rejectionReason": "Images do not meet quality standards"
}
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Portfolio rejected successfully",
  "data": {
    "portfolio": {
      "id": 1,
      "status": "rejected",
      "rejectionReason": "Images do not meet quality standards"
    }
  }
}
```

#### Force Delete Portfolio
**Endpoint:** `DELETE /api/panel/portfolios/:id/force`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "DELETED",
  "message": "Portfolio permanently deleted"
}
```

---

## 5. Chat Module

### Consumer Routes (`/api/consumer/chat`)

#### Get My Chat Rooms
**Endpoint:** `GET /api/consumer/chat/rooms`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Chat rooms retrieved successfully",
  "data": {
    "rooms": [
      {
        "id": 1,
        "portfolioId": 5,
        "portfolio": {
          "title": "Wedding Photography Services",
          "coverImage": "http://localhost:5000/uploads/portfolios/cover.jpg"
        },
        "vendor": {
          "id": 10,
          "fullName": "John Doe",
          "profilePhoto": "http://localhost:5000/uploads/profiles/photo.jpg"
        },
        "lastMessage": {
          "messageText": "Hello, I'm interested in your services",
          "createdAt": "2026-05-03T10:30:00Z"
        },
        "unreadCount": 2
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalPages": 1,
      "totalItems": 5
    }
  }
}
```

#### Create Chat Room (Initiate Chat)
**Endpoint:** `POST /api/consumer/chat/rooms`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "portfolioId": 5
}
```

**Response:**
```json
{
  "success": true,
  "code": "CREATED",
  "message": "Chat room created successfully",
  "data": {
    "room": {
      "id": 1,
      "portfolioId": 5,
      "consumerId": 3,
      "vendorId": 10
    }
  }
}
```

#### Get Chat Messages
**Endpoint:** `GET /api/consumer/chat/rooms/:roomId/messages`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?page=1&limit=50
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Messages retrieved successfully",
  "data": {
    "messages": [
      {
        "id": 1,
        "senderId": 3,
        "messageText": "Hello, I'm interested in your services",
        "messageType": "text",
        "isRead": true,
        "createdAt": "2026-05-03T10:30:00Z"
      },
      {
        "id": 2,
        "senderId": 10,
        "messageText": "Thank you for your interest!",
        "messageType": "text",
        "isRead": false,
        "createdAt": "2026-05-03T10:35:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "totalPages": 1,
      "totalItems": 2
    }
  }
}
```

#### Send Message
**Endpoint:** `POST /api/consumer/chat/rooms/:roomId/messages`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (Text):**
```json
{
  "messageText": "What are your rates for a 2-day wedding?",
  "messageType": "text"
}
```

**Request Body (Media):** FormData
```
messageType: "image"
media: <File>
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Message sent successfully",
  "data": {
    "message": {
      "id": 3,
      "senderId": 3,
      "messageText": "What are your rates for a 2-day wedding?",
      "messageType": "text",
      "createdAt": "2026-05-03T10:40:00Z"
    }
  }
}
```

#### Mark Messages as Read
**Endpoint:** `PATCH /api/consumer/chat/rooms/:roomId/read`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Messages marked as read"
}
```

#### Block Vendor
**Endpoint:** `POST /api/consumer/chat/rooms/:roomId/block`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Vendor blocked successfully"
}
```

#### Unblock Vendor
**Endpoint:** `POST /api/consumer/chat/rooms/:roomId/unblock`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Vendor unblocked successfully"
}
```

#### Report Chat Room
**Endpoint:** `POST /api/consumer/chat/rooms/:roomId/report`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "spam",
  "description": "Vendor is sending spam messages"
}
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Chat room reported successfully"
}
```

### Vendor Routes (`/api/vendor/chat`)

#### Get My Chat Rooms
**Endpoint:** `GET /api/vendor/chat/rooms`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Chat rooms retrieved successfully",
  "data": {
    "rooms": [
      {
        "id": 1,
        "portfolioId": 5,
        "portfolio": {
          "title": "Wedding Photography Services",
          "coverImage": "http://localhost:5000/uploads/portfolios/cover.jpg"
        },
        "consumer": {
          "id": 3,
          "fullName": "Jane Smith",
          "profilePhoto": "http://localhost:5000/uploads/profiles/photo.jpg"
        },
        "lastMessage": {
          "messageText": "Thank you for your interest!",
          "createdAt": "2026-05-03T10:35:00Z"
        },
        "unreadCount": 1
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalPages": 1,
      "totalItems": 8
    }
  }
}
```

#### Get Chat Messages
**Endpoint:** `GET /api/vendor/chat/rooms/:roomId/messages`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?page=1&limit=50
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Messages retrieved successfully",
  "data": {
    "messages": [
      {
        "id": 1,
        "senderId": 3,
        "messageText": "Hello, I'm interested in your services",
        "messageType": "text",
        "isRead": true,
        "createdAt": "2026-05-03T10:30:00Z"
      },
      {
        "id": 2,
        "senderId": 10,
        "messageText": "Thank you for your interest!",
        "messageType": "text",
        "isRead": false,
        "createdAt": "2026-05-03T10:35:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "totalPages": 1,
      "totalItems": 2
    }
  }
}
```

#### Send Message
**Endpoint:** `POST /api/vendor/chat/rooms/:roomId/messages`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (Text):**
```json
{
  "messageText": "Our rates start from ₹25,000 for a 2-day wedding",
  "messageType": "text"
}
```

**Request Body (Media):** FormData
```
messageType: "image"
media: <File>
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Message sent successfully",
  "data": {
    "message": {
      "id": 3,
      "senderId": 10,
      "messageText": "Our rates start from ₹25,000 for a 2-day wedding",
      "messageType": "text",
      "createdAt": "2026-05-03T10:45:00Z"
    }
  }
}
```

#### Mark Messages as Read
**Endpoint:** `PATCH /api/vendor/chat/rooms/:roomId/read`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Messages marked as read"
}
```

#### Block Consumer
**Endpoint:** `POST /api/vendor/chat/rooms/:roomId/block`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Consumer blocked successfully"
}
```

#### Unblock Consumer
**Endpoint:** `POST /api/vendor/chat/rooms/:roomId/unblock`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Consumer unblocked successfully"
}
```

#### Report Chat Room
**Endpoint:** `POST /api/vendor/chat/rooms/:roomId/report`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "harassment",
  "description": "Consumer is sending inappropriate messages"
}
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Chat room reported successfully"
}
```

---

## 6. Common/Utility Routes

### Locations (`/api/common/locations`)

#### Get Countries
**Endpoint:** `GET /api/common/locations/countries`

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Countries retrieved successfully",
  "data": {
    "countries": [
      {
        "id": 1,
        "name": "India",
        "code": "IN"
      }
    ]
  }
}
```

#### Get States
**Endpoint:** `GET /api/common/locations/states`

**Query Parameters:**
```
?countryId=1
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "States retrieved successfully",
  "data": {
    "states": [
      {
        "id": 1,
        "name": "Maharashtra",
        "countryId": 1
      },
      {
        "id": 2,
        "name": "Karnataka",
        "countryId": 1
      }
    ]
  }
}
```

#### Get Cities
**Endpoint:** `GET /api/common/locations/cities`

**Query Parameters:**
```
?stateId=10&isPopular=true
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Cities retrieved successfully",
  "data": {
    "cities": [
      {
        "id": 10,
        "name": "Mumbai",
        "stateId": 1,
        "cityTier": "tier_1",
        "isPopular": true
      },
      {
        "id": 11,
        "name": "Pune",
        "stateId": 1,
        "cityTier": "tier_2",
        "isPopular": true
      }
    ]
  }
}
```

#### Search Cities
**Endpoint:** `GET /api/common/locations/cities/search`

**Query Parameters:**
```
?q=mumbai
```

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Cities found",
  "data": {
    "cities": [
      {
        "id": 10,
        "name": "Mumbai",
        "stateId": 1,
        "cityTier": "tier_1"
      }
    ]
  }
}
```

### Categories (`/api/common/categories`)

#### Get All Categories
**Endpoint:** `GET /api/common/categories`

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Photography",
        "slug": "photography",
        "iconUrl": "http://localhost:5000/uploads/categories/photography.png",
        "subcategories": [
          {
            "id": 1,
            "name": "Wedding Photography",
            "categoryId": 1
          }
        ]
      }
    ]
  }
}
```

#### Get Category Details
**Endpoint:** `GET /api/common/categories/:slug`

**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Category details retrieved successfully",
  "data": {
    "category": {
      "id": 1,
      "name": "Photography",
      "slug": "photography",
      "description": "Professional photography services for weddings and events",
      "iconUrl": "http://localhost:5000/uploads/categories/photography.png",
      "subcategories": [
        {
          "id": 1,
          "name": "Wedding Photography",
          "categoryId": 1
        }
      ]
    }
  }
}
```

---

## Response Format Standards

### Success Response
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Error description",
  "errors": [ ... ] // Optional validation errors
}
```

### Paginated Response
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Data retrieved successfully",
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalPages": 5,
      "totalItems": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Common Response Codes

**Success Codes:**
- `SUCCESS` - General success
- `CREATED` - Resource created successfully
- `UPDATED` - Resource updated successfully
- `DELETED` - Resource deleted successfully

**Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Authentication required or token invalid
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `QUOTA_EXCEEDED` - Subscription quota limit reached
- `PAYMENT_REQUIRED` - Payment verification pending
- `BUSINESS_LOGIC_ERROR` - Business rule violation
- `INTERNAL_ERROR` - Server error

---

## Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <access_token>
```

Token payload includes:
```json
{
  "userId": 123,
  "roleId": 3,
  "roleSlug": "vendor",
  "mobile": "9175113022",
  "email": "user@example.com",
  "iat": 1700000000,
  "exp": 1700086400
}
```

---

## Rate Limiting

- **Public routes**: 100 requests per 15 minutes per IP
- **Authenticated routes**: 1000 requests per 15 minutes per user
- **File upload routes**: 20 requests per 15 minutes per user

---

## File Upload Limits

- **Profile photos**: Max 5MB, formats: jpg, jpeg, png, webp
- **Portfolio media**: Max 10MB per file, formats: jpg, jpeg, png, webp, mp4
- **Chat media**: Max 10MB per file, formats: jpg, jpeg, png, webp, mp4
- **Payment proof**: Max 5MB, formats: jpg, jpeg, png, pdf

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity (business logic error)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
