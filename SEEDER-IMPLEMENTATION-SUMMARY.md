# Seeder Implementation Summary

**Date:** 2026-05-04  
**Status:** ✅ COMPLETE

---

## Overview

Created a comprehensive seeder for users and vendor profiles with realistic data for testing and development purposes.

---

## Files Created

1. **`seeders/20260504000001-seed-users-and-profiles.js`** - Main seeder file
2. **`SEEDER-DATA-REFERENCE.md`** - Complete reference documentation

---

## Seeded Data

### Summary
- **2 Super Admins** - Full system access
- **2 Consumers** - Regular users looking for wedding services
- **3 Vendors** - Service providers with complete business profiles

### Default Password
**All users:** `Password@123`

---

## Super Admins

| Name | Mobile | Email |
|------|--------|-------|
| Abhijit Dev | 9175113022 | abhijit.dev@yopmail.com |
| Super Admin | 9123456789 | super.admin@yopmail.com |

---

## Consumers

| Name | Mobile | Email | Gender |
|------|--------|-------|--------|
| Akshay Sharma | 8002111222 | akshay.sharma@yopmail.com | Male |
| Pranali Patil | 8002333444 | pranali.patil@yopmail.com | Female |

---

## Vendors

### 1. Rajesh Kumar - Photography
- **Mobile:** 8002444555
- **Alternates:** 9300111222, 9300222333
- **WhatsApp:** 8002444555
- **Service:** Wedding Photography
- **Specializations:** Candid, Cinematic, Pre-wedding, Drone
- **Experience:** 12 years
- **Team:** 8 members
- **Badge:** Premium
- **Trust Score:** 4.85/5.00

### 2. Priya Mehta - Makeup Artist
- **Mobile:** 8002555666
- **Alternate:** 9300333444
- **WhatsApp:** 8002555666
- **Service:** Bridal Makeup
- **Specializations:** HD, Airbrush, Party, Hair Styling
- **Experience:** 8 years
- **Team:** 4 members
- **Badge:** Premium
- **Trust Score:** 4.92/5.00

### 3. Vikram Singh - Decorator
- **Mobile:** 8002666777
- **Alternates:** 9300444555, 9300555666
- **WhatsApp:** 8002666777
- **Service:** Wedding Decoration & Event Planning
- **Specializations:** Floral, Stage, Mandap, Theme, Lighting
- **Experience:** 10 years
- **Team:** 15 members
- **Badge:** Elite
- **Trust Score:** 4.78/5.00

---

## Features

### Realistic Business Data
- Complete business information
- Professional certifications
- Industry awards
- Service areas
- Business hours
- Cancellation policies

### Contact Information
- Primary mobile numbers
- Alternate mobile numbers (1-2 per vendor)
- WhatsApp numbers (same as primary)
- Business email addresses
- Business phone numbers

### Social Media Presence
- Website URLs
- Facebook pages
- Instagram profiles
- YouTube channels
- LinkedIn profiles (for decorator)

### Professional Details
- Years of experience
- Team size
- Portfolio taglines
- Specializations (JSONB array)
- Service areas (JSONB array)
- Certifications (JSONB array with details)
- Awards (JSONB array with details)

### Verification Status
- All users are phone verified
- All users are email verified
- All vendors are verified vendors
- Different verification badge types (Premium, Elite)
- Trust scores assigned

---

## Running the Seeder

### Prerequisites
Ensure the following tables exist:
- `roles` (with super_admin, consumer, vendor roles)
- `users`
- `vendor_profiles`

### Run Seeder
```bash
npx sequelize-cli db:seed --seed 20260504000001-seed-users-and-profiles.js
```

### Expected Output
```
✅ Users and vendor profiles seeded successfully
📝 Default password for all users: Password@123

Super Admins:
  - 9175113022 (Abhijit Dev)
  - 9123456789 (Super Admin)

Consumers:
  - 8002111222 (Akshay Sharma)
  - 8002333444 (Pranali Patil)

Vendors:
  - 8002444555 (Rajesh Kumar - Photography)
  - 8002555666 (Priya Mehta - Makeup Artist)
  - 8002666777 (Vikram Singh - Decorator)
```

### Undo Seeder
```bash
npx sequelize-cli db:seed:undo --seed 20260504000001-seed-users-and-profiles.js
```

---

## Testing Scenarios

### 1. Authentication Testing
```bash
# Login as super admin
POST /api/auth/login
{
  "mobile": "9175113022",
  "password": "Password@123"
}

# Login as consumer
POST /api/auth/login
{
  "mobile": "8002111222",
  "password": "Password@123"
}

# Login as vendor
POST /api/auth/login
{
  "mobile": "8002444555",
  "password": "Password@123"
}
```

