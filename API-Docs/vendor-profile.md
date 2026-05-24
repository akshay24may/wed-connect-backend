# Vendor Profile API Documentation

**Base URL**: `/api/vendor/profile`

## Overview

The vendor profile module handles vendor-specific business information including business details, KYC documents, contact information, professional details, and business media. All endpoints require authentication and vendor role.

**Note:** Vendor profile is automatically created when a vendor registers. The `businessName` is initially set to the user's full name and can be updated later.

---

## Endpoints

### 1. Get Vendor Profile

**Endpoint:** `GET /api/vendor/profile`

**Description:** Retrieve the authenticated vendor's business profile information including basic user info.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Data retrieved successfully",
  "data": {
    "vendorProfile": {
      "id": 1,
      "userId": 5,
      "businessName": "John's Photography Studio",
      "businessPan": "ABCDE1234F",
      "gstin": "27ABCDE1234F1Z5",
      "businessRegistrationNumber": "REG123456",
      "businessType": "proprietorship",
      "establishmentYear": 2015,
      "nameOnId": "John Doe",
      "aadharNumber": "123456789012",
      "panNumber": "ABCDE1234F",
      "alternateMobileOne": "9876543210",
      "alternateMobileTwo": "9876543211",
      "whatsappMobile": "9175113022",
      "businessLogo": "http://localhost:5000/uploads/vendors/user-5/logo-123.jpg",
      "businessBanner": "http://localhost:5000/uploads/vendors/user-5/banner-123.jpg",
      "yearsOfExperience": 10,
      "teamSize": 5,
      "portfolioTagline": "Capturing your special moments",
      "specializations": ["Wedding Photography", "Pre-wedding Shoots", "Candid Photography"],
      "serviceAreas": ["Mumbai", "Pune", "Nashik"],
      "certifications": [
        {
          "name": "Professional Photography Certification",
          "issuedBy": "Photography Institute",
          "year": 2016
        }
      ],
      "awards": [
        {
          "title": "Best Wedding Photographer 2023",
          "issuedBy": "Wedding Awards India",
          "year": 2023
        }
      ],
      "businessEmail": "business@johnphoto.com",
      "businessPhone": "02212345678",
      "websiteUrl": "https://johnphoto.com",
      "facebookUrl": "https://facebook.com/johnphoto",
      "instagramUrl": "https://instagram.com/johnphoto",
      "youtubeUrl": "https://youtube.com/@johnphoto",
      "linkedinUrl": "https://linkedin.com/in/johnphoto",
      "businessHours": {
        "monday": { "open": "09:00", "close": "18:00" },
        "tuesday": { "open": "09:00", "close": "18:00" },
        "wednesday": { "open": "09:00", "close": "18:00" },
        "thursday": { "open": "09:00", "close": "18:00" },
        "friday": { "open": "09:00", "close": "18:00" },
        "saturday": { "open": "10:00", "close": "16:00" },
        "sunday": { "closed": true }
      },
      "acceptsAdvanceBooking": true,
      "minAdvanceBookingDays": 30,
      "cancellationPolicy": "50% refund if cancelled 30 days before event",
      "isVerifiedVendor": true,
      "verifiedAt": "2024-01-15T10:00:00Z",
      "verificationBadgeType": "premium",
      "trustScore": 4.85,
      "user": {
        "id": 5,
        "fullName": "John Doe",
        "mobile": "9175113022",
        "email": "john@example.com",
        "profilePhoto": "http://localhost:5000/uploads/profiles/photo.jpg",
        "avatarPhoto": "http://localhost:5000/uploads/profiles/avatar.jpg",
        "roleSlug": "vendor"
      }
    }
  }
}
```

**Error Responses:**
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (not a vendor)
- `404` - Vendor profile not found
- `500` - Internal server error

---

### 2. Update Vendor Profile

**Endpoint:** `PUT /api/vendor/profile`

**Description:** Update vendor business profile information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "businessName": "John's Photography Studio",
  "businessPan": "ABCDE1234F",
  "gstin": "27ABCDE1234F1Z5",
  "businessRegistrationNumber": "REG123456",
  "businessType": "proprietorship",
  "establishmentYear": 2015,
  "nameOnId": "John Doe",
  "aadharNumber": "123456789012",
  "panNumber": "ABCDE1234F",
  "alternateMobileOne": "9876543210",
  "alternateMobileTwo": "9876543211",
  "whatsappMobile": "9175113022",
  "yearsOfExperience": 10,
  "teamSize": 5,
  "portfolioTagline": "Capturing your special moments",
  "specializations": ["Wedding Photography", "Pre-wedding Shoots"],
  "serviceAreas": ["Mumbai", "Pune"],
  "certifications": [
    {
      "name": "Professional Photography Certification",
      "issuedBy": "Photography Institute",
      "year": 2016
    }
  ],
  "awards": [
    {
      "title": "Best Wedding Photographer 2023",
      "issuedBy": "Wedding Awards India",
      "year": 2023
    }
  ],
  "businessEmail": "business@johnphoto.com",
  "businessPhone": "02212345678",
  "websiteUrl": "https://johnphoto.com",
  "facebookUrl": "https://facebook.com/johnphoto",
  "instagramUrl": "https://instagram.com/johnphoto",
  "youtubeUrl": "https://youtube.com/@johnphoto",
  "linkedinUrl": "https://linkedin.com/in/johnphoto",
  "businessHours": {
    "monday": { "open": "09:00", "close": "18:00" },
    "tuesday": { "open": "09:00", "close": "18:00" }
  },
  "acceptsAdvanceBooking": true,
  "minAdvanceBookingDays": 30,
  "cancellationPolicy": "50% refund if cancelled 30 days before event"
}
```

