-- ALTER SQL for chat_messages table refactoring
-- Run these queries on your existing database

-- 1. Add delivered_at column for message delivery tracking
ALTER TABLE chat_messages ADD COLUMN delivered_at TIMESTAMP;

-- 2. Replace edited_at with edit_history JSONB column
ALTER TABLE chat_messages DROP COLUMN IF EXISTS edited_at;
ALTER TABLE chat_messages ADD COLUMN edit_history JSONB;

-- 3. Change file_size_bytes from INTEGER to BIGINT
ALTER TABLE chat_messages ALTER COLUMN file_size_bytes TYPE BIGINT;

-- 2. Update message_type to ENUM (if it's currently STRING)
-- First, create the new ENUM type
CREATE TYPE message_type_enum AS ENUM ('text', 'image', 'video', 'location', 'system');

-- Update the column to use the ENUM
ALTER TABLE chat_messages 
  ALTER COLUMN message_type TYPE message_type_enum 
  USING message_type::message_type_enum;

-- 3. Update storage_type ENUM to include all 10 values
-- Drop the old ENUM type and create new one
ALTER TABLE chat_messages ALTER COLUMN storage_type DROP DEFAULT;
ALTER TABLE chat_messages ALTER COLUMN storage_type TYPE VARCHAR(50);

-- Create new ENUM type
CREATE TYPE storage_type_enum_new AS ENUM (
  'local',
  'cloudinary',
  'aws_s3',
  'cloudflare_r2',
  'gcs',
  'azure_blob',
  'digital_ocean',
  'backblaze_b2',
  'external',
  'other'
);

-- Update column to use new ENUM
ALTER TABLE chat_messages 
  ALTER COLUMN storage_type TYPE storage_type_enum_new 
  USING storage_type::storage_type_enum_new;

-- 4. Update system_event_type to ENUM
CREATE TYPE system_event_type_enum AS ENUM (
  'offer_made',
  'offer_accepted',
  'offer_rejected',
  'inquiry_sent',
  'contact_requested',
  'contact_shared',
  'user_blocked',
  'room_created'
);

ALTER TABLE chat_messages 
  ALTER COLUMN system_event_type TYPE system_event_type_enum 
  USING system_event_type::system_event_type_enum;

-- Note: If you get errors about existing ENUM types, you may need to:
-- 1. Drop the old ENUM types first
-- 2. Or use different names for the new ENUM types