### 2. Profile Testing
```bash
# Get user profile (any user)
GET /api/profile
Authorization: Bearer <accessToken>

# Get vendor profile (vendors only)
GET /api/vendor/profile
Authorization: Bearer <vendorAccessToken>
```

### 3. Role-Based Access Testing
```bash
# Try vendor endpoint as consumer (should fail with 403)
GET /api/vendor/profile
Authorization: Bearer <consumerAccessToken>

# Try vendor endpoint as super admin (should fail with 403)
GET /api/vendor/profile
Authorization: Bearer <superAdminAccessToken>
```

### 4. Vendor Profile Update Testing
```bash
# Update vendor profile
PUT /api/vendor/profile
Authorization: Bearer <vendorAccessToken>
{
  "portfolioTagline": "New tagline",
  "teamSize": 12,
  "specializations": ["New Specialization"]
}
```

---

## Data Validation

### Mobile Numbers
- ✅ All primary mobile numbers are unique
- ✅ All alternate mobile numbers are unique
- ✅ WhatsApp numbers match primary mobile numbers
- ✅ Format: 10 digits

### Email Addresses
- ✅ All email addresses are unique
- ✅ Using yopmail.com for testing
- ✅ Format: valid email format

### Business Data
- ✅ PAN numbers follow correct format (ABCDE1234F)
- ✅ Business types are valid enums
- ✅ Establishment years are realistic
- ✅ Experience years match establishment years

### JSONB Fields
- ✅ Specializations are arrays of strings
- ✅ Service areas are arrays of strings
- ✅ Certifications are arrays of objects with name, issuedBy, year
- ✅ Awards are arrays of objects with title, issuedBy, year
- ✅ Business hours are objects with day-wise timings

### Verification
- ✅ All users have phone_verified_at timestamp
- ✅ All users have email_verified_at timestamp
- ✅ All vendors have verified_at timestamp
- ✅ Verification badge types are valid enums
- ✅ Trust scores are within range (0.00 - 5.00)

---

## Service Differentiation

Each vendor has unique:
- **Service Type:** Photography, Makeup, Decoration
- **Specializations:** Different skill sets
- **Service Areas:** Different coverage areas
- **Team Size:** Appropriate for service type
- **Experience:** Varied years of experience
- **Certifications:** Relevant to their field
- **Awards:** Industry-specific recognition
- **Business Hours:** Realistic for their business
- **Cancellation Policies:** Different terms
- **Advance Booking:** Different minimum days

---

## Benefits for Testing

1. **Complete User Roles:** Test all user types (super admin, consumer, vendor)
2. **Realistic Data:** Professional business information for realistic testing
3. **Different Services:** Test service-specific features
4. **Verification Status:** Test verified vs unverified scenarios
5. **Contact Information:** Test communication features
6. **Social Media:** Test social media integration
7. **Business Policies:** Test policy-related features
8. **Trust Scores:** Test rating and review features

---

## Notes

1. **Password Security:** All passwords are hashed using bcrypt with 10 salt rounds
2. **Timestamps:** All records have proper created_at and updated_at timestamps
3. **Verification:** All users are pre-verified for easier testing
4. **Vendor Profiles:** Auto-created with detailed information
5. **JSONB Data:** Properly formatted JSON for PostgreSQL JSONB columns
6. **Unique Constraints:** All unique fields (mobile, email, alternate mobiles) are validated
7. **Foreign Keys:** Proper relationships between users and vendor_profiles

---

## Future Enhancements

1. **More Vendors:** Add vendors for other services (venues, catering, DJ, etc.)
2. **More Consumers:** Add more consumer accounts for testing
3. **Admin Roles:** Add other admin roles (admin, marketing, seo, accountant)
4. **Portfolios:** Add portfolio data for vendors
5. **Reviews:** Add review data for vendors
6. **Subscriptions:** Add subscription data for vendors
7. **Chat Rooms:** Add chat room data between consumers and vendors

---

## Troubleshooting

### Seeder Fails
- Ensure roles table is seeded first
- Check if users table exists
- Check if vendor_profiles table exists
- Verify database connection

### Duplicate Key Errors
- Run undo seeder first
- Check for existing users with same mobile/email
- Verify unique constraints on tables

### Foreign Key Errors
- Ensure roles exist before running seeder
- Check role slugs match (super_admin, consumer, vendor)
- Verify foreign key constraints are properly set

---

## Summary

Successfully created a comprehensive seeder with:
- ✅ 7 users (2 super admins, 2 consumers, 3 vendors)
- ✅ 3 vendor profiles with complete business information
- ✅ Realistic data for all fields
- ✅ Different services for each vendor
- ✅ Proper verification status
- ✅ Complete contact information
- ✅ Professional certifications and awards
- ✅ Business policies and hours
- ✅ Social media presence
- ✅ Trust scores and verification badges

The seeder is ready to use for development and testing purposes!
