# Portfolio Module - Quick Reference Guide

## 🚀 Quick Start

### 1. Apply Schema Changes
```bash
# Run SQL migration script
psql -U your_username -d wed_connect_db -f APPLY-BUSINESS-PORTFOLIO-SCHEMA.sql

# OR run Sequelize migrations
npx sequelize-cli db:migrate
```

### 2. Import Models
```javascript
import models from '#models/index.js';
const { BusinessProfile, Portfolio, PortfolioAlbum, PortfolioMedia, PortfolioReview } = models;
```

### 3. Import Constants
```javascript
import { 
  PORTFOLIO_STATUS, 
  CANCELLATION_POLICY_USER,
  DECOR_POLICY 
} from '#utils/constants/databaseEnums.js';

import { 
  validateJsonbField,
  FINANCIAL_TERMS_SCHEMA,
  PRICE_BREAKDOWN_SCHEMA 
} from '#utils/constants/databaseJsonbSchemas.js';
```

---

## 📊 Common Queries

### Business Profile

```javascript
// Create business profile
const businessProfile = await BusinessProfile.create({
  userId: 123,
  businessName: 'Dream Weddings Photography',
  businessTagline: 'Capturing your special moments',
  businessEmail: 'contact@dreamweddings.com',
  businessPhone: '9876543210',
  contactPersonName: 'John Doe',
  establishmentYear: 2015,
  teamSize: 5,
  yearsOfExperience: 8,
  businessHours: {
    monday: { open: '09:00', close: '18:00', closed: false },
    sunday: { closed: true }
  },
  certifications: [
    { name: 'Professional Photography', issuer: 'WPPI', year: 2018 }
  ],
  awards: [
    { name: 'Best Wedding Photographer', issuer: 'WedAwards', year: 2022 }
  ]
}, { userId: 123 });

// Get business profile with user
const profile = await BusinessProfile.findOne({
  where: { userId: 123 },
  include: [{ model: models.User, as: 'user' }]
});

// Update business profile
await businessProfile.update({
  businessTagline: 'New tagline',
  teamSize: 7
}, { userId: 123 });
```

---

### Portfolio

```javascript
// Create portfolio
const portfolio = await Portfolio.create({
  userId: 123,
  businessProfileId: 456,
  categoryId: 1,
  categorySlug: 'photography',
  title: 'Wedding Photography Package',
  description: 'Professional wedding photography services',
  priceRangeMin: 50000,
  priceRangeMax: 150000,
  priceBreakdown: {
    items: [
      { name: 'Full Day Coverage', price: 50000, unit: 'per day' },
      { name: 'Pre-wedding Shoot', price: 30000, unit: 'per session' }
    ],
    pricing_model: ['package', 'per_day']
  },
  advancePercentage: 50,
  financialTerms: {
    payment_terms: '50% advance, 50% on delivery',
    travel_cost_terms: 'Free within 50km, ₹10/km beyond',
    delivery_timeline: '4-6 weeks',
    cancellation_terms: 'No refund within 30 days'
  },
  servicesOfferedTags: ['wedding_day', 'pre_wedding', 'candid', 'traditional'],
  servicesDescription: 'We offer candid and traditional photography...',
  coverageCities: ['Delhi', 'Mumbai', 'Jaipur'],
  acceptsDestinationWedding: true,
  destinationWeddingFeeDifferent: true,
  cancellationPolicyUser: CANCELLATION_POLICY_USER.PARTIAL_REFUND,
  cancellationPolicyVendor: 'full_refund',
  workingStyle: 'We focus on candid moments and natural emotions...',
  longDescription: 'Detailed description about the service...',
  decorPolicy: DECOR_POLICY.IN_HOUSE_EXTERNAL_ALLOWED,
  acceptsAdvanceBooking: true,
  minAdvanceBookingDays: 30,
  weddingsCompleted: 150,
  happyClientsCount: 145,
  stateId: 1,
  cityId: 1,
  stateSlug: 'delhi',
  citySlug: 'new-delhi',
  status: PORTFOLIO_STATUS.DRAFT
}, { userId: 123 });

// Validate JSONB before saving
const { valid, errors } = validateJsonbField(
  'financial_terms', 
  financialTermsData, 
  FINANCIAL_TERMS_SCHEMA
);
if (!valid) {
  throw new Error(`Invalid financial terms: ${errors.join(', ')}`);
}

// Get portfolio with associations
const portfolio = await Portfolio.findByPk(portfolioId, {
  include: [
    { model: models.User, as: 'user' },
    { model: models.BusinessProfile, as: 'businessProfile' },
    { model: models.Category, as: 'category' },
    { model: models.PortfolioMedia, as: 'media' }
  ]
});

// Update portfolio
await portfolio.update({
  title: 'Updated Title',
  priceRangeMin: 60000
}, { userId: 123 });

// Republish portfolio
await portfolio.update({
  status: PORTFOLIO_STATUS.PUBLISHED
}, { 
  userId: 123,
  isRepublish: true  // Triggers republish tracking
});

// Search portfolios
const portfolios = await Portfolio.findAll({
  where: {
    status: PORTFOLIO_STATUS.PUBLISHED,
    categorySlug: 'photography',
    cityId: 1,
    priceRangeMin: { [Op.lte]: 100000 }
  },
  order: [['created_at', 'DESC']],
  limit: 20,
  offset: 0
});

// Get featured portfolios
const featured = await Portfolio.findAll({
  where: {
    status: PORTFOLIO_STATUS.PUBLISHED,
    isFeatured: true,
    featuredUntil: { [Op.gt]: new Date() }
  },
  order: [['featured_until', 'DESC']]
});
```