**Optional Fields (All):**
- `businessName` (string, max 200) - Business name
- `businessPan` (string, 10 chars) - Business PAN number
- `gstin` (string, 15 chars) - GST identification number
- `businessRegistrationNumber` (string, max 50) - Business registration number
- `businessType` (enum) - Business type: proprietorship, partnership, pvt_ltd, llp, other
- `establishmentYear` (integer) - Year business was established
- `nameOnId` (string, max 150) - Name as per ID proof
- `aadharNumber` (string, 12 chars) - Aadhar number
- `panNumber` (string, 10 chars) - Personal PAN number
- `alternateMobileOne` (string, max 15) - First alternate mobile
- `alternateMobileTwo` (string, max 15) - Second alternate mobile
- `whatsappMobile` (string, max 15) - WhatsApp mobile number
- `yearsOfExperience` (integer) - Years of professional experience
- `teamSize` (integer) - Number of team members
- `portfolioTagline` (string, max 200) - Business tagline
- `specializations` (array) - Array of specialization strings
- `serviceAreas` (array) - Array of service area strings
- `certifications` (array) - Array of certification objects
- `awards` (array) - Array of award objects
- `businessEmail` (string, max 150) - Business email
- `businessPhone` (string, max 15) - Business phone number
- `websiteUrl` (string, max 255) - Website URL
- `facebookUrl` (string, max 255) - Facebook page URL
- `instagramUrl` (string, max 255) - Instagram profile URL
- `youtubeUrl` (string, max 255) - YouTube channel URL
- `linkedinUrl` (string, max 255) - LinkedIn profile URL
- `businessHours` (object) - Business hours by day
- `acceptsAdvanceBooking` (boolean) - Accepts advance bookings
- `minAdvanceBookingDays` (integer) - Minimum advance booking days
- `cancellationPolicy` (text) - Cancellation policy text

**Success Response (200):**
```json
{
  "success": true,
  "code": "UPDATED",
  "message": "Profile updated successfully",
  "data": {
    "vendorProfile": {
      "id": 1,
      "businessName": "John's Photography Studio",
      "businessType": "proprietorship",
      "establishmentYear": 2015,
      "yearsOfExperience": 10,
      "teamSize": 5,
      "portfolioTagline": "Capturing your special moments",
      "businessEmail": "business@johnphoto.com",
      "businessPhone": "02212345678",
      "alternateMobileOne": "9876543210",
      "alternateMobileTwo": "9876543211",
      "whatsappMobile": "9175113022"
    }
  }
}
```

**Error Responses:**
- `400` - Alternate mobile number already in use or validation error
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (not a vendor)
- `404` - Vendor profile not found
- `500` - Internal server error

**Notes:**
- Only provided fields are updated
- Alternate mobile numbers must be unique across all vendor profiles
- JSONB fields (specializations, serviceAreas, certifications, awards) replace entire array

---

### 3. Upload Business Logo

**Endpoint:** `POST /api/vendor/profile/logo`

**Description:** Upload or update business logo.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:** FormData
- `logo` (File): Image file

**File Requirements:**
- **Max Size:** 5 MB
- **Allowed Types:** JPEG, JPG, PNG, WEBP
- **Field Name:** `logo`

