# Competitor Platform Analysis & WedConnect Comparison

## Competitor's Registration Flow

### 1. Personal Information
- Login Email ID (required)
- Brand Name (required)
- Vendor Category (required)
- Contact Person Name (optional)
- Additional Email ID (optional)

### 2. Contact Information
- Contact Number (required, with country code)
- Additional Contact Numbers (multiple allowed)
- WhatsApp Number (optional)

### 3. Social & Web Links
- Website Link
- Facebook URL
- Instagram URL
- YouTube / Vimeo URL

### 4. Business Information
- Vendor Description (required, long text)
- Base City (required)
- Address (text / Google location)

### 5. Commercial Information
- Commercial Types (multiple selection):
  - Charges fixed fee for planning
  - Charges percentage of wedding cost

### 6. Style & USP
- Style USP (long text)
- Decor Policy (single selection):
  - In-house decor available, external decorators allowed
  - No in-house decor, open to external decorators
  - Only in-house decor supported
- Wedding Coverage Cities (multi-city tags)
- Previously Planned Wedding Cities (multi-city tags)

### 7. Cancellation Policies
- If User Cancels (single selection):
  - Partial refund offered
  - No refund offered
  - No refund but date adjustment available
  - Full refund offered
- If Vendor Cancels (single selection):
  - Partial refund offered
  - No refund offered
  - Full refund offered
- Detailed Cancellation Terms (long text)

### 8. Services Information
- Services Provided (multi-select):
  - Vendor sourcing
  - Vendor coordination
  - Hospitality planning
  - Event planning
  - RSVP management
  - Guest management
  - Stall coordination
  - On-ground coordination
  - Bride & groom entries
  - Travel management
  - Decor ideation
  - Entertainment arrangements

### 9. Post-Registration Actions
- Answer FAQs
- Link Facebook page / Website
- Add portfolio images
- Submit Real Wedding
- Upload first album
- Invite clients for reviews

---

## Competitor's Public Display

### Portfolio Page Structure

**Header:**
- Vendor business name
- Location name + view on map
- Number of photos
- Actions: Favorite/Shortlist, Write a Review, Share

**Tabs:**
1. **Projects**
   - **Works** (default album): Photos in grid
   - **Albums**: 
     - Title
     - Shot in (location)
     - Tagline/short description
     - Last updated
   - **Videos**:
     - Title
     - Shot in (location)
     - Tagline/short description
     - Last updated

2. **About**
   - Business name with location
   - Description
   - By the photography team
   - Services offered (description + bullet points)
   - Working style (text description)
   - Open to destination wedding (text)
   - **Metadata**:
     - Joined since
     - Payment terms
     - Travel cost terms
     - Offerings (comma-separated)
     - Delivery time

3. **Reviews**
   - Customer reviews and ratings

---

## WedConnect Current System

### Our Tables

1. **Users** - Basic user account
2. **UserProfile** - Extended profile info
3. **VendorProfile** - Vendor-specific details
4. **Portfolios** - Portfolio/listing
5. **PortfolioAlbums** - Albums within portfolio
6. **PortfolioMedia** - Photos/videos in albums
7. **PortfolioReviews** - Customer reviews
8. **Categories** - Service categories
9. **SubscriptionPlans** - Subscription tiers
10. **UserSubscriptions** - Active subscriptions

---

## Gap Analysis

### ✅ What We Have

| Feature | WedConnect | Competitor | Status |
|---------|-----------|------------|--------|
| **User Account** | ✅ Users table | ✅ Login Email | **COVERED** |
| **Profile Info** | ✅ UserProfile + VendorProfile | ✅ Personal Info | **COVERED** |
| **Contact Details** | ✅ VendorProfile (phone, whatsapp) | ✅ Contact Info | **COVERED** |
| **Social Links** | ✅ VendorProfile (website, facebook, instagram, youtube) | ✅ Social & Web Links | **COVERED** |
| **Business Info** | ✅ VendorProfile (business_name, description) | ✅ Business Info | **COVERED** |
| **Location** | ✅ Portfolios (state, city, address) | ✅ Base City + Address | **COVERED** |
| **Categories** | ✅ Categories table | ✅ Vendor Category | **COVERED** |
| **Portfolios** | ✅ Portfolios table | ✅ Projects | **COVERED** |
| **Albums** | ✅ PortfolioAlbums | ✅ Albums | **COVERED** |
| **Media** | ✅ PortfolioMedia (photos/videos) | ✅ Works/Videos | **COVERED** |
| **Reviews** | ✅ PortfolioReviews | ✅ Reviews | **COVERED** |
| **Subscription** | ✅ SubscriptionPlans + UserSubscriptions | ❌ Not visible | **ADVANTAGE** |

### ❌ What We're Missing

