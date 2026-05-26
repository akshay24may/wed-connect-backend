# WedConnect - Final Database Architecture

## Architecture Overview ✅

```
users (personal + vendor verification)
  ↓ (1:many)
business_profiles (business entity - reusable)
  ↓ (1:1)
portfolios (portfolio-specific data)
  ↓ (1:many)
portfolio_albums
  ↓ (1:many)
portfolio_media
```

---

## Table Breakdown

### 1. users (~35 columns)
**Purpose:** Personal information + vendor verification

**Key Columns:**
- Personal: full_name, email, mobile, dob, gender, about
- Location: address, city_id, state_id, pincode
- Profile: profile_photo, avatar_photo, photos_storage_type
- Verification: is_phone_verified, is_email_verified, is_verified
- Vendor: verified_at, verification_badge_type, trust_score
- Counters: total_portfolios, unread_chat_count, unread_notification_count
- Referral: referral_code, referred_by, referral_count

**Relationships:**
- 1:many → business_profiles
- 1:many → portfolios (direct, for queries)
- 1:many → user_subscriptions

---

### 2. business_profiles (~30 columns) ✅ NEW
**Purpose:** Business entity (reusable across portfolios)

**Key Columns:**

#### Business Identity (6)
- business_name, business_tagline
- business_logo, business_logo_storage_type
- business_email, business_phone

#### Business Registration (5)
- business_pan, gstin
- business_registration_number, business_type
- establishment_year

#### Identity Documents (3)
- name_on_id, aadhar_number, pan_number

#### Contact Details (3)
- alternate_mobile_one, alternate_mobile_two, whatsapp_mobile

#### Team Information (3)
- team_description, team_size, years_of_experience

#### Business Hours & Achievements (3)
- business_hours (JSONB)
- certifications (JSONB)
- awards (JSONB)

#### Social Links (5)
- website_url, facebook_url, instagram_url, youtube_url, linkedin_url

**Relationships:**
- many:1 → users
- 1:1 → portfolios

---

### 3. portfolios (~45-50 columns)
**Purpose:** Portfolio-specific data (service offering)

**Key Columns:**

#### Identity & References (7)
- id, user_id, business_profile_id (FK - NEW)
- category_id, user_subscription_id
- title, slug, share_code, description

#### Pricing (6) - UPDATED
- price_range_min (MANDATORY)
- price_range_max (optional, NULL = fixed price)
- price_on_request
- price_breakdown (JSONB)
- pricing_model (JSONB)
- payment_terms (TEXT)

#### Commercial Terms (3) - NEW
- advance_percentage
- travel_cost_terms
- delivery_timeline

#### Services & Coverage (3) - NEW
- services_offered (JSONB)
- coverage_cities (JSONB)
- open_to_destination_wedding

#### Cancellation Policies (3) - NEW
- cancellation_policy_user (ENUM)
- cancellation_policy_vendor (ENUM)
- cancellation_terms (TEXT)

#### Style & USP (3) - NEW
- style_usp (TEXT)
- working_style (TEXT)
- decor_policy (ENUM)

#### Booking Settings (2) - NEW
- accepts_advance_booking
- min_advance_booking_days

#### Portfolio Metrics (3) - NEW
- weddings_completed
- happy_clients_count
- offerings (TEXT)

#### Location (3)
- state_id, city_id, address

#### Status & Workflow (5)
- status (draft, pending, published, rejected, deleted)
- published_at, approved_at, rejected_at
- is_auto_approved

#### Visibility Features (6)
- is_featured, featured_until
- is_boosted, boosted_until
- is_recommended, recommended_at

#### Engagement (3)
- view_count, contact_count, total_favorites

#### Rating (3)
- average_rating
- total_reviews
- rating_distribution (JSONB: {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0})

#### Media (2)
- cover_image, cover_image_storage_type

#### Republish (3)
- republish_count, last_republished_at, republish_history (JSONB)

#### Additional (2)
- service_details (JSONB)
- internal_notes (TEXT)

**Relationships:**
- many:1 → users
- 1:1 → business_profiles
- many:1 → categories
- many:1 → user_subscriptions
- 1:many → portfolio_albums
- 1:many → portfolio_media

---

## Key Design Decisions

### ✅ 1:1 Relationship (business_profiles ↔ portfolios)
**Why?**
- Each portfolio represents a unique business offering
- Even same business, different categories = different portfolios
- Simplifies data model while keeping organized

**Example:**
- User "Abhijit" has 2 businesses:
  - Business Profile 1: "Abhijit's Photography" → Portfolio 1 (Wedding Photography)
  - Business Profile 2: "Abhijit Catering" → Portfolio 2 (Catering Services)

### ✅ Separate business_profiles Table
**Why not put everything in portfolios?**
- Would create 60+ column monster table
- Violates normalization
- Poor performance
- Difficult to maintain

**Why not 1:many (business_profiles → portfolios)?**
- User clarified: 1 business profile = 1 portfolio
- Simpler model
- Easier to understand and maintain

### ✅ Vendor Verification in users Table
**Why?**
- Only 4 columns: is_verified, verified_at, verification_badge_type, trust_score
- Vendor verification is user-level, not business-level
- No need for separate table

---

## Data Flow Example

### User: Abhijit Kumar

#### 1. User Record
```json
{
  "id": 123,
  "full_name": "Abhijit Kumar",
  "email": "abhijit@example.com",
  "mobile": "+91 9876543210",
  "role_id": 3,
  "is_verified": true,
  "verified_at": "2024-01-15T10:30:00Z",
  "verification_badge_type": "premium",
  "trust_score": 4.85
}
```

