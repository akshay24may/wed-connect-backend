# Authentication Module - Testing Checklist

## Pre-Testing Setup

### 1. Database Setup
- [ ] PostgreSQL is running
- [ ] Database created: `wedconnect_database`
- [ ] Run migrations: `npx sequelize-cli db:migrate`
- [ ] Run seeders (if any): `npx sequelize-cli db:seed:all`
- [ ] Verify tables exist: `roles`, `users`, `user_sessions`, `otp_verifications`

### 2. Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `DATABASE_URL` with correct credentials
- [ ] Set `JWT_SECRET` (use a strong random string)
- [ ] Set `JWT_REFRESH_SECRET` (use a different strong random string)
- [ ] Set `PORT` (default: 5000)
- [ ] Set `NODE_ENV=development`

### 3. Dependencies
- [ ] Run `npm install` to ensure all packages are installed
- [ ] Verify `bcrypt`, `jsonwebtoken`, `sequelize`, `pg` are installed

### 4. Start Server
```bash
npm run dev
```

Expected output:
```
✅ WedConnect Server Started
🌐 HTTP Server: http://localhost:5000
🔌 Socket.IO: ws://localhost:5000
🌍 Environment: development
⏰ Started at: [timestamp]
```

---

## Testing Scenarios

### Scenario 1: User Registration (Vendor)

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "mobile": "9175113022",
  "fullName": "John Doe",
  "password": "SecurePass123",
  "roleSlug": "vendor",
  "email": "john@example.com"
}
```

**Expected Response (201):**
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
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Checklist:**
- [ ] Status code is 201
- [ ] Response contains user object
- [ ] Response contains accessToken and refreshToken
- [ ] User is created in database
- [ ] Password is hashed (not plain text)
- [ ] Session is created in user_sessions table

---

### Scenario 2: User Registration (Consumer)

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "mobile": "9876543210",
  "fullName": "Jane Smith",
  "password": "SecurePass456",
  "roleSlug": "consumer"
}
```

**Expected Response (201):**
- [ ] Status code is 201
- [ ] User created with consumer role
- [ ] Email is optional (null in database)

---

### Scenario 3: Duplicate Registration

**Endpoint:** `POST /api/auth/register`

**Request:** (Use same mobile as Scenario 1)
```json
{
  "mobile": "9175113022",
  "fullName": "Duplicate User",
  "password": "SecurePass123",
  "roleSlug": "vendor"
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "code": "REGISTRATION_FAILED",
  "message": "User already exists"
}
```

**Checklist:**
- [ ] Status code is 400
- [ ] Error message indicates user exists
- [ ] No duplicate user created in database

---

### Scenario 4: Login with Valid Credentials

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "mobile": "9175113022",
  "password": "SecurePass123"
}
```

**Expected Response (200):**
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
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Checklist:**
- [ ] Status code is 200
- [ ] Response contains user object
- [ ] Response contains new tokens
- [ ] last_login_at updated in database
- [ ] New session created in user_sessions table

---

### Scenario 5: Login with Invalid Credentials

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "mobile": "9175113022",
  "password": "WrongPassword"
}
```

**Expected Response (401):**
```json
{
  "success": false,
  "code": "UNAUTHORIZED",
  "message": "Invalid email or password"
}
```

**Checklist:**
- [ ] Status code is 401
- [ ] Error message indicates invalid credentials
- [ ] No session created

---

### Scenario 6: Request OTP for Login

**Endpoint:** `POST /api/auth/otp/request`

**Request:**
```json
{
  "mobile": "9175113022",
  "type": "login"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "OTP sent successfully",
  "data": {
    "otpId": "1",
    "expiresAt": "2026-05-03T10:30:00Z"
  }
}
```

**Console Output:**
```
OTP for 9175113022: 123456
```

**Checklist:**
- [ ] Status code is 200
- [ ] Response contains otpId
- [ ] OTP logged to console
- [ ] OTP record created in otp_verifications table
- [ ] OTP expires in 10 minutes
- [ ] Save otpId and OTP for next test

---

### Scenario 7: Verify OTP

**Endpoint:** `POST /api/auth/otp/verify`

**Request:** (Use otpId and OTP from Scenario 6)
```json
{
  "mobile": "9175113022",
  "otp": "123456",
  "otpId": "1"
}
```

**Expected Response (200):**
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
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Checklist:**
- [ ] Status code is 200
- [ ] Response contains user and tokens
- [ ] is_phone_verified set to true in database
- [ ] phone_verified_at timestamp set
- [ ] OTP marked as verified in database
- [ ] New session created

---

### Scenario 8: Verify Invalid OTP

**Endpoint:** `POST /api/auth/otp/verify`

**Request:**
```json
{
  "mobile": "9175113022",
  "otp": "999999",
  "otpId": "1"
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Invalid OTP"
}
```

**Checklist:**
- [ ] Status code is 400
- [ ] Error message indicates invalid OTP
- [ ] Attempts counter incremented in database