---

### Portfolio Media

```javascript
// Add media to portfolio
const media = await PortfolioMedia.create({
  portfolioId: 123,
  albumId: 456,
  mediaType: 'image',
  mediaUrl: 'uploads/portfolios/user-123/photo.jpg',
  thumbnailUrl: 'uploads/portfolios/user-123/thumb_photo.jpg',
  fileSizeBytes: 2048576,
  width: 1920,
  height: 1080,
  displayOrder: 1,
  isPrimary: true,
  storageType: 'local'
});

// Get portfolio media
const mediaList = await PortfolioMedia.findAll({
  where: { portfolioId: 123 },
  order: [['display_order', 'ASC']]
});

// Update display order
await PortfolioMedia.update(
  { displayOrder: 2 },
  { where: { id: mediaId } }
);
```

---

### Portfolio Reviews

```javascript
// Create review
const review = await PortfolioReview.create({
  portfolioId: 123,
  userId: 456,
  vendorId: 789,
  rating: 5,
  reviewTitle: 'Excellent Service!',
  reviewText: 'Amazing photography, highly recommended!',
  reviewMedia: [
    { url: 'uploads/reviews/photo1.jpg', type: 'image' }
  ],
  isVerifiedPurchase: true,
  isApproved: true
});

// Get portfolio reviews
const reviews = await PortfolioReview.findAll({
  where: { 
    portfolioId: 123,
    isApproved: true 
  },
  include: [
    { model: models.User, as: 'user' }
  ],
  order: [['created_at', 'DESC']]
});

// Vendor response
await review.update({
  vendorResponse: 'Thank you for your kind words!',
  vendorRespondedAt: new Date()
});

// Calculate average rating
const avgRating = await PortfolioReview.findOne({
  where: { portfolioId: 123, isApproved: true },
  attributes: [
    [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
    [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
  ]
});

// Update portfolio rating
await portfolio.update({
  averageRating: avgRating.avgRating,
  totalReviews: avgRating.totalReviews
});
```

---

## 🔧 Common Patterns

### 1. Enum Usage
```javascript
// ✅ Correct - Use constants
if (portfolio.status === PORTFOLIO_STATUS.PUBLISHED) {
  // ...
}

// ❌ Wrong - Hardcoded strings
if (portfolio.status === 'published') {
  // ...
}
```

### 2. JSONB Validation
```javascript
// ✅ Correct - Validate before saving
const { valid, errors } = validateJsonbField(
  'price_breakdown', 
  priceData, 
  PRICE_BREAKDOWN_SCHEMA
);
if (!valid) {
  throw new Error(`Invalid price breakdown: ${errors.join(', ')}`);
}

// ❌ Wrong - No validation
portfolio.priceBreakdown = req.body.price_breakdown;
```

### 3. ORDER BY with underscored: true
```javascript
// ✅ Correct - Use snake_case
order: [['created_at', 'DESC']]

// ❌ Wrong - Will cause error
order: [['createdAt', 'DESC']]
```

### 4. Timestamp Attributes
```javascript
// ✅ Correct - Alias snake_case to camelCase
attributes: ['id', 'title', ['created_at', 'createdAt'], ['updated_at', 'updatedAt']]

// ❌ Wrong - Sequelize can't map automatically
attributes: ['id', 'title', 'createdAt', 'updatedAt']
```

### 5. URL Getters
```javascript
// ✅ Correct - Include storage_type for getter to work
attributes: ['id', 'coverImage', 'coverImageStorageType']

// ❌ Wrong - Getter won't work without storage_type
attributes: ['id', 'coverImage']
```

