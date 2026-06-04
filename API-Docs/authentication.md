# Authentication API Documentation

**Base URL**: `/api/auth`

## Overview

The authentication module handles user registration, login, OTP verification, password reset, and session management using JWT tokens.

---

## Endpoints

### 1. Register

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user with mobile number and password.

**Request Body:**
```json
{
  "mobile": "9175113022",
  "fullName": "John Doe",
  "password": "SecurePass123",
  "roleSlug": "vendor",
  "email": "john@example.com"
}
```

**Required Fields:**
- `mobile` (string): User's mobile number
- `fullName` (string): User's full name
- `password` (string): Password (minimum 6 characters)

**Optional Fields:**
- `roleSlug` (string): Role slug (default: "consumer"). Options: "consumer", "vendor"
- `email` (string): User's email address

**Success Response (201):**
```json
{
  "success": true,
  "code": "CREATED",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "mobile": "9175113022",
      "email": "john@example.com",
      "roleSlug": "vendor"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400` - User already exists, email already exists, or validation error
- `500` - Internal server error

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Description:** Login with mobile number and password.

**Request Body:**
```json
{
  "mobile": "9175113022",
  "password": "SecurePass123"
}
```

**Required Fields:**
- `mobile` (string): User's mobile number
- `password` (string): User's password

**Success Response (200):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "mobile": "9175113022",
      "email": "john@example.com",
      "roleSlug": "vendor",
      "isPhoneVerified": false,
      "isEmailVerified": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401` - Invalid credentials or account suspended
- `500` - Internal server error

---

### 3. Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Description:** Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Required Fields:**
- `refreshToken` (string): Valid refresh token

**Success Response (200):**
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

**Error Responses:**
- `401` - Invalid or expired refresh token
- `500` - Internal server error

---

### 4. Logout

**Endpoint:** `POST /api/auth/logout`

**Description:** Logout user and invalidate session.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body (Optional):**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Logged out successfully",
  "data": null
}
```

**Notes:**
- If `refreshToken` is provided, only that session is invalidated
- If `refreshToken` is not provided, all user sessions are invalidated

**Error Responses:**
- `401` - Unauthorized (invalid or missing token)
- `500` - Internal server error

---

### 5. Request OTP

**Endpoint:** `POST /api/auth/otp/request`

**Description:** Request OTP for login, signup, verification, or password reset.

**Request Body:**
```json
{
  "mobile": "9175113022",
  "type": "login",
  "channel": "sms"
}
```

**Alternative (Email):**
```json
{
  "email": "user@example.com",
  "type": "verification",
  "channel": "email"
}
```

**Required Fields:**
- `mobile` OR `email` (string): User's mobile number or email address
- `type` (string): OTP type. Options: "login", "signup", "verification", "password_reset"

**Optional Fields:**
- `channel` (string): Delivery channel. Options: "sms", "whatsapp", "email" (default: "sms")

**Success Response (200):**
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

**Error Responses:**
- `400` - User not found (for login/password_reset), user already exists (for signup), or validation error
- `500` - Internal server error

**Notes:**
- OTP is valid for 10 minutes
- OTP is logged to console in development mode
- Maximum 5 verification attempts allowed
- For email channel, email field is required

---

### 6. Verify OTP

**Endpoint:** `POST /api/auth/otp/verify`

**Description:** Verify OTP and login user (if exists).

**Request Body (Mobile):**
```json
{
  "mobile": "9175113022",
  "otp": "123456",
  "type": "login"
}
```

**Request Body (Email):**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "type": "verification"
}
```

**Required Fields:**
- `mobile` OR `email` (string): User's mobile number or email address
- `otp` (string): 6-digit OTP code
- `type` (string): OTP type. Options: "login", "signup", "verification", "password_reset"

**Success Response (200):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "OTP verified successfully",
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "mobile": "9175113022",
      "email": "john@example.com",
      "roleSlug": "vendor"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400` - OTP not found, expired, invalid, or max attempts exceeded
- `500` - Internal server error

