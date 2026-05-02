# Chat Message Status & Edit History

## Message Delivery & Read Status

Chat messages now support three status levels (like WhatsApp):

### Status Flow
1. **Sent** - Message created (created_at timestamp)
2. **Delivered** - Message received by recipient's device (delivered_at timestamp)
3. **Read** - Message opened/viewed by recipient (read_at timestamp, is_read = true)

### Database Fields
```javascript
{
  created_at: '2025-04-14T10:00:00Z',    // Message sent
  delivered_at: '2025-04-14T10:00:05Z',  // Message delivered (5 seconds later)
  read_at: '2025-04-14T10:02:30Z',       // Message read (2.5 minutes later)
  is_read: true                           // Quick boolean check
}
```

### Implementation

#### When Message is Sent
```javascript
await ChatMessage.create({
  chatRoomId,
  senderId,
  messageText,
  messageType: 'text'
  // created_at auto-populated
  // delivered_at: null
  // read_at: null
  // is_read: false
});
```

#### When Message is Delivered (Socket.IO)
```javascript
// Recipient's device receives message
socket.on('message_received', async (messageId) => {
  await ChatMessage.update(
    { deliveredAt: new Date() },
    { where: { id: messageId } }
  );
  
  // Emit to sender
  io.to(senderSocketId).emit('message_delivered', { messageId });
});
```

#### When Message is Read
```javascript
// Recipient opens chat or views message
await ChatMessage.update(
  { 
    isRead: true,
    readAt: new Date()
  },
  { 
    where: { 
      chatRoomId,
      isRead: false,
      senderId: { [Op.ne]: currentUserId }  // Don't mark own messages as read
    }
  }
);

// Update unread count
await ChatRoom.decrement('unreadCountConsumer', {
  where: { id: chatRoomId }
});
```

### UI Display Logic

```javascript
// Single tick (sent)
if (!message.deliveredAt && !message.readAt) {
  return '✓';
}

// Double tick (delivered)
if (message.deliveredAt && !message.readAt) {
  return '✓✓';
}

// Blue double tick (read)
if (message.readAt) {
  return '✓✓' (blue color);
}
```

### Query Examples

```javascript
// Get undelivered messages
const undelivered = await ChatMessage.findAll({
  where: {
    chatRoomId,
    deliveredAt: null
  }
});

// Get unread messages count
const unreadCount = await ChatMessage.count({
  where: {
    chatRoomId,
    isRead: false,
    senderId: { [Op.ne]: currentUserId }
  }
});

// Mark all messages as delivered
await ChatMessage.update(
  { deliveredAt: new Date() },
  {
    where: {
      chatRoomId,
      deliveredAt: null
    }
  }
);
```

### Socket.IO Events

```javascript
// Server emits
socket.emit('message_sent', { messageId, createdAt });
socket.emit('message_delivered', { messageId, deliveredAt });
socket.emit('message_read', { messageId, readAt });

// Client listens
socket.on('message_delivered', (data) => {
  // Update UI to show double tick
});

socket.on('message_read', (data) => {
  // Update UI to show blue double tick
});
```

### Privacy Considerations

Users may want to disable read receipts:
```javascript
// In user_notification_preferences table
{
  userId,
  showReadReceipts: false  // Don't send read_at updates
}
```