| Feature | Competitor Has | WedConnect Status | Priority |
|---------|---------------|-------------------|----------|
| **Commercial Types** | Multiple pricing models | ❌ Missing | **HIGH** |
| **Style & USP** | Decor policy, working style | ❌ Missing | **MEDIUM** |
| **Coverage Cities** | Multi-city tags | ❌ Missing | **HIGH** |
| **Cancellation Policies** | Detailed refund terms | ❌ Missing | **MEDIUM** |
| **Services Offered** | Multi-select services | ❌ Missing | **HIGH** |
| **Payment Terms** | Payment structure | ❌ Missing | **HIGH** |
| **Travel Cost Terms** | Travel charges | ❌ Missing | **MEDIUM** |
| **Delivery Time** | Timeline info | ❌ Missing | **MEDIUM** |
| **Destination Wedding** | Yes/No flag | ❌ Missing | **LOW** |
| **Team Description** | "By the team" section | ❌ Missing | **LOW** |
| **Real Weddings** | Separate from portfolio | ❌ Missing | **MEDIUM** |
| **FAQs** | Vendor FAQs | ❌ Missing | **LOW** |

---

## Recommended Schema Additions

### 1. VendorProfile Enhancements

Add to existing `vendor_profiles` table:

```sql
-- Commercial Information
pricing_model JSONB  -- ["fixed_fee", "percentage_based", "hourly", "package"]
starting_price DECIMAL(15,2)
price_range_min DECIMAL(15,2)
price_range_max DECIMAL(15,2)
payment_terms TEXT  -- "50% advance, 50% on delivery"
travel_cost_terms TEXT  -- "Included within 50km, ₹5000/day beyond"

-- Style & USP
style_usp TEXT  -- Long description
working_style TEXT  -- How they work
decor_policy ENUM('in_house_external_allowed', 'no_in_house_external_allowed', 'only_in_house')

-- Coverage
coverage_cities JSONB  -- ["Delhi", "Mumbai", "Jaipur"]
open_to_destination_wedding BOOLEAN DEFAULT false

-- Services Offered
services_offered JSONB  -- ["vendor_sourcing", "event_planning", "rsvp_management"]

-- Cancellation Policies
cancellation_policy_user ENUM('partial_refund', 'no_refund', 'no_refund_date_adjust', 'full_refund')
cancellation_policy_vendor ENUM('partial_refund', 'no_refund', 'full_refund')
cancellation_terms TEXT  -- Detailed terms

-- Delivery & Timeline
delivery_time VARCHAR(100)  -- "2-3 weeks", "1 month"
offerings TEXT  -- Comma-separated or JSONB

-- Team
team_description TEXT  -- "By the photography team"
team_size INTEGER
```

### 2. New Table: `vendor_faqs`

```sql
CREATE TABLE vendor_faqs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT FK → users,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);
```

### 3. New Table: `real_weddings` (Optional)

Separate from portfolios - actual wedding coverage:

```sql
CREATE TABLE real_weddings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT FK → users,
  portfolio_id BIGINT FK → portfolios,
  couple_name VARCHAR(200),
  wedding_date DATE,
  venue_name VARCHAR(200),
  city_id INTEGER FK → cities,
  wedding_type VARCHAR(100),  -- "Destination", "Traditional", etc.
  description TEXT,
  cover_image VARCHAR(500),
  storage_type ENUM(...),
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status ENUM('draft', 'published') DEFAULT 'draft',
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);
```

### 4. Portfolio Enhancements

Add to existing `portfolios` table:

```sql
-- Album metadata (if not using separate albums table)
shot_in_location VARCHAR(200)  -- "Shot in Jaipur"
tagline VARCHAR(500)  -- Short description for album
last_updated TIMESTAMP  -- Track content updates
```

---

## Proposed WedConnect Structure

### Registration Flow (Simplified)

**Step 1: Account Creation**
- Email, Password
- Role selection (Vendor/Consumer)

**Step 2: Basic Profile** (from Users + UserProfile)
- Full Name
- Phone Number
- WhatsApp Number (optional)

**Step 3: Vendor Profile** (from VendorProfile)
- Business Name
- Vendor Category
- Base City
- Business Description
- Contact Person Name (optional)

**Step 4: Business Details** (from VendorProfile - NEW FIELDS)
- Pricing Model (fixed/percentage/hourly/package)
- Starting Price / Price Range
- Payment Terms
- Services Offered (multi-select)
- Coverage Cities (multi-city)
- Open to Destination Wedding (yes/no)

**Step 5: Policies & Terms** (from VendorProfile - NEW FIELDS)
- Cancellation Policy (user cancels)
- Cancellation Policy (vendor cancels)
- Detailed Cancellation Terms
- Travel Cost Terms
- Delivery Time

**Step 6: Style & USP** (from VendorProfile - NEW FIELDS)
- Style USP
- Working Style
- Decor Policy (if applicable)
- Team Description
- Team Size

**Step 7: Social & Web Links** (from VendorProfile - EXISTING)
- Website
- Facebook
- Instagram
- YouTube

