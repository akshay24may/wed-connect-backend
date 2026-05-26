-- SQL Script to Apply Portfolio Table Changes
-- Run this on existing databases to add boost, recommendation, and rating normalization columns

-- Remove locality column (keeping only address)
ALTER TABLE portfolios DROP COLUMN IF EXISTS locality;

-- Add internal_notes column
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Add boost columns
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS is_boosted BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS boosted_until TIMESTAMP;

-- Add recommendation columns
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS recommended_at TIMESTAMP;

-- Add rating normalization columns
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3, 2) NOT NULL DEFAULT 0.00;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS total_reviews INTEGER NOT NULL DEFAULT 0;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS rating_distribution JSONB NOT NULL DEFAULT '{"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}';

-- Add comments for rating columns
COMMENT ON COLUMN portfolios.average_rating IS 'Average rating (0.00 to 5.00)';
COMMENT ON COLUMN portfolios.total_reviews IS 'Total number of reviews';
COMMENT ON COLUMN portfolios.rating_distribution IS 'Rating distribution by star count';
COMMENT ON COLUMN portfolios.internal_notes IS 'Internal admin/staff notes about this portfolio';

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_portfolios_is_boosted ON portfolios(is_boosted);
CREATE INDEX IF NOT EXISTS idx_portfolios_is_recommended ON portfolios(is_recommended);
CREATE INDEX IF NOT EXISTS idx_portfolios_average_rating ON portfolios(average_rating);
CREATE INDEX IF NOT EXISTS idx_portfolios_total_reviews ON portfolios(total_reviews);

-- Add check constraints for rating fields
ALTER TABLE portfolios ADD CONSTRAINT IF NOT EXISTS check_average_rating_range 
  CHECK (average_rating >= 0 AND average_rating <= 5);

ALTER TABLE portfolios ADD CONSTRAINT IF NOT EXISTS check_total_reviews_non_negative 
  CHECK (total_reviews >= 0);

-- Verify changes
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_name = 'portfolios'
  AND column_name IN (
    'is_boosted', 'boosted_until', 
    'is_recommended', 'recommended_at',
    'average_rating', 'total_reviews', 'rating_distribution',
    'internal_notes'
  )
ORDER BY ordinal_position;
