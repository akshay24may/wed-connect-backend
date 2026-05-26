# Business Profiles Table - Implementation Summary

## Final Architecture ✅

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

## Changes Applied

### 1. Users Table - Renamed Column

**Changed:**
- `is_verified_vendor` → `is_verified`
- Index: `idx_users_is_verified_vendor` → `idx_users_is_verified`

**Files updated:**
- ✅ `migrations/20250121000001-create-users-table.js`
- ✅ `src/models/User.js`

### 2. Business Profiles Table - Created

**New table:** `business_profiles`

**Columns (30 total):**

#### Business Identity (6)
- `business_name` VARCHAR(200) NOT NULL
- `business_tagline` VARCHAR(500)
- `business_logo` VARCHAR(500)
- `business_logo_storage_type` ENUM(...)
- `business_email` VARCHAR(150)
- `business_phone` VARCHAR(15)

#### Business Registration (5)
- `business_pan` VARCHAR(10)
- `gstin` VARCHAR(15)
- `business_registration_number` VARCHAR(50)
- `business_type` ENUM('proprietorship', 'partnership', 'pvt_ltd', 'llp', 'other')
- `establishment_year` SMALLINT

#### Identity Documents (3)
- `name_on_id` VARCHAR(150)
- `aadhar_number` VARCHAR(12)
- `pan_number` VARCHAR(10)

#### Contact Details (3)
- `alternate_mobile_one` VARCHAR(15)
- `alternate_mobile_two` VARCHAR(15)
- `whatsapp_mobile` VARCHAR(15)

#### Team Information (3)
- `team_description` TEXT
- `team_size` SMALLINT
- `years_of_experience` SMALLINT

#### Business Hours & Achievements (3)
- `business_hours` JSONB
- `certifications` JSONB (default: [])
- `awards` JSONB (default: [])

#### Social Links (5)
- `website_url` VARCHAR(255)
- `facebook_url` VARCHAR(255)
- `instagram_url` VARCHAR(255)
- `youtube_url` VARCHAR(255)
- `linkedin_url` VARCHAR(255)

#### Audit Fields (2 + timestamps)
- `created_by` BIGINT (FK to users)
- `updated_by` BIGINT
- `deleted_by` BIGINT (FK to users)
- `created_at` TIMESTAMP
- `updated_at` TIMESTAMP
- `deleted_at` TIMESTAMP

**Indexes:**
- `idx_business_profiles_user_id`
- `idx_business_profiles_business_name`
- `idx_business_profiles_business_pan`
- `idx_business_profiles_gstin`
- `idx_business_profiles_business_phone`
- `idx_business_profiles_whatsapp_mobile`
- `idx_business_profiles_deleted_at`

**Files created:**
- ✅ `migrations/20250125000001-create-business-profiles-table.js`
- ✅ `src/models/BusinessProfile.js`
- ✅ Registered in `src/models/index.js`

---

## Next Steps

### Step 1: Apply SQL Changes (Development)

Run migrations:
```bash
npx sequelize-cli db:migrate
```

Or manually execute the SQL script (see below).

### Step 2: Update Portfolios Table

**Add column:**
```sql
ALTER TABLE portfolios ADD COLUMN business_profile_id BIGINT;
ALTER TABLE portfolios ADD CONSTRAINT fk_portfolios_business_profile_id 
  FOREIGN KEY (business_profile_id) REFERENCES business_profiles(id) 
  ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX idx_portfolios_business_profile_id ON portfolios(business_profile_id);
```

**Add portfolio-specific columns:**
- Pricing (price_range_min, price_range_max, price_breakdown, pricing_model, payment_terms)
- Commercial terms (advance_percentage, travel_cost_terms, delivery_timeline)
- Services & coverage (services_offered, coverage_cities, open_to_destination_wedding)
- Cancellation policies (cancellation_policy_user, cancellation_policy_vendor, cancellation_terms)
- Style & USP (style_usp, working_style, decor_policy)
- Booking settings (accepts_advance_booking, min_advance_booking_days)
- Portfolio-specific metrics (weddings_completed, happy_clients_count)
- Additional (offerings)

### Step 3: Update Portfolio Model

Add `businessProfileId` field and association:
```javascript
businessProfileId: {
  type: DataTypes.BIGINT,
  allowNull: true,
  field: 'business_profile_id'
}

// Association
this.belongsTo(models.BusinessProfile, {
  foreignKey: 'businessProfileId',
  as: 'businessProfile'
});
```

### Step 4: Migrate Data (If vendor_profiles exists)

```sql
-- Create business profiles from vendor_profiles
INSERT INTO business_profiles (
  user_id, business_name, business_logo, business_logo_storage_type,
  business_pan, gstin, business_registration_number, business_type,
  establishment_year, name_on_id, aadhar_number, pan_number,
  alternate_mobile_one, alternate_mobile_two, whatsapp_mobile,
  team_description, team_size, years_of_experience,
  business_hours, certifications, awards,
  website_url, facebook_url, instagram_url, youtube_url, linkedin_url,
  created_at, updated_at
)
SELECT 
  user_id, business_name, business_logo, business_media_storage_type,
  business_pan, gstin, business_registration_number, business_type,
  establishment_year, name_on_id, aadhar_number, pan_number,
  alternate_mobile_one, alternate_mobile_two, whatsapp_mobile,
  NULL, team_size, years_of_experience,
  business_hours, certifications, awards,
  website_url, facebook_url, instagram_url, youtube_url, linkedin_url,
  created_at, updated_at
FROM vendor_profiles;

-- Link portfolios to business profiles
UPDATE portfolios p
SET business_profile_id = bp.id
FROM business_profiles bp
WHERE p.user_id = bp.user_id;
```

