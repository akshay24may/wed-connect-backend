-- ============================================
-- SUBSCRIPTION TABLES REFACTORING
-- Run these SQL commands directly on your database
-- ============================================

-- IMPORTANT: One subscription = One portfolio
-- This means max_featured_portfolios and max_boosted_portfolios become boolean flags

-- STEP 1: Add new fields to subscription_plans
-- ============================================

ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS category_slug VARCHAR(100);

ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS max_albums_per_portfolio INTEGER NOT NULL DEFAULT 0;

ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS max_photos_per_album INTEGER NOT NULL DEFAULT 0;

ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS max_videos_per_album INTEGER NOT NULL DEFAULT 0;

ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS allow_videos BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS is_featured_allowed BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS is_boosted_allowed BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS can_be_recommended BOOLEAN NOT NULL DEFAULT false;

-- STEP 2: Remove unnecessary fields from subscription_plans
-- ============================================

ALTER TABLE subscription_plans 
DROP COLUMN IF EXISTS max_total_media_items;

ALTER TABLE subscription_plans 
DROP COLUMN IF EXISTS max_media_file_size_mb;

ALTER TABLE subscription_plans 
DROP COLUMN IF EXISTS max_image_width;

ALTER TABLE subscription_plans 
DROP COLUMN IF EXISTS max_image_height;

ALTER TABLE subscription_plans 
DROP COLUMN IF EXISTS platform_notes;

-- STEP 3: Rename max_featured_portfolios to is_featured_allowed (if exists)
-- ============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscription_plans' AND column_name = 'max_featured_portfolios'
  ) THEN
    -- Migrate data: if max_featured_portfolios > 0, set is_featured_allowed = true
    UPDATE subscription_plans SET is_featured_allowed = (max_featured_portfolios > 0);
    ALTER TABLE subscription_plans DROP COLUMN max_featured_portfolios;
  END IF;
END $$;

-- STEP 4: Rename max_boosted_portfolios to is_boosted_allowed (if exists)
-- ============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscription_plans' AND column_name = 'max_boosted_portfolios'
  ) THEN
    -- Migrate data: if max_boosted_portfolios > 0, set is_boosted_allowed = true
    UPDATE subscription_plans SET is_boosted_allowed = (max_boosted_portfolios > 0);
    ALTER TABLE subscription_plans DROP COLUMN max_boosted_portfolios;
  END IF;
END $$;

-- STEP 5: Update category_slug from categories table
-- ============================================

UPDATE subscription_plans sp
SET category_slug = c.slug
FROM categories c
WHERE sp.category_id = c.id
  AND sp.category_slug IS NULL;

-- STEP 6: Update user_subscriptions table
-- ============================================

-- Add new snapshot fields
ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS max_albums_per_portfolio INTEGER NOT NULL DEFAULT 0;

ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS max_photos_per_album INTEGER NOT NULL DEFAULT 0;

ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS max_videos_per_album INTEGER NOT NULL DEFAULT 0;

ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS allow_videos BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS is_featured_allowed BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS is_boosted_allowed BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS can_be_recommended BOOLEAN NOT NULL DEFAULT false;

-- Remove unnecessary fields
ALTER TABLE user_subscriptions 
DROP COLUMN IF EXISTS max_total_media_items;

ALTER TABLE user_subscriptions 
DROP COLUMN IF EXISTS max_media_file_size_mb;

ALTER TABLE user_subscriptions 
DROP COLUMN IF EXISTS max_featured_portfolios;

ALTER TABLE user_subscriptions 
DROP COLUMN IF EXISTS portfolios_featured_count;

ALTER TABLE user_subscriptions 
DROP COLUMN IF EXISTS portfolios_boosted_count;

ALTER TABLE user_subscriptions 
DROP COLUMN IF EXISTS portfolios_published_count;

ALTER TABLE user_subscriptions 
DROP COLUMN IF EXISTS notes;

-- Add internal_notes
ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS internal_notes TEXT;

ALTER TABLE user_subscriptions 
DROP COLUMN IF EXISTS platform_notes;

-- Remove duplicate featured_days (keep only one)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_subscriptions' 
    AND column_name = 'featured_days'
    AND ordinal_position > (
      SELECT MIN(ordinal_position) 
      FROM information_schema.columns 
      WHERE table_name = 'user_subscriptions' 
      AND column_name = 'featured_days'
    )
  ) THEN
    -- This handles duplicate featured_days if it exists
    ALTER TABLE user_subscriptions DROP COLUMN featured_days;
    ALTER TABLE user_subscriptions ADD COLUMN featured_days INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Rename max_boosted_portfolios to is_boosted_allowed (if exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_subscriptions' AND column_name = 'max_boosted_portfolios'
  ) THEN
    UPDATE user_subscriptions SET is_boosted_allowed = (max_boosted_portfolios > 0);
    ALTER TABLE user_subscriptions DROP COLUMN max_boosted_portfolios;
  END IF;
END $$;

-- STEP 7: Add comments
-- ============================================

COMMENT ON COLUMN subscription_plans.is_featured_allowed IS 'Whether portfolio can be marked as featured';
COMMENT ON COLUMN subscription_plans.is_boosted_allowed IS 'Whether portfolio can be boosted';
COMMENT ON COLUMN subscription_plans.can_be_recommended IS 'Whether portfolio can be platform recommended';
COMMENT ON COLUMN subscription_plans.internal_notes IS 'Internal admin/staff notes about the plan';

COMMENT ON COLUMN user_subscriptions.is_featured_allowed IS 'Snapshot: Featured allowed';
COMMENT ON COLUMN user_subscriptions.is_boosted_allowed IS 'Snapshot: Boosted allowed';
COMMENT ON COLUMN user_subscriptions.can_be_recommended IS 'Snapshot: Can be platform recommended';
COMMENT ON COLUMN user_subscriptions.internal_notes IS 'Internal admin/staff notes about this subscription';

-- STEP 8: Verify changes
-- ============================================

SELECT 
  'subscription_plans' as table_name,
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'subscription_plans'
  AND column_name IN (
    'category_slug',
    'max_albums_per_portfolio',
    'max_photos_per_album',
    'max_videos_per_album',
    'allow_videos',
    'is_featured_allowed',
    'featured_days',
    'is_boosted_allowed',
    'boosted_days',
    'can_be_recommended'
  )
ORDER BY ordinal_position

UNION ALL

SELECT 
  'user_subscriptions' as table_name,
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_subscriptions'
  AND column_name IN (
    'max_albums_per_portfolio',
    'max_photos_per_album',
    'max_videos_per_album',
    'allow_videos',
    'is_featured_allowed',
    'featured_days',
    'is_boosted_allowed',
    'boosted_days',
    'can_be_recommended'
  )
ORDER BY ordinal_position;