#### 2. Business Profile 1 (Photography)
```json
{
  "id": 1,
  "user_id": 123,
  "business_name": "Abhijit's Photography",
  "business_tagline": "Capturing Your Special Moments",
  "business_pan": "ABCDE1234F",
  "gstin": "07ABCDE1234F1Z5",
  "business_phone": "+91 9876543211",
  "whatsapp_mobile": "+91 9876543211",
  "team_size": 5,
  "years_of_experience": 8,
  "instagram_url": "@abhijitsphotography",
  "certifications": ["ISO 9001", "Wedding Photography Certified"],
  "awards": ["Best Wedding Photographer 2023", "People's Choice Award"]
}
```

#### 3. Portfolio 1 (linked to Business Profile 1)
```json
{
  "id": 456,
  "user_id": 123,
  "business_profile_id": 1,
  "category_id": 1,
  "user_subscription_id": 10,
  "title": "Premium Wedding Photography",
  "description": "Professional wedding photography services...",
  "price_range_min": 80000,
  "price_range_max": 200000,
  "price_breakdown": {
    "wedding_day": 80000,
    "pre_wedding": 40000,
    "album": 30000
  },
  "payment_terms": "50% advance, 50% on delivery",
  "advance_percentage": 50,
  "services_offered": ["Wedding", "Pre-Wedding", "Candid", "Traditional"],
  "coverage_cities": ["Delhi", "Mumbai", "Bangalore"],
  "open_to_destination_wedding": true,
  "working_style": "Candid and traditional mix",
  "weddings_completed": 150,
  "happy_clients_count": 145,
  "status": "published",
  "is_featured": true,
  "average_rating": 4.8,
  "total_reviews": 87
}
```

#### 4. Business Profile 2 (Catering)
```json
{
  "id": 2,
  "user_id": 123,
  "business_name": "Abhijit Catering Services",
  "business_tagline": "Delicious Food for Your Big Day",
  "business_pan": "FGHIJ5678K",
  "gstin": "07FGHIJ5678K1Z5",
  "business_phone": "+91 9876543212",
  "whatsapp_mobile": "+91 9876543212",
  "team_size": 20,
  "years_of_experience": 5,
  "facebook_url": "abhijitcatering",
  "certifications": ["FSSAI Certified", "Hygiene Certified"],
  "awards": ["Best Caterer 2024"]
}
```

#### 5. Portfolio 2 (linked to Business Profile 2)
```json
{
  "id": 789,
  "user_id": 123,
  "business_profile_id": 2,
  "category_id": 5,
  "user_subscription_id": 11,
  "title": "Wedding Catering Services",
  "description": "Full-service wedding catering...",
  "price_range_min": 350,
  "price_range_max": 800,
  "price_breakdown": {
    "veg_plate": 350,
    "non_veg_plate": 450,
    "desserts": 100
  },
  "payment_terms": "30% advance, 70% on event day",
  "advance_percentage": 30,
  "services_offered": ["Veg", "Non-Veg", "Desserts", "Live Counters"],
  "coverage_cities": ["Delhi", "Noida", "Gurgaon"],
  "open_to_destination_wedding": false,
  "working_style": "Traditional Indian cuisine with modern presentation",
  "weddings_completed": 80,
  "happy_clients_count": 75,
  "status": "published",
  "is_boosted": true,
  "average_rating": 4.6,
  "total_reviews": 52
}
```

---

## Benefits of This Architecture

### ✅ Clean Separation
- **users**: Who is the person? Are they verified?
- **business_profiles**: What business do they operate?
- **portfolios**: What service do they offer?

### ✅ Flexibility
- Multiple businesses per user
- Different PAN/GST per business
- Different contact details per business
- Different social links per business

### ✅ Reusability
- Business profile data is separate from portfolio data
- Easy to update business info independently

### ✅ Performance
- Reasonable column count per table (30-50 columns)
- Efficient queries with proper indexes
- No data duplication

### ✅ Maintainability
- Clear data ownership
- Easy to understand relationships
- Better for future features

---

## Migration Path

### Phase 1: ✅ COMPLETE
- [x] Users table: Rename is_verified_vendor to is_verified
- [x] Create business_profiles table
- [x] Create BusinessProfile model
- [x] Register BusinessProfile in models/index.js
- [x] Update User model with association

### Phase 2: 🚧 NEXT
- [ ] Add business_profile_id to portfolios table
- [ ] Add portfolio-specific columns to portfolios table
- [ ] Update Portfolio model
- [ ] Add Portfolio ↔ BusinessProfile associations

### Phase 3: ⏳ PENDING
- [ ] Migrate data from vendor_profiles (if exists)
- [ ] Drop vendor_profiles table
- [ ] Delete VendorProfile model
- [ ] Update all code references
- [ ] Update API documentation
- [ ] Testing

---

## Files Status

### ✅ Completed
1. `migrations/20250121000001-create-users-table.js` - Updated
2. `src/models/User.js` - Updated
3. `migrations/20250125000001-create-business-profiles-table.js` - Created
4. `src/models/BusinessProfile.js` - Created
5. `src/models/index.js` - Updated
6. `APPLY-BUSINESS-PROFILES-CHANGES.sql` - Created
7. `BUSINESS-PROFILES-TABLE-SUMMARY.md` - Created
8. `ARCHITECTURE-FINAL.md` - Created

### 🚧 Pending
9. `migrations/20250314000001-create-portfolios-table.js` - Update
10. `src/models/Portfolio.js` - Update
11. SQL script for portfolios updates
12. Delete VendorProfile model and references

---

## Ready for Phase 2?

Next step: Update portfolios table with business_profile_id and all portfolio-specific columns.

**Confirm to proceed.**
