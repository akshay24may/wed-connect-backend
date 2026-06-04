# User Profile API Documentation

**Base URL**: `/api/profile`

## Overview

The profile module handles user profile management including viewing, updating profile information, uploading photos, and changing passwords. All endpoints require authentication.

---

## Endpoints

### 1. Get Own Profile

**Endpoint:** `GET /api/profile`

**Description:** Retrieve the authenticated user's profile information.

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
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "mobile": "9175113022",
      "email": "john@example.com",
      "dob": "1990-01-15",
      "gender": "male",
      "about": "Wedding photographer with 10 years experience",
      "profilePhoto": "http://localhost:5000/uploads/profiles/2026/05/photo-123.jpg",
      "avatarPhoto": "http://localhost:5000/uploads/profiles/2026/05/avatar-123.jpg",
      "address": "123 Main Street",
      "cityId": 10,
      "cityName": "Mumbai",
      "stateId": 2,
      "stateName": "Maharashtra",
      "countryName": "India",
      "pincode": "400001",
      "isPhoneVerified": true,
      "isEmailVerified": true,
      "isProfileComplete": true,
      "roleSlug": "vendor"
    }
  }
}
```

**Error Responses:**
- `401` - Unauthorized (invalid or missing token)
- `404` - User not found
- `500` - Internal server error

---

### 2. Update Profile

**Endpoint:** `PUT /api/profile`

**Description:** Update user profile information.

**Headers:**
```
Authorization: Bearer <access_token>
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
  "cityName": "Mumbai",
  "stateId": 2,
  "stateName": "Maharashtra",
  "countryName": "India",
  "pincode": "400001"
}
```

**Optional Fields:**
- `fullName` (string): User's full name
- `email` (string): User's email address
- `dob` (string): Date of birth (YYYY-MM-DD format)
- `gender` (string): Gender (male, female, other)
- `about` (text): About/bio text
- `address` (text): Full address
- `cityId` (integer): City ID
- `cityName` (string): City name
- `stateId` (integer): State ID
- `stateName` (string): State name
- `countryName` (string): Country name
- `pincode` (string): Postal code

**Success Response (200):**
```json
{
  "success": true,
  "code": "UPDATED",
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Doe Updated",
      "mobile": "9175113022",
      "email": "john.updated@example.com",
      "dob": "1990-01-15",
      "gender": "male",
      "about": "Wedding photographer with 10 years experience",
      "address": "123 Main Street",
      "cityId": 10,
      "cityName": "Mumbai",
      "stateId": 2,
      "stateName": "Maharashtra",
      "pincode": "400001"
    }
  }
}
```

**Error Responses:**
- `400` - Email already exists or validation error
- `401` - Unauthorized (invalid or missing token)
- `404` - User not found
- `500` - Internal server error

**Notes:**
- Only provided fields are updated
- Email uniqueness is validated
- If email is changed, email verification status is reset

---

### 3. Upload Profile Photo

**Endpoint:** `POST /api/profile/photo`

**Description:** Upload or update user profile photo.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:** FormData
- `photo` (File): Image file

**File Requirements:**
- **Max Size:** 5 MB
- **Allowed Types:** JPEG, JPG, PNG, WEBP
- **Field Name:** `photo`

**Success Response (200):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "File uploaded successfully",
  "data": {
    "profilePhoto": "http://localhost:5000/uploads/profiles/2026/05/photo-123.jpg"
  }
}
```

**Error Responses:**
- `400` - Invalid file type, file too large, or validation error
- `401` - Unauthorized (invalid or missing token)
- `404` - User not found
- `500` - Internal server error

**Notes:**
- Previous profile photo is automatically deleted
- Photo URL is returned with full path
- Storage type (local/cloudinary) is determined by environment configuration

---

### 4. Upload Avatar Photo

**Endpoint:** `POST /api/profile/avatar`

**Description:** Upload or update user avatar photo (smaller version for thumbnails/icons).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:** FormData
- `avatar` (File): Image file