### Step 5: Drop vendor_profiles Table

After confirming data migration:
```sql
DROP TABLE IF EXISTS vendor_profiles;
```

### Step 6: Delete VendorProfile Model

**Files to delete/update:**
- Delete: `src/models/VendorProfile.js`
- Update: `src/models/index.js` (remove VendorProfile import and registration)
- Update: All services/repositories/controllers referencing VendorProfile

---

## Benefits

### ✅ Clean Separation of Concerns
- **users**: Personal info + vendor verification
- **business_profiles**: Business entity (reusable)
- **portfolios**: Portfolio-specific data

### ✅ Reusability
One business profile can be used for one portfolio (1:1 relationship).
User can have multiple business profiles for different businesses.

### ✅ Flexibility
- Different PAN/GST per business
- Different contact numbers per business
- Different social links per business
- Different team info per business

### ✅ Better Data Organization
- ~30 columns in business_profiles (business data)
- ~40-45 columns in portfolios (portfolio data)
- No 60+ column monster table

### ✅ Easier Maintenance
- Update business info independently
- Clear data ownership
- Better for future features

---

## Example: Multi-Business User

### User: Abhijit Kumar
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

### Business Profile 1: Photography
```json
{
  "id": 1,
  "user_id": 123,
  "business_name": "Abhijit's Photography",
  "business_pan": "ABCDE1234F",
  "gstin": "07ABCDE1234F1Z5",
  "business_phone": "+91 9876543211",
  "whatsapp_mobile": "+91 9876543211",
  "team_size": 5,
  "years_of_experience": 8,
  "instagram_url": "@abhijitsphotography"
}
```

### Portfolio 1 (linked to Business Profile 1)
```json
{
  "id": 456,
  "user_id": 123,
  "business_profile_id": 1,
  "category_id": 1,
  "title": "Premium Wedding Photography",
  "price_range_min": 80000,
  "price_range_max": 200000,
  "services_offered": ["Wedding", "Pre-Wedding", "Candid"],
  "coverage_cities": ["Delhi", "Mumbai", "Bangalore"]
}
```

### Business Profile 2: Catering
```json
{
  "id": 2,
  "user_id": 123,
  "business_name": "Abhijit Catering Services",
  "business_pan": "FGHIJ5678K",
  "gstin": "07FGHIJ5678K1Z5",
  "business_phone": "+91 9876543212",
  "whatsapp_mobile": "+91 9876543212",
  "team_size": 20,
  "years_of_experience": 5,
  "facebook_url": "abhijitcatering"
}
```

### Portfolio 2 (linked to Business Profile 2)
```json
{
  "id": 789,
  "user_id": 123,
  "business_profile_id": 2,
  "category_id": 5,
  "title": "Wedding Catering Services",
  "price_range_min": 350,
  "price_range_max": 800,
  "services_offered": ["Veg", "Non-Veg", "Desserts"],
  "coverage_cities": ["Delhi", "Noida", "Gurgaon"]
}
```

---

## Verification Checklist

- [x] Users table: `is_verified_vendor` renamed to `is_verified`
- [x] User model updated
- [x] Business profiles table created
- [x] BusinessProfile model created
- [x] BusinessProfile registered in models/index.js
- [x] User model: BusinessProfile association added
- [ ] SQL changes applied to development database
- [ ] Portfolios table: Add business_profile_id column
- [ ] Portfolio model: Add businessProfileId field and association
- [ ] Data migrated from vendor_profiles (if exists)
- [ ] vendor_profiles table dropped
- [ ] VendorProfile model deleted
- [ ] Code references updated
- [ ] API documentation updated
- [ ] Testing completed

---

## Files Modified/Created

### ✅ Completed
1. `migrations/20250121000001-create-users-table.js` - Renamed is_verified_vendor to is_verified
2. `src/models/User.js` - Renamed field, added BusinessProfile association
3. `migrations/20250125000001-create-business-profiles-table.js` - Created
4. `src/models/BusinessProfile.js` - Created
5. `src/models/index.js` - Registered BusinessProfile

### 🚧 Pending
6. `migrations/20250314000001-create-portfolios-table.js` - Add business_profile_id + portfolio columns
7. `src/models/Portfolio.js` - Add businessProfileId field and association
8. SQL script for existing databases
9. Delete VendorProfile model and references

---

## Status: PHASE 1 COMPLETE ✅

**Phase 1 (Business Profiles Table):** ✅ DONE
- Users table: is_verified column renamed
- Business profiles table created
- BusinessProfile model created and registered
- User model updated with association

**Phase 2 (Portfolios Table):** 🚧 NEXT
- Add business_profile_id column to portfolios
- Add portfolio-specific columns
- Update Portfolio model

**Phase 3 (Cleanup):** ⏳ PENDING
- Migrate data from vendor_profiles
- Drop vendor_profiles table
- Delete VendorProfile model
- Update all code references

---

## Ready for Phase 2?

Next step: Update portfolios table with business_profile_id and portfolio-specific columns.

**Confirm to proceed with portfolios table updates.**
