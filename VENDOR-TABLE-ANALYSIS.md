# Vendor Table Analysis & Recommendation

## Current Structure

### We Have:

1. **`users` table** - All users (vendors + consumers)
   - Personal info: name, email, phone, address
   - Role-based (role_id)
   - Profile photo, about
   - Location (city, state)

2. **`vendor_profiles` table** - Vendor-specific info (1:1 with users)
   - Business name, PAN, GSTIN
   - Business type, establishment year
   - Contact details (alternate phones, WhatsApp)
   - Business logo, banner
   - Years of experience, team size
   - Social links (website, Facebook, Instagram, YouTube)
   - Verification status, trust score
   - Cancellation policy
   - Service areas, specializations

3. **`portfolios` table** - Portfolio/listings
   - Linked to user_id
   - Category-specific
   - One subscription = One portfolio

---

## Problem Analysis

### Current Issues with `vendor_profiles`:

**❌ Business-specific data in vendor_profiles:**
- `business_name` - Should be per portfolio (different businesses)
- `business_logo`, `business_banner` - Should be per portfolio
- `portfolio_tagline` - Should be per portfolio
- `team_size` - Should be per portfolio (different teams)
- `specializations` - Should be per portfolio (category-specific)
- `service_areas` - Should be per portfolio
- `cancellation_policy` - Should be per portfolio
- Social links - Should be per portfolio (different business accounts)

**✅ Should stay in vendor_profiles:**
- Personal verification: Aadhar, PAN (personal)
- Business registration: GSTIN, business type (if same across all)
- Overall experience: years_of_experience (total)
- Verification status: is_verified_vendor, trust_score
- Contact: alternate phones, WhatsApp (personal)

---

## Recommendation: NO Separate Vendor Table

### Why NOT create a separate vendor table?

**Current structure is correct:**
```
users (all users)
  ↓
vendor_profiles (vendor-specific personal/legal info)
  ↓
portfolios (business-specific info)
```

**Reasons:**
1. ✅ **Clear separation**: users → vendor_profiles → portfolios
2. ✅ **Role-based**: users.role_id determines if vendor or consumer
3. ✅ **One-to-one**: vendor_profiles has 1:1 relationship with users
4. ✅ **Scalable**: Can add consumer_profiles later if needed

---

## Proposed Solution: Refactor Existing Tables

### 1. Keep `users` table as-is
**Purpose**: All users (vendors + consumers)
**Contains**: Personal info, authentication, role

### 2. Refactor `vendor_profiles` table
**Purpose**: Vendor's personal/legal information (NOT business-specific)

**Keep (Personal/Legal):**
```sql
-- Identity Verification
name_on_id VARCHAR(150)
aadhar_number VARCHAR(12)
pan_number VARCHAR(10)

-- Business Registration (if same across all portfolios)
business_pan VARCHAR(10)
gstin VARCHAR(15)
business_registration_number VARCHAR(50)
business_type ENUM(...)
establishment_year SMALLINT

-- Contact (Personal)
alternate_mobile_one VARCHAR(15)
alternate_mobile_two VARCHAR(15)
whatsapp_mobile VARCHAR(15)

-- Overall Experience (Across all categories)
years_of_experience SMALLINT
total_weddings_completed INTEGER DEFAULT 0
total_happy_clients INTEGER DEFAULT 0

-- Verification
is_verified_vendor BOOLEAN DEFAULT false
verified_at TIMESTAMP
verification_badge_type ENUM('basic', 'premium', 'elite')
trust_score DECIMAL(3,2) DEFAULT 0.00
is_background_checked BOOLEAN DEFAULT false
background_check_date DATE

-- Personal Social (Optional)
personal_website VARCHAR(255)
personal_linkedin VARCHAR(255)

-- Settings
accepts_advance_booking BOOLEAN DEFAULT true
min_advance_booking_days SMALLINT DEFAULT 7
```

**Remove (Move to portfolios):**
```sql
-- ❌ Remove from vendor_profiles
business_name  → portfolios.business_name
business_logo  → portfolios.business_logo
business_banner  → portfolios.business_banner
business_media_storage_type  → portfolios.business_logo_storage_type
team_size  → portfolios.team_size
portfolio_tagline  → portfolios.business_tagline
specializations  → portfolios.services_offered
service_areas  → portfolios.coverage_cities
certifications  → portfolios (JSONB)
awards  → portfolios (JSONB) or vendor_badges
business_email  → portfolios.business_email
business_phone  → portfolios.business_phone
website_url  → portfolios.portfolio_website
facebook_url  → portfolios.portfolio_facebook
instagram_url  → portfolios.portfolio_instagram
youtube_url  → portfolios.portfolio_youtube
business_hours  → portfolios.business_hours
cancellation_policy  → portfolios.cancellation_terms
```

