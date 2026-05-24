# Phase 1 Verification Checklist

**Date:** 2026-05-03  
**Status:** Ready for Testing

---

## Pre-Testing Setup

### 1. Environment Variables
Ensure the following are set in `.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/wedconnect

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
ACCESS_TOKEN_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d

# Server
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3000

# Storage
STORAGE_TYPE=local
UPLOAD_URL=http://localhost:5000
UPLOAD_DIR=./uploads

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### 2. Database Setup
```bash
# Run migrations
npx sequelize-cli db:migrate

# Run seeders (if available)
npx sequelize-cli db:seed:all
```

### 3. Start Server
```bash
npm run dev
```

---

## Authentication Module Testing

### Register Endpoint
- [ ] **POST** `/api/auth/register`
  - [ ] Register consumer with mobile + password
  - [ ] Register vendor with mobile + password + email
  - [ ] Test duplicate mobile number (should fail)
  - [ ] Test duplicate email (should fail)
  - [ ] Test password < 6 characters (should fail)
  - [ ] Verify tokens are returned
  - [ ] Verify user is created in database

**Sample Request:**
```json
{
  "mobile": "9175113022",
  "fullName": "John Doe",
  "password": "SecurePass123",
  "roleSlug": "vendor",
  "email": "john@example.com"
}
```

### Login Endpoint
- [ ] **POST** `/api/auth/login`
  - [ ] Login with valid credentials
  - [ ] Test invalid mobile (should fail)
  - [ ] Test invalid password (should fail)
  - [ ] Test inactive account (should fail)
  - [ ] Verify tokens are returned
  - [ ] Verify lastLoginAt is updated

**Sample Request:**
```json
{
  "mobile": "9175113022",
  "password": "SecurePass123"
}
```

### Google OAuth
- [ ] **GET** `/api/auth/google`
  - [ ] Redirects to Google consent screen
  - [ ] Test with valid Google account
  - [ ] Test with existing email (should link accounts)
  - [ ] Test with new email (should create account)
  - [ ] Verify redirect to frontend with tokens

**Test URL:**
```
http://localhost:5000/api/auth/google
```

### Refresh Token Endpoint
- [ ] **POST** `/api/auth/refresh`
  - [ ] Refresh with valid refresh token
  - [ ] Test with invalid token (should fail)
  - [ ] Test with expired token (should fail)
  - [ ] Verify new tokens are returned
  - [ ] Verify old session is invalidated

**Sample Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Logout Endpoint
- [ ] **POST** `/api/auth/logout`
  - [ ] Logout with refresh token (single session)
  - [ ] Logout without refresh token (all sessions)
  - [ ] Test without auth token (should fail)
  - [ ] Verify session is invalidated in database

**Sample Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### OTP Request Endpoint
- [ ] **POST** `/api/auth/otp/request`
  - [ ] Request OTP for login (existing user)
  - [ ] Request OTP for signup (new user)
  - [ ] Request OTP for password reset
  - [ ] Test with email channel
  - [ ] Test with SMS channel
  - [ ] Test with WhatsApp channel
  - [ ] Verify OTP is logged to console
  - [ ] Verify OTP expiry is 10 minutes

**Sample Request:**
```json
{
  "mobile": "9175113022",
  "type": "login",
  "channel": "sms"
}
```

### OTP Verify Endpoint
- [ ] **POST** `/api/auth/otp/verify`
  - [ ] Verify valid OTP
  - [ ] Test with invalid OTP (should fail)
  - [ ] Test with expired OTP (should fail)
  - [ ] Test max attempts (5 attempts)
  - [ ] Verify phone/email is marked as verified
  - [ ] Verify tokens are returned (if user exists)

**Sample Request:**
```json
{
  "mobile": "9175113022",
  "otp": "123456",
  "type": "login"
}
```

### Password Reset Endpoint
- [ ] **POST** `/api/auth/password/reset`
  - [ ] Reset password with valid OTP
  - [ ] Test with invalid OTP (should fail)
  - [ ] Test with expired OTP (should fail)
  - [ ] Test password < 6 characters (should fail)
  - [ ] Verify all sessions are invalidated
  - [ ] Verify user can login with new password

**Sample Request:**
```json
{
  "mobile": "9175113022",
  "otp": "123456",
  "newPassword": "NewSecurePass123"
}
```

---

## Profile Module Testing

### Get Profile Endpoint
- [ ] **GET** `/api/profile`
  - [ ] Get profile with valid token
  - [ ] Test without auth token (should fail)
  - [ ] Test with invalid token (should fail)
  - [ ] Verify all profile fields are returned
  - [ ] Verify photo URLs are full URLs

**Headers:**
```
Authorization: Bearer <access_token>
```

### Update Profile Endpoint
- [ ] **PUT** `/api/profile`
  - [ ] Update full name
  - [ ] Update email
  - [ ] Update dob, gender, about
  - [ ] Update address, city, state, pincode
  - [ ] Test duplicate email (should fail)
  - [ ] Test without auth token (should fail)
  - [ ] Verify only provided fields are updated

**Sample Request:**
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

### Upload Profile Photo Endpoint
- [ ] **POST** `/api/profile/photo`
  - [ ] Upload valid image (JPEG, PNG, WEBP)
  - [ ] Test file > 5MB (should fail)
  - [ ] Test invalid file type (should fail)
  - [ ] Test without file (should fail)
  - [ ] Verify old photo is deleted
  - [ ] Verify full URL is returned
  - [ ] Verify file is saved to correct directory

**Form Data:**
```
photo: <File>
```

### Upload Avatar Photo Endpoint
- [ ] **POST** `/api/profile/avatar`
  - [ ] Upload valid image (JPEG, PNG, WEBP)
  - [ ] Test file > 5MB (should fail)
  - [ ] Test invalid file type (should fail)
  - [ ] Test without file (should fail)
  - [ ] Verify old avatar is deleted
  - [ ] Verify full URL is returned
  - [ ] Verify file is saved to correct directory

**Form Data:**
```
avatar: <File>
```

### Delete Profile Photo Endpoint
- [ ] **DELETE** `/api/profile/photo`
  - [ ] Delete existing profile photo
  - [ ] Test without auth token (should fail)
  - [ ] Verify photo is deleted from storage
  - [ ] Verify profilePhoto field is null
  - [ ] Verify avatar is not affected

### Change Password Endpoint
- [ ] **POST** `/api/profile/password/change`
  - [ ] Change password with valid current password
  - [ ] Test with invalid current password (should fail)
  - [ ] Test new password < 6 characters (should fail)
  - [ ] Test without auth token (should fail)
  - [ ] Verify user can login with new password
  - [ ] Verify current session is NOT invalidated

**Sample Request:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass123"
}
```

