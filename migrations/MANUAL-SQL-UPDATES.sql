-- ============================================================================
-- MANUAL SQL UPDATES FOR SUBSCRIPTION MODULE CORRECTIONS
-- Run these commands directly on your database
-- ============================================================================

-- 1. Fix city_tier datatype in subscription_plans
-- ============================================================================
ALTER TABLE subscription_plans 
  ALTER COLUMN city_tier TYPE VARCHAR(20);

-- Update existing data if any (convert integer to string format)
-- UPDATE subscription_plans SET city_tier = 'tier_' || city_tier WHERE city_tier NOT LIKE 'tier_%';

COMMENT ON COLUMN subscription_plans.city_tier IS 'City tier: tier_1, tier_2, tier_3, tier_4, tier_5';


-- 2. Fix city_tier datatype in user_subscriptions
-- ============================================================================
ALTER TABLE user_subscriptions 
  ALTER COLUMN city_tier TYPE VARCHAR(20);

-- Update existing data if any (convert integer to string format)
-- UPDATE user_subscriptions SET city_tier = 'tier_' || city_tier WHERE city_tier NOT LIKE 'tier_%';

COMMENT ON COLUMN user_subscriptions.city_tier IS 'Snapshot: City tier (tier_1, tier_2, tier_3, tier_4, tier_5)';


-- 3. Add city_tier to portfolios table
-- ============================================================================
ALTER TABLE portfolios 
  ADD COLUMN city_tier VARCHAR(20);

COMMENT ON COLUMN portfolios.city_tier IS 'City tier from cities table (tier_1, tier_2, tier_3, tier_4, tier_5)';

-- Populate city_tier from cities table for existing portfolios
UPDATE portfolios p
SET city_tier = c.city_tier
FROM cities c
WHERE p.city_id = c.id;

-- Now make it NOT NULL after populating
ALTER TABLE portfolios 
  ALTER COLUMN city_tier SET NOT NULL;


-- 4. Add is_free_plan_portfolio to portfolios table
-- ============================================================================
ALTER TABLE portfolios 
  ADD COLUMN is_free_plan_portfolio BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN portfolios.is_free_plan_portfolio IS 'Whether this portfolio was created using a free plan';

-- Populate is_free_plan_portfolio from user_subscriptions for existing portfolios
UPDATE portfolios p
SET is_free_plan_portfolio = CASE 
  WHEN us.final_price = 0 THEN true 
  ELSE false 
END
FROM user_subscriptions us
WHERE p.user_subscription_id = us.id;


-- 5. Add indexes for new portfolio columns
-- ============================================================================
CREATE INDEX idx_portfolios_city_tier ON portfolios(city_tier);
CREATE INDEX idx_portfolios_is_free_plan ON portfolios(is_free_plan_portfolio);
CREATE INDEX idx_portfolios_category_tier_status ON portfolios(category_id, city_tier, status);


-- 6. Add check constraint for city_tier values
-- ============================================================================
ALTER TABLE portfolios 
  ADD CONSTRAINT check_city_tier_valid 
  CHECK (city_tier IN ('tier_1', 'tier_2', 'tier_3', 'tier_4', 'tier_5'));


-- 7. Create trigger to auto-populate city_tier from cities table
-- ============================================================================
CREATE OR REPLACE FUNCTION set_portfolio_city_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-populate city_tier from cities table
  SELECT city_tier INTO NEW.city_tier
  FROM cities
  WHERE id = NEW.city_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_portfolio_city_tier
  BEFORE INSERT OR UPDATE OF city_id ON portfolios
  FOR EACH ROW
  EXECUTE FUNCTION set_portfolio_city_tier();


-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify city_tier datatype changes
SELECT 
  table_name, 
  column_name, 
  data_type, 
  character_maximum_length
FROM information_schema.columns
WHERE table_name IN ('subscription_plans', 'user_subscriptions', 'portfolios')
  AND column_name = 'city_tier';

-- Verify new portfolio columns
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_name = 'portfolios'
  AND column_name IN ('city_tier', 'is_free_plan_portfolio');

-- Verify indexes
SELECT 
  indexname, 
  tablename, 
  indexdef
FROM pg_indexes
WHERE tablename = 'portfolios'
  AND indexname LIKE '%city_tier%' OR indexname LIKE '%free_plan%';

-- Verify trigger
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'trigger_set_portfolio_city_tier';