### 3. Enhance `portfolios` table
**Purpose**: Business-specific information per portfolio

**Add all business-related fields** (as per PORTFOLIO-LEVEL-BUSINESS-DETAILS.md)

---

## Final Table Structure

### `users` (All Users)
```sql
-- Personal Identity
id, full_name, email, mobile, country_code
dob, gender, about
profile_photo, avatar_photo, photos_storage_type

-- Location
address, city_id, state_id, country_name, pincode

-- Authentication & Role
password_hash, role_id
is_active, is_phone_verified, is_email_verified

-- Verification
kyc_status, is_verified

-- Referral
referral_code, referred_by, referral_count

-- Audit
created_at, updated_at, deleted_at
```

### `vendor_profiles` (Vendor Personal/Legal Info)
```sql
-- Identity Verification
user_id (FK → users, UNIQUE)
name_on_id, aadhar_number, pan_number

-- Business Registration (if common across portfolios)
business_pan, gstin, business_registration_number
business_type, establishment_year

-- Contact (Personal)
alternate_mobile_one, alternate_mobile_two, whatsapp_mobile

-- Overall Experience
years_of_experience
total_weddings_completed
total_happy_clients

-- Verification
is_verified_vendor, verified_at
verification_badge_type, trust_score
is_background_checked, background_check_date

-- Personal Social Links (Optional)
personal_website, personal_linkedin

-- Settings
accepts_advance_booking, min_advance_booking_days

-- Audit
created_at, updated_at
```

### `portfolios` (Business-Specific Info)
```sql
-- Identity
id, user_id, category_id, user_subscription_id
title, slug, share_code, description

-- Business Identity (NEW)
business_name, business_tagline
business_logo, business_logo_storage_type
business_email, business_phone

-- Pricing (UPDATED)
price_range_min (NOT NULL), price_range_max
price_on_request, price_breakdown, pricing_model

-- Commercial Terms (NEW)
payment_terms, advance_percentage
travel_cost_terms, delivery_timeline

-- Services & Coverage (NEW)
services_offered, coverage_cities
open_to_destination_wedding

-- Cancellation Policies (NEW)
cancellation_policy_user, cancellation_policy_vendor
cancellation_terms

-- Style & USP (NEW)
style_usp, working_style, decor_policy

-- Team Information (NEW)
team_description, team_size

-- Business Hours (NEW)
business_hours JSONB

-- Certifications & Awards (NEW)
certifications JSONB
awards JSONB

-- Social Links (NEW - Portfolio-specific)
portfolio_website, portfolio_facebook
portfolio_instagram, portfolio_youtube

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

## Migration Strategy

### Step 1: Clean up `vendor_profiles`

```sql
-- Remove business-specific columns
ALTER TABLE vendor_profiles DROP COLUMN business_name;
ALTER TABLE vendor_profiles DROP COLUMN business_logo;
ALTER TABLE vendor_profiles DROP COLUMN business_banner;
ALTER TABLE vendor_profiles DROP COLUMN business_media_storage_type;
ALTER TABLE vendor_profiles DROP COLUMN team_size;
ALTER TABLE vendor_profiles DROP COLUMN portfolio_tagline;
ALTER TABLE vendor_profiles DROP COLUMN specializations;
ALTER TABLE vendor_profiles DROP COLUMN service_areas;
ALTER TABLE vendor_profiles DROP COLUMN certifications;
ALTER TABLE vendor_profiles DROP COLUMN awards;
ALTER TABLE vendor_profiles DROP COLUMN business_email;
ALTER TABLE vendor_profiles DROP COLUMN business_phone;
ALTER TABLE vendor_profiles DROP COLUMN website_url;
ALTER TABLE vendor_profiles DROP COLUMN facebook_url;
ALTER TABLE vendor_profiles DROP COLUMN instagram_url;
ALTER TABLE vendor_profiles DROP COLUMN youtube_url;
ALTER TABLE vendor_profiles DROP COLUMN linkedin_url;
ALTER TABLE vendor_profiles DROP COLUMN business_hours;
ALTER TABLE vendor_profiles DROP COLUMN cancellation_policy;