If disabled:
- `delivered_at` still updates (can't be disabled)
- `read_at` stays null
- `is_read` stays false
- Sender sees only double tick (delivered), never blue tick (read)

### Performance Tips

1. **Batch updates**: Update multiple messages at once when opening chat
2. **Index**: `idx_chat_messages_unread` on (chat_room_id, is_read)
3. **Socket rooms**: Join users to room-specific channels for efficient delivery
4. **Debounce**: Don't send read receipt for every scroll, batch them

### Benefits

- ✅ Better user experience (message status visibility)
- ✅ Delivery confirmation (message reached recipient)
- ✅ Read confirmation (message was seen)
- ✅ Privacy control (can disable read receipts)
- ✅ Analytics (delivery rates, read rates)


---

## Message Edit History

Messages can be edited, and the full edit history is stored in a JSONB column.

### Edit History Structure

```javascript
{
  editHistory: [
    {
      previousText: "Original message text",
      editedAt: "2025-04-14T10:05:00Z",
      editedBy: 123  // userId
    },
    {
      previousText: "First edited version",
      editedAt: "2025-04-14T10:10:00Z",
      editedBy: 123
    }
  ]
}
```

### Automatic Tracking with Hook

The `beforeUpdate` hook automatically tracks edits:

```javascript
// Edit a message
await message.update(
  { messageText: "Updated message text" },
  { userId: currentUserId }  // Pass userId in options
);

// Hook automatically adds to editHistory:
// {
//   previousText: "Old text",
//   editedAt: "2025-04-14T10:05:00Z",
//   editedBy: 123
// }
```

### Manual Edit (without hook)

```javascript
await message.update(
  { messageText: "New text" },
  { skipEditHistory: true }  // Skip automatic tracking
);
```

### Querying Edit History

```javascript
// Get message with edit history
const message = await ChatMessage.findByPk(messageId);

if (message.editHistory && message.editHistory.length > 0) {
  console.log(`Message edited ${message.editHistory.length} times`);
  console.log('Original text:', message.editHistory[0].previousText);
  console.log('Last edit:', message.editHistory[message.editHistory.length - 1]);
}

// Check if message was edited
const wasEdited = message.editHistory && message.editHistory.length > 0;
```

### UI Display

```javascript
// Show "edited" indicator
if (message.editHistory?.length > 0) {
  return (
    <div>
      <p>{message.messageText}</p>
      <span className="edited-indicator">
        (edited)
      </span>
    </div>
  );
}

// Show edit history on click
const showEditHistory = () => {
  return message.editHistory.map((edit, index) => (
    <div key={index}>
      <p>Version {index + 1}: {edit.previousText}</p>
      <small>Edited at {edit.editedAt}</small>
    </div>
  ));
};
```

### Edit Time Limit

Implement a time limit for edits (e.g., 15 minutes):

```javascript
const canEdit = (message) => {
  const fifteenMinutes = 15 * 60 * 1000;
  const messageAge = Date.now() - new Date(message.createdAt).getTime();
  return messageAge < fifteenMinutes;
};

// In controller
if (!canEdit(message)) {
  return errorResponse(res, 'Edit time limit exceeded', 400);
}
```

### Edit Restrictions

```javascript
// Only sender can edit
if (message.senderId !== currentUserId) {
  return errorResponse(res, 'You can only edit your own messages', 403);
}

// Cannot edit system messages
if (message.messageType === 'system') {
  return errorResponse(res, 'System messages cannot be edited', 400);
}

// Cannot edit if message was read (optional)
if (message.isRead) {
  return errorResponse(res, 'Cannot edit read messages', 400);
}
```

### Benefits

- ✅ Full audit trail of message changes
- ✅ Transparency (users can see edit history)
- ✅ Accountability (who edited and when)
- ✅ Dispute resolution (original text preserved)
- ✅ Automatic tracking via hook
- ✅ Flexible (can skip tracking when needed)

### Storage Considerations

- Edit history stored as JSONB (efficient, queryable)
- Only stores previous versions (current text in messageText field)
- Minimal storage overhead (only text + timestamp + userId per edit)
- Can add retention policy (e.g., keep only last 5 edits)

### Example: Retention Policy

```javascript
// Keep only last 5 edits
hooks: {
  beforeUpdate: async (message, options) => {
    if (message.changed('messageText') && !options.skipEditHistory) {
      const currentHistory = message.editHistory || [];
      const newEdit = {
        previousText: message._previousDataValues.messageText,
        editedAt: new Date().toISOString(),
        editedBy: options.userId || message.senderId
      };
      
      // Keep only last 5 edits
      const updatedHistory = [...currentHistory, newEdit].slice(-5);
      message.editHistory = updatedHistory;
    }
  }
}
```
