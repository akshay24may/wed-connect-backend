-- =====================================================
-- BUSINESS PROFILES TABLE CREATION
-- =====================================================
-- Run this script on existing databases to create business_profiles table
-- and rename is_verified_vendor to is_verified in users table

-- Step 1: Rename is_verified_vendor to is_verified in users table
ALTER TABLE users RENAME COLUMN is_verified_vendor TO is_verified;
DROP INDEX IF EXISTS idx_users_is_verified_vendor;
CREATE INDEX idx_users_is_verified ON users(is_verified);

-- Step 2: Create business_profiles table
CREATE TABLE business_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  
  -- Business Identity
  business_name VARCHAR(200) NOT NULL,
  business_tagline VARCHAR(500),
  business_logo VARCHAR(500),
  business_logo_storage_type VARCHAR(50) CHECK (business_logo_storage_type IN (
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

-- Step 3: Create indexes for business_profiles
CREATE INDEX idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX idx_business_profiles_business_name ON business_profiles(business_name);
CREATE INDEX idx_business_profiles_business_pan ON business_profiles(business_pan);
CREATE INDEX idx_business_profiles_gstin ON business_profiles(gstin);
CREATE INDEX idx_business_profiles_business_phone ON business_profiles(business_phone);
CREATE INDEX idx_business_profiles_whatsapp_mobile ON business_profiles(whatsapp_mobile);
CREATE INDEX idx_business_profiles_deleted_at ON business_profiles(deleted_at);

-- Step 4: Migrate data from vendor_profiles to business_profiles (if vendor_profiles exists)
-- Uncomment and run this if you have existing vendor_profiles data
/*
INSERT INTO business_profiles (
  user_id, business_name, business_logo, business_logo_storage_type,
  business_pan, gstin, business_registration_number, business_type,
  establishment_year, name_on_id, aadhar_number, pan_number,
  alternate_mobile_one, alternate_mobile_two, whatsapp_mobile,
  team_size, years_of_experience,
  business_hours, certifications, awards,
  website_url, facebook_url, instagram_url, youtube_url, linkedin_url,
  created_at, updated_at
)
SELECT 
  user_id, business_name, business_logo, business_media_storage_type,
  business_pan, gstin, business_registration_number, business_type,
  establishment_year, name_on_id, aadhar_number, pan_number,
  alternate_mobile_one, alternate_mobile_two, whatsapp_mobile,
  team_size, years_of_experience,
  business_hours, certifications, awards,
  website_url, facebook_url, instagram_url, youtube_url, linkedin_url,
  created_at, updated_at
FROM vendor_profiles;
*/

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Verify users table column rename
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name = 'is_verified';

-- Verify business_profiles table creation
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_name = 'business_profiles'
ORDER BY ordinal_position;

-- Check indexes
SELECT 
  indexname, 
  indexdef
FROM pg_indexes
WHERE tablename = 'business_profiles'
ORDER BY indexname;

-- Count records
SELECT COUNT(*) as business_profiles_count FROM business_profiles;
