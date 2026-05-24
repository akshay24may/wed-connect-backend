# Quick Login Reference

**Default Password for All Users:** `Password@123`

---

## 🔐 Login Credentials

### Super Admins

```json
// Abhijit Dev
{
  "mobile": "9175113022",
  "password": "Password@123"
}

// Super Admin
{
  "mobile": "9123456789",
  "password": "Password@123"
}
```

---

### Consumers

```json
// Akshay Sharma (Male)
{
  "mobile": "8002111222",
  "password": "Password@123"
}

// Pranali Patil (Female)
{
  "mobile": "8002333444",
  "password": "Password@123"
}
```

---

### Vendors

```json
// Rajesh Kumar - Photography
{
  "mobile": "8002444555",
  "password": "Password@123"
}

// Priya Mehta - Makeup Artist
{
  "mobile": "8002555666",
  "password": "Password@123"
}

// Vikram Singh - Decorator
{
  "mobile": "8002666777",
  "password": "Password@123"
}
```

---

## 📱 Quick Contact Reference

| Name | Mobile | WhatsApp | Alternate 1 | Alternate 2 |
|------|--------|----------|-------------|-------------|
| Rajesh Kumar | 8002444555 | 8002444555 | 9300111222 | 9300222333 |
| Priya Mehta | 8002555666 | 8002555666 | 9300333444 | - |
| Vikram Singh | 8002666777 | 8002666777 | 9300444555 | 9300555666 |

---

## 🎯 Service Types

| Vendor | Service | Badge | Trust Score |
|--------|---------|-------|-------------|
| Rajesh Kumar | Photography | Premium | 4.85 |
| Priya Mehta | Makeup Artist | Premium | 4.92 |
| Vikram Singh | Decorator | Elite | 4.78 |

---

## 🚀 Quick Test Commands

### Run Seeder
```bash
npx sequelize-cli db:seed --seed 20260504000001-seed-users-and-profiles.js
```

### Login Test
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"mobile":"8002444555","password":"Password@123"}'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Vendor Profile
```bash
curl -X GET http://localhost:5000/api/vendor/profile \
  -H "Authorization: Bearer YOUR_VENDOR_ACCESS_TOKEN"
```

---

## 📧 Email Addresses

| User | Email |
|------|-------|
| Abhijit Dev | abhijit.dev@yopmail.com |
| Super Admin | super.admin@yopmail.com |
| Akshay Sharma | akshay.sharma@yopmail.com |
| Pranali Patil | pranali.patil@yopmail.com |
| Rajesh Kumar | rajesh.kumar@yopmail.com |
| Priya Mehta | priya.mehta@yopmail.com |
| Vikram Singh | vikram.singh@yopmail.com |

---

## 🔑 Role-Based Access

### Super Admin Can Access:
- ✅ `/api/profile` - User profile
- ✅ `/api/panel/*` - Admin panel (future)
- ❌ `/api/vendor/profile` - Vendor profile (403 Forbidden)
- ❌ `/api/consumer/*` - Consumer routes (403 Forbidden)

### Consumer Can Access:
- ✅ `/api/profile` - User profile
- ✅ `/api/consumer/*` - Consumer routes (future)
- ❌ `/api/vendor/profile` - Vendor profile (403 Forbidden)
- ❌ `/api/panel/*` - Admin panel (403 Forbidden)

### Vendor Can Access:
- ✅ `/api/profile` - User profile
- ✅ `/api/vendor/profile` - Vendor profile
- ✅ `/api/vendor/*` - Vendor routes (future)
- ❌ `/api/consumer/*` - Consumer routes (403 Forbidden)
- ❌ `/api/panel/*` - Admin panel (403 Forbidden)

---

## 💡 Testing Tips

1. **Login First:** Always login to get access token
2. **Save Token:** Store access token for subsequent requests
3. **Check Role:** Verify you're using correct role for endpoint
4. **Test Errors:** Try accessing restricted endpoints to test authorization
5. **Refresh Token:** Use refresh token when access token expires

---

## 📝 Notes

- All users are pre-verified (phone & email)
- All vendors have complete business profiles
- All passwords are hashed with bcrypt
- WhatsApp numbers match primary mobile numbers
- Alternate mobile numbers are unique across all vendors
