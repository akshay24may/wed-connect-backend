# Portfolio-Level Business Details Design

## Key Insight

**One user can have multiple subscriptions = Multiple portfolios for different categories**

Example:
- User: Abhijit Kumar
- Portfolio 1: "Abhijit's Photography" (Photography category)
- Portfolio 2: "Abhijit Catering Services" (Catering category)
- Portfolio 3: "Abhijit Events & Decor" (Decoration category)

**Therefore**: Business details must be at **PORTFOLIO level**, not vendor_profile level.

---

## Data Architecture

### User Level (users + user_profiles)
**Personal Information** - Same across all portfolios
- Full Name
- Email
- Phone
- WhatsApp
- Profile Photo
- Personal Bio

### Vendor Profile Level (vendor_profiles)
**Common Vendor Information** - Shared across all portfolios
- Years of Experience (overall)
- Total Weddings Completed (across all categories)
- Joined Date
- Verification Status
- Background Check Status

### Portfolio Level (portfolios)
**Business-Specific Information** - Unique per portfolio/business
- Business Name
- Business Description
- Business Logo/Cover
- Category-specific details
- Pricing
- Services
- Policies
- Team info
- FAQs

---

## Portfolio Table Schema Updates

### Add to `portfolios` table:

```sql
-- Business Identity
business_name VARCHAR(200) NOT NULL,
business_tagline VARCHAR(500),
business_logo VARCHAR(500),
business_logo_storage_type ENUM(...),

-- Pricing (UPDATED)
price_range_min DECIMAL(15,2) NOT NULL,
price_range_max DECIMAL(15,2),
price_on_request BOOLEAN DEFAULT false,
price_breakdown JSONB,
pricing_model JSONB,  -- ["fixed_fee", "percentage_based", "hourly", "package"]

-- Commercial Terms
payment_terms TEXT,
advance_percentage INTEGER,  -- e.g., 50 for 50% advance
travel_cost_terms TEXT,
delivery_timeline VARCHAR(100),

-- Services Offered
services_offered JSONB,  -- ["vendor_sourcing", "event_planning", "rsvp_management"]

-- Coverage & Availability
coverage_cities JSONB,  -- ["Delhi", "Mumbai", "Jaipur"]
open_to_destination_wedding BOOLEAN DEFAULT false,

-- Cancellation Policies
cancellation_policy_user ENUM('partial_refund', 'no_refund', 'no_refund_date_adjust', 'full_refund'),
cancellation_policy_vendor ENUM('partial_refund', 'no_refund', 'full_refund'),
cancellation_terms TEXT,

-- Style & USP
style_usp TEXT,
working_style TEXT,
decor_policy ENUM('in_house_external_allowed', 'no_in_house_external_allowed', 'only_in_house'),

-- Team Information
team_description TEXT,
team_size INTEGER,

-- Social Links (Portfolio-specific)
portfolio_website VARCHAR(255),
portfolio_facebook VARCHAR(255),
portfolio_instagram VARCHAR(255),
portfolio_youtube VARCHAR(255),

-- Metadata
offerings TEXT,  -- Comma-separated or JSONB
```

---

## New Tables

### 1. `portfolio_faqs`

FAQs specific to each portfolio/business:

```sql
CREATE TABLE portfolio_faqs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  portfolio_id BIGINT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  INDEX idx_portfolio_faqs_portfolio_id (portfolio_id),
  INDEX idx_portfolio_faqs_is_active (is_active)
);
```

### 2. `real_weddings` (Optional)

Actual wedding coverage - linked to portfolio:

```sql
CREATE TABLE real_weddings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  portfolio_id BIGINT NOT NULL,
  couple_name VARCHAR(200),
  wedding_date DATE,
  venue_name VARCHAR(200),
  city_id INTEGER,
  state_id INTEGER,
  wedding_type VARCHAR(100),  -- "Destination", "Traditional", etc.
  description TEXT,
  cover_image VARCHAR(500),
  storage_type ENUM(...),
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status ENUM('draft', 'published') DEFAULT 'draft',
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  FOREIGN KEY (city_id) REFERENCES cities(id),
  FOREIGN KEY (state_id) REFERENCES states(id),
  INDEX idx_real_weddings_portfolio_id (portfolio_id),
  INDEX idx_real_weddings_status (status),
  INDEX idx_real_weddings_wedding_date (wedding_date)
);
```

### 3. `real_wedding_media`

Media for real weddings:

```sql
CREATE TABLE real_wedding_media (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  real_wedding_id BIGINT NOT NULL,
  media_type ENUM('image', 'video') DEFAULT 'image',
  media_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  storage_type ENUM(...) DEFAULT 'local',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  
  FOREIGN KEY (real_wedding_id) REFERENCES real_weddings(id) ON DELETE CASCADE,
  INDEX idx_real_wedding_media_real_wedding_id (real_wedding_id)
);
```

---

## Complete Portfolio Schema

