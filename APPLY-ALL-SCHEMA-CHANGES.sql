-- =====================================================
-- APPLY ALL SCHEMA CHANGES TO EXISTING DATABASE
-- =====================================================
-- Run this script on existing databases to apply all changes
-- Execute in order: users → business_profiles → portfolios

-- =====================================================
-- STEP 1: UPDATE USERS TABLE
-- =====================================================

-- Rename is_verified_vendor to is_verified
ALTER TABLE users RENAME COLUMN is_verified_vendor TO is_verified;

-- Drop old index and create new one
DROP INDEX IF EXISTS idx_users_is_verified_vendor;
CREATE INDEX idx_users_is_verified ON users(is_verified);

-- =====================================================
-- STEP 2: CREATE BUSINESS_PROFILES TABLE
-- =====================================================

CREATE TABLE business_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  
  -- Business Identity
  business_name VARCHAR(200) NOT NULL,
  business_tagline VARCHAR(500),
  business_logo VARCHAR(500),
  business_banner VARCHAR(500),
  business_media_storage_type VARCHAR(50) CHECK (business_media_storage_type IN (
    'local', 'cloudinary', 'aws_s3', 'cloudflare_r2', 'gcs', 
    'azure_blob', 'digital_ocean', 'backblaze_b2', 'external', 'other'
  )),
  business_email VARCHAR(150),
  business_phone VARCHAR(15),
  
  -- Business Registration
  business_pan VARCHAR(10),
  gstin VARCHAR(15),
  business_registration_number VARCHAR(50),
  business_type VARCHAR(20) CHECK (business_type IN ('proprietorship', 'partnership', 'pvt_ltd', 'llp', 'other')),
  establishment_year SMALLINT,
  
  -- Identity Documents
  name_on_id VARCHAR(150),
  aadhar_number VARCHAR(12),
  pan_number VARCHAR(10),
  
  -- Contact Details
  alternate_mobile_one VARCHAR(15),
  alternate_mobile_two VARCHAR(15),
  whatsapp_mobile VARCHAR(15),
  
  -- Team Information
  team_description TEXT,
  team_size SMALLINT,
  years_of_experience SMALLINT,
  
  -- Business Hours & Achievements
  business_hours JSONB,
  certifications JSONB DEFAULT '[]'::jsonb,
  awards JSONB DEFAULT '[]'::jsonb,
  
  -- Social Links
  website_url VARCHAR(255),
  facebook_url VARCHAR(255),
  instagram_url VARCHAR(255),
  youtube_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  
  -- Audit Fields
  created_by BIGINT REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  updated_by BIGINT,
  deleted_by BIGINT REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Create indexes for business_profiles
CREATE INDEX idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX idx_business_profiles_business_name ON business_profiles(business_name);
CREATE INDEX idx_business_profiles_business_pan ON business_profiles(business_pan);
CREATE INDEX idx_business_profiles_gstin ON business_profiles(gstin);
CREATE INDEX idx_business_profiles_business_phone ON business_profiles(business_phone);
CREATE INDEX idx_business_profiles_whatsapp_mobile ON business_profiles(whatsapp_mobile);
CREATE INDEX idx_business_profiles_deleted_at ON business_profiles(deleted_at);

-- =====================================================
-- STEP 3: UPDATE PORTFOLIOS TABLE
-- =====================================================

-- Add business_profile_id column
ALTER TABLE portfolios ADD COLUMN business_profile_id BIGINT;
ALTER TABLE portfolios ADD CONSTRAINT fk_portfolios_business_profile_id 
  FOREIGN KEY (business_profile_id) REFERENCES business_profiles(id) 
  ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX idx_portfolios_business_profile_id ON portfolios(business_profile_id);

-- Remove starting_price (deprecated)
ALTER TABLE portfolios DROP COLUMN IF EXISTS starting_price;

-- Make price_range_min mandatory
ALTER TABLE portfolios ALTER COLUMN price_range_min SET NOT NULL;

-- Add pricing columns
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS price_breakdown JSONB;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS pricing_model JSONB;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS payment_terms TEXT;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS advance_percentage SMALLINT;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS travel_cost_terms TEXT;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS delivery_timeline VARCHAR(100);