**Step 8: Create First Portfolio** (from Portfolios)
- Portfolio Title
- Description
- Location (state, city, address)
- Cover Image

**Step 9: Add Media** (from PortfolioAlbums + PortfolioMedia)
- Create albums
- Upload photos/videos
- Set display order

**Step 10: Post-Registration Actions**
- Add FAQs (new table)
- Submit Real Wedding (optional new table)
- Invite clients for reviews

---

## Public Display Structure

### Portfolio Page

**Header:**
- Business Name
- Location + View on Map
- Photo Count
- Actions: Favorite, Write Review, Share

**Tabs:**

1. **Works** (Default)
   - Grid view of all media
   - Filter: All / Photos / Videos
   - Albums dropdown

2. **Albums**
   - Album cards with:
     - Cover image
     - Title
     - Shot in (location)
     - Tagline
     - Last updated
     - Media count

3. **About**
   - Business name + location
   - Description
   - Team description
   - Services offered (with icons/bullets)
   - Working style
   - Style USP
   - Open to destination wedding
   - **Business Info:**
     - Joined since
     - Payment terms
     - Travel cost terms
     - Delivery time
     - Coverage cities
     - Pricing model
     - Cancellation policy summary

4. **Reviews**
   - Customer reviews with ratings
   - Average rating
   - Rating distribution

5. **FAQs** (New)
   - Common questions and answers

6. **Real Weddings** (Optional)
   - Actual wedding coverage
   - Couple stories

---

## Implementation Priority

### Phase 1: Critical Missing Features (HIGH Priority)

1. **Commercial Information**
   - Add pricing model fields to VendorProfile
   - Add payment terms, travel cost terms
   - Update registration flow

2. **Services Offered**
   - Add services_offered JSONB to VendorProfile
   - Create service options list
   - Multi-select UI in registration

3. **Coverage Cities**
   - Add coverage_cities JSONB to VendorProfile
   - Multi-city selector in registration
   - Display on portfolio page

### Phase 2: Important Features (MEDIUM Priority)

1. **Cancellation Policies**
   - Add cancellation policy fields to VendorProfile
   - Display on About tab

2. **Style & USP**
   - Add style_usp, working_style, decor_policy to VendorProfile
   - Display on About tab

3. **Delivery & Timeline**
   - Add delivery_time, offerings to VendorProfile
   - Display on About tab

4. **Real Weddings** (Optional)
   - Create real_weddings table
   - Separate section from portfolios

### Phase 3: Nice-to-Have Features (LOW Priority)

1. **Vendor FAQs**
   - Create vendor_faqs table
   - FAQ management UI
   - Display on portfolio page

2. **Team Information**
   - Add team_description, team_size to VendorProfile
   - Display on About tab

3. **Destination Wedding Flag**
   - Add open_to_destination_wedding to VendorProfile
   - Display on About tab

---

## Key Differences & Advantages

### WedConnect Advantages

1. **Subscription-Based Model** ✅
   - Tiered plans with quotas
   - Featured/Boosted portfolios
   - Platform recommendation
   - Clear monetization

2. **One Subscription = One Portfolio** ✅
   - Simpler for vendors
   - Focus on quality over quantity
   - Better user experience

3. **Flexible Storage** ✅
   - Multiple storage backends
   - Cloudinary integration
   - Local storage for development

4. **Advanced Features** ✅
   - Republish with cooldown
   - Auto-approval for premium plans
   - Rating normalization
   - Soft delete support

### Competitor Advantages

1. **Comprehensive Business Info** ⚠️
   - More detailed commercial terms
   - Cancellation policies
   - Service offerings

2. **Real Weddings Section** ⚠️
   - Separate from portfolio
   - Actual wedding stories

3. **Vendor FAQs** ⚠️
   - Self-service Q&A

---

## Recommendations

### Must-Have Additions

1. **Add to VendorProfile:**
   ```sql
   pricing_model JSONB
   starting_price DECIMAL(15,2)
   payment_terms TEXT
   travel_cost_terms TEXT
   services_offered JSONB
   coverage_cities JSONB
   cancellation_policy_user ENUM(...)
   cancellation_policy_vendor ENUM(...)
   cancellation_terms TEXT
   delivery_time VARCHAR(100)
   ```

2. **Update Registration Flow:**
   - Add business details step
   - Add policies & terms step
   - Add services selection

3. **Update Portfolio Display:**
   - Add "About" tab with business info
   - Display services offered
   - Show coverage cities
   - Display payment/cancellation terms

### Optional Additions

1. **Create vendor_faqs table**
2. **Create real_weddings table**
3. **Add team_description to VendorProfile**

---

## Next Steps

1. Review and approve schema additions
2. Create migrations for new fields
3. Update VendorProfile model
4. Update registration flow
5. Update portfolio display pages
6. Create admin UI for new fields

Would you like me to proceed with creating the migrations for these additions?
