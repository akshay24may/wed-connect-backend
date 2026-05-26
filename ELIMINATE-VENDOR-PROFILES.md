# Eliminate vendor_profiles Table - Final Decision

## Key Insight

**PAN and GST numbers are different per business** → All business-specific data belongs in `portfolios` table.

Only 4 vendor-specific columns remain:
- `is_verified_vendor`
- `verified_at`
- `verification_badge_type`
- `trust_score`

**Decision**: Move these 4 columns to `users` table and **eliminate `vendor_profiles` table entirely**.

---

## Final Table Structure

### `users` table (Enhanced)

Add vendor-specific columns:

```sql
-- Existing users table columns
id, full_name, email, mobile, country_code
password_hash, role_id
dob, gender, about
profile_photo, avatar_photo, photos_storage_type
address, city_id, state_id, country_name, pincode
is_active, is_phone_verified, is_email_verified
kyc_status, is_verified
referral_code, referred_by, referral_count
created_at, updated_at, deleted_at

-- ADD: Vendor Verification (NEW - 4 columns)
is_verified_vendor BOOLEAN DEFAULT false
verified_at TIMESTAMP
verification_badge_type ENUM('basic', 'premium', 'elite')
trust_score DECIMAL(3,2) DEFAULT 0.00
```

### `portfolios` table (Enhanced)

Add ALL business-specific data:

```sql
-- Identity
id, user_id, category_id, user_subscription_id
title, slug, share_code, description

-- Business Identity (NEW)
business_name VARCHAR(200) NOT NULL
business_tagline VARCHAR(500)
business_logo VARCHAR(500)
business_logo_storage_type ENUM(...)
business_email VARCHAR(150)
business_phone VARCHAR(15)

-- Business Registration (NEW - per business)
business_pan VARCHAR(10)
gstin VARCHAR(15)
business_registration_number VARCHAR(50)
business_type ENUM('proprietorship', 'partnership', 'pvt_ltd', 'llp', 'other')
establishment_year SMALLINT

-- Identity Documents (NEW - per business)
name_on_id VARCHAR(150)
aadhar_number VARCHAR(12)
pan_number VARCHAR(10)

-- Contact (NEW - business-specific)
alternate_mobile_one VARCHAR(15)
alternate_mobile_two VARCHAR(15)
whatsapp_mobile VARCHAR(15)

-- Pricing (UPDATED)
price_range_min DECIMAL(15,2) NOT NULL
price_range_max DECIMAL(15,2)
price_on_request BOOLEAN DEFAULT false
price_breakdown JSONB
pricing_model JSONB

-- Commercial Terms (NEW)
payment_terms TEXT
advance_percentage INTEGER
travel_cost_terms TEXT
delivery_timeline VARCHAR(100)

-- Services & Coverage (NEW)
services_offered JSONB
coverage_cities JSONB
open_to_destination_wedding BOOLEAN DEFAULT false

-- Cancellation Policies (NEW)
cancellation_policy_user ENUM('partial_refund', 'no_refund', 'no_refund_date_adjust', 'full_refund')
cancellation_policy_vendor ENUM('partial_refund', 'no_refund', 'full_refund')
cancellation_terms TEXT

-- Style & USP (NEW)
style_usp TEXT
working_style TEXT
decor_policy ENUM('in_house_external_allowed', 'no_in_house_external_allowed', 'only_in_house')

-- Team Information (NEW)
team_description TEXT
team_size INTEGER

-- Experience (NEW - per business)
years_of_experience SMALLINT
weddings_completed INTEGER DEFAULT 0
happy_clients_count INTEGER DEFAULT 0

-- Business Hours (NEW)
business_hours JSONB

-- Certifications & Awards (NEW)
certifications JSONB
awards JSONB

-- Social Links (NEW - business-specific)
portfolio_website VARCHAR(255)
portfolio_facebook VARCHAR(255)
portfolio_instagram VARCHAR(255)
portfolio_youtube VARCHAR(255)

-- Booking Settings (NEW)
accepts_advance_booking BOOLEAN DEFAULT true
min_advance_booking_days SMALLINT DEFAULT 7

-- Location
state_id, city_id, address

-- Status & Workflow
status, published_at, approved_at, rejected_at
is_auto_approved

-- Visibility Features
is_featured, featured_until
is_boosted, boosted_until
is_recommended, recommended_at

-- Engagement
view_count, contact_count, total_favorites

-- Rating
average_rating, total_reviews, rating_distribution

-- Media
cover_image, cover_image_storage_type

-- Republish
republish_count, last_republished_at, republish_history

-- Additional
service_details, offerings, internal_notes

-- Audit
created_by, updated_by, deleted_by
created_at, updated_at, deleted_at
```

