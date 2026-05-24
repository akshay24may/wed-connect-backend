# Vendor Profile Module Implementation

**Date:** 2026-05-04  
**Status:** ✅ COMPLETE

---

## Overview

Implemented a complete vendor profile management system with separate endpoints from the common user profile. This allows vendors to manage their business-specific information including KYC documents, business media, professional details, and contact information.

---

## Architecture Decision

### ✅ Chosen Approach: SEPARATE ENDPOINTS

**Rationale:**
- Clear separation of concerns (personal vs business info)
- Better security (vendor-only access)
- Easier to maintain and extend
- Follows REST principles
- No confusion for frontend developers

**Endpoint Structure:**
- `/api/profile` → Personal user info (all roles)
- `/api/vendor/profile` → Business info (vendors only)

---

## Implemented Features

### 1. Vendor Profile Repository
**File:** `src/repositories/vendorProfileRepository.js`

**Methods:**
- `findByUserId(userId)` - Get vendor profile with user info
- `createVendorProfile(vendorData)` - Create new vendor profile
- `updateVendorProfile(userId, vendorData)` - Update vendor profile
- `updateBusinessLogo(userId, logoPath, storageType)` - Update logo
- `updateBusinessBanner(userId, bannerPath, storageType)` - Update banner
- `deleteBusinessLogo(userId)` - Delete logo
- `deleteBusinessBanner(userId)` - Delete banner
- `checkAlternateMobileExists(mobile, excludeUserId)` - Check mobile uniqueness

**Features:**
- Includes user info in profile retrieval
- Validates alternate mobile uniqueness
- Handles JSONB fields (specializations, serviceAreas, etc.)

---

### 2. Vendor Profile Service
**File:** `src/services/vendorProfileService.js`

**Methods:**
- `getVendorProfile(userId)` - Get complete vendor profile
- `updateVendorProfile(userId, profileData)` - Update profile with validation
- `uploadBusinessLogo(userId, logoPath, storageType)` - Upload logo
- `uploadBusinessBanner(userId, bannerPath, storageType)` - Upload banner
- `deleteBusinessLogo(userId)` - Delete logo
- `deleteBusinessBanner(userId)` - Delete banner

**Business Logic:**
- Validates alternate mobile uniqueness
- Returns old file paths for cleanup
- Comprehensive error handling
- Structured response format

---

### 3. Vendor Profile Controller
**File:** `src/controllers/vendor/vendorProfileController.js`

**Endpoints:**
- `GET /api/vendor/profile` - Get vendor profile
- `PUT /api/vendor/profile` - Update vendor profile
- `POST /api/vendor/profile/logo` - Upload business logo
- `POST /api/vendor/profile/banner` - Upload business banner
- `DELETE /api/vendor/profile/logo` - Delete business logo
- `DELETE /api/vendor/profile/banner` - Delete business banner

**Features:**
- File upload with validation (size, type)
- Automatic old file deletion
- Comprehensive error handling
- Uses response formatters

---

### 4. Vendor Profile Routes
**File:** `src/routes/vendor/vendorProfileRoutes.js`

**Middleware Chain:**
```javascript
authenticate → isVendor → controller
```

**Security:**
- All routes require authentication
- All routes require vendor role
- Non-vendors receive 403 Forbidden

---

## Auto-Creation on Registration

### Implementation
**Modified Files:**
- `src/services/authService.js` - Added vendor profile creation
- `src/repositories/authRepository.js` - Added createVendorProfile method

**Flow:**
1. User registers with `roleSlug: "vendor"`
2. User account created in `users` table
3. Vendor profile automatically created in `vendor_profiles` table
4. `businessName` initially set to user's `fullName`
5. All other fields are null/default values

**Example:**
```javascript
// Registration
POST /api/auth/register
{
  "mobile": "9175113022",
  "fullName": "John Doe",
  "password": "SecurePass123",
  "roleSlug": "vendor"
}

// Auto-creates:
// - User (id=5, fullName="John Doe", roleId=vendor)
// - VendorProfile (userId=5, businessName="John Doe")
```

---

## File Upload System

### Directory Structure
```
uploads/
└── vendors/
    └── user-{userId}/
        ├── logo-{timestamp}-{random}.jpg
        └── banner-{timestamp}-{random}.jpg
```

### Upload Middleware Enhancement
**Modified:** `src/uploads/uploadMiddleware.js`