**Notes:**
- Phone/Email is automatically marked as verified after successful OTP verification
- User is automatically logged in if account exists
- OTP is matched by mobile/email and type combination

---

### 7. Google OAuth

**Endpoint:** `GET /api/auth/google`

**Description:** Initiate Google OAuth authentication flow.

**Response:** Redirects to Google OAuth consent screen.

**Callback Endpoint:** `GET /api/auth/google/callback`

**Description:** Google OAuth callback handler. Automatically creates or links user account and redirects to frontend with tokens.

**Redirect URL:**
```
{FRONTEND_URL}/auth/callback?accessToken={token}&refreshToken={token}&isNewUser={boolean}
```

**Error Redirect:**
```
{FRONTEND_URL}/auth/error?message={error_message}
```

**Notes:**
- If user exists with same email, Google account is linked to existing user
- If user doesn't exist, new account is created with Google profile data
- Email is automatically verified for Google OAuth users
- Random password is generated for social login users
- User is automatically logged in after successful OAuth

---

### 8. Reset Password

**Endpoint:** `POST /api/auth/password/reset`

**Description:** Reset password using OTP verification. Use the OTP request endpoint with `type: "password_reset"` to get an OTP first.

**Request Body:**
```json
{
  "mobile": "9175113022",
  "otp": "123456",
  "newPassword": "NewSecurePass123"
}
```

**Required Fields:**
- `mobile` (string): User's mobile number
- `otp` (string): 6-digit OTP code
- `newPassword` (string): New password (minimum 6 characters)

**Success Response (200):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Password reset successfully",
  "data": null
}
```

**Error Responses:**
- `400` - OTP not found, expired, invalid, or validation error
- `500` - Internal server error

**Notes:**
- All user sessions are invalidated after password reset
- User must login again with new password
- Use `/api/auth/otp/request` with `type: "password_reset"` to request OTP

---

## JWT Token Structure

Access and refresh tokens contain the following payload:

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

**Token Expiry:**
- Access Token: 7 days (configurable via `ACCESS_TOKEN_EXPIRY`)
- Refresh Token: 30 days (configurable via `REFRESH_TOKEN_EXPIRY`)

---

## Authentication Header

Protected routes require JWT token in Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `CREATED` | Resource created successfully |
| `SUCCESS` | Operation successful |
| `VALIDATION_ERROR` | Input validation failed |
| `UNAUTHORIZED` | Authentication required or token invalid |
| `REGISTRATION_FAILED` | User registration failed |
| `INTERNAL_ERROR` | Server error |

---

## Common Error Messages

- `User already exists` - Mobile number already registered
- `Email already exists` - Email already registered
- `Invalid email or password` - Login credentials incorrect
- `Account has been suspended` - User account is inactive
- `Invalid or expired access token` - Token validation failed
- `Invalid or expired refresh token` - Refresh token invalid
- `User not found` - No user with provided mobile number
- `OTP has expired` - OTP validity period exceeded
- `Invalid OTP` - Incorrect OTP code
- `Maximum OTP verification attempts exceeded` - Too many failed attempts
- `OTP not found or already verified` - Invalid OTP ID or already used

---

## Security Notes

1. **Password Requirements:**
   - Minimum 6 characters
   - Passwords are hashed using bcrypt with 10 salt rounds

2. **OTP Security:**
   - 6-digit random OTP
   - Valid for 10 minutes
   - Maximum 5 verification attempts
   - One-time use only

3. **Session Management:**
   - Refresh tokens stored in database
   - Sessions can be invalidated individually or all at once
   - Expired sessions are automatically cleaned up

4. **Token Security:**
   - JWT tokens signed with secret key
   - Tokens include user role for authorization
   - Refresh tokens have longer expiry than access tokens

---

## Development Notes

- OTP codes are logged to console in development mode
- In production, integrate with SMS gateway (Twilio, AWS SNS, etc.)
- Consider implementing rate limiting for OTP requests
- Add IP-based throttling for failed login attempts