---

## Migration Plan

### Step 1: Add vendor columns to `users` table

```sql
-- Add vendor verification columns to users table
ALTER TABLE users ADD COLUMN is_verified_vendor BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN verified_at TIMESTAMP;
ALTER TABLE users ADD COLUMN verification_badge_type ENUM('basic', 'premium', 'elite');
ALTER TABLE users ADD COLUMN trust_score DECIMAL(3,2) DEFAULT 0.00;

-- Add indexes
CREATE INDEX idx_users_is_verified_vendor ON users(is_verified_vendor);
CREATE INDEX idx_users_verification_badge_type ON users(verification_badge_type);
CREATE INDEX idx_users_trust_score ON users(trust_score);

-- Add comments
COMMENT ON COLUMN users.is_verified_vendor IS 'Whether vendor is verified by platform';
COMMENT ON COLUMN users.verified_at IS 'Timestamp when vendor was verified';
COMMENT ON COLUMN users.verification_badge_type IS 'Type of verification badge';
COMMENT ON COLUMN users.trust_score IS 'Vendor trust score (0.00 to 5.00)';
```

### Step 2: Migrate data from `vendor_profiles` to `users`

```sql
-- Copy verification data from vendor_profiles to users
UPDATE users u
SET 
  is_verified_vendor = vp.is_verified_vendor,
  verified_at = vp.verified_at,
  verification_badge_type = vp.verification_badge_type,
  trust_score = vp.trust_score
FROM vendor_profiles vp
WHERE u.id = vp.user_id;
```

### Step 3: Add business columns to `portfolios` table