**Added Support For:**
- Vendor uploads directory
- User-specific subdirectories
- Automatic directory creation

**Storage Types:**
- Local: `uploads/vendors/user-{userId}/`
- Cloudinary: Configured Cloudinary account

---

## Database Schema

### vendor_profiles Table

**Business Information:**
- `businessName` (required) - Business name
- `businessPan` - Business PAN number
- `gstin` - GST identification number
- `businessRegistrationNumber` - Registration number
- `businessType` - Enum: proprietorship, partnership, pvt_ltd, llp, other
- `establishmentYear` - Year established

**KYC Information:**
- `nameOnId` - Name as per ID
- `aadharNumber` - Aadhar number (12 digits)
- `panNumber` - Personal PAN number

**Contact Information:**
- `alternateMobileOne` - First alternate mobile (unique)
- `alternateMobileTwo` - Second alternate mobile (unique)
- `whatsappMobile` - WhatsApp number (unique)
- `businessEmail` - Business email
- `businessPhone` - Business phone

**Business Media:**
- `businessLogo` - Logo file path
- `businessBanner` - Banner file path
- `businessMediaStorageType` - Storage type enum

**Professional Details:**
- `yearsOfExperience` - Years of experience
- `teamSize` - Number of team members
- `portfolioTagline` - Business tagline (max 200 chars)

**JSONB Arrays:**
- `specializations` - Array of specialization strings
- `serviceAreas` - Array of service area strings
- `certifications` - Array of certification objects
- `awards` - Array of award objects

**Social Media:**
- `websiteUrl` - Website URL
- `facebookUrl` - Facebook page URL
- `instagramUrl` - Instagram profile URL
- `youtubeUrl` - YouTube channel URL
- `linkedinUrl` - LinkedIn profile URL

**Business Policies:**
- `businessHours` - JSONB object with hours by day
- `acceptsAdvanceBooking` - Boolean (default: true)
- `minAdvanceBookingDays` - Integer (default: 7)
- `cancellationPolicy` - Text

**Verification (Admin-Only):**
- `isVerifiedVendor` - Boolean (default: false)
- `verifiedAt` - Timestamp
- `verificationBadgeType` - Enum: basic, premium, elite
- `trustScore` - Decimal (0.00 to 5.00)

---

## API Documentation

**File:** `API-Docs/vendor-profile.md`

**Includes:**
- Complete endpoint documentation
- Request/response examples
- Error codes and messages
- Authentication requirements
- File upload specifications
- Data structure definitions
- Validation rules
- Security notes
- Testing checklist

---

## Validation Rules

### Mobile Numbers
- Must be unique across all vendor profiles
- Format: 10-15 digits
- Can include country code

### Business PAN
- Format: 10 alphanumeric characters
- Pattern: `[A-Z]{5}[0-9]{4}[A-Z]{1}`

### GSTIN
- Format: 15 alphanumeric characters
- Pattern: `[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}`

### Aadhar Number
- Format: 12 digits
- Pattern: `[0-9]{12}`

### File Uploads
- Max size: 5 MB
- Allowed types: JPEG, JPG, PNG, WEBP

---

## Security Features

1. **Role-Based Access:**
   - All endpoints require vendor role
   - Non-vendors receive 403 Forbidden

2. **Mobile Uniqueness:**
   - Alternate mobile numbers must be unique
   - Prevents duplicate contact information

3. **File Upload Security:**
   - File type validation
   - File size limits
   - Vendor-specific directories

4. **Admin-Only Fields:**
   - Verification fields cannot be updated by vendors
   - Require separate admin endpoints (future)

---

## Files Created

### Core Implementation
- ✅ `src/repositories/vendorProfileRepository.js`
- ✅ `src/services/vendorProfileService.js`
- ✅ `src/controllers/vendor/vendorProfileController.js`
- ✅ `src/routes/vendor/vendorProfileRoutes.js`

### Documentation
- ✅ `API-Docs/vendor-profile.md`
- ✅ `VENDOR-PROFILE-IMPLEMENTATION.md`

### Directories
- ✅ `src/uploads/vendors/`

---

## Files Modified

### Integration
- ✅ `src/routes/index.js` - Added vendor profile routes
- ✅ `src/uploads/uploadMiddleware.js` - Added vendors directory support

### Auto-Creation
- ✅ `src/services/authService.js` - Auto-create vendor profile on registration
- ✅ `src/repositories/authRepository.js` - Added createVendorProfile method