**Success Response (200):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "File uploaded successfully",
  "data": {
    "businessLogo": "http://localhost:5000/uploads/vendors/user-5/logo-123.jpg"
  }
}
```

**Error Responses:**
- `400` - Invalid file type, file too large, or validation error
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (not a vendor)
- `404` - Vendor profile not found
- `500` - Internal server error

**Notes:**
- Previous business logo is automatically deleted
- Logo URL is returned with full path
- Files stored in `uploads/vendors/user-{userId}/`
- Storage type (local/cloudinary) determined by environment configuration

---

### 4. Upload Business Banner

**Endpoint:** `POST /api/vendor/profile/banner`

**Description:** Upload or update business banner image.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:** FormData
- `banner` (File): Image file

**File Requirements:**
- **Max Size:** 5 MB
- **Allowed Types:** JPEG, JPG, PNG, WEBP
- **Field Name:** `banner`

**Success Response (200):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "File uploaded successfully",
  "data": {
    "businessBanner": "http://localhost:5000/uploads/vendors/user-5/banner-123.jpg"
  }
}
```

**Error Responses:**
- `400` - Invalid file type, file too large, or validation error
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (not a vendor)
- `404` - Vendor profile not found
- `500` - Internal server error

**Notes:**
- Previous business banner is automatically deleted
- Banner URL is returned with full path
- Files stored in `uploads/vendors/user-{userId}/`
- Storage type (local/cloudinary) determined by environment configuration

---

### 5. Delete Business Logo

**Endpoint:** `DELETE /api/vendor/profile/logo`

**Description:** Delete business logo.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "code": "DELETED",
  "message": "File deleted successfully",
  "data": null
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (not a vendor)
- `404` - Vendor profile not found
- `500` - Internal server error

**Notes:**
- Logo is removed from storage
- businessLogo field is set to null in database
- Business banner is not affected

---

### 6. Delete Business Banner

**Endpoint:** `DELETE /api/vendor/profile/banner`

**Description:** Delete business banner image.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "code": "DELETED",
  "message": "File deleted successfully",
  "data": null
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (not a vendor)
- `404` - Vendor profile not found
- `500` - Internal server error

**Notes:**
- Banner is removed from storage
- businessBanner field is set to null in database
- Business logo is not affected

---

## Authentication & Authorization

All vendor profile endpoints require:
1. **Authentication:** Valid JWT token in Authorization header
2. **Authorization:** User must have vendor role

```
Authorization: Bearer <access_token>
```

**Middleware Chain:**
```javascript
authenticate → isVendor → controller
```

---

## Data Structures

### Business Hours Object
```json
{
  "monday": { "open": "09:00", "close": "18:00" },
  "tuesday": { "open": "09:00", "close": "18:00" },
  "wednesday": { "open": "09:00", "close": "18:00" },
  "thursday": { "open": "09:00", "close": "18:00" },
  "friday": { "open": "09:00", "close": "18:00" },
  "saturday": { "open": "10:00", "close": "16:00" },
  "sunday": { "closed": true }
}
```

### Certification Object
```json
{
  "name": "Certification Name",
  "issuedBy": "Issuing Organization",
  "year": 2020,
  "certificateUrl": "https://example.com/cert.pdf"
}
```

### Award Object
```json
{
  "title": "Award Title",
  "issuedBy": "Issuing Organization",
  "year": 2023,
  "description": "Award description"
}
```

---

## Validation Rules

### Business PAN
- Format: 10 alphanumeric characters
- Pattern: `[A-Z]{5}[0-9]{4}[A-Z]{1}`
- Example: `ABCDE1234F`

### GSTIN
- Format: 15 alphanumeric characters
- Pattern: `[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}`
- Example: `27ABCDE1234F1Z5`

### Aadhar Number
- Format: 12 digits
- Pattern: `[0-9]{12}`
- Example: `123456789012`

### Mobile Numbers
- Format: 10-15 digits
- Must be unique across vendor profiles
- Can include country code

---

## Error Codes

| Code | Description |
|------|-------------|
| `SUCCESS` | Operation successful |
| `UPDATED` | Resource updated successfully |
| `DELETED` | Resource deleted successfully |
| `VALIDATION_ERROR` | Input validation failed |
| `UNAUTHORIZED` | Authentication required or token invalid |
| `FORBIDDEN` | Insufficient permissions (not a vendor) |
| `NOT_FOUND` | Vendor profile not found |
| `INTERNAL_ERROR` | Server error |

