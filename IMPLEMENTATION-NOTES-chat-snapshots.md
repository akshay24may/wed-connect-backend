# Chat Room Name Snapshots - Implementation Guide

## Overview
The `chat_rooms` table now has `consumer_snapshot` and `vendor_snapshot` fields to preserve user names even after account deletion.

## Strategy
**Populate snapshots ONLY when user is deleted** (not at chat creation time)

## Implementation Options

### Option 1: Application-Level Hook (Recommended)
Add a `beforeDestroy` hook to the User model:

```javascript
// In src/models/User.js
hooks: {
  beforeDestroy: async (user, options) => {
    const { ChatRoom } = sequelize.models;
    
    // Update consumer_snapshot for all rooms where user is consumer
    await ChatRoom.update(
      { consumerSnapshot: user.fullName },
      { 
        where: { 
          consumerId: user.id,
          consumerSnapshot: null 
        }
      }
    );
    
    // Update vendor_snapshot for all rooms where user is vendor
    await ChatRoom.update(
      { vendorSnapshot: user.fullName },
      { 
        where: { 
          vendorId: user.id,
          vendorSnapshot: null 
        }
      }
    );
  }
}
```

### Option 2: Database Trigger (Alternative)
Create PostgreSQL triggers:

```sql
-- Trigger function
CREATE OR REPLACE FUNCTION snapshot_user_name_in_chat_rooms()
RETURNS TRIGGER AS $$
BEGIN
  -- Update consumer snapshot
  UPDATE chat_rooms 
  SET consumer_snapshot = OLD.full_name
  WHERE consumer_id = OLD.id 
    AND consumer_snapshot IS NULL;
  
  -- Update vendor snapshot
  UPDATE chat_rooms 
  SET vendor_snapshot = OLD.full_name
  WHERE vendor_id = OLD.id 
    AND vendor_snapshot IS NULL;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to users table
CREATE TRIGGER before_user_delete
BEFORE DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION snapshot_user_name_in_chat_rooms();
```

## Display Logic

In your chat room display code:

```javascript
// Get display name for consumer
const consumerName = room.consumerSnapshot || room.consumer?.fullName || '[Deleted User]';

// Get display name for vendor
const vendorName = room.vendorSnapshot || room.vendor?.fullName || '[Deleted User]';
```

## Benefits
- ✅ No stale data during normal operation
- ✅ Names preserved when user deleted
- ✅ Minimal storage (only for deleted users)
- ✅ Always shows current name for active users

## Testing
1. Create a chat room between two users
2. Verify snapshot fields are NULL
3. Delete one user (soft delete)
4. Verify snapshot is populated with user's name
5. Display chat room - should show snapshot name