```sql
-- Business Identity
ALTER TABLE portfolios ADD COLUMN business_name VARCHAR(200) NOT NULL DEFAULT 'Business Name';
ALTER TABLE portfolios ADD COLUMN business_tagline VARCHAR(500);
ALTER TABLE portfolios ADD COLUMN business_logo VARCHAR(500);
ALTER TABLE portfolios ADD COLUMN business_logo_storage_type ENUM(...);
ALTER TABLE portfolios ADD COLUMN business_email VARCHAR(150);
ALTER TABLE portfolios ADD COLUMN business_phone VARCHAR(15);

-- Business Registration
ALTER TABLE portfolios ADD COLUMN business_pan VARCHAR(10);
ALTER TABLE portfolios ADD COLUMN gstin VARCHAR(15);
ALTER TABLE portfolios ADD COLUMN business_registration_number VARCHAR(50);
ALTER TABLE portfolios ADD COLUMN business_type ENUM('proprietorship', 'partnership', 'pvt_ltd', 'llp', 'other');
ALTER TABLE portfolios ADD COLUMN establishment_year SMALLINT;

-- Identity Documents
ALTER TABLE portfolios ADD COLUMN name_on_id VARCHAR(150);
ALTER TABLE portfolios ADD COLUMN aadhar_number VARCHAR(12);
ALTER TABLE portfolios ADD COLUMN pan_number VARCHAR(10);

-- Contact
ALTER TABLE portfolios ADD COLUMN alternate_mobile_one VARCHAR(15);
ALTER TABLE portfolios ADD COLUMN alternate_mobile_two VARCHAR(15);
ALTER TABLE portfolios ADD COLUMN whatsapp_mobile VARCHAR(15);

-- Pricing Updates
ALTER TABLE portfolios DROP COLUMN starting_price;
ALTER TABLE portfolios MODIFY price_range_min DECIMAL(15,2) NOT NULL;
ALTER TABLE portfolios ADD COLUMN price_breakdown JSONB;
ALTER TABLE portfolios ADD COLUMN pricing_model JSONB;

-- Commercial Terms
ALTER TABLE portfolios ADD COLUMN payment_terms TEXT;
ALTER TABLE portfolios ADD COLUMN advance_percentage INTEGER;
ALTER TABLE portfolios ADD COLUMN travel_cost_terms TEXT;
ALTER TABLE portfolios ADD COLUMN delivery_timeline VARCHAR(100);

-- Services & Coverage
ALTER TABLE portfolios ADD COLUMN services_offered JSONB;
ALTER TABLE portfolios ADD COLUMN coverage_cities JSONB;
ALTER TABLE portfolios ADD COLUMN open_to_destination_wedding BOOLEAN DEFAULT false;

-- Cancellation Policies
ALTER TABLE portfolios ADD COLUMN cancellation_policy_user ENUM('partial_refund', 'no_refund', 'no_refund_date_adjust', 'full_refund');
ALTER TABLE portfolios ADD COLUMN cancellation_policy_vendor ENUM('partial_refund', 'no_refund', 'full_refund');
ALTER TABLE portfolios ADD COLUMN cancellation_terms TEXT;

-- Style & USP
ALTER TABLE portfolios ADD COLUMN style_usp TEXT;
ALTER TABLE portfolios ADD COLUMN working_style TEXT;
ALTER TABLE portfolios ADD COLUMN decor_policy ENUM('in_house_external_allowed', 'no_in_house_external_allowed', 'only_in_house');

-- Team Information
ALTER TABLE portfolios ADD COLUMN team_description TEXT;
ALTER TABLE portfolios ADD COLUMN team_size INTEGER;

-- Experience
ALTER TABLE portfolios ADD COLUMN years_of_experience SMALLINT;
ALTER TABLE portfolios ADD COLUMN weddings_completed INTEGER DEFAULT 0;
ALTER TABLE portfolios ADD COLUMN happy_clients_count INTEGER DEFAULT 0;

-- Business Hours
ALTER TABLE portfolios ADD COLUMN business_hours JSONB;

-- Certifications & Awards
ALTER TABLE portfolios ADD COLUMN certifications JSONB;
ALTER TABLE portfolios ADD COLUMN awards JSONB;

-- Social Links
ALTER TABLE portfolios ADD COLUMN portfolio_website VARCHAR(255);
ALTER TABLE portfolios ADD COLUMN portfolio_facebook VARCHAR(255);
ALTER TABLE portfolios ADD COLUMN portfolio_instagram VARCHAR(255);
ALTER TABLE portfolios ADD COLUMN portfolio_youtube VARCHAR(255);

-- Booking Settings
ALTER TABLE portfolios ADD COLUMN accepts_advance_booking BOOLEAN DEFAULT true;
ALTER TABLE portfolios ADD COLUMN min_advance_booking_days SMALLINT DEFAULT 7;

-- Additional
ALTER TABLE portfolios ADD COLUMN offerings TEXT;

-- Add indexes
CREATE INDEX idx_portfolios_business_name ON portfolios(business_name);
CREATE INDEX idx_portfolios_business_pan ON portfolios(business_pan);
CREATE INDEX idx_portfolios_gstin ON portfolios(gstin);
CREATE INDEX idx_portfolios_business_phone ON portfolios(business_phone);
CREATE INDEX idx_portfolios_whatsapp_mobile ON portfolios(whatsapp_mobile);
```

### Step 4: Migrate data from `vendor_profiles` to `portfolios`

```sql
-- For each portfolio, copy data from vendor_profiles
-- This is a one-time migration - admin will need to update per portfolio later
UPDATE portfolios p
SET 
  business_name = vp.business_name,
  business_logo = vp.business_logo,
  business_logo_storage_type = vp.business_media_storage_type,
  business_pan = vp.business_pan,
  gstin = vp.gstin,
  business_registration_number = vp.business_registration_number,
  business_type = vp.business_type,
  establishment_year = vp.establishment_year,
  name_on_id = vp.name_on_id,
  aadhar_number = vp.aadhar_number,
  pan_number = vp.pan_number,
  alternate_mobile_one = vp.alternate_mobile_one,
  alternate_mobile_two = vp.alternate_mobile_two,
  whatsapp_mobile = vp.whatsapp_mobile,
  team_size = vp.team_size,
  years_of_experience = vp.years_of_experience,
  business_hours = vp.business_hours,
  certifications = vp.certifications,
  awards = vp.awards,
  portfolio_website = vp.website_url,
  portfolio_facebook = vp.facebook_url,
  portfolio_instagram = vp.instagram_url,
  portfolio_youtube = vp.youtube_url,
  accepts_advance_booking = vp.accepts_advance_booking,
  min_advance_booking_days = vp.min_advance_booking_days,
  cancellation_terms = vp.cancellation_policy
FROM vendor_profiles vp
WHERE p.user_id = vp.user_id;
```