---

### Scenario 9: Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Request:** (Use refreshToken from login)
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Checklist:**
- [ ] Status code is 200
- [ ] New access and refresh tokens returned
- [ ] Old refresh token invalidated in database
- [ ] New session created with new refresh token

---

### Scenario 10: Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Logged out successfully",
  "data": null
}
```

**Checklist:**
- [ ] Status code is 200
- [ ] Session marked as inactive in database
- [ ] If no refreshToken provided, all user sessions invalidated

---

### Scenario 11: Request Password Reset

**Endpoint:** `POST /api/auth/password/reset-request`

**Request:**
```json
{
  "mobile": "9175113022"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Password reset OTP sent successfully",
  "data": {
    "otpId": "2"
  }
}
```

**Console Output:**
```
Password Reset OTP for 9175113022: 654321
```

**Checklist:**
- [ ] Status code is 200
- [ ] OTP logged to console
- [ ] OTP record created with type 'password_reset'
- [ ] Save otpId and OTP for next test

---

### Scenario 12: Reset Password

**Endpoint:** `POST /api/auth/password/reset`

**Request:** (Use otpId and OTP from Scenario 11)
```json
{
  "mobile": "9175113022",
  "otp": "654321",
  "otpId": "2",
  "newPassword": "NewSecurePass789"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Password reset successfully",
  "data": null
}
```

**Checklist:**
- [ ] Status code is 200
- [ ] Password updated in database (hashed)
- [ ] All user sessions invalidated
- [ ] OTP marked as verified
- [ ] Can login with new password

---

### Scenario 13: Login with New Password

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "mobile": "9175113022",
  "password": "NewSecurePass789"
}
```

**Expected Response (200):**
- [ ] Login successful with new password
- [ ] Old password no longer works

---

### Scenario 14: Protected Route Access

**Test with middleware:**

Create a test route in `src/routes/auth/authRoutes.js`:
```javascript
router.get('/test-protected', authenticate, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});
```

**Request without token:**
```
GET /api/auth/test-protected
```

**Expected Response (401):**
```json
{
  "success": false,
  "code": "UNAUTHORIZED",
  "message": "Unauthorized access"
}
```

**Request with valid token:**
```
GET /api/auth/test-protected
Authorization: Bearer <accessToken>
```

**Expected Response (200):**
```json
{
  "message": "Protected route accessed",
  "user": {
    "userId": 1,
    "roleId": 3,
    "roleSlug": "vendor",
    "mobile": "9175113022",
    "email": "john@example.com"
  }
}
```

**Checklist:**
- [ ] Without token: 401 Unauthorized
- [ ] With valid token: 200 OK
- [ ] req.user populated with JWT payload

---

## Database Verification

After testing, verify database state:

### Check Users Table
```sql
SELECT id, full_name, mobile, email, role_id, is_phone_verified, is_email_verified, last_login_at 
FROM users;
```

**Verify:**
- [ ] Users created with correct data
- [ ] Passwords are hashed (not plain text)
- [ ] last_login_at updated on login
- [ ] is_phone_verified updated after OTP verification

### Check User Sessions Table
```sql
SELECT id, user_id, is_active, expires_at, created_at 
FROM user_sessions 
ORDER BY created_at DESC;
```

**Verify:**
- [ ] Sessions created on login/register
- [ ] Old sessions invalidated on logout
- [ ] All sessions invalidated on password reset

### Check OTP Verifications Table
```sql
SELECT id, mobile, otp, type, is_verified, attempts, expires_at, created_at 
FROM otp_verifications 
ORDER BY created_at DESC;
```

**Verify:**
- [ ] OTP records created
- [ ] Correct type (login, signup, password_reset)
- [ ] is_verified updated after successful verification
- [ ] attempts incremented on failed verification

---

## Common Issues & Solutions

### Issue: "Database connection failed"
**Solution:** 
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Check database exists

### Issue: "JWT_SECRET is not defined"
**Solution:**
- Ensure .env file exists
- Set JWT_SECRET and JWT_REFRESH_SECRET

### Issue: "User not found" on login
**Solution:**
- Verify user was created in database
- Check mobile number format (no spaces or special characters)

### Issue: "Invalid OTP"
**Solution:**
- Check console for actual OTP code
- Verify OTP hasn't expired (10 minutes)
- Check attempts counter (max 5)

### Issue: "Token expired"
**Solution:**
- Use refresh token endpoint to get new access token
- Check token expiry settings in .env

---

## Success Criteria

✅ All 14 test scenarios pass
✅ Database records created correctly
✅ Passwords are hashed
✅ Tokens are valid and verifiable
✅ Sessions are managed properly
✅ OTP system works end-to-end
✅ Error handling works as expected
✅ Middleware protects routes correctly

---

**Next Steps After Testing:**
1. Document any issues found
2. Fix any failing tests
3. Proceed to User Profile Module
4. Integrate with frontend

**Status:** Ready for Testing