```sql
CREATE TABLE portfolios (
  -- Identity
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  category_id INTEGER NOT NULL,
  category_slug VARCHAR(100) NOT NULL,
  user_subscription_id BIGINT,
  
  -- Portfolio Identity
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE,
  share_code VARCHAR(10) UNIQUE,
  description TEXT,
  keywords TEXT,
  
  -- Business Identity (NEW)
  business_name VARCHAR(200) NOT NULL,
  business_tagline VARCHAR(500),
  business_logo VARCHAR(500),
  business_logo_storage_type ENUM(...),
  
  -- Pricing (UPDATED)
  price_range_min DECIMAL(15,2) NOT NULL,
  price_range_max DECIMAL(15,2),
  price_on_request BOOLEAN DEFAULT false,
  price_breakdown JSONB,
  pricing_model JSONB,
  
  -- Commercial Terms (NEW)
  payment_terms TEXT,
  advance_percentage INTEGER,
  travel_cost_terms TEXT,
  delivery_timeline VARCHAR(100),
  
  -- Services & Coverage (NEW)
  services_offered JSONB,
  coverage_cities JSONB,
  open_to_destination_wedding BOOLEAN DEFAULT false,
  
  -- Cancellation Policies (NEW)
  cancellation_policy_user ENUM('partial_refund', 'no_refund', 'no_refund_date_adjust', 'full_refund'),
  cancellation_policy_vendor ENUM('partial_refund', 'no_refund', 'full_refund'),
  cancellation_terms TEXT,
  
  -- Style & USP (NEW)
  style_usp TEXT,
  working_style TEXT,
  decor_policy ENUM('in_house_external_allowed', 'no_in_house_external_allowed', 'only_in_house'),
  
  -- Team Information (NEW)
  team_description TEXT,
  team_size INTEGER,
  
  -- Social Links (NEW - Portfolio-specific)
  portfolio_website VARCHAR(255),
  portfolio_facebook VARCHAR(255),
  portfolio_instagram VARCHAR(255),
  portfolio_youtube VARCHAR(255),
  
  -- Location
  state_id INTEGER NOT NULL,
  city_id INTEGER NOT NULL,
  state_slug VARCHAR(255) NOT NULL,
  city_slug VARCHAR(255) NOT NULL,
  address TEXT,
  
  -- Status & Workflow
  status ENUM('draft', 'pending', 'published', 'rejected') DEFAULT 'draft',
  published_at TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by BIGINT,
  rejected_at TIMESTAMP,
  rejected_by BIGINT,
  rejection_reason TEXT,
  is_auto_approved BOOLEAN DEFAULT false,
  
  -- Visibility Features
  is_featured BOOLEAN DEFAULT false,
  featured_until TIMESTAMP,
  is_boosted BOOLEAN DEFAULT false,
  boosted_until TIMESTAMP,
  is_recommended BOOLEAN DEFAULT false,
  recommended_at TIMESTAMP,
  
  -- Engagement Metrics
  view_count INTEGER DEFAULT 0,
  contact_count INTEGER DEFAULT 0,
  total_favorites INTEGER DEFAULT 0,
  
  -- Rating Normalization
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  rating_distribution JSONB DEFAULT '{"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}',
  
  -- Media
  cover_image VARCHAR(500),
  cover_image_storage_type ENUM(...),
  
  -- Republish Tracking
  republish_count INTEGER DEFAULT 0,
  last_republished_at TIMESTAMP,
  republish_history JSONB,
  
  -- Additional
  service_details JSONB,
  offerings TEXT,
  internal_notes TEXT,
  
  -- Audit
  created_by BIGINT,
  updated_by BIGINT,
  deleted_by BIGINT,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_subscription_id) REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE RESTRICT,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE RESTRICT,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (rejected_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (deleted_by) REFERENCES users(id) ON DELETE SET NULL
);
```

---

## Vendor Profile Schema (Simplified)

Keep only **common/personal** information:

```sql
CREATE TABLE vendor_profiles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNIQUE NOT NULL,
  
  -- Overall Experience (across all categories)
  years_of_experience INTEGER,
  total_weddings_completed INTEGER DEFAULT 0,
  total_happy_clients INTEGER DEFAULT 0,
  
  -- Verification Status
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP,
  is_background_checked BOOLEAN DEFAULT false,
  background_check_date DATE,
  
  -- Personal Social Links (optional - user's personal accounts)
  personal_website VARCHAR(255),
  personal_facebook VARCHAR(255),
  personal_instagram VARCHAR(255),
  personal_linkedin VARCHAR(255),
  
  -- Metadata
  bio TEXT,  -- Personal bio (different from business description)
  
  -- Audit
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Example: Multi-Portfolio User

### User: Abhijit Kumar

**User Profile:**
- Name: Abhijit Kumar
- Email: abhijit@example.com
- Phone: +91 9876543210

**Vendor Profile:**
- Years of Experience: 10
- Total Weddings: 150+
- Verified: Yes

**Portfolio 1: Photography**
```json
{
  "business_name": "Abhijit's Photography",
  "business_tagline": "Capturing Your Special Moments",
  "category": "Photography",
  "price_range_min": 50000,
  "price_range_max": 200000,
  "price_breakdown": {
    "items": [
      {"name": "Pre-Wedding Shoot", "price": 45000, "unit": "per session"},
      {"name": "Wedding Day Coverage", "price": 80000, "unit": "per day"}
    ]
  },
  "services_offered": ["pre_wedding", "wedding_day", "candid", "traditional"],
  "coverage_cities": ["Delhi", "Jaipur", "Agra"],
  "team_size": 5,
  "portfolio_instagram": "@abhijitsphotography"
}
```

**Portfolio 2: Catering**
```json
{
  "business_name": "Abhijit Catering Services",
  "business_tagline": "Delicious Food for Your Big Day",
  "category": "Catering",
  "price_range_min": 350,
  "price_range_max": 800,
  "price_breakdown": {
    "items": [
      {"name": "Veg Plate", "price": 350, "unit": "per person"},
      {"name": "Non-Veg Plate", "price": 500, "unit": "per person"},
      {"name": "Premium Buffet", "price": 800, "unit": "per person"}
    ]
  },
  "services_offered": ["buffet", "live_counters", "dessert_bar", "beverages"],
  "coverage_cities": ["Delhi", "Noida", "Gurgaon"],
  "team_size": 20,
  "portfolio_facebook": "abhijitcatering"
}
```

**Portfolio 3: Event Planning**
```json
{
  "business_name": "Abhijit Events & Decor",
  "business_tagline": "Making Your Dreams Come True",
  "category": "Wedding Planner",
  "price_range_min": 100000,
  "price_range_max": 500000,
  "pricing_model": ["fixed_fee", "percentage_based"],
  "services_offered": ["full_planning", "partial_planning", "day_coordination", "decor"],
  "coverage_cities": ["Delhi", "Mumbai", "Jaipur", "Udaipur"],
  "open_to_destination_wedding": true,
  "team_size": 10,
  "portfolio_website": "abhijitevents.com"
}
```

---

## Migration Strategy

### Step 1: Add New Columns to Portfolios

```sql
-- Business Identity
ALTER TABLE portfolios ADD COLUMN business_name VARCHAR(200) NOT NULL DEFAULT 'Business Name';
ALTER TABLE portfolios ADD COLUMN business_tagline VARCHAR(500);
ALTER TABLE portfolios ADD COLUMN business_logo VARCHAR(500);
ALTER TABLE portfolios ADD COLUMN business_logo_storage_type ENUM(...);

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

-- Social Links
ALTER TABLE portfolios ADD COLUMN portfolio_website VARCHAR(255);
ALTER TABLE portfolios ADD COLUMN portfolio_facebook VARCHAR(255);
ALTER TABLE portfolios ADD COLUMN portfolio_instagram VARCHAR(255);
ALTER TABLE portfolios ADD COLUMN portfolio_youtube VARCHAR(255);

-- Additional
ALTER TABLE portfolios ADD COLUMN offerings TEXT;
```

### Step 2: Create New Tables

```sql
-- Portfolio FAQs
CREATE TABLE portfolio_faqs (...);

-- Real Weddings (Optional)
CREATE TABLE real_weddings (...);
CREATE TABLE real_wedding_media (...);
```

### Step 3: Simplify Vendor Profiles

```sql
-- Keep only common fields in vendor_profiles
-- Remove business-specific fields (if any exist)
```

---

## Benefits of Portfolio-Level Business Details

### ✅ Flexibility
- One user can operate multiple businesses
- Different business names per category
- Different pricing models per service type

### ✅ Scalability
- Easy to add new portfolios/businesses
- Each portfolio is independent
- No conflicts between different business types

### ✅ Better UX
- Clear separation of businesses
- Each portfolio has its own identity
- Easier for users to manage multiple ventures

### ✅ Accurate Data
- Pricing specific to service type
- Services offered specific to category
- Team size specific to business unit

---

## Summary

### Data Distribution

**User Level** (users + user_profiles):
- Personal info: Name, email, phone, photo

**Vendor Profile Level** (vendor_profiles):
- Overall experience, total weddings, verification status

**Portfolio Level** (portfolios):
- ✅ Business name, logo, tagline
- ✅ Pricing (min, max, breakdown, model)
- ✅ Commercial terms (payment, travel, delivery)
- ✅ Services offered
- ✅ Coverage cities
- ✅ Cancellation policies
- ✅ Style & USP
- ✅ Team info
- ✅ Social links (portfolio-specific)
- ✅ FAQs (separate table)
- ✅ Real weddings (separate table, optional)

### New Tables
1. `portfolio_faqs` - FAQs per portfolio
2. `real_weddings` - Real wedding coverage (optional)
3. `real_wedding_media` - Media for real weddings

### Updated Tables
1. `portfolios` - Add ~30 new business-related columns
2. `vendor_profiles` - Simplify to common/personal info only

Ready to create the migrations?