### Step 5: Drop `vendor_profiles` table

```sql
-- Drop foreign key constraints referencing vendor_profiles (if any)
-- Then drop the table
DROP TABLE IF EXISTS vendor_profiles;
```

### Step 6: Update models and code

1. Remove `VendorProfile` model
2. Update `User` model with new vendor columns
3. Update `Portfolio` model with new business columns
4. Update all services/repositories/controllers that reference vendor_profiles

---

## Benefits

### ✅ Simplified Architecture

**Before:**
```
users → vendor_profiles → portfolios
```

**After:**
```
users → portfolios
```

### ✅ No Redundant Table

- No separate table for just 4 columns
- Vendor verification in users table (where it belongs)
- All business data in portfolios table (where it belongs)

### ✅ Flexibility

- Each portfolio is a complete business entity
- Different PAN/GST per business
- Different contact numbers per business
- Different social links per business

### ✅ Cleaner Data Model

- Two tables instead of three
- Clear separation: user info vs business info
- No confusion about where data belongs

---

## Example: Multi-Business User

### User: Abhijit Kumar

**users table:**
```json
{
  "id": 123,
  "full_name": "Abhijit Kumar",
  "email": "abhijit@example.com",
  "mobile": "+91 9876543210",
  "role_id": 3,  // vendor role
  "is_verified_vendor": true,
  "verified_at": "2024-01-15",
  "verification_badge_type": "premium",
  "trust_score": 4.85
}
```

**portfolios table - Portfolio 1:**
```json
{
  "id": 456,
  "user_id": 123,
  "category": "Photography",
  "business_name": "Abhijit's Photography",
  "business_pan": "ABCDE1234F",
  "gstin": "07ABCDE1234F1Z5",
  "business_phone": "+91 9876543211",
  "whatsapp_mobile": "+91 9876543211",
  "portfolio_instagram": "@abhijitsphotography",
  "price_range_min": 50000,
  "price_range_max": 200000,
  "team_size": 5,
  "years_of_experience": 8
}
```

**portfolios table - Portfolio 2:**
```json
{
  "id": 789,
  "user_id": 123,
  "category": "Catering",
  "business_name": "Abhijit Catering Services",
  "business_pan": "FGHIJ5678K",  // Different PAN
  "gstin": "07FGHIJ5678K1Z5",    // Different GST
  "business_phone": "+91 9876543212",  // Different phone
  "whatsapp_mobile": "+91 9876543212",
  "portfolio_facebook": "abhijitcatering",
  "price_range_min": 350,
  "price_range_max": 800,
  "team_size": 20,
  "years_of_experience": 5  // Different experience
}
```

---

## Summary

### Decision: ELIMINATE vendor_profiles table ✅

**Move to users table:**
- `is_verified_vendor`
- `verified_at`
- `verification_badge_type`
- `trust_score`

**Move to portfolios table:**
- ALL business-specific data
- Business registration (PAN, GST, etc.)
- Contact details (phones, WhatsApp)
- Social links
- Team info
- Experience
- Everything else

### Final Architecture:

```
users (personal + vendor verification)
  ↓ (1:many)
portfolios (complete business entity)
  ↓ (1:many)
portfolio_albums
  ↓ (1:many)
portfolio_media
```

### Files to Update:

1. ✅ Migration: Add columns to users
2. ✅ Migration: Add columns to portfolios
3. ✅ Migration: Migrate data from vendor_profiles
4. ✅ Migration: Drop vendor_profiles table
5. ✅ Model: Update User model
6. ✅ Model: Update Portfolio model
7. ❌ Model: Delete VendorProfile model
8. ✅ Services/Repositories: Update all references

**Ready to create the migrations?**
