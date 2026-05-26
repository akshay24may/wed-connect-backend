-- =====================================================
-- Business Profile & Portfolio Module - Schema Changes
-- =====================================================
-- Run this script to apply all schema changes for:
-- - business_profiles table
-- - portfolios table
-- - portfolio_albums table
-- - portfolio_media table
-- - portfolio_reviews table
-- =====================================================

-- =====================================================
-- 1. BUSINESS PROFILES TABLE
-- =====================================================

-- Add contact_person_name column
ALTER TABLE business_profiles 
ADD COLUMN IF NOT EXISTS contact_person_name VARCHAR(150);

-- Add celebrity_weddings_handled column
ALTER TABLE business_profiles 
ADD COLUMN IF NOT EXISTS celebrity_weddings_handled TEXT;

-- Add business_banner column
ALTER TABLE business_profiles 
ADD COLUMN IF NOT EXISTS business_banner VARCHAR(500);

-- Rename business_logo_storage_type to business_media_storage_type
-- (Only if old column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'business_profiles' 
    AND column_name = 'business_logo_storage_type'
  ) THEN
    ALTER TABLE business_profiles 
    RENAME COLUMN business_logo_storage_type TO business_media_storage_type;
  END IF;
END $$;

-- =====================================================
-- 2. PORTFOLIOS TABLE
-- =====================================================

-- Add business_profile_id column
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS business_profile_id BIGINT;

-- Add foreign key constraint for business_profile_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'portfolios_business_profile_id_fkey'
  ) THEN
    ALTER TABLE portfolios 
    ADD CONSTRAINT portfolios_business_profile_id_fkey 
    FOREIGN KEY (business_profile_id) 
    REFERENCES business_profiles(id) 
    ON UPDATE CASCADE 
    ON DELETE RESTRICT;
  END IF;
END $$;

-- Add index for business_profile_id
CREATE INDEX IF NOT EXISTS idx_portfolios_business_profile_id 
ON portfolios(business_profile_id);

-- Add price_breakdown JSONB column
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS price_breakdown JSONB;

-- Add advance_percentage column
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS advance_percentage SMALLINT;

-- Add financial_terms JSONB column
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS financial_terms JSONB;

-- Add services_offered_tags JSONB column
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS services_offered_tags JSONB;

-- Add services_description TEXT column
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS services_description TEXT;

-- Add coverage_cities JSONB column
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS coverage_cities JSONB;

-- Rename open_to_destination_wedding to accepts_destination_wedding
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'portfolios' 
    AND column_name = 'open_to_destination_wedding'
  ) THEN
    ALTER TABLE portfolios 
    RENAME COLUMN open_to_destination_wedding TO accepts_destination_wedding;
  END IF;
END $$;

-- Add destination_wedding_fee_different column
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS destination_wedding_fee_different BOOLEAN DEFAULT false;

-- Change cancellation_policy_user to STRING (if it's ENUM)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'portfolios' 
    AND column_name = 'cancellation_policy_user'
    AND data_type = 'USER-DEFINED'
  ) THEN
    ALTER TABLE portfolios 
    ALTER COLUMN cancellation_policy_user TYPE VARCHAR(50);
  END IF;
END $$;

-- Add cancellation_policy_user column if not exists
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS cancellation_policy_user VARCHAR(50);

-- Change cancellation_policy_vendor to STRING (if it's ENUM)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'portfolios' 
    AND column_name = 'cancellation_policy_vendor'
    AND data_type = 'USER-DEFINED'
  ) THEN
    ALTER TABLE portfolios 
    ALTER COLUMN cancellation_policy_vendor TYPE VARCHAR(50);
  END IF;
END $$;

-- Add cancellation_policy_vendor column if not exists
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS cancellation_policy_vendor VARCHAR(50);

-- Add working_style TEXT column
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS working_style TEXT;

-- Add long_description TEXT column
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS long_description TEXT;

-- Change decor_policy to STRING (if it's ENUM)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'portfolios' 
    AND column_name = 'decor_policy'
    AND data_type = 'USER-DEFINED'
  ) THEN
    ALTER TABLE portfolios 
    ALTER COLUMN decor_policy TYPE VARCHAR(100);
  END IF;
END $$;

-- Add decor_policy column if not exists
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS decor_policy VARCHAR(100);

-- Add accepts_advance_booking column
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS accepts_advance_booking BOOLEAN DEFAULT true;

-- Add min_advance_booking_days column
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS min_advance_booking_days SMALLINT DEFAULT 7;

-- Add weddings_completed column
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS weddings_completed INTEGER DEFAULT 0;

-- Add happy_clients_count column
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS happy_clients_count INTEGER DEFAULT 0;

-- Add internal_notes column
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Make price_range_min NOT NULL (if it's nullable)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'portfolios' 
    AND column_name = 'price_range_min'
    AND is_nullable = 'YES'
  ) THEN
    -- Set default value for existing NULL rows
    UPDATE portfolios SET price_range_min = 0 WHERE price_range_min IS NULL;
    
    -- Make column NOT NULL
    ALTER TABLE portfolios 
    ALTER COLUMN price_range_min SET NOT NULL;
  END IF;
END $$;

-- Remove starting_price column if exists
ALTER TABLE portfolios 
DROP COLUMN IF EXISTS starting_price;

-- Remove style_usp column if exists
ALTER TABLE portfolios 
DROP COLUMN IF EXISTS style_usp;

-- Remove payment_terms column if exists
ALTER TABLE portfolios 
DROP COLUMN IF EXISTS payment_terms;

-- Remove travel_cost_terms column if exists
ALTER TABLE portfolios 
DROP COLUMN IF EXISTS travel_cost_terms;

-- Remove delivery_timeline column if exists
ALTER TABLE portfolios 
DROP COLUMN IF EXISTS delivery_timeline;

-- Remove cancellation_terms column if exists
ALTER TABLE portfolios 
DROP COLUMN IF EXISTS cancellation_terms;

-- Remove offerings column if exists
ALTER TABLE portfolios 
DROP COLUMN IF EXISTS offerings;

-- =====================================================
-- 3. PORTFOLIO ALBUMS TABLE
-- =====================================================

-- Rename cover_photo_storage_type to cover_photos_storage_type
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'portfolio_albums' 
    AND column_name = 'cover_photo_storage_type'
  ) THEN
    ALTER TABLE portfolio_albums 
    RENAME COLUMN cover_photo_storage_type TO cover_photos_storage_type;
  END IF;
END $$;

-- =====================================================
-- 4. PORTFOLIO MEDIA TABLE
-- =====================================================

-- No changes needed - table structure is correct

-- =====================================================
-- 5. PORTFOLIO REVIEWS TABLE
-- =====================================================

-- No changes needed - table structure is correct

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify business_profiles columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'business_profiles' 
ORDER BY ordinal_position;

-- Verify portfolios columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'portfolios' 
ORDER BY ordinal_position;

-- Verify portfolio_albums columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'portfolio_albums' 
ORDER BY ordinal_position;

-- Verify portfolio_media columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'portfolio_media' 
ORDER BY ordinal_position;

-- Verify portfolio_reviews columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'portfolio_reviews' 
ORDER BY ordinal_position;

-- =====================================================
-- END OF SCRIPT
-- =====================================================