### 6. Audit Fields
```javascript
// ✅ Correct - Pass userId in options
await Portfolio.create(data, { userId: req.user.userId });
await portfolio.update(data, { userId: req.user.userId });
await portfolio.destroy({ userId: req.user.userId });

// ❌ Wrong - No userId, audit fields won't populate
await Portfolio.create(data);
```

---

## 🎯 Status Workflow

### Portfolio Status Flow
```
draft → pending → published
                ↓
              rejected → draft (edit and resubmit)
```

### Status Transitions
```javascript
// Vendor creates draft
portfolio.status = PORTFOLIO_STATUS.DRAFT;

// Vendor submits for approval
portfolio.status = PORTFOLIO_STATUS.PENDING;

// Admin approves
portfolio.status = PORTFOLIO_STATUS.PUBLISHED;
portfolio.approvedAt = new Date();
portfolio.approvedBy = adminUserId;
portfolio.publishedAt = new Date();

// Admin rejects
portfolio.status = PORTFOLIO_STATUS.REJECTED;
portfolio.rejectedAt = new Date();
portfolio.rejectedBy = adminUserId;
portfolio.rejectionReason = 'Reason for rejection';

// Vendor edits rejected portfolio
portfolio.status = PORTFOLIO_STATUS.DRAFT;
portfolio.rejectionReason = null;
```

---

## 📈 Performance Tips

### 1. Use Indexes
```javascript
// Indexed queries (fast)
where: { userId: 123 }
where: { categorySlug: 'photography' }
where: { status: PORTFOLIO_STATUS.PUBLISHED }
where: { stateId: 1, cityId: 1 }

// Non-indexed queries (slower)
where: { description: { [Op.like]: '%wedding%' } }
```

### 2. Limit Associations
```javascript
// ✅ Good - Only include what you need
include: [
  { model: models.User, as: 'user', attributes: ['id', 'fullName'] }
]

// ❌ Bad - Includes all columns
include: [
  { model: models.User, as: 'user' }
]
```

### 3. Pagination
```javascript
// ✅ Always paginate large result sets
const { count, rows } = await Portfolio.findAndCountAll({
  where: { status: PORTFOLIO_STATUS.PUBLISHED },
  limit: 20,
  offset: (page - 1) * 20,
  order: [['created_at', 'DESC']]
});
```

---

## 🚨 Common Pitfalls

### 1. Forgetting Storage Type
```javascript
// ❌ Wrong - Getter won't work
const portfolio = await Portfolio.findByPk(id, {
  attributes: ['id', 'coverImage']
});
// portfolio.coverImage returns relative path

// ✅ Correct - Include storage_type
const portfolio = await Portfolio.findByPk(id, {
  attributes: ['id', 'coverImage', 'coverImageStorageType']
});
// portfolio.coverImage returns full URL
```

### 2. Not Validating JSONB
```javascript
// ❌ Wrong - No validation
portfolio.financialTerms = req.body.financial_terms;

// ✅ Correct - Validate first
const { valid, errors } = validateJsonbField(
  'financial_terms', 
  req.body.financial_terms, 
  FINANCIAL_TERMS_SCHEMA
);
if (!valid) {
  throw new Error(`Invalid financial terms: ${errors.join(', ')}`);
}
portfolio.financialTerms = req.body.financial_terms;
```

### 3. Hardcoding Enum Values
```javascript
// ❌ Wrong - Typo will cause bugs
if (portfolio.status === 'publised') {  // Typo!
  // ...
}

// ✅ Correct - Type-safe
if (portfolio.status === PORTFOLIO_STATUS.PUBLISHED) {
  // ...
}
```

---

## 📚 Additional Resources

- `BUSINESS-PROFILE-PORTFOLIO-REVIEW.md` - Comprehensive module review
- `PORTFOLIO-MODULE-SUMMARY.md` - Implementation summary
- `APPLY-BUSINESS-PORTFOLIO-SCHEMA.sql` - SQL migration script
- `.kiro/steering/structure.md` - Project structure guidelines
- `.kiro/steering/model-management.md` - Model patterns

---

## ✅ Checklist for New Developers

- [ ] Read `PORTFOLIO-MODULE-SUMMARY.md`
- [ ] Review `BUSINESS-PROFILE-PORTFOLIO-REVIEW.md`
- [ ] Run database migrations
- [ ] Import enum constants in your service
- [ ] Import JSONB schemas for validation
- [ ] Use model getters for URL transformation
- [ ] Pass userId in options for audit trail
- [ ] Use snake_case in ORDER BY clauses
- [ ] Validate JSONB fields before saving
- [ ] Test with sample data

**Happy coding! 🚀**