-- Add services & coverage columns
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS services_offered JSONB;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS coverage_cities JSONB;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS open_to_destination_wedding BOOLEAN DEFAULT false;

-- Add cancellation policy columns
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS cancellation_policy_user VARCHAR(50) 
  CHECK (cancellation_policy_user IN ('partial_refund', 'no_refund', 'no_refund_date_adjust', 'full_refund'));
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS cancellation_policy_vendor VARCHAR(50) 
  CHECK (cancellation_policy_vendor IN ('partial_refund', 'no_refund', 'full_refund'));
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS cancellation_terms TEXT;

-- Add style & USP columns
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS style_usp TEXT;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS working_style TEXT;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS decor_policy VARCHAR(50) 
  CHECK (decor_policy IN ('in_house_external_allowed', 'no_in_house_external_allowed', 'only_in_house'));

-- Add booking settings columns
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS accepts_advance_booking BOOLEAN DEFAULT true;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS min_advance_booking_days SMALLINT DEFAULT 7;

-- Add portfolio metrics columns
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS weddings_completed INTEGER DEFAULT 0;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS happy_clients_count INTEGER DEFAULT 0;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS offerings TEXT;

-- =====================================================
-- STEP 4: MIGRATE DATA FROM VENDOR_PROFILES (IF EXISTS)
-- =====================================================

-- Check if vendor_profiles table exists and migrate data
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vendor_profiles') THEN
    -- Migrate to business_profiles
    INSERT INTO business_profiles (
      user_id, business_name, business_logo, business_banner, business_media_storage_type,
      business_pan, gstin, business_registration_number, business_type,
      establishment_year, name_on_id, aadhar_number, pan_number,
      alternate_mobile_one, alternate_mobile_two, whatsapp_mobile,
      team_size, years_of_experience,
      business_hours, certifications, awards,
      website_url, facebook_url, instagram_url, youtube_url, linkedin_url,
      created_at, updated_at
    )
    SELECT 
      user_id, business_name, business_logo, business_banner, business_media_storage_type,
      business_pan, gstin, business_registration_number, business_type,
      establishment_year, name_on_id, aadhar_number, pan_number,
      alternate_mobile_one, alternate_mobile_two, whatsapp_mobile,
      team_size, years_of_experience,
      business_hours, certifications, awards,
      website_url, facebook_url, instagram_url, youtube_url, linkedin_url,
      created_at, updated_at
    FROM vendor_profiles;
    
    -- Link portfolios to business_profiles
    UPDATE portfolios p
    SET business_profile_id = bp.id
    FROM business_profiles bp
    WHERE p.user_id = bp.user_id;
    
    RAISE NOTICE 'Data migrated from vendor_profiles to business_profiles';
  ELSE
    RAISE NOTICE 'vendor_profiles table does not exist, skipping migration';
  END IF;
END $$;

-- =====================================================
-- STEP 5: DROP VENDOR_PROFILES TABLE (OPTIONAL)
-- =====================================================

-- Uncomment to drop vendor_profiles after confirming migration
-- DROP TABLE IF EXISTS vendor_profiles;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify users table
SELECT 'users.is_verified' as check_name, 
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'is_verified'
  ) THEN '✓ EXISTS' ELSE '✗ MISSING' END as status;

-- Verify business_profiles table
SELECT 'business_profiles table' as check_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'business_profiles'
  ) THEN '✓ EXISTS' ELSE '✗ MISSING' END as status;

-- Verify portfolios.business_profile_id
SELECT 'portfolios.business_profile_id' as check_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'portfolios' AND column_name = 'business_profile_id'
  ) THEN '✓ EXISTS' ELSE '✗ MISSING' END as status;

-- Verify portfolios.starting_price removed
SELECT 'portfolios.starting_price removed' as check_name,
  CASE WHEN NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'portfolios' AND column_name = 'starting_price'
  ) THEN '✓ REMOVED' ELSE '✗ STILL EXISTS' END as status;

-- Count records
SELECT 'business_profiles count' as metric, COUNT(*) as value FROM business_profiles
UNION ALL
SELECT 'portfolios count' as metric, COUNT(*) as value FROM portfolios
UNION ALL
SELECT 'portfolios with business_profile_id' as metric, COUNT(*) as value 
FROM portfolios WHERE business_profile_id IS NOT NULL;