---

## Common Error Messages

- `Vendor profile not found` - Vendor profile doesn't exist
- `Alternate mobile number already in use` - Mobile number is registered to another vendor
- `Logo file is required` - No file uploaded
- `Banner file is required` - No file uploaded
- `Invalid file type` - File type not allowed
- `File size exceeds maximum limit` - File too large
- `Access forbidden` - User is not a vendor

---

## File Upload Notes

1. **Storage Configuration:**
   - Local storage: Files saved to `uploads/vendors/user-{userId}/`
   - Cloudinary: Files uploaded to configured Cloudinary account
   - Storage type determined by `STORAGE_TYPE` environment variable

2. **File Naming:**
   - Files are automatically renamed with timestamp and random suffix
   - Original filename extension is preserved
   - Example: `logo-1714737600000-abc123.jpg`

3. **File Deletion:**
   - Old files are automatically deleted when uploading new ones
   - Deletion works for both local and Cloudinary storage

4. **URL Generation:**
   - Full URLs are returned in responses
   - URLs include base URL from environment configuration
   - Example: `http://localhost:5000/uploads/vendors/user-5/logo-123.jpg`

---

## Security Notes

1. **Vendor-Only Access:**
   - All endpoints require vendor role
   - Non-vendors receive 403 Forbidden error

2. **Mobile Number Uniqueness:**
   - Alternate mobile numbers must be unique
   - Prevents duplicate contact information

3. **KYC Data:**
   - Aadhar, PAN numbers stored as plain text
   - Consider encryption for production
   - Implement separate KYC verification workflow

4. **File Upload Security:**
   - File type validation (only images allowed)
   - File size limits enforced (5 MB max)
   - Files stored in vendor-specific directories

5. **Admin-Only Fields:**
   - `isVerifiedVendor`, `verifiedAt`, `verificationBadgeType`, `trustScore`
   - Cannot be updated by vendors
   - Require admin panel endpoints (future implementation)

---

## Auto-Creation on Registration

When a vendor registers:
1. User account is created in `users` table
2. Vendor profile is automatically created in `vendor_profiles` table
3. `businessName` is initially set to user's `fullName`
4. All other fields are null/default values
5. Vendor can update profile information later

**Example Registration Flow:**
```
POST /api/auth/register
{
  "mobile": "9175113022",
  "fullName": "John Doe",
  "password": "SecurePass123",
  "roleSlug": "vendor"
}

→ Creates user with id=5
→ Auto-creates vendor_profile with userId=5, businessName="John Doe"
```

---

## Development Notes

- Business logo and banner share the same storage type configuration
- Consider implementing image compression/resizing for logos and banners
- Logo should ideally be square (recommended: 512x512px)
- Banner should be wide (recommended: 1920x400px)
- Add rate limiting for file upload endpoints
- Consider implementing CDN for serving uploaded images in production
- KYC fields (Aadhar, PAN) should be encrypted in production
- Implement separate admin endpoints for verification workflow

---

## Future Enhancements

1. **KYC Verification:**
   - Separate endpoints for KYC document upload
   - Admin approval workflow
   - Document verification status

2. **Trust Score:**
   - Automatic calculation based on reviews, response time, etc.
   - Admin override capability

3. **Verification Badge:**
   - Different badge levels (basic, premium, elite)
   - Criteria for each level
   - Badge display on portfolios

4. **Business Hours:**
   - Validation for time format
   - Holiday management
   - Special hours for events

5. **Service Areas:**
   - Integration with cities table
   - Distance-based service area calculation
   - Service area pricing

---

## Related Endpoints

- **User Profile:** `/api/profile` - Personal user information
- **Portfolios:** `/api/vendor/portfolios` - Vendor's service portfolios
- **Subscriptions:** `/api/vendor/subscriptions` - Subscription management

---

## Testing Checklist

- [ ] Get vendor profile with valid token
- [ ] Update business name and contact info
- [ ] Update KYC information (PAN, Aadhar)
- [ ] Update professional details (experience, team size)
- [ ] Update JSONB fields (specializations, service areas)
- [ ] Upload business logo
- [ ] Upload business banner
- [ ] Delete business logo
- [ ] Delete business banner
- [ ] Test duplicate alternate mobile numbers
- [ ] Test non-vendor access (should fail)
- [ ] Test without authentication (should fail)
- [ ] Test file upload validation (size, type)
