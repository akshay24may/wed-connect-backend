# Migration Guide: Unified Moderation Reports

## Overview
Replaced separate `portfolio_reports` and `user_reports` tables with a single polymorphic `moderation_reports` table.

## Benefits
- ✅ Single moderation dashboard/queue
- ✅ Unified workflow for all report types
- ✅ Easy to add new reportable types (chat_message, review, etc.)
- ✅ Better analytics across all reports
- ✅ Consistent status and action tracking

## Polymorphic Design

### reportable_type + reportable_id
```javascript
// Portfolio report
{
  reportableType: 'portfolio',
  reportableId: 123,  // portfolio.id
  reportType: 'fake_portfolio',
  ...
}

// User report
{
  reportableType: 'user',
  reportableId: 456,  // user.id
  reportType: 'fake_profile',
  ...
}

// Future: Chat message report
{
  reportableType: 'chat_message',
  reportableId: 789,  // chat_message.id
  reportType: 'harassment',
  ...
}
```

## Usage Examples

### Creating Reports

```javascript
// Report a portfolio
await ModerationReport.create({
  reportableType: 'portfolio',
  reportableId: portfolioId,
  reportedBy: userId,
  reportType: 'fake_portfolio',
  reason: 'This portfolio contains fake images',
  relatedChatRoomId: chatRoomId  // optional context
});

// Report a user
await ModerationReport.create({
  reportableType: 'user',
  reportableId: reportedUserId,
  reportedBy: reporterId,
  reportType: 'scam',
  reason: 'User is asking for advance payment',
  relatedPortfolioId: portfolioId,  // optional context
  relatedChatRoomId: chatRoomId
});
```

### Querying Reports

```javascript
// Get all pending portfolio reports
const portfolioReports = await ModerationReport.findAll({
  where: {
    reportableType: 'portfolio',
    status: 'pending'
  },
  include: [
    { model: User, as: 'reporter' },
    { model: Portfolio, as: 'relatedPortfolio' }
  ]
});

// Get all reports for a specific portfolio
const reports = await ModerationReport.findAll({
  where: {
    reportableType: 'portfolio',
    reportableId: portfolioId
  }
});

// Get unified moderation queue (all types)
const allReports = await ModerationReport.findAll({
  where: { status: 'pending' },
  order: [
    ['priority', 'DESC'],
    ['created_at', 'ASC']
  ]
});
```

### Getting Reported Entity

```javascript
const report = await ModerationReport.findByPk(reportId);

// Polymorphic getter
const reportedEntity = await report.getReportable();

// Returns Portfolio, User, ChatMessage, or Review based on reportableType
if (report.reportableType === 'portfolio') {
  console.log(reportedEntity.title);
} else if (report.reportableType === 'user') {
  console.log(reportedEntity.fullName);
}
```

## Report Types by Reportable Type

### Portfolio Reports
- spam, fraud, duplicate, wrong_category, misleading, inappropriate_content, fake_portfolio, other

### User Reports
- scam, fake_profile, harassment, spam, offensive, non_responsive, other

### Chat Message Reports (future)
- harassment, offensive, spam, inappropriate_content, other

### Review Reports (future)
- fake_review, spam, offensive, other

## Status Flow
1. **pending** - New report submitted
2. **under_review** - Admin is investigating
3. **resolved** - Action taken
4. **dismissed** - No action needed

## Priority Levels
- **urgent** - Immediate attention required (harassment, scam)
- **high** - Important but not urgent
- **medium** - Normal priority (default)
- **low** - Can be reviewed later

## Action Types
- **none** - No action needed
- **content_removed** - Portfolio/message deleted
- **content_edited** - Content modified
- **user_warned** - Warning sent to user
- **user_suspended** - Temporary suspension
- **user_banned** - Permanent ban
- **false_report** - Reporter made false claim

## Migration from Old Tables

### Data Migration Script (if needed)
```javascript
// Migrate portfolio_reports
const portfolioReports = await PortfolioReport.findAll();
for (const report of portfolioReports) {
  await ModerationReport.create({
    reportableType: 'portfolio',
    reportableId: report.portfolioId,
    reportedBy: report.reportedBy,
    reportType: report.reportType,
    reason: report.reason,
    status: report.status,
    reviewedBy: report.reviewedBy,
    reviewedAt: report.reviewedAt,
    adminNotes: report.adminNotes,
    actionTaken: report.actionTaken,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt
  });
}

// Migrate user_reports
const userReports = await UserReport.findAll();
for (const report of userReports) {
  await ModerationReport.create({
    reportableType: 'user',
    reportableId: report.reportedUserId,
    reportedBy: report.reportedBy,
    reportType: report.reportType,
    reason: report.reason,
    context: report.context,
    relatedPortfolioId: report.relatedListingId,
    relatedChatRoomId: report.relatedChatRoomId,
    status: report.status,
    reviewedBy: report.reviewedBy,
    reviewedAt: report.reviewedAt,
    adminNotes: report.adminNotes,
    actionTaken: report.actionTaken,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt
  });
}
```

## Backward Compatibility

The old `PortfolioReport` and `UserReport` models are kept for backward compatibility but marked as deprecated. New code should use `ModerationReport`.

## Future Extensibility

Easy to add new reportable types:

```sql
-- Add new type to ENUM
ALTER TYPE reportable_type_enum ADD VALUE 'review';
ALTER TYPE reportable_type_enum ADD VALUE 'chat_message';
```

Then update model and you're done!