---

## Error Handling Testing

### Authentication Errors
- [ ] Test expired access token
- [ ] Test invalid access token
- [ ] Test missing Authorization header
- [ ] Test malformed Authorization header

### Validation Errors
- [ ] Test missing required fields
- [ ] Test invalid email format
- [ ] Test invalid mobile format
- [ ] Test password too short

### Business Logic Errors
- [ ] Test duplicate user registration
- [ ] Test duplicate email
- [ ] Test invalid credentials
- [ ] Test account suspended
- [ ] Test OTP expired
- [ ] Test OTP max attempts

---

## File Upload Testing

### Local Storage
- [ ] Verify files are saved to `uploads/profiles/{year}/{month}/`
- [ ] Verify file naming convention (timestamp + random suffix)
- [ ] Verify old files are deleted
- [ ] Verify full URLs are returned

### Cloudinary (if configured)
- [ ] Set `STORAGE_TYPE=cloudinary` in `.env`
- [ ] Configure Cloudinary credentials
- [ ] Test profile photo upload
- [ ] Test avatar photo upload
- [ ] Verify files are uploaded to Cloudinary
- [ ] Verify Cloudinary URLs are returned

---

## Database Verification

### After Registration
- [ ] User record created in `users` table
- [ ] Password is hashed (not plain text)
- [ ] Role is assigned correctly
- [ ] Session created in `user_sessions` table
- [ ] Refresh token stored in session

### After OTP Verification
- [ ] OTP record created in `otp_verifications` table
- [ ] OTP is marked as verified after use
- [ ] Phone/email verified flags updated
- [ ] Verified timestamp updated

### After Profile Update
- [ ] User record updated with new values
- [ ] Only provided fields are updated
- [ ] Timestamps updated correctly

### After File Upload
- [ ] Photo path stored in database
- [ ] Storage type stored correctly
- [ ] Old photo path removed

---

## Security Testing

