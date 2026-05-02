-- ALTER SQL for chat_rooms table refactoring
-- Run these queries on your existing database

-- 1. Add snapshot columns
ALTER TABLE chat_rooms ADD COLUMN consumer_snapshot VARCHAR(150);
ALTER TABLE chat_rooms ADD COLUMN vendor_snapshot VARCHAR(150);

-- 2. Rename columns (listing → portfolio, buyer → consumer, seller → vendor)
ALTER TABLE chat_rooms RENAME COLUMN listing_id TO portfolio_id;
ALTER TABLE chat_rooms RENAME COLUMN buyer_id TO consumer_id;
ALTER TABLE chat_rooms RENAME COLUMN seller_id TO vendor_id;
ALTER TABLE chat_rooms RENAME COLUMN unread_count_buyer TO unread_count_consumer;
ALTER TABLE chat_rooms RENAME COLUMN unread_count_seller TO unread_count_vendor;
ALTER TABLE chat_rooms RENAME COLUMN is_important_buyer TO is_important_consumer;
ALTER TABLE chat_rooms RENAME COLUMN is_important_seller TO is_important_vendor;
ALTER TABLE chat_rooms RENAME COLUMN buyer_subscription_tier TO consumer_subscription_tier;
ALTER TABLE chat_rooms RENAME COLUMN seller_subscription_tier TO vendor_subscription_tier;
ALTER TABLE chat_rooms RENAME COLUMN buyer_requested_contact TO consumer_requested_contact;
ALTER TABLE chat_rooms RENAME COLUMN seller_shared_contact TO vendor_shared_contact;
ALTER TABLE chat_rooms RENAME COLUMN blocked_by_buyer TO blocked_by_consumer;
ALTER TABLE chat_rooms RENAME COLUMN blocked_by_seller TO blocked_by_vendor;
ALTER TABLE chat_rooms RENAME COLUMN reported_by_buyer TO reported_by_consumer;
ALTER TABLE chat_rooms RENAME COLUMN reported_by_seller TO reported_by_vendor;

-- 3. Drop old foreign key constraints
ALTER TABLE chat_rooms DROP CONSTRAINT IF EXISTS chat_rooms_listing_id_fkey;
ALTER TABLE chat_rooms DROP CONSTRAINT IF EXISTS chat_rooms_buyer_id_fkey;
ALTER TABLE chat_rooms DROP CONSTRAINT IF EXISTS chat_rooms_seller_id_fkey;

-- 4. Add new foreign key constraints
ALTER TABLE chat_rooms ADD CONSTRAINT chat_rooms_portfolio_id_fkey 
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE chat_rooms ADD CONSTRAINT chat_rooms_consumer_id_fkey 
  FOREIGN KEY (consumer_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE chat_rooms ADD CONSTRAINT chat_rooms_vendor_id_fkey 
  FOREIGN KEY (vendor_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- 5. Drop old unique constraint and indexes
ALTER TABLE chat_rooms DROP CONSTRAINT IF EXISTS unique_listing_buyer;
DROP INDEX IF EXISTS idx_chat_rooms_buyer;
DROP INDEX IF EXISTS idx_chat_rooms_seller;
DROP INDEX IF EXISTS idx_chat_rooms_listing;

-- 6. Add new unique constraint and indexes
ALTER TABLE chat_rooms ADD CONSTRAINT unique_portfolio_consumer UNIQUE (portfolio_id, consumer_id);
CREATE INDEX idx_chat_rooms_consumer ON chat_rooms (consumer_id, is_active);
CREATE INDEX idx_chat_rooms_vendor ON chat_rooms (vendor_id, is_active);
CREATE INDEX idx_chat_rooms_portfolio ON chat_rooms (portfolio_id);