-- Add new columns
ALTER TABLE vendor_profiles ADD COLUMN total_weddings_completed INTEGER DEFAULT 0;
ALTER TABLE vendor_profiles ADD COLUMN total_happy_clients INTEGER DEFAULT 0;
ALTER TABLE vendor_profiles ADD COLUMN is_background_checked BOOLEAN DEFAULT false;
ALTER TABLE vendor_profiles ADD COLUMN background_check_date DATE;
ALTER TABLE vendor_profiles ADD COLUMN personal_website VARCHAR(255);
ALTER TABLE vendor_profiles ADD COLUMN personal_linkedin VARCHAR(255);

-- Rename linkedin_url to personal_linkedin if it exists
-- (Keep only personal social links)
```

### Step 2: Enhance `portfolios` table

```sql
-- Business Identity
ALTER TABLE portfolios ADD COLUMN business_name VARCHAR(200) NOT NULL DEFAULT 'Business Name';
ALTER TABLE portfolios ADD COLUMN business_tagline VARCHAR(500);
ALTER TABLE portfolios ADD COLUMN business_logo VARCHAR(500);
ALTER TABLE portfolios ADD COLUMN business_logo_storage_type ENUM(...);
ALTER TABLE portfolios ADD COLUMN business_email VARCHAR(150);
ALTER TABLE portfolios ADD COLUMN business_phone VARCHAR(15);

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
ALTER TABLE portfolios ADD COLUMN cancellation_policy_user ENUM(...);
ALTER TABLE portfolios ADD COLUMN cancellation_policy_vendor ENUM(...);
ALTER TABLE portfolios ADD COLUMN cancellation_terms TEXT;

-- Style & USP
ALTER TABLE portfolios ADD COLUMN style_usp TEXT;
ALTER TABLE portfolios ADD COLUMN working_style TEXT;
ALTER TABLE portfolios ADD COLUMN decor_policy ENUM(...);

-- Team Information
ALTER TABLE portfolios ADD COLUMN team_description TEXT;
ALTER TABLE portfolios ADD COLUMN team_size INTEGER;

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

-- Additional
ALTER TABLE portfolios ADD COLUMN offerings TEXT;
```

---

## Benefits of This Approach

### ✅ Clear Separation of Concerns

**Personal/Legal** (vendor_profiles):
- Identity verification (Aadhar, PAN)
- Business registration (GSTIN, business type)
- Overall experience
- Verification status

**Business-Specific** (portfolios):
- Business name, logo, tagline
- Pricing, services, policies
- Team, social links
- Category-specific details

### ✅ Flexibility

- One user can have multiple businesses (portfolios)
- Each business has its own identity
- Different pricing, services, teams per business

### ✅ Scalability

- Easy to add new portfolios
- No conflicts between businesses
- Clean data model

### ✅ No Redundancy

- No separate vendor table needed
- vendor_profiles serves the purpose
- Clear 1:1 relationship with users

---

## Comparison: Current vs Proposed

### Current (WRONG)
```
users
  ↓
vendor_profiles (business_name, logo, team_size, social links)
  ↓
portfolios (minimal business info)
```
**Problem**: Business info in vendor_profiles, but user can have multiple businesses!

### Proposed (CORRECT)
```
users (personal info)
  ↓
vendor_profiles (legal/verification info)
  ↓
portfolios (business-specific info)
```
**Solution**: Each portfolio is a separate business with its own identity!

---

## Answer to Your Question

### Do we need a separate vendor table?

**NO** ❌

**Reasons:**
1. `vendor_profiles` already serves this purpose
2. It has 1:1 relationship with users (via user_id UNIQUE)
3. Creating another table would be redundant
4. Current structure is correct, just needs refactoring

### What we need to do:

1. ✅ **Refactor `vendor_profiles`** - Keep only personal/legal info
2. ✅ **Enhance `portfolios`** - Add all business-specific info
3. ✅ **Create new tables** - `portfolio_faqs`, `real_weddings` (optional)

---

## Summary

### Current Structure: ✅ CORRECT (with refactoring needed)
```
users (all users)
  ↓ (1:1 for vendors)
vendor_profiles (vendor personal/legal info)
  ↓ (1:many)
portfolios (business-specific info)
```

### No Need For:
- ❌ Separate vendor table
- ❌ Business table
- ❌ Vendor_business table

### What We Need:
- ✅ Refactor vendor_profiles (remove business-specific fields)
- ✅ Enhance portfolios (add business-specific fields)
- ✅ Create portfolio_faqs table
- ✅ Create real_weddings table (optional)

**Ready to proceed with migrations?**
