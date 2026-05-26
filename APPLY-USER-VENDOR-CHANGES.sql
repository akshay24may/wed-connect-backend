-- =====================================================
-- ADD VENDOR VERIFICATION COLUMNS TO USERS TABLE
-- =====================================================
-- Run this script on existing databases to add vendor verification columns
-- This eliminates the need for vendor_profiles table

-- Step 1: Add vendor verification columns to users table
ALTER TABLE users ADD COLUMN is_verified_vendor BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN verified_at TIMESTAMP;
ALTER TABLE users ADD COLUMN verification_badge_type VARCHAR(20) CHECK (verification_badge_type IN ('basic', 'premium', 'elite'));
ALTER TABLE users ADD COLUMN trust_score DECIMAL(3,2) DEFAULT 0.00;

-- Step 2: Add indexes for vendor columns
CREATE INDEX idx_users_is_verified_vendor ON users(is_verified_vendor);
CREATE INDEX idx_users_verification_badge_type ON users(verification_badge_type);
CREATE INDEX idx_users_trust_score ON users(trust_score);

-- Step 3: Migrate data from vendor_profiles to users (if vendor_profiles exists)
-- Uncomment and run this if you have existing vendor_profiles data
/*
UPDATE users u
SET 
  is_verified_vendor = vp.is_verified_vendor,
  verified_at = vp.verified_at,
  verification_badge_type = vp.verification_badge_type,
  trust_score = vp.trust_score
FROM vendor_profiles vp
WHERE u.id = vp.user_id;
*/

-- Step 4: Drop vendor_profiles table (after data migration)
-- Uncomment and run this after confirming data migration is successful
/*
DROP TABLE IF EXISTS vendor_profiles;
*/

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name IN ('is_verified_vendor', 'verified_at', 'verification_badge_type', 'trust_score')
ORDER BY ordinal_position;

-- Check indexes
SELECT 
  indexname, 
  indexdef
FROM pg_indexes
WHERE tablename = 'users'
  AND indexname LIKE '%verified%'
ORDER BY indexname;