**File Requirements:**
- **Max Size:** 5 MB
- **Allowed Types:** JPEG, JPG, PNG, WEBP
- **Field Name:** `avatar`

**Success Response (200):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "File uploaded successfully",
  "data": {
    "avatarPhoto": "http://localhost:5000/uploads/profiles/2026/05/avatar-123.jpg"
  }
}
```

**Error Responses:**
- `400` - Invalid file type, file too large, or validation error
- `401` - Unauthorized (invalid or missing token)
- `404` - User not found
- `500` - Internal server error

**Notes:**
- Previous avatar photo is automatically deleted
- Avatar URL is returned with full path
- Storage type (local/cloudinary) is determined by environment configuration

---

### 5. Delete Profile Photo

**Endpoint:** `DELETE /api/profile/photo`

**Description:** Delete user profile photo.

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
- `404` - User not found
- `500` - Internal server error

**Notes:**
- Profile photo is removed from storage
- Profile photo field is set to null in database
- Avatar photo is not affected

---

### 6. Change Password

**Endpoint:** `POST /api/profile/password/change`

**Description:** Change user password (requires current password).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass123"
}
```

**Required Fields:**
- `currentPassword` (string): Current password
- `newPassword` (string): New password (minimum 6 characters)

**Success Response (200):**
```json
{
  "success": true,
  "code": "UPDATED",
  "message": "Password changed successfully",
  "data": null
}
```

**Error Responses:**
- `400` - Invalid current password or validation error
- `401` - Unauthorized (invalid or missing token)
- `404` - User not found
- `500` - Internal server error

**Notes:**
- Current password must be correct
- New password must be at least 6 characters
- User sessions are NOT invalidated (unlike password reset)
- User can continue using current access token

---

## Authentication

All profile endpoints require JWT token in Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `SUCCESS` | Operation successful |
| `UPDATED` | Resource updated successfully |
| `DELETED` | Resource deleted successfully |
| `VALIDATION_ERROR` | Input validation failed |
| `UNAUTHORIZED` | Authentication required or token invalid |
| `NOT_FOUND` | User not found |
| `INTERNAL_ERROR` | Server error |

---

## Common Error Messages

- `User not found` - User account doesn't exist
- `Email already exists` - Email is already registered to another user
- `Invalid email or password` - Current password is incorrect
- `Photo file is required` - No file uploaded
- `Invalid file type` - File type not allowed
- `File size exceeds maximum limit` - File too large
- `Current password and new password are required` - Missing required fields
- `New password must be at least 6 characters long` - Password too short

---

## File Upload Notes

1. **Storage Configuration:**
   - Local storage: Files saved to `uploads/profiles/{year}/{month}/`
   - Cloudinary: Files uploaded to configured Cloudinary account
   - Storage type determined by `STORAGE_TYPE` environment variable

2. **File Naming:**
   - Files are automatically renamed with timestamp and random suffix
   - Original filename extension is preserved
   - Example: `photo-1714737600000-abc123.jpg`

3. **File Deletion:**
   - Old files are automatically deleted when uploading new ones
   - Deletion works for both local and Cloudinary storage

4. **URL Generation:**
   - Full URLs are returned in responses
   - URLs include base URL from environment configuration
   - Example: `http://localhost:5000/uploads/profiles/2026/05/photo-123.jpg`

---

## Security Notes

1. **Authentication Required:**
   - All endpoints require valid JWT token
   - Users can only access their own profile

2. **Email Validation:**
   - Email uniqueness is enforced
   - Email format validation is performed

3. **Password Security:**
   - Current password verification required for password change
   - Passwords are hashed using bcrypt with 10 salt rounds
   - Minimum 6 characters required

4. **File Upload Security:**
   - File type validation (only images allowed)
   - File size limits enforced (5 MB max)
   - Files stored in user-specific directories

---

## Development Notes

- Profile photos and avatars share the same storage type configuration
- Consider implementing image compression/resizing for profile photos
- Avatar photos should ideally be square and smaller than profile photos
- Add rate limiting for file upload endpoints
- Consider implementing CDN for serving uploaded images in production