### JWT Tokens
- [ ] Tokens contain correct payload
- [ ] Tokens expire after configured time
- [ ] Expired tokens are rejected
- [ ] Invalid tokens are rejected

### Password Security
- [ ] Passwords are hashed with bcrypt
- [ ] Plain text passwords never stored
- [ ] Password comparison works correctly

### File Upload Security
- [ ] File type validation works
- [ ] File size limits enforced
- [ ] Invalid files rejected
- [ ] Files stored in correct directories

---

## API Documentation Verification

- [ ] All endpoints documented in `API-Docs/authentication.md`
- [ ] All endpoints documented in `API-Docs/profile.md`
- [ ] Request/response examples are accurate
- [ ] Error codes are documented
- [ ] Authentication requirements are clear
- [ ] File upload specifications are clear

---

## Code Quality Checks

### ES6 Modules
- [ ] All files use `import/export` syntax
- [ ] All imports include `.js` extension
- [ ] No `require()` or `module.exports` used

### Absolute Imports
- [ ] All imports use `#` prefix
- [ ] No relative imports (`../../`)

### Response Format
- [ ] All responses include `success`, `code`, `message`, `data`
- [ ] Success responses use correct status codes
- [ ] Error responses use correct status codes

### Error Handling
- [ ] All errors caught and handled
- [ ] Consistent error messages
- [ ] Error codes match documentation

---

## Performance Testing

### Response Times
- [ ] Register: < 500ms
- [ ] Login: < 300ms
- [ ] Get Profile: < 200ms
- [ ] Update Profile: < 300ms
- [ ] File Upload: < 1000ms

### Database Queries
- [ ] No N+1 queries
- [ ] Proper use of includes/joins
- [ ] Indexes used correctly

---

## Integration Testing

### Complete User Flow
1. [ ] Register new user
2. [ ] Login with credentials
3. [ ] Get profile
4. [ ] Update profile
5. [ ] Upload profile photo
6. [ ] Change password
7. [ ] Logout
8. [ ] Login with new password

### OTP Flow
1. [ ] Request OTP
2. [ ] Verify OTP
3. [ ] Login automatically

### Password Reset Flow
1. [ ] Request OTP for password reset
2. [ ] Reset password with OTP
3. [ ] Login with new password

### Google OAuth Flow
1. [ ] Initiate Google OAuth
2. [ ] Authorize with Google
3. [ ] Redirect to frontend with tokens
4. [ ] Get profile

---

## Deployment Checklist

### Environment Variables
- [ ] All required variables set
- [ ] Secrets are secure (not in code)
- [ ] Production URLs configured

### Database
- [ ] Migrations run successfully
- [ ] Seeders run (if needed)
- [ ] Database connection tested

### File Storage
- [ ] Upload directory exists and writable
- [ ] Cloudinary configured (if using)
- [ ] File URLs accessible

### Security
- [ ] JWT secrets are strong
- [ ] CORS configured correctly
- [ ] Helmet middleware enabled
- [ ] Rate limiting configured (if needed)

---

## Known Issues / Limitations

1. **OTP Delivery:** OTP is currently logged to console. Integrate with SMS/Email gateway for production.

2. **File Storage:** Local storage is used by default. Configure Cloudinary for production.

3. **Rate Limiting:** Not implemented yet. Add rate limiting for OTP requests and login attempts.

4. **Email Verification:** Email verification is marked as true after OTP verification, but no email is sent.

5. **Image Processing:** No image compression or resizing. Consider adding for production.

---

## Next Steps

After Phase 1 verification is complete:

1. **Fix any issues found during testing**
2. **Implement Phase 2 modules:**
   - Subscription Plans
   - Portfolios
   - Chat
3. **Add rate limiting**
4. **Integrate SMS/Email gateway**
5. **Add image processing**
6. **Write automated tests**

---

## Testing Tools

### Recommended Tools:
- **Postman** - API testing
- **Thunder Client** (VS Code) - API testing
- **curl** - Command line testing
- **pgAdmin** - Database inspection

### Sample Postman Collection:
Create a Postman collection with all endpoints and save for future testing.

---

## Support

For issues or questions:
1. Check API documentation in `API-Docs/`
2. Review implementation summary in `PHASE-1-IMPLEMENTATION-SUMMARY.md`
3. Check error messages in console logs
4. Verify environment variables are set correctly