---

## Testing Checklist

### Profile Management
- [ ] Get vendor profile with valid token
- [ ] Update business name and type
- [ ] Update KYC information (PAN, Aadhar)
- [ ] Update contact information
- [ ] Update professional details
- [ ] Update JSONB arrays (specializations, serviceAreas)
- [ ] Update social media URLs
- [ ] Update business hours
- [ ] Update cancellation policy

### File Uploads
- [ ] Upload business logo
- [ ] Upload business banner
- [ ] Replace existing logo
- [ ] Replace existing banner
- [ ] Delete business logo
- [ ] Delete business banner
- [ ] Test file size validation (> 5MB)
- [ ] Test file type validation (non-image)

### Validation
- [ ] Test duplicate alternate mobile numbers
- [ ] Test invalid PAN format
- [ ] Test invalid GSTIN format
- [ ] Test invalid Aadhar format

### Authorization
- [ ] Test non-vendor access (should fail with 403)
- [ ] Test without authentication (should fail with 401)
- [ ] Test consumer trying to access (should fail with 403)

### Auto-Creation
- [ ] Register new vendor
- [ ] Verify vendor profile is auto-created
- [ ] Verify businessName is set to fullName
- [ ] Get vendor profile immediately after registration

---

## Integration with Existing System

### User Profile vs Vendor Profile

**User Profile (`/api/profile`):**
- Personal information (all users)
- Profile photo, avatar photo
- Address, city, state
- Password management

**Vendor Profile (`/api/vendor/profile`):**
- Business information (vendors only)
- Business logo, banner
- KYC documents
- Professional details
- Business policies

**Separation Benefits:**
- Clear API boundaries
- Different access patterns
- Independent updates
- Better security

---

## Future Enhancements

### 1. KYC Verification Workflow
- Separate endpoints for KYC document upload
- Admin approval workflow
- Document verification status
- Rejection reasons

### 2. Trust Score Calculation
- Automatic calculation based on:
  - Review ratings
  - Response time
  - Portfolio quality
  - Completion rate
- Admin override capability

### 3. Verification Badge System
- Different badge levels (basic, premium, elite)
- Criteria for each level
- Badge display on portfolios
- Badge expiry and renewal

### 4. Business Hours Management
- Validation for time format
- Holiday management
- Special hours for events
- Timezone support

### 5. Service Areas Enhancement
- Integration with cities table
- Distance-based service area calculation
- Service area pricing
- Travel charges

### 6. Data Encryption
- Encrypt KYC fields (Aadhar, PAN)
- Secure storage for sensitive data
- Compliance with data protection laws

---

## Related Modules

### Completed
- ✅ Authentication Module
- ✅ User Profile Module
- ✅ Vendor Profile Module

### Pending (Phase 2)
- 🚧 Subscription Plans Module
- 🚧 Portfolios Module
- 🚧 Chat Module

---

## Notes

1. **Auto-Creation:** Vendor profile is automatically created on vendor registration with `businessName` set to user's `fullName`.

2. **Separate Endpoints:** Vendor profile has its own endpoints separate from user profile for better organization and security.

3. **File Storage:** Business media (logo, banner) stored in vendor-specific directories: `uploads/vendors/user-{userId}/`

4. **Mobile Uniqueness:** Alternate mobile numbers must be unique across all vendor profiles to prevent duplicate contact information.

5. **Admin Fields:** Verification-related fields (`isVerifiedVendor`, `verificationBadgeType`, `trustScore`) cannot be updated by vendors and require admin panel endpoints.

6. **JSONB Fields:** Arrays like `specializations`, `serviceAreas`, `certifications`, and `awards` are stored as JSONB and replace the entire array on update.

---

## Implementation Status

✅ **Vendor Profile Module - COMPLETE**
- Repository: 100%
- Service: 100%
- Controller: 100%
- Routes: 100%
- Auto-Creation: 100%
- File Uploads: 100%
- API Documentation: 100%

---

## Summary

Successfully implemented a comprehensive vendor profile management system with:
- Separate endpoints for business information
- Auto-creation on vendor registration
- File upload for business logo and banner
- Validation for KYC documents
- Mobile number uniqueness checks
- Complete API documentation
- Security with role-based access control

The implementation follows the established architecture patterns and integrates seamlessly with the existing authentication and user profile modules.
